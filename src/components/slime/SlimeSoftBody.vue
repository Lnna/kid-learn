<template>
  <view ref="rootRef" class="soft">
    <canvas
      class="soft__canvas"
      :style="{ width: cssW + 'px', height: cssH + 'px' }"
      @touchstart.prevent="onTouchStart"
      @touchmove.prevent="onTouchMove"
      @touchend.prevent="onTouchEnd"
      @touchcancel.prevent="onTouchEnd"
      @mousedown.prevent="onMouseDown"
    />
    <canvas
      v-if="result.effect === 'iron'"
      class="soft__magnet-layer"
      :style="{ width: cssW + 'px', height: cssH + 'px' }"
      @touchstart.prevent="onMagStart"
      @touchmove.prevent="onMagMove"
      @touchend.prevent="onMagEnd"
      @mousedown.prevent="onMagMouseDown"
    />
    <text v-if="result.effect === 'iron'" class="soft__magnet-hint">拖动磁铁靠近胶体</text>
  </view>
</template>

<script setup lang="ts">
/**
 * 轻量弹簧软体史莱姆（Verlet + 环形弹簧）
 * H5 Canvas 实时绘制；稀软/标准/硬实参数不同
 */
import { onMounted, onBeforeUnmount, watch, ref, nextTick } from 'vue'
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
const cssW = 320
const cssH = 280

type Pt = { x: number; y: number; px: number; py: number }
type Spring = { a: number; b: number; rest: number; k: number }
interface Spark {
  ang: number
  r: number
  size: number
  phase: number
}

const rootRef = ref<HTMLElement | { $el?: HTMLElement } | null>(null)

let dpr = 1
let canvas: HTMLCanvasElement | null = null
let magCanvas: HTMLCanvasElement | null = null
let ctx: CanvasRenderingContext2D | null = null
let magCtx: CanvasRenderingContext2D | null = null
let pts: Pt[] = []
/** 静息外形（扁坨），闲置时缓慢回弹到此，避免重力沉底 */
let rest: { x: number; y: number }[] = []
let springs: Spring[] = []
let sparks: Spark[] = []
let raf = 0
let running = false
let interactUntil = 0

let mode: 'idle' | 'poke' | 'drag' = 'idle'
let grabIdx = -1
let grabX = 0
let grabY = 0
let pokeX = 0
let pokeY = 0
let pokeT = 0
let lastHaptic = 0

let magX = cssW * 0.72
let magY = cssH * 0.28
let magGrab = false
let magOx = 0
let magOy = 0
let magSx = 0
let magSy = 0

function hostEl(): HTMLElement | null {
  const r = rootRef.value as HTMLElement | { $el?: HTMLElement } | null
  if (!r) return null
  if (r instanceof HTMLElement) return r
  return (r.$el as HTMLElement) || null
}

function physical() {
  return props.result.physical
}

function params() {
  // 无持续重力；闲置强回中；交互时才允许大幅形变
  if (physical() === 'runny') {
    return { kRing: 0.1, kCenter: 0.05, kSkip: 0.045, damp: 0.9, pokeForce: 28, dragFollow: 0.7, restore: 0.14 }
  }
  if (physical() === 'firm') {
    return { kRing: 0.28, kCenter: 0.22, kSkip: 0.16, damp: 0.84, pokeForce: 10, dragFollow: 0.28, restore: 0.2 }
  }
  return { kRing: 0.16, kCenter: 0.12, kSkip: 0.08, damp: 0.88, pokeForce: 18, dragFollow: 0.48, restore: 0.16 }
}

function dist(a: { x: number; y: number }, b: { x: number; y: number }) {
  return Math.hypot(a.x - b.x, a.y - b.y)
}

