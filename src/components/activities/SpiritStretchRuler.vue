<template>
  <view class="stretch">
    <text class="stretch__title">{{ activity.title }}</text>
    <text class="stretch__hint">{{ activity.instruction || '点刻度或拖把手，让长度对准目标数字' }}</text>

    <view v-if="!unlocked" class="lock-card">
      <text class="lock-card__t">变形学具尚未解锁</text>
      <text class="lock-card__d">满星通关得黄金饲料，去「我的小精灵」喂饱后就能玩</text>
      <KButton label="去喂食" color="#FFC84A" @click="goSpirit" />
      <KButton label="跳过本活动" variant="ghost" @click="skip" />
    </view>

    <template v-else>
      <view class="target">
        <text class="target__label">拉到</text>
        <text class="target__n">{{ activity.target }}</text>
      </view>

      <view class="track-card">
        <!-- 刻度与精灵共用同一坐标系：第 n 格右缘 = n/max -->
        <view
          class="track"
          @touchstart.prevent="onPointer"
          @touchmove.prevent="onPointer"
          @touchend.prevent="onEnd"
          @mousedown.prevent="onMouseDown"
        >
          <view class="track__rail" />
          <view
            class="blob"
            :style="{
              width: endPct + '%',
              background: `linear-gradient(90deg, ${color}, ${color}cc)`,
            }"
          >
            <text class="blob__face">◕‿◕</text>
            <!-- 把手始终露在末端外，满刻度也能往回拖 -->
            <view class="handle" :style="{ background: color }">
              <text class="handle__n">{{ value }}</text>
            </view>
          </view>
        </view>

        <view class="ruler">
          <view
            v-for="n in maxN"
            :key="n"
            class="tick"
            :class="{ on: value === n, hit: value === activity.target && settled }"
            :style="{ width: cellPct + '%' }"
            @click.stop="setValue(n)"
          >
            <view class="tick__mark" />
            <text class="tick__n">{{ n }}</text>
          </view>
        </view>
      </view>

      <text class="value">现在对准刻度：{{ value }}</text>
      <KButton label="确认" :color="color" :disabled="!settled" @click="confirm" />
    </template>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { SpiritStretchRulerActivity } from '../../engine/types'
import { areToolsUnlocked } from '../../engine/spiritStore'
import { playSfx } from '../../utils/sfx'
import { lightTap } from '../../utils/haptics'
import { emitSpiritReact } from '../../utils/spiritMiss'
import KButton from '../ui/KButton.vue'

const props = withDefaults(
  defineProps<{
    activity: SpiritStretchRulerActivity
    color?: string
  }>(),
  { color: '#FFC84A' }
)
const emit = defineEmits<{ done: [score: { correct: number; total: number }] }>()

const unlocked = ref(areToolsUnlocked())
const maxN = computed(() => props.activity.max || 10)
const value = ref(1)
const settled = ref(false)
const trackLeft = ref(0)
const trackWidth = ref(1)

/** 第 n 格占宽，精灵右缘对齐第 value 格右缘 */
const cellPct = computed(() => 100 / maxN.value)
const endPct = computed(() => (value.value / maxN.value) * 100)

function clientXOf(e: any) {
  const t = e?.touches?.[0] || e?.changedTouches?.[0] || e
  return t.clientX ?? t.pageX ?? 0
}

function measureTrack(el: EventTarget | null) {
  const node = (el as HTMLElement) || null
  const rect = node?.getBoundingClientRect?.()
  if (rect && rect.width > 0) {
    trackLeft.value = rect.left
    trackWidth.value = rect.width
  }
}

/** 按落点落到最近刻度（格中心吸附） */
function nearestTick(clientX: number) {
  const x = clientX - trackLeft.value
  const w = Math.max(1, trackWidth.value)
  const cell = w / maxN.value
  // 落在第几格：0..maxN-1，再 +1
  const idx = Math.floor(x / cell)
  return Math.max(1, Math.min(maxN.value, idx + 1))
}

function setValue(n: number) {
  const next = Math.max(1, Math.min(maxN.value, n))
  if (next !== value.value) {
    value.value = next
    lightTap()
    playSfx('tap')
  }
  settled.value = true
}

function onPointer(e: any) {
  measureTrack(e.currentTarget)
  setValue(nearestTick(clientXOf(e)))
}

