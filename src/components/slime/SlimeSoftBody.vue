<template>
  <view ref="rootRef" class="soft">
    <canvas
      :id="canvasId"
      class="soft__canvas"
      @touchstart.prevent="onTouchStart"
      @touchmove.prevent="onTouchMove"
      @touchend.prevent="onTouchEnd"
      @touchcancel.prevent="onTouchEnd"
      @mousedown.prevent="onMouseDown"
    />
    <text v-if="result.effect === 'iron'" class="soft__hint">拖动磁铁靠近胶体</text>
  </view>
</template>

<script setup lang="ts">
/**
 * 史莱姆软体：逻辑坐标一律用「画布 client 宽高」实时测量，
 * 闲置时硬编码贴回画面中心，避免沉到右下角。
 */
import { onMounted, onBeforeUnmount, watch, ref, nextTick, getCurrentInstance } from 'vue'
import type { SlimeResult } from '../../data/slime/types'
import { dragPulse, lightTap } from '../../utils/haptics'
import { playSfx } from '../../utils/sfx'

const props = withDefaults(
  defineProps<{
    result: SlimeResult
    lightsOff?: boolean
  }>(),
  { lightsOff: false }
)

const RING = 20
const canvasId = `slime-soft-${Math.random().toString(36).slice(2, 9)}`
const rootRef = ref<HTMLElement | { $el?: HTMLElement } | null>(null)
const instance = getCurrentInstance()

type Pt = { x: number; y: number; px: number; py: number }
type Spring = { a: number; b: number; len: number; k: number }
type Spark = { ang: number; r: number; size: number; phase: number }

let canvas: HTMLCanvasElement | null = null
let ctx: CanvasRenderingContext2D | null = null
let dpr = 1
let W = 320
let H = 280

let pts: Pt[] = []
let home: { x: number; y: number }[] = []
let springs: Spring[] = []
let sparks: Spark[] = []

let raf = 0
let running = false
let loopToken = 0

let mode: 'idle' | 'drag' = 'idle'
let grabIdx = -1
let grabX = 0
let grabY = 0
let pokeT = 0
let pokeX = 0
let pokeY = 0
let coolUntil = 0
let lastHaptic = 0

let magX = 0
let magY = 0
let magGrab = false
let magOx = 0
let magOy = 0
let magSx = 0
let magSy = 0

function physical() {
  return props.result.physical
}

function feel() {
  if (physical() === 'runny') return { kRing: 0.1, kCenter: 0.05, kSkip: 0.045, poke: 30, follow: 0.72 }
  if (physical() === 'firm') return { kRing: 0.28, kCenter: 0.22, kSkip: 0.16, poke: 11, follow: 0.3 }
  return { kRing: 0.16, kCenter: 0.12, kSkip: 0.08, poke: 18, follow: 0.5 }
}

function hostEl(): HTMLElement | null {
  const r = rootRef.value as HTMLElement | { $el?: HTMLElement } | null
  if (!r) return null
  if (r instanceof HTMLElement) return r
  return (r.$el as HTMLElement) || (instance?.proxy?.$el as HTMLElement) || null
}

function measure() {
  if (!canvas) return false
  const rect = canvas.getBoundingClientRect()
  const w = Math.max(200, Math.round(rect.width) || canvas.clientWidth || 320)
  const h = Math.max(180, Math.round(rect.height) || canvas.clientHeight || 280)
  dpr = Math.min(window.devicePixelRatio || 1, 2)
  const needResize = canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr) || W !== w || H !== h
  W = w
  H = h
  if (needResize) {
    canvas.width = Math.round(W * dpr)
    canvas.height = Math.round(H * dpr)
  }
  return true
}

function dist(a: { x: number; y: number }, b: { x: number; y: number }) {
  return Math.hypot(a.x - b.x, a.y - b.y)
}

