<template>
  <view
    class="opt-speak"
    :class="{ 'opt-speak--sm': size === 'sm' }"
    role="button"
    aria-label="朗读选项"
    @click.stop="onSpeak"
  >
    <text class="opt-speak__icon">🔊</text>
  </view>
</template>

<script setup lang="ts">
import { watch } from 'vue'
import { speak, unlockSpeak, prefetchPinyinAudio, prefetchSpeak } from '../../utils/tts'
import { stripDecorations } from '../../utils/speakText'
import { playSfx } from '../../utils/sfx'

const props = withDefaults(
  defineProps<{
    text?: string
    lang?: string
    enabled?: boolean
    size?: 'md' | 'sm'
  }>(),
  {
    text: '',
    enabled: true,
    size: 'md',
  }
)

watch(
  () => [props.text, props.lang, props.enabled] as const,
  ([text, lang, enabled]) => {
    if (enabled === false) return
    const raw = stripDecorations((text || '').trim())
    if (!raw) return
    const isEn = !!lang && lang.toLowerCase().startsWith('en')
    if (!isEn) prefetchPinyinAudio([raw])
    prefetchSpeak(raw, lang ? { lang } : {})
  },
  { immediate: true }
)

function onSpeak() {
  if (!props.enabled) return
  const raw = stripDecorations((props.text || '').trim())
  if (!raw) return
  unlockSpeak()
  // 先发音再点效，避免点效抢占手机音频焦点造成「先等一下再出声」
  speak(raw, props.lang ? { lang: props.lang } : {})
  playSfx('tap')
}
</script>

<style scoped lang="scss">
.opt-speak {
  flex-shrink: 0;
  width: 72rpx;
  height: 72rpx;
  border-radius: 50%;
  background: #fff8ee;
  border: 4rpx solid #e8dcc8;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4rpx 0 #e8dcc8;
}
.opt-speak:active {
  transform: scale(0.94);
  box-shadow: none;
}
.opt-speak--sm {
  width: 64rpx;
  height: 64rpx;
}
.opt-speak__icon {
  font-size: 34rpx;
  line-height: 1;
}
.opt-speak--sm .opt-speak__icon {
  font-size: 30rpx;
}
</style>
