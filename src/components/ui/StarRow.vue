<template>
  <view class="stars">
    <text
      v-for="i in 3"
      :key="i"
      class="star"
      :class="{ on: i <= value, pop: i <= value && animate }"
    >★</text>
  </view>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ value: number; animate?: boolean }>(), { animate: false })
</script>

<style scoped lang="scss">
.stars {
  display: flex;
  gap: 12rpx;
  justify-content: center;
}
.star {
  font-size: 48rpx;
  color: #e8dcc8;
  transition: transform 0.3s, color 0.3s;
}
.star.on {
  color: var(--color-star);
}
.star.pop {
  animation: bounce-in 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}
</style>
