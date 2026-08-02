import { hasUnsafeSpeakChars, stripDecorations, toSpeakText } from './speakText'

function delay(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms))
}

type SpeakOptions = {
  lang?: string
  rate?: number
  pitch?: number
  /** 为 true 时失败不弹 toast（用于自动播报，避免误报） */
  silent?: boolean
}

const CACHE_NAME = 'kidlearn-tts-v1'
let preferredVoice: SpeechSynthesisVoice | null = null
let unlocked = false
let resumeTimer: ReturnType<typeof setInterval> | null = null
let lastTipAt = 0
let audioEl: HTMLAudioElement | null = null
/** 当前在线发音元素（每次播放新建，便于 stopSpeak 停止） */
let netEl: HTMLAudioElement | null = null
/** 递增以作废进行中的播报，避免 cancel/连点被当成失败 */
let speakEpoch = 0
/** Android Chrome/WebView：cancel() 后立刻 speak 常被静默忽略，需拉开间隔 */
let lastCancelAt = 0
/** 本会话曾成功出声 → 说明引擎可用，失败勿再误报「请安装」 */
let everSpokeOk = false
/** 在线发音连续失败 → 判定网络不可用，安卓下暂停「网络优先」 */
let netTtsDown = false
let netFailStreak = 0
/** 共享 Audio 元素是否已在用户手势内解锁（iOS/部分安卓浏览器自动播放策略） */
let audioUnlockOk = false
/** 极短静音 WAV，用于手势内解锁音频元素 */
const SILENT_WAV =
  'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAIlYAAESsAAACABAAZGF0YQAAAAA='

function isAndroid(): boolean {
  // #ifdef H5
  return typeof navigator !== 'undefined' && /Android/i.test(navigator.userAgent)
  // #endif
  // #ifndef H5
  return false
  // #endif
}

/** 微信内置浏览器（X5/XWeb）：Audio 必须经 WeixinJSBridge 解锁，否则 play 必失败 */
function isWeChat(): boolean {
  // #ifdef H5
  return typeof navigator !== 'undefined' && /MicroMessenger/i.test(navigator.userAgent)
  // #endif
  // #ifndef H5
  return false
  // #endif
}

type WeixinBridge = {
  invoke: (api: string, params: Record<string, unknown>, cb?: () => void) => void
}

function getWeixinBridge(): WeixinBridge | null {
  // #ifdef H5
  const w = window as Window & { WeixinJSBridge?: WeixinBridge }
  return w.WeixinJSBridge || null
  // #endif
  // #ifndef H5
  return null
  // #endif
}

/** 等微信 JSBridge 就绪（页面刚打开时可能尚未注入） */
function whenWeixinReady(): Promise<WeixinBridge | null> {
  // #ifdef H5
  if (!isWeChat()) return Promise.resolve(null)
  const ready = getWeixinBridge()
  if (ready) return Promise.resolve(ready)
  return new Promise((resolve) => {
    const done = () => resolve(getWeixinBridge())
    document.addEventListener('WeixinJSBridgeReady', done, { once: true })
    setTimeout(done, 1200)
  })
  // #endif
  // #ifndef H5
  return Promise.resolve(null)
  // #endif
}

/**
 * 微信：必须在 invoke 回调里执行 play。
 * 旧写法「等回调结束再 play」在手机微信上会导致全部 Audio 失败（含两字短词）。
 */
async function withWeChatAudioGate<T>(fn: () => Promise<T>): Promise<T> {
  // #ifdef H5
  if (!isWeChat()) return fn()
  const bridge = await whenWeixinReady()
  if (!bridge) return fn()
  return new Promise<T>((resolve, reject) => {
    let settled = false
    const run = () => {
      if (settled) return
      settled = true
      Promise.resolve()
        .then(() => fn())
        .then(resolve, reject)
    }
    try {
      bridge.invoke('getNetworkType', {}, run)
    } catch {
      run()
    }
    setTimeout(run, 800)
  })
  // #endif
  // #ifndef H5
  return fn()
  // #endif
}

/** cancel → speak 最小间隔（ms）；安卓需更长 */
function postCancelGapMs(): number {
  return isAndroid() ? 180 : 120
}

