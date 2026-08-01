<template>
  <view class="act">
    <text class="act__title">{{ activity.title }}</text>
    <text class="act__hint">{{ activity.instruction }}</text>
    <view class="q-card">
      <text class="q-text">{{ current.question }}</text>
    </view>
    <view class="options">
      <view
        v-for="opt in current.options"
        :key="opt.id"
        class="opt"
        :class="{
          correct: revealed && opt.id === current.answerId,
          wrong: revealed && picked === opt.id && opt.id !== current.answerId,
        }"
        @click="choose(opt.id)"
      >
        <view v-if="opt.icon" class="opt__icon">
          <ActivityIcon :name="opt.icon" :size="64" />
        </view>
        <text class="opt__label">{{ opt.label }}</text>
      </view>
    </view>
    <text class="progress">{{ idx + 1 }} / {{ activity.items.length }}</text>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import type { QuizActivity } from '../../engine/types'
import { speak } from '../../utils/tts'
import { playSfx } from '../../utils/sfx'
import ActivityIcon from '../ui/ActivityIcon.vue'

const props = defineProps<{ activity: QuizActivity; color?: string; tts?: boolean }>()
const emit = defineEmits<{ done: [score: { correct: number; total: number }] }>()

const idx = ref(0)
const picked = ref('')
const revealed = ref(false)
const correctCount = ref(0)
const current = computed(() => props.activity.items[idx.value])

watch(
  () => props.activity.id,
  () => {
    idx.value = 0
    picked.value = ''
    revealed.value = false
    correctCount.value = 0
  }
)

function say() {
  if (props.tts !== false && current.value.speak) {
    speak(current.value.speak)
  }
}

function choose(id: string) {
  if (revealed.value) return
  picked.value = id
  revealed.value = true
  const ok = id === current.value.answerId
  if (ok) correctCount.value++
  playSfx(ok ? 'correct' : 'wrong')
  setTimeout(() => {
    if (idx.value < props.activity.items.length - 1) {
      idx.value++
      picked.value = ''
      revealed.value = false
      say()
    } else {
      emit('done', { correct: correctCount.value, total: props.activity.items.length })
    }
  }, 650)
}

onMounted(say)
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
.q-card {
  background: #fff;
  border-radius: var(--radius-lg);
  padding: 40rpx 28rpx;
  margin-bottom: 28rpx;
  box-shadow: var(--shadow-soft);
  text-align: center;
}
.q-text {
  font-size: 44rpx;
  font-weight: 800;
  color: var(--color-ink);
  white-space: pre-wrap;
  line-height: 1.5;
}
.options {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20rpx;
  margin-bottom: 20rpx;
}
.opt {
  background: #fff;
  border-radius: var(--radius-md);
  padding: 28rpx 16rpx;
  text-align: center;
  border: 4rpx solid #f5ebd8;
  min-height: 110rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.opt.correct {
  border-color: var(--color-success);
  background: #e8fff3;
}
.opt.wrong {
  border-color: var(--color-error);
  background: #ffe8e8;
  animation: wiggle 0.4s ease;
}
.opt__icon {
  font-size: 40rpx;
}
.opt__label {
  font-size: 36rpx;
  font-weight: 700;
}
.progress {
  display: block;
  text-align: center;
  color: var(--color-muted);
  font-size: 26rpx;
}
</style>
