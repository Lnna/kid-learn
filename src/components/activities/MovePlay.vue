<template>
  <view class="act">
    <text class="act__title">{{ activity.title }}</text>
    <text class="act__hint">{{ activity.instruction }}</text>

    <view class="move-card" :style="{ '--c': color || 'var(--color-pe)' }">
      <text class="move-emoji anim-float">{{ current.emoji }}</text>
      <text class="move-name">{{ current.name }}</text>
      <text class="move-tip">{{ current.tip }}</text>

      <view class="progress-ring">
        <text v-if="mode === 'timer'" class="progress-num">{{ remainSec }}</text>
        <text v-else class="progress-num">{{ doneReps }}/{{ current.reps }}</text>
        <text class="progress-label">{{ mode === 'timer' ? '秒' : '次' }}</text>
      </view>

      <view v-if="mode === 'reps'" class="rep-row">
        <KButton
          label="+1 次"
          size="lg"
          :color="color || '#5EC8A0'"
          :disabled="canFinish"
          @click="bumpRep"
        />
      </view>

      <view class="speak-row" @click="sayMove">
        <text class="speak-btn">🔊 再听一遍</text>
      </view>
    </view>

    <text class="step">动作 {{ idx + 1 }} / {{ activity.moves.length }}</text>

    <KButton
      v-if="canFinish"
      label="我做完了 ✓"
      block
      size="lg"
      :color="color || '#5EC8A0'"
      @click="finishMove"
    />
    <text v-else class="wait-tip">
      {{ mode === 'timer' ? '跟着做，倒计时结束后点完成' : '点「+1 次」做到目标次数' }}
    </text>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import type { MovePlayActivity } from '../../engine/types'
import { speak, unlockSpeak } from '../../utils/tts'
import { playSfx } from '../../utils/sfx'
import KButton from '../ui/KButton.vue'

const props = defineProps<{ activity: MovePlayActivity; color?: string; tts?: boolean }>()
const emit = defineEmits<{ done: [score: { correct: number; total: number }] }>()

const idx = ref(0)
const remainSec = ref(0)
const doneReps = ref(0)
const timerReady = ref(false)
let timer: ReturnType<typeof setInterval> | null = null

const current = computed(() => props.activity.moves[idx.value])
const mode = computed<'timer' | 'reps'>(() =>
  current.value.reps && current.value.reps > 0 ? 'reps' : 'timer'
)
const canFinish = computed(() => {
  if (mode.value === 'reps') return doneReps.value >= (current.value.reps || 0)
  return timerReady.value
})

function clearTimer() {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

function sayMove() {
  unlockSpeak()
  if (props.tts === false) return
  const m = current.value
  const bits = [m.speak || m.name, m.tip].filter(Boolean)
  speak(bits.join('。'))
}

function startMove() {
  clearTimer()
  doneReps.value = 0
  timerReady.value = false
  const m = current.value
  if (mode.value === 'timer') {
    remainSec.value = Math.max(1, m.durationSec || 8)
    timer = setInterval(() => {
      remainSec.value -= 1
      if (remainSec.value <= 0) {
        remainSec.value = 0
        timerReady.value = true
        clearTimer()
        playSfx('correct')
      }
    }, 1000)
  } else {
    remainSec.value = 0
  }
  sayMove()
}

function bumpRep() {
  if (canFinish.value) return
  doneReps.value += 1
  playSfx('tap')
  if (doneReps.value >= (current.value.reps || 0)) {
    playSfx('correct')
  }
}

function finishMove() {
  if (!canFinish.value) return
  clearTimer()
  playSfx('star')
  if (idx.value < props.activity.moves.length - 1) {
    idx.value += 1
    startMove()
  } else {
    const n = props.activity.moves.length
    const encourage = props.activity.encourage
    if (props.tts !== false && encourage) {
      speak(encourage)
    }
    emit('done', { correct: n, total: n })
  }
}

watch(
  () => props.activity.id,
  () => {
    idx.value = 0
    startMove()
  }
)

onMounted(() => {
  setTimeout(startMove, 300)
})

onUnmounted(clearTimer)
</script>

<style scoped lang="scss">
.act__title {
  display: block;
  font-size: 40rpx;
  font-weight: 800;
  margin-bottom: 8rpx;
}
.act__hint {
  display: block;
  font-size: 26rpx;
  color: var(--color-muted);
  margin-bottom: 20rpx;
}
.move-card {
  background: #fff;
  border-radius: var(--radius-lg);
  padding: 36rpx 28rpx;
  box-shadow: var(--shadow-soft);
  border: 4rpx solid color-mix(in srgb, var(--c) 35%, white);
  text-align: center;
  margin-bottom: 20rpx;
}
.move-emoji {
  display: block;
  font-size: 120rpx;
  line-height: 1.2;
  margin-bottom: 12rpx;
}
.move-name {
  display: block;
  font-size: 44rpx;
  font-weight: 900;
  color: var(--c);
  margin-bottom: 12rpx;
}
.move-tip {
  display: block;
  font-size: 28rpx;
  color: var(--color-ink-soft);
  line-height: 1.5;
  margin-bottom: 28rpx;
}
.progress-ring {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 160rpx;
  height: 160rpx;
  border-radius: 50%;
  background: color-mix(in srgb, var(--c) 16%, white);
  border: 6rpx solid var(--c);
  margin-bottom: 20rpx;
}
.progress-num {
  font-size: 52rpx;
  font-weight: 900;
  color: var(--c);
  line-height: 1;
}
.progress-label {
  font-size: 22rpx;
  color: var(--color-muted);
  margin-top: 4rpx;
}
.rep-row {
  display: flex;
  justify-content: center;
  margin-bottom: 12rpx;
}
.speak-row {
  margin-top: 8rpx;
}
.speak-btn {
  font-size: 26rpx;
  color: var(--color-ink-soft);
}
.step {
  display: block;
  text-align: center;
  font-size: 24rpx;
  color: var(--color-muted);
  margin-bottom: 20rpx;
}
.wait-tip {
  display: block;
  text-align: center;
  font-size: 26rpx;
  color: var(--color-muted);
  padding: 20rpx 0;
}
</style>
