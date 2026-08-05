<template>
  <view class="soft-wrap">
    <view
      :id="hostId"
      class="soft"
      @touchstart.prevent="onTouchStart"
      @touchmove.prevent="onTouchMove"
      @touchend.prevent="onTouchEnd"
      @touchcancel.prevent="onTouchEnd"
      @mousedown.prevent="onMouseDown"
    >
      <svg class="soft__svg" :viewBox="`0 0 ${W} ${H}`" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient :id="gradId" cx="38%" cy="32%" r="70%">
            <stop offset="0%" :stop-color="grad.hi" />
            <stop offset="45%" :stop-color="grad.mid" />
            <stop offset="100%" :stop-color="grad.lo" />
          </radialGradient>
          <filter v-if="glowOn" :id="glowId" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="8" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <ellipse
          :cx="shadow.cx"
          :cy="shadow.cy"
          :rx="shadow.rx"
          ry="8"
          fill="rgba(1,87,155,0.14)"
        />

        <path
          v-if="glowOn"
          :d="pathD"
          :fill="result.color"
          opacity="0.45"
          :filter="`url(#${glowId})`"
        />
        <path
          :d="pathD"
          :fill="`url(#${gradId})`"
          :opacity="result.opaque ? 1 : 0.92"
          stroke="rgba(255,255,255,0.42)"
          stroke-width="2"
        />
        <ellipse
          :cx="shine.cx"
          :cy="shine.cy"
          rx="22"
          ry="12"
          fill="rgba(255,255,255,0.32)"
          :transform="`rotate(-22 ${shine.cx} ${shine.cy})`"
        />

        <circle
          v-for="(g, i) in glitterPts"
          :key="i"
          :cx="g.x"
          :cy="g.y"
          r="2.2"
          fill="rgba(255,255,255,0.85)"
          opacity="0.9"
        />

        <text
          v-if="result.effect === 'iron'"
          :x="mag.x"
          :y="mag.y"
          font-size="34"
          text-anchor="middle"
          dominant-baseline="middle"
        >
          🧲
        </text>
      </svg>
    </view>
    <text class="hint">戳一下会凹 · 拖边缘会扭成不规则形状 · 松手回中间</text>
  </view>
</template>

<script setup lang="ts">
/**
 * SVG 轮廓软体：一圈 Verlet 弹簧点 + 平滑贝塞尔路径，
 * 拖拽局部拉扯成不规则曲线（不依赖 uni-canvas）。
 */
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
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
const W = 300
const H = 260
const hostId = `slime-soft-${Math.random().toString(36).slice(2, 9)}`
const gradId = `${hostId}-g`
const glowId = `${hostId}-glow`

type Pt = { x: number; y: number; px: number; py: number }
type Spring = { a: number; b: number; len: number; k: number }

const pathD = ref('')
const glitterPts = ref<{ x: number; y: number }[]>([])
const shadow = reactive({ cx: W / 2, cy: H * 0.7, rx: 50 })
const shine = reactive({ cx: W / 2 - 16, cy: H * 0.32 })
const mag = reactive({ x: W * 0.72, y: H * 0.28 })
const grad = reactive({ hi: '#fff', mid: '#4fc3f7', lo: '#0288d1' })

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
let magGrab = false
let magOx = 0
let magOy = 0
let magSx = 0
let magSy = 0

const glowOn = computed(() => props.result.effect === 'glow' && props.lightsOff)

function physical() {
  return props.result.physical
}

function feel() {
  // follow 越高边缘越跟手；拖拽时再临时削弱弹簧，才能拉出尖角/不规则曲线
  if (physical() === 'runny') return { kRing: 0.08, kCenter: 0.04, kSkip: 0.03, poke: 32, follow: 0.88 }
  if (physical() === 'firm') return { kRing: 0.22, kCenter: 0.16, kSkip: 0.12, poke: 12, follow: 0.42 }
  return { kRing: 0.12, kCenter: 0.09, kSkip: 0.06, poke: 18, follow: 0.68 }
}

function dist(a: { x: number; y: number }, b: { x: number; y: number }) {
  return Math.hypot(a.x - b.x, a.y - b.y)
}

function hexRgb(hex: string) {
  const h = hex.replace('#', '')
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h
  const n = parseInt(full || '4fc3f7', 16)
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 }
}

function rgba(r: number, g: number, b: number, a: number) {
  return `rgba(${r},${g},${b},${a})`
}

