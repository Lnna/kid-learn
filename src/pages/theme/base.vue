<template>
  <view class="base">
    <view class="base__bg" />
    <view class="base__inner">
      <view class="top">
        <view class="back" @click="goBack">← 返回</view>
        <text class="title">主题基地</text>
        <text class="subtitle">选择你喜欢的探险，成为小小专家</text>
        <view class="stars-pill">
          <text class="stars-pill__num">★ {{ totalStars }}</text>
          <text class="stars-pill__tip">{{ shuttleTip }}</text>
        </view>
      </view>

      <view class="doors">
        <view
          v-for="t in themeCards"
          :key="t.id"
          class="door anim-bounce"
          :class="{ locked: !t.canEnter }"
          :style="{ '--c': t.color }"
          @click="enter(t.id)"
        >
          <view class="door__arch">
            <ActivityIcon :name="t.emoji" :size="96" />
          </view>
          <text class="door__name">{{ t.name }}</text>
          <text class="door__desc">{{ t.description }}</text>
          <text class="door__stars">★ {{ t.stars }}</text>
          <view v-if="!t.canEnter" class="door__lock">
            <text class="door__lock-icon">🔒</text>
            <text class="door__lock-text">集满 {{ SHUTTLE_STARS }} 星开启时空穿梭</text>
          </view>
          <view v-else-if="t.isChosen && !shuttle" class="door__tag">已出发</view>
        </view>
      </view>

      <view class="coming">
        <text class="coming__label">更多主题筹备中</text>
        <view class="coming__row">
          <view class="coming__chip">🚀 宇宙空间站</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { THEMES } from '../../engine/catalog'
import { loadProgress } from '../../engine/progress'
import { canEnter, chooseTheme, shuttleUnlocked, themeTotalStars, loadThemeLock, SHUTTLE_STARS } from '../../engine/themeLock'
import type { ThemeId } from '../../engine/types'
import { unlockSpeak } from '../../utils/tts'
import { playSfx } from '../../utils/sfx'
import ActivityIcon from '../../components/ui/ActivityIcon.vue'

const totalStars = ref(0)
const shuttle = ref(false)
const chosen = ref<ThemeId | undefined>(undefined)
const subjectStars = ref<Record<string, number>>({})

const shuttleTip = computed(() =>
  shuttle.value ? '时空穿梭已开启' : `集满 ${SHUTTLE_STARS} 星开启时空穿梭`
)

const themeCards = computed(() =>
  THEMES.map((t) => ({
    id: t.id as ThemeId,
    name: t.name,
    emoji: t.emoji,
    color: t.color,
    description: t.description,
    stars: subjectStars.value[t.id] || 0,
    canEnter: canEnter(t.id as ThemeId),
    isChosen: chosen.value === t.id,
  }))
)

function refresh() {
  const p = loadProgress()
  const stars: Record<string, number> = {}
  THEMES.forEach((t) => {
    stars[t.id] = p.subjects[t.id]?.totalStars || 0
  })
  subjectStars.value = stars
  totalStars.value = themeTotalStars()
  shuttle.value = shuttleUnlocked()
  chosen.value = loadThemeLock().chosen
}

function enter(id: ThemeId) {
  unlockSpeak()
  if (!canEnter(id)) {
    playSfx('wrong')
    uni.showToast({ title: `先在前一个主题集满 ${SHUTTLE_STARS} 颗星星吧`, icon: 'none' })
    return
  }
  playSfx('unlock')
  chooseTheme(id)
  uni.navigateTo({ url: `/pages/subject/map?id=${id}` })
}

function goBack() {
  uni.navigateBack()
}

onShow(refresh)
</script>

