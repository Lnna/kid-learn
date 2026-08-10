<template>
  <view
    class="choice"
    :class="[`choice--${variant}`, rootClass]"
    @click="emit('select')"
  >
    <text class="choice__letter">{{ letter }}</text>
    <view class="choice__body">
      <slot />
    </view>
    <OptionSpeak
      :text="speakText"
      :lang="effectiveLang"
      :enabled="tts !== false"
      :size="variant === 'chip' ? 'sm' : 'md'"
    />
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import OptionSpeak from './OptionSpeak.vue'
import { isPinyinDrillToken } from '../../utils/pinyinSpeak'
import { getLessonSpeakLang } from '../../utils/tts'

const props = withDefaults(
  defineProps<{
    index: number
    label: string
    speak?: string
    speakLang?: string
    tts?: boolean
    variant?: 'card' | 'chip'
    rootClass?: string | Record<string, boolean>
  }>(),
  {
    variant: 'card',
  }
)

const emit = defineEmits<{ select: [] }>()

const letter = computed(() => String.fromCharCode(65 + Math.max(0, props.index)))
const effectiveLang = computed(
  () => props.speakLang || getLessonSpeakLang() || undefined
)
const speakText = computed(() => {
  const label = (props.label || '').trim()
  // 英文课/英文选项：不要按拼音 token 处理（a/b/c 与声母同形）
  if (effectiveLang.value?.toLowerCase().startsWith('en')) {
    return (props.speak || props.label || '').trim()
  }
  // 选项是拼音时朗读 label（TTS 内映为一声汉字），避免 speak 用错调字如「鹅」
  if (isPinyinDrillToken(label)) return label
  return (props.speak || props.label || '').trim()
})
</script>

<style scoped lang="scss">
.choice {
  position: relative;
  background: #fff8ee;
  border: 4rpx solid #e8dcc8;
  box-sizing: border-box;
}
.choice--card {
  border-radius: var(--radius-md);
  padding: 52rpx 16rpx 24rpx;
  min-height: 140rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
}
.choice--chip {
  border-radius: 999rpx;
  padding: 12rpx 14rpx 12rpx 18rpx;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10rpx;
  background: #fff;
  border-color: #f5ebd8;
}
.choice__letter {
  position: absolute;
  top: 10rpx;
  left: 12rpx;
  min-width: 40rpx;
  height: 40rpx;
  padding: 0 8rpx;
  border-radius: 12rpx;
  background: #fff;
  border: 3rpx solid #e8dcc8;
  color: var(--color-ink-soft, #5a5048);
  font-size: 24rpx;
  font-weight: 800;
  line-height: 34rpx;
  text-align: center;
  font-family: var(--font-round);
  box-sizing: border-box;
}
.choice--chip .choice__letter {
  position: static;
  flex-shrink: 0;
  min-width: 44rpx;
  height: 44rpx;
  line-height: 38rpx;
  border-radius: 14rpx;
}
.choice__body {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6rpx;
  width: 100%;
  padding: 0 8rpx;
}
.choice--chip .choice__body {
  flex-direction: row;
  width: auto;
  flex: 1;
  justify-content: flex-start;
  padding: 0;
  gap: 8rpx;
}
.choice--card :deep(.opt-speak) {
  position: absolute;
  top: 8rpx;
  right: 8rpx;
}
</style>
