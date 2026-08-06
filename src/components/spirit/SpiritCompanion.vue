<template>
  <view v-if="spirit" class="companion-root">
    <!-- 右下角始终显示 -->
    <view class="companion companion--corner" @click="onCornerTap">
      <SpiritBuddy
        :appearance="spirit.appearance"
        :name="spirit.name"
        :size="112"
        mood="idle"
        show-name
        @poke="onCornerTap"
      />
    </view>

    <!-- 正中弹出：跳一下后消失，无文案 -->
    <view
      v-if="staging"
      class="companion companion--stage"
      :class="[`companion--stage-${mood}`, { 'companion--leaving': leaving }]"
      @click="comfort"
    >
      <view class="stage-burst" :class="mood === 'cheer' ? 'ok' : 'bad'" />
      <SpiritBuddy
        :appearance="spirit.appearance"
        :size="300"
        :mood="mood"
        center
        @poke="comfort"
      />
    </view>
  </view>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue'
import { getActiveSpirit } from '../../engine/spiritStore'
import type { SpiritMood, SpiritPet } from '../../data/spirit/types'
import { playSfx } from '../../utils/sfx'
import { lightTap } from '../../utils/haptics'
import { onSpiritReact, type SpiritReactKind } from '../../utils/spiritMiss'
import SpiritBuddy from './SpiritBuddy.vue'

const spirit = ref<SpiritPet | null>(null)
const mood = ref<SpiritMood>('idle')
const staging = ref(false)
const leaving = ref(false)
let flatTimer: ReturnType<typeof setTimeout> | null = null
let autoTimer: ReturnType<typeof setTimeout> | null = null
let off: (() => void) | null = null

function refresh() {
  spirit.value = getActiveSpirit()
}

function clearTimers() {
  if (flatTimer) clearTimeout(flatTimer)
  if (autoTimer) clearTimeout(autoTimer)
  flatTimer = null
  autoTimer = null
}

function dismiss() {
  leaving.value = true
  autoTimer = setTimeout(() => {
    staging.value = false
    leaving.value = false
    mood.value = 'idle'
  }, 280)
}

function onReact(kind: SpiritReactKind) {
  if (!spirit.value) return
  clearTimers()
  leaving.value = false
  staging.value = true
  if (kind === 'hit') {
    mood.value = 'cheer'
    playSfx('correct')
    lightTap()
    autoTimer = setTimeout(() => dismiss(), 850)
  } else {
    // 答错：吓一跳 → 瘪嘴 → 直接消失，不再弹回笑容
    mood.value = 'scared'
    playSfx('wrong')
    flatTimer = setTimeout(() => {
      if (mood.value === 'scared') mood.value = 'flat'
    }, 380)
    autoTimer = setTimeout(() => {
      if (staging.value && !leaving.value) dismiss()
    }, 1200)
  }
}

function comfort() {
  if (!staging.value || leaving.value) return
  // 答错时点击也只收起瘪嘴，不切换到笑容
  if (mood.value === 'scared' || mood.value === 'flat') {
    clearTimers()
    mood.value = 'flat'
    lightTap()
    dismiss()
    return
  }
  if (mood.value === 'cheer') {
    dismiss()
  }
}

function onCornerTap() {
  if (staging.value && (mood.value === 'scared' || mood.value === 'flat')) {
    comfort()
  }
}

onMounted(() => {
  refresh()
  off = onSpiritReact(onReact)
})

onBeforeUnmount(() => {
  clearTimers()
  off?.()
})

defineExpose({ refresh })
</script>

<style scoped lang="scss">
.companion-root {
  pointer-events: none;
}
.companion {
  pointer-events: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  filter: drop-shadow(0 10rpx 20rpx rgba(44, 36, 22, 0.2));
  z-index: 45;
}
.companion--corner {
  position: fixed;
  right: 16rpx;
  bottom: calc(24rpx + var(--safe-bottom));
}
.companion--stage {
  position: fixed;
  left: 50%;
  top: 40%;
  transform: translate(-50%, -50%);
  z-index: 60;
  animation: stage-pop 0.4s cubic-bezier(0.22, 1.55, 0.36, 1);
}
.companion--leaving {
  animation: stage-out 0.28s ease forwards;
}
.stage-burst {
  position: absolute;
  width: 380rpx;
  height: 380rpx;
  border-radius: 50%;
  z-index: -1;
  opacity: 0.4;
  pointer-events: none;
}
.stage-burst.ok {
  background: radial-gradient(circle, #ffe08a 0%, transparent 70%);
  animation: pulse 0.85s ease forwards;
}
.stage-burst.bad {
  background: radial-gradient(circle, #ffb6c8 0%, transparent 70%);
  animation: pulse 0.85s ease forwards;
}
@keyframes stage-pop {
  0% {
    opacity: 0;
    transform: translate(-50%, -30%) scale(0.2);
  }
  60% {
    opacity: 1;
    transform: translate(-50%, -54%) scale(1.12);
  }
  100% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}
@keyframes stage-out {
  to {
    opacity: 0;
    transform: translate(-50%, -58%) scale(0.55);
  }
}
@keyframes pulse {
  from {
    transform: scale(0.45);
    opacity: 0.55;
  }
  to {
    transform: scale(1.25);
    opacity: 0;
  }
}
</style>