<style scoped lang="scss">
.base {
  min-height: 100vh;
  position: relative;
  padding: calc(16rpx + var(--safe-top)) 24rpx calc(40rpx + var(--safe-bottom));
}
.base__bg {
  position: fixed;
  inset: 0;
  background:
    radial-gradient(ellipse at 15% 0%, rgba(38, 166, 154, 0.18), transparent 50%),
    radial-gradient(ellipse at 85% 10%, rgba(230, 126, 34, 0.16), transparent 45%),
    var(--color-cream);
  z-index: 0;
}
.base__inner {
  position: relative;
  z-index: 1;
  max-width: var(--content-max);
  margin: 0 auto;
}
.back {
  font-size: 28rpx;
  color: var(--color-ink-soft);
  margin-bottom: 16rpx;
  display: inline-block;
  padding: 8rpx 0;
}
.top {
  text-align: center;
  margin-bottom: 32rpx;
}
.title {
  display: block;
  font-size: 56rpx;
  font-weight: 900;
  color: var(--color-ink);
  font-family: var(--font-round);
}
.subtitle {
  display: block;
  font-size: 26rpx;
  color: var(--color-muted);
  margin-top: 8rpx;
}
.stars-pill {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  background: #fff;
  border-radius: 999rpx;
  padding: 12rpx 32rpx;
  margin-top: 16rpx;
  box-shadow: var(--shadow-soft);
}
.stars-pill__num {
  font-size: 32rpx;
  font-weight: 800;
  color: var(--color-star);
}
.stars-pill__tip {
  font-size: 20rpx;
  color: var(--color-muted);
}
.doors {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24rpx;
}
@media (min-width: 700px) {
  .doors {
    grid-template-columns: 1fr 1fr;
  }
}
.door {
  background: #fff;
  border-radius: var(--radius-lg);
  padding: 32rpx 28rpx;
  text-align: center;
  box-shadow: var(--shadow-soft);
  border: 4rpx solid color-mix(in srgb, var(--c) 40%, white);
  position: relative;
}
.door:active {
  transform: scale(0.98);
}
.door.locked {
  filter: grayscale(0.5);
  opacity: 0.8;
}
.door__arch {
  width: 180rpx;
  height: 200rpx;
  margin: 0 auto 16rpx;
  border-radius: 90rpx 90rpx 24rpx 24rpx;
  background: linear-gradient(180deg, color-mix(in srgb, var(--c) 30%, white), color-mix(in srgb, var(--c) 12%, white));
  border: 6rpx solid var(--c);
  display: flex;
  align-items: center;
  justify-content: center;
}
.door__name {
  display: block;
  font-size: 40rpx;
  font-weight: 800;
  color: var(--c);
}
.door__desc {
  display: block;
  font-size: 24rpx;
  color: var(--color-muted);
  margin-top: 6rpx;
}
.door__stars {
  display: block;
  margin-top: 12rpx;
  font-size: 28rpx;
  font-weight: 700;
  color: var(--color-star);
}
.door__lock {
  margin-top: 12rpx;
  background: var(--color-cream);
  border-radius: 999rpx;
  padding: 10rpx 20rpx;
  display: inline-flex;
  align-items: center;
  gap: 8rpx;
}
.door__lock-icon {
  font-size: 24rpx;
}
.door__lock-text {
  font-size: 22rpx;
  color: var(--color-ink-soft);
}
.door__tag {
  position: absolute;
  top: 16rpx;
  right: 16rpx;
  background: var(--c);
  color: #fff;
  font-size: 20rpx;
  padding: 6rpx 16rpx;
  border-radius: 999rpx;
}
.coming {
  margin-top: 40rpx;
  text-align: center;
}
.coming__label {
  display: block;
  font-size: 24rpx;
  color: var(--color-muted);
  margin-bottom: 12rpx;
}
.coming__row {
  display: flex;
  justify-content: center;
  gap: 16rpx;
  flex-wrap: wrap;
}
.coming__chip {
  background: #fff;
  border-radius: 999rpx;
  padding: 12rpx 24rpx;
  font-size: 24rpx;
  color: var(--color-ink-soft);
  box-shadow: var(--shadow-soft);
  opacity: 0.7;
}
</style>
