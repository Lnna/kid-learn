<template>
  <view class="coll" :style="{ '--c': themeColor }">
    <view class="coll__bg" />
    <view class="coll__inner">
      <view class="top">
        <view class="back" @click="goBack">← 返回</view>
        <text class="title">{{ isGem ? '宝石收藏册' : '侏罗纪公园' }}</text>
        <text class="subtitle">{{ unlockedCount }} / {{ totalCount }} 已收集</text>
      </view>

      <!-- 宝石：12 宫格收藏册 -->
      <view v-if="isGem" class="mineral-grid">
        <view
          v-for="m in MINERALS"
          :key="m.id"
          class="mineral-card"
          :class="{ locked: !unlockedSet.has(m.id) }"
          @click="openMineral(m)"
        >
          <MineralIcon v-if="unlockedSet.has(m.id)" :item="m" :size="88" />
          <view v-else class="mineral-card__silhouette">?</view>
          <text class="mineral-card__name">{{ unlockedSet.has(m.id) ? m.name : '未知矿物' }}</text>
        </view>
      </view>

      <!-- 恐龙：公园场景 -->
      <view v-else class="park">
        <view class="park__scene">
          <text class="park__sun">☀️</text>
          <text class="park__tree park__tree--1">🌴</text>
          <text class="park__tree park__tree--2">🌿</text>
          <view
            v-for="(d, i) in unlockedDinos"
            :key="d.id"
            class="park__dino"
            :style="{ left: 8 + i * 26 + '%', animationDelay: i * 0.3 + 's' }"
            @click="openDino(d)"
          >
            <DinoIcon :item="d" :size="150" walking />
            <text class="park__dino-name">{{ d.name }}</text>
          </view>
          <view v-if="!unlockedDinos.length" class="park__empty">
            <text>还没有恐龙朋友，快去闯关收集吧！</text>
          </view>
        </view>
        <view class="park__shelf">
          <view
            v-for="d in DINOSAURS"
            :key="d.id"
            class="park__slot"
            :class="{ locked: !unlockedSet.has(d.id) }"
            @click="unlockedSet.has(d.id) && openDino(d)"
          >
            <text v-if="unlockedSet.has(d.id)" class="park__slot-name">✓ {{ d.name }}</text>
            <text v-else class="park__slot-lock">🔒 ???</text>
          </view>
        </view>
      </view>

      <!-- 矿物详情弹层 -->
      <view v-if="activeMineral" class="modal" @click="closeModal">
        <view class="modal__card" @click.stop>
          <view class="modal__head">
            <MineralIcon :item="activeMineral" :size="110" />
            <view>
              <text class="modal__name">{{ activeMineral.name }}</text>
              <text class="modal__sub">硬度：{{ activeMineral.hardnessLabel }}</text>
            </view>
          </view>
          <view class="tabs">
            <view
              v-for="tab in mineralTabs"
              :key="tab.id"
              class="tab"
              :class="{ on: mineralTab === tab.id }"
              @click="mineralTab = tab.id"
            >
              {{ tab.label }}
            </view>
          </view>
          <view class="modal__body">
            <template v-if="mineralTab === 'look'">
              <view class="look-row">
                <MineralIcon :item="activeMineral" :size="180" />
                <view class="look-facts">
                  <text class="look-fact">条痕色：<text class="streak-dot" :style="{ background: activeMineral.streakColor }" /> {{ streakName }}</text>
                  <text class="look-fact">形状：{{ shapeName }}</text>
                </view>
              </view>
            </template>
            <template v-else-if="mineralTab === 'secret'">
              <view v-for="(f, i) in activeMineral.facts" :key="i" class="fact">
                <text class="fact__num">{{ i + 1 }}</text>
                <text class="fact__text">{{ f }}</text>
              </view>
            </template>
            <template v-else>
              <view class="worldmap">
                <svg viewBox="0 0 100 60" xmlns="http://www.w3.org/2000/svg" class="worldmap__svg">
                  <rect width="100" height="60" rx="6" fill="#BFE3F7"/>
                  <path d="M18 14 Q26 10 32 16 L30 26 Q22 30 16 24 Z" fill="#8FCB9B"/>
                  <path d="M30 32 Q36 30 38 38 L34 50 Q28 46 28 40 Z" fill="#8FCB9B"/>
                  <path d="M46 12 Q56 8 62 14 L60 22 Q50 24 44 20 Z" fill="#8FCB9B"/>
                  <path d="M48 26 Q58 24 60 34 L56 48 Q48 44 46 36 Z" fill="#8FCB9B"/>
                  <path d="M64 14 Q80 10 88 20 L84 34 Q72 38 64 30 Z" fill="#8FCB9B"/>
                  <path d="M80 40 Q88 38 90 46 L84 52 Q78 48 78 44 Z" fill="#8FCB9B"/>
                  <circle :cx="activeMineral.mapX" :cy="activeMineral.mapY" r="3.5" fill="#FF6B6B" stroke="#fff" stroke-width="1.5" class="map-dot"/>
                </svg>
                <text class="worldmap__origin">主要产地：{{ activeMineral.origin }}</text>
              </view>
            </template>
          </view>
          <KButton label="合上" variant="soft" :color="themeColor" block @click="closeModal" />
        </view>
      </view>

      <!-- 恐龙详情弹层 -->
      <view v-if="activeDino" class="modal" @click="closeModal">
        <view class="modal__card" @click.stop>
          <view class="modal__head">
            <DinoIcon :item="activeDino" :size="150" />
            <view>
              <text class="modal__name">{{ activeDino.name }}</text>
              <text class="modal__sub">{{ activeDino.era }} · {{ activeDino.diet }}</text>
            </view>
          </view>
          <view class="modal__body">
            <text class="dino-length">身长：{{ activeDino.length }}</text>
            <view v-for="(f, i) in activeDino.facts" :key="i" class="fact">
              <text class="fact__num">{{ i + 1 }}</text>
              <text class="fact__text">{{ f }}</text>
            </view>
          </view>
          <KButton label="关上" variant="soft" :color="themeColor" block @click="closeModal" />
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { onLoad, onShow } from '@dcloudio/uni-app'
import { getSubject } from '../../engine/catalog'
import { getUnlocked } from '../../engine/collection'
import { MINERALS } from '../../data/gem/minerals'
import { DINOSAURS } from '../../data/dino/dinosaurs'
import type { MineralItem, DinoItem, ThemeId } from '../../engine/types'
import { playSfx } from '../../utils/sfx'
import { speak } from '../../utils/tts'
import MineralIcon from '../../components/theme/MineralIcon.vue'
import DinoIcon from '../../components/theme/DinoIcon.vue'
import KButton from '../../components/ui/KButton.vue'

