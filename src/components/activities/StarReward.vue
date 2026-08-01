<template>
  <view class="reward anim-bounce">
    <!-- 花朵绽放特效 -->
    <view v-if="show" class="bloom">
      <view
        v-for="f in flowers"
        :key="f.id"
        class="bloom__flower"
        :style="f.style"
      >
        <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" class="bloom__svg">
          <g :transform="`rotate(${f.spin} 32 32)`">
            <ellipse cx="32" cy="16" rx="10" ry="14" :fill="f.petal" stroke="#2c2416" stroke-width="1.5"/>
            <ellipse cx="48" cy="32" rx="14" ry="10" :fill="f.petal" stroke="#2c2416" stroke-width="1.5"/>
            <ellipse cx="32" cy="48" rx="10" ry="14" :fill="f.petal" stroke="#2c2416" stroke-width="1.5"/>
            <ellipse cx="16" cy="32" rx="14" ry="10" :fill="f.petal" stroke="#2c2416" stroke-width="1.5"/>
            <ellipse cx="44" cy="20" rx="9" ry="12" :fill="f.petal2" stroke="#2c2416" stroke-width="1.2" transform="rotate(45 44 20)"/>
            <ellipse cx="44" cy="44" rx="9" ry="12" :fill="f.petal2" stroke="#2c2416" stroke-width="1.2" transform="rotate(-45 44 44)"/>
            <ellipse cx="20" cy="44" rx="9" ry="12" :fill="f.petal2" stroke="#2c2416" stroke-width="1.2" transform="rotate(45 20 44)"/>
            <ellipse cx="20" cy="20" rx="9" ry="12" :fill="f.petal2" stroke="#2c2416" stroke-width="1.2" transform="rotate(-45 20 20)"/>
            <circle cx="32" cy="32" r="8" :fill="f.center" stroke="#2c2416" stroke-width="1.5"/>
            <circle cx="32" cy="32" r="3.5" fill="#FFF8EE"/>
          </g>
        </svg>
      </view>
    </view>

    <view class="confetti" v-if="show">
      <text v-for="i in 12" :key="i" class="dot" :style="dotStyle(i)">✦</text>
    </view>
    <Mascot :name="mascot" :size="180" />
    <text class="title">{{ title }}</text>
    <StarRow :value="stars" animate />
    <text class="sub">获得 {{ stars }} 颗小星星</text>
    <view v-if="newUnlocks.length" class="unlock">
      <text class="unlock__label">🎉 新图鉴解锁</text>
      <text v-for="n in newUnlocks" :key="n" class="unlock__name">{{ n }}</text>
      <KButton label="去看图鉴" variant="soft" :color="color" @click="emit('collection')" />
    </view>
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
    mascot?: 'panda' | 'fox' | 'owl' | 'rabbit' | 'bear' | 'mole' | 'dino'
    title?: string
    newUnlocks?: string[]
  }>(),
  {
    mascot: 'fox',
    title: '太棒了！',
    color: '#3ECF8E',
    newUnlocks: () => [],
  }
)

const emit = defineEmits<{ retry: []; next: []; back: []; collection: [] }>()

const show = ref(false)

const petalSets = [
  { petal: '#FF8FB8', petal2: '#FFB6D0', center: '#FFC84A' },
  { petal: '#FF7A59', petal2: '#FFA88F', center: '#FFC84A' },
  { petal: '#9B7BFF', petal2: '#C4B0FF', center: '#FFC84A' },
  { petal: '#4DA3FF', petal2: '#8FC4FF', center: '#FFC84A' },
  { petal: '#3ECF8E', petal2: '#7FE0B2', center: '#FFC84A' },
  { petal: '#FFC84A', petal2: '#FFE08A', center: '#FF7A59' },
]

const flowers = Array.from({ length: 8 }, (_, i) => {
  const angle = (i / 8) * Math.PI * 2 - Math.PI / 2
  const dist = 140 + (i % 3) * 28
  const colors = petalSets[i % petalSets.length]
  return {
    id: i,
    spin: i * 22,
    petal: colors.petal,
    petal2: colors.petal2,
    center: colors.center,
    style: {
      '--tx': `${Math.cos(angle) * dist}rpx`,
      '--ty': `${Math.sin(angle) * dist}rpx`,
      '--delay': `${0.05 + i * 0.07}s`,
      '--size': `${90 + (i % 3) * 18}rpx`,
    } as Record<string, string>,
  }
})

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
  overflow: visible;
}
.bloom {
  position: absolute;
  top: 160rpx;
  left: 50%;
  width: 0;
  height: 0;
  pointer-events: none;
  z-index: 2;
}
.bloom__flower {
  position: absolute;
  width: var(--size, 100rpx);
  height: var(--size, 100rpx);
  margin-left: calc(var(--size, 100rpx) / -2);
  margin-top: calc(var(--size, 100rpx) / -2);
  animation: flower-bloom 1.1s cubic-bezier(0.22, 1.4, 0.36, 1) both;
  animation-delay: var(--delay, 0s);
}
.bloom__svg {
  width: 100%;
  height: 100%;
  filter: drop-shadow(0 4rpx 10rpx rgba(44, 36, 22, 0.15));
}
@keyframes flower-bloom {
  0% {
    opacity: 0;
    transform: translate(0, 0) scale(0.1) rotate(-40deg);
  }
  55% {
    opacity: 1;
    transform: translate(var(--tx), var(--ty)) scale(1.15) rotate(8deg);
  }
  100% {
    opacity: 0.92;
    transform: translate(var(--tx), var(--ty)) scale(1) rotate(0deg);
  }
}
.confetti {
  position: absolute;
  top: 120rpx;
  left: 50%;
  width: 0;
  height: 0;
  pointer-events: none;
  z-index: 1;
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
  position: relative;
  z-index: 3;
}
.sub {
  margin: 16rpx 0 32rpx;
  color: var(--color-muted);
  font-size: 28rpx;
  position: relative;
  z-index: 3;
}
.unlock {
  background: #fff;
  border-radius: var(--radius-md);
  padding: 20rpx 32rpx;
  margin-bottom: 24rpx;
  box-shadow: var(--shadow-soft);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10rpx;
  animation: bounce-in 0.5s ease;
  position: relative;
  z-index: 3;
}
.unlock__label {
  font-size: 26rpx;
  font-weight: 800;
  color: var(--color-ink);
}
.unlock__name {
  font-size: 32rpx;
  font-weight: 900;
  color: var(--color-star);
}
.actions {
  display: flex;
  gap: 20rpx;
  margin-bottom: 16rpx;
  position: relative;
  z-index: 3;
}
</style>
