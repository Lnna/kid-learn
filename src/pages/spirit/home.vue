<template>
  <view class="spirit-home">
    <view class="spirit-home__bg" />
    <view class="spirit-home__inner">
      <view class="top">
        <text class="back" @click="goBack">← 返回</text>
        <text class="title">我的小精灵</text>
        <text class="sub">学完语文数学掉药水，集齐 3 瓶就能孵化</text>
      </view>

      <view class="tabs">
        <text class="tab" :class="{ on: tab === 'hatch' }" @click="tab = 'hatch'">孵化</text>
        <text class="tab" :class="{ on: tab === 'pets' }" @click="tab = 'pets'">伙伴</text>
        <text class="tab" :class="{ on: tab === 'book' }" @click="tab = 'book'">图鉴</text>
        <text class="tab" :class="{ on: tab === 'feed' }" @click="tab = 'feed'">喂食</text>
      </view>

      <!-- 孵化 -->
      <view v-if="tab === 'hatch'" class="panel">
        <view class="potions">
          <view v-for="c in potionColors" :key="c" class="potion">
            <text class="potion__emoji">{{ POTION_META[c].emoji }}</text>
            <text class="potion__label">{{ POTION_META[c].label }}</text>
            <text class="potion__n">×{{ store.potions[c] }}</text>
            <text class="potion__hint">{{ POTION_META[c].subjectHint }}</text>
          </view>
        </view>

        <view class="beaker-wrap">
          <view class="beaker" :class="{ bubbling: hatching }">
            <view class="beaker__glass">
              <view class="beaker__liquid" :style="{ height: liquidH, background: liquidColor }" />
              <view v-for="i in 8" :key="i" class="bubble" :style="bubbleStyle(i)" />
            </view>
            <text class="beaker__label">魔法烧杯</text>
          </view>
        </view>

        <view v-if="justHatched" class="born anim-bounce">
          <SpiritBuddy
            :appearance="justHatched.appearance"
            :name="justHatched.name"
            :size="220"
            show-name
          />
          <text class="born__msg">{{ justHatched.name }} 诞生啦！</text>
        </view>

        <KButton
          :label="canDoHatch ? '滴入三瓶药水' : `还差 ${Math.max(0, 3 - totalPotions)} 瓶`"
          :color="'#4DA3FF'"
          :disabled="!canDoHatch || hatching"
          @click="doHatch"
        />
        <text class="tip">材料实验室是另一条线，这里只孵化主课小精灵哦</text>
      </view>

      <!-- 伙伴 -->
      <view v-else-if="tab === 'pets'" class="panel">
        <view v-if="!store.spirits.length" class="empty">
          <text class="empty__t">还没有小精灵</text>
          <text class="empty__d">去学语文或数学，通关收集药水吧</text>
          <KButton label="去学语文" color="#4DA3FF" @click="goSubject('chinese')" />
          <KButton label="去学数学" variant="soft" color="#FFC84A" @click="goSubject('math')" />
        </view>
        <view v-else class="pets">
          <view
            v-for="sp in store.spirits"
            :key="sp.id"
            class="pet-card"
            :class="{ active: sp.id === store.activeSpiritId }"
            @click="selectPet(sp.id)"
          >
            <SpiritBuddy :appearance="sp.appearance" :name="sp.name" :size="140" show-name />
            <text class="pet-card__tag">{{ sp.appearance.label }}</text>
            <text v-if="sp.id === store.activeSpiritId" class="pet-card__on">课中陪伴中</text>
          </view>
        </view>
      </view>

      <!-- 图鉴 -->
      <view v-else-if="tab === 'book'" class="panel">
        <text class="book__intro">收集全部混色外观（含英语绿药水）</text>
        <view class="book-grid">
          <view
            v-for="item in COLLECT_KEYS"
            :key="item.key"
            class="book-item"
            :class="{ got: collected.includes(item.key) }"
          >
            <view
              class="book-swatch"
              :style="{
                background:
                  collected.includes(item.key)
                    ? `linear-gradient(135deg, ${item.primary}, ${item.secondary})`
                    : '#e8dcc8',
              }"
            />
            <text class="book-label">{{ collected.includes(item.key) ? item.label : '？？？' }}</text>
          </view>
        </view>
        <text class="book__count">已收集 {{ collected.length }} / {{ COLLECT_KEYS.length }}</text>
      </view>

      <!-- 喂食 / 学具 -->
      <view v-else class="panel">
        <view class="feed-box">
          <text class="feed-box__n">黄金饲料 ×{{ store.goldenFeed }}</text>
          <text class="feed-box__d">主课满星通关可获得 · 喂饱后解锁变形学具</text>
          <view class="feed-bar">
            <view class="feed-bar__fill" :style="{ width: feedPct + '%' }" />
          </view>
          <text class="feed-box__prog">已喂 {{ feedProg.fed }} / {{ feedProg.need }}</text>
          <KButton
            label="喂一份饲料"
            color="#FFC84A"
            :disabled="store.goldenFeed < 1 || store.toolsUnlocked"
            @click="doFeed"
          />
          <text v-if="store.toolsUnlocked" class="feed-box__ok">学具已解锁！点下面按钮直达试点关（学具在关卡最后一环）</text>
        </view>
        <view class="tools">
          <view class="tool" :class="{ lock: !store.toolsUnlocked }">
            <text class="tool__t">{{ TOOL_META.stretchRuler.title }}</text>
            <text class="tool__d">{{ TOOL_META.stretchRuler.desc }}</text>
          </view>
          <view class="tool" :class="{ lock: !store.toolsUnlocked }">
            <text class="tool__t">{{ TOOL_META.letterMorph.title }}</text>
            <text class="tool__d">{{ TOOL_META.letterMorph.desc }}</text>
          </view>
        </view>
        <view v-if="store.toolsUnlocked" class="pilots">
          <text class="pilots__h">试点关入口</text>
          <view v-for="p in TOOL_PILOTS" :key="`${p.tool}-${p.levelId}-${p.activityTitle}`" class="pilot" @click="goPilot(p.subjectId, p.levelId)">
            <text class="pilot__t">{{ p.buttonLabel }}</text>
            <text class="pilot__d">{{ p.unitTitle }} · {{ p.levelTitle }} · 末尾「{{ p.activityTitle }}」</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import {
  canHatch,
  collectedAppearanceKeys,
  feedSpirit,
  getFeedProgress,
  hatch,
  loadSpiritStore,
  potionTotal,
  setActiveSpirit,
} from '../../engine/spiritStore'
import { COLLECT_KEYS, POTION_META, TOOL_META, TOOL_PILOTS } from '../../data/spirit'
import type { PotionColor, SpiritPet, SpiritStoreState } from '../../data/spirit/types'
import { dragPulse, lightTap } from '../../utils/haptics'
import { playSfx } from '../../utils/sfx'
import SpiritBuddy from '../../components/spirit/SpiritBuddy.vue'
import KButton from '../../components/ui/KButton.vue'
import type { SubjectId } from '../../engine/types'

