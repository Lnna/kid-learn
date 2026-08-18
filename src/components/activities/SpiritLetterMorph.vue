<template>
  <view class="morph">
    <text class="morph__title">{{ activity.title }}</text>
    <text class="morph__hint">{{ activity.instruction || '拖一拖，松手变成字母或数字' }}</text>

    <view v-if="!unlocked" class="lock-card">
      <text class="lock-card__t">变形学具尚未解锁</text>
      <text class="lock-card__d">满星通关得黄金饲料，去「我的小精灵」喂饱后就能玩</text>
      <KButton label="去喂食" color="#3ECF8E" @click="goSpirit" />
      <KButton label="跳过本活动" variant="ghost" @click="skip" />
    </view>

    <template v-else>
      <view class="stage">
        <svg viewBox="0 0 200 200" class="stage__svg" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient :id="gid" cx="40%" cy="35%" r="65%">
              <stop offset="0%" stop-color="#fff" stop-opacity="0.55" />
              <stop offset="50%" :stop-color="color" />
              <stop offset="100%" :stop-color="color" stop-opacity="0.85" />
            </radialGradient>
          </defs>
          <path
            :d="displayPath"
            :fill="`url(#${gid})`"
            stroke="rgba(255,255,255,0.5)"
            stroke-width="3"
            class="blob-path"
            :class="{ snap: snapped }"
          />
          <text
            x="100"
            y="188"
            text-anchor="middle"
            font-size="22"
            font-weight="800"
            fill="#2c2416"
            opacity="0.35"
          >
            {{ current.letter }}
          </text>
        </svg>
        <view
          class="drag-zone"
          @touchstart.prevent="onStart"
          @touchmove.prevent="onMove"
          @touchend.prevent="onEnd"
          @mousedown.prevent="onMouseDown"
        />
      </view>

      <text class="letter-label">捏成：{{ current.letter }}</text>
      <view class="actions">
        <KButton label="听发音" variant="soft" :color="color" @click="say" />
        <KButton label="完成" :color="color" :disabled="!snapped" @click="finishOne" />
      </view>
      <text class="progress">{{ idx + 1 }} / {{ activity.letters.length }}</text>
    </template>
  </view>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { SpiritLetterMorphActivity } from '../../engine/types'
import { areToolsUnlocked } from '../../engine/spiritStore'
import { speak, unlockSpeak, getLessonSpeakLang } from '../../utils/tts'
import { playSfx } from '../../utils/sfx'
import { lightTap } from '../../utils/haptics'
import { emitSpiritReact } from '../../utils/spiritMiss'
import KButton from '../ui/KButton.vue'

/** 简化字母/数字轮廓 path（home 目标） */
const LETTER_PATHS: Record<string, string> = {
  A: 'M100 30 L160 160 L130 160 L118 130 L82 130 L70 160 L40 160 Z M90 100 L110 100 L100 70 Z',
  O: 'M100 40 C140 40 160 70 160 100 C160 130 140 160 100 160 C60 160 40 130 40 100 C40 70 60 40 100 40 Z M100 70 C80 70 70 85 70 100 C70 115 80 130 100 130 C120 130 130 115 130 100 C130 85 120 70 100 70 Z',
  S: 'M130 55 C130 40 110 30 90 30 C60 30 45 50 55 70 C65 88 100 90 110 105 C118 116 110 140 80 140 C55 140 45 120 50 110',
  // 教材单韵母 a 写作 ɑ，轮廓同手写单层 a
  a: 'M130 90 C130 60 110 50 90 50 C65 50 50 75 50 100 C50 130 70 150 100 150 C120 150 135 135 140 120 L140 150 L160 150 L160 90 Z M130 110 C125 130 110 135 95 135 C75 135 70 115 70 100 C70 80 85 70 100 70 C115 70 128 82 130 100 Z',
  ɑ: 'M130 90 C130 60 110 50 90 50 C65 50 50 75 50 100 C50 130 70 150 100 150 C120 150 135 135 140 120 L140 150 L160 150 L160 90 Z M130 110 C125 130 110 135 95 135 C75 135 70 115 70 100 C70 80 85 70 100 70 C115 70 128 82 130 100 Z',
  o: 'M100 55 C130 55 150 75 150 105 C150 135 130 155 100 155 C70 155 50 135 50 105 C50 75 70 55 100 55 Z M100 80 C85 80 75 92 75 105 C75 118 85 130 100 130 C115 130 125 118 125 105 C125 92 115 80 100 80 Z',
  e: 'M50 105 L150 105 C148 70 125 55 100 55 C70 55 50 80 50 105 C50 135 72 155 105 155 C130 155 145 140 148 125 L125 125 C120 135 110 140 100 140 C82 140 72 125 72 105 Z',
  '1': 'M78 45 L100 30 L118 30 L118 155 L95 155 L95 55 L78 68 Z',
  '2': 'M48 55 C48 35 70 28 95 28 C125 28 148 45 148 70 C148 95 120 110 95 128 L148 128 L148 155 L48 155 L48 138 L118 80 C128 72 130 62 130 55 C130 42 115 35 95 35 C75 35 62 42 62 55 Z',
  '5': 'M140 35 L60 35 L55 95 C70 82 95 78 115 78 C145 78 158 100 158 120 C158 145 135 160 100 160 C70 160 50 145 48 125 L72 125 C75 135 88 142 100 142 C120 142 135 132 135 118 C135 102 120 95 100 95 C80 95 62 102 55 115 L48 40 L140 40 Z',
  '8': 'M100 28 C130 28 148 48 148 68 C148 84 136 96 118 104 C138 112 152 128 152 146 C152 168 128 178 100 178 C72 178 48 168 48 146 C48 128 62 112 82 104 C64 96 52 84 52 68 C52 48 70 28 100 28 Z M100 48 C85 48 74 56 74 68 C74 80 85 88 100 88 C115 88 126 80 126 68 C126 56 115 48 100 48 Z M100 118 C82 118 70 128 70 142 C70 156 82 168 100 168 C118 168 130 156 130 142 C130 128 118 118 100 118 Z',
  '0': 'M100 30 C135 30 158 60 158 100 C158 140 135 170 100 170 C65 170 42 140 42 100 C42 60 65 30 100 30 Z M100 55 C80 55 68 75 68 100 C68 125 80 145 100 145 C120 145 132 125 132 100 C132 75 120 55 100 55 Z',
}

