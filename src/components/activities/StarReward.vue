<template>
  <view class="reward anim-bounce">
    <view class="confetti" v-if="show">
      <text v-for="i in 12" :key="i" class="dot" :style="dotStyle(i)">✦</text>
    </view>
    <Mascot :name="mascot" :size="180" />
    <text class="title">{{ title }}</text>
    <StarRow :value="stars" animate />
    <text class="sub">获得 {{ stars }} 颗小星星</text>
    <view class="actions">
      <KButton label="再玩一次" variant="soft" :color="color" @click="emit('retry')" />
      <KButton label="下一关" :color="color" @click="emit('next')" />
    </view>
    <KButton label="返回地图" variant="ghost" @click="emit('back')" />
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Mascot from '../ui/Mascot.vue'
import StarRow from '../ui/StarRow.vue'
import KButton from '../ui/KButton.vue'
import { playSfx } from '../../utils/sfx'

withDefaults(
  defineProps<{
    stars: number
    color?: string
    mascot?: 'panda' | 'fox' | 'owl' | 'rabbit' | 'bear'
    title?: string
  }>(),
  {
    mascot: 'fox',
    title: '太棒了！',
    color: '#3ECF8E',
  }
)

const emit = defineEmits<{ retry: []; next: []; back: [] }>()

const show = ref(false)

function dotStyle(i: number) {
  const angle = (i / 12) * 360
  const colors = ['#FF7A59', '#3ECF8E', '#4DA3FF', '#FFC84A', '#FF8FB8', '#9B7BFF']
  return {
    color: colors[i % colors.length],
    transform: `rotate(${angle}deg) translateY(-80rpx)`,
    animationDelay: `${i * 0.05}s`,
  }
}

onMounted(() => {
  show.value = true
  playSfx('complete')
})
</script>

<style scoped lang="scss">
.reward {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40rpx 24rpx;
  position: relative;
}
.confetti {
  position: absolute;
  top: 120rpx;
  left: 50%;
  width: 0;
  height: 0;
  pointer-events: none;
}
.dot {
  position: absolute;
  font-size: 28rpx;
  animation: confetti 1.2s ease-out both;
}
.title {
  font-size: 48rpx;
  font-weight: 800;
  margin: 16rpx 0 20rpx;
  color: var(--color-ink);
}
.sub {
  margin: 16rpx 0 32rpx;
  color: var(--color-muted);
  font-size: 28rpx;
}
.actions {
  display: flex;
  gap: 20rpx;
  margin-bottom: 16rpx;
}
</style>