function updateGrad() {
  const { r, g, b } = hexRgb(props.result.color)
  if (props.result.effect === 'pearl') {
    grad.hi = 'rgba(255,255,255,0.85)'
    grad.mid = rgba(r, g, b, props.result.opaque ? 0.9 : 0.55)
    grad.lo = 'rgba(186,104,200,0.55)'
  } else if (props.result.opaque) {
    grad.hi = 'rgba(255,255,255,0.55)'
    grad.mid = rgba(r, g, b, 0.98)
    grad.lo = rgba(Math.max(0, r - 40), Math.max(0, g - 28), Math.max(0, b - 18), 1)
  } else {
    grad.hi = 'rgba(255,255,255,0.5)'
    grad.mid = rgba(r, g, b, 0.55)
    grad.lo = rgba(r, g, b, 0.85)
  }
}

function buildHome() {
  const cx = W * 0.5
  const cy = H * 0.42
  const rx = physical() === 'runny' ? 96 : physical() === 'firm' ? 78 : 88
  const ry = physical() === 'runny' ? 42 : physical() === 'firm' ? 54 : 48
  home = [{ x: cx, y: cy }]
  pts = [{ x: cx, y: cy, px: cx, py: cy }]
  for (let i = 0; i < RING; i++) {
    const a = (i / RING) * Math.PI * 2 - Math.PI / 2
    const bottom = Math.sin(a)
    const flat = bottom > 0 ? 1 - bottom * 0.28 : 1 + -bottom * 0.08
    const lobe = 1 + 0.06 * Math.sin(a * 3 + 0.4) + 0.03 * Math.sin(a * 5)
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
  mag.x = W * 0.72
  mag.y = H * 0.28
  updateGrad()
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
    p.x = Math.min(W - 12, Math.max(12, p.x))
    p.y = Math.min(H - 12, Math.max(12, p.y))
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
    const dx = mag.x - pts[0].x
    const dy = mag.y - pts[0].y
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
    // 拖中心时也抓最近边缘，避免整块平移却不扭曲
    let edge = grabIdx
    if (grabIdx === 0) edge = nearest(grabX, grabY).idx

    // 限制单点拉得太开，避免折成一串泡泡
    const homeEdge = home[edge]
    let tx = grabX
    let ty = grabY
    const maxPull = physical() === 'runny' ? 95 : physical() === 'firm' ? 55 : 75
    const pullD = Math.hypot(tx - homeEdge.x, ty - homeEdge.y)
    if (pullD > maxPull) {
      const s = maxPull / pullD
      tx = homeEdge.x + (tx - homeEdge.x) * s
      ty = homeEdge.y + (ty - homeEdge.y) * s
    }

    const g = pts[edge]
    g.x += (tx - g.x) * f.follow
    g.y += (ty - g.y) * f.follow
    const i = edge - 1
    const n1 = ((i - 1 + RING) % RING) + 1
    const n2 = ((i + 1) % RING) + 1
    const n3 = ((i - 2 + RING) % RING) + 1
    const n4 = ((i + 2) % RING) + 1
    const pull = [
      [n1, 0.5],
      [n2, 0.5],
      [n3, 0.22],
      [n4, 0.22],
      [0, 0.2],
    ] as const
    for (const [n, w] of pull) {
      pts[n].x += (tx - pts[n].x) * f.follow * w
      pts[n].y += (ty - pts[n].y) * f.follow * w
    }
    // 拖拽时多跑几轮弹簧，保持一整块胶体而不是糖葫芦
    for (let iter = 0; iter < 3; iter++) {
      for (const s of springs) {
        const A = pts[s.a]
        const B = pts[s.b]
        const dx = B.x - A.x
        const dy = B.y - A.y
        const d = Math.hypot(dx, dy) || 0.0001
        const maxLen = s.len * 1.5
        let force: number
        if (d > maxLen) {
          force = ((d - maxLen) / d) * 0.5
        } else {
          force = ((d - s.len) / d) * 0.5 * s.k * 0.7
        }
        A.x += dx * force
        A.y += dy * force
        B.x -= dx * force
        B.y -= dy * force
      }
    }
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

function buildPath() {
  const ring = pts.slice(1)
  if (ring.length < 3) {
    pathD.value = ''
    return
  }
  let d = ''
  for (let i = 0; i < ring.length; i++) {
    const p0 = ring[(i - 1 + ring.length) % ring.length]
    const p1 = ring[i]
    const p2 = ring[(i + 1) % ring.length]
    const p3 = ring[(i + 2) % ring.length]
    if (i === 0) d += `M ${p1.x.toFixed(2)} ${p1.y.toFixed(2)}`
    d += ` C ${(p1.x + (p2.x - p0.x) / 6).toFixed(2)} ${(p1.y + (p2.y - p0.y) / 6).toFixed(2)}, ${(
      p2.x -
      (p3.x - p1.x) / 6
    ).toFixed(2)} ${(p2.y - (p3.y - p1.y) / 6).toFixed(2)}, ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`
  }
  pathD.value = d + ' Z'

  let maxY = ring[0].y
  let minY = ring[0].y
  let minX = ring[0].x
  let maxX = ring[0].x
  for (const p of ring) {
    maxY = Math.max(maxY, p.y)
    minY = Math.min(minY, p.y)
    minX = Math.min(minX, p.x)
    maxX = Math.max(maxX, p.x)
  }
  shadow.cx = pts[0].x
  shadow.cy = Math.min(H - 8, maxY + 10)
  shadow.rx = Math.max(40, (maxX - minX) * 0.4)
  const bodyH = Math.max(40, maxY - minY)
  shine.cx = pts[0].x - 16
  shine.cy = pts[0].y - bodyH * 0.25

  if (props.result.effect === 'glitter') {
    const out: { x: number; y: number }[] = []
    for (let i = 0; i < 10; i++) {
      const p = ring[(i * 2) % ring.length]
      const n = ring[(i * 2 + 3) % ring.length]
      out.push({
        x: (p.x + n.x) * 0.5 * 0.55 + pts[0].x * 0.45,
        y: (p.y + n.y) * 0.5 * 0.55 + pts[0].y * 0.45,
      })
    }
    glitterPts.value = out
  } else {
    glitterPts.value = []
  }
}

function loop(t: number) {
  if (!running || t !== token) return
  integrate()
  buildPath()
  raf = requestAnimationFrame(() => loop(t))
}

function hostRect() {
  try {
    if (typeof document !== 'undefined') {
      const el = document.getElementById(hostId)
      if (el) return el.getBoundingClientRect()
    }
  } catch {
    /* ignore */
  }
  return { left: 0, top: 0, width: W, height: H } as DOMRect
}

function touchClient(e: any) {
  const t = e?.touches?.[0] || e?.changedTouches?.[0] || e
  return {
    x: t.clientX ?? t.pageX ?? t.x ?? 0,
    y: t.clientY ?? t.pageY ?? t.y ?? 0,
  }
}

function localPos(e: any) {
  const rect = hostRect()
  const { x, y } = touchClient(e)
  return {
    x: ((x - rect.left) / Math.max(1, rect.width)) * W,
    y: ((y - rect.top) / Math.max(1, rect.height)) * H,
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

function onTouchStart(e: any) {
  if (!pts.length) return
  const { x, y } = localPos(e)
  if (props.result.effect === 'iron' && Math.hypot(x - mag.x, y - mag.y) < 36) {
    magGrab = true
    magSx = x
    magSy = y
    magOx = mag.x
    magOy = mag.y
    return
  }
  const { idx, d } = nearest(x, y)
  const toC = Math.hypot(pts[0].x - x, pts[0].y - y)
  if (d < 48 || toC < 90) {
    mode = 'drag'
    grabIdx = d < 48 ? idx : 0
    grabX = x
    grabY = y
    haptic()
    playSfx('tap')
  } else {
    pokeX = x
    pokeY = y
    pokeT = physical() === 'runny' ? 16 : 10
    lightTap()
    playSfx('tap')
  }
}

function onTouchMove(e: any) {
  const { x, y } = localPos(e)
  if (magGrab) {
    mag.x = magOx + (x - magSx)
    mag.y = magOy + (y - magSy)
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
  coolUntil = performance.now() + 220
}

function onMouseDown(e: MouseEvent) {
  onTouchStart(e)
  const move = (ev: MouseEvent) => onTouchMove(ev)
  const up = () => {
    onTouchEnd()
    window.removeEventListener('mousemove', move)
    window.removeEventListener('mouseup', up)
  }
  window.addEventListener('mousemove', move)
  window.addEventListener('mouseup', up)
}

function start() {
  stop()
  mode = 'idle'
  pokeT = 0
  coolUntil = 0
  buildHome()
  snapHome()
  buildPath()
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
  () => start()
)

onMounted(() => start())
onBeforeUnmount(() => stop())
</script>

<style scoped lang="scss">
.soft-wrap {
  width: 300px;
  margin: 0 auto;
}
.soft {
  position: relative;
  width: 300px;
  height: 260px;
  touch-action: none;
}
.soft__svg {
  display: block;
  width: 300px;
  height: 260px;
  overflow: visible;
  pointer-events: none;
}
.hint {
  display: block;
  margin-top: 4px;
  text-align: center;
  font-size: 12px;
  color: #0277bd;
  pointer-events: none;
}
</style>
