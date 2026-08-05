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
    <svg v-else-if="name === 'mole'" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="60" cy="76" rx="36" ry="30" fill="#8D6E63" stroke="#2c2416" stroke-width="3"/>
      <circle cx="30" cy="52" r="12" fill="#8D6E63" stroke="#2c2416" stroke-width="3"/>
      <circle cx="90" cy="52" r="12" fill="#8D6E63" stroke="#2c2416" stroke-width="3"/>
      <path d="M34 52 Q60 34 86 52 L82 34 Q60 22 38 34 Z" fill="#FFC84A" stroke="#2c2416" stroke-width="3" stroke-linejoin="round"/>
      <circle cx="60" cy="26" r="8" fill="#FFF3D6" stroke="#2c2416" stroke-width="3"/>
      <circle cx="48" cy="70" r="5" fill="#2c2416"/>
      <circle cx="72" cy="70" r="5" fill="#2c2416"/>
      <circle cx="50" cy="68" r="2" fill="#fff"/>
      <circle cx="74" cy="68" r="2" fill="#fff"/>
      <ellipse cx="60" cy="84" rx="10" ry="7" fill="#F8BBD0" stroke="#2c2416" stroke-width="2.5"/>
      <path d="M42 92 Q60 100 78 92" fill="none" stroke="#2c2416" stroke-width="2.5" stroke-linecap="round"/>
      <ellipse cx="20" cy="90" rx="9" ry="6" fill="#F8BBD0" stroke="#2c2416" stroke-width="2.5"/>
      <ellipse cx="100" cy="90" rx="9" ry="6" fill="#F8BBD0" stroke="#2c2416" stroke-width="2.5"/>
    </svg>
    <svg v-else-if="name === 'dino'" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
      <path d="M28 96 Q20 60 44 40 L60 30 Q92 20 100 48 L102 58 Q104 84 82 92 L40 100 Z" fill="#7CB342" stroke="#2c2416" stroke-width="3" stroke-linejoin="round"/>
      <circle cx="78" cy="48" r="6" fill="#2c2416"/>
      <circle cx="80" cy="46" r="2" fill="#fff"/>
      <path d="M88 62 Q94 68 100 64" fill="none" stroke="#2c2416" stroke-width="3" stroke-linecap="round"/>
      <polygon points="40,44 46,28 52,42" fill="#FFF3D6" stroke="#2c2416" stroke-width="2.5" stroke-linejoin="round"/>
      <polygon points="54,36 60,22 66,34" fill="#FFF3D6" stroke="#2c2416" stroke-width="2.5" stroke-linejoin="round"/>
      <polygon points="68,32 74,20 80,32" fill="#FFF3D6" stroke="#2c2416" stroke-width="2.5" stroke-linejoin="round"/>
      <ellipse cx="66" cy="84" rx="16" ry="10" fill="#C5E1A5"/>
      <path d="M28 96 Q14 92 12 78" fill="none" stroke="#2c2416" stroke-width="3" stroke-linecap="round"/>
    </svg>
    <svg v-else-if="name === 'town'" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="58" cy="76" rx="34" ry="30" fill="#FFE3C2" stroke="#2c2416" stroke-width="3"/>
      <path d="M30 50 L58 8 L86 50 Z" fill="#7C6BD9" stroke="#2c2416" stroke-width="3" stroke-linejoin="round"/>
      <path d="M52 32 l3 5 5 1 -3.5 3.5 1 5 -4.5-2.5 -4.5 2.5 1-5 -3.5-3.5 5-1 Z" fill="#FFD166"/>
      <circle cx="58" cy="12" r="5" fill="#FFD166" stroke="#2c2416" stroke-width="2.5"/>
      <ellipse cx="58" cy="52" rx="36" ry="9" fill="#5B4FB8" stroke="#2c2416" stroke-width="3"/>
      <circle cx="47" cy="72" r="5" fill="#2c2416"/>
      <circle cx="69" cy="72" r="5" fill="#2c2416"/>
      <circle cx="49" cy="70" r="2" fill="#fff"/>
      <circle cx="71" cy="70" r="2" fill="#fff"/>
      <path d="M51 84 Q58 90 65 84" fill="none" stroke="#2c2416" stroke-width="2.5" stroke-linecap="round"/>
      <ellipse cx="40" cy="82" rx="6" ry="4" fill="#FFB6C1" opacity="0.7"/>
      <ellipse cx="76" cy="82" rx="6" ry="4" fill="#FFB6C1" opacity="0.7"/>
      <rect x="86" y="76" width="26" height="18" rx="4" fill="#BFE3F7" stroke="#2c2416" stroke-width="3" transform="rotate(10 99 85)"/>
      <path d="M92 84 L106 87 M92 89 L102 91" stroke="#4DA3FF" stroke-width="2" stroke-linecap="round" transform="rotate(10 99 85)"/>
    </svg>
    <svg v-else-if="name === 'princess'" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="60" cy="68" rx="40" ry="42" fill="#8A5A3B" stroke="#2c2416" stroke-width="3"/>
      <path d="M26 118 Q60 90 94 118 L94 120 L26 120 Z" fill="#FF8FB8" stroke="#2c2416" stroke-width="3" stroke-linejoin="round"/>
      <ellipse cx="60" cy="68" rx="29" ry="29" fill="#FFE3C2" stroke="#2c2416" stroke-width="3"/>
      <path d="M38 40 L42 22 L52 34 L60 16 L68 34 L78 22 L82 40 Q60 32 38 40 Z" fill="#FFD166" stroke="#2c2416" stroke-width="3" stroke-linejoin="round"/>
      <circle cx="60" cy="28" r="3" fill="#FF6B6B"/>
      <circle cx="46" cy="32" r="2.5" fill="#4DA3FF"/>
      <circle cx="74" cy="32" r="2.5" fill="#4DA3FF"/>
      <path d="M46 66 Q51 61 56 66" fill="none" stroke="#2c2416" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M64 66 Q69 61 74 66" fill="none" stroke="#2c2416" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M54 78 Q60 84 66 78" fill="none" stroke="#2c2416" stroke-width="2.5" stroke-linecap="round"/>
      <ellipse cx="44" cy="76" rx="6" ry="4" fill="#FFB6C1" opacity="0.8"/>
      <ellipse cx="76" cy="76" rx="6" ry="4" fill="#FFB6C1" opacity="0.8"/>
    </svg>
    <svg v-else-if="name === 'slime'" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="60" cy="78" rx="40" ry="28" fill="#4FC3F7" stroke="#2c2416" stroke-width="3"/>
      <path d="M24 70 Q30 36 60 32 Q90 36 96 70 Q78 88 60 90 Q42 88 24 70 Z" fill="#81D4FA" stroke="#2c2416" stroke-width="3" stroke-linejoin="round"/>
      <ellipse cx="46" cy="58" rx="10" ry="14" fill="#fff" stroke="#2c2416" stroke-width="2.5"/>
      <ellipse cx="74" cy="58" rx="10" ry="14" fill="#fff" stroke="#2c2416" stroke-width="2.5"/>
      <circle cx="48" cy="60" r="4" fill="#2c2416"/>
      <circle cx="76" cy="60" r="4" fill="#2c2416"/>
      <circle cx="50" cy="58" r="1.5" fill="#fff"/>
      <circle cx="78" cy="58" r="1.5" fill="#fff"/>
      <path d="M50 74 Q60 82 70 74" fill="none" stroke="#2c2416" stroke-width="2.5" stroke-linecap="round"/>
      <circle cx="38" cy="48" r="4" fill="#E1F5FE" opacity="0.9"/>
      <circle cx="70" cy="42" r="3" fill="#E1F5FE" opacity="0.8"/>
    </svg>
    <svg v-else-if="name === 'vehicle'" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="60" cy="74" rx="36" ry="32" fill="#D4A574" stroke="#2c2416" stroke-width="3"/>
      <path d="M26 60 Q26 28 60 28 Q94 28 94 60 L26 60 Z" fill="#FFC84A" stroke="#2c2416" stroke-width="3" stroke-linejoin="round"/>
      <circle cx="60" cy="42" r="8" fill="#FFF3D6" stroke="#2c2416" stroke-width="2.5"/>
      <rect x="22" y="56" width="76" height="10" rx="5" fill="#FFB020" stroke="#2c2416" stroke-width="3"/>
      <circle cx="28" cy="72" r="7" fill="#D4A574" stroke="#2c2416" stroke-width="2.5"/>
      <circle cx="92" cy="72" r="7" fill="#D4A574" stroke="#2c2416" stroke-width="2.5"/>
      <circle cx="48" cy="78" r="5" fill="#2c2416"/>
      <circle cx="72" cy="78" r="5" fill="#2c2416"/>
      <circle cx="50" cy="76" r="2" fill="#fff"/>
      <circle cx="74" cy="76" r="2" fill="#fff"/>
      <ellipse cx="60" cy="88" rx="7" ry="5" fill="#2c2416"/>
      <path d="M54 95 Q60 101 66 95" fill="none" stroke="#2c2416" stroke-width="2.5" stroke-linecap="round"/>
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
  defineProps<{
    name: 'panda' | 'fox' | 'owl' | 'rabbit' | 'bear' | 'mole' | 'dino' | 'town' | 'princess' | 'vehicle' | 'slime'
    size?: number
  }>(),
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
