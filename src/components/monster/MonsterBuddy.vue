<template>
  <view
    class="buddy"
    :class="[
      `buddy--s${stage}`,
      {
        'buddy--defeat': pose === 'defeat',
        'buddy--grow': pose === 'grow',
        'buddy--shake': pose === 'shake',
      },
    ]"
    :style="{ width: size + 'rpx', height: size + 'rpx' }"
  >
    <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" class="buddy__svg">
      <!-- body -->
      <ellipse
        cx="60"
        :cy="bodyCy"
        :rx="bodyRx"
        :ry="bodyRy"
        :fill="bodyFill"
        stroke="#2c2416"
        stroke-width="3"
      />
      <!-- horns -->
      <path
        d="M38 42 L32 22 L46 36 Z"
        :fill="hornFill"
        stroke="#2c2416"
        stroke-width="2.5"
        stroke-linejoin="round"
      />
      <path
        d="M82 42 L88 22 L74 36 Z"
        :fill="hornFill"
        stroke="#2c2416"
        stroke-width="2.5"
        stroke-linejoin="round"
      />
      <!-- eyes -->
      <ellipse cx="48" cy="58" :rx="eyeR" :ry="eyeR" fill="#fff" stroke="#2c2416" stroke-width="2.5" />
      <ellipse cx="72" cy="58" :rx="eyeR" :ry="eyeR" fill="#fff" stroke="#2c2416" stroke-width="2.5" />
      <circle cx="49" cy="59" :r="pupilR" fill="#2c2416" />
      <circle cx="73" cy="59" :r="pupilR" fill="#2c2416" />
      <circle cx="50.5" cy="57.5" r="1.6" fill="#fff" />
      <circle cx="74.5" cy="57.5" r="1.6" fill="#fff" />
      <!-- mouth by stage -->
      <path
        v-if="stage <= 1"
        d="M50 78 Q60 86 70 78"
        fill="none"
        stroke="#2c2416"
        stroke-width="2.5"
        stroke-linecap="round"
      />
      <path
        v-else-if="stage === 2"
        d="M48 76 Q60 90 72 76"
        fill="#FF7A59"
        stroke="#2c2416"
        stroke-width="2.5"
        stroke-linejoin="round"
      />
      <g v-else>
        <path
          d="M44 74 Q60 96 76 74"
          fill="#FF7A59"
          stroke="#2c2416"
          stroke-width="2.5"
          stroke-linejoin="round"
        />
        <path d="M52 82 L56 88 M64 88 L68 82" stroke="#fff" stroke-width="2" stroke-linecap="round" />
      </g>
      <!-- cheeks -->
      <ellipse cx="36" cy="72" rx="6" ry="4" fill="#FFB6C1" opacity="0.75" />
      <ellipse cx="84" cy="72" rx="6" ry="4" fill="#FFB6C1" opacity="0.75" />
      <!-- feet -->
      <ellipse cx="44" cy="98" rx="10" ry="6" fill="#FFD166" stroke="#2c2416" stroke-width="2.5" />
      <ellipse cx="76" cy="98" rx="10" ry="6" fill="#FFD166" stroke="#2c2416" stroke-width="2.5" />
    </svg>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    stage?: number
    size?: number
    pose?: 'idle' | 'defeat' | 'grow' | 'shake'
  }>(),
  {
    stage: 0,
    size: 140,
    pose: 'idle',
  }
)

const stage = computed(() => Math.min(3, Math.max(0, Math.round(props.stage))))

const bodyCy = computed(() => 62 + stage.value)
const bodyRx = computed(() => 30 + stage.value * 5)
const bodyRy = computed(() => 28 + stage.value * 4)
const eyeR = computed(() => 8 + stage.value)
const pupilR = computed(() => 3 + Math.floor(stage.value / 2))

const bodyFill = computed(() => {
  const colors = ['#7CB342', '#66BB6A', '#FFA726', '#EF5350']
  return colors[stage.value] || colors[0]
})

const hornFill = computed(() => (stage.value >= 2 ? '#FFD166' : '#FFF3D6'))
</script>

<style scoped lang="scss">
.buddy {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.25s ease;
}
.buddy__svg {
  width: 100%;
  height: 100%;
  display: block;
  overflow: visible;
}
.buddy--s0 {
  transform: scale(0.85);
}
.buddy--s1 {
  transform: scale(0.95);
}
.buddy--s2 {
  transform: scale(1.05);
}
.buddy--s3 {
  transform: scale(1.15);
}
.buddy--defeat {
  animation: monster-defeat 0.7s ease forwards;
}
.buddy--grow {
  animation: monster-grow 0.55s ease;
}
.buddy--shake {
  animation: monster-shake 0.45s ease;
}

@keyframes monster-defeat {
  0% {
    transform: scale(1) rotate(0deg);
    opacity: 1;
  }
  40% {
    transform: scale(1.08) rotate(-8deg);
  }
  100% {
    transform: scale(0.4) rotate(70deg) translateY(40rpx);
    opacity: 0;
  }
}

@keyframes monster-grow {
  0% {
    transform: scale(0.9);
  }
  45% {
    transform: scale(1.25);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes monster-shake {
  0%,
  100% {
    transform: translateX(0);
  }
  20% {
    transform: translateX(-10rpx) rotate(-4deg);
  }
  40% {
    transform: translateX(10rpx) rotate(4deg);
  }
  60% {
    transform: translateX(-8rpx);
  }
  80% {
    transform: translateX(8rpx);
  }
}
</style>
