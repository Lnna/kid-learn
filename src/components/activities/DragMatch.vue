<template>
  <view class="act">
    <text class="act__title">{{ activity.title }}</text>
    <text class="act__hint">{{ activity.instruction }}</text>
    <view class="board">
      <view class="col">
        <view
          v-for="p in lefts"
          :key="p.id"
          class="chip"
          :class="{ selected: selectedLeft === p.id, matched: matched.has(p.id) }"
          @click="pickLeft(p.id)"
        >
          <view v-if="p.leftIcon" class="chip__icon">
            <ActivityIcon :name="p.leftIcon" :size="48" />
          </view>
          <text class="chip__text">{{ p.left }}</text>
        </view>
      </view>
      <view class="col">
        <view
          v-for="p in rights"
          :key="'r-' + p.id"
          class="chip chip--right"
          :class="{ matched: matched.has(p.id) }"
          @click="pickRight(p.id)"
        >
          <view v-if="p.rightIcon" class="chip__icon">
            <ActivityIcon :name="p.rightIcon" :size="48" />
          </view>
          <text class="chip__text">{{ p.right }}</text>
        </view>
      </view>
    </view>
    <text class="progress">已配对 {{ matched.size }} / {{ activity.pairs.length }}</text>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { DragMatchActivity } from '../../engine/types'
import { playSfx } from '../../utils/sfx'
import ActivityIcon from '../ui/ActivityIcon.vue'

const props = defineProps<{ activity: DragMatchActivity; color?: string }>()
const emit = defineEmits<{ done: [score: { correct: number; total: number }] }>()

function shuffle<T>(arr: T[]) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const lefts = computed(() => props.activity.pairs)
const rights = ref(shuffle(props.activity.pairs))
const selectedLeft = ref('')
const matched = ref(new Set<string>())
const mistakes = ref(0)

watch(
  () => props.activity.id,
  () => {
    rights.value = shuffle(props.activity.pairs)
    selectedLeft.value = ''
    matched.value = new Set()
    mistakes.value = 0
  }
)

function pickLeft(id: string) {
  if (matched.value.has(id)) return
  selectedLeft.value = id
  playSfx('tap')
}

function pickRight(id: string) {
  if (!selectedLeft.value || matched.value.has(id)) return
  if (selectedLeft.value === id) {
    matched.value = new Set([...matched.value, id])
    selectedLeft.value = ''
    playSfx('correct')
    if (matched.value.size >= props.activity.pairs.length) {
      const total = props.activity.pairs.length
      const correct = Math.max(0, total - mistakes.value)
      setTimeout(() => emit('done', { correct, total }), 400)
    }
  } else {
    mistakes.value++
    playSfx('wrong')
    selectedLeft.value = ''
  }
}
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
.board {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24rpx;
}
.col {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
.chip {
  background: #fff;
  border-radius: var(--radius-md);
  padding: 24rpx;
  border: 4rpx solid #f5ebd8;
  text-align: center;
  min-height: 96rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
}
.chip.selected {
  border-color: var(--color-english);
  background: #eef6ff;
}
.chip.matched {
  opacity: 0.4;
  border-color: var(--color-success);
}
.chip__icon {
  font-size: 36rpx;
}
.chip__text {
  font-size: 32rpx;
  font-weight: 700;
}
.progress {
  display: block;
  text-align: center;
  margin-top: 24rpx;
  color: var(--color-muted);
  font-size: 26rpx;
}
</style>
