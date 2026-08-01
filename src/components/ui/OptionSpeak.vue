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
import { speak, unlockSpeak } from '../../utils/tts'
import { toSpeakText, stripDecorations } from '../../utils/speakText'
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

function onSpeak() {
  if (!props.enabled) return
  const raw = (props.text || '').trim()
  if (!raw) return
  // 先清 emoji；纯图案选项不发音、不报错
  const zh = !props.lang || props.lang.toLowerCase().startsWith('zh')
  const t = zh ? toSpeakText(raw) : stripDecorations(raw)
  if (!t) return
  unlockSpeak()
  playSfx('tap')
  speak(t, props.lang ? { lang: props.lang } : {})
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