function noteCancel(): void {
  lastCancelAt = Date.now()
}

function msUntilAfterCancel(): number {
  if (!lastCancelAt) return 0
  return Math.max(0, postCancelGapMs() - (Date.now() - lastCancelAt))
}

function cancelSpeechSynthesis(): void {
  // #ifdef H5
  try {
    if (canSpeak()) {
      window.speechSynthesis.cancel()
      noteCancel()
    }
  } catch {
    /* ignore */
  }
  // #endif
}

function ensureVoices(): void {
  // #ifdef H5
  if (typeof window === 'undefined' || !window.speechSynthesis) return
  const load = () => {
    const voices = window.speechSynthesis.getVoices()
    if (!voices.length) return
    preferredVoice =
      voices.find((v) => v.lang.toLowerCase().startsWith('zh') && v.localService) ||
      voices.find((v) => v.lang.toLowerCase().startsWith('zh')) ||
      voices.find((v) => /chinese|中文|普通话|国语|xiaomi|miui|google/i.test(v.name)) ||
      voices[0] ||
      null
  }
  load()
  window.speechSynthesis.addEventListener?.('voiceschanged', load)
  window.speechSynthesis.onvoiceschanged = load
  // Chrome 安卓已知 bug：播到一半被 pause，需周期性 resume
  if (!resumeTimer) {
    resumeTimer = setInterval(() => {
      try {
        if (window.speechSynthesis?.speaking) window.speechSynthesis.resume()
      } catch {
        /* ignore */
      }
    }, 4000)
  }
  // #endif
}

ensureVoices()

export function canSpeak(): boolean {
  // #ifdef H5
  return typeof window !== 'undefined' && !!window.speechSynthesis
  // #endif
  // #ifndef H5
  return false
  // #endif
}

/**
 * 手势内播放极短静音，解锁共享 Audio。
 * 微信：必须经 WeixinJSBridge，且不要 muted（muted 解锁在微信上常无效）。
 */
async function ensureAudioUnlocked(): Promise<void> {
  // #ifdef H5
  if (audioUnlockOk) return
  try {
    await withWeChatAudioGate(async () => {
      if (!audioEl) {
        audioEl = new Audio()
        audioEl.preload = 'auto'
      }
      const el = audioEl
      el.src = SILENT_WAV
      // 微信上 muted 解锁无效；其它浏览器可 mute 避免听感噪音
      el.muted = !isWeChat()
      el.volume = isWeChat() ? 0.01 : 1
      try {
        await el.play()
        audioUnlockOk = true
      } catch {
        /* ignore */
      }
      try {
        el.pause()
        el.currentTime = 0
      } catch {
        /* ignore */
      }
      el.muted = false
      el.volume = 1
    })
  } catch {
    /* ignore */
  }
  // #endif
}

/** 用户手势内调用：解锁播报能力（安卓不要 speak 空字符串） */
export function unlockSpeak(): void {
  // #ifdef H5
  void ensureAudioUnlocked()
  if (unlocked) return
  unlocked = true
  // 微信内系统语音几乎不可用，不必空耗暖机
  if (isWeChat() || !canSpeak()) return
  try {
    window.speechSynthesis.getVoices()
    if (!isAndroid()) {
      const warm = new SpeechSynthesisUtterance(' ')
      warm.volume = 0
      warm.rate = 2
      window.speechSynthesis.speak(warm)
    } else if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume()
    }
  } catch {
    /* ignore */
  }
  // #endif
}

function tipOnce(msg: string) {
  const now = Date.now()
  if (now - lastTipAt < 6000) return
  lastTipAt = now
  try {
    uni.showToast({ title: msg, icon: 'none', duration: 2800 })
  } catch {
    /* ignore */
  }
}

function listVoices(): SpeechSynthesisVoice[] {
  // #ifdef H5
  if (!canSpeak()) return []
  try {
    return window.speechSynthesis.getVoices() || []
  } catch {
    return []
  }
  // #endif
  // #ifndef H5
  return []
  // #endif
}

/** true=有中文 voice；false=已加载列表但没有；null=列表未就绪（不据此断定没装引擎） */
function hasChineseVoice(): boolean | null {
  const voices = listVoices()
  if (!voices.length) return null
  const hit = voices.some(
    (v) =>
      v.lang.toLowerCase().startsWith('zh') ||
      /chinese|中文|普通话|国语|xiaomi|miui/i.test(v.name)
  )
  return hit
}

