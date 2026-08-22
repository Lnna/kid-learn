<template>
  <view class="act">
    <text class="act__title">{{ activity.title }}</text>
    <text class="act__hint">{{ activity.instruction || '先点左边，再点右边配对；连线表示已经配对成功' }}</text>
    <view class="board" :id="boardId">
      <!-- 连线层：已配对用实线，选中左边时用虚线指向中间缝隙作提示 -->
      <view class="board__lines" aria-hidden="true">
        <view
          v-for="line in lines"
          :key="line.id"
          class="connector"
          :class="`connector--${line.kind}`"
          :style="line.style"
        />
      </view>
      <view class="col">
        <view
          v-for="(p, i) in lefts"
          :id="chipId('L', p.id)"
          :key="p.id"
          class="chip"
          :class="{ selected: selectedLeft === p.id, matched: matched.has(p.id) }"
          @click="pickLeft(p.id)"
        >
          <text class="chip__letter">{{ letterOf(i) }}</text>
          <view v-if="p.leftIcon" class="chip__icon">
            <ActivityIcon :name="p.leftIcon" :size="48" />
          </view>
          <text class="chip__text">{{ p.left }}</text>
          <OptionSpeak :text="p.left" :lang="speakLang" size="sm" />
          <view class="chip__port chip__port--out" />
        </view>
      </view>
      <view class="col">
        <view
          v-for="(p, i) in rights"
          :id="chipId('R', p.id)"
          :key="'r-' + p.id"
          class="chip chip--right"
          :class="{
            matched: matched.has(p.id),
            targetable: !!selectedLeft && !matched.has(p.id),
          }"
          @click="pickRight(p.id)"
        >
          <view class="chip__port chip__port--in" />
          <text class="chip__letter">{{ letterOf(i) }}</text>
          <view v-if="p.rightIcon" class="chip__icon">
            <ActivityIcon :name="p.rightIcon" :size="48" />
          </view>
          <text class="chip__text">{{ p.right }}</text>
          <OptionSpeak :text="p.right" :lang="speakLang" size="sm" />
        </view>
      </view>
    </view>
    <text class="progress">已配对 {{ matched.size }} / {{ activity.pairs.length }}</text>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, getCurrentInstance, onMounted, onUnmounted } from 'vue'
import type { DragMatchActivity } from '../../engine/types'
import { playSfx } from '../../utils/sfx'
import { emitSpiritReact } from '../../utils/spiritMiss'
import { getLessonSpeakLang } from '../../utils/tts'
import ActivityIcon from '../ui/ActivityIcon.vue'
import OptionSpeak from '../ui/OptionSpeak.vue'

type LineKind = 'matched' | 'pending'
type LineView = { id: string; kind: LineKind; style: Record<string, string> }

const props = defineProps<{ activity: DragMatchActivity; color?: string }>()
const emit = defineEmits<{ done: [score: { correct: number; total: number }] }>()
const instance = getCurrentInstance()
const speakLang = computed(() => getLessonSpeakLang() || undefined)

const boardId = `match-board-${Math.random().toString(36).slice(2, 8)}`

function shuffle<T>(arr: T[]) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function letterOf(i: number) {
  return String.fromCharCode(65 + i)
}

function chipId(side: 'L' | 'R', id: string) {
  return `${boardId}-${side}-${id}`
}

const lefts = computed(() => props.activity.pairs)
const rights = ref(shuffle(props.activity.pairs))
const selectedLeft = ref('')
const matched = ref(new Set<string>())
const mistakes = ref(0)
const lines = ref<LineView[]>([])

function lineStyle(
  x1: number,
  y1: number,
  x2: number,
  y2: number
): Record<string, string> {
  const dx = x2 - x1
  const dy = y2 - y1
  const len = Math.max(2, Math.hypot(dx, dy))
  const angle = (Math.atan2(dy, dx) * 180) / Math.PI
  return {
    left: `${x1}px`,
    top: `${y1}px`,
    width: `${len}px`,
    transform: `rotate(${angle}deg)`,
  }
}

function queryRect(id: string): Promise<UniApp.NodeInfo | null> {
  return new Promise((resolve) => {
    const q = uni.createSelectorQuery()
    // #ifdef H5
    if (instance) q.in(instance)
    // #endif
    q.select(`#${id}`)
      .boundingClientRect()
      .exec((res) => {
        resolve((res && res[0]) || null)
      })
  })
}