function buildHomePose() {
  const cx = W * 0.5
  const cy = H * 0.4
  const rx = physical() === 'runny' ? W * 0.32 : physical() === 'firm' ? W * 0.26 : W * 0.29
  const ry = physical() === 'runny' ? H * 0.16 : physical() === 'firm' ? H * 0.2 : H * 0.18

  home = [{ x: cx, y: cy }]
  pts = [{ x: cx, y: cy, px: cx, py: cy }]

  for (let i = 0; i < RING; i++) {
    const a = (i / RING) * Math.PI * 2 - Math.PI / 2
    const bottom = Math.sin(a)
    const flat = bottom > 0 ? 1 - bottom * 0.3 : 1 + (-bottom) * 0.08
    const lobe = 1 + 0.1 * Math.sin(a * 3 + 0.4) + 0.05 * Math.sin(a * 5 - 0.7)
    const s = flat * lobe
    const x = cx + Math.cos(a) * rx * s
    const y = cy + Math.sin(a) * ry * s
    home.push({ x, y })
    pts.push({ x, y, px: x, py: y })
  }

  const f = feel()
  springs = []
  for (let i = 0; i < RING; i++) {
    const a = i + 1
    const b = ((i + 1) % RING) + 1
    const c = ((i + 2) % RING) + 1
    springs.push({ a, b, len: dist(pts[a], pts[b]), k: f.kRing })
    springs.push({ a, b: c, len: dist(pts[a], pts[c]), k: f.kSkip })
    springs.push({ a: 0, b: a, len: dist(pts[0], pts[a]), k: f.kCenter })
  }

  sparks = []
  if (props.result.effect === 'glitter') {
    for (let i = 0; i < 28; i++) {
      sparks.push({
        ang: Math.random() * Math.PI * 2,
        r: 0.15 + Math.random() * 0.7,
        size: 1.2 + Math.random() * 2.2,
        phase: Math.random() * Math.PI * 2,
      })
    }
  }

  magX = W * 0.72
  magY = H * 0.28
}

function snapHome() {
  for (let i = 0; i < pts.length; i++) {
    pts[i].x = home[i].x
    pts[i].y = home[i].y
    pts[i].px = home[i].x
    pts[i].py = home[i].y
  }
}

function applySprings() {
  for (const s of springs) {
    const A = pts[s.a]
    const B = pts[s.b]
    const dx = B.x - A.x
    const dy = B.y - A.y
    const d = Math.hypot(dx, dy) || 0.0001
    const f = ((d - s.len) / d) * 0.5 * s.k
    A.x += dx * f
    A.y += dy * f
    B.x -= dx * f
    B.y -= dy * f
  }
}

function keepInView() {
  const pad = 12
  for (const p of pts) {
    p.x = Math.min(W - pad, Math.max(pad, p.x))
    p.y = Math.min(H - pad, Math.max(pad, p.y))
  }
}

function integrate() {
  if (!pts.length || !home.length) return
  const f = feel()
  const holding = mode === 'drag'
  const poking = pokeT > 0
  const cooling = performance.now() < coolUntil

  if (poking) {
    pokeT -= 1
    for (let i = 1; i < pts.length; i++) {
      const dx = pts[i].x - pokeX
      const dy = pts[i].y - pokeY
      const d = Math.hypot(dx, dy) || 1
      if (d < Math.min(W, H) * 0.35) {
        const w = (1 - d / (Math.min(W, H) * 0.35)) * f.poke * (pokeT / 12)
        pts[i].x += (dx / d) * w
        pts[i].y += (dy / d) * w
      }
    }
  }

  if (props.result.effect === 'iron') {
    const dx = magX - pts[0].x
    const dy = magY - pts[0].y
    const d = Math.hypot(dx, dy)
    const reach = Math.min(W, H) * 0.38
    if (d < reach && d > 1) {
      const pull = (physical() === 'firm' ? 0.04 : physical() === 'runny' ? 0.12 : 0.07) * (1 - d / reach)
      for (let i = 0; i < pts.length; i++) {
        const m = i === 0 ? 1 : 0.88
        pts[i].x += dx * pull * m
        pts[i].y += dy * pull * m
      }
    }
  }

  if (holding && grabIdx >= 0) {
    const g = pts[grabIdx]
    g.x += (grabX - g.x) * f.follow
    g.y += (grabY - g.y) * f.follow
    if (grabIdx > 0) {
      const i = grabIdx - 1
      const prev = ((i - 1 + RING) % RING) + 1
      const next = ((i + 1) % RING) + 1
      for (const n of [prev, next]) {
        pts[n].x += (grabX - pts[n].x) * f.follow * 0.4
        pts[n].y += (grabY - pts[n].y) * f.follow * 0.4
      }
      pts[0].x += (grabX - pts[0].x) * f.follow * 0.25
      pts[0].y += (grabY - pts[0].y) * f.follow * 0.25
    }
    applySprings()
    keepInView()
    for (const p of pts) {
      p.px = p.x
      p.py = p.y
    }
    return
  }

  // 闲置 / 冷却结束：必须回画面中心（按当前画布尺寸）
  if (!holding && !poking && !cooling) {
    snapHome()
    return
  }

  // 冷却：快速移回中心
  for (let i = 0; i < pts.length; i++) {
    pts[i].x += (home[i].x - pts[i].x) * 0.28
    pts[i].y += (home[i].y - pts[i].y) * 0.28
    pts[i].px = pts[i].x
    pts[i].py = pts[i].y
  }
  keepInView()
}

