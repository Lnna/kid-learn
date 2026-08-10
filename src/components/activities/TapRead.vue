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
import { speak, speakAsync, unlockSpeak, prefetchPinyinAudio, getLessonSpeakLang, prefetchSpeak } from '../../utils/tts'
import { playSfx } from '../../utils/sfx'
import KButton from '../ui/KButton.vue'
import ActivityIcon from '../ui/ActivityIcon.vue'

const props = defineProps<{ activity: TapReadActivity; color?: string; tts?: boolean }>()
const emit = defineEmits<{ done: [score: { correct: number; total: number }] }>()

const activeId = ref('')
const explored = ref(new Set<string>())
/** 连点换卡时作废上一段「字母→单词」链 */
let tapGen = 0

function delay(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms))
}

/** 主发音文本：拼音用 label；「A a」等用 speak 单字母 */
function primarySpeakText(item: TapReadActivity['items'][0]): string {
  const label = (item.label || '').trim()
  if (/^[a-zA-ZüÜvāáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ]+$/.test(label)) return label
  return (item.speak || item.label || '').trim()
}

/**
 * 英文 letters：单个字母 + 英文单词副标题 → 先字母，停 0.5s，再单词。
 * 不含：拼音；中文释义；拼读标注（ship + sh）；整词点读。
 */
function isLetterThenWord(spoken: string, subLabel: string | undefined, speakLang?: string): boolean {
  const word = (subLabel || '').trim()
  if (!word || /[\u4e00-\u9fff]/.test(word)) return false
  const en =
    !!speakLang?.toLowerCase().startsWith('en') ||
    !!getLessonSpeakLang()?.toLowerCase().startsWith('en')
  if (!en) return false
  if (!/^[A-Za-z]$/.test(spoken.trim())) return false
  // 至少一个长度为 2+ 的英文词（支持 ice cream）
  return /^[A-Za-z][A-Za-z\s'.-]*$/.test(word) && /[A-Za-z]{2,}/.test(word.replace(/[\s'.-]/g, ''))
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
  const opts = lang ? { lang } : {}

  playSfx('tap')

  if (isLetterThenWord(spoken, word, item.speakLang)) {
    // 等字母播完 → 半秒 → 再读单词；换卡则中断链
    await speakAsync(spoken, opts)
    if (gen !== tapGen) return
    await delay(500)
    if (gen !== tapGen) return
    await speakAsync(word!, opts)
    return
  }

  // 普通点读：只读主文本（拼音 / 单词 / 句子）
  speak(spoken, opts)
}

onMounted(() => {
  // 英文课不预加载拼音音频
  if (getLessonSpeakLang()?.toLowerCase().startsWith('en')) {
    for (const it of props.activity.items) {
      const lang = it.speakLang || 'en-US'
      const primary = (/^[a-zA-ZüÜvāáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ]+$/.test(it.label.trim())
        ? it.label
        : it.speak || it.label
      ).trim()
      if (primary) prefetchSpeak(primary, { lang })
      const sub = it.subLabel?.trim()
      if (sub && !/[\u4e00-\u9fff]/.test(sub) && /^[A-Za-z]/.test(sub)) {
        prefetchSpeak(sub, { lang })
      }
    }
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