function onEnd() {
  settled.value = true
}

function onMouseDown(e: MouseEvent) {
  measureTrack(e.currentTarget)
  setValue(nearestTick(e.clientX))
  const move = (ev: MouseEvent) => setValue(nearestTick(ev.clientX))
  const up = () => {
    settled.value = true
    window.removeEventListener('mousemove', move)
    window.removeEventListener('mouseup', up)
  }
  window.addEventListener('mousemove', move)
  window.addEventListener('mouseup', up)
}

function confirm() {
  const ok = value.value === props.activity.target
  playSfx(ok ? 'correct' : 'wrong')
  emitSpiritReact(ok ? 'hit' : 'miss')
  setTimeout(() => {
    emit('done', { correct: ok ? 1 : 0, total: 1 })
  }, 500)
}

function skip() {
  emit('done', { correct: 1, total: 1 })
}

function goSpirit() {
  uni.navigateTo({ url: '/pages/spirit/home' })
}
</script>

<style scoped lang="scss">
.stretch__title {
  display: block;
  font-size: 40rpx;
  font-weight: 800;
  margin-bottom: 8rpx;
}
.stretch__hint {
  display: block;
  font-size: 26rpx;
  color: var(--color-muted);
  margin-bottom: 24rpx;
}
.lock-card {
  background: #fff;
  border-radius: var(--radius-lg);
  padding: 36rpx;
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  box-shadow: var(--shadow-soft);
}
.lock-card__t {
  font-size: 34rpx;
  font-weight: 900;
}
.lock-card__d {
  font-size: 26rpx;
  color: var(--color-muted);
}
.target {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 12rpx;
  margin-bottom: 20rpx;
}
.target__label {
  font-size: 28rpx;
  font-weight: 700;
}
.target__n {
  font-size: 64rpx;
  font-weight: 900;
}
.track-card {
  background: #fff;
  border-radius: var(--radius-lg);
  padding: 28rpx 28rpx 16rpx 20rpx;
  margin-bottom: 20rpx;
  box-shadow: var(--shadow-soft);
  overflow: visible;
}
.track {
  position: relative;
  width: 100%;
  height: 140rpx;
  display: flex;
  align-items: center;
  touch-action: none;
  overflow: visible;
}
.track__rail {
  position: absolute;
  left: 0;
  right: 0;
  height: 16rpx;
  border-radius: 999rpx;
  background: #f0e6d4;
}
.blob {
  position: relative;
  z-index: 1;
  height: 88rpx;
  min-width: 48rpx;
  border-radius: 999rpx;
  display: flex;
  align-items: center;
  padding-left: 16rpx;
  box-sizing: border-box;
  transition: width 0.05s linear;
  box-shadow:
    inset 0 -6rpx 0 rgba(0, 0, 0, 0.08),
    0 6rpx 12rpx rgba(0, 0, 0, 0.08);
  overflow: visible;
}
.blob__face {
  font-size: 26rpx;
  color: #2c2416;
  font-weight: 900;
}
.handle {
  position: absolute;
  right: -28rpx;
  top: 50%;
  transform: translateY(-50%);
  width: 56rpx;
  height: 56rpx;
  border-radius: 50%;
  border: 4rpx solid #fff;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.18);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
}
.handle__n {
  font-size: 24rpx;
  font-weight: 900;
  color: #2c2416;
}
.ruler {
  display: flex;
  width: 100%;
  margin-top: 12rpx;
}
.tick {
  text-align: center;
  box-sizing: border-box;
  padding: 8rpx 0;
}
.tick__mark {
  height: 14rpx;
  width: 4rpx;
  margin: 0 auto 4rpx;
  background: #d4c4a8;
  border-radius: 2rpx;
}
.tick.on .tick__mark {
  background: #4da3ff;
  height: 22rpx;
}
.tick.hit .tick__mark {
  background: #3ecf8e;
}
.tick__n {
  font-size: 22rpx;
  font-weight: 800;
  color: var(--color-muted);
}
.tick.on .tick__n {
  color: #4da3ff;
}
.tick.hit .tick__n {
  color: #3ecf8e;
}
.value {
  display: block;
  text-align: center;
  font-size: 28rpx;
  font-weight: 700;
  margin-bottom: 20rpx;
}
</style>
