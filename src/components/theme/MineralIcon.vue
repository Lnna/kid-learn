<template>
  <view class="mi" :style="{ width: size + 'rpx', height: size + 'rpx' }">
    <svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
      <!-- 晶体 -->
      <g v-if="item.shape === 'crystal'">
        <polygon points="40,8 62,30 54,70 26,70 18,30" :fill="item.color" stroke="#2c2416" stroke-width="3" stroke-linejoin="round"/>
        <polygon points="40,8 50,30 46,66 34,66 30,30" :fill="item.accent || item.color" opacity="0.55"/>
        <polyline points="40,8 40,66" stroke="#2c2416" stroke-width="1.5" opacity="0.4"/>
        <circle cx="32" cy="24" r="4" fill="#fff" opacity="0.8"/>
      </g>
      <!-- 圆石 -->
      <g v-else-if="item.shape === 'pebble'">
        <ellipse cx="40" cy="44" rx="28" ry="24" :fill="item.color" stroke="#2c2416" stroke-width="3"/>
        <path d="M22 40 Q40 30 58 40" fill="none" :stroke="item.accent || '#00000033'" stroke-width="4" stroke-linecap="round"/>
        <path d="M24 52 Q40 44 56 52" fill="none" :stroke="item.accent || '#00000033'" stroke-width="4" stroke-linecap="round" opacity="0.7"/>
        <ellipse cx="30" cy="34" rx="6" ry="4" fill="#fff" opacity="0.5"/>
      </g>
      <!-- 层状 -->
      <g v-else>
        <rect x="14" y="18" width="52" height="14" rx="6" :fill="item.color" stroke="#2c2416" stroke-width="3"/>
        <rect x="18" y="34" width="44" height="14" rx="6" :fill="item.accent || item.color" stroke="#2c2416" stroke-width="3"/>
        <rect x="14" y="50" width="52" height="14" rx="6" :fill="item.color" stroke="#2c2416" stroke-width="3"/>
        <ellipse cx="26" cy="25" rx="4" ry="2.5" fill="#fff" opacity="0.6"/>
      </g>
    </svg>
  </view>
</template>

<script setup lang="ts">
import type { MineralItem } from '../../engine/types'

withDefaults(defineProps<{ item: MineralItem; size?: number }>(), { size: 96 })
</script>

<style scoped>
.mi {
  display: flex;
  align-items: center;
  justify-content: center;
}
.mi svg {
  width: 100%;
  height: 100%;
}
</style>
