/** Web Audio 实时合成音效，零音频文件 */

type SfxKind = 'correct' | 'wrong' | 'star' | 'tap' | 'unlock' | 'complete'

let ctx: AudioContext | null = null
let enabled = true

function getCtx(): AudioContext | null {
  // #ifdef H5
  if (typeof window === 'undefined') return null
  try {
    if (!ctx) {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      ctx = new AC()
    }
    if (ctx.state === 'suspended') ctx.resume()
    return ctx
  } catch {
    return null
  }
  // #endif
  // #ifndef H5
  return null
  // #endif
}

function tone(freq: number, start: number, dur: number, type: OscillatorType = 'sine', gain = 0.15) {
  const c = getCtx()
  if (!c) return
  const osc = c.createOscillator()
  const g = c.createGain()
  osc.type = type
  osc.frequency.value = freq
  g.gain.setValueAtTime(gain, c.currentTime + start)
  g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + start + dur)
  osc.connect(g)
  g.connect(c.destination)
  osc.start(c.currentTime + start)
  osc.stop(c.currentTime + start + dur + 0.02)
}

export function setSfxEnabled(v: boolean) {
  enabled = v
}

export function isSfxEnabled() {
  return enabled
}

export function playSfx(kind: SfxKind) {
  if (!enabled) return
  switch (kind) {
    case 'tap':
      tone(660, 0, 0.06, 'triangle', 0.08)
      break
    case 'correct':
      tone(523, 0, 0.12, 'sine', 0.14)
      tone(659, 0.1, 0.14, 'sine', 0.14)
      tone(784, 0.22, 0.2, 'sine', 0.12)
      break
    case 'wrong':
      tone(220, 0, 0.18, 'square', 0.08)
      tone(180, 0.12, 0.22, 'square', 0.06)
      break
    case 'star':
      tone(784, 0, 0.1, 'sine', 0.12)
      tone(988, 0.08, 0.12, 'sine', 0.12)
      tone(1175, 0.18, 0.25, 'sine', 0.1)
      break
    case 'unlock':
      tone(392, 0, 0.1, 'triangle', 0.1)
      tone(523, 0.1, 0.12, 'triangle', 0.1)
      tone(659, 0.22, 0.18, 'triangle', 0.1)
      break
    case 'complete':
      ;[523, 659, 784, 1046].forEach((f, i) => tone(f, i * 0.1, 0.22, 'sine', 0.12))
      break
  }
}