function hexToRgb(hex: string) {
  const h = hex.replace('#', '')
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h
  const n = parseInt(full, 16)
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 }
}

function pathBlob(c: CanvasRenderingContext2D) {
  const ring = pts.slice(1)
  c.beginPath()
  for (let i = 0; i < ring.length; i++) {
    const p0 = ring[(i - 1 + ring.length) % ring.length]
    const p1 = ring[i]
    const p2 = ring[(i + 1) % ring.length]
    const p3 = ring[(i + 2) % ring.length]
    const bp1x = p1.x + (p2.x - p0.x) / 6
    const bp1y = p1.y + (p2.y - p0.y) / 6
    const bp2x = p2.x - (p3.x - p1.x) / 6
    const bp2y = p2.y - (p3.y - p1.y) / 6
    if (i === 0) c.moveTo(p1.x, p1.y)
    c.bezierCurveTo(bp1x, bp1y, bp2x, bp2y, p2.x, p2.y)
  }
  c.closePath()
}

function draw() {
  if (!ctx || !pts.length) return
  const c = ctx
  c.setTransform(dpr, 0, 0, dpr, 0, 0)
  c.clearRect(0, 0, W, H)

  const cx = pts[0].x
  const cy = pts[0].y
  const col = hexToRgb(props.result.color)
  const opaque = props.result.opaque
  const glow = props.result.effect === 'glow' && props.lightsOff
  const pearl = props.result.effect === 'pearl'

  let minX = pts[1].x
  let maxX = pts[1].x
  let minY = pts[1].y
  let maxY = pts[1].y
  for (let i = 1; i < pts.length; i++) {
    minX = Math.min(minX, pts[i].x)
    maxX = Math.max(maxX, pts[i].x)
    minY = Math.min(minY, pts[i].y)
    maxY = Math.max(maxY, pts[i].y)
  }

  c.fillStyle = 'rgba(1,87,155,0.15)'
  c.beginPath()
  c.ellipse(cx, Math.min(H - 8, maxY + 8), Math.max(36, (maxX - minX) * 0.4), 8, 0, 0, Math.PI * 2)
  c.fill()

  if (glow) {
    c.save()
    c.shadowColor = `rgba(${col.r},${col.g},${col.b},0.95)`
    c.shadowBlur = 36
    pathBlob(c)
    c.fillStyle = `rgba(${col.r},${col.g},${col.b},0.5)`
    c.fill()
    c.restore()
  }

  pathBlob(c)
  const bodyH = Math.max(36, maxY - minY)
  const g = c.createRadialGradient(cx - 20, cy - bodyH * 0.35, 5, cx, cy + 8, Math.max(60, bodyH * 1.05))
  if (opaque) {
    g.addColorStop(0, 'rgba(255,255,255,0.58)')
    g.addColorStop(0.35, `rgba(${col.r},${col.g},${col.b},0.98)`)
    g.addColorStop(1, `rgba(${Math.max(0, col.r - 40)},${Math.max(0, col.g - 30)},${Math.max(0, col.b - 20)},1)`)
  } else {
    g.addColorStop(0, 'rgba(255,255,255,0.55)')
    g.addColorStop(0.4, `rgba(${col.r},${col.g},${col.b},0.48)`)
    g.addColorStop(1, `rgba(${col.r},${col.g},${col.b},0.82)`)
  }
  c.fillStyle = g
  c.fill()

  pathBlob(c)
  c.strokeStyle = opaque ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.55)'
  c.lineWidth = 2.2
  c.stroke()
  if (pearl) {
    const ig = c.createLinearGradient(cx - 60, cy - 40, cx + 60, cy + 40)
    ig.addColorStop(0, 'rgba(255,182,193,0.28)')
    ig.addColorStop(0.5, 'rgba(129,212,250,0.2)')
    ig.addColorStop(1, 'rgba(206,147,216,0.28)')
    pathBlob(c)
    c.fillStyle = ig
    c.fill()
  }

  c.beginPath()
  c.ellipse(cx - 18, cy - bodyH * 0.28, 26, 14, -0.4, 0, Math.PI * 2)
  c.fillStyle = 'rgba(255,255,255,0.38)'
  c.fill()

  if (props.result.effect === 'glitter') {
    const t = performance.now() / 1000
    const rw = Math.max(24, (maxX - minX) * 0.36)
    const rh = Math.max(14, (maxY - minY) * 0.36)
    for (const s of sparks) {
      const x = cx + Math.cos(s.ang + t * 0.12) * rw * s.r
      const y = cy + Math.sin(s.ang + t * 0.12) * rh * s.r
      const flash = 0.3 + 0.7 * Math.abs(Math.sin(t * 3 + s.phase))
      c.save()
      c.translate(x, y)
      c.rotate(s.ang + t)
      c.fillStyle = `rgba(255,255,255,${0.3 + flash * 0.6})`
      c.fillRect(-s.size, -s.size * 0.3, s.size * 2, s.size * 0.6)
      c.restore()
    }
  }

  if (props.result.effect === 'iron') {
    c.font = `${Math.round(Math.min(W, H) * 0.12)}px sans-serif`
    c.textAlign = 'center'
    c.textBaseline = 'middle'
    c.fillText('🧲', magX, magY)
  }
}

