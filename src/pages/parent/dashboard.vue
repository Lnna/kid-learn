<template>
  <view class="parent">
    <view class="parent__inner">
      <text class="back" @click="goBack">← 返回</text>
      <text class="title">家长中心</text>
      <text class="sub">了解孩子的学习进度</text>

      <view class="summary">
        <view class="summary__item">
          <text class="summary__num">{{ totalStars }}</text>
          <text class="summary__label">总星星</text>
        </view>
        <view class="summary__item">
          <text class="summary__num">{{ completedLevels }}</text>
          <text class="summary__label">已通关</text>
        </view>
        <view class="summary__item">
          <text class="summary__num">{{ studyMinutes }}</text>
          <text class="summary__label">学习分钟</text>
        </view>
      </view>

      <view v-for="s in subjects" :key="s.id" class="card" :style="{ '--c': s.color }">
        <view class="card__head">
          <Mascot :name="s.mascot as any" :size="72" />
          <view>
            <text class="card__name">{{ s.name }}</text>
            <text class="card__stars">★ {{ starOf(s.id) }} · 完成 {{ doneOf(s.id) }}/{{ totalOf(s) }}</text>
          </view>
        </view>
        <view class="bar">
          <view class="bar__fill" :style="{ width: pctOf(s) + '%' }" />
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { SUBJECTS, getAllLevelIds } from '../../engine/catalog'
import { loadProgress, getTotalStars } from '../../engine/progress'
import type { AppProgress, Subject, SubjectId } from '../../engine/types'
import Mascot from '../../components/ui/Mascot.vue'

const subjects = SUBJECTS
const progress = ref<AppProgress | null>(null)
const totalStars = ref(0)

const completedLevels = computed(() => {
  if (!progress.value) return 0
  return (Object.values(progress.value.subjects) as AppProgress['subjects'][SubjectId][]).reduce(
    (sum, sub) => sum + Object.values(sub.levels).filter((l) => l.completed).length,
    0
  )
})

const studyMinutes = computed(() => {
  if (!progress.value) return 0
  return (Object.values(progress.value.subjects) as AppProgress['subjects'][SubjectId][]).reduce(
    (sum, sub) => sum + sub.studyMinutes,
    0
  )
})

function starOf(id: SubjectId) {
  return progress.value?.subjects[id]?.totalStars || 0
}

function doneOf(id: SubjectId) {
  const levels = progress.value?.subjects[id]?.levels || {}
  return Object.values(levels).filter((l) => l.completed).length
}

function totalOf(s: Subject) {
  return getAllLevelIds(s).length
}

function pctOf(s: Subject) {
  const t = totalOf(s)
  if (!t) return 0
  return Math.round((doneOf(s.id) / t) * 100)
}

function goBack() {
  uni.navigateBack()
}

onShow(() => {
  progress.value = loadProgress()
  totalStars.value = getTotalStars()
})
</script>

<style scoped lang="scss">
.parent {
  min-height: 100vh;
  background: var(--color-cream);
  padding: calc(16rpx + var(--safe-top)) 24rpx calc(40rpx + var(--safe-bottom));
}
.parent__inner {
  max-width: var(--content-max);
  margin: 0 auto;
}
.back {
  font-size: 28rpx;
  color: var(--color-ink-soft);
}
.title {
  display: block;
  font-size: 48rpx;
  font-weight: 900;
  margin-top: 12rpx;
}
.sub {
  display: block;
  font-size: 26rpx;
  color: var(--color-muted);
  margin-bottom: 28rpx;
}
.summary {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16rpx;
  margin-bottom: 32rpx;
}
.summary__item {
  background: #fff;
  border-radius: var(--radius-md);
  padding: 24rpx;
  text-align: center;
  box-shadow: var(--shadow-soft);
}
.summary__num {
  display: block;
  font-size: 40rpx;
  font-weight: 800;
  color: var(--color-science);
}
.summary__label {
  font-size: 22rpx;
  color: var(--color-muted);
}
.card {
  background: #fff;
  border-radius: var(--radius-lg);
  padding: 24rpx;
  margin-bottom: 20rpx;
  box-shadow: var(--shadow-soft);
  border: 4rpx solid color-mix(in srgb, var(--c) 30%, white);
}
.card__head {
  display: flex;
  align-items: center;
  gap: 16rpx;
  margin-bottom: 16rpx;
}
.card__name {
  display: block;
  font-size: 34rpx;
  font-weight: 800;
  color: var(--c);
}
.card__stars {
  display: block;
  font-size: 24rpx;
  color: var(--color-muted);
  margin-top: 4rpx;
}
.bar {
  height: 14rpx;
  background: #f0e6d6;
  border-radius: 999rpx;
  overflow: hidden;
}
.bar__fill {
  height: 100%;
  background: var(--c);
  border-radius: 999rpx;
}
</style>
