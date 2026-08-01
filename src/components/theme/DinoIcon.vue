<template>
  <view class="di" :class="{ walk: walking }" :style="{ width: size + 'rpx', height: size + 'rpx' }">
    <svg viewBox="0 0 120 90" xmlns="http://www.w3.org/2000/svg">
      <!-- 通用小恐龙侧影 -->
      <path
        d="M18 78 L14 62 Q10 46 26 40 L34 38 Q36 22 52 18 L66 15 Q86 12 92 28 L94 34 L108 40 L96 46 Q92 60 76 62 L72 78 L62 78 L64 64 L44 64 L46 78 L36 78 L34 62 Q24 60 22 70 L22 78 Z"
        :fill="item.color"
        stroke="#2c2416"
        stroke-width="3"
        stroke-linejoin="round"
      />
      <circle cx="78" cy="28" r="4" fill="#2c2416"/>
      <circle cx="79.5" cy="26.5" r="1.4" fill="#fff"/>
      <path d="M88 36 Q92 40 96 38" fill="none" stroke="#2c2416" stroke-width="2.5" stroke-linecap="round"/>
      <!-- 三角龙的角 -->
      <g v-if="item.id === 'triceratops'" stroke="#2c2416" stroke-width="3" fill="#fff8ee">
        <polygon points="96,22 102,10 104,24"/>
        <polygon points="104,26 114,18 110,30"/>
        <polygon points="98,32 110,32 100,38"/>
      </g>
      <!-- 剑龙骨板 -->
      <g v-if="item.id === 'stegosaurus'" fill="#fff8ee" stroke="#2c2416" stroke-width="2.5">
        <polygon points="34,38 40,20 46,38"/>
        <polygon points="48,34 55,16 62,34"/>
        <polygon points="64,32 70,16 77,32"/>
      </g>
      <!-- 霸王龙大牙 -->
      <g v-if="item.id === 'trex'">
        <polygon points="92,42 96,50 100,42" fill="#fff" stroke="#2c2416" stroke-width="2"/>
      </g>
      <!-- 翼龙翅膀 -->
      <g v-if="item.id === 'pterosaur'">
        <polygon points="30,40 8,18 38,30" :fill="item.color" stroke="#2c2416" stroke-width="3" stroke-linejoin="round" opacity="0.9"/>
      </g>
      <!-- 腕龙长脖子 -->
      <g v-if="item.id === 'brachiosaurus'">
        <path d="M84 40 Q92 12 106 8 L112 14 Q100 20 96 42 Z" :fill="item.color" stroke="#2c2416" stroke-width="3"/>
        <circle cx="107" cy="11" r="3" fill="#2c2416"/>
      </g>
    </svg>
  </view>
</template>

<script setup lang="ts">
import type { DinoItem } from '../../engine/types'

withDefaults(defineProps<{ item: DinoItem; size?: number; walking?: boolean }>(), {
  size: 120,
  walking: false,
})
</script>

<style scoped>
.di {
  display: flex;
  align-items: center;
  justify-content: center;
}
.di svg {
  width: 100%;
  height: 100%;
}
.walk {
  animation: dino-walk 1.2s ease-in-out infinite;
}
@keyframes dino-walk {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  25% { transform: translateY(-6rpx) rotate(-1.5deg); }
  75% { transform: translateY(-3rpx) rotate(1.5deg); }
}
</style>