/** 扁坨 + 不规则起伏，避免正圆球 */
function initMesh() {
  const cx = cssW / 2
  // 略偏上，给底部阴影留空，避免沉到画布外
  const cy = cssH * 0.52
  // 宽扁：稀软更摊，硬实略厚
  const rx = physical() === 'runny' ? 108 : physical() === 'firm' ? 88 : 98
  const ry = physical() === 'runny' ? 48 : physical() === 'firm' ? 62 : 54

  pts = [{ x: cx, y: cy + ry * 0.12, px: cx, py: cy + ry * 0.12 }]
  rest = [{ x: pts[0].x, y: pts[0].y }]

  for (let i = 0; i < RING; i++) {
    const t = i / RING
    const a = t * Math.PI * 2 - Math.PI / 2
    // 底部更平、顶部略鼓；加少量花瓣起伏
    const bottom = Math.sin(a) // +1 偏下
    const flat = bottom > 0 ? 1 - bottom * 0.22 : 1 + (-bottom) * 0.06
    const lobe = 1 + 0.1 * Math.sin(a * 3 + 0.4) + 0.06 * Math.sin(a * 5 - 0.8)
    const squash = flat * lobe
    const x = cx + Math.cos(a) * rx * squash
    const y = cy + Math.sin(a) * ry * squash
    pts.push({ x, y, px: x, py: y })
    rest.push({ x, y })
  }

  const p = params()
  springs = []
  for (let i = 0; i < RING; i++) {
    const a = i + 1
    const b = ((i + 1) % RING) + 1
    const c = ((i + 2) % RING) + 1
    springs.push({ a, b, rest: dist(pts[a], pts[b]), k: p.kRing })
    springs.push({ a, b: c, rest: dist(pts[a], pts[c]), k: p.kSkip })
    springs.push({ a: 0, b: a, rest: dist(pts[0], pts[a]), k: p.kCenter })
  }

  sparks = []
  if (props.result.effect === 'glitter') {
    for (let i = 0; i < 30; i++) {
      sparks.push({
        ang: Math.random() * Math.PI * 2,
        r: 0.12 + Math.random() * 0.75,
        size: 1.1 + Math.random() * 2.6,
        phase: Math.random() * Math.PI * 2,
      })
    }
  }
}

function applySprings() {
  for (const s of springs) {
    const A = pts[s.a]
    const B = pts[s.b]
    const dx = B.x - A.x
    const dy = B.y - A.y
    const d = Math.hypot(dx, dy) || 0.0001
    const f = ((d - s.rest) / d) * 0.5 * s.k
    const ox = dx * f
    const oy = dy * f
    A.x += ox
    A.y += oy
    B.x -= ox
    B.y -= oy
  }
}

function markInteract(ms = 900) {
  interactUntil = performance.now() + ms
}

function freezeVelocity() {
  for (const pt of pts) {
    pt.px = pt.x
    pt.py = pt.y
  }
}

function softClamp() {
  // 只做轻柔边界，不设“地面落点”，避免贴底后被弹簧越拽越下
  const pad = 16
  const cx = rest[0]?.x ?? cssW / 2
  const cy = rest[0]?.y ?? cssH / 2
  for (const pt of pts) {
    if (pt.x < pad) pt.x += (pad - pt.x) * 0.5
    if (pt.x > cssW - pad) pt.x -= (pt.x - (cssW - pad)) * 0.5
    if (pt.y < pad) pt.y += (pad - pt.y) * 0.5
    if (pt.y > cssH - pad) {
      // 触底：弹回中心方向，而不是钉在底边
      pt.y -= (pt.y - (cssH - pad)) * 0.65
      pt.y += (cy - pt.y) * 0.08
      pt.x += (cx - pt.x) * 0.04
    }
  }
}