const tab = ref<'hatch' | 'pets' | 'book' | 'feed'>('hatch')
const store = ref<SpiritStoreState>(loadSpiritStore())
const hatching = ref(false)
const justHatched = ref<SpiritPet | null>(null)
const feedProg = ref(getFeedProgress())
const collected = ref<string[]>([])

const potionColors: PotionColor[] = ['blue', 'yellow', 'green']
const totalPotions = computed(() => potionTotal(store.value))
const canDoHatch = computed(() => canHatch(store.value))
const feedPct = computed(() => Math.min(100, Math.round((feedProg.value.fed / feedProg.value.need) * 100)))

const liquidH = computed(() => {
  if (hatching.value) return '78%'
  return `${Math.min(70, totalPotions.value * 18)}%`
})
const liquidColor = computed(() => {
  const p = store.value.potions
  if (p.blue >= p.yellow && p.blue >= p.green) return 'linear-gradient(180deg,#8FC4FF,#4DA3FF)'
  if (p.yellow >= p.green) return 'linear-gradient(180deg,#FFE08A,#FFC84A)'
  return 'linear-gradient(180deg,#7FE0B2,#3ECF8E)'
})

function refresh() {
  store.value = loadSpiritStore()
  feedProg.value = getFeedProgress()
  collected.value = collectedAppearanceKeys()
}

function bubbleStyle(i: number) {
  return {
    left: `${12 + (i * 11) % 70}%`,
    animationDelay: `${i * 0.12}s`,
    animationDuration: `${0.8 + (i % 3) * 0.25}s`,
    opacity: hatching.value ? '1' : '0',
  } as Record<string, string>
}

