<template>
  <view
    class="buddy"
    :class="[`buddy--${mood}`, { 'buddy--center': center }]"
    :style="{ width: size + 'rpx', height: size + 'rpx' }"
    @click="poke"
  >
    <svg :viewBox="`0 0 ${W} ${H}`" class="buddy__svg" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient :id="gid" cx="45%" cy="35%" r="65%">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0.55" />
          <stop offset="45%" :stop-color="hi" />
          <stop offset="100%" :stop-color="appearance.primary" />
        </radialGradient>
        <radialGradient :id="gid2" cx="40%" cy="30%" r="70%">
          <stop offset="0%" :stop-color="hi" />
          <stop offset="100%" :stop-color="appearance.secondary" />
        </radialGradient>
      </defs>

      <ellipse :cx="60" :cy="flat ? 102 : 112" :rx="flat ? 42 : 26" ry="6" fill="rgba(44,36,22,0.12)" />

      <g :transform="bodyTransform">
        <!-- 耳朵 / 装饰（按形象） -->
        <!-- 闪电耳：星星黄 -->
        <g v-if="form === 'star'">
          <path d="M38 48 L28 18 L48 38 Z" :fill="appearance.primary" stroke="#2c2416" stroke-width="2.2" stroke-linejoin="round" />
          <path d="M82 48 L92 18 L72 38 Z" :fill="appearance.primary" stroke="#2c2416" stroke-width="2.2" stroke-linejoin="round" />
          <path d="M32 28 L26 12 L34 22" fill="#FF8A3D" stroke="#2c2416" stroke-width="1.6" stroke-linejoin="round" />
          <path d="M88 28 L94 12 L86 22" fill="#FF8A3D" stroke="#2c2416" stroke-width="1.6" stroke-linejoin="round" />
        </g>
        <!-- 猫耳+蝴蝶结：水滴蓝 -->
        <g v-else-if="form === 'droplet'">
          <path d="M34 52 L28 22 L52 44 Z" fill="#FFF8EE" stroke="#2c2416" stroke-width="2.2" stroke-linejoin="round" />
          <path d="M86 52 L92 22 L68 44 Z" fill="#FFF8EE" stroke="#2c2416" stroke-width="2.2" stroke-linejoin="round" />
          <path d="M34 52 L28 22 L52 44 Z" fill="#FFB6D0" opacity="0.45" />
          <path d="M86 52 L92 22 L68 44 Z" fill="#FFB6D0" opacity="0.45" />
          <ellipse cx="60" cy="28" rx="14" ry="10" fill="#FF5A8A" stroke="#2c2416" stroke-width="2" />
          <ellipse cx="48" cy="28" rx="9" ry="7" fill="#FF8FB8" stroke="#2c2416" stroke-width="1.8" />
          <ellipse cx="72" cy="28" rx="9" ry="7" fill="#FF8FB8" stroke="#2c2416" stroke-width="1.8" />
          <circle cx="60" cy="28" r="3.5" fill="#FFF8EE" stroke="#2c2416" stroke-width="1.5" />
        </g>
        <!-- 小熊耳：芽芽绿 -->
        <g v-else-if="form === 'sprout'">
          <circle cx="34" cy="42" r="14" :fill="appearance.primary" stroke="#2c2416" stroke-width="2.2" />
          <circle cx="86" cy="42" r="14" :fill="appearance.primary" stroke="#2c2416" stroke-width="2.2" />
          <circle cx="34" cy="42" r="7" fill="#FFE0B2" />
          <circle cx="86" cy="42" r="7" fill="#FFE0B2" />
          <path d="M60 34 C58 18 46 12 38 14 C50 18 56 28 58 36 Z" fill="#69DB7C" stroke="#2c2416" stroke-width="1.8" />
        </g>
        <!-- 草莓籽熊：蜜桃/莓莓 -->
        <g v-else-if="form === 'peach' || form === 'berry'">
          <circle cx="34" cy="44" r="13" :fill="appearance.primary" stroke="#2c2416" stroke-width="2.2" />
          <circle cx="86" cy="44" r="13" :fill="appearance.primary" stroke="#2c2416" stroke-width="2.2" />
          <path d="M48 30 C54 18 66 18 72 30 L60 38 Z" fill="#3ECF8E" stroke="#2c2416" stroke-width="2" />
        </g>
        <!-- 兔耳：云云 -->
        <g v-else-if="form === 'cloud'">
          <ellipse cx="40" cy="28" rx="12" ry="22" fill="#FFF8EE" stroke="#2c2416" stroke-width="2.2" transform="rotate(-12 40 28)" />
          <ellipse cx="80" cy="28" rx="12" ry="22" fill="#FFF8EE" stroke="#2c2416" stroke-width="2.2" transform="rotate(12 80 28)" />
          <ellipse cx="40" cy="30" rx="6" ry="12" fill="#FFB6D0" opacity="0.7" transform="rotate(-12 40 30)" />
          <ellipse cx="80" cy="30" rx="6" ry="12" fill="#FFB6D0" opacity="0.7" transform="rotate(12 80 30)" />
        </g>
        <!-- 彩虹豆：小角 -->
        <g v-else>
          <path d="M48 40 L60 16 L72 40 Z" fill="#FF8FB8" stroke="#2c2416" stroke-width="2" stroke-linejoin="round" />
          <path d="M54 34 L60 22 L66 34 Z" fill="#FFE08A" />
        </g>

        <!-- 头 -->
        <ellipse cx="60" cy="68" rx="40" ry="38" :fill="`url(#${gid})`" stroke="#2c2416" stroke-width="2.6" />

        <!-- 草莓籽点缀 -->
        <g v-if="form === 'peach' || form === 'berry'" opacity="0.85">
          <ellipse cx="42" cy="58" rx="2.2" ry="3.2" fill="#FFF8EE" transform="rotate(-20 42 58)" />
          <ellipse cx="78" cy="56" rx="2.2" ry="3.2" fill="#FFF8EE" transform="rotate(18 78 56)" />
          <ellipse cx="52" cy="88" rx="2.2" ry="3.2" fill="#FFF8EE" transform="rotate(8 52 88)" />
          <ellipse cx="70" cy="90" rx="2.2" ry="3.2" fill="#FFF8EE" transform="rotate(-12 70 90)" />
          <ellipse cx="60" cy="50" rx="2" ry="2.8" fill="#FFF8EE" />
        </g>

        <!-- 腮红 -->
        <ellipse
          v-if="mood !== 'flat'"
          cx="34"
          cy="74"
          rx="9"
          ry="5"
          :fill="form === 'star' ? '#FF8A3D' : '#FF8FB8'"
          opacity="0.85"
        />
        <ellipse
          v-if="mood !== 'flat'"
          cx="86"
          cy="74"
          rx="9"
          ry="5"
          :fill="form === 'star' ? '#FF8A3D' : '#FF8FB8'"
          opacity="0.85"
        />

        <!-- 眼睛 -->
        <g v-if="mood !== 'flat'">
          <ellipse :cx="46" :cy="eyeY" :rx="eyeOpen ? 7.5 : 8" :ry="eyeOpen ? 9 : 1.4" fill="#2c2416" />
          <ellipse :cx="74" :cy="eyeY" :rx="eyeOpen ? 7.5 : 8" :ry="eyeOpen ? 9 : 1.4" fill="#2c2416" />
          <circle v-if="eyeOpen" :cx="48.5" :cy="eyeY - 3" r="2.6" fill="#fff" />
          <circle v-if="eyeOpen" :cx="76.5" :cy="eyeY - 3" r="2.6" fill="#fff" />
          <circle v-if="eyeOpen && mood === 'cheer'" :cx="43" :cy="eyeY + 2" r="1.4" fill="#fff" opacity="0.7" />
          <circle v-if="eyeOpen && mood === 'cheer'" :cx="71" :cy="eyeY + 2" r="1.4" fill="#fff" opacity="0.7" />
        </g>
        <path
          v-else
          d="M36 72 Q60 84 84 72"
          fill="none"
          stroke="#2c2416"
          stroke-width="3.5"
          stroke-linecap="round"
        />

        <!-- 鼻子 / 嘴 -->
        <ellipse v-if="mood !== 'flat' && form !== 'star'" cx="60" cy="80" rx="4" ry="3" fill="#FF5A8A" stroke="#2c2416" stroke-width="1.2" />
        <ellipse v-if="mood !== 'flat' && form === 'star'" cx="60" cy="78" rx="3.5" ry="2.5" fill="#2c2416" />

        <path
          v-if="mood === 'scared'"
          d="M52 90 Q60 84 68 90"
          fill="none"
          stroke="#2c2416"
          stroke-width="2.4"
          stroke-linecap="round"
        />
        <path
          v-else-if="mood === 'cheer'"
          d="M48 88 Q60 102 72 88"
          fill="none"
          stroke="#2c2416"
          stroke-width="3"
          stroke-linecap="round"
        />
        <path
          v-else-if="mood !== 'flat'"
          d="M54 90 Q60 96 66 90"
          fill="none"
          stroke="#2c2416"
          stroke-width="2.2"
          stroke-linecap="round"
        />

        <!-- 胡须：猫 -->
        <g v-if="form === 'droplet' && mood !== 'flat'" stroke="#2c2416" stroke-width="1.8" stroke-linecap="round">
          <path d="M22 72 L40 74" />
          <path d="M22 80 L40 78" />
          <path d="M98 72 L80 74" />
          <path d="M98 80 L80 78" />
        </g>

        <!-- 身体小圆 -->
        <ellipse cx="60" cy="108" rx="22" ry="10" :fill="`url(#${gid2})`" stroke="#2c2416" stroke-width="2.2" />
      </g>
    </svg>
    <text v-if="showName && name" class="buddy__name">{{ name }}</text>
  </view>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { SpiritAppearance, SpiritForm, SpiritMood } from '../../data/spirit/types'
