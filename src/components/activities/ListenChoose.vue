<template>
  <view class="act">
    <text class="act__title">{{ activity.title }}</text>
    <text class="act__hint">{{ activity.instruction }}</text>
    <view class="speaker" @click="playPrompt">
      <text class="speaker__icon">🔊</text>
      <text class="speaker__label">{{ activity.promptLabel || '点我听一听' }}</text>
    </view>
    <view class="options">
      <ChoiceOption
        v-for="(opt, i) in activity.options"
        :key="opt.id"
        :index="i"
        :label="opt.label"
        :speak="opt.speak"
        :speak-lang="opt.speakLang"
        :tts="tts"
        :root-class="{
          correct: revealed && opt.id === activity.answerId,
          wrong: revealed && selected === opt.id && opt.id !== activity.answerId,
        }"
        @select="choose(opt.id)"
      >
        <view v-if="opt.icon" class="opt__icon">
          <ActivityIcon :name="opt.icon" :size="72" />
        </view>
        <text class="opt__label">{{ opt.label }}</text>
      </ChoiceOption>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { ListenChooseActivity } from '../../engine/types'
import { speak, unlockSpeak } from '../../utils/tts'
import { playSfx } from '../../utils/sfx'
import ActivityIcon from '../ui/ActivityIcon.vue'
import ChoiceOption from '../ui/ChoiceOption.vue'

const props = defineProps<{ activity: ListenChooseActivity; color?: string; tts?: boolean }>()
const emit = defineEmits<{ done: [score: { correct: number; total: number }] }>()

const selected = ref('')
const revealed = ref(false)

function playPrompt() {
  unlockSpeak()
  if (props.tts !== false) {
    speak(props.activity.promptSpeak, { lang: props.activity.promptLang })
  }
  playSfx('tap')
}

function choose(id: string) {
  if (revealed.value) return
  selected.value = id
  revealed.value = true
  const ok = id === props.activity.answerId
  playSfx(ok ? 'correct' : 'wrong')
  setTimeout(() => {
    emit('done', { correct: ok ? 1 : 0, total: 1 })
  }, 700)
}

onMounted(() => setTimeout(playPrompt, 400))
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
  margin-bottom: 24rpx;
}
.speaker {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16rpx;
  background: #fff;
  border-radius: var(--radius-lg);
  padding: 36rpx;
  margin-bottom: 28rpx;
  box-shadow: var(--shadow-soft);
}
.speaker__icon {
  font-size: 56rpx;
}
.speaker__label {
  font-size: 30rpx;
  font-weight: 700;
  color: var(--color-ink);
}
.options {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20rpx;
}
.opt__icon {
  font-size: 48rpx;
}
.opt__label {
  font-size: 36rpx;
  font-weight: 700;
  margin-top: 8rpx;
}
:deep(.choice.correct) {
  border-color: var(--color-success);
  background: #e8fff3;
}
:deep(.choice.wrong) {
  border-color: var(--color-error);
  background: #ffe8e8;
  animation: wiggle 0.4s ease;
}
</style>