/**
 * 失败提示：微信优先引导「用浏览器打开」；
 * 其它安卓才提示联网；桌面/iOS 区分偶发失败。
 */
function failureTip(_lang: string): string {
  if (isWeChat() && isAndroid()) {
    return '刚才没播出来，请再点一次；仍不行可改用浏览器打开'
  }
  if (isAndroid()) {
    return '刚才没播出来，请确认已联网后重试'
  }
  return '刚才没播出来，点再听一遍试试'
}

function markSpokeOk(epoch: number): void {
  if (epoch === speakEpoch) everSpokeOk = true
}

function resolveLang(text: string, options: SpeakOptions): string {
  if (options.lang) return options.lang
  // 含中文，或数字/算式（无拉丁长词）→ 中文引擎
  if (/[\u4e00-\u9fff]/.test(text)) return 'zh-CN'
  if (/[+\-−–×÷=＝?？]/.test(text) || /^\d+(\s|$)/.test(text)) return 'zh-CN'
  if (/[a-zA-Z]/.test(text)) return 'en-US'
  return 'zh-CN'
}

function prepareText(text: string, lang: string): string {
  const trimmed = text.trim()
  if (!trimmed) return ''
  // 中文：算式规范化 + 去 emoji；英文：只去 emoji
  // 绝不要回退到带 emoji 的原文（引擎会直接失败）
  if (lang.toLowerCase().startsWith('zh')) {
    return toSpeakText(trimmed)
  }
  return stripDecorations(trimmed)
}

function isInterruptError(err: unknown): boolean {
  const code = typeof err === 'string' ? err : (err as { error?: string })?.error
  return code === 'interrupted' || code === 'canceled' || code === 'cancelled'
}

function speakWeb(text: string, options: SpeakOptions, waitEnd = false, epoch = 0): Promise<boolean> {
  // #ifdef H5
  return new Promise((resolve) => {
    if (!canSpeak()) {
      resolve(false)
      return
    }
    if (epoch && epoch !== speakEpoch) {
      resolve(true)
      return
    }
    // emoji 残留直接视为不可播，避免引擎报错
    if (!text || hasUnsafeSpeakChars(text)) {
      resolve(false)
      return
    }

    const start = () => {
      try {
        if (epoch && epoch !== speakEpoch) {
          resolve(true)
          return
        }
        if (isAndroid() && window.speechSynthesis.paused) {
          window.speechSynthesis.resume()
        }

        const u = new SpeechSynthesisUtterance(text)
        u.lang = options.lang || resolveLang(text, options)
        u.rate = options.rate ?? 0.92
        u.pitch = options.pitch ?? 1
        u.volume = 1

        // 安卓/小米：强制指定 voice 经常导致完全无声，只设 lang
        if (!isAndroid()) {
          const voices = window.speechSynthesis.getVoices()
          const prefix = u.lang.slice(0, 2).toLowerCase()
          const voice =
            voices.find((v) => v.lang.toLowerCase().startsWith(prefix) && v.localService) ||
            voices.find((v) => v.lang.toLowerCase().startsWith(prefix)) ||
            preferredVoice
          if (voice && voice.lang.toLowerCase().startsWith(prefix)) u.voice = voice
        }

        let settled = false
        const done = (ok: boolean) => {
          if (settled) return
          settled = true
          resolve(ok)
        }
        const stale = () => epoch !== 0 && epoch !== speakEpoch

        if (waitEnd) {
          u.onend = () => done(true)
          u.onerror = (e) => {
            if (stale() || isInterruptError(e)) done(true)
            else done(false)
          }
          setTimeout(() => done(true), Math.min(12000, 800 + text.length * 220))
        } else {
          let heardStart = false
          u.onstart = () => {
            heardStart = true
            done(true)
          }
          u.onend = () => done(true)
          u.onerror = (e) => {
            if (stale() || isInterruptError(e)) done(true)
            else done(false)
          }
          // speak 后引擎毫无动静（未开始且队列空）→ 被静默吞掉，快速失败走重试
          setTimeout(() => {
            if (settled || heardStart) return
            try {
              if (!window.speechSynthesis.speaking && !window.speechSynthesis.pending) done(false)
            } catch {
              /* ignore */
            }
          }, isAndroid() ? 450 : 300)
          // 只有 onstart/onend 才算真出声；
          // speaking/pending 可能是卡死的旧播报（安卓常见），不能当成功，否则全程静默无提示
          setTimeout(() => {
            if (!settled) {
              if (stale()) {
                done(true)
                return
              }
              done(false)
            }
          }, isAndroid() ? 2400 : 1500)
        }

        window.speechSynthesis.speak(u)
        // Chrome 偶发 speak 后立即 pause
        if (isAndroid()) {
          setTimeout(() => {
            try {
              if (window.speechSynthesis.paused) window.speechSynthesis.resume()
            } catch {
              /* ignore */
            }
          }, 60)
        }
      } catch {
        resolve(false)
      }
    }

    // 打断旧队列；无论 speaking/pending 是否仍为 true（外部可能已 cancel），
    // 距上次 cancel 不足间隔时都必须延迟再 speak，否则安卓会静默忽略
    try {
      if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
        cancelSpeechSynthesis()
      }
    } catch {
      /* ignore */
    }
    const wait = msUntilAfterCancel()
    if (wait > 0) setTimeout(start, wait)
    else start()
  })
  // #endif
  // #ifndef H5
  return Promise.resolve(false)
  // #endif
}

