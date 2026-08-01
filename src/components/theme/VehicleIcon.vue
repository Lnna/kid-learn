<template>
  <view class="vi" :style="{ width: size + 'rpx', height: size + 'rpx' }">
    <svg viewBox="0 0 100 80" xmlns="http://www.w3.org/2000/svg">
      <!-- 挖掘机：履带 + 驾驶室 + 长臂铲斗 -->
      <g v-if="kind === 'excavator'" stroke="#2c2416" stroke-linejoin="round" stroke-linecap="round">
        <rect x="18" y="52" width="42" height="12" rx="4" fill="#5D4E37" stroke-width="3"/>
        <circle cx="26" cy="64" r="5" fill="#3E3428" stroke-width="2.5"/>
        <circle cx="38" cy="64" r="5" fill="#3E3428" stroke-width="2.5"/>
        <circle cx="50" cy="64" r="5" fill="#3E3428" stroke-width="2.5"/>
        <rect x="24" y="34" width="30" height="20" rx="4" :fill="fill" stroke-width="3"/>
        <rect x="40" y="28" width="14" height="12" rx="3" fill="#FFF3D6" stroke-width="2.5"/>
        <path d="M50 40 L72 22 L86 30" fill="none" :stroke="fill" stroke-width="5"/>
        <path d="M50 40 L72 22 L86 30" fill="none" stroke="#2c2416" stroke-width="3"/>
        <path d="M82 28 L94 36 L88 46 L78 40 Z" :fill="fill" stroke-width="3"/>
        <circle cx="36" cy="42" r="2.5" fill="#2c2416"/>
      </g>

      <!-- 推土机：履带 + 车身 + 前方大铲刀 -->
      <g v-else-if="kind === 'bulldozer'" stroke="#2c2416" stroke-linejoin="round" stroke-linecap="round">
        <rect x="22" y="50" width="50" height="14" rx="5" fill="#5D4E37" stroke-width="3"/>
        <circle cx="32" cy="64" r="5.5" fill="#3E3428" stroke-width="2.5"/>
        <circle cx="48" cy="64" r="5.5" fill="#3E3428" stroke-width="2.5"/>
        <circle cx="62" cy="64" r="5.5" fill="#3E3428" stroke-width="2.5"/>
        <rect x="28" y="32" width="40" height="22" rx="4" :fill="fill" stroke-width="3"/>
        <rect x="46" y="26" width="18" height="14" rx="3" fill="#FFF3D6" stroke-width="2.5"/>
        <path d="M18 28 L14 52 L22 54 L28 30 Z" :fill="accent" stroke-width="3"/>
        <line x1="28" y1="40" x2="18" y2="38" stroke-width="3"/>
        <circle cx="40" cy="42" r="2.5" fill="#2c2416"/>
      </g>

      <!-- 起重机：卡车底盘 + 高吊臂 + 吊钩 -->
      <g v-else-if="kind === 'crane'" stroke="#2c2416" stroke-linejoin="round" stroke-linecap="round">
        <rect x="14" y="48" width="48" height="14" rx="3" :fill="fill" stroke-width="3"/>
        <rect x="14" y="36" width="18" height="14" rx="3" fill="#FFF3D6" stroke-width="2.5"/>
        <circle cx="24" cy="66" r="6" fill="#3E3428" stroke-width="2.5"/>
        <circle cx="50" cy="66" r="6" fill="#3E3428" stroke-width="2.5"/>
        <rect x="40" y="40" width="14" height="10" rx="2" :fill="accent" stroke-width="2.5"/>
        <path d="M48 40 L48 12 L86 22" fill="none" :stroke="fill" stroke-width="5"/>
        <path d="M48 40 L48 12 L86 22" fill="none" stroke="#2c2416" stroke-width="3"/>
        <line x1="86" y1="22" x2="86" y2="48" stroke-width="2.5"/>
        <path d="M82 48 L86 56 L90 48" fill="none" stroke-width="2.5"/>
        <circle cx="22" cy="42" r="2" fill="#2c2416"/>
      </g>

      <!-- 自卸车：驾驶室 + 可翻车斗 -->
      <g v-else-if="kind === 'dumptruck'" stroke="#2c2416" stroke-linejoin="round" stroke-linecap="round">
        <rect x="12" y="40" width="22" height="20" rx="3" :fill="fill" stroke-width="3"/>
        <path d="M12 44 L12 28 L28 28 L34 40 Z" fill="#FFF3D6" stroke-width="2.5"/>
        <path d="M36 30 L88 22 L92 48 L36 50 Z" :fill="accent" stroke-width="3"/>
        <line x1="36" y1="50" x2="36" y2="38" stroke-width="2.5"/>
        <circle cx="22" cy="64" r="7" fill="#3E3428" stroke-width="2.5"/>
        <circle cx="52" cy="64" r="7" fill="#3E3428" stroke-width="2.5"/>
        <circle cx="74" cy="64" r="7" fill="#3E3428" stroke-width="2.5"/>
        <circle cx="20" cy="36" r="2" fill="#2c2416"/>
      </g>

      <!-- 搅拌车：驾驶室 + 滚筒 -->
      <g v-else-if="kind === 'mixer'" stroke="#2c2416" stroke-linejoin="round" stroke-linecap="round">
        <rect x="10" y="40" width="22" height="18" rx="3" :fill="fill" stroke-width="3"/>
        <path d="M10 42 L10 28 L26 28 L32 40 Z" fill="#FFF3D6" stroke-width="2.5"/>
        <ellipse cx="62" cy="40" rx="28" ry="16" :fill="accent" stroke-width="3"/>
        <path d="M42 34 Q62 26 82 34" fill="none" stroke="#2c2416" stroke-width="2" opacity="0.45"/>
        <path d="M42 42 Q62 34 82 42" fill="none" stroke="#2c2416" stroke-width="2" opacity="0.35"/>
        <path d="M84 48 L94 56 L88 60" fill="none" :stroke="fill" stroke-width="3"/>
        <circle cx="20" cy="64" r="7" fill="#3E3428" stroke-width="2.5"/>
        <circle cx="48" cy="64" r="7" fill="#3E3428" stroke-width="2.5"/>
        <circle cx="72" cy="64" r="7" fill="#3E3428" stroke-width="2.5"/>
        <circle cx="18" cy="36" r="2" fill="#2c2416"/>
      </g>

      <!-- 压路机：驾驶室 + 前方大钢轮 -->
      <g v-else-if="kind === 'roller'" stroke="#2c2416" stroke-linejoin="round" stroke-linecap="round">
        <rect x="38" y="34" width="36" height="22" rx="4" :fill="fill" stroke-width="3"/>
        <rect x="52" y="26" width="18" height="14" rx="3" fill="#FFF3D6" stroke-width="2.5"/>
        <rect x="14" y="30" width="22" height="34" rx="8" fill="#7F8C8D" stroke-width="3"/>
        <line x1="20" y1="34" x2="20" y2="60" stroke-width="2" opacity="0.5"/>
        <line x1="30" y1="34" x2="30" y2="60" stroke-width="2" opacity="0.5"/>
        <circle cx="58" cy="64" r="8" fill="#3E3428" stroke-width="2.5"/>
        <circle cx="74" cy="64" r="6" fill="#3E3428" stroke-width="2.5"/>
        <line x1="36" y1="48" x2="14" y2="48" stroke-width="3"/>
        <circle cx="60" cy="40" r="2" fill="#2c2416"/>
      </g>

      <!-- 装载机：轮式 + 前伸大铲斗 -->
      <g v-else-if="kind === 'loader'" stroke="#2c2416" stroke-linejoin="round" stroke-linecap="round">
        <rect x="34" y="34" width="40" height="22" rx="4" :fill="fill" stroke-width="3"/>
        <rect x="52" y="26" width="18" height="14" rx="3" fill="#FFF3D6" stroke-width="2.5"/>
        <circle cx="44" cy="62" r="9" fill="#3E3428" stroke-width="2.5"/>
        <circle cx="68" cy="62" r="9" fill="#3E3428" stroke-width="2.5"/>
        <path d="M38 40 L18 28 L8 42 L22 50 Z" :fill="accent" stroke-width="3"/>
        <path d="M40 42 L22 36" fill="none" stroke-width="3"/>
        <path d="M42 48 L24 48" fill="none" stroke-width="3"/>
        <circle cx="60" cy="40" r="2" fill="#2c2416"/>
      </g>

      <!-- 叉车：小车身 + 门架 + 两根货叉 -->
      <g v-else-if="kind === 'forklift'" stroke="#2c2416" stroke-linejoin="round" stroke-linecap="round">
        <rect x="40" y="36" width="36" height="22" rx="3" :fill="fill" stroke-width="3"/>
        <rect x="52" y="28" width="16" height="12" rx="2" fill="#FFF3D6" stroke-width="2.5"/>
        <rect x="34" y="18" width="8" height="42" rx="2" :fill="accent" stroke-width="2.5"/>
        <line x1="34" y1="50" x2="12" y2="50" stroke-width="3.5"/>
        <line x1="34" y1="56" x2="12" y2="56" stroke-width="3.5"/>
        <rect x="16" y="34" width="14" height="14" rx="2" fill="#D4A574" stroke-width="2.5" opacity="0.9"/>
        <circle cx="50" cy="64" r="7" fill="#3E3428" stroke-width="2.5"/>
        <circle cx="70" cy="64" r="7" fill="#3E3428" stroke-width="2.5"/>
        <circle cx="58" cy="40" r="2" fill="#2c2416"/>
      </g>

      <!-- 兜底：通用卡车轮廓 -->
      <g v-else stroke="#2c2416" stroke-linejoin="round" stroke-linecap="round">
        <rect x="14" y="40" width="22" height="18" rx="3" :fill="fill" stroke-width="3"/>
        <path d="M14 42 L14 28 L28 28 L36 40 Z" fill="#FFF3D6" stroke-width="2.5"/>
        <rect x="38" y="34" width="46" height="24" rx="3" :fill="accent" stroke-width="3"/>
        <circle cx="24" cy="64" r="7" fill="#3E3428" stroke-width="2.5"/>
        <circle cx="58" cy="64" r="7" fill="#3E3428" stroke-width="2.5"/>
        <circle cx="76" cy="64" r="7" fill="#3E3428" stroke-width="2.5"/>
      </g>
    </svg>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { VEHICLE_COLORS, normalizeVehicleType, type VehicleTypeId } from '../../utils/vehicleIcon'