async function updateLines() {
  await nextTick()
  const board = await queryRect(boardId)
  if (!board || board.left == null || board.top == null) {
    lines.value = []
    return
  }
  const ox = board.left
  const oy = board.top
  const next: LineView[] = []

  for (const id of matched.value) {
    const L = await queryRect(chipId('L', id))
    const R = await queryRect(chipId('R', id))
    if (!L || !R || L.right == null || L.top == null || L.height == null) continue
    if (R.left == null || R.top == null || R.height == null) continue
    const x1 = L.right - ox
    const y1 = L.top + L.height / 2 - oy
    const x2 = R.left - ox
    const y2 = R.top + R.height / 2 - oy
    next.push({ id: `m-${id}`, kind: 'matched', style: lineStyle(x1, y1, x2, y2) })
  }

  // 选中左边：画一条短虚线伸进中间，提示「再点右边」
  if (selectedLeft.value && !matched.value.has(selectedLeft.value)) {
    const L = await queryRect(chipId('L', selectedLeft.value))
    if (L && L.right != null && L.top != null && L.height != null && board.width != null) {
      const x1 = L.right - ox
      const y1 = L.top + L.height / 2 - oy
      const x2 = board.width / 2
      const y2 = y1
      next.push({
        id: `p-${selectedLeft.value}`,
        kind: 'pending',
        style: lineStyle(x1, y1, x2, y2),
      })
    }
  }

  lines.value = next
}

let resizeTimer: ReturnType<typeof setTimeout> | null = null
function onResize() {
  if (resizeTimer) clearTimeout(resizeTimer)
  resizeTimer = setTimeout(() => {
    void updateLines()
  }, 80)
}

watch(
  () => props.activity.id,
  () => {
    rights.value = shuffle(props.activity.pairs)
    selectedLeft.value = ''
    matched.value = new Set()
    mistakes.value = 0
    lines.value = []
    void updateLines()
  }
)

watch([matched, selectedLeft, rights], () => {
  void updateLines()
})

onMounted(() => {
  void updateLines()
  // #ifdef H5
  window.addEventListener('resize', onResize)
  // #endif
})

onUnmounted(() => {
  if (resizeTimer) clearTimeout(resizeTimer)
  // #ifdef H5
  window.removeEventListener('resize', onResize)
  // #endif
})

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
    emitSpiritReact('hit')
    if (matched.value.size >= props.activity.pairs.length) {
      const total = props.activity.pairs.length
      const correct = Math.max(0, total - mistakes.value)
      setTimeout(() => emit('done', { correct, total }), 400)
    }
  } else {
    mistakes.value++
    playSfx('wrong')
    emitSpiritReact('miss')
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
  position: relative;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48rpx;
}
.board__lines {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 2;
  overflow: visible;
}
.connector {
  position: absolute;
  height: 0;
  border-top-width: 6rpx;
  border-top-style: solid;
  transform-origin: 0 50%;
  box-sizing: border-box;
}
.connector--matched {
  border-top-color: var(--color-success, #3ecf8e);
  opacity: 0.9;
}
.connector--pending {
  border-top-color: var(--color-english, #4da3ff);
  border-top-style: dashed;
  opacity: 0.85;
}
.col {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
.chip {
  position: relative;
  background: #fff8ee;
  border-radius: var(--radius-md);
  padding: 16rpx 12rpx;
  border: 4rpx solid #e8dcc8;
  text-align: center;
  min-height: 96rpx;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 8rpx;
}
.chip.selected {
  border-color: var(--color-english);
  background: #eef6ff;
}
.chip.matched {
  opacity: 0.55;
  border-color: var(--color-success);
  background: #eefaf3;
}
.chip.targetable {
  box-shadow: 0 0 0 2rpx rgba(77, 163, 255, 0.25);
}
.chip__port {
  position: absolute;
  top: 50%;
  width: 16rpx;
  height: 16rpx;
  margin-top: -8rpx;
  border-radius: 50%;
  background: #e8dcc8;
  border: 3rpx solid #fff;
  z-index: 3;
  box-sizing: border-box;
}
.chip__port--out {
  right: -10rpx;
}
.chip__port--in {
  left: -10rpx;
}
.chip.selected .chip__port--out {
  background: var(--color-english, #4da3ff);
}
.chip.matched .chip__port {
  background: var(--color-success, #3ecf8e);
}
.chip__letter {
  flex-shrink: 0;
  min-width: 40rpx;
  height: 40rpx;
  padding: 0 6rpx;
  border-radius: 12rpx;
  background: #fff;
  border: 3rpx solid #e8dcc8;
  color: var(--color-ink-soft, #5a5048);
  font-size: 22rpx;
  font-weight: 800;
  line-height: 34rpx;
  text-align: center;
  font-family: var(--font-round);
  box-sizing: border-box;
}
.chip__icon {
  font-size: 36rpx;
  flex-shrink: 0;
}
.chip__text {
  font-size: 28rpx;
  font-weight: 700;
  flex: 1;
  text-align: left;
  min-width: 0;
}
.progress {
  display: block;
  text-align: center;
  margin-top: 24rpx;
  color: var(--color-muted);
  font-size: 26rpx;
}
</style>
