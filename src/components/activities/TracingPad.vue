<template>
  <view class="act">
    <text class="act__title">{{ activity.title }}</text>
    <text class="act__hint">{{ activity.instruction }}</text>
    <view class="trace-wrap">
      <text class="ghost">{{ current.char }}</text>
      <canvas
        canvas-id="traceCanvas"
        id="traceCanvas"
        class="canvas"
        @touchstart="onStart"
        @touchmove="onMove"
        @touchend="onEnd"
        disable-scroll
      />
    </view>
    <view class="tools">
      <KButton label="清除" variant="soft" size="sm" @click="clear" />
      <KButton label="听发音" variant="soft" size="sm" :color="color" @click="say" />
      <KButton label="完成描红" size="sm" :color="color" @click="finishOne" />
    </view>
    <text class="progress">{{ idx + 1 }} / {{ activity.items.length }} · {{ current.hint || current.char }}</text>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, watch, getCurrentInstance, nextTick } from 'vue'
import type { TracingActivity } from '../../engine/types'
import { speak, getLessonSpeakLang } from '../../utils/tts'
import { playSfx } from '../../utils/sfx'
import KButton from '../ui/KButton.vue'

const props = defineProps<{ activity: TracingActivity; color?: string; tts?: boolean }>()
const emit = defineEmits<{ done: [score: { correct: number; total: number }] }>()

const idx = ref(0)
const doneCount = ref(0)
const drawing = ref(false)
const instance = getCurrentInstance()
let ctx: UniApp.CanvasContext | null = null

const current = computed(() => props.activity.items[idx.value])

function initCtx() {
  ctx = uni.createCanvasContext('traceCanvas', instance?.proxy as any)
  ctx.setStrokeStyle('#2c2416')
  ctx.setLineWidth(6)
  ctx.setLineCap('round')
  ctx.setLineJoin('round')
}

watch(
  () => props.activity.id,
  () => {
    idx.value = 0
    doneCount.value = 0
    nextTick(() => {
      initCtx()
      clear()
      say()
    })
  },
  { immediate: true }
)

function touchPoint(e: any) {
  const t = e.touches?.[0] || e.changedTouches?.[0]
  if (!t) return null
  return { x: t.x ?? t.clientX ?? 0, y: t.y ?? t.clientY ?? 0 }
}

function onStart(e: any) {
  drawing.value = true
  if (!ctx) initCtx()
  const p = touchPoint(e)
  if (!p || !ctx) return
  ctx.beginPath()
  ctx.moveTo(p.x, p.y)
}

function onMove(e: any) {
  if (!drawing.value || !ctx) return
  const p = touchPoint(e)
  if (!p) return
  ctx.lineTo(p.x, p.y)
  ctx.stroke()
  ctx.draw(true)
  ctx.beginPath()
  ctx.moveTo(p.x, p.y)
}

function onEnd() {
  drawing.value = false
}

function clear() {
  if (!ctx) initCtx()
  ctx?.clearRect(0, 0, 600, 600)
  ctx?.draw()
}

function say() {
  if (props.tts === false) return
  const item = current.value
  const lang =
    item.grid === 'english' ? 'en-US' : getLessonSpeakLang() || undefined
  speak(item.speak || item.char, lang ? { lang } : undefined)
}

function finishOne() {
  playSfx('correct')
  doneCount.value++
  if (idx.value < props.activity.items.length - 1) {
    idx.value++
    clear()
    say()
  } else {
    emit('done', { correct: doneCount.value, total: props.activity.items.length })
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
  margin-bottom: 20rpx;
}
.trace-wrap {
  position: relative;
  width: 100%;
  max-width: 560rpx;
  margin: 0 auto 24rpx;
  aspect-ratio: 1;
  background: #fff;
  border-radius: var(--radius-lg);
  border: 4rpx dashed #e8dcc8;
  overflow: hidden;
}
.ghost {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 220rpx;
  font-weight: 800;
  color: rgba(44, 36, 22, 0.12);
  pointer-events: none;
  z-index: 0;
}
.canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}
.tools {
  display: flex;
  gap: 16rpx;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 16rpx;
}
.progress {
  display: block;
  text-align: center;
  color: var(--color-muted);
  font-size: 26rpx;
}
</style>