function loop(token: number) {
  if (!running || token !== loopToken) return
  if (measure() && home.length && (Math.abs(home[0].x - W * 0.5) > 1 || Math.abs(home[0].y - H * 0.4) > 1)) {
    // 画布尺寸变化时重建静息位
    const wasIdle = mode === 'idle' && pokeT <= 0 && performance.now() >= coolUntil
    buildHomePose()
    if (wasIdle) snapHome()
  }
  integrate()
  draw()
  raf = requestAnimationFrame(() => loop(token))
}

function localPos(e: TouchEvent | MouseEvent) {
  if (!canvas) return { x: W / 2, y: H / 2 }
  const rect = canvas.getBoundingClientRect()
  const src = 'touches' in e && e.touches[0] ? e.touches[0] : (e as MouseEvent)
  return {
    x: ((src.clientX - rect.left) / Math.max(1, rect.width)) * W,
    y: ((src.clientY - rect.top) / Math.max(1, rect.height)) * H,
  }
}

function nearest(x: number, y: number) {
  let idx = 1
  let best = Infinity
  for (let i = 1; i < pts.length; i++) {
    const d = Math.hypot(pts[i].x - x, pts[i].y - y)
    if (d < best) {
      best = d
      idx = i
    }
  }
  return { idx, d: best }
}

function haptic() {
  const now = Date.now()
  if (now - lastHaptic < 90) return
  lastHaptic = now
  dragPulse(props.result.hardness)
}

function hitMagnet(x: number, y: number) {
  return props.result.effect === 'iron' && Math.hypot(x - magX, y - magY) < Math.min(W, H) * 0.12
}

function onTouchStart(e: TouchEvent) {
  const { x, y } = localPos(e)
  if (hitMagnet(x, y)) {
    magGrab = true
    magSx = x
    magSy = y
    magOx = magX
    magOy = magY
    return
  }
  const { idx, d } = nearest(x, y)
  const toC = Math.hypot(pts[0].x - x, pts[0].y - y)
  if (d < Math.min(W, H) * 0.14 || toC < Math.min(W, H) * 0.28) {
    mode = 'drag'
    grabIdx = d < Math.min(W, H) * 0.14 ? idx : 0
    grabX = x
    grabY = y
    haptic()
  } else {
    pokeX = x
    pokeY = y
    pokeT = physical() === 'firm' ? 8 : physical() === 'runny' ? 16 : 12
    lightTap()
    playSfx('tap')
    haptic()
  }
}

