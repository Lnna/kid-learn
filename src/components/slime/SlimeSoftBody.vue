<template>
  <view
    class="soft"
    @touchstart.prevent="onStart"
    @touchmove.prevent="onMove"
    @touchend.prevent="onEnd"
    @touchcancel.prevent="onEnd"
    @mousedown.prevent="onMouseDown"
  >
    <view
      class="blob"
      :class="[
        result.physical,
        {
          glow: result.effect === 'glow' && lightsOff,
          pearl: result.effect === 'pearl',
          glitter: result.effect === 'glitter',
          dragging,
        },
      ]"
      :style="blobStyle"
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
    <text class="hint">按住拖动会拉长/压扁 · 松手回中间</text>
  </view>
</template>

<script setup lang="ts">
/**
 * 纯 CSS 胶体：触摸绑在整块实验区上，保证手机拖动不断触；
 * 用宽高+圆角模拟拉长/压扁，形变幅度明显。
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
const w = ref(1)
const h = ref(1)
const skew = ref(0)
const dragging = ref(false)
const last = reactive({ x: 0, y: 0 })
const origin = reactive({ x: 0, y: 0 })
const mag = reactive({ x: 80, y: -40 })
const magDrag = reactive({ on: false, ox: 0, oy: 0, sx: 0, sy: 0 })
let lastHaptic = 0

const baseSize = computed(() => {
  if (props.result.physical === 'runny') return { w: 250, h: 120 }
  if (props.result.physical === 'firm') return { w: 200, h: 170 }
  return { w: 220, h: 150 }
})

const resist = computed(() => {
  if (props.result.physical === 'firm') return 0.4
  if (props.result.physical === 'runny') return 1.05
  return 0.7
})

const blobStyle = computed(() => {
  const bw = baseSize.value.w * w.value
  const bh = baseSize.value.h * h.value
  // 横向拖更扁长，纵向拖更瘦高
  const br =
    Math.abs(skew.value) > 0.2
      ? `${48 + skew.value * 10}% ${52 - skew.value * 10}% ${55 + skew.value * 8}% ${45 - skew.value * 8}% / ${55 - Math.abs(skew.value) * 12}% ${50 + Math.abs(skew.value) * 8}% ${45 + Math.abs(skew.value) * 10}% ${50}%`
      : undefined
  return {
    background: props.result.color,
    opacity: props.result.opaque ? 1 : 0.84,
    width: bw + 'rpx',
    height: bh + 'rpx',
    borderRadius: br,
    transform: `translate(-50%, -50%) translate(${x.value}px, ${y.value}px) skewX(${skew.value * 8}deg)`,
  }
})

function sparkStyle(i: number) {
  const a = (i / 10) * Math.PI * 2
  return {
    left: 50 + Math.cos(a) * (28 + (i % 3) * 8) + '%',
    top: 45 + Math.sin(a) * (22 + (i % 2) * 8) + '%',
    animationDelay: i * 0.12 + 's',
  }
}

function touchXY(e: any) {
  const t = e?.touches?.[0] || e?.changedTouches?.[0] || e
  const tx = t.clientX ?? t.pageX ?? t.x ?? 0
  const ty = t.clientY ?? t.pageY ?? t.y ?? 0
  return { tx, ty }
}

function haptic() {
  const now = Date.now()
  if (now - lastHaptic < 80) return
  lastHaptic = now
  dragPulse(props.result.hardness)
}

function applyShapeFromDrag() {
  const dx = x.value
  const dy = y.value
  const dist = Math.hypot(dx, dy)
  const p = props.result.physical
  const maxStretch = p === 'firm' ? 1.35 : p === 'runny' ? 1.9 : 1.6
  const maxSquish = p === 'firm' ? 0.72 : p === 'runny' ? 0.45 : 0.55

  // 按拖拽主方向变形：横拉变宽变矮，纵拉变高变窄
  const ax = Math.abs(dx)
  const ay = Math.abs(dy)
  if (ax >= ay) {
    const k = Math.min(1, ax / 90)
    w.value = 1 + (maxStretch - 1) * k
    h.value = 1 - (1 - maxSquish) * k
    skew.value = Math.max(-1, Math.min(1, dx / 120))
  } else {
    const k = Math.min(1, ay / 90)
    w.value = 1 - (1 - maxSquish) * k * 0.85
    h.value = 1 + (maxStretch - 1) * k
    skew.value = Math.max(-0.6, Math.min(0.6, dx / 160))
  }

  // 距离越大整体越“拽得开”
  if (dist > 20) {
    const boost = Math.min(0.25, (dist - 20) / 400)
    if (ax >= ay) w.value += boost
    else h.value += boost
  }
}

function resetHome() {
  x.value = 0
  y.value = 0
  w.value = 1
  h.value = 1
  skew.value = 0
}

function onStart(e: any) {
  const { tx, ty } = touchXY(e)
  dragging.value = true
  last.x = tx
  last.y = ty
  origin.x = tx
  origin.y = ty
  // 按下立刻压扁一点，反馈“戳到了”
  const p = props.result.physical
  w.value = p === 'firm' ? 1.08 : 1.2
  h.value = p === 'firm' ? 0.9 : 0.72
  lightTap()
  playSfx('tap')
  haptic()
}

function onMove(e: any) {
  if (!dragging.value) return
  const { tx, ty } = touchXY(e)
  const dx = (tx - last.x) * resist.value
  const dy = (ty - last.y) * resist.value
  x.value += dx
  y.value += dy
  // 限制别拖出实验区太远
  x.value = Math.max(-120, Math.min(120, x.value))
  y.value = Math.max(-100, Math.min(100, y.value))
  last.x = tx
  last.y = ty
  applyShapeFromDrag()
  haptic()

  if (props.result.effect === 'iron') {
    const d = Math.hypot(x.value - mag.x, y.value - mag.y)
    if (d < 100) {
      const pullM = props.result.physical === 'firm' ? 0.07 : 0.18
      x.value += (mag.x - x.value) * pullM
      y.value += (mag.y - y.value) * pullM
      applyShapeFromDrag()
    }
  }
}

function onEnd() {
  if (!dragging.value) return
  dragging.value = false
  lightTap()
  // 回弹：先略过冲再回中
  const p = props.result.physical
  w.value = p === 'runny' ? 1.15 : 1.08
  h.value = p === 'runny' ? 0.88 : 0.95
  setTimeout(() => resetHome(), p === 'firm' ? 90 : 160)
}

function onMouseDown(e: MouseEvent) {
  onStart(e)
  const move = (ev: MouseEvent) => onMove(ev)
  const up = () => {
    onEnd()
    window.removeEventListener('mousemove', move)
    window.removeEventListener('mouseup', up)
  }
  window.addEventListener('mousemove', move)
  window.addEventListener('mouseup', up)
}

function onMagStart(e: any) {
  const { tx, ty } = touchXY(e)
  magDrag.on = true
  magDrag.sx = tx
  magDrag.sy = ty
  magDrag.ox = mag.x
  magDrag.oy = mag.y
}

function onMagMove(e: any) {
  if (!magDrag.on) return
  const { tx, ty } = touchXY(e)
  mag.x = magDrag.ox + (tx - magDrag.sx)
  mag.y = magDrag.oy + (ty - magDrag.sy)
  const d = Math.hypot(x.value - mag.x, y.value - mag.y)
  if (d < 110) {
    const pullM = props.result.physical === 'firm' ? 0.08 : 0.22
    x.value += (mag.x - x.value) * pullM
    y.value += (mag.y - y.value) * pullM
    applyShapeFromDrag()
  }
}

function onMagEnd() {
  magDrag.on = false
}

watch(
  () => props.result.fingerprint,
  () => resetHome()
)
</script>

<style scoped lang="scss">
.soft {
  position: relative;
  width: 100%;
  height: 440rpx;
  margin: 8rpx auto 0;
  touch-action: none;
}
.blob {
  position: absolute;
  left: 50%;
  top: 44%;
  width: 220rpx;
  height: 150rpx;
  border-radius: 50% 50% 46% 54% / 60% 60% 42% 42%;
  box-shadow:
    inset 0 -18rpx 36rpx rgba(0, 0, 0, 0.12),
    inset 0 16rpx 28rpx rgba(255, 255, 255, 0.35),
    0 16rpx 36rpx rgba(2, 136, 209, 0.22);
  will-change: transform, width, height, border-radius;
}
.blob.dragging {
  transition: none;
}
.blob:not(.dragging) {
  transition:
    transform 0.18s cubic-bezier(0.34, 1.4, 0.64, 1),
    width 0.18s cubic-bezier(0.34, 1.4, 0.64, 1),
    height 0.18s cubic-bezier(0.34, 1.4, 0.64, 1),
    border-radius 0.18s ease;
}
.blob.runny {
  border-radius: 46% 54% 58% 42% / 48% 45% 55% 52%;
}
.blob.firm {
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
  pointer-events: none;
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
  top: 28%;
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
