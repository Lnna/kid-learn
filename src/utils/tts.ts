import { hasUnsafeSpeakChars, stripDecorations, toSpeakText, expandEnglishLettersForTts } from './speakText'
import {
  expandPinyinForSpeech,
  isMostlyPinyinLatin,
  isPinyinLocalOnly,
  pinyinLocalAudioUrl,
} from './pinyinSpeak'

function delay(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms))
}

type SpeakOptions = {
  lang?: string
  rate?: number
  pitch?: number
  /** 为 true 时失败不弹 toast（用于自动播报，避免误报） */
  silent?: boolean
  /**
   * 英文拼读部件等：保留单字母原文，不扩成 ay/bee。
   * 字母课（A→apple）不要开这个。
   */
  keepLetterLiteral?: boolean
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
/**
 * 当前课时默认语种（由 lesson/play 按科目设置）。
 * english → 拉丁文一律英文 TTS，不做拼音展开（含小写字母/拼读部件）。
 */
let lessonSpeakLang: string | undefined
/** 极短静音 WAV，用于手势内解锁音频元素 */
const SILENT_WAV =
  'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAIlYAAESsAAACABAAZGF0YQAAAAA='

/** 进入/离开课时时调用；english 传 'en-US'，其它科目传 undefined */
export function setLessonSpeakLang(lang: string | undefined): void {
  lessonSpeakLang = lang || undefined
}

export function getLessonSpeakLang(): string | undefined {
  return lessonSpeakLang
}

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
    // 原先 1200ms 会把首次发音拖成「点了很久才响」
    setTimeout(done, 280)
  })
  // #endif
  // #ifndef H5
  return Promise.resolve(null)
  // #endif
}

/**
 * 微信：首次需在 invoke 回调里 play；解锁成功后应立刻播，否则每点一次都卡 0.5～1s。
 */
async function withWeChatAudioGate<T>(fn: () => Promise<T>): Promise<T> {
  // #ifdef H5
  if (!isWeChat()) return fn()
  // 已解锁：直接播，避免每次等 Bridge
  if (audioUnlockOk) return fn()
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
    // 兜底从 800ms 降到 120ms：Bridge 慢也不要整秒无声
    setTimeout(run, 120)
  })
  // #endif
  // #ifndef H5
  return fn()
  // #endif
}

