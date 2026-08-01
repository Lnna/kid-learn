<template>
  <view class="act">
    <text class="act__title">{{ activity.title }}</text>
    <text class="act__hint">{{ activity.intro }}</text>

    <view class="prompt-card" :style="{ '--c': color || '#26A69A' }">
      <text class="prompt-card__label">请挖开</text>
      <text class="prompt-card__coord">第 {{ currentTarget.row }} 行 · 第 {{ currentTarget.col }} 列</text>
      <text class="prompt-card__replay" @click="onReplay">🔊 再听一遍</text>
    </view>

    <view class="board" :style="{ gridTemplateColumns: `repeat(${activity.cols}, 1fr)` }">
      <view
        v-for="cell in cells"
        :key="cell.key"
        class="cell"
        :class="[
          cell.state,
          { target: cell.isCurrentTarget },
          'scene--' + activity.scene,
        ]"
        @click="dig(cell)"
      >
        <text v-if="cell.state === 'found'" class="cell__icon">{{ cell.icon }}</text>
        <text v-else-if="cell.state === 'miss'" class="cell__icon cell__icon--miss">{{ missIcon }}</text>
        <text v-else class="cell__num">{{ cell.row }}-{{ cell.col }}</text>
        <view v-if="cell.state === 'idle'" class="cell__cover" />
      </view>
    </view>

    <view class="found-row">
      <text class="found-row__label">已找到：</text>
      <text v-for="t in foundTargets" :key="t.row + '-' + t.col" class="found-row__item">
        {{ t.icon }} {{ t.label }}
      </text>
      <text v-if="!foundTargets.length" class="found-row__empty">还没有收获，加油！</text>
    </view>

    <KButton
      v-if="allFound"
      label="全部挖到啦 ✓"
      block
      :color="color"
      @click="finish"
    />
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import type { GridDigActivity, DigTarget } from '../../engine/types'
import { speakAsync, stopSpeak, unlockSpeak } from '../../utils/tts'
import { playSfx } from '../../utils/sfx'
import KButton from '../ui/KButton.vue'

interface Cell {
  key: string
  row: number
  col: number
  state: 'idle' | 'found' | 'miss'
  icon?: string
  isCurrentTarget: boolean
}

const props = defineProps<{ activity: GridDigActivity; color?: string; tts?: boolean }>()
const emit = defineEmits<{ done: [score: { correct: number; total: number }] }>()

const targetIdx = ref(0)
const dugMap = ref<Record<string, 'found' | 'miss'>>({})
const attempts = ref(0)
/** 防止异步播报乱序互相打断 */
let speakSeq = 0
let digging = false

const missIcon = computed(() => (props.activity.scene === 'mine' ? '🪨' : '🌰'))

const currentTarget = computed<DigTarget>(() => props.activity.targets[targetIdx.value])

const foundTargets = computed<DigTarget[]>(() =>
  props.activity.targets.filter((t) => dugMap.value[t.row + '-' + t.col] === 'found')
)

const allFound = computed(() => foundTargets.value.length === props.activity.targets.length)

const cells = computed<Cell[]>(() => {
  const list: Cell[] = []
  const t = currentTarget.value
  for (let r = 1; r <= props.activity.rows; r++) {
    for (let c = 1; c <= props.activity.cols; c++) {
      const key = r + '-' + c
      const target = props.activity.targets.find((x) => x.row === r && x.col === c)
      list.push({
        key,
        row: r,
        col: c,
        state: dugMap.value[key] || 'idle',
        icon: target?.icon,
        isCurrentTarget: !!t && t.row === r && t.col === c && !dugMap.value[key],
      })
    }
  }
  return list
})

async function speakPrompt(seq?: number) {
  if (props.tts === false) return
  const my = seq ?? ++speakSeq
  const t = currentTarget.value
  // 短句更稳，避免被有道截断
  await speakAsync(`请挖开第${t.row}行第${t.col}列`)
  return my === speakSeq
}