const theme = ref<ThemeId>('gem')
const unlockedSet = ref<Set<string>>(new Set())
const activeMineral = ref<MineralItem | null>(null)
const activeDino = ref<DinoItem | null>(null)
const mineralTab = ref<'look' | 'secret' | 'where'>('look')

const mineralTabs = [
  { id: 'look' as const, label: '它的样子' },
  { id: 'secret' as const, label: '它的秘密' },
  { id: 'where' as const, label: '它在哪里' },
]

const isGem = computed(() => theme.value === 'gem')
const themeColor = computed(() => getSubject(theme.value).color)
const totalCount = computed(() => (isGem.value ? MINERALS.length : DINOSAURS.length))
const unlockedCount = computed(() => unlockedSet.value.size)
const unlockedDinos = computed(() => DINOSAURS.filter((d) => unlockedSet.value.has(d.id)))

const streakName = computed(() => {
  const c = (activeMineral.value?.streakColor || '').toUpperCase()
  if (c === '#FFFFFF') return '白色'
  if (c === '#2E5A1C') return '墨绿色'
  if (c === '#1A1A1A') return '黑色'
  if (c === '#A9DFBF') return '浅绿色'
  return '彩色'
})
const shapeName = computed(() => {
  const s = activeMineral.value?.shape
  return s === 'crystal' ? '晶体（有棱有角）' : s === 'layer' ? '一层一层' : '圆圆的'
})