const BLOB =
  'M100 50 C130 50 150 75 150 100 C150 130 125 150 100 150 C70 150 50 125 50 100 C50 70 70 50 100 50 Z'

const props = withDefaults(
  defineProps<{
    activity: SpiritLetterMorphActivity
    color?: string
    tts?: boolean
  }>(),
  { color: '#4DA3FF', tts: true }
)
const emit = defineEmits<{ done: [score: { correct: number; total: number }] }>()

const unlocked = ref(areToolsUnlocked())
const idx = ref(0)
const snapped = ref(false)
const dragT = ref(0)
const gid = `lm-${Math.random().toString(36).slice(2, 8)}`
const correctCount = ref(0)

const current = computed(() => props.activity.letters[idx.value])
const targetPath = computed(() => LETTER_PATHS[current.value.letter] || LETTER_PATHS.O)
const displayPath = computed(() => (snapped.value || dragT.value > 0.55 ? targetPath.value : BLOB))

watch(
  () => props.activity.id,
  () => {
    idx.value = 0
    snapped.value = false
    dragT.value = 0
    correctCount.value = 0
  }
)

function say() {
  unlockSpeak()
  if (props.tts === false) return
  const lang = current.value.speakLang || getLessonSpeakLang()
  speak(current.value.speak || current.value.letter, lang ? { lang } : undefined)
  playSfx('tap')
}

function onStart() {
  dragT.value = 0.2
  snapped.value = false
}

function onMove() {
  dragT.value = Math.min(1, dragT.value + 0.08)
  if (dragT.value > 0.55 && !snapped.value) {
    snapped.value = true
    lightTap()
    playSfx('correct')
    say()
  }
}

function onEnd() {
  if (dragT.value > 0.4) {
    snapped.value = true
    lightTap()
    playSfx('unlock')
    say()
  }
  dragT.value = snapped.value ? 1 : 0
}

function onMouseDown() {
  onStart()
  const move = () => onMove()
  const up = () => {
    onEnd()
    window.removeEventListener('mousemove', move)
    window.removeEventListener('mouseup', up)
  }
  window.addEventListener('mousemove', move)
  window.addEventListener('mouseup', up)
}

function finishOne() {
  if (!snapped.value) return
  correctCount.value++
  playSfx('star')
  emitSpiritReact('hit')
  if (idx.value < props.activity.letters.length - 1) {
    idx.value++
    snapped.value = false
    dragT.value = 0
  } else {
    emit('done', { correct: correctCount.value, total: props.activity.letters.length })
  }
}

function skip() {
  emit('done', { correct: 1, total: 1 })
}

function goSpirit() {
  uni.navigateTo({ url: '/pages/spirit/home' })
}
</script>

<style scoped lang="scss">
.morph__title {
  display: block;
  font-size: 40rpx;
  font-weight: 800;
  margin-bottom: 8rpx;
}
.morph__hint {
  display: block;
  font-size: 26rpx;
  color: var(--color-muted);
  margin-bottom: 20rpx;
}
.lock-card {
  background: #fff;
  border-radius: var(--radius-lg);
  padding: 36rpx;
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  box-shadow: var(--shadow-soft);
}
.lock-card__t {
  font-size: 34rpx;
  font-weight: 900;
}
.lock-card__d {
  font-size: 26rpx;
  color: var(--color-muted);
}
.stage {
  position: relative;
  background: #fff;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-soft);
  overflow: hidden;
  margin-bottom: 16rpx;
}
.stage__svg {
  width: 100%;
  height: 420rpx;
  display: block;
}
.blob-path {
  transition: d 0.35s ease;
}
.blob-path.snap {
  filter: drop-shadow(0 6px 10px rgba(44, 36, 22, 0.15));
}
.drag-zone {
  position: absolute;
  inset: 0;
}
.letter-label {
  display: block;
  text-align: center;
  font-size: 36rpx;
  font-weight: 900;
  margin-bottom: 16rpx;
}
.actions {
  display: flex;
  gap: 16rpx;
  justify-content: center;
  margin-bottom: 12rpx;
}
.progress {
  display: block;
  text-align: center;
  color: var(--color-muted);
  font-size: 26rpx;
}
</style>
