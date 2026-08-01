<template>
  <view class="play" :style="{ '--c': subject?.color || '#3ECF8E' }">
    <view class="play__bg" />
    <view class="play__inner">
      <view class="bar">
        <text class="bar__back" @click="goBack">←</text>
        <view class="bar__mid">
          <text class="bar__title">{{ level?.title }}</text>
          <text class="bar__step">活动 {{ actIndex + 1 }} / {{ totalActs }}</text>
        </view>
        <view class="bar__progress">
          <view class="bar__fill" :style="{ width: progressPct + '%' }" />
        </view>
      </view>

      <view v-if="!finished && currentAct" class="stage">
        <ActivityRenderer
          :key="currentAct.id"
          :activity="currentAct"
          :color="subject?.color"
          :tts="ttsEnabled"
          @done="onActDone"
        />
      </view>

      <StarReward
        v-if="finished"
        :stars="finalStars"
        :color="subject?.color"
        :mascot="(subject?.mascot as any) || 'fox'"
        :new-unlocks="newUnlockNames"
        @retry="retry"
        @next="goNext"
        @back="goMap"
        @collection="goCollection"
      />
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { findLevel, getAllLevelIds, isTheme } from '../../engine/catalog'
import { calcStars, recordLevelResult, loadProgress } from '../../engine/progress'
import { unlockItems } from '../../engine/collection'
import { MINERAL_MAP } from '../../data/gem/minerals'
import { DINO_MAP } from '../../data/dino/dinosaurs'
import { setSfxEnabled } from '../../utils/sfx'
import { unlockSpeak, stopSpeak } from '../../utils/tts'
import type { Activity, Level, Subject, SubjectId } from '../../engine/types'
import ActivityRenderer from '../../engine/renderer.vue'
import StarReward from '../../components/activities/StarReward.vue'

const subjectId = ref<SubjectId>('math')
const levelId = ref('')
const subject = ref<Subject | null>(null)
const level = ref<Level | null>(null)
const actIndex = ref(0)
const scores = ref<{ correct: number; total: number }[]>([])
const finished = ref(false)
const finalStars = ref(0)
const startedAt = ref(Date.now())
const ttsEnabled = ref(true)
const newUnlockNames = ref<string[]>([])

const currentAct = computed<Activity | null>(() => level.value?.activities[actIndex.value] || null)
const totalActs = computed(() => level.value?.activities.length || 1)
const progressPct = computed(() =>
  finished.value ? 100 : Math.round((actIndex.value / totalActs.value) * 100)
)

function onActDone(score: { correct: number; total: number }) {
  scores.value.push(score)
  if (actIndex.value < totalActs.value - 1) {
    actIndex.value++
  } else {
    finish()
  }
}

function finish() {
  const correct = scores.value.reduce((s, x) => s + x.correct, 0)
  const total = scores.value.reduce((s, x) => s + x.total, 0)
  finalStars.value = calcStars(correct, total)
  const secs = Math.round((Date.now() - startedAt.value) / 1000)
  recordLevelResult(subjectId.value, levelId.value, finalStars.value, secs)
  collectRewards()
  finished.value = true
}

function collectRewards() {
  if (!isTheme(subjectId.value)) return
  const rewards = level.value?.rewards || []
  const fresh = unlockItems(subjectId.value, rewards)
  newUnlockNames.value = fresh
    .map((id) => (subjectId.value === 'gem' ? MINERAL_MAP[id]?.name : DINO_MAP[id]?.name))
    .filter((n): n is string => !!n)
}

function goCollection() {
  stopSpeak()
  if (isTheme(subjectId.value)) {
    uni.navigateTo({ url: `/pages/theme/collection?theme=${subjectId.value}` })
  }
}

function retry() {
  stopSpeak()
  actIndex.value = 0
  scores.value = []
  finished.value = false
  newUnlockNames.value = []
  startedAt.value = Date.now()
}

function loadLevel(nextLevelId: string) {
  const found = findLevel(subjectId.value, nextLevelId)
  if (!found) {
    uni.showToast({ title: '关卡不存在', icon: 'none' })
    return false
  }
  levelId.value = nextLevelId
  subject.value = found.subject
  level.value = found.level
  actIndex.value = 0
  scores.value = []
  finished.value = false
  newUnlockNames.value = []
  startedAt.value = Date.now()
  // #ifdef H5
  try {
    const hash = `#/pages/lesson/play?subject=${subjectId.value}&level=${nextLevelId}`
    if (typeof history !== 'undefined' && history.replaceState) {
      history.replaceState(null, '', hash)
    }
  } catch {
    /* ignore */
  }
  // #endif
  return true
}

function goNext() {
  stopSpeak()
  if (!subject.value) return
  const ids = getAllLevelIds(subject.value)
  const idx = ids.indexOf(levelId.value)
  if (idx >= 0 && idx < ids.length - 1) {
    loadLevel(ids[idx + 1])
  } else {
    goMap()
  }
}

function goMap() {
  stopSpeak()
  uni.navigateBack({
    fail: () => {
      uni.reLaunch({ url: `/pages/subject/map?id=${subjectId.value}` })
    },
  })
}

function goBack() {
  unlockSpeak()
  goMap()
}

onLoad((q) => {
  subjectId.value = (q?.subject as SubjectId) || 'math'
  levelId.value = (q?.level as string) || ''
  const found = findLevel(subjectId.value, levelId.value)
  if (!found) {
    uni.showToast({ title: '关卡不存在', icon: 'none' })
    setTimeout(() => uni.navigateBack(), 800)
    return
  }
  subject.value = found.subject
  level.value = found.level
  const settings = loadProgress().settings
  ttsEnabled.value = settings.ttsEnabled
  setSfxEnabled(settings.sfxEnabled)
  startedAt.value = Date.now()
})
</script>

<style scoped lang="scss">
.play {
  min-height: 100vh;
  position: relative;
  padding: calc(12rpx + var(--safe-top)) 24rpx calc(32rpx + var(--safe-bottom));
}
.play__bg {
  position: fixed;
  inset: 0;
  background:
    radial-gradient(ellipse at 80% 0%, color-mix(in srgb, var(--c) 16%, transparent), transparent 50%),
    var(--color-cream);
  z-index: 0;
}
.play__inner {
  position: relative;
  z-index: 1;
  max-width: var(--content-max);
  margin: 0 auto;
}
.bar {
  margin-bottom: 24rpx;
}
.bar__back {
  font-size: 36rpx;
  color: var(--color-ink-soft);
  display: inline-block;
  padding: 8rpx 16rpx 8rpx 0;
}
.bar__mid {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 12rpx;
}
.bar__title {
  font-size: 32rpx;
  font-weight: 800;
  color: var(--color-ink);
}
.bar__step {
  font-size: 24rpx;
  color: var(--color-muted);
}
.bar__progress {
  height: 12rpx;
  background: #e8dcc8;
  border-radius: 999rpx;
  overflow: hidden;
}
.bar__fill {
  height: 100%;
  background: var(--c);
  border-radius: 999rpx;
  transition: width 0.3s ease;
}
.stage {
  padding-bottom: 40rpx;
}
</style>
