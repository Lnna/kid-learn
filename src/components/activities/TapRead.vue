<template>
  <view class="act">
    <text class="act__title">{{ activity.title }}</text>
    <text v-if="activity.instruction" class="act__hint">{{ activity.instruction }}</text>
    <view class="grid">
      <view
        v-for="item in activity.items"
        :key="item.id"
        class="card"
        :class="{ active: activeId === item.id }"
        :style="{ borderColor: item.color || '#f5ebd8' }"
        @click="onTap(item)"
      >
        <view v-if="item.icon" class="card__icon">
          <ActivityIcon :name="item.icon" :size="88" />
        </view>
        <text class="card__label">{{ item.label }}</text>
        <text v-if="item.subLabel" class="card__sub">{{ item.subLabel }}</text>
      </view>
    </view>
    <KButton
      v-if="explored.size >= Math.min(3, activity.items.length)"
      label="下一关活动 →"
      block
      :color="color"
      @click="emit('done', { correct: activity.items.length, total: activity.items.length })"
    />
  </view>
</template>

<script setup lang="ts">
import { ref, onUnmounted } from 'vue'
import type { TapReadActivity } from '../../engine/types'
import { speak, unlockSpeak } from '../../utils/tts'
import { playSfx } from '../../utils/sfx'
import KButton from '../ui/KButton.vue'
import ActivityIcon from '../ui/ActivityIcon.vue'

const props = defineProps<{ activity: TapReadActivity; color?: string; tts?: boolean }>()
const emit = defineEmits<{ done: [score: { correct: number; total: number }] }>()

const activeId = ref('')
const explored = ref(new Set<string>())
let wordTimer: ReturnType<typeof setTimeout> | null = null

function clearWordTimer() {
  if (wordTimer) {
    clearTimeout(wordTimer)
    wordTimer = null
  }
}

function onTap(item: TapReadActivity['items'][0]) {
  unlockSpeak()
  activeId.value = item.id
  explored.value = new Set([...explored.value, item.id])
  playSfx('tap')
  if (props.tts === false) return
  clearWordTimer()
  // 勿先 stopSpeak 再立刻 speak；由 speak() 处理打断与 cancel 间隔
  // 拼音声母/韵母用 label，由 TTS 映射为一声汉字（如 e→婀）；勿用可能错调的 speak
  const label = item.label.trim()
  const letter = (/^[a-zA-ZüÜvāáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ]+$/.test(label)
    ? label
    : item.speak || item.label
  ).trim()
  const word = item.subLabel?.trim()
  // 仅英文点读走「字母 → 单词」；中文副标题（如浮与沉）不要二次打断主句
  const enWord =
    !!word &&
    (item.speakLang?.toLowerCase().startsWith('en') ||
      (!/[\u4e00-\u9fff]/.test(word) && /[a-zA-Z]/.test(word)))
  const lang = item.speakLang || (enWord ? 'en-US' : undefined)
  speak(letter, { lang })
  if (enWord && word) {
    wordTimer = setTimeout(() => {
      wordTimer = null
      speak(word, { lang })
    }, 1000)
  }
}

onUnmounted(clearWordTimer)
</script>

<style scoped lang="scss">
.act__title {
  display: block;
  font-size: 40rpx;
  font-weight: 800;
  color: var(--color-ink);
  margin-bottom: 8rpx;
}
.act__hint {
  display: block;
  font-size: 26rpx;
  color: var(--color-muted);
  margin-bottom: 28rpx;
}
.grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20rpx;
  margin-bottom: 32rpx;
}
@media (min-width: 768px) {
  .grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
.card {
  background: #fff;
  border-radius: var(--radius-md);
  padding: 28rpx 16rpx;
  text-align: center;
  border: 4rpx solid #f5ebd8;
  box-shadow: var(--shadow-soft);
  min-height: 160rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: transform 0.15s;
}
.card.active {
  transform: scale(1.04);
  box-shadow: var(--shadow-pop);
}
.card__icon {
  font-size: 48rpx;
  margin-bottom: 8rpx;
}
.card__label {
  font-size: 44rpx;
  font-weight: 800;
  color: var(--color-ink);
}
.card__sub {
  font-size: 28rpx;
  font-weight: 700;
  color: var(--color-english, #4da3ff);
  margin-top: 8rpx;
}
</style>
