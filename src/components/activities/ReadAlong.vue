<template>
  <view class="act">
    <text class="act__title">{{ activity.title }}</text>
    <text class="act__hint">{{ activity.instruction }}</text>
    <view class="poem-card">
      <text class="poem-title">{{ activity.titleText }}</text>
      <view
        v-for="line in activity.lines"
        :key="line.id"
        class="line"
        :class="{ active: activeId === line.id }"
        @click="read(line)"
      >
        <text class="line__text">{{ line.text }}</text>
      </view>
    </view>
    <view class="tools">
      <KButton label="从头朗读" variant="soft" :color="color" @click="readAll" />
      <KButton
        v-if="readCount >= Math.min(2, activity.lines.length)"
        label="读完了 ✓"
        :color="color"
        @click="emit('done', { correct: activity.lines.length, total: activity.lines.length })"
      />
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { ReadAlongActivity, ReadAlongLine } from '../../engine/types'
import { speak } from '../../utils/tts'
import { playSfx } from '../../utils/sfx'
import KButton from '../ui/KButton.vue'

const props = defineProps<{ activity: ReadAlongActivity; color?: string; tts?: boolean }>()
const emit = defineEmits<{ done: [score: { correct: number; total: number }] }>()

const activeId = ref('')
const readCount = ref(0)
const visited = ref(new Set<string>())

function read(line: ReadAlongLine) {
  activeId.value = line.id
  if (!visited.value.has(line.id)) {
    visited.value = new Set([...visited.value, line.id])
    readCount.value++
  }
  playSfx('tap')
  if (props.tts !== false) {
    speak(line.speak || line.text, { lang: line.speakLang, rate: 0.85 })
  }
}

function readAll() {
  // 勿先 stopSpeak 再立刻 speak；speak() 会打断并错开 cancel 间隔
  let i = 0
  const lines = props.activity.lines
  const tick = () => {
    if (i >= lines.length) return
    read(lines[i])
    i++
    setTimeout(tick, 1800)
  }
  tick()
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
.poem-card {
  background: #fff;
  border-radius: var(--radius-lg);
  padding: 36rpx 28rpx;
  box-shadow: var(--shadow-soft);
  margin-bottom: 28rpx;
}
.poem-title {
  display: block;
  text-align: center;
  font-size: 36rpx;
  font-weight: 800;
  margin-bottom: 24rpx;
  color: var(--color-chinese);
}
.line {
  padding: 16rpx 12rpx;
  border-radius: var(--radius-sm);
  margin-bottom: 8rpx;
  text-align: center;
}
.line.active {
  background: #fff3ee;
}
.line__text {
  font-size: 36rpx;
  font-weight: 600;
  line-height: 1.6;
  color: var(--color-ink);
}
.tools {
  display: flex;
  gap: 16rpx;
  justify-content: center;
  flex-wrap: wrap;
}
</style>