/** 线上 CloudBase 代理；本地/局域网走同源 /api/tts（Vite 中间件拉百度） */
const CLOUD_TTS_BASE =
  'https://wechat-game-dev-d8f0dto7d9f6f9bd.service.tcloudbase.com/kidlearnTts'

function isLanOrLocalHost(): boolean {
  // #ifdef H5
  if (typeof location === 'undefined') return false
  const host = location.hostname
  return (
    host === 'localhost' ||
    host === '127.0.0.1' ||
    /^192\.168\./.test(host) ||
    /^10\./.test(host) ||
    /^172\.(1[6-9]|2\d|3[01])\./.test(host)
  )
  // #endif
  // #ifndef H5
  return false
  // #endif
}

/** 自建代理地址：服务器拉百度整句 MP3（勿直链百度，微信会拦） */
function proxyTtsUrl(text: string, lang: string): string {
  const q = encodeURIComponent(text.slice(0, 60))
  const lan = lang.toLowerCase().startsWith('en') ? 'en' : 'zh'
  const qs = `text=${q}&lang=${lan}`
  if (isLanOrLocalHost()) return `/api/tts?${qs}`
  return `${CLOUD_TTS_BASE}?${qs}`
}

/** 百度直链：仅非微信备用 */
function baiduTtsUrl(text: string, lang: string): string {
  const q = encodeURIComponent(text.slice(0, 60))
  const lan = lang.toLowerCase().startsWith('en') ? 'en' : 'zh'
  return `https://fanyi.baidu.com/gettts?lan=${lan}&text=${q}&spd=3&source=web`
}

/**
 * 从自建代理下载 MP3 → Cache API 本地缓存 → 返回 blob: URL。
 * 再次播放同一句直接读缓存，不打百度。
 */
async function loadProxyTtsObjectUrl(text: string, lang: string): Promise<string | null> {
  // #ifdef H5
  const url = proxyTtsUrl(text, lang)
  try {
    let body: ArrayBuffer | null = null
    if (typeof caches !== 'undefined') {
      const cache = await caches.open(CACHE_NAME)
      const hit = await cache.match(url)
      if (hit) {
        body = await hit.arrayBuffer()
      } else {
        const res = await fetch(url, { credentials: 'omit' })
        if (!res.ok) return null
        body = await res.arrayBuffer()
        if (!body || body.byteLength < 200) return null
        // 拒绝 JSON 错误体
        const head = String.fromCharCode(...new Uint8Array(body.slice(0, 1)))
        if (head === '{' || head === '[') return null
        await cache.put(
          url,
          new Response(body.slice(0), {
            status: 200,
            headers: {
              'Content-Type': 'audio/mpeg',
              'Cache-Control': 'public, max-age=2592000',
            },
          })
        )
      }
    } else {
      const res = await fetch(url, { credentials: 'omit' })
      if (!res.ok) return null
      body = await res.arrayBuffer()
    }
    if (!body || body.byteLength < 200) return null
    return URL.createObjectURL(new Blob([body], { type: 'audio/mpeg' }))
  } catch (e) {
    console.warn('[tts] proxy download failed', e)
    return null
  }
  // #endif
  // #ifndef H5
  return null
  // #endif
}