function integrate() {
  const p = params()
  const holding = mode === 'drag'
  const poking = pokeT > 0
  const cooling = performance.now() < interactUntil
  const idle = !holding && !poking && !cooling

  if (poking) {
    pokeT -= 1
    for (let i = 1; i < pts.length; i++) {
      const dx = pts[i].x - pokeX
      const dy = pts[i].y - pokeY
      const d = Math.hypot(dx, dy) || 1
      if (d < 100) {
        const w = (1 - d / 100) * p.pokeForce * (pokeT / 12)
        pts[i].x += (dx / d) * w
        pts[i].y += (dy / d) * w
      }
    }
  }

  if (props.result.effect === 'iron') {
    const dx = magX - pts[0].x
    const dy = magY - pts[0].y
    const d = Math.hypot(dx, dy)
    if (d < 115 && d > 1) {
      const pull = (physical() === 'firm' ? 0.04 : physical() === 'runny' ? 0.12 : 0.075) * (1 - d / 115)
      for (let i = 0; i < pts.length; i++) {
        const m = i === 0 ? 1 : 0.88
        pts[i].x += dx * pull * m
        pts[i].y += dy * pull * m
      }
      markInteract(350)
    }
  }

  if (holding && grabIdx >= 0) {
    const g = pts[grabIdx]
    g.x += (grabX - g.x) * p.dragFollow
    g.y += (grabY - g.y) * p.dragFollow
    if (grabIdx > 0) {
      const i = grabIdx - 1
      const prev = ((i - 1 + RING) % RING) + 1
      const next = ((i + 1) % RING) + 1
      for (const n of [prev, next]) {
        pts[n].x += (grabX - pts[n].x) * p.dragFollow * 0.4
        pts[n].y += (grabY - pts[n].y) * p.dragFollow * 0.4
      }
      pts[0].x += (grabX - pts[0].x) * p.dragFollow * 0.25
      pts[0].y += (grabY - pts[0].y) * p.dragFollow * 0.25
    }
    // 手指按住（含不动）：保持当前形变，清速度，避免松手/停住后继续往下漂
    applySprings()
    softClamp()
    freezeVelocity()
    return
  }

  if (idle) {
    // 闲置：强力回到正中间静息扁坨，并清速度（不再沉底）
    const k = p.restore
    for (let i = 0; i < pts.length; i++) {
      pts[i].x += (rest[i].x - pts[i].x) * k
      pts[i].y += (rest[i].y - pts[i].y) * k
    }
    applySprings()
    softClamp()
    freezeVelocity()
    return
  }

  // 松手后的短暂冷却：边回中边保留一点惯性
  const blend = p.restore * 0.55
  for (let i = 0; i < pts.length; i++) {
    pts[i].x += (rest[i].x - pts[i].x) * blend
    pts[i].y += (rest[i].y - pts[i].y) * blend
  }
  for (let iter = 0; iter < 3; iter++) applySprings()

  for (let i = 0; i < pts.length; i++) {
    const pt = pts[i]
    const vx = (pt.x - pt.px) * p.damp
    const vy = (pt.y - pt.py) * p.damp
    pt.px = pt.x
    pt.py = pt.y
    pt.x += vx
    pt.y += vy
  }
  softClamp()
}

function smoothRingPath(c: CanvasRenderingContext2D) {
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

function hexToRgb(hex: string) {
  const h = hex.replace('#', '')
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h
  const n = parseInt(full, 16)
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 }
}