function onTouchMove(e: TouchEvent) {
  const { x, y } = localPos(e)
  if (magGrab) {
    magX = magOx + (x - magSx)
    magY = magOy + (y - magSy)
    return
  }
  if (mode !== 'drag') return
  grabX = x
  grabY = y
  haptic()
}

function onTouchEnd() {
  if (magGrab) {
    magGrab = false
    return
  }
  if (mode === 'drag') lightTap()
  mode = 'idle'
  grabIdx = -1
  coolUntil = performance.now() + 220
}

function onMouseDown(e: MouseEvent) {
  const { x, y } = localPos(e)
  if (hitMagnet(x, y)) {
    magGrab = true
    magSx = x
    magSy = y
    magOx = magX
    magOy = magY
    const move = (ev: MouseEvent) => {
      const p = localPos(ev)
      magX = magOx + (p.x - magSx)
      magY = magOy + (p.y - magSy)
    }
    const up = () => {
      magGrab = false
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mouseup', up)
    }
    window.addEventListener('mousemove', move)
    window.addEventListener('mouseup', up)
    return
  }
  const { idx, d } = nearest(x, y)
  const toC = Math.hypot(pts[0].x - x, pts[0].y - y)
  if (d < Math.min(W, H) * 0.14 || toC < Math.min(W, H) * 0.28) {
    mode = 'drag'
    grabIdx = d < Math.min(W, H) * 0.14 ? idx : 0
    grabX = x
    grabY = y
  } else {
    pokeX = x
    pokeY = y
    pokeT = 12
    lightTap()
    playSfx('tap')
  }
  const move = (ev: MouseEvent) => {
    if (mode !== 'drag') return
    const p = localPos(ev)
    grabX = p.x
    grabY = p.y
    haptic()
  }
  const up = () => {
    mode = 'idle'
    grabIdx = -1
    coolUntil = performance.now() + 220
    window.removeEventListener('mousemove', move)
    window.removeEventListener('mouseup', up)
  }
  window.addEventListener('mousemove', move)
  window.addEventListener('mouseup', up)
}

function bind() {
  const el = typeof document !== 'undefined' ? (document.getElementById(canvasId) as HTMLCanvasElement | null) : null
  if (el) canvas = el
  else {
    const host = hostEl()
    canvas = host?.querySelector('canvas') as HTMLCanvasElement | null
  }
  if (!canvas) return false
  ctx = canvas.getContext('2d')
  if (!measure()) return false
  buildHomePose()
  snapHome()
  return !!ctx
}

function start() {
  stop()
  mode = 'idle'
  pokeT = 0
  coolUntil = 0
  nextTick(() => {
    const ok = bind()
    if (!ok) {
      setTimeout(() => {
        if (bind()) {
          running = true
          loopToken += 1
          loop(loopToken)
        }
      }, 80)
      return
    }
    running = true
    loopToken += 1
    loop(loopToken)
  })
}

function stop() {
  running = false
  loopToken += 1
  if (raf) cancelAnimationFrame(raf)
  raf = 0
}

watch(
  () => [props.result.fingerprint, props.result.physical, props.result.effect, props.result.color],
  () => start()
)

onMounted(() => start())
onBeforeUnmount(() => stop())
</script>

<style scoped lang="scss">
.soft {
  position: relative;
  width: 100%;
  max-width: 640rpx;
  height: 560rpx;
  margin: 0 auto;
  touch-action: none;
  background: rgba(255, 255, 255, 0.25);
  border-radius: 24rpx;
}
.soft__canvas {
  display: block;
  width: 100%;
  height: 100%;
  border-radius: 24rpx;
}
.soft__hint {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 10rpx;
  text-align: center;
  font-size: 22rpx;
  color: #0277bd;
  pointer-events: none;
}
</style>