/** 有道词条发音（非整句 TTS；未收录词条返回 500） */
function youdaoUrl(text: string, lang: string): string {
  const q = encodeURIComponent(text.slice(0, 40))
  if (lang.toLowerCase().startsWith('en')) {
    return `https://dict.youdao.com/dictvoice?audio=${q}&type=2`
  }
  return `https://dict.youdao.com/dictvoice?audio=${q}&le=zh`
}

/** 有道词条是否收录（会话缓存，避免重复空探测） */
const youdaoHitCache = new Map<string, boolean>()

/** 仅加载探测，不 play，避免把失败探测播进句子里造成顿挫 */
function probeYoudao(piece: string, lang: string): Promise<boolean> {
  const key = `${lang}|${piece}`
  const cached = youdaoHitCache.get(key)
  if (cached !== undefined) return Promise.resolve(cached)
  return new Promise((resolve) => {
    const el = new Audio()
    el.preload = 'auto'
    let done = false
    const finish = (ok: boolean) => {
      if (done) return
      done = true
      youdaoHitCache.set(key, ok)
      try {
        el.removeAttribute('src')
        el.load()
      } catch {
        /* ignore */
      }
      resolve(ok)
    }
    el.addEventListener('error', () => finish(false), { once: true })
    const onReady = () => {
      if (Number.isFinite(el.duration) && el.duration > 0.05) finish(true)
    }
    el.addEventListener('loadeddata', onReady)
    el.addEventListener('canplaythrough', onReady, { once: true })
    setTimeout(() => finish(Number.isFinite(el.duration) && el.duration > 0.05), 900)
    el.src = youdaoUrl(piece, lang)
  })
}

async function planYoudaoPieces(text: string, lang: string, epoch: number): Promise<string[] | null> {
  const parts = text.split(/([，。！？；、,.!?;:\s]+)/).filter((s) => s.length > 0)
  const pieces: string[] = []
  for (const part of parts) {
    if (epoch && epoch !== speakEpoch) return pieces
    if (/^[，。！？；、,.!?;:\s]+$/.test(part)) {
      pieces.push('') // 空串 = 极短气口
      continue
    }
    if (/[\u4e00-\u9fff]/.test(part)) {
      const zh = part.replace(/\s+/g, '')
      let i = 0
      while (i < zh.length) {
        if (epoch && epoch !== speakEpoch) return pieces
        let hit: string | null = null
        const remain = zh.length - i
        for (const len of [2, 3, 1, 4, 5].filter((n) => n <= remain)) {
          const piece = zh.slice(i, i + len)
          if (await probeYoudao(piece, lang)) {
            hit = piece
            break
          }
        }
        if (!hit) return null
        pieces.push(hit)
        i += hit.length
      }
    } else {
      for (const w of part.split(/\s+/).filter(Boolean)) {
        if (!(await probeYoudao(w, lang))) return null
        pieces.push(w)
      }
    }
  }
  return pieces.length ? pieces : null
}

/**
 * 手机微信：百度直链会被拦截；有道仅词条。
 * 先静默规划词条，再同一 Bridge 解锁内双缓冲连播，减少词间顿挫。
 */
