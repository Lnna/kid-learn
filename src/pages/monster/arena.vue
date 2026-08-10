<template>
  <view class="arena">
    <view class="arena__bg" />
    <view class="arena__inner">
      <view class="top">
        <text class="top__back" @click="goHome">←</text>
        <view class="top__tabs">
          <text class="top__tab" @click="goHome">学习</text>
          <text class="top__tab top__tab--on">打怪兽</text>
        </view>
        <text class="top__count">{{ mistakes.length }}</text>
      </view>

      <view class="hero">
        <text class="hero__title">打怪兽</text>
        <text class="hero__sub">答对就打败小怪兽，答错它会变大哦</text>
      </view>

      <!-- 列表 -->
      <view v-if="!active && mistakes.length" class="list">
        <view
          v-for="m in mistakes"
          :key="m.id"
          class="card anim-bounce"
          @click="openFight(m)"
        >
          <MonsterBuddy :stage="m.growStage" :size="120" />
          <view class="card__info">
            <text class="card__prompt">{{ m.prompt }}</text>
            <text class="card__meta">
              {{ subjectName(m.subjectId) }} · 错 {{ m.wrongCount }} 次 · 体型 {{ m.growStage }}/3
            </text>
          </view>
          <text class="card__go">打！</text>
        </view>
      </view>

      <!-- 空状态 -->
      <view v-else-if="!active" class="empty anim-bounce">
        <MonsterBuddy :stage="0" :size="160" />
        <text class="empty__title">今天没有小怪兽</text>
        <text class="empty__desc">去闯关吧，答错的题会变成小怪兽</text>
        <KButton label="回首页闯关" color="#FF7A59" @click="goHome" />
      </view>

      <!-- 单题复习 -->
      <view v-else-if="active" class="fight">
        <view class="fight__buddy">
          <MonsterBuddy :stage="active.growStage" :size="180" :pose="pose" />
          <text v-if="feedback" class="fight__fb">{{ feedback }}</text>
        </view>
        <view class="q-card">
          <text class="q-text">{{ active.prompt }}</text>
          <view
            v-if="ttsEnabled && (active.speak || active.prompt)"
            class="q-replay"
            @click="replayPrompt"
          >
            <text class="q-replay__icon">🔊</text>
            <text class="q-replay__label">再听一遍</text>
          </view>
        </view>

        <!-- 选择题 / 听选 -->
        <view v-if="active.activityType !== 'sequence'" class="options">
          <ChoiceOption
            v-for="(opt, i) in active.options || []"
            :key="opt.id"
            :index="i"
            :label="opt.label"
            :speak="opt.speak"
            :speak-lang="opt.speakLang"
            :tts="ttsEnabled"
            :root-class="{
              correct: revealed && opt.id === active.answerId,
              wrong: revealed && picked === opt.id && opt.id !== active.answerId,
            }"
            @select="choose(opt.id)"
          >
            <text class="opt__label">{{ opt.label }}</text>
          </ChoiceOption>
        </view>

        <!-- 排序题 -->
        <template v-else>
          <view class="picked-row">
            <view v-for="(id, i) in seqPicked" :key="'p' + i" class="slot" @click="unpickSeq(i)">
              <text>{{ labelOf(id) }}</text>
            </view>
            <view
              v-for="n in Math.max(0, (active.answerOrder?.length || 0) - seqPicked.length)"
              :key="'e' + n"
              class="slot empty"
            />
          </view>
          <view class="pool">
            <ChoiceOption
              v-for="(opt, i) in active.options || []"
              :key="opt.id"
              variant="chip"
              :index="i"
              :label="opt.label"
              :speak="opt.speak"
              :speak-lang="opt.speakLang"
              :tts="ttsEnabled"
              :root-class="{ used: seqPicked.includes(opt.id) }"
              @select="pickSeq(opt.id)"
            >
              <text class="chip__label">{{ opt.label }}</text>
            </ChoiceOption>
          </view>
          <KButton
            v-if="seqPicked.length === (active.answerOrder?.length || 0)"
            label="检查顺序"
            block
            color="#FF7A59"
            :disabled="busy"
            @click="checkSeq"
          />
        </template>

        <KButton class="fight__back" label="换一只" variant="ghost" @click="closeFight" />
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import {
  listMistakes,
  removeMistake,
  bumpWrong,
  type MistakeItem,
} from '../../engine/mistakes'
import { SUBJECT_MAP } from '../../engine/catalog'
import { loadProgress } from '../../engine/progress'
import type { SubjectId } from '../../engine/types'
import { speak, unlockSpeak, stopSpeak, setLessonSpeakLang } from '../../utils/tts'
import { playSfx } from '../../utils/sfx'
import MonsterBuddy from '../../components/monster/MonsterBuddy.vue'
import ChoiceOption from '../../components/ui/ChoiceOption.vue'
import KButton from '../../components/ui/KButton.vue'