async function dig(cell: Cell) {
  if (allFound.value || digging) return
  unlockSpeak()
  if (cell.state !== 'idle') {
    playSfx('tap')
    return
  }
  digging = true
  attempts.value++
  const t = currentTarget.value
  const my = ++speakSeq
  try {
    if (cell.row === t.row && cell.col === t.col) {
      dugMap.value = { ...dugMap.value, [cell.key]: 'found' }
      playSfx('correct')
      if (props.tts !== false) {
        await speakAsync(t.speak || `挖到${t.label}啦`)
      }
      if (my !== speakSeq) return
      if (targetIdx.value < props.activity.targets.length - 1) {
        targetIdx.value++
        // 反馈播完后再播下一条坐标，避免被打断
        await speakPrompt(my)
      } else {
        playSfx('star')
      }
    } else {
      dugMap.value = { ...dugMap.value, [cell.key]: 'miss' }
      playSfx('wrong')
      if (props.tts !== false) {
        await speakAsync('这里没有哦，再想想')
      }
    }
  } finally {
    digging = false
  }
}

function onReplay() {
  unlockSpeak()
  void speakPrompt()
}

function finish() {
  stopSpeak()
  speakSeq++
  const total = Math.max(attempts.value, props.activity.targets.length)
  emit('done', { correct: props.activity.targets.length, total })
}

onMounted(() => {
  setTimeout(() => {
    void speakPrompt()
  }, 400)
})

onUnmounted(() => {
  speakSeq++
  stopSpeak()
})
</script>

<style scoped lang="scss">
.act__title {
  display: block;
  font-size: 40rpx;
  font-weight: 800;
  margin-bottom: 8rpx;
  color: var(--color-ink);
}
.act__hint {
  display: block;
  font-size: 26rpx;
  color: var(--color-muted);
  margin-bottom: 20rpx;
}
.prompt-card {
  background: #fff;
  border-radius: var(--radius-md);
  padding: 24rpx;
  text-align: center;
  box-shadow: var(--shadow-soft);
  border: 4rpx solid color-mix(in srgb, var(--c) 40%, white);
  margin-bottom: 20rpx;
}
.prompt-card__label {
  display: block;
  font-size: 26rpx;
  color: var(--color-muted);
}
.prompt-card__coord {
  display: block;
  font-size: 52rpx;
  font-weight: 900;
  color: var(--c);
  margin: 8rpx 0;
}
.prompt-card__replay {
  display: inline-block;
  font-size: 24rpx;
  color: var(--color-ink-soft);
  background: var(--color-cream);
  padding: 8rpx 24rpx;
  border-radius: 999rpx;
}
.board {
  display: grid;
  gap: 10rpx;
  margin-bottom: 20rpx;
}
.cell {
  aspect-ratio: 1;
  border-radius: var(--radius-sm);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
.cell.scene--mine {
  background: linear-gradient(180deg, #8d6e63, #6d4c41);
}
.cell.scene--fossil {
  background: linear-gradient(180deg, #d7ccc8, #a1887f);
}
.cell__cover {
  position: absolute;
  inset: 0;
  border-radius: inherit;
}
.cell__num {
  font-size: 22rpx;
  color: rgba(255, 255, 255, 0.75);
  font-weight: 700;
}
.cell.found {
  background: #fff8ee;
  border: 4rpx solid var(--color-star);
  animation: bounce-in 0.4s ease;
}
.cell.miss {
  background: #efebe9;
  opacity: 0.7;
}
.cell__icon {
  font-size: 48rpx;
}
.cell__icon--miss {
  font-size: 36rpx;
  filter: grayscale(0.6);
}
.found-row {
  background: #fff;
  border-radius: var(--radius-md);
  padding: 20rpx 24rpx;
  margin-bottom: 20rpx;
  box-shadow: var(--shadow-soft);
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12rpx;
}
.found-row__label {
  font-size: 26rpx;
  color: var(--color-muted);
}
.found-row__item {
  font-size: 26rpx;
  font-weight: 700;
  color: var(--color-ink);
  background: var(--color-cream);
  padding: 6rpx 16rpx;
  border-radius: 999rpx;
}
.found-row__empty {
  font-size: 24rpx;
  color: var(--color-muted);
}
</style>