async function playYoudaoWeChat(text: string, lang: string, epoch: number): Promise<boolean> {
  const pieces = await planYoudaoPieces(text, lang, epoch)
  if (!pieces || !pieces.length) return false
  if (epoch && epoch !== speakEpoch) return true

  const urls = pieces.map((p) => (p ? youdaoUrl(p, lang) : ''))

  const runChain = (): Promise<boolean> =>
    new Promise((resolve) => {
      const a = new Audio()
      const b = new Audio()
      a.preload = 'auto'
      b.preload = 'auto'
      a.volume = 1
      b.volume = 1
      let cur = a
      let nxt = b
      let nxtReadyAt = -1
      let settled = false
      audioEl = cur

      const finish = (ok: boolean) => {
        if (settled) return
        settled = true
        resolve(ok)
      }

      const playAt = (index: number) => {
        if (settled) return
        if (epoch && epoch !== speakEpoch) {
          finish(true)
          return
        }
        if (index >= urls.length) {
          finish(true)
          return
        }
        const url = urls[index]
        if (!url) {
          setTimeout(() => playAt(index + 1), 50)
          return
        }

        let cleaned = false
        const cleanup = () => {
          if (cleaned) return
          cleaned = true
          cur.removeEventListener('ended', onEnd)
          cur.removeEventListener('error', onErr)
          clearTimeout(watchdog)
        }
        const onEnd = () => {
          cleanup()
          const t = cur
          cur = nxt
          nxt = t
          audioEl = cur
          playAt(index + 1)
        }
        const onErr = () => {
          cleanup()
          finish(false)
        }

        // 已预载到当前缓冲则勿重设 src（重设会重载、加大缝隙）
        if (nxtReadyAt !== index) {
          cur.src = url
        }
        nxtReadyAt = -1

        let look = index + 1
        while (look < urls.length && !urls[look]) look++
        if (look < urls.length) {
          try {
            nxt.src = urls[look]
            nxt.load()
            nxtReadyAt = look
          } catch {
            nxtReadyAt = -1
          }
        }

        const watchdog = setTimeout(() => {
          if (cur.ended || cur.currentTime > 0.05) onEnd()
          else onErr()
        }, 10000)

        cur.addEventListener('ended', onEnd)
        cur.addEventListener('error', onErr)
        const p = cur.play()
        if (p && typeof p.then === 'function') {
          p.then(() => {
            audioUnlockOk = true
            const word = pieces[index]
            if (word) youdaoHitCache.set(`${lang}|${word}`, true)
          }).catch(() => onErr())
        }
      }

      playAt(0)
    })

  return withWeChatAudioGate(runChain)
}

async function playUrlAudio(url: string, waitEnd = false, epoch = 0): Promise<boolean> {
  // #ifdef H5
  try {
    if (epoch && epoch !== speakEpoch) return true

    const doPlay = (): Promise<boolean> =>
      new Promise((resolve) => {
        if (epoch && epoch !== speakEpoch) {
          resolve(true)
          return
        }
        // 手机微信：在 Bridge 回调里新建 Audio 并立刻 play
        try {
          audioEl?.pause()
        } catch {
          /* ignore */
        }
        if (!isWeChat() && netEl) {
          try {
            netEl.pause()
          } catch {
            /* ignore */
          }
        }
        const el = new Audio()
        if (isWeChat()) audioEl = el
        else netEl = el
        el.preload = 'auto'
        el.muted = false
        el.volume = 1
        el.src = url

        let done = false
        const finish = (ok: boolean) => {
          if (done) return
          done = true
          el.removeEventListener('error', onErr)
          el.removeEventListener('playing', onOk)
          el.removeEventListener('ended', onOk)
          clearTimeout(timer)
          resolve(ok)
        }
        const onErr = () => finish(false)
        const onOk = () => finish(true)
        el.addEventListener('error', onErr)
        el.addEventListener('playing', onOk)
        el.addEventListener('ended', onOk)
        // 有道未收录会很快 error；勿用 readyState 判成功（易假成功）
        const timer = setTimeout(() => finish(el.currentTime > 0.01 || (!el.paused && el.duration > 0)), 2200)
        const p = el.play()
        if (p && typeof p.then === 'function') {
          p.then(() => {
            setTimeout(() => {
              if (el.currentTime > 0.01 || (!el.paused && el.duration > 0)) finish(true)
            }, 200)
          }).catch(() => finish(false))
        }
      })

    const started = isWeChat() ? await withWeChatAudioGate(doPlay) : await doPlay()
    if (!started) return false
    if (epoch && epoch !== speakEpoch) return true
    if (!waitEnd) return true

    const el = (isWeChat() ? audioEl : netEl) as HTMLAudioElement | null
    if (!el) return true
    await new Promise<void>((resolve) => {
      let done = false
      const finish = () => {
        if (done) return
        done = true
        el.removeEventListener('ended', finish)
        el.removeEventListener('error', finish)
        clearTimeout(timer)
        resolve()
      }
      el.addEventListener('ended', finish)
      el.addEventListener('error', finish)
      const timer = setTimeout(finish, 12000)
    })
    return true
  } catch (e) {
    console.warn('audio tts failed', e)
    return false
  }
  // #endif
  // #ifndef H5
  return false
  // #endif
}