const props = withDefaults(
  defineProps<{
    /** 车种 id，如 excavator；也可传 VehicleItem */
    type?: string
    item?: { id: string; color?: string }
    color?: string
    size?: number
  }>(),
  { size: 96 }
)

const kind = computed<VehicleTypeId | string>(() => {
  if (props.item?.id) return normalizeVehicleType(props.item.id) || props.item.id
  return normalizeVehicleType(props.type) || props.type || 'excavator'
})

const fill = computed(() => {
  if (props.color) return props.color
  if (props.item?.color) return props.item.color
  const id = kind.value as VehicleTypeId
  return VEHICLE_COLORS[id] || '#FFB300'
})

/** 铲斗 / 车斗 / 滚筒等部件用略深或金属色，便于辨认 */
const ACCENT_BY_KIND: Record<string, string> = {
  excavator: '#E8940F',
  bulldozer: '#C0C4C8',
  crane: '#F5D76E',
  dumptruck: '#F39C12',
  mixer: '#F5F5F5',
  roller: '#95A5A6',
  loader: '#F4D03F',
  forklift: '#7F8C8D',
}

const accent = computed(() => ACCENT_BY_KIND[kind.value] || fill.value)
</script>

<style scoped>
.vi {
  display: flex;
  align-items: center;
  justify-content: center;
}
.vi svg {
  width: 100%;
  height: 100%;
}
</style>