const mistakes = ref<MistakeItem[]>([])
const active = ref<MistakeItem | null>(null)
const picked = ref('')
const revealed = ref(false)
const seqPicked = ref<string[]>([])
const pose = ref<'idle' | 'defeat' | 'grow' | 'shake'>('idle')
const feedback = ref('')
const busy = ref(false)
const ttsEnabled = ref(true)

function refresh() {
  mistakes.value = listMistakes()
  const settings = loadProgress().settings
  ttsEnabled.value = settings.ttsEnabled !== false
}

function subjectName(id: SubjectId) {
  return SUBJECT_MAP[id]?.name || id
}

function goHome() {
  stopSpeak()
  setLessonSpeakLang(undefined)
  uni.navigateBack({
    fail: () => uni.reLaunch({ url: '/pages/index/index' }),
  })
}

function openFight(m: MistakeItem) {
  unlockSpeak()
  setLessonSpeakLang(m.subjectId === 'english' ? 'en-US' : undefined)
  active.value = { ...m, options: m.options ? m.options.map((o) => ({ ...o })) : [] }
  picked.value = ''
  revealed.value = false
  seqPicked.value = []
  pose.value = 'idle'
  feedback.value = ''
  busy.value = false
  playSfx('tap')
  if (ttsEnabled.value && (m.speak || m.prompt)) {
    setTimeout(() => speak(m.speak || m.prompt, { silent: true }), 280)
  }
}

function closeFight() {
  stopSpeak()
  setLessonSpeakLang(undefined)
  active.value = null
  pose.value = 'idle'
  feedback.value = ''
  busy.value = false
  refresh()
}

function replayPrompt() {
  if (!active.value || !ttsEnabled.value) return
  unlockSpeak()
  playSfx('tap')
  speak(active.value.speak || active.value.prompt)
}

function onCorrect() {
  if (!active.value) return
  busy.value = true
  pose.value = 'defeat'
  feedback.value = '打败啦！★'
  playSfx('correct')
  const id = active.value.id
  setTimeout(() => {
    removeMistake(id)
    active.value = null
    pose.value = 'idle'
    feedback.value = ''
    busy.value = false
    refresh()
  }, 750)
}

function onWrong() {
  if (!active.value) return
  busy.value = true
  const prev = active.value.growStage
  const updated = bumpWrong(active.value.id)
  if (updated) {
    active.value = { ...updated, options: active.value.options }
    pose.value = updated.growStage > prev ? 'grow' : 'shake'
    feedback.value = updated.growStage > prev ? '它长大了！' : '它更凶了！'
  } else {
    pose.value = 'shake'
    feedback.value = '再试一次'
  }
  playSfx('wrong')
  setTimeout(() => {
    pose.value = 'idle'
    feedback.value = ''
    picked.value = ''
    revealed.value = false
    seqPicked.value = []
    busy.value = false
    refresh()
  }, 700)
}

function choose(id: string) {
  if (!active.value || busy.value || revealed.value) return
  picked.value = id
  revealed.value = true
  const ok = id === active.value.answerId
  if (ok) onCorrect()
  else onWrong()
}

function labelOf(id: string) {
  return active.value?.options?.find((o) => o.id === id)?.label || id
}

function pickSeq(id: string) {
  if (!active.value || busy.value) return
  if (seqPicked.value.includes(id)) return
  const need = active.value.answerOrder?.length || 0
  if (seqPicked.value.length >= need) return
  seqPicked.value = [...seqPicked.value, id]
  playSfx('tap')
}

function unpickSeq(i: number) {
  if (busy.value) return
  seqPicked.value = seqPicked.value.filter((_, idx) => idx !== i)
}

function checkSeq() {
  if (!active.value || busy.value) return
  const order = active.value.answerOrder || []
  const ok = seqPicked.value.length === order.length && seqPicked.value.every((id, i) => id === order[i])
  if (ok) onCorrect()
  else onWrong()
}

onShow(refresh)
</script>