function draw() {
  if (!ctx || !pts.length) return
  const c = ctx
  c.setTransform(dpr, 0, 0, dpr, 0, 0)
  c.clearRect(0, 0, cssW, cssH)

  const cx = pts[0].x
  const cy = pts[0].y
  const col = hexToRgb(props.result.color)
  const opaque = props.result.opaque
  const glow = props.result.effect === 'glow' && props.lightsOff
  const pearl = props.result.effect === 'pearl'

  c.fillStyle = 'rgba(1, 87, 155, 0.16)'
  c.beginPath()
  // 阴影贴在胶体底部，而不是画布最底（避免“坨在屏幕外”的观感）
  let minY = pts[1].y
  let maxY = pts[1].y
  let minX = pts[1].x
  let maxX = pts[1].x
  for (let i = 1; i < pts.length; i++) {
    minY = Math.min(minY, pts[i].y)
    maxY = Math.max(maxY, pts[i].y)
    minX = Math.min(minX, pts[i].x)
    maxX = Math.max(maxX, pts[i].x)
  }
  const shadowW = Math.max(40, (maxX - minX) * 0.42)
  c.ellipse(cx, Math.min(cssH - 10, maxY + 10), shadowW, 9, 0, 0, Math.PI * 2)
  c.fill()

  if (glow) {
    c.save()
    c.shadowColor = `rgba(${col.r},${col.g},${col.b},0.95)`
    c.shadowBlur = 40
    smoothRingPath(c)
    c.fillStyle = `rgba(${col.r},${col.g},${col.b},0.5)`
    c.fill()
    c.restore()
  }

  smoothRingPath(c)
  const bodyH = Math.max(40, maxY - minY)
  const g = c.createRadialGradient(cx - 24, cy - bodyH * 0.35, 6, cx, cy + bodyH * 0.15, Math.max(70, bodyH * 1.1))
  if (opaque) {
    g.addColorStop(0, 'rgba(255,255,255,0.6)')
    g.addColorStop(0.32, `rgba(${col.r},${col.g},${col.b},0.98)`)
    g.addColorStop(1, `rgba(${Math.max(0, col.r - 45)},${Math.max(0, col.g - 35)},${Math.max(0, col.b - 25)},1)`)
  } else {
    g.addColorStop(0, 'rgba(255,255,255,0.58)')
    g.addColorStop(0.42, `rgba(${col.r},${col.g},${col.b},0.5)`)
    g.addColorStop(1, `rgba(${col.r},${col.g},${col.b},0.84)`)
  }
  c.fillStyle = g
  c.fill()

  c.save()
  smoothRingPath(c)
  c.strokeStyle = opaque ? 'rgba(255,255,255,0.32)' : 'rgba(255,255,255,0.58)'
  c.lineWidth = 2.4
  c.stroke()
  if (pearl) {
    const ig = c.createLinearGradient(cx - 70, cy - 50, cx + 70, cy + 55)
    ig.addColorStop(0, 'rgba(255,182,193,0.28)')
    ig.addColorStop(0.45, 'rgba(129,212,250,0.22)')
    ig.addColorStop(1, 'rgba(206,147,216,0.3)')
    c.fillStyle = ig
    c.fill()
    c.strokeStyle = 'rgba(186,104,200,0.4)'
    c.lineWidth = 2.5
    c.stroke()
  }
  c.restore()

  c.beginPath()
  c.ellipse(cx - 20, cy - 28, 30, 17, -0.45, 0, Math.PI * 2)
  c.fillStyle = 'rgba(255,255,255,0.4)'
  c.fill()
  c.beginPath()
  c.ellipse(cx + 28, cy - 6, 11, 6, 0.35, 0, Math.PI * 2)
  c.fillStyle = 'rgba(255,255,255,0.16)'
  c.fill()

  if (props.result.effect === 'glitter') {
    const t = performance.now() / 1000
    const rw = Math.max(30, (maxX - minX) * 0.38)
    const rh = Math.max(18, (maxY - minY) * 0.38)
    for (const s of sparks) {
      const x = cx + Math.cos(s.ang + t * 0.12) * rw * s.r
      const y = cy + Math.sin(s.ang + t * 0.12) * rh * s.r
      const flash = 0.3 + 0.7 * Math.abs(Math.sin(t * 3.2 + s.phase))
      c.save()
      c.translate(x, y)
      c.rotate(s.ang + t)
      c.fillStyle = `rgba(255,255,255,${0.3 + flash * 0.6})`
      c.fillRect(-s.size, -s.size * 0.32, s.size * 2, s.size * 0.64)
      c.fillStyle = `rgba(180,220,255,${flash * 0.55})`
      c.fillRect(-s.size * 0.45, -s.size * 0.12, s.size * 0.9, s.size * 0.24)
      c.restore()
    }
  }

  if (magCtx && props.result.effect === 'iron') {
    const m = magCtx
    m.setTransform(dpr, 0, 0, dpr, 0, 0)
    m.clearRect(0, 0, cssW, cssH)
    m.font = '38px sans-serif'
    m.textAlign = 'center'
    m.textBaseline = 'middle'
    m.fillText('🧲', magX, magY)
  }
}

function loop() {
  if (!running) return
  integrate()
  draw()
  raf = requestAnimationFrame(loop)
}

function localPos(e: TouchEvent | MouseEvent, el: HTMLCanvasElement) {
  const rect = el.getBoundingClientRect()
  if ('touches' in e && e.touches[0]) {
    return {
      x: ((e.touches[0].clientX - rect.left) / rect.width) * cssW,
      y: ((e.touches[0].clientY - rect.top) / rect.height) * cssH,
    }
  }
  const me = e as MouseEvent
  return {
    x: ((me.clientX - rect.left) / rect.width) * cssW,
    y: ((me.clientY - rect.top) / rect.height) * cssH,
  }
}

function nearestRing(x: number, y: number) {
  let best = 1
  let bestD = Infinity
  for (let i = 1; i < pts.length; i++) {
    const d = Math.hypot(pts[i].x - x, pts[i].y - y)
    if (d < bestD) {
      bestD = d
      best = i
    }
  }
  return { idx: best, d: bestD }
}

function maybeHaptic() {
  const now = Date.now()
  if (now - lastHaptic < 85) return
  lastHaptic = now
  dragPulse(props.result.hardness)
}

function startPoke(x: number, y: number) {
  pokeX = x
  pokeY = y
  pokeT = physical() === 'firm' ? 8 : physical() === 'runny' ? 16 : 12
  markInteract(1100)
  lightTap()
  playSfx('tap')
  maybeHaptic()
}

