<template>
  <view class="soft">
    <view
      class="blob"
      :class="[result.physical, { glow: result.effect === 'glow' && lightsOff, pearl: result.effect === 'pearl', glitter: result.effect === 'glitter' }]"
      :style="blobStyle"
      @touchstart.prevent="onStart"
      @touchmove.prevent="onMove"
      @touchend.prevent="onEnd"
      @touchcancel.prevent="onEnd"
      @mousedown.prevent="onMouseDown"
    >
      <view v-if="result.effect === 'glitter'" class="sparks">
        <view v-for="i in 10" :key="i" class="spark" :style="sparkStyle(i)" />
      </view>
    </view>
    <view
      v-if="result.effect === 'iron'"
      class="magnet"
      :style="{ transform: `translate(${mag.x}px, ${mag.y}px)` }"
      @touchstart.stop.prevent="onMagStart"
      @touchmove.stop.prevent="onMagMove"
      @touchend.stop.prevent="onMagEnd"
    >
      🧲
    </view>
    <text v-if="result.effect === 'iron'" class="hint">拖动磁铁靠近胶体</text>
  </view>
</template>

<script setup lang="ts">
/**
 * 纯 CSS/transform 胶体：不依赖 uni-canvas，保证各端可见。
 * 闲置回中；按住保持；松手回弹。
 */
import { computed, reactive, ref, watch } from 'vue'
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

const x = ref(0)
const y = ref(0)
const stretch = ref(1)
const squish = ref(1)
const dragging = ref(false)
const last = reactive({ x: 0, y: 0 })
const mag = reactive({ x: 70, y: -30 })
const magDrag = reactive({ on: false, ox: 0, oy: 0, sx: 0, sy: 0 })
let lastHaptic = 0
let releaseTimer: ReturnType<typeof setTimeout> | null = null

const resist = computed(() => {
  if (props.result.physical === 'firm') return 0.35
  if (props.result.physical === 'runny') return 1
  return 0.65
})

const blobStyle = computed(() => {
  const sx = stretch.value
  const sy = squish.value / Math.sqrt(Math.max(0.5, sx))
  return {
    background: props.result.color,
    opacity: props.result.opaque ? 1 : 0.82,
    transform: `translate(-50%, -50%) translate(${x.value}px, ${y.value}px) scale(${sx}, ${sy})`,
  }
})

function sparkStyle(i: number) {
  const a = (i / 10) * Math.PI * 2
  return {
    left: 50 + Math.cos(a) * (28 + (i % 3) * 8) + '%',
    top: 45 + Math.sin(a) * (22 + (i % 2) * 8) + '%',
    animationDelay: (i * 0.12) + 's',
  }
}

function haptic() {
  const now = Date.now()
  if (now - lastHaptic < 90) return
  lastHaptic = now
  dragPulse(props.result.hardness)
}

function resetHome(animate = true) {
  if (releaseTimer) clearTimeout(releaseTimer)
  if (!animate) {
    x.value = 0
    y.value = 0
    stretch.value = 1
    squish.value = 1
    return
  }
  // 松手：先保持一瞬，再回到正中
  releaseTimer = setTimeout(() => {
    x.value = 0
    y.value = 0
    stretch.value = 1
    squish.value = 1
  }, 40)
}

function pokeBurst() {
  const p = props.result.physical
  stretch.value = p === 'firm' ? 1.12 : p === 'runny' ? 1.45 : 1.28
  squish.value = p === 'firm' ? 0.92 : p === 'runny' ? 0.7 : 0.82
  lightTap()
  playSfx('tap')
  haptic()
  setTimeout(() => {
    if (!dragging.value) {
      stretch.value = 1
      squish.value = 1
    }
  }, 180)
}

function onStart(e: TouchEvent) {
  const t = e.touches[0]
  dragging.value = true
  last.x = t.clientX
  last.y = t.clientY
  if (releaseTimer) clearTimeout(releaseTimer)
  pokeBurst()
}

function onMove(e: TouchEvent) {
  if (!dragging.value) return
  const t = e.touches[0]
  const dx = (t.clientX - last.x) * resist.value
  const dy = (t.clientY - last.y) * resist.value
  x.value += dx
  y.value += dy
  last.x = t.clientX
  last.y = t.clientY
  const pull = 1 + Math.min(0.55, Math.hypot(x.value, y.value) / 180)
  stretch.value = props.result.physical === 'firm' ? Math.min(pull, 1.18) : pull
  squish.value = props.result.physical === 'runny' ? 0.75 : 0.9
  haptic()

  // 磁铁吸引（距离近则胶体微移）
  if (props.result.effect === 'iron') {
    const mx = mag.x
    const my = mag.y
    const d = Math.hypot(x.value - mx, y.value - my)
    if (d < 90) {
      const pullM = props.result.physical === 'firm' ? 0.06 : 0.16
      x.value += (mx - x.value) * pullM
      y.value += (my - y.value) * pullM
    }
  }
}