import { formFromCollectKey } from '../../data/spirit/potions'
import { lightTap } from '../../utils/haptics'
import { playSfx } from '../../utils/sfx'

const props = withDefaults(
  defineProps<{
    appearance: SpiritAppearance
    name?: string
    size?: number
    mood?: SpiritMood
    showName?: boolean
    center?: boolean
  }>(),
  {
    size: 200,
    mood: 'idle',
    showName: false,
    name: '',
    center: false,
  }
)

const emit = defineEmits<{ poke: [] }>()

const W = 120
const H = 120
const gid = `sb-g-${Math.random().toString(36).slice(2, 8)}`
const gid2 = `sb-g2-${Math.random().toString(36).slice(2, 8)}`

const blinking = ref(false)
const squash = ref(1)
let blinkTimer: ReturnType<typeof setTimeout> | null = null
let pokeTimer: ReturnType<typeof setTimeout> | null = null

const form = computed<SpiritForm>(
  () => props.appearance.form || formFromCollectKey(props.appearance.collectKey || 'blue')
)
const flat = computed(() => props.mood === 'flat')
const eyeOpen = computed(() => !blinking.value && props.mood !== 'scared')
const eyeY = computed(() => (props.mood === 'scared' ? 62 : 66))
const hi = computed(() => lighten(props.appearance.primary, 0.45))