function onTouchStart(e: TouchEvent) {
  if (!canvas) return
  const { x, y } = localPos(e, canvas)
  const { idx, d } = nearestRing(x, y)
  const toCenter = Math.hypot(pts[0].x - x, pts[0].y - y)
  // 扁坨命中区更宽
  if (d < 48 || toCenter < 90) {
    mode = 'drag'
    grabIdx = d < 48 ? idx : 0
    grabX = x
    grabY = y
    markInteract(1200)
    maybeHaptic()
  } else {
    mode = 'poke'
    startPoke(x, y)
  }
}

function onTouchMove(e: TouchEvent) {
  if (mode !== 'drag' || !canvas) return
  const { x, y } = localPos(e, canvas)
  grabX = x
  grabY = y
  markInteract(800)
  maybeHaptic()
}

function onTouchEnd() {
  if (mode === 'drag') lightTap()
  // 短冷却后强回中；按住不动时已在 integrate 里冻住
  markInteract(380)
  mode = 'idle'
  grabIdx = -1
}

function onMouseDown(e: MouseEvent) {
  if (!canvas) return
  const { x, y } = localPos(e, canvas)
  const { idx, d } = nearestRing(x, y)
  const toCenter = Math.hypot(pts[0].x - x, pts[0].y - y)
  if (d < 48 || toCenter < 90) {
    mode = 'drag'
    grabIdx = d < 48 ? idx : 0
    grabX = x
    grabY = y
    markInteract(1200)
  } else {
    startPoke(x, y)
  }
  const move = (ev: MouseEvent) => {
    if (mode !== 'drag' || !canvas) return
    const p = localPos(ev, canvas)
    grabX = p.x
    grabY = p.y
    markInteract(800)
    maybeHaptic()
  }
  const up = () => {
    markInteract(380)
    mode = 'idle'
    grabIdx = -1
    window.removeEventListener('mousemove', move)
    window.removeEventListener('mouseup', up)
  }
  window.addEventListener('mousemove', move)
  window.addEventListener('mouseup', up)
}

function onMagStart(e: TouchEvent) {
  if (!magCanvas) return
  const { x, y } = localPos(e, magCanvas)
  if (Math.hypot(x - magX, y - magY) > 44) return
  magGrab = true
  magSx = x
  magSy = y
  magOx = magX
  magOy = magY
}

function onMagMove(e: TouchEvent) {
  if (!magGrab || !magCanvas) return
  const { x, y } = localPos(e, magCanvas)
  magX = magOx + (x - magSx)
  magY = magOy + (y - magSy)
}

function onMagEnd() {
  magGrab = false
}

function onMagMouseDown(e: MouseEvent) {
  if (!magCanvas) return
  const { x, y } = localPos(e, magCanvas)
  if (Math.hypot(x - magX, y - magY) > 44) return
  magGrab = true
  magSx = x
  magSy = y
  magOx = magX
  magOy = magY
  const move = (ev: MouseEvent) => {
    if (!magGrab || !magCanvas) return
    const p = localPos(ev, magCanvas)
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
}

function bindDom() {
  const host = hostEl()
  if (!host) return false
  dpr = Math.min(window.devicePixelRatio || 1, 2)
  const list = host.querySelectorAll('canvas')
  canvas = list[0] as HTMLCanvasElement
  magCanvas = (list[1] as HTMLCanvasElement) || null
  if (!canvas) return false
  canvas.width = Math.round(cssW * dpr)
  canvas.height = Math.round(cssH * dpr)
  ctx = canvas.getContext('2d')
  if (magCanvas) {
    magCanvas.width = Math.round(cssW * dpr)
    magCanvas.height = Math.round(cssH * dpr)
    magCtx = magCanvas.getContext('2d')
  } else {
    magCtx = null
  }
  return !!ctx
}

function start() {
  stop()
  initMesh()
  nextTick(() => {
    if (!bindDom()) {
      setTimeout(() => {
        if (bindDom()) {
          running = true
          loop()
        }
      }, 60)
      return
    }
    running = true
    loop()
  })
}

function stop() {
  running = false
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
  width: 320px;
  max-width: 100%;
  height: 280px;
  margin: 0 auto;
  touch-action: none;
}
.soft__canvas {
  display: block;
  width: 320px;
  max-width: 100%;
  height: 280px;
  border-radius: 20px;
}
.soft__magnet-layer {
  position: absolute;
  left: 0;
  top: 0;
  width: 320px;
  max-width: 100%;
  height: 280px;
  z-index: 2;
  touch-action: none;
}
.soft__magnet-hint {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 6px;
  text-align: center;
  font-size: 22rpx;
  color: #0277bd;
  pointer-events: none;
  z-index: 1;
}
</style>
