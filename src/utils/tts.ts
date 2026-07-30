type SpeakOptions = {
  lang?: string
  rate?: number
  pitch?: number
}

const CACHE_NAME = 'kidlearn-tts-v1'
let preferredVoice: SpeechSynthesisVoice | null = null
let unlocked = false
let resumeTimer: ReturnType<typeof setInterval> | null = null
let lastTipAt = 0
let audioEl: HTMLAudioElement | null = null

function isAndroid(): boolean {
  // #ifdef H5
  return typeof navigator !== 'undefined' && /Android/i.test(navigator.userAgent)
  // #endif
  // #ifndef H5
  return false
  // #endif
}

function isMobile(): boolean {
  // #ifdef H5
  if (typeof navigator === 'undefined') return false
  return /iPhone|iPad|iPod|Android|Mobile/i.test(navigator.userAgent)
  // #endif
  // #ifndef H5
  return false
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

/** 用户手势内调用：解锁播报能力（安卓不要 speak 空字符串） */
export function unlockSpeak(): void {
  // #ifdef H5
  if (unlocked) return
  unlocked = true
  if (!canSpeak()) return
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
  if (now - lastTipAt < 12000) return
  lastTipAt = now
  try {
    uni.showToast({ title: msg, icon: 'none', duration: 3200 })
  } catch {
    /* ignore */
  }
}

function resolveLang(text: string, options: SpeakOptions): string {
  if (options.lang) return options.lang
  return /[a-zA-Z]/.test(text) && !/[\u4e00-\u9fff]/.test(text) ? 'en-US' : 'zh-CN'
}

function speakWeb(text: string, options: SpeakOptions): Promise<boolean> {
  // #ifdef H5
  return new Promise((resolve) => {
    if (!canSpeak()) {
      resolve(false)
      return
    }
    try {
      // 安卓：尽量别 cancel，否则容易整段静音
      if (!isAndroid() && (window.speechSynthesis.speaking || window.speechSynthesis.pending)) {
        window.speechSynthesis.cancel()
      } else if (isAndroid() && window.speechSynthesis.paused) {
        window.speechSynthesis.resume()
      }

      const u = new SpeechSynthesisUtterance(text)
      u.lang = resolveLang(text, options)
      u.rate = options.rate ?? 0.92
      u.pitch = options.pitch ?? 1
      u.volume = 1

      // 安卓/小米：强制指定 voice 经常导致完全无声，只设 lang
      if (!isAndroid()) {
        const voices = window.speechSynthesis.getVoices()
        const prefix = u.lang.slice(0, 2).toLowerCase()
        const voice =
          voices.find((v) => v.lang.toLowerCase().startsWith(prefix)) || preferredVoice
        if (voice && voice.lang.toLowerCase().startsWith(prefix)) u.voice = voice
      }

      let settled = false
      const done = (ok: boolean) => {
        if (settled) return
        settled = true
        resolve(ok)
      }

      u.onstart = () => done(true)
      u.onend = () => done(true)
      u.onerror = () => done(false)

      window.speechSynthesis.speak(u)

      // 小米等机型：speak 后既不 onstart 也不 onerror，超时判失败走兜底
      setTimeout(() => {
        if (!settled) {
          const ok = window.speechSynthesis.speaking || window.speechSynthesis.pending
          done(!!ok)
        }
      }, isAndroid() ? 450 : 700)
    } catch {
      resolve(false)
    }
  })
  // #endif
  // #ifndef H5
  return Promise.resolve(false)
  // #endif
}

/** 有道词典发音：用 Audio 直链播放，避免 fetch CORS；短词汉字在小米上可用 */
function ttsUrl(text: string, lang: string): string {
  const q = encodeURIComponent(text.slice(0, 40))
  if (lang.toLowerCase().startsWith('en')) {
    return `https://dict.youdao.com/dictvoice?audio=${q}&type=2`
  }
  return `https://dict.youdao.com/dictvoice?audio=${q}&le=zh`
}

async function playUrlAudio(url: string): Promise<boolean> {
  // #ifdef H5
  try {
    if (!audioEl) {
      audioEl = new Audio()
      audioEl.preload = 'auto'
    }
    audioEl.pause()
    audioEl.currentTime = 0
    audioEl.src = url
    const p = audioEl.play()
    if (p && typeof p.then === 'function') await p
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

async function speakFallback(text: string, options: SpeakOptions): Promise<boolean> {
  const lang = resolveLang(text, options)
  // 优先直链播放（不依赖 CORS）；再尝试写入 Cache 供下次
  const url = ttsUrl(text, lang)
  const ok = await playUrlAudio(url)
  if (ok && typeof caches !== 'undefined') {
    caches.open(CACHE_NAME).then(async (cache) => {
      try {
        const hit = await cache.match(url)
        if (!hit) {
          const res = await fetch(url, { mode: 'no-cors', credentials: 'omit' })
          // no-cors 为 opaque，仍可缓存供同 URL 命中
          await cache.put(url, res)
        }
      } catch {
        /* ignore */
      }
    })
  }
  return ok
}

/**
 * 对外播报：优先系统 Web Speech；安卓/小米失败则走有道发音并本地缓存。
 * 必须在用户点击/触摸回调里调用。
 */
export function speak(text: string, options: SpeakOptions = {}): void {
  if (!text) return
  // #ifdef H5
  unlockSpeak()
  const trimmed = text.trim()
  if (!trimmed) return

  // 安卓/小米：系统 Web Speech 经常“假成功但无声”，优先用有道直链更稳
  // 桌面端优先 Web Speech（零网络）
  void (async () => {
    if (isAndroid()) {
      const netOk = await speakFallback(trimmed, options)
      if (netOk) return
      const webOk = await speakWeb(trimmed, options)
      if (webOk) return
      tipOnce('无法发音：请连网试一次，或安装系统中文语音引擎')
      return
    }
    const webOk = await speakWeb(trimmed, options)
    if (webOk) return
    const netOk = await speakFallback(trimmed, options)
    if (netOk) return
    tipOnce('无法发音：请检查系统语音或网络后重试')
  })()
  // #endif
}

export function stopSpeak(): void {
  // #ifdef H5
  try {
    if (canSpeak()) window.speechSynthesis.cancel()
  } catch {
    /* ignore */
  }
  try {
    audioEl?.pause()
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
    `secure=${typeof window !== 'undefined' ? window.isSecureContext : false}`,
    `ua=${typeof navigator !== 'undefined' ? navigator.userAgent.slice(0, 80) : ''}`,
  ].join(' | ')
  // #endif
  // #ifndef H5
  return 'non-h5'
  // #endif
}
