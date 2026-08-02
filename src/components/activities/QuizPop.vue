<template>
  <view class="act">
    <text class="act__title">{{ activity.title }}</text>
    <text class="act__hint">{{ activity.instruction }}</text>
    <view class="q-card">
      <text class="q-text">{{ current.question }}</text>
      <view
        v-if="tts !== false"
        class="q-replay"
        role="button"
        aria-label="再听一遍题目"
        @click.stop="replay"
      >
        <text class="q-replay__icon">🔊</text>
        <text class="q-replay__label">再听一遍</text>
      </view>
    </view>
    <view class="options">
      <ChoiceOption
        v-for="(opt, i) in current.options"
        :key="opt.id"
        :index="i"
        :label="opt.label"
        :speak="opt.speak"
        :speak-lang="opt.speakLang"
        :tts="tts"
        :root-class="{
          correct: revealed && opt.id === current.answerId,
          wrong: revealed && picked === opt.id && opt.id !== current.answerId,
        }"
        @select="choose(opt.id)"
      >
        <view v-if="opt.icon" class="opt__icon">
          <ActivityIcon :name="opt.icon" :size="64" />
        </view>
        <text class="opt__label">{{ opt.label }}</text>
      </ChoiceOption>
    </view>
    <text class="progress">{{ idx + 1 }} / {{ activity.items.length }}</text>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount, inject, type ComputedRef } from 'vue'
import type { QuizActivity, SubjectId } from '../../engine/types'
import { addMistake } from '../../engine/mistakes'
import { speak, stopSpeak, unlockSpeak } from '../../utils/tts'
import { toSpeakText } from '../../utils/speakText'
import { playSfx } from '../../utils/sfx'
import ActivityIcon from '../ui/ActivityIcon.vue'
import ChoiceOption from '../ui/ChoiceOption.vue'

const props = defineProps<{
  activity: QuizActivity
  color?: string
  tts?: boolean
  subjectId?: SubjectId
  levelId?: string
}>()
const emit = defineEmits<{ done: [score: { correct: number; total: number }] }>()

const lessonContext = inject<ComputedRef<{ subjectId: SubjectId; levelId: string }> | undefined>(
  'lessonContext',
  undefined
)

function resolveLessonIds() {
  return {
    subjectId: props.subjectId || lessonContext?.value?.subjectId,
    levelId: props.levelId || lessonContext?.value?.levelId || '',
  }
}

function captureWrong() {
  const item = current.value
  if (!item) return
  const { subjectId, levelId } = resolveLessonIds()
  if (!subjectId || !levelId) return
  addMistake({
    subjectId,
    levelId,
    activityType: 'quiz',
    prompt: item.question,
    speak: item.speak || item.question,
    options: item.options,
    answerId: item.answerId,
  })
}

const idx = ref(0)
const picked = ref('')
const revealed = ref(false)
const correctCount = ref(0)
const current = computed(() => props.activity.items[idx.value])
let sayTimer: ReturnType<typeof setTimeout> | null = null

watch(
  () => props.activity.id,
  () => {
    idx.value = 0
    picked.value = ''
    revealed.value = false
    correctCount.value = 0
    scheduleSay()
  }
)

/** 题干朗读：优先 item.speak，否则把 question 转成可读中文（绝不保留 emoji） */
function promptSpeak(): string {
  const item = current.value
  if (!item) return ''
  const raw = (item.speak || item.question || '').trim()
  if (!raw) return ''
  // 已有专门 speak 时仍做轻量规范化；清完为空则不播
  return toSpeakText(raw)
}

function clearSayTimer() {
  if (sayTimer) {
    clearTimeout(sayTimer)
    sayTimer = null
  }
}

function say(userInitiated = false) {
  if (props.tts === false) return
  const text = promptSpeak()
  if (!text) return
  // 勿先 stopSpeak 再立刻 speak：安卓 cancel 后立即 speak 会被静默忽略。
  // speak() 内部会打断旧播报并做 cancel→speak 间隔。
  // 不写死 zh-CN：英文题干交给 resolveLang 识别，中文引擎读英文会无声。
  // silent 仅用于自动播；手动「再听一遍」失败时应可提示。
  speak(text, { silent: !userInitiated })
}

function scheduleSay(delay = 320) {
  clearSayTimer()
  sayTimer = setTimeout(() => {
    sayTimer = null
    say(false)
  }, delay)
}

function replay() {
  unlockSpeak()
  playSfx('tap')
  clearSayTimer()
  say(true)
}

function choose(id: string) {
  if (revealed.value) return
  picked.value = id
  revealed.value = true
  const ok = id === current.value.answerId
  if (ok) correctCount.value++
  else captureWrong()
  playSfx(ok ? 'correct' : 'wrong')
  setTimeout(() => {
    if (idx.value < props.activity.items.length - 1) {
      idx.value++
      picked.value = ''
      revealed.value = false
      scheduleSay(280)
    } else {
      stopSpeak()
      emit('done', { correct: correctCount.value, total: props.activity.items.length })
    }
  }, 650)
}

onMounted(() => scheduleSay(400))
onBeforeUnmount(() => {
  clearSayTimer()
  stopSpeak()
})
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
  padding: 40rpx 28rpx 28rpx;
  margin-bottom: 28rpx;
  box-shadow: var(--shadow-soft);
  text-align: center;
}
.q-text {
  display: block;
  font-size: 44rpx;
  font-weight: 800;
  color: var(--color-ink);
  white-space: pre-wrap;
  line-height: 1.5;
}
.q-replay {
  margin-top: 20rpx;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10rpx;
  padding: 12rpx 28rpx;
  border-radius: 999rpx;
  background: #fff8ee;
  border: 4rpx solid #e8dcc8;
  box-shadow: 0 4rpx 0 #e8dcc8;
}
.q-replay:active {
  transform: scale(0.96);
  box-shadow: none;
}
.q-replay__icon {
  font-size: 32rpx;
  line-height: 1;
}
.q-replay__label {
  font-size: 26rpx;
  font-weight: 700;
  color: var(--color-ink);
}
.options {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20rpx;
  margin-bottom: 20rpx;
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
