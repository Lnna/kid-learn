<template>
  <view class="soft">
    <!-- 始终可见的兜底胶体，避免 canvas 失败时整页空白 -->
    <view
      v-show="!canvasOk"
      class="fallback"
      :style="fallbackStyle"
      @touchstart.prevent="onCssTouchStart"
      @touchmove.prevent="onCssTouchMove"
      @touchend.prevent="onCssTouchEnd"
    />
    <canvas
      type="2d"
      id="slimeSoftBody"
      canvas-id="slimeSoftBody"
      class="soft__canvas"
      :style="{ width: cssW + 'px', height: cssH + 'px', opacity: canvasOk ? 1 : 0 }"
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
import { computed, getCurrentInstance, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
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

const RING = 18
const cssW = 300
const cssH = 260
const instance = getCurrentInstance()

type Pt = { x: number; y: number; px: number; py: number }
type Spring = { a: number; b: number; len: number; k: number }

const canvasOk = ref(false)
const cssStretch = ref(1)
const cssOx = ref(0)
const cssOy = ref(0)

let canvas: any = null
let ctx: CanvasRenderingContext2D | null = null
let dpr = 1
let pts: Pt[] = []
let home: { x: number; y: number }[] = []
let springs: Spring[] = []
let raf = 0
let running = false
let token = 0

let mode: 'idle' | 'drag' = 'idle'
let grabIdx = -1
let grabX = 0
let grabY = 0
let pokeT = 0
let pokeX = 0
let pokeY = 0
let coolUntil = 0
let lastHaptic = 0
let magX = cssW * 0.72
let magY = cssH * 0.3
let magGrab = false
let magOx = 0
let magOy = 0
let magSx = 0
let magSy = 0
let cssDragging = false
let cssLastX = 0
let cssLastY = 0

const fallbackStyle = computed(() => ({
  background: props.result.color,
  opacity: props.result.opaque ? 1 : 0.85,
  transform: `translate(${cssOx.value}px, ${cssOy.value}px) scale(${cssStretch.value}, ${1 / Math.sqrt(cssStretch.value)})`,
  boxShadow:
    props.result.effect === 'glow' && props.lightsOff
      ? `0 0 28px 10px ${props.result.color}`
      : 'inset 0 -12px 24px rgba(0,0,0,0.12), 0 10px 24px rgba(2,136,209,0.25)',
}))

function physical() {
  return props.result.physical
}

function feel() {
  if (physical() === 'runny') return { kRing: 0.1, kCenter: 0.05, kSkip: 0.04, poke: 28, follow: 0.7 }
  if (physical() === 'firm') return { kRing: 0.26, kCenter: 0.2, kSkip: 0.14, poke: 10, follow: 0.28 }
  return { kRing: 0.15, kCenter: 0.11, kSkip: 0.07, poke: 16, follow: 0.48 }
}

function dist(a: { x: number; y: number }, b: { x: number; y: number }) {
  return Math.hypot(a.x - b.x, a.y - b.y)
}

function buildHome() {
  const cx = cssW * 0.5
  const cy = cssH * 0.42
  const rx = physical() === 'runny' ? 96 : physical() === 'firm' ? 78 : 88
  const ry = physical() === 'runny' ? 42 : physical() === 'firm' ? 54 : 48
  home = [{ x: cx, y: cy }]
  pts = [{ x: cx, y: cy, px: cx, py: cy }]
  for (let i = 0; i < RING; i++) {
    const a = (i / RING) * Math.PI * 2 - Math.PI / 2
    const bottom = Math.sin(a)
    const flat = bottom > 0 ? 1 - bottom * 0.28 : 1 + (-bottom) * 0.08
    const lobe = 1 + 0.1 * Math.sin(a * 3 + 0.4) + 0.05 * Math.sin(a * 5)
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
  magX = cssW * 0.72
  magY = cssH * 0.28
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

function clamp() {
  for (const p of pts) {
    p.x = Math.min(cssW - 12, Math.max(12, p.x))
    p.y = Math.min(cssH - 12, Math.max(12, p.y))
  }
}

function integrate() {
  if (!pts.length) return
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
      if (d < 90) {
        const w = (1 - d / 90) * f.poke * (pokeT / 12)
        pts[i].x += (dx / d) * w
        pts[i].y += (dy / d) * w
      }
    }
  }

  if (props.result.effect === 'iron') {
    const dx = magX - pts[0].x
    const dy = magY - pts[0].y
    const d = Math.hypot(dx, dy)
    if (d < 100 && d > 1) {
      const pull = (physical() === 'firm' ? 0.04 : 0.1) * (1 - d / 100)
      for (let i = 0; i < pts.length; i++) {
        pts[i].x += dx * pull * (i === 0 ? 1 : 0.85)
        pts[i].y += dy * pull * (i === 0 ? 1 : 0.85)
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
      for (const n of [prev, next, 0]) {
        pts[n].x += (grabX - pts[n].x) * f.follow * (n === 0 ? 0.22 : 0.38)
        pts[n].y += (grabY - pts[n].y) * f.follow * (n === 0 ? 0.22 : 0.38)
      }
    }
    applySprings()
    clamp()
    for (const p of pts) {
      p.px = p.x
      p.py = p.y
    }
    return
  }

  if (!holding && !poking && !cooling) {
    snapHome()
    return
  }

  for (let i = 0; i < pts.length; i++) {
    pts[i].x += (home[i].x - pts[i].x) * 0.3
    pts[i].y += (home[i].y - pts[i].y) * 0.3
    pts[i].px = pts[i].x
    pts[i].py = pts[i].y
  }
}

function hexRgb(hex: string) {
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
    if (i === 0) c.moveTo(p1.x, p1.y)
    c.bezierCurveTo(
      p1.x + (p2.x - p0.x) / 6,
      p1.y + (p2.y - p0.y) / 6,
      p2.x - (p3.x - p1.x) / 6,
      p2.y - (p3.y - p1.y) / 6,
      p2.x,
      p2.y
    )
  }
  c.closePath()
}

function draw() {
  if (!ctx || !pts.length) return
  try {
    const c = ctx
    c.setTransform(dpr, 0, 0, dpr, 0, 0)
    c.clearRect(0, 0, cssW, cssH)
    const cx = pts[0].x
    const cy = pts[0].y
    const col = hexRgb(props.result.color)
    let maxY = pts[1].y
    let minY = pts[1].y
    let minX = pts[1].x
    let maxX = pts[1].x
    for (let i = 1; i < pts.length; i++) {
      maxY = Math.max(maxY, pts[i].y)
      minY = Math.min(minY, pts[i].y)
      minX = Math.min(minX, pts[i].x)
      maxX = Math.max(maxX, pts[i].x)
    }
    c.fillStyle = 'rgba(1,87,155,0.14)'
    c.beginPath()
    c.ellipse(cx, Math.min(cssH - 8, maxY + 8), Math.max(40, (maxX - minX) * 0.4), 8, 0, 0, Math.PI * 2)
    c.fill()

    if (props.result.effect === 'glow' && props.lightsOff) {
      c.save()
      c.shadowColor = `rgba(${col.r},${col.g},${col.b},0.9)`
      c.shadowBlur = 34
      pathBlob(c)
      c.fillStyle = `rgba(${col.r},${col.g},${col.b},0.5)`
      c.fill()
      c.restore()
    }

    pathBlob(c)
    const bodyH = Math.max(40, maxY - minY)
    const g = c.createRadialGradient(cx - 18, cy - bodyH * 0.3, 6, cx, cy + 6, Math.max(55, bodyH))
    if (props.result.opaque) {
      g.addColorStop(0, 'rgba(255,255,255,0.55)')
      g.addColorStop(0.4, `rgba(${col.r},${col.g},${col.b},0.98)`)
      g.addColorStop(1, `rgba(${Math.max(0, col.r - 40)},${Math.max(0, col.g - 28)},${Math.max(0, col.b - 18)},1)`)
    } else {
      g.addColorStop(0, 'rgba(255,255,255,0.5)')
      g.addColorStop(0.45, `rgba(${col.r},${col.g},${col.b},0.5)`)
      g.addColorStop(1, `rgba(${col.r},${col.g},${col.b},0.82)`)
    }
    c.fillStyle = g
    c.fill()
    pathBlob(c)
    c.strokeStyle = 'rgba(255,255,255,0.45)'
    c.lineWidth = 2
    c.stroke()
    c.beginPath()
    c.ellipse(cx - 16, cy - bodyH * 0.25, 22, 12, -0.4, 0, Math.PI * 2)
    c.fillStyle = 'rgba(255,255,255,0.35)'
    c.fill()

    if (props.result.effect === 'iron') {
      c.font = '34px sans-serif'
      c.textAlign = 'center'
      c.textBaseline = 'middle'
      c.fillText('🧲', magX, magY)
    }
  } catch {
    canvasOk.value = false
  }
}

function loop(t: number) {
  if (!running || t !== token) return
  try {
    integrate()
    draw()
  } catch {
    canvasOk.value = false
  }
  raf = requestAnimationFrame(() => loop(t))
}

function localPos(e: TouchEvent | MouseEvent) {
  const rect = (e.target as HTMLElement)?.getBoundingClientRect?.() || { left: 0, top: 0, width: cssW, height: cssH }
  const src = 'touches' in e && e.touches[0] ? e.touches[0] : (e as MouseEvent)
  return {
    x: ((src.clientX - rect.left) / Math.max(1, rect.width)) * cssW,
    y: ((src.clientY - rect.top) / Math.max(1, rect.height)) * cssH,
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

function onTouchStart(e: TouchEvent) {
  if (!canvasOk.value || !pts.length) return
  const { x, y } = localPos(e)
  if (props.result.effect === 'iron' && Math.hypot(x - magX, y - magY) < 36) {
    magGrab = true
    magSx = x
    magSy = y
    magOx = magX
    magOy = magY
    return
  }
  const { idx, d } = nearest(x, y)
  const toC = Math.hypot(pts[0].x - x, pts[0].y - y)
  if (d < 42 || toC < 80) {
    mode = 'drag'
    grabIdx = d < 42 ? idx : 0
    grabX = x
    grabY = y
    haptic()
  } else {
    pokeX = x
    pokeY = y
    pokeT = physical() === 'runny' ? 16 : 10
    lightTap()
    playSfx('tap')
  }
}

function onTouchMove(e: TouchEvent) {
  if (!canvasOk.value) return
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
  magGrab = false
  if (mode === 'drag') lightTap()
  mode = 'idle'
  grabIdx = -1
  coolUntil = performance.now() + 200
}

function onMouseDown(e: MouseEvent) {
  if (!canvasOk.value || !pts.length) return
  const { x, y } = localPos(e)
  const { idx, d } = nearest(x, y)
  const toC = Math.hypot(pts[0].x - x, pts[0].y - y)
  if (d < 42 || toC < 80) {
    mode = 'drag'
    grabIdx = d < 42 ? idx : 0
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
  }
  const up = () => {
    mode = 'idle'
    grabIdx = -1
    coolUntil = performance.now() + 200
    window.removeEventListener('mousemove', move)
    window.removeEventListener('mouseup', up)
  }
  window.addEventListener('mousemove', move)
  window.addEventListener('mouseup', up)
}

function onCssTouchStart(e: TouchEvent) {
  const t = e.touches[0]
  cssDragging = true
  cssLastX = t.clientX
  cssLastY = t.clientY
  cssStretch.value = physical() === 'firm' ? 1.08 : 1.25
  lightTap()
  playSfx('tap')
}

function onCssTouchMove(e: TouchEvent) {
  if (!cssDragging) return
  const t = e.touches[0]
  cssOx.value += (t.clientX - cssLastX) * (physical() === 'firm' ? 0.35 : 0.8)
  cssOy.value += (t.clientY - cssLastY) * (physical() === 'firm' ? 0.35 : 0.8)
  cssLastX = t.clientX
  cssLastY = t.clientY
  cssStretch.value = Math.min(1.45, cssStretch.value + 0.01)
  haptic()
}

function onCssTouchEnd() {
  cssDragging = false
  cssStretch.value = 1
  cssOx.value = 0
  cssOy.value = 0
  lightTap()
}

function bindCanvas(): Promise<boolean> {
  return new Promise((resolve) => {
    const finish = (node: any) => {
      try {
        if (!node || !node.getContext) {
          resolve(false)
          return
        }
        dpr = Math.min((typeof window !== 'undefined' && window.devicePixelRatio) || 1, 2)
        canvas = node
        canvas.width = Math.round(cssW * dpr)
        canvas.height = Math.round(cssH * dpr)
        ctx = canvas.getContext('2d')
        resolve(!!ctx)
      } catch {
        resolve(false)
      }
    }

    try {
      if (typeof document !== 'undefined') {
        const el = document.getElementById('slimeSoftBody') as HTMLCanvasElement | null
        if (el && typeof el.getContext === 'function') {
          finish(el)
          return
        }
        const wrap = document.getElementById('slimeSoftBody')
        const inner = wrap?.querySelector?.('canvas') as HTMLCanvasElement | null
        if (inner && typeof inner.getContext === 'function') {
          finish(inner)
          return
        }
      }
      resolve(false)
    } catch {
      resolve(false)
    }
  })
}

async function start() {
  stop()
  mode = 'idle'
  pokeT = 0
  coolUntil = 0
  buildHome()
  snapHome()
  await nextTick()
  const ok = await bindCanvas()
  canvasOk.value = ok
  if (!ok) return
  running = true
  token += 1
  loop(token)
}

function stop() {
  running = false
  token += 1
  if (raf) cancelAnimationFrame(raf)
  raf = 0
}

watch(
  () => [props.result.fingerprint, props.result.physical, props.result.effect, props.result.color, props.lightsOff],
  () => {
    start().catch(() => {
      canvasOk.value = false
    })
  }
)

onMounted(() => {
  start().catch(() => {
    canvasOk.value = false
  })
})
onBeforeUnmount(() => stop())
</script>

<style scoped lang="scss">
.soft {
  position: relative;
  width: 300px;
  height: 260px;
  margin: 0 auto;
  touch-action: none;
}
.soft__canvas {
  position: absolute;
  inset: 0;
  display: block;
  width: 300px;
  height: 260px;
}
.fallback {
  position: absolute;
  left: 50%;
  top: 42%;
  width: 180px;
  height: 110px;
  margin-left: -90px;
  margin-top: -55px;
  border-radius: 50% 50% 46% 54% / 62% 62% 40% 40%;
  z-index: 1;
}
.soft__hint {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 4px;
  text-align: center;
  font-size: 12px;
  color: #0277bd;
  pointer-events: none;
  z-index: 2;
}
</style>
