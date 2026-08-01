<template>
  <view class="map-page" :style="{ '--c': subject?.color || '#3ECF8E' }">
    <view class="map-page__bg" />
    <view class="map-page__inner">
      <view class="top">
        <view class="back" @click="goBack">← 返回</view>
        <view class="head">
          <Mascot v-if="subject" :name="subject.mascot as any" :size="96" />
          <view class="head__mid">
            <text class="head__name">{{ subject?.name }}</text>
            <text class="head__desc">{{ subject?.description }}</text>
          </view>
          <view v-if="themeId" class="head__book" @click="goCollection">
            <text class="head__book-icon">{{ subject?.emoji }}</text>
            <text class="head__book-label">图鉴</text>
          </view>
        </view>
      </view>

      <view v-for="unit in subject?.units || []" :key="unit.id" class="unit">
        <text class="unit__title">{{ unit.title }}</text>
        <text v-if="unit.subtitle" class="unit__sub">{{ unit.subtitle }}</text>
        <view class="levels">
          <view
            v-for="(lv, i) in unit.levels"
            :key="lv.id"
            class="level"
            :class="{
              locked: !unlocked[lv.id],
              done: !!progress[lv.id]?.completed,
              current: unlocked[lv.id] && !progress[lv.id]?.completed,
            }"
            @click="openLevel(lv.id)"
          >
            <view class="level__badge">
              <text v-if="!unlocked[lv.id]" class="lock">🔒</text>
              <text v-else class="num">{{ i + 1 }}</text>
            </view>
            <text class="level__title">{{ lv.title }}</text>
            <StarRow :value="progress[lv.id]?.bestStars || 0" />
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { onLoad, onShow } from '@dcloudio/uni-app'
import { getSubject, getAllLevelIds, isTheme } from '../../engine/catalog'
import { getLevelProgress, isLevelUnlocked, loadProgress } from '../../engine/progress'
import type { Subject, SubjectId, LevelProgress, ThemeId } from '../../engine/types'
import Mascot from '../../components/ui/Mascot.vue'
import StarRow from '../../components/ui/StarRow.vue'

const subjectId = ref<SubjectId>('math')
const subject = computed<Subject | null>(() => {
  try {
    return getSubject(subjectId.value)
  } catch {
    return null
  }
})
const progress = ref<Record<string, LevelProgress>>({})
const unlocked = ref<Record<string, boolean>>({})
const themeId = computed<ThemeId | null>(() => (isTheme(subjectId.value) ? subjectId.value : null))

function refresh() {
  const s = subject.value
  if (!s) return
  const ids = getAllLevelIds(s)
  const map: Record<string, LevelProgress> = {}
  const unlock: Record<string, boolean> = {}
  ids.forEach((id) => {
    map[id] = getLevelProgress(subjectId.value, id)
    unlock[id] = isLevelUnlocked(subjectId.value, ids, id)
  })
  progress.value = map
  unlocked.value = unlock
  loadProgress()
}

function openLevel(levelId: string) {
  if (!unlocked.value[levelId]) {
    uni.showToast({ title: '先完成前面的关卡哦', icon: 'none' })
    return
  }
  uni.navigateTo({
    url: `/pages/lesson/play?subject=${subjectId.value}&level=${levelId}`,
  })
}

function goCollection() {
  if (themeId.value) {
    uni.navigateTo({ url: `/pages/theme/collection?theme=${themeId.value}` })
  }
}

function goBack() {
  uni.navigateBack()
}

onLoad((q) => {
  if (q?.id) subjectId.value = q.id as SubjectId
})

onShow(refresh)
</script>

<style scoped lang="scss">
.map-page {
  min-height: 100vh;
  position: relative;
  padding: calc(16rpx + var(--safe-top)) 24rpx calc(40rpx + var(--safe-bottom));
}
.map-page__bg {
  position: fixed;
  inset: 0;
  background:
    radial-gradient(ellipse at 10% 0%, color-mix(in srgb, var(--c) 22%, transparent), transparent 50%),
    var(--color-cream);
  z-index: 0;
}
.map-page__inner {
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
.head {
  display: flex;
  align-items: center;
  gap: 20rpx;
  margin-bottom: 32rpx;
}
.head__mid {
  flex: 1;
  min-width: 0;
}
.head__book {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #fff;
  border-radius: var(--radius-md);
  padding: 12rpx 20rpx;
  box-shadow: var(--shadow-soft);
  border: 3rpx solid color-mix(in srgb, var(--c) 40%, white);
}
.head__book-icon {
  font-size: 44rpx;
}
.head__book-label {
  font-size: 22rpx;
  font-weight: 700;
  color: var(--c);
}
.head__name {
  display: block;
  font-size: 48rpx;
  font-weight: 900;
  color: var(--c);
}
.head__desc {
  display: block;
  font-size: 24rpx;
  color: var(--color-muted);
  margin-top: 4rpx;
}
.unit {
  margin-bottom: 40rpx;
}
.unit__title {
  display: block;
  font-size: 34rpx;
  font-weight: 800;
  color: var(--color-ink);
  margin-bottom: 6rpx;
}
.unit__sub {
  display: block;
  font-size: 24rpx;
  color: var(--color-muted);
  margin-bottom: 16rpx;
}
.levels {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16rpx;
}
@media (min-width: 768px) {
  .levels {
    grid-template-columns: repeat(3, 1fr);
  }
}
.level {
  background: #fff;
  border-radius: var(--radius-md);
  padding: 24rpx 16rpx;
  text-align: center;
  box-shadow: var(--shadow-soft);
  border: 4rpx solid #f5ebd8;
}
.level.current {
  border-color: var(--c);
  animation: path-glow 2s ease-in-out infinite;
}
.level.done {
  border-color: color-mix(in srgb, var(--c) 50%, white);
}
.level.locked {
  opacity: 0.55;
}
.level__badge {
  width: 72rpx;
  height: 72rpx;
  margin: 0 auto 12rpx;
  border-radius: 50%;
  background: color-mix(in srgb, var(--c) 18%, white);
  display: flex;
  align-items: center;
  justify-content: center;
}
.num {
  font-size: 32rpx;
  font-weight: 800;
  color: var(--c);
}
.lock {
  font-size: 28rpx;
}
.level__title {
  display: block;
  font-size: 26rpx;
  font-weight: 700;
  color: var(--color-ink);
  margin-bottom: 10rpx;
  min-height: 72rpx;
}
</style>