async function doHatch() {
  if (!canDoHatch.value || hatching.value) return
  hatching.value = true
  justHatched.value = null
  lightTap()
  playSfx('unlock')
  dragPulse('中')
  await new Promise((r) => setTimeout(r, 900))
  dragPulse('高')
  const res = hatch()
  hatching.value = false
  if (res.ok && res.spirit) {
    justHatched.value = res.spirit
    playSfx('complete')
    lightTap()
    refresh()
    tab.value = 'hatch'
  } else {
    uni.showToast({ title: res.reason || '孵化失败', icon: 'none' })
  }
}

function selectPet(id: string) {
  setActiveSpirit(id)
  lightTap()
  playSfx('tap')
  refresh()
}

function doFeed() {
  const r = feedSpirit(1)
  if (!r.fed) {
    uni.showToast({ title: '饲料不够', icon: 'none' })
    return
  }
  playSfx('star')
  lightTap()
  refresh()
  if (r.toolsUnlocked) {
    uni.showToast({ title: '变形学具解锁！', icon: 'none' })
  }
}

function goSubject(id: SubjectId) {
  uni.navigateTo({ url: `/pages/subject/map?id=${id}` })
}

function goPilot(subjectId: string, levelId: string) {
  uni.navigateTo({ url: `/pages/lesson/play?subject=${subjectId}&level=${levelId}` })
}

function goBack() {
  uni.navigateBack({
    fail: () => uni.reLaunch({ url: '/pages/index/index' }),
  })
}

onShow(refresh)
</script>