async function speakFallback(
  text: string,
  options: SpeakOptions,
  waitEnd = false,
  epoch = 0
): Promise<boolean> {
  // 过长截断保护；仍含 emoji 必失败
  if (text.length > 60 || hasUnsafeSpeakChars(text)) return false
  const lang = resolveLang(text, options)

  // Chrome / 夸克等：百度直链可播长句，无需占代理流量
  if (!isWeChat()) {
    return playUrlAudio(baiduTtsUrl(text, lang), waitEnd, epoch)
  }

  // 微信：直链被拦 → 自建代理下载整句 → Cache API 本地缓存 → blob 播放
  const objectUrl = await loadProxyTtsObjectUrl(text, lang)
  if (!objectUrl) return false
  // blob 不可在 play 刚开始就 revoke，否则会中途无声；等播完再释放
  const ok = await playUrlAudio(objectUrl, true, epoch)
  try {
    URL.revokeObjectURL(objectUrl)
  } catch {
    /* ignore */
  }
  return ok
}

/**
 * 策略（实测教训：安卓各浏览器 Web Speech 差异极大，微信/夸克/小米 WebView
 * 常常整体无声，继续适配是死路）：
 * - 安卓：在线发音（百度翻译 TTS）优先，系统语音仅作备份；网络连续失败才退回本地优先
 * - 桌面 / iOS：系统语音优先（稳定且离线可用），失败再在线兜底
 */
async function speakOnce(text: string, options: SpeakOptions, waitEnd: boolean): Promise<boolean> {
  const epoch = ++speakEpoch
  const lang = resolveLang(text, options)
  const say = prepareText(text, lang)
  // 清完没有可读文字（纯 emoji）→ 当作成功跳过，绝不报错
  if (!say) return true

  const opts = { ...options, lang }

  // 在线尝试：成功则记网络健康；用户主动发音失败才记一笔（自动播报无手势易被拦，不算数）
  const tryNet = async (): Promise<boolean> => {
    if (say.length > 60) return false
    const ok = await speakFallback(say, opts, waitEnd, epoch)
    if (ok) {
      netFailStreak = 0
      netTtsDown = false
    } else if (!options.silent) {
      netFailStreak++
      if (netFailStreak >= 2) netTtsDown = true
    }
    return ok
  }

  if (isAndroid()) {
    // 手机微信：代理整句+本地缓存 → 系统语音 → 有道词条（最后兜底）
    if (isWeChat()) {
      if (await tryNet()) {
        markSpokeOk(epoch)
        return true
      }
      if (epoch !== speakEpoch) return true
      if (await speakWeb(say, opts, waitEnd, epoch)) {
        markSpokeOk(epoch)
        return true
      }
      if (epoch !== speakEpoch) return true
      if (await playYoudaoWeChat(say, lang, epoch)) {
        markSpokeOk(epoch)
        return true
      }
      if (epoch === speakEpoch) console.warn('[tts] 微信发音失败:', say, getTtsDebugInfo())
      return epoch !== speakEpoch
    }

    // 网络被判定不可用时跳过首次在线尝试，直接走本地备份
    const skipNetFirst = netTtsDown
    if (!skipNetFirst && (await tryNet())) {
      markSpokeOk(epoch)
      return true
    }
    if (epoch !== speakEpoch) return true
    // 网络不可用时的备份：本地系统语音
    if (await speakWeb(say, opts, waitEnd, epoch)) {
      markSpokeOk(epoch)
      return true
    }
    if (epoch !== speakEpoch) return true
    cancelSpeechSynthesis()
    await delay(220)
    if (epoch !== speakEpoch) return true
    if (await speakWeb(say, opts, waitEnd, epoch)) {
      markSpokeOk(epoch)
      return true
    }
    if (epoch !== speakEpoch) return true
    // 开头因网络判定不可用而跳过 → 本地也失败时最后补试一次在线（可能已恢复）
    if (skipNetFirst && (await tryNet())) {
      markSpokeOk(epoch)
      return true
    }
    if (epoch === speakEpoch) console.warn('[tts] 安卓发音失败:', say, getTtsDebugInfo())
    return epoch !== speakEpoch
  }

  // 桌面 / iOS：本地引擎优先
  if (await speakWeb(say, opts, waitEnd, epoch)) {
    markSpokeOk(epoch)
    return true
  }
  if (epoch !== speakEpoch) return true
  cancelSpeechSynthesis()
  await delay(80)
  if (epoch !== speakEpoch) return true
  if (await speakWeb(say, opts, waitEnd, epoch)) {
    markSpokeOk(epoch)
    return true
  }
  if (epoch !== speakEpoch) return true
  if (await speakFallback(say, opts, waitEnd, epoch)) {
    markSpokeOk(epoch)
    return true
  }
  if (epoch === speakEpoch) console.warn('[tts] 发音失败:', say, getTtsDebugInfo())
  return epoch !== speakEpoch
}

