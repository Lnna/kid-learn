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
import { ref, onMounted, onUnmounted } from 'vue'
import type { TapReadActivity } from '../../engine/types'
import {
  speak,
  speakAsync,
  unlockSpeak,
  prefetchPinyinAudio,
  getLessonSpeakLang,
  prefetchSpeak,
  warmupSpeak,
} from '../../utils/tts'
import { playSfx } from '../../utils/sfx'
import KButton from '../ui/KButton.vue'
import ActivityIcon from '../ui/ActivityIcon.vue'

const props = defineProps<{ activity: TapReadActivity; color?: string; tts?: boolean }>()
const emit = defineEmits<{ done: [score: { correct: number; total: number }] }>()

const activeId = ref('')
const explored = ref(new Set<string>())
/** 连点换卡时作废上一段发音 */
let tapGen = 0

function isEnglishItem(item: TapReadActivity['items'][0]): boolean {
  return (
    !!item.speakLang?.toLowerCase().startsWith('en') ||
    !!getLessonSpeakLang()?.toLowerCase().startsWith('en')
  )
}

/** 主发音文本：拼音用 label；「A a」等用 speak 单字母 */
function primarySpeakText(item: TapReadActivity['items'][0]): string {
  const label = (item.label || '').trim()
  if (/^[a-zA-ZüÜvɑāáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ\u0300-\u036f]+$/.test(label)) return label
  return (item.speak || item.label || '').trim()
}

/**
 * 英文字母点读卡：有英文单词副标题时只读单词（不读字母名）。
 * 覆盖 U1 letters / letter sounds（A-E … U-Z、A-M、N-Z）。
 */
function isLetterWordOnly(spoken: string, subLabel: string | undefined, item: TapReadActivity['items'][0]): boolean {
  const word = (subLabel || '').trim()
  if (!word || /[\u4e00-\u9fff]/.test(word)) return false
  if (!isEnglishItem(item)) return false
  if (!/^[A-Za-z]$/.test(spoken.trim())) return false
  return /^[A-Za-z][A-Za-z\s'.-]*$/.test(word) && /[A-Za-z]{2,}/.test(word.replace(/[\s'.-]/g, ''))
}

function speakOpts(lang: string | undefined) {
  return lang ? { lang } : {}
}

function prefetchEnglishItem(item: TapReadActivity['items'][0]) {
  const lang = item.speakLang || 'en-US'
  const spoken = primarySpeakText(item)
  const word = item.subLabel?.trim()
  if (isLetterWordOnly(spoken, word, item)) {
    prefetchSpeak(word!, { lang })
    return
  }
  if (spoken) prefetchSpeak(spoken, { lang })
  if (word && !/[\u4e00-\u9fff]/.test(word) && /[A-Za-z]/.test(word)) {
    prefetchSpeak(word, { lang })
  }
}

async function onTap(item: TapReadActivity['items'][0]) {
  unlockSpeak()
  const gen = ++tapGen
  activeId.value = item.id
  explored.value = new Set([...explored.value, item.id])
  if (props.tts === false) {
    playSfx('tap')
    return
  }

  const spoken = primarySpeakText(item)
  if (!spoken) return
  const word = item.subLabel?.trim()
  const lang =
    item.speakLang ||
    (getLessonSpeakLang()?.toLowerCase().startsWith('en') ? 'en-US' : undefined) ||
    undefined
  const opts = speakOpts(lang)

  playSfx('tap')

  // 字母点读：只读单词（apple），不读字母名（A / ay）
  if (isLetterWordOnly(spoken, word, item)) {
    await warmupSpeak(word!, opts)
    if (gen !== tapGen) return
    await speakAsync(word!, opts)
    return
  }

  // 普通点读：只读主文本（拼音 / 单词 / 句子）
  speak(spoken, opts)
}

onMounted(() => {
  const enLesson =
    !!getLessonSpeakLang()?.toLowerCase().startsWith('en') ||
    props.activity.items.some((it) => it.speakLang?.toLowerCase().startsWith('en'))

  if (enLesson) {
    for (const it of props.activity.items) prefetchEnglishItem(it)
    return
  }
  const tokens = props.activity.items.map((it) => it.label.trim()).filter(Boolean)
  prefetchPinyinAudio(tokens)
})
onUnmounted(() => {
  tapGen++
})
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
