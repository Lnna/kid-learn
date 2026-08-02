<template>
  <view class="act">
    <text class="act__title">{{ activity.title }}</text>
    <text class="act__hint">{{ activity.instruction }}</text>
    <view class="q-card">
      <text class="q-text">{{ current.prompt }}</text>
    </view>
    <view class="picked-row">
      <view v-for="(id, i) in picked" :key="i" class="slot" @click="unpick(i)">
        <text>{{ labelOf(id) }}</text>
      </view>
      <view v-for="n in Math.max(0, current.answerOrder.length - picked.length)" :key="'e' + n" class="slot empty" />
    </view>
    <view class="pool">
      <ChoiceOption
        v-for="(opt, i) in pool"
        :key="opt.id"
        variant="chip"
        :index="i"
        :label="opt.label"
        :speak="opt.speak"
        :speak-lang="opt.speakLang"
        :tts="tts"
        :root-class="{ used: picked.includes(opt.id) }"
        @select="pick(opt.id)"
      >
        <ActivityIcon v-if="opt.icon" :name="opt.icon" :size="48" />
        <text class="chip__label">{{ opt.label }}</text>
      </ChoiceOption>
    </view>
    <KButton
      v-if="picked.length === current.answerOrder.length"
      label="检查顺序"
      block
      :color="color"
      @click="check"
    />
    <text class="progress">{{ idx + 1 }} / {{ activity.items.length }}</text>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, inject, type ComputedRef } from 'vue'
import type { SequenceActivity, SubjectId } from '../../engine/types'
import { addMistake } from '../../engine/mistakes'
import { speak } from '../../utils/tts'
import { playSfx } from '../../utils/sfx'
import KButton from '../ui/KButton.vue'
import ActivityIcon from '../ui/ActivityIcon.vue'
import ChoiceOption from '../ui/ChoiceOption.vue'

const props = defineProps<{
  activity: SequenceActivity
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

function captureWrong() {
  const item = current.value
  if (!item) return
  const subjectId = props.subjectId || lessonContext?.value?.subjectId
  const levelId = props.levelId || lessonContext?.value?.levelId || ''
  if (!subjectId || !levelId) return
  addMistake({
    subjectId,
    levelId,
    activityType: 'sequence',
    prompt: item.prompt,
    speak: item.speak,
    options: item.items,
    answerOrder: item.answerOrder,
    answerId: item.answerOrder.join('|'),
  })
}

const idx = ref(0)
const picked = ref<string[]>([])
const correctCount = ref(0)
const current = computed(() => props.activity.items[idx.value])
const pool = computed(() => current.value.items)

watch(
  () => props.activity.id,
  () => {
    idx.value = 0
    picked.value = []
    correctCount.value = 0
  }
)

function labelOf(id: string) {
  return pool.value.find((o) => o.id === id)?.label || id
}

function pick(id: string) {
  if (picked.value.includes(id)) return
  if (picked.value.length >= current.value.answerOrder.length) return
  picked.value = [...picked.value, id]
  playSfx('tap')
}

function unpick(i: number) {
  picked.value = picked.value.filter((_, idx2) => idx2 !== i)
}

function check() {
  const ok = picked.value.every((id, i) => id === current.value.answerOrder[i])
  if (ok) correctCount.value++
  else captureWrong()
  playSfx(ok ? 'correct' : 'wrong')
  setTimeout(() => {
    if (idx.value < props.activity.items.length - 1) {
      idx.value++
      picked.value = []
      say()
    } else {
      emit('done', { correct: correctCount.value, total: props.activity.items.length })
    }
  }, 600)
}

function say() {
  if (props.tts !== false && current.value.speak) speak(current.value.speak)
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
  padding: 28rpx;
  margin-bottom: 20rpx;
  text-align: center;
  box-shadow: var(--shadow-soft);
}
.q-text {
  font-size: 32rpx;
  font-weight: 700;
}
.picked-row {
  display: flex;
  gap: 12rpx;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 24rpx;
  min-height: 96rpx;
}
.slot {
  min-width: 100rpx;
  height: 88rpx;
  padding: 0 20rpx;
  background: #eef6ff;
  border: 4rpx solid var(--color-english);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 30rpx;
}
.slot.empty {
  background: #fff;
  border-style: dashed;
  border-color: #e8dcc8;
}
.pool {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
  justify-content: center;
  margin-bottom: 28rpx;
}
.chip__label {
  font-weight: 700;
  font-size: 30rpx;
}
.progress {
  display: block;
  text-align: center;
  margin-top: 16rpx;
  color: var(--color-muted);
  font-size: 26rpx;
}
:deep(.choice.used) {
  opacity: 0.3;
}
</style>