/**
 * 对外播报：中文优先系统 Web Speech；失败再短词网络兜底。
 * 必须在用户点击/触摸回调里调用更稳；自动播报请传 silent: true。
 */
export function speak(text: string, options: SpeakOptions = {}): void {
  if (!text) return
  // #ifdef H5
  const trimmed = text.trim()
  if (!trimmed) return

  void (async () => {
    unlockSpeak()
    // 手机微信不要先 await 预解锁，避免占掉点击手势
    if (!(isWeChat() && isAndroid())) {
      await ensureAudioUnlocked()
    }
    const ok = await speakOnce(trimmed, options, false)
    if (!ok && !options.silent) {
      tipOnce(failureTip(resolveLang(trimmed, options)))
    }
  })()
  // #endif
}

/** 播完整段再 resolve，适合连续播报（挖宝反馈 → 下一条指令） */
export function speakAsync(text: string, options: SpeakOptions = {}): Promise<void> {
  if (!text) return Promise.resolve()
  // #ifdef H5
  const trimmed = text.trim()
  if (!trimmed) return Promise.resolve()
  unlockSpeak()
  const prep =
    isWeChat() && isAndroid() ? Promise.resolve() : ensureAudioUnlocked()
  return prep.then(() => speakOnce(trimmed, options, true)).then(() => undefined)
  // #endif
  // #ifndef H5
  return Promise.resolve()
  // #endif
}

export function stopSpeak(): void {
  // #ifdef H5
  speakEpoch++
  cancelSpeechSynthesis()
  try {
    audioEl?.pause()
    netEl?.pause()
  } catch {
    /* ignore */
  }
  // #endif
}

export function getTtsDebugInfo(): string {
  // #ifdef H5
  const voices = canSpeak() ? window.speechSynthesis.getVoices() : []
  const zh = voices.filter((v) => /zh|chinese|中文/i.test(v.lang + v.name))
  return [
    `speechSynthesis=${canSpeak()}`,
    `voices=${voices.length}`,
    `zhVoices=${zh.length}`,
    `android=${isAndroid()}`,
    `wechat=${isWeChat()}`,
    `audioUnlock=${audioUnlockOk}`,
    `secure=${typeof window !== 'undefined' ? window.isSecureContext : false}`,
    `ua=${typeof navigator !== 'undefined' ? navigator.userAgent.slice(0, 80) : ''}`,
  ].join(' | ')
  // #endif
  // #ifndef H5
  return 'non-h5'
  // #endif
}

// 微信：尽早挂一次触摸解锁，减少首次点卡片时序问题
// #ifdef H5
if (typeof document !== 'undefined' && typeof navigator !== 'undefined' && /MicroMessenger/i.test(navigator.userAgent)) {
  const boot = () => {
    unlockSpeak()
    document.removeEventListener('touchstart', boot)
    document.removeEventListener('click', boot)
  }
  document.addEventListener('touchstart', boot, { once: true, passive: true })
  document.addEventListener('click', boot, { once: true })
}
// #endif
