<template>
  <view class="mascot anim-float" :style="{ width: size + 'rpx', height: size + 'rpx' }">
    <svg v-if="name === 'panda'" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="60" cy="70" rx="38" ry="34" fill="#fff" stroke="#2c2416" stroke-width="3"/>
      <circle cx="32" cy="32" r="16" fill="#2c2416"/>
      <circle cx="88" cy="32" r="16" fill="#2c2416"/>
      <ellipse cx="60" cy="58" rx="28" ry="26" fill="#fff" stroke="#2c2416" stroke-width="3"/>
      <ellipse cx="48" cy="56" rx="10" ry="12" fill="#2c2416"/>
      <ellipse cx="72" cy="56" rx="10" ry="12" fill="#2c2416"/>
      <circle cx="50" cy="55" r="3" fill="#fff"/>
      <circle cx="74" cy="55" r="3" fill="#fff"/>
      <ellipse cx="60" cy="68" rx="6" ry="4" fill="#2c2416"/>
      <path d="M54 74 Q60 80 66 74" fill="none" stroke="#2c2416" stroke-width="2.5" stroke-linecap="round"/>
      <ellipse cx="42" cy="70" rx="6" ry="4" fill="#FFB6C1" opacity="0.7"/>
      <ellipse cx="78" cy="70" rx="6" ry="4" fill="#FFB6C1" opacity="0.7"/>
    </svg>
    <svg v-else-if="name === 'fox'" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 50 L40 20 L60 45 L80 20 L100 50 L90 95 L30 95 Z" fill="#FF8A4C" stroke="#2c2416" stroke-width="3" stroke-linejoin="round"/>
      <path d="M40 20 L48 42 L36 48 Z" fill="#FFE6D5"/>
      <path d="M80 20 L72 42 L84 48 Z" fill="#FFE6D5"/>
      <circle cx="48" cy="62" r="5" fill="#2c2416"/>
      <circle cx="72" cy="62" r="5" fill="#2c2416"/>
      <circle cx="50" cy="60" r="2" fill="#fff"/>
      <circle cx="74" cy="60" r="2" fill="#fff"/>
      <ellipse cx="60" cy="74" rx="7" ry="5" fill="#2c2416"/>
      <path d="M60 74 L52 82 M60 74 L68 82" stroke="#2c2416" stroke-width="2" stroke-linecap="round"/>
      <ellipse cx="60" cy="88" rx="14" ry="8" fill="#FFE6D5"/>
    </svg>
    <svg v-else-if="name === 'owl'" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="60" cy="68" rx="36" ry="40" fill="#F0C070" stroke="#2c2416" stroke-width="3"/>
      <circle cx="42" cy="28" r="10" fill="#F0C070" stroke="#2c2416" stroke-width="3"/>
      <circle cx="78" cy="28" r="10" fill="#F0C070" stroke="#2c2416" stroke-width="3"/>
      <circle cx="45" cy="58" r="16" fill="#fff" stroke="#2c2416" stroke-width="3"/>
      <circle cx="75" cy="58" r="16" fill="#fff" stroke="#2c2416" stroke-width="3"/>
      <circle cx="45" cy="58" r="7" fill="#4DA3FF"/>
      <circle cx="75" cy="58" r="7" fill="#4DA3FF"/>
      <circle cx="47" cy="56" r="2.5" fill="#fff"/>
      <circle cx="77" cy="56" r="2.5" fill="#fff"/>
      <path d="M54 72 L60 80 L66 72 Z" fill="#FF7A59" stroke="#2c2416" stroke-width="2"/>
      <path d="M40 90 Q60 100 80 90" fill="none" stroke="#2c2416" stroke-width="2.5" stroke-linecap="round"/>
    </svg>
    <svg v-else-if="name === 'rabbit'" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="42" cy="28" rx="12" ry="28" fill="#FFE8F0" stroke="#2c2416" stroke-width="3"/>
      <ellipse cx="78" cy="28" rx="12" ry="28" fill="#FFE8F0" stroke="#2c2416" stroke-width="3"/>
      <ellipse cx="42" cy="30" rx="6" ry="18" fill="#FF8FB8"/>
      <ellipse cx="78" cy="30" rx="6" ry="18" fill="#FF8FB8"/>
      <ellipse cx="60" cy="72" rx="34" ry="32" fill="#FFE8F0" stroke="#2c2416" stroke-width="3"/>
      <circle cx="48" cy="68" r="5" fill="#2c2416"/>
      <circle cx="72" cy="68" r="5" fill="#2c2416"/>
      <circle cx="50" cy="66" r="2" fill="#fff"/>
      <circle cx="74" cy="66" r="2" fill="#fff"/>
      <ellipse cx="60" cy="80" rx="6" ry="4" fill="#FF8FB8"/>
      <path d="M54 86 Q60 92 66 86" fill="none" stroke="#2c2416" stroke-width="2.5" stroke-linecap="round"/>
      <ellipse cx="40" cy="82" rx="7" ry="5" fill="#FFB6C1" opacity="0.8"/>
      <ellipse cx="80" cy="82" rx="7" ry="5" fill="#FFB6C1" opacity="0.8"/>
    </svg>
    <svg v-else viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="60" cy="72" rx="36" ry="32" fill="#D4A574" stroke="#2c2416" stroke-width="3"/>
      <circle cx="32" cy="40" r="14" fill="#D4A574" stroke="#2c2416" stroke-width="3"/>
      <circle cx="88" cy="40" r="14" fill="#D4A574" stroke="#2c2416" stroke-width="3"/>
      <circle cx="36" cy="42" r="6" fill="#FFE8F0"/>
      <circle cx="84" cy="42" r="6" fill="#FFE8F0"/>
      <circle cx="48" cy="68" r="5" fill="#2c2416"/>
      <circle cx="72" cy="68" r="5" fill="#2c2416"/>
      <circle cx="50" cy="66" r="2" fill="#fff"/>
      <circle cx="74" cy="66" r="2" fill="#fff"/>
      <ellipse cx="60" cy="80" rx="7" ry="5" fill="#2c2416"/>
      <path d="M54 88 Q60 94 66 88" fill="none" stroke="#2c2416" stroke-width="2.5" stroke-linecap="round"/>
    </svg>
  </view>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{ name: 'panda' | 'fox' | 'owl' | 'rabbit' | 'bear'; size?: number }>(),
  { size: 160 }
)
</script>

<style scoped lang="scss">
.mascot {
  display: flex;
  align-items: center;
  justify-content: center;
}
.mascot svg {
  width: 100%;
  height: 100%;
}
</style>