<style scoped lang="scss">
.arena {
  min-height: 100vh;
  position: relative;
  padding: calc(16rpx + var(--safe-top)) 24rpx calc(40rpx + var(--safe-bottom));
}
.arena__bg {
  position: fixed;
  inset: 0;
  background:
    radial-gradient(ellipse at 20% 0%, rgba(255, 122, 89, 0.18), transparent 50%),
    radial-gradient(ellipse at 90% 10%, rgba(255, 209, 102, 0.2), transparent 45%),
    radial-gradient(ellipse at 50% 100%, rgba(62, 207, 142, 0.12), transparent 50%),
    var(--color-cream);
  z-index: 0;
}
.arena__inner {
  position: relative;
  z-index: 1;
  max-width: var(--content-max);
  margin: 0 auto;
}
.top {
  display: flex;
  align-items: center;
  gap: 16rpx;
  margin-bottom: 20rpx;
}
.top__back {
  font-size: 36rpx;
  color: var(--color-ink-soft);
  padding: 8rpx 12rpx 8rpx 0;
}
.top__tabs {
  flex: 1;
  display: flex;
  gap: 12rpx;
  background: #fff;
  border-radius: 999rpx;
  padding: 8rpx;
  box-shadow: var(--shadow-soft);
}
.top__tab {
  flex: 1;
  text-align: center;
  font-size: 26rpx;
  font-weight: 700;
  color: var(--color-muted);
  padding: 12rpx 0;
  border-radius: 999rpx;
}
.top__tab--on {
  background: color-mix(in srgb, var(--color-error) 18%, white);
  color: var(--color-error);
}
.top__count {
  min-width: 48rpx;
  height: 48rpx;
  border-radius: 999rpx;
  background: var(--color-error);
  color: #fff;
  font-size: 24rpx;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 12rpx;
}
.hero {
  text-align: center;
  margin-bottom: 28rpx;
}
.hero__title {
  display: block;
  font-size: 52rpx;
  font-weight: 900;
  color: var(--color-ink);
  font-family: var(--font-round);
}
.hero__sub {
  display: block;
  margin-top: 8rpx;
  font-size: 26rpx;
  color: var(--color-muted);
}
.list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}
.card {
  display: flex;
  align-items: center;
  gap: 16rpx;
  background: #fff;
  border-radius: var(--radius-lg);
  padding: 20rpx 24rpx;
  box-shadow: var(--shadow-soft);
  border: 4rpx solid color-mix(in srgb, var(--color-error) 28%, white);
}
.card:active {
  transform: scale(0.98);
}
.card__info {
  flex: 1;
  min-width: 0;
}
.card__prompt {
  display: block;
  font-size: 30rpx;
  font-weight: 800;
  color: var(--color-ink);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.card__meta {
  display: block;
  margin-top: 6rpx;
  font-size: 22rpx;
  color: var(--color-muted);
}
.card__go {
  font-size: 32rpx;
  font-weight: 900;
  color: var(--color-error);
}
.empty {
  margin-top: 60rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16rpx;
  background: #fff;
  border-radius: var(--radius-lg);
  padding: 48rpx 32rpx;
  box-shadow: var(--shadow-soft);
}
.empty__title {
  font-size: 36rpx;
  font-weight: 800;
  color: var(--color-ink);
}
.empty__desc {
  font-size: 26rpx;
  color: var(--color-muted);
  margin-bottom: 12rpx;
  text-align: center;
}
.fight__buddy {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20rpx;
  min-height: 220rpx;
}
.fight__fb {
  margin-top: 8rpx;
  font-size: 32rpx;
  font-weight: 800;
  color: var(--color-star);
}
.q-card {
  background: #fff;
  border-radius: var(--radius-lg);
  padding: 32rpx 28rpx 24rpx;
  margin-bottom: 24rpx;
  box-shadow: var(--shadow-soft);
  text-align: center;
}
.q-text {
  display: block;
  font-size: 40rpx;
  font-weight: 800;
  color: var(--color-ink);
  white-space: pre-wrap;
  line-height: 1.45;
}
.q-replay {
  margin-top: 18rpx;
  display: inline-flex;
  align-items: center;
  gap: 10rpx;
  padding: 12rpx 28rpx;
  border-radius: 999rpx;
  background: #fff8ee;
  border: 4rpx solid #e8dcc8;
}
.q-replay__icon {
  font-size: 30rpx;
}
.q-replay__label {
  font-size: 26rpx;
  font-weight: 700;
}
.options {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20rpx;
  margin-bottom: 24rpx;
}
.opt__label {
  font-size: 34rpx;
  font-weight: 700;
}
.picked-row {
  display: flex;
  gap: 12rpx;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 20rpx;
  min-height: 96rpx;
}
.slot {
  min-width: 100rpx;
  height: 88rpx;
  padding: 0 20rpx;
  background: #fff8ee;
  border: 4rpx solid #e8dcc8;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 30rpx;
}
.slot.empty {
  background: #fff;
  border-style: dashed;
}
.pool {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
  justify-content: center;
  margin-bottom: 24rpx;
}
.chip__label {
  font-weight: 700;
  font-size: 30rpx;
}
.fight__back {
  margin-top: 16rpx;
}
:deep(.choice.correct) {
  border-color: var(--color-success);
  background: #e8fff3;
}
:deep(.choice.wrong) {
  border-color: var(--color-error);
  background: #ffe8e8;
  animation: wiggle 0.4s ease;
}
:deep(.choice.used) {
  opacity: 0.3;
}
</style>
