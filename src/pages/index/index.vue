<template>
  <view class="home">
    <view class="home__bg" />
    <view class="home__inner">
      <view class="hero">
        <text class="brand">小小花</text>
        <text class="tagline">幼小衔接 · 玩着学会</text>
        <view class="hero-mascot">
          <Mascot name="panda" :size="140" />
        </view>
        <view class="stats">
          <text class="stats__star">★ {{ totalStars }}</text>
          <text class="stats__label">已收集星星</text>
        </view>
      </view>

      <view class="subjects">
        <view
          v-for="s in subjects"
          :key="s.id"
          class="subject-card anim-bounce"
          :style="{ '--c': s.color }"
          @click="goSubject(s.id)"
        >
          <Mascot :name="mascotName(s.mascot)" :size="100" />
          <view class="subject-card__info">
            <text class="subject-card__emoji">{{ s.emoji }}</text>
            <text class="subject-card__name">{{ s.name }}</text>
            <text class="subject-card__desc">{{ s.description }}</text>
            <text class="subject-card__stars">★ {{ starOf(s.id) }}</text>
          </view>
        </view>
      </view>

      <view class="theme-entry anim-bounce" @click="goThemeBase">
        <view class="theme-entry__doors">
          <text class="theme-entry__door">💎</text>
          <text class="theme-entry__door">🦖</text>
        </view>
        <view class="theme-entry__info">
          <text class="theme-entry__name">主题基地</text>
          <text class="theme-entry__desc">宝石矿洞 · 恐龙营地，选你喜欢的去探险</text>
        </view>
        <text class="theme-entry__arrow">→</text>
      </view>

      <view class="footer-nav">
        <KButton label="家长中心" variant="soft" color="#9B7BFF" @click="goParent" />
        <KButton label="设置" variant="ghost" @click="goSettings" />
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { SUBJECTS } from '../../engine/catalog'
import { getTotalStars, loadProgress } from '../../engine/progress'
import type { SubjectId } from '../../engine/types'
import { unlockSpeak } from '../../utils/tts'
import Mascot from '../../components/ui/Mascot.vue'
import KButton from '../../components/ui/KButton.vue'

const subjects = SUBJECTS
const totalStars = ref(0)
const progressStars = ref<Record<string, number>>({})

type MascotKind = 'panda' | 'fox' | 'owl' | 'rabbit' | 'bear'

function mascotName(name: string): MascotKind {
  const allowed: MascotKind[] = ['panda', 'fox', 'owl', 'rabbit', 'bear']
  return (allowed.includes(name as MascotKind) ? name : 'fox') as MascotKind
}

function refresh() {
  totalStars.value = getTotalStars()
  const p = loadProgress()
  const map: Record<string, number> = {}
  ;(Object.keys(p.subjects) as SubjectId[]).forEach((id) => {
    map[id] = p.subjects[id].totalStars
  })
  progressStars.value = map
}

function starOf(id: string) {
  return progressStars.value[id] || 0
}

function goSubject(id: SubjectId) {
  unlockSpeak()
  uni.navigateTo({ url: `/pages/subject/map?id=${id}` })
}

function goThemeBase() {
  unlockSpeak()
  uni.navigateTo({ url: '/pages/theme/base' })
}

function goParent() {
  uni.navigateTo({ url: '/pages/parent/dashboard' })
}

function goSettings() {
  uni.navigateTo({ url: '/pages/settings/index' })
}

onShow(refresh)
</script>

<style scoped lang="scss">
.home {
  min-height: 100vh;
  position: relative;
  padding: calc(24rpx + var(--safe-top)) 24rpx calc(40rpx + var(--safe-bottom));
}
.home__bg {
  position: fixed;
  inset: 0;
  background:
    radial-gradient(ellipse at 20% 0%, rgba(255, 122, 89, 0.18), transparent 50%),
    radial-gradient(ellipse at 90% 10%, rgba(77, 163, 255, 0.16), transparent 45%),
    radial-gradient(ellipse at 50% 100%, rgba(62, 207, 142, 0.14), transparent 50%),
    var(--color-cream);
  z-index: 0;
}
.home__inner {
  position: relative;
  z-index: 1;
  max-width: var(--content-max);
  margin: 0 auto;
}
.hero {
  text-align: center;
  padding: 24rpx 0 40rpx;
}
.brand {
  display: block;
  font-size: 72rpx;
  font-weight: 900;
  letter-spacing: 8rpx;
  color: var(--color-ink);
  font-family: var(--font-round);
}
.tagline {
  display: block;
  margin-top: 8rpx;
  font-size: 28rpx;
  color: var(--color-muted);
}
.hero-mascot {
  display: flex;
  justify-content: center;
  margin: 16rpx 0;
}
.stats {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  background: #fff;
  padding: 16rpx 36rpx;
  border-radius: 999rpx;
  box-shadow: var(--shadow-soft);
}
.stats__star {
  font-size: 36rpx;
  font-weight: 800;
  color: var(--color-star);
}
.stats__label {
  font-size: 22rpx;
  color: var(--color-muted);
}
.subjects {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24rpx;
}
@media (min-width: 700px) {
  .subjects {
    grid-template-columns: 1fr 1fr;
  }
}
.subject-card {
  display: flex;
  align-items: center;
  gap: 20rpx;
  background: #fff;
  border-radius: var(--radius-lg);
  padding: 28rpx;
  box-shadow: var(--shadow-soft);
  border: 4rpx solid color-mix(in srgb, var(--c) 35%, white);
}
.subject-card:active {
  transform: scale(0.98);
}
.subject-card__info {
  flex: 1;
  min-width: 0;
}
.subject-card__emoji {
  font-size: 28rpx;
  margin-right: 8rpx;
}
.subject-card__name {
  font-size: 40rpx;
  font-weight: 800;
  color: var(--c);
}
.subject-card__desc {
  display: block;
  font-size: 24rpx;
  color: var(--color-muted);
  margin-top: 6rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.subject-card__stars {
  display: block;
  margin-top: 10rpx;
  font-size: 26rpx;
  color: var(--color-star);
  font-weight: 700;
}
.theme-entry {
  display: flex;
  align-items: center;
  gap: 20rpx;
  margin-top: 28rpx;
  background: linear-gradient(120deg, #26a69a, #e67e22);
  border-radius: var(--radius-lg);
  padding: 28rpx;
  box-shadow: var(--shadow-pop);
}
.theme-entry:active {
  transform: scale(0.98);
}
.theme-entry__doors {
  display: flex;
  gap: 8rpx;
}
.theme-entry__door {
  font-size: 56rpx;
  filter: drop-shadow(0 4rpx 6rpx rgba(0, 0, 0, 0.2));
}
.theme-entry__info {
  flex: 1;
  min-width: 0;
}
.theme-entry__name {
  display: block;
  font-size: 40rpx;
  font-weight: 900;
  color: #fff;
}
.theme-entry__desc {
  display: block;
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.9);
  margin-top: 4rpx;
}
.theme-entry__arrow {
  font-size: 48rpx;
  color: #fff;
  font-weight: 800;
}
.footer-nav {
  display: flex;
  justify-content: center;
  gap: 20rpx;
  margin-top: 40rpx;
}
</style>
