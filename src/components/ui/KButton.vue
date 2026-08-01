<template>
  <view
    class="k-btn"
    :class="[`k-btn--${variant}`, `k-btn--${size}`, { 'k-btn--block': block, 'k-btn--disabled': disabled }]"
    :style="themeStyle"
    @click="onClick"
  >
    <text class="k-btn__text">{{ label }}</text>
    <slot />
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { playSfx } from '../../utils/sfx'
import { unlockSpeak } from '../../utils/tts'

const props = withDefaults(
  defineProps<{
    label?: string
    variant?: 'primary' | 'soft' | 'ghost' | 'danger'
    size?: 'md' | 'lg' | 'sm'
    color?: string
    block?: boolean
    disabled?: boolean
  }>(),
  {
    label: '',
    variant: 'primary',
    size: 'md',
    block: false,
    disabled: false,
  }
)

const emit = defineEmits<{ click: [] }>()

const themeStyle = computed(() =>
  props.color ? ({ '--btn-color': props.color } as Record<string, string>) : {}
)

function onClick() {
  if (props.disabled) return
  unlockSpeak()
  playSfx('tap')
  emit('click')
}
</script>

<style scoped lang="scss">
.k-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 88rpx;
  padding: 0 40rpx;
  border-radius: 999rpx;
  box-shadow: var(--shadow-soft);
  transition: transform 0.15s ease;
  --btn-color: var(--color-math);
}
.k-btn:active {
  transform: scale(0.96);
}
.k-btn--block {
  width: 100%;
}
.k-btn--disabled {
  opacity: 0.45;
}
.k-btn--sm {
  min-height: 72rpx;
  padding: 0 28rpx;
}
.k-btn--lg {
  min-height: 104rpx;
  padding: 0 48rpx;
}
.k-btn--primary {
  background: var(--btn-color);
}
.k-btn--primary .k-btn__text {
  color: #fff;
  font-weight: 700;
  font-size: 32rpx;
}
.k-btn--soft {
  background: #fff;
  border: 4rpx solid color-mix(in srgb, var(--btn-color) 35%, white);
}
.k-btn--soft .k-btn__text {
  color: var(--btn-color);
  font-weight: 700;
  font-size: 30rpx;
}
.k-btn--ghost {
  background: transparent;
  box-shadow: none;
}
.k-btn--ghost .k-btn__text {
  color: var(--color-ink-soft);
  font-size: 28rpx;
}
.k-btn--danger {
  background: var(--color-error);
}
.k-btn--danger .k-btn__text {
  color: #fff;
  font-weight: 700;
}
.k-btn__text {
  font-family: var(--font-round);
}
</style>