function refresh() {
  unlockedSet.value = new Set(getUnlocked(theme.value))
}

function openMineral(m: MineralItem) {
  if (!unlockedSet.value.has(m.id)) {
    playSfx('wrong')
    uni.showToast({ title: '还没收集到，继续闯关吧', icon: 'none' })
    return
  }
  playSfx('tap')
  activeMineral.value = m
  mineralTab.value = 'look'
  speak(m.name)
}

function openDino(d: DinoItem) {
  playSfx('tap')
  activeDino.value = d
  speak(d.name)
}

function closeModal() {
  activeMineral.value = null
  activeDino.value = null
}

function goBack() {
  uni.navigateBack()
}

onLoad((q) => {
  if (q?.theme === 'dino') theme.value = 'dino'
})
onShow(refresh)
</script>

<style scoped lang="scss">
.coll {
  min-height: 100vh;
  position: relative;
  padding: calc(16rpx + var(--safe-top)) 24rpx calc(40rpx + var(--safe-bottom));
}
.coll__bg {
  position: fixed;
  inset: 0;
  background:
    radial-gradient(ellipse at 10% 0%, color-mix(in srgb, var(--c) 20%, transparent), transparent 50%),
    var(--color-cream);
  z-index: 0;
}
.coll__inner {
  position: relative;
  z-index: 1;
  max-width: var(--content-max);
  margin: 0 auto;
}
.back {
  font-size: 28rpx;
  color: var(--color-ink-soft);
  margin-bottom: 12rpx;
  display: inline-block;
  padding: 8rpx 0;
}
.top {
  text-align: center;
  margin-bottom: 28rpx;
}
.title {
  display: block;
  font-size: 52rpx;
  font-weight: 900;
  color: var(--c);
  font-family: var(--font-round);
}
.subtitle {
  display: block;
  font-size: 26rpx;
  color: var(--color-muted);
  margin-top: 8rpx;
}
.mineral-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16rpx;
}
@media (min-width: 700px) {
  .mineral-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
.mineral-card {
  background: #fff;
  border-radius: var(--radius-md);
  padding: 20rpx 12rpx;
  text-align: center;
  box-shadow: var(--shadow-soft);
  border: 4rpx solid #f5ebd8;
}
.mineral-card.locked {
  opacity: 0.6;
}
.mineral-card__silhouette {
  width: 88rpx;
  height: 88rpx;
  margin: 0 auto;
  border-radius: 40% 45% 42% 48%;
  background: #e0d8c8;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40rpx;
  font-weight: 900;
  color: #b8ab90;
}
.mineral-card__name {
  display: block;
  margin-top: 10rpx;
  font-size: 24rpx;
  font-weight: 700;
  color: var(--color-ink);
}
.park__scene {
  position: relative;
  min-height: 380rpx;
  background: linear-gradient(180deg, #bfe3f7 0%, #e8f7e8 70%, #d4edda 100%);
  border-radius: var(--radius-lg);
  overflow: hidden;
  margin-bottom: 20rpx;
  border: 4rpx solid #fff;
}
.park__sun {
  position: absolute;
  top: 20rpx;
  right: 30rpx;
  font-size: 56rpx;
}
.park__tree {
  position: absolute;
  font-size: 64rpx;
}
.park__tree--1 {
  left: 20rpx;
  bottom: 16rpx;
}
.park__tree--2 {
  right: 100rpx;
  bottom: 10rpx;
  font-size: 48rpx;
}
.park__dino {
  position: absolute;
  bottom: 30rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: dino-bob 2s ease-in-out infinite;
}
@keyframes dino-bob {
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(16rpx); }
}
.park__dino-name {
  font-size: 22rpx;
  font-weight: 700;
  color: var(--color-ink);
  background: rgba(255, 255, 255, 0.85);
  padding: 2rpx 12rpx;
  border-radius: 999rpx;
}
.park__empty {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-muted);
  font-size: 28rpx;
}
.park__shelf {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12rpx;
}
@media (min-width: 700px) {
  .park__shelf {
    grid-template-columns: repeat(3, 1fr);
  }
}
.park__slot {
  background: #fff;
  border-radius: var(--radius-md);
  padding: 18rpx;
  text-align: center;
  box-shadow: var(--shadow-soft);
}
.park__slot.locked {
  opacity: 0.6;
}
.park__slot-name {
  font-size: 26rpx;
  font-weight: 700;
  color: var(--c);
}
.park__slot-lock {
  font-size: 26rpx;
  color: var(--color-muted);
}
.modal {
  position: fixed;
  inset: 0;
  background: rgba(44, 36, 22, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99;
  padding: 32rpx;
}
.modal__card {
  background: #fff8ee;
  border-radius: var(--radius-lg);
  padding: 32rpx;
  width: 100%;
  max-width: 640rpx;
  max-height: 84vh;
  overflow-y: auto;
  animation: bounce-in 0.35s ease;
}
.modal__head {
  display: flex;
  align-items: center;
  gap: 20rpx;
  margin-bottom: 20rpx;
}
.modal__name {
  display: block;
  font-size: 44rpx;
  font-weight: 900;
  color: var(--color-ink);
}
.modal__sub {
  display: block;
  font-size: 24rpx;
  color: var(--color-muted);
  margin-top: 6rpx;
}
.tabs {
  display: flex;
  gap: 12rpx;
  margin-bottom: 20rpx;
}
.tab {
  flex: 1;
  text-align: center;
  padding: 14rpx 0;
  border-radius: 999rpx;
  background: #fff;
  font-size: 26rpx;
  color: var(--color-ink-soft);
  border: 3rpx solid #f0e6d2;
}
.tab.on {
  background: var(--c);
  color: #fff;
  border-color: var(--c);
  font-weight: 700;
}
.modal__body {
  margin-bottom: 24rpx;
}
.look-row {
  display: flex;
  align-items: center;
  gap: 24rpx;
}
.look-facts {
  flex: 1;
}
.look-fact {
  display: block;
  font-size: 26rpx;
  color: var(--color-ink);
  margin-bottom: 14rpx;
}
.streak-dot {
  display: inline-block;
  width: 24rpx;
  height: 24rpx;
  border-radius: 50%;
  border: 2rpx solid #ccc;
  vertical-align: middle;
  margin: 0 6rpx;
}
.fact {
  display: flex;
  gap: 14rpx;
  background: #fff;
  border-radius: var(--radius-sm);
  padding: 18rpx;
  margin-bottom: 12rpx;
  align-items: flex-start;
}
.fact__num {
  width: 40rpx;
  height: 40rpx;
  border-radius: 50%;
  background: var(--c);
  color: #fff;
  font-size: 24rpx;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.fact__text {
  flex: 1;
  font-size: 28rpx;
  color: var(--color-ink);
  line-height: 1.5;
}
.worldmap__svg {
  width: 100%;
  border-radius: var(--radius-sm);
}
.map-dot {
  animation: pulse-soft 1.5s ease-in-out infinite;
}
.worldmap__origin {
  display: block;
  text-align: center;
  font-size: 26rpx;
  font-weight: 700;
  color: var(--color-ink);
  margin-top: 12rpx;
}
.dino-length {
  display: block;
  font-size: 28rpx;
  font-weight: 700;
  color: var(--color-ink);
  margin-bottom: 16rpx;
}
</style>