const bodyTransform = computed(() => {
  const cx = 60
  const cy = 70
  if (props.mood === 'flat') {
    return `translate(${cx} ${cy}) scale(${1.2 * squash.value}, 0.42) translate(${-cx} ${-cy})`
  }
  if (props.mood === 'scared') {
    return `translate(${cx} ${cy}) scale(0.9, 1.14) translate(${-cx} ${-cy})`
  }
  if (props.mood === 'cheer' || props.mood === 'bounceBack') {
    return `translate(${cx} ${cy}) scale(${0.96 * squash.value}, ${1.1 / squash.value}) translate(${-cx} ${-cy})`
  }
  return `translate(${cx} ${cy}) scale(${squash.value}, ${1 / Math.max(0.75, squash.value)}) translate(${-cx} ${-cy})`
})

function lighten(hex: string, t: number) {
  const h = hex.replace('#', '')
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h
  const n = parseInt(full || '4da3ff', 16)
  const r = (n >> 16) & 255
  const g = (n >> 8) & 255
  const b = n & 255
  return `rgb(${Math.round(r + (255 - r) * t)},${Math.round(g + (255 - g) * t)},${Math.round(b + (255 - b) * t)})`
}

function scheduleBlink() {
  blinkTimer = setTimeout(() => {
    blinking.value = true
    setTimeout(() => {
      blinking.value = false
      scheduleBlink()
    }, 120)
  }, 2000 + Math.random() * 2400)
}

function poke() {
  lightTap()
  playSfx('tap')
  squash.value = 1.18
  if (pokeTimer) clearTimeout(pokeTimer)
  pokeTimer = setTimeout(() => {
    squash.value = 0.9
    pokeTimer = setTimeout(() => {
      squash.value = 1
    }, 100)
  }, 80)
  emit('poke')
}

watch(
  () => props.mood,
  (m) => {
    if (m === 'bounceBack' || m === 'cheer') {
      squash.value = 1.15
      setTimeout(() => {
        squash.value = 1
      }, 260)
    }
  }
)

onMounted(scheduleBlink)
onBeforeUnmount(() => {
  if (blinkTimer) clearTimeout(blinkTimer)
  if (pokeTimer) clearTimeout(pokeTimer)
})
</script>

<style scoped lang="scss">
.buddy {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}
.buddy__svg {
  width: 100%;
  height: 100%;
  overflow: visible;
}
.buddy__name {
  margin-top: -6rpx;
  font-size: 24rpx;
  font-weight: 800;
  color: var(--color-ink);
}
.buddy--scared {
  animation: scare-jitter 0.4s ease;
}
.buddy--cheer,
.buddy--bounceBack {
  animation: bounce-pop 0.45s cubic-bezier(0.22, 1.55, 0.36, 1);
}
@keyframes scare-jitter {
  0%,
  100% {
    transform: translateX(0) rotate(0);
  }
  25% {
    transform: translateX(-10rpx) rotate(-8deg);
  }
  75% {
    transform: translateX(10rpx) rotate(8deg);
  }
}
@keyframes bounce-pop {
  0% {
    transform: translateY(48rpx) scale(0.55);
  }
  55% {
    transform: translateY(-28rpx) scale(1.2);
  }
  100% {
    transform: translateY(0) scale(1);
  }
}
</style>
