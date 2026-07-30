<template>
  <view class="k-card anim-bounce" :style="styleVar">
    <slot />
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ color?: string }>()
const styleVar = computed(() =>
  props.color ? ({ '--card-accent': props.color } as Record<string, string>) : {}
)
</script>

<style scoped lang="scss">
.k-card {
  background: #fff;
  border-radius: var(--radius-lg);
  padding: 32rpx;
  box-shadow: var(--shadow-soft);
  border: 4rpx solid color-mix(in srgb, var(--card-accent, #f5ebd8) 40%, white);
}
</style>