function onEnd() {
  dragging.value = false
  lightTap()
  resetHome(true)
}

function onMouseDown(e: MouseEvent) {
  dragging.value = true
  last.x = e.clientX
  last.y = e.clientY
  if (releaseTimer) clearTimeout(releaseTimer)
  pokeBurst()
  const move = (ev: MouseEvent) => {
    if (!dragging.value) return
    const dx = (ev.clientX - last.x) * resist.value
    const dy = (ev.clientY - last.y) * resist.value
    x.value += dx
    y.value += dy
    last.x = ev.clientX
    last.y = ev.clientY
    const pull = 1 + Math.min(0.55, Math.hypot(x.value, y.value) / 180)
    stretch.value = props.result.physical === 'firm' ? Math.min(pull, 1.18) : pull
    haptic()
  }
  const up = () => {
    dragging.value = false
    resetHome(true)
    window.removeEventListener('mousemove', move)
    window.removeEventListener('mouseup', up)
  }
  window.addEventListener('mousemove', move)
  window.addEventListener('mouseup', up)
}

function onMagStart(e: TouchEvent) {
  const t = e.touches[0]
  magDrag.on = true
  magDrag.sx = t.clientX
  magDrag.sy = t.clientY
  magDrag.ox = mag.x
  magDrag.oy = mag.y
}

function onMagMove(e: TouchEvent) {
  if (!magDrag.on) return
  const t = e.touches[0]
  mag.x = magDrag.ox + (t.clientX - magDrag.sx)
  mag.y = magDrag.oy + (t.clientY - magDrag.sy)
  const d = Math.hypot(x.value - mag.x, y.value - mag.y)
  if (d < 100) {
    const pullM = props.result.physical === 'firm' ? 0.08 : 0.2
    x.value += (mag.x - x.value) * pullM
    y.value += (mag.y - y.value) * pullM
  }
}

function onMagEnd() {
  magDrag.on = false
}

watch(
  () => props.result.fingerprint,
  () => resetHome(false)
)
</script>

<style scoped lang="scss">
.soft {
  position: relative;
  width: 100%;
  height: 420rpx;
  margin: 12rpx auto 0;
  touch-action: none;
}
.blob {
  position: absolute;
  left: 50%;
  top: 46%;
  width: 220rpx;
  height: 150rpx;
  border-radius: 50% 50% 46% 54% / 60% 60% 42% 42%;
  box-shadow:
    inset 0 -18rpx 36rpx rgba(0, 0, 0, 0.12),
    inset 0 16rpx 28rpx rgba(255, 255, 255, 0.35),
    0 16rpx 36rpx rgba(2, 136, 209, 0.22);
  transition: border-radius 0.15s ease;
  will-change: transform;
}
.blob.runny {
  width: 250rpx;
  height: 120rpx;
  border-radius: 46% 54% 58% 42% / 48% 45% 55% 52%;
}
.blob.firm {
  width: 200rpx;
  height: 170rpx;
  border-radius: 48%;
}
.blob.glow {
  box-shadow:
    0 0 40rpx 14rpx rgba(105, 240, 174, 0.75),
    inset 0 -12rpx 24rpx rgba(0, 0, 0, 0.1);
}
.blob.pearl {
  background-image: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.5),
    transparent 35%,
    rgba(186, 104, 200, 0.28),
    transparent 70%,
    rgba(255, 255, 255, 0.35)
  ) !important;
}
.sparks {
  position: absolute;
  inset: 0;
}
.spark {
  position: absolute;
  width: 10rpx;
  height: 4rpx;
  margin-left: -5rpx;
  margin-top: -2rpx;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 2rpx;
  animation: twinkle 1.1s ease-in-out infinite;
}
@keyframes twinkle {
  50% {
    opacity: 0.25;
    transform: scale(0.7);
  }
}
.magnet {
  position: absolute;
  left: 50%;
  top: 30%;
  font-size: 48rpx;
  z-index: 3;
  touch-action: none;
}
.hint {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 8rpx;
  text-align: center;
  font-size: 22rpx;
  color: #0277bd;
}
</style>