<style scoped lang="scss">
.spirit-home {
  min-height: 100vh;
  position: relative;
  padding: calc(20rpx + var(--safe-top)) 24rpx calc(40rpx + var(--safe-bottom));
}
.spirit-home__bg {
  position: fixed;
  inset: 0;
  background:
    radial-gradient(ellipse at 20% 0%, rgba(77, 163, 255, 0.22), transparent 50%),
    radial-gradient(ellipse at 90% 10%, rgba(255, 200, 74, 0.2), transparent 45%),
    radial-gradient(ellipse at 50% 100%, rgba(62, 207, 142, 0.16), transparent 50%),
    var(--color-cream);
  z-index: 0;
}
.spirit-home__inner {
  position: relative;
  z-index: 1;
  max-width: var(--content-max);
  margin: 0 auto;
}
.top {
  margin-bottom: 20rpx;
}
.back {
  display: inline-block;
  font-size: 28rpx;
  color: var(--color-ink-soft);
  margin-bottom: 12rpx;
}
.title {
  display: block;
  font-size: 44rpx;
  font-weight: 900;
  color: var(--color-ink);
}
.sub {
  display: block;
  margin-top: 8rpx;
  font-size: 24rpx;
  color: var(--color-muted);
}
.tabs {
  display: flex;
  gap: 12rpx;
  margin-bottom: 24rpx;
}
.tab {
  flex: 1;
  text-align: center;
  padding: 14rpx 0;
  border-radius: 999rpx;
  font-size: 26rpx;
  font-weight: 700;
  background: rgba(255, 255, 255, 0.55);
  color: var(--color-muted);
}
.tab.on {
  background: #fff;
  color: var(--color-ink);
  box-shadow: var(--shadow-soft);
}
.panel {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}
.potions {
  display: flex;
  gap: 12rpx;
}
.potion {
  flex: 1;
  background: #fff;
  border-radius: var(--radius-md);
  padding: 16rpx 8rpx;
  text-align: center;
  box-shadow: var(--shadow-soft);
}
.potion__emoji {
  display: block;
  font-size: 36rpx;
}
.potion__label {
  display: block;
  font-size: 22rpx;
  font-weight: 800;
}
.potion__n {
  display: block;
  font-size: 32rpx;
  font-weight: 900;
  color: #4da3ff;
}
.potion__hint {
  display: block;
  font-size: 20rpx;
  color: var(--color-muted);
}
.beaker-wrap {
  display: flex;
  justify-content: center;
  padding: 12rpx 0;
}
.beaker {
  width: 220rpx;
  text-align: center;
}
.beaker__glass {
  height: 260rpx;
  border: 6rpx solid #c5b8a5;
  border-top: none;
  border-radius: 0 0 40rpx 40rpx;
  background: rgba(255, 255, 255, 0.35);
  position: relative;
  overflow: hidden;
}
.beaker__liquid {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  transition: height 0.4s ease;
}
.bubble {
  position: absolute;
  bottom: 10%;
  width: 16rpx;
  height: 16rpx;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.65);
  animation: rise 1s ease-in infinite;
  opacity: 0;
}
.bubbling .bubble {
  opacity: 1;
}
@keyframes rise {
  0% {
    transform: translateY(0) scale(0.6);
    opacity: 0.8;
  }
  100% {
    transform: translateY(-200rpx) scale(1.1);
    opacity: 0;
  }
}
.beaker__label {
  display: block;
  margin-top: 8rpx;
  font-size: 24rpx;
  font-weight: 700;
  color: var(--color-muted);
}
.born {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
}
.born__msg {
  font-size: 32rpx;
  font-weight: 900;
  color: var(--color-ink);
}
.tip {
  font-size: 22rpx;
  color: var(--color-muted);
  text-align: center;
}
.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16rpx;
  padding: 40rpx 20rpx;
  background: #fff;
  border-radius: var(--radius-lg);
}
.empty__t {
  font-size: 34rpx;
  font-weight: 900;
}
.empty__d {
  font-size: 26rpx;
  color: var(--color-muted);
  margin-bottom: 8rpx;
}
.pets {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
  justify-content: center;
}
.pet-card {
  width: 46%;
  background: #fff;
  border-radius: var(--radius-md);
  padding: 16rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: var(--shadow-soft);
  border: 4rpx solid transparent;
}
.pet-card.active {
  border-color: #4da3ff;
}
.pet-card__tag {
  font-size: 22rpx;
  color: var(--color-muted);
}
.pet-card__on {
  font-size: 20rpx;
  font-weight: 800;
  color: #4da3ff;
}
.book__intro {
  font-size: 26rpx;
  color: var(--color-muted);
}
.book-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16rpx;
}
.book-item {
  background: #fff;
  border-radius: var(--radius-md);
  padding: 16rpx;
  opacity: 0.55;
  box-shadow: var(--shadow-soft);
}
.book-item.got {
  opacity: 1;
}
.book-swatch {
  height: 72rpx;
  border-radius: 16rpx;
  margin-bottom: 10rpx;
}
.book-label {
  font-size: 24rpx;
  font-weight: 800;
}
.book__count {
  text-align: center;
  font-size: 26rpx;
  font-weight: 700;
}
.feed-box {
  background: #fff;
  border-radius: var(--radius-lg);
  padding: 28rpx;
  box-shadow: var(--shadow-soft);
  display: flex;
  flex-direction: column;
  gap: 12rpx;
  align-items: stretch;
}
.feed-box__n {
  font-size: 36rpx;
  font-weight: 900;
}
.feed-box__d {
  font-size: 24rpx;
  color: var(--color-muted);
}
.feed-bar {
  height: 16rpx;
  background: #e8dcc8;
  border-radius: 999rpx;
  overflow: hidden;
}
.feed-bar__fill {
  height: 100%;
  background: #ffc84a;
  border-radius: 999rpx;
  transition: width 0.3s ease;
}
.feed-box__prog {
  font-size: 24rpx;
  font-weight: 700;
}
.feed-box__ok {
  font-size: 26rpx;
  font-weight: 800;
  color: #3ecf8e;
}
.tools {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}
.tool {
  background: #fff;
  border-radius: var(--radius-md);
  padding: 20rpx;
  box-shadow: var(--shadow-soft);
}
.tool.lock {
  opacity: 0.5;
}
.tool__t {
  display: block;
  font-size: 30rpx;
  font-weight: 900;
}
.tool__d {
  display: block;
  font-size: 24rpx;
  color: var(--color-muted);
  margin-top: 6rpx;
}
.pilots {
  margin-top: 24rpx;
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}
.pilots__h {
  font-size: 26rpx;
  font-weight: 700;
  color: var(--color-ink);
}
.pilot {
  background: #fff;
  border-radius: var(--radius-md);
  padding: 20rpx 24rpx;
  box-shadow: var(--shadow-soft);
  border: 2rpx solid #ffe08a;
}
.pilot__t {
  display: block;
  font-size: 28rpx;
  font-weight: 700;
  color: #b8860b;
}
.pilot__d {
  display: block;
  margin-top: 6rpx;
  font-size: 22rpx;
  color: var(--color-muted);
  line-height: 1.4;
}
</style>