function isLocalAudioUrl(url: string): boolean {
  if (!url) return false
  if (url.startsWith('blob:') || url.startsWith('data:')) return true
  try {
    if (url.startsWith('/') || url.startsWith('./')) return true
    if (typeof location !== 'undefined') {
      const u = new URL(url, location.href)
      return u.origin === location.origin
    }
  } catch {
    /* ignore */
  }
  return /\/audio\//.test(url)
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
    // 强制普通话：优先 zh-CN，排除粤语/香港
    preferredVoice = pickMandarinVoice(voices)
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

/** 预热声母/韵母本地 mp3，减少首次点击的缓冲等待 */
export function prefetchPinyinAudio(tokens: string[]): void {
  // #ifdef H5
  if (typeof Audio === 'undefined') return
  for (const t of tokens) {
    const url = pinyinLocalAudioUrl(t)
    if (!url) continue
    try {
      const a = new Audio()
      a.preload = 'auto'
      a.src = url
    } catch {
      /* ignore */
    }
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

/** 粤语 / 香港等，幼小衔接必须排除 */
function isCantoneseVoice(v: SpeechSynthesisVoice): boolean {
  const tag = `${v.lang} ${v.name}`.toLowerCase()
  return /yue|zh-hk|zh_hk|cantonese|粤语|廣東话|广东话|香港/.test(tag)
}

function isMandarinVoice(v: SpeechSynthesisVoice): boolean {
  if (isCantoneseVoice(v)) return false
  const lang = (v.lang || '').toLowerCase().replace(/_/g, '-')
  const name = (v.name || '').toLowerCase()
  if (lang === 'zh-cn' || lang.startsWith('zh-cn')) return true
  if (/普通话|國語|国语|mandarin|putonghua/.test(name)) return true
  // 大陆常见引擎，且非粤语
  if (/zh-cn|cmn-cn|chinese\s*\(china\)|xiaomi|miui|huawei|samsung.*zh/i.test(`${lang} ${name}`)) {
    return true
  }
  return false
}

/**
 * 中文强制优先 zh-CN 普通话；绝不选粤语/香港语音。
 */
function pickMandarinVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  if (!voices.length) return null
  const mandarin = voices.filter(isMandarinVoice)
  return (
    mandarin.find((v) => v.localService && v.lang.toLowerCase().replace(/_/g, '-').startsWith('zh-cn')) ||
    mandarin.find((v) => v.lang.toLowerCase().replace(/_/g, '-').startsWith('zh-cn')) ||
    mandarin.find((v) => v.localService) ||
    mandarin[0] ||
    null
  )
}

/** 中文语种码统一成 zh-CN（避免 zh-HK 等触发粤语） */
function normalizeZhLang(lang: string): string {
  const l = (lang || '').toLowerCase().replace(/_/g, '-')
  if (l.startsWith('en')) return lang
  if (l.startsWith('zh') || l.startsWith('cmn') || l.startsWith('yue')) return 'zh-CN'
  return lang
}

/** true=有中文 voice；false=已加载列表但没有；null=列表未就绪（不据此断定没装引擎） */
function hasChineseVoice(): boolean | null {
  const voices = listVoices()
  if (!voices.length) return null
  const hit = voices.some((v) => isMandarinVoice(v) || (!isCantoneseVoice(v) && /zh|chinese|中文/i.test(v.lang + v.name)))
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
  if (options.lang) return normalizeZhLang(options.lang)
  // 含中文，或数字/算式（无拉丁长词）→ 中文引擎
  if (/[\u4e00-\u9fff]/.test(text)) return 'zh-CN'
  if (/[+\-−–×÷=＝?？]/.test(text) || /^\d+(\s|$)/.test(text)) return 'zh-CN'
  // 英文课程：凡拉丁文一律英文（含小写 a/b/c、拼读部件），绝不走拼音
  if (lessonSpeakLang?.toLowerCase().startsWith('en') && /[a-zA-Z]/.test(text)) {
    return 'en-US'
  }
  // 大写英文字母（单个或空格分隔，如 A / A B C）→ 英文；语文拼音一律小写
  if (/^[A-Z](?:\s+[A-Z])*$/.test(text.trim())) return 'en-US'
  // 仅非英文课：声母/韵母/音节（zh、an、mā）→ 中文拼音 TTS / 本地预录
  if (isMostlyPinyinLatin(text)) return 'zh-CN'
  if (/[a-zA-Z]/.test(text)) return 'en-US'
  return 'zh-CN'
}

function prepareText(text: string, lang: string, options: SpeakOptions = {}): string {
  const trimmed = text.trim()
  if (!trimmed) return ''
  // 英文：绝不按拼音展开（否则 A→阿、b→波、pen→盆）
  if (lang.toLowerCase().startsWith('en')) {
    const cleaned = stripDecorations(trimmed)
    // 字母名扩成 ay/bee，与 apple 等同路 TTS，避免单字母怪腔/旧式拼读音
    if (options.keepLetterLiteral) return cleaned
    return expandEnglishLettersForTts(cleaned)
  }
  // 拼音 → 呼读/一声汉字（b→波，e→婀）
  const expanded = expandPinyinForSpeech(trimmed)
  if (lang.toLowerCase().startsWith('zh') || isMostlyPinyinLatin(trimmed)) {
    return toSpeakText(expanded)
  }
  return stripDecorations(expanded === trimmed ? trimmed : expanded)
}

function waitEndTimeoutMs(text: string, rate?: number): number {
  const r = rate && rate > 0 ? rate : 0.92
  return Math.min(12000, Math.max(2800, (900 + text.length * 320) / r))
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
        // 中文一律 zh-CN，避免系统按 zh-HK 等选成粤语
        u.lang = normalizeZhLang(options.lang || resolveLang(text, options))
        u.rate = options.rate ?? 0.92
        u.pitch = options.pitch ?? 1
        u.volume = 1

        const voices = window.speechSynthesis.getVoices()
        if (u.lang.toLowerCase().startsWith('zh')) {
          const mandarin = pickMandarinVoice(voices) || preferredVoice
          // 桌面/iOS：指定普通话 voice；安卓仅在找到明确 zh-CN 时指定（乱指定易无声）
          if (mandarin) {
            if (!isAndroid() || mandarin.lang.toLowerCase().replace(/_/g, '-').startsWith('zh-cn')) {
              u.voice = mandarin
              u.lang = 'zh-CN'
            }
          }
        } else if (!isAndroid()) {
          const prefix = u.lang.slice(0, 2).toLowerCase()
          const voice =
            voices.find((v) => v.lang.toLowerCase().startsWith(prefix) && v.localService) ||
            voices.find((v) => v.lang.toLowerCase().startsWith(prefix))
          if (voice) u.voice = voice
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
          setTimeout(() => done(true), waitEndTimeoutMs(text, options.rate))
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

/**
 * 微信同源 TTS：本地 = Vite 中间件 /api/tts；线上 = Nginx 代理 /api/tts。
 * 路径统一，勿再走 CloudBase / 百度直链（微信会拦百度域）。
 */
function ttsSpd(rate?: number): number {
  // 拼音四声操练用更慢语速
  if (rate != null && rate < 0.75) return 1
  return 3
}

function proxyTtsUrl(text: string, lang: string, spd = 3): string {
  const q = encodeURIComponent(text.slice(0, 60))
  const lan = lang.toLowerCase().startsWith('en') ? 'en' : 'zh'
  return `/api/tts?text=${q}&lang=${lan}&spd=${spd}`
}

/** 百度直链：仅非微信且代理失败时的最后备用（无法可靠 fetch 缓存） */
function baiduTtsUrl(text: string, lang: string, spd = 3): string {
  const q = encodeURIComponent(text.slice(0, 60))
  const lan = lang.toLowerCase().startsWith('en') ? 'en' : 'zh'
  return `https://fanyi.baidu.com/gettts?lan=${lan}&text=${q}&spd=${spd}&source=web`
}

/** 内存中的 blob: URL，同一句再次点击可立刻播 */
const ttsMemCache = new Map<string, string>()
/** 同一 key 并发只打一次网络 */
const ttsInflight = new Map<string, Promise<string | null>>()
const TTS_MEM_MAX = 100

function ttsCacheKey(text: string, lang: string, spd: number): string {
  return `${lang}|${spd}|${text.slice(0, 60)}`
}

function rememberTtsObjectUrl(key: string, objectUrl: string): string {
  if (ttsMemCache.has(key)) {
    const prev = ttsMemCache.get(key)!
    if (prev !== objectUrl) {
      try {
        URL.revokeObjectURL(objectUrl)
      } catch {
        /* ignore */
      }
      return prev
    }
    return objectUrl
  }
  ttsMemCache.set(key, objectUrl)
  while (ttsMemCache.size > TTS_MEM_MAX) {
    const oldest = ttsMemCache.keys().next().value as string | undefined
    if (!oldest) break
    const oldUrl = ttsMemCache.get(oldest)
    ttsMemCache.delete(oldest)
    if (oldUrl) {
      try {
        URL.revokeObjectURL(oldUrl)
      } catch {
        /* ignore */
      }
    }
  }
  return objectUrl
}

function isValidTtsBody(body: ArrayBuffer): boolean {
  if (!body || body.byteLength < 200) return false
  const head = String.fromCharCode(...new Uint8Array(body.slice(0, 1)))
  return head !== '{' && head !== '['
}

/**
 * 同源 /api/tts → Cache API → 内存 blob。
 * 命中内存时几乎零延迟；勿在播放后 revoke（否则每次都要重下）。
 */
async function loadTtsObjectUrl(
  text: string,
  lang: string,
  spd = 3
): Promise<string | null> {
  // #ifdef H5
  const key = ttsCacheKey(text, lang, spd)
  const mem = ttsMemCache.get(key)
  if (mem) return mem

  const pending = ttsInflight.get(key)
  if (pending) return pending

  const job = (async (): Promise<string | null> => {
    const url = proxyTtsUrl(text, lang, spd)
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
          if (!isValidTtsBody(body)) return null
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
      if (!isValidTtsBody(body!)) return null
      const objectUrl = URL.createObjectURL(new Blob([body!], { type: 'audio/mpeg' }))
      return rememberTtsObjectUrl(key, objectUrl)
    } catch (e) {
      console.warn('[tts] download failed', e)
      return null
    } finally {
      ttsInflight.delete(key)
    }
  })()

  ttsInflight.set(key, job)
  return job
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
    const local = isLocalAudioUrl(url)

    const doPlay = (): Promise<boolean> =>
      new Promise((resolve) => {
        if (epoch && epoch !== speakEpoch) {
          resolve(true)
          return
        }
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
        const onOk = () => {
          audioUnlockOk = true
          finish(true)
        }
        el.addEventListener('error', onErr)
        el.addEventListener('playing', onOk)
        el.addEventListener('ended', onOk)
        // 本地 mp3 很快；网络兜底才需要长超时（原先一律 2200ms 会拖慢失败回退）
        const timer = setTimeout(
          () => finish(el.currentTime > 0.01 || (!el.paused && el.duration > 0)),
          local ? 600 : 2200
        )
        const p = el.play()
        if (p && typeof p.then === 'function') {
          p.then(() => {
            audioUnlockOk = true
            // 本地：play() resolve 即可认定已出声，不必再等 200ms
            if (local) {
              finish(true)
              return
            }
            setTimeout(() => {
              if (el.currentTime > 0.01 || (!el.paused && el.duration > 0)) finish(true)
            }, 200)
          }).catch(() => finish(false))
        }
      })

    // 同源本地音频：优先在点击手势里直接 play，避免微信 Bridge 排队造成「点了要等一两秒」
    let started: boolean
    if (local) {
      started = await doPlay()
      if (!started && isWeChat() && !audioUnlockOk) {
        started = await withWeChatAudioGate(doPlay)
      }
    } else {
      started = isWeChat() ? await withWeChatAudioGate(doPlay) : await doPlay()
    }
    if (!started) return false
    if (epoch && epoch !== speakEpoch) return true
    if (!waitEnd) return true

    const el = (isWeChat() ? audioEl : netEl) as HTMLAudioElement | null
    if (!el) return true
    // 极短音频（如字母 A）可能在 doPlay 返回前已 ended，再等 ended 会空等到超时
    if (el.ended) return true
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
      // 已播完或即将结束
      if (el.ended || (Number.isFinite(el.duration) && el.duration > 0 && el.currentTime >= el.duration - 0.05)) {
        finish()
        return
      }
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
  const spd = ttsSpd(options.rate)

  // 统一走同源代理 + 内存/Cache：再次点击同一句可立刻出声
  const objectUrl = await loadTtsObjectUrl(text, lang, spd)
  if (objectUrl) {
    // 内存缓存的 blob 不要 revoke
    return playUrlAudio(objectUrl, waitEnd, epoch)
  }

  // 代理不可用时：非微信再试百度直链（无法稳缓存，仅兜底）
  if (!isWeChat()) {
    return playUrlAudio(baiduTtsUrl(text, lang, spd), waitEnd, epoch)
  }
  return false
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

  // 声母/单韵母：本地预录（声调准确），不走「德/特」等错调汉字
  if (!lang.toLowerCase().startsWith('en')) {
    const local = pinyinLocalAudioUrl(text.trim())
    if (local) {
      if (await playUrlAudio(local, waitEnd, epoch)) {
        markSpokeOk(epoch)
        return true
      }
      if (epoch !== speakEpoch) return true
      // d/t/n/l：禁止回退到 TTS（会读成德/特/讷/勒），再试一次本地
      if (isPinyinLocalOnly(text.trim())) {
        if (await playUrlAudio(local, waitEnd, epoch)) {
          markSpokeOk(epoch)
          return true
        }
        if (epoch === speakEpoch) {
          console.warn('[tts] 本地拼音预录播放失败（不回退 TTS）:', text.trim(), local)
        }
        return epoch !== speakEpoch
      }
    }
  }

  const say = prepareText(text, lang, options)
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
    // 已解锁则不要 await，避免每次点击空等一拍
    if (!audioUnlockOk && !(isWeChat() && isAndroid())) {
      await ensureAudioUnlocked()
    }
    const ok = await speakOnce(trimmed, options, false)
    if (!ok && !options.silent) {
      tipOnce(failureTip(resolveLang(trimmed, options)))
    }
  })()
  // #endif
}

/**
 * 预热网络 TTS 到内存（选项卡出现时调用），点击时可立刻播。
 */
export function prefetchSpeak(text: string, options: SpeakOptions = {}): void {
  // #ifdef H5
  const trimmed = (text || '').trim()
  if (!trimmed || trimmed.length > 60) return
  const lang = resolveLang(trimmed, options)
  // 本地拼音预录本身很快，不必占代理
  if (!lang.toLowerCase().startsWith('en') && pinyinLocalAudioUrl(trimmed)) return
  const say = prepareText(trimmed, lang, options)
  if (!say || say.length > 60 || hasUnsafeSpeakChars(say)) return
  void loadTtsObjectUrl(say, lang, ttsSpd(options.rate))
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
    audioUnlockOk || (isWeChat() && isAndroid())
      ? Promise.resolve()
      : ensureAudioUnlocked()
  return prep
    .then(() => speakOnce(trimmed, options, true))
    .then(() => undefined)
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
