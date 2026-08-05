<template>
  <view class="hub" :class="{ dark: lightsOff }">
    <view class="hub__bg" />
    <view class="hub__inner">
      <view class="top">
        <view class="back" @click="goBack">← 返回</view>
        <text class="title">史莱姆材料科学家</text>
        <text class="subtitle">调节变量 · 探索材料科学</text>
        <view class="guide" @click="goGuide">
          <text>📘 新手引导（3 关）</text>
        </view>
      </view>

      <view class="tabs">
        <view
          v-for="t in tabs"
          :key="t.id"
          class="tab"
          :class="{ on: tab === t.id }"
          @click="switchTab(t.id)"
        >
          <text>{{ t.label }}</text>
        </view>
      </view>

      <!-- 实验室 -->
      <view v-if="tab === 'lab'" class="panel">
        <view class="controls">
          <view class="ctrl">
            <text class="ctrl__label">基础胶体</text>
            <view class="seg">
              <view class="seg__btn" :class="{ on: base === 'white' }" @click="setBase('white')">白胶</view>
              <view class="seg__btn" :class="{ on: base === 'clear' }" @click="setBase('clear')">透明胶水</view>
            </view>
          </view>

          <view class="ctrl">
            <text class="ctrl__label">交联剂（硼砂水）{{ borax }} 滴</text>
            <slider
              class="slider"
              :value="borax"
              :min="1"
              :max="5"
              :step="1"
              activeColor="#0288D1"
              backgroundColor="#B3E5FC"
              block-size="20"
              @change="onBorax"
            />
          </view>

          <view class="ctrl">
            <text class="ctrl__label">添加剂（可点取消）</text>
            <view class="chips">
              <view
                v-for="a in additives"
                :key="a.id"
                class="chip"
                :class="{ on: additive === a.id }"
                @click="toggleAdditive(a.id)"
              >
                <text>{{ a.icon }} {{ a.label }}</text>
              </view>
            </view>
          </view>

          <view class="start" :class="{ disabled: mixing }" @click="startMix">
            <text>{{ mixing ? '实验中…' : '开始实验' }}</text>
          </view>
        </view>

        <view class="bench">
          <view v-if="mixing" class="beaker mixing">
            <view class="beaker__glass">
              <view class="beaker__liquid" :style="{ background: previewColor }" />
              <view class="stir" />
              <view v-for="i in 5" :key="i" class="bubble" :style="{ left: 20 + i * 12 + '%', animationDelay: i * 0.2 + 's' }" />
            </view>
            <text class="beaker__tip">搅拌反应中…</text>
          </view>

          <view v-else-if="result" class="result">
            <SlimeSoftBody :result="result" :lights-off="lightsOff" />

            <view v-if="result.effect === 'glow'" class="light-btn" @click="toggleLights">
              <text>{{ lightsOff ? '开灯' : '关灯看夜光' }}</text>
            </view>

            <view class="tags">
              <text class="tag">透明度：{{ result.transparency }}</text>
              <text class="tag">弹性：{{ result.elasticity }}</text>
              <text class="tag">硬度：{{ result.hardness }}</text>
              <text class="tag">流动性：{{ result.fluidity }}</text>
              <text class="tag">特效：{{ effectLabel }}</text>
            </view>
            <text class="hint">戳一下会凹下去 · 按住拖会拉伸 · 松手看回弹</text>
          </view>

          <view v-else class="empty-bench">
            <text class="empty-bench__icon">🧪</text>
            <text class="empty-bench__text">调好变量，开始你的材料实验</text>
          </view>
        </view>
      </view>

      <!-- 图鉴 -->
      <view v-else-if="tab === 'recipes'" class="panel">
        <view class="sec-head">
          <text class="sec-title">传说配方 {{ unlockedCount }}/{{ legends.length }}</text>
        </view>
        <view class="grid">
          <view
            v-for="r in legends"
            :key="r.id"
            class="card"
            :class="{ locked: !isUnlocked(r.id) }"
            @click="openLegend(r)"
          >
            <view class="card__swatch" :style="{ background: swatchOf(r) }" />
            <text class="card__name">{{ isUnlocked(r.id) ? r.name : '？？？' }}</text>
            <text v-if="isUnlocked(r.id)" class="card__meta">{{ recipeMeta(r) }}</text>
            <text v-else class="card__meta">未解锁</text>
          </view>
        </view>

        <view class="sec-head">
          <text class="sec-title">我的创作 {{ creations.length }}</text>
        </view>
        <view v-if="!creations.length" class="empty">还没有自定义配方，去实验室试试吧</view>
        <view v-else class="list">
          <view v-for="c in creations" :key="c.fingerprint" class="row" @click="openCreation(c)">
            <view class="row__swatch" :style="{ background: computeResult(c).color }" />
            <view class="row__body">
              <text class="row__title">{{ recipeMeta(c) }}</text>
              <text class="row__date">{{ formatDate(c.createdAt) }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 展览馆 -->
      <view v-else class="panel">
        <view class="sec-head">
          <text class="sec-title">我的展览馆</text>
        </view>
        <view v-if="!galleryItems.length" class="empty">完成实验后，作品会出现在这里</view>
        <view class="grid">
          <view v-for="g in galleryItems" :key="g.key" class="card" @click="openGallery(g)">
            <view class="card__swatch" :style="{ background: g.color }" />
            <text class="card__name">{{ g.title }}</text>
            <text class="card__meta">{{ g.meta }}</text>
          </view>
        </view>
      </view>
    </view>

    <text class="safety">本游戏为科学模拟，真实制作需在家长陪同下进行。</text>

    <!-- 科学小贴士 -->
    <view v-if="tipVisible" class="modal" @click.self="closeTip">
      <view class="modal__box">
        <text class="modal__eyebrow">🔬 科学小贴士</text>
        <text class="modal__title">{{ tipTitle }}</text>
        <text class="modal__body">{{ tipBody }}</text>
        <view class="modal__btn" @click="closeTip"><text>知道啦</text></view>
      </view>
    </view>

    <!-- 详情 / 分享 -->
    <view v-if="detail" class="modal" @click.self="detail = null">
      <view class="modal__box">
        <view class="detail-swatch" :style="{ background: detail.color }" />
        <text class="modal__title">{{ detail.title }}</text>
        <text class="modal__body">{{ detail.meta }}</text>
        <text v-if="detail.tip" class="modal__body tip">{{ detail.tip }}</text>
        <view class="modal__actions">
          <view class="modal__btn ghost" @click="detail = null"><text>关闭</text></view>
          <view class="modal__btn" @click="shareCard"><text>分享卡片</text></view>
        </view>
      </view>
    </view>

    <canvas
      canvas-id="slimeShare"
      id="slimeShare"
      class="share-canvas"
      :style="{ width: shareW + 'px', height: shareH + 'px' }"
    />
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { onLoad, onShow } from '@dcloudio/uni-app'
import { LEGEND_RECIPES } from '../../data/slime/recipes'
import { computeResult } from '../../data/slime/mapping'
import { getTip } from '../../data/slime/tips'
import {
  ADDITIVE_LABELS,
  BASE_LABELS,
  type Additive,
  type BaseGlue,
  type BoraxDrops,
  type LegendRecipe,
  type SlimeCreation,
  type SlimeResult,
} from '../../data/slime/types'
import { loadSlimeStore, recordMix, BADGE_LABELS } from '../../engine/slimeStore'
import { lightTap, stirPulse } from '../../utils/haptics'
import { playSfx } from '../../utils/sfx'
import { unlockSpeak } from '../../utils/tts'
import SlimeSoftBody from '../../components/slime/SlimeSoftBody.vue'

type TabId = 'lab' | 'recipes' | 'gallery'

const tabs = [
  { id: 'lab' as const, label: '实验室' },
  { id: 'recipes' as const, label: '图鉴' },
  { id: 'gallery' as const, label: '展览馆' },
]

const additives: { id: Additive; label: string; icon: string }[] = [
  { id: 'glitter', label: '闪粉', icon: '✨' },
  { id: 'glow', label: '夜光粉', icon: '🌙' },
  { id: 'iron', label: '铁粉', icon: '⚙️' },
  { id: 'pearl', label: '珠光粉', icon: '🌈' },
  { id: 'fragrance', label: '香精', icon: '🌸' },
]

const tab = ref<TabId>('lab')
const base = ref<BaseGlue>('clear')
const borax = ref<BoraxDrops>(3)
const additive = ref<Additive>('none')
const mixing = ref(false)
const result = ref<SlimeResult | null>(null)
const lightsOff = ref(false)

const unlocked = ref<string[]>([])
const creations = ref<SlimeCreation[]>([])
const legends = LEGEND_RECIPES

const tipVisible = ref(false)
const tipTitle = ref('')
const tipBody = ref('')

const detail = ref<{
  title: string
  meta: string
  color: string
  tip?: string
  vars: { base: BaseGlue; borax: BoraxDrops; additive: Additive }
} | null>(null)

const shareW = 360
const shareH = 480

const previewColor = computed(() => computeResult({ base: base.value, borax: borax.value, additive: additive.value }).color)
const effectLabel = computed(() => (result.value ? ADDITIVE_LABELS[result.value.effect] : '无'))
const unlockedCount = computed(() => unlocked.value.length)

interface GalleryItem {
  key: string
  title: string
  meta: string
  color: string
  tip?: string
  vars: { base: BaseGlue; borax: BoraxDrops; additive: Additive }
}

const galleryItems = computed<GalleryItem[]>(() => {
  const list: GalleryItem[] = []
  unlocked.value.forEach((id) => {
    const r = LEGEND_RECIPES.find((x) => x.id === id)
    if (!r) return
    list.push({
      key: r.id,
      title: r.name,
      meta: recipeMeta(r),
      color: swatchOf(r),
      tip: getTip(r.tipId),
      vars: { base: r.base, borax: r.borax, additive: r.additive },
    })
  })
  creations.value.forEach((c) => {
    const res = computeResult(c)
    list.push({
      key: c.fingerprint,
      title: '我的创作',
      meta: recipeMeta(c) + ' · ' + formatDate(c.createdAt),
      color: res.color,
      vars: { base: c.base, borax: c.borax, additive: c.additive },
    })
  })
  return list
})

function refreshStore() {
  const s = loadSlimeStore()
  unlocked.value = [...s.unlockedLegendIds]
  creations.value = [...s.creations]
}

function isUnlocked(id: string) {
  return unlocked.value.includes(id)
}

function recipeMeta(r: { base: BaseGlue; borax: BoraxDrops; additive: Additive }) {
  return `${BASE_LABELS[r.base]} · ${r.borax}滴 · ${ADDITIVE_LABELS[r.additive]}`
}

function swatchOf(r: LegendRecipe) {
  return computeResult(r).color
}

function formatDate(iso: string) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function switchTab(id: TabId) {
  lightTap()
  playSfx('tap')
  tab.value = id
  refreshStore()
}

function setBase(v: BaseGlue) {
  lightTap()
  playSfx('tap')
  base.value = v
}

function onBorax(e: { detail: { value: number } }) {
  borax.value = Math.max(1, Math.min(5, Math.round(e.detail.value))) as BoraxDrops
  lightTap()
}

function toggleAdditive(id: Additive) {
  lightTap()
  playSfx('tap')
  additive.value = additive.value === id ? 'none' : id
}

function startMix() {
  if (mixing.value) return
  unlockSpeak()
  lightTap()
  playSfx('tap')
  mixing.value = true
  result.value = null
  lightsOff.value = false

  const duration = 3500
  const start = Date.now()
  const timer = setInterval(() => {
    const p = (Date.now() - start) / duration
    stirPulse(p)
    if (p >= 1) {
      clearInterval(timer)
      finishMix()
    }
  }, 280)
}

function finishMix() {
  mixing.value = false
  const outcome = recordMix({ base: base.value, borax: borax.value, additive: additive.value })
  result.value = outcome.result
  refreshStore()
  playSfx(outcome.newlyUnlocked ? 'unlock' : 'correct')

  if (outcome.newBadges.length) {
    const names = outcome.newBadges.map((b) => BADGE_LABELS[b] || b).join('、')
    uni.showToast({ title: `徽章：${names}`, icon: 'none' })
  }

  if (outcome.newlyUnlocked && outcome.legend && outcome.tipId) {
    tipTitle.value = outcome.legend.name
    tipBody.value = getTip(outcome.tipId)
    tipVisible.value = true
  } else if (!outcome.legend) {
    uni.showToast({ title: '已存入我的创作', icon: 'none' })
  }
}

function toggleLights() {
  lightTap()
  lightsOff.value = !lightsOff.value
}

function openLegend(r: LegendRecipe) {
  lightTap()
  if (!isUnlocked(r.id)) {
    uni.showToast({ title: '尚未解锁', icon: 'none' })
    return
  }
  detail.value = {
    title: r.name,
    meta: recipeMeta(r),
    color: swatchOf(r),
    tip: getTip(r.tipId),
    vars: { base: r.base, borax: r.borax, additive: r.additive },
  }
}

function openCreation(c: SlimeCreation) {
  lightTap()
  const res = computeResult(c)
  detail.value = {
    title: '我的创作',
    meta: recipeMeta(c) + '\n' + formatDate(c.createdAt),
    color: res.color,
    vars: { base: c.base, borax: c.borax, additive: c.additive },
  }
}

function openGallery(g: GalleryItem) {
  lightTap()
  detail.value = {
    title: g.title,
    meta: g.meta,
    color: g.color,
    tip: g.tip,
    vars: g.vars,
  }
}

function closeTip() {
  tipVisible.value = false
  lightTap()
}

function shareCard() {
  if (!detail.value) return
  lightTap()
  playSfx('tap')
  const d = detail.value
  const ctx = uni.createCanvasContext('slimeShare')
  ctx.setFillStyle('#E3F2FD')
  ctx.fillRect(0, 0, shareW, shareH)
  ctx.setFillStyle('#0277BD')
  ctx.setFontSize(22)
  ctx.fillText('史莱姆材料科学家', 24, 40)
  ctx.setFillStyle(d.color)
  ctx.beginPath()
  ctx.arc(shareW / 2, 160, 70, 0, Math.PI * 2)
  ctx.fill()
  ctx.setStrokeStyle('#0288D1')
  ctx.setLineWidth(3)
  ctx.stroke()
  ctx.setFillStyle('#01579B')
  ctx.setFontSize(20)
  ctx.fillText(d.title, 24, 270)
  ctx.setFontSize(14)
  ctx.setFillStyle('#37474F')
  const lines = (d.meta + (d.tip ? '\n' + d.tip : '')).slice(0, 120)
  wrapText(ctx, lines, 24, 300, shareW - 48, 18)
  ctx.setFillStyle('#78909C')
  ctx.setFontSize(12)
  ctx.fillText('小小科学家 · ' + formatDate(new Date().toISOString()), 24, shareH - 28)
  ctx.setFillStyle('#90A4AE')
  ctx.fillText('科学模拟 · 真实制作需家长陪同', 24, shareH - 12)
  ctx.draw(false, () => {
    uni.canvasToTempFilePath({
      canvasId: 'slimeShare',
      width: shareW,
      height: shareH,
      destWidth: shareW * 2,
      destHeight: shareH * 2,
      success: (res) => {
        // #ifdef H5
        const a = document.createElement('a')
        a.href = res.tempFilePath
        a.download = `slime-${Date.now()}.png`
        a.click()
        uni.showToast({ title: '卡片已保存', icon: 'none' })
        // #endif
        // #ifndef H5
        uni.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: () => uni.showToast({ title: '已保存到相册', icon: 'none' }),
          fail: () => uni.previewImage({ urls: [res.tempFilePath] }),
        })
        // #endif
      },
      fail: () => uni.showToast({ title: '生成失败，请重试', icon: 'none' }),
    })
  })
}

function wrapText(
  ctx: UniApp.CanvasContext,
  text: string,
  x: number,
  y: number,
  maxW: number,
  lineH: number
) {
  const chars = text.replace(/\n/g, ' ').split('')
  let line = ''
  let yy = y
  for (const ch of chars) {
    const test = line + ch
    if (ctx.measureText(test).width > maxW) {
      ctx.fillText(line, x, yy)
      line = ch
      yy += lineH
      if (yy > shareH - 50) break
    } else line = test
  }
  if (line) ctx.fillText(line, x, yy)
}

function goGuide() {
  lightTap()
  playSfx('tap')
  uni.navigateTo({ url: '/pages/subject/map?id=slime' })
}

function goBack() {
  uni.navigateBack()
}

onLoad((q) => {
  const t = q?.tab as TabId | undefined
  if (t && ['lab', 'recipes', 'gallery'].includes(t)) tab.value = t
})

onShow(refreshStore)
</script>

<style scoped lang="scss">
.hub {
  min-height: 100vh;
  position: relative;
  --slime: #0288d1;
  color: #0d47a1;
}
.hub.dark {
  .hub__bg {
    background: radial-gradient(circle at 50% 30%, #1a237e, #000 70%);
  }
  .title,
  .subtitle,
  .ctrl__label,
  .sec-title,
  .tag,
  .hint {
    color: #e3f2fd !important;
  }
}
.hub__bg {
  position: fixed;
  inset: 0;
  background:
    radial-gradient(ellipse at 20% 0%, #e1f5fe 0%, transparent 50%),
    radial-gradient(ellipse at 80% 20%, #b3e5fc 0%, transparent 45%),
    linear-gradient(180deg, #f5fbff 0%, #e3f2fd 40%, #fff 100%);
  z-index: 0;
}
.hub__inner {
  position: relative;
  z-index: 1;
  padding: calc(16rpx + var(--safe-top)) 24rpx calc(100rpx + var(--safe-bottom));
}
.top {
  margin-bottom: 20rpx;
}
.back {
  display: inline-block;
  font-size: 28rpx;
  color: var(--slime);
  margin-bottom: 8rpx;
  padding: 8rpx 0;
}
.title {
  display: block;
  font-size: 44rpx;
  font-weight: 800;
  color: #01579b;
}
.subtitle {
  display: block;
  font-size: 24rpx;
  color: #547f9e;
  margin-top: 4rpx;
}
.guide {
  margin-top: 16rpx;
  display: inline-flex;
  background: #fff;
  border: 2rpx solid #4fc3f7;
  border-radius: 999rpx;
  padding: 10rpx 22rpx;
  font-size: 24rpx;
  color: #0277bd;
  box-shadow: 0 8rpx 24rpx rgba(2, 136, 209, 0.12);
}
.tabs {
  display: flex;
  gap: 12rpx;
  margin: 24rpx 0;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 999rpx;
  padding: 8rpx;
  backdrop-filter: blur(8px);
}
.tab {
  flex: 1;
  text-align: center;
  padding: 16rpx 0;
  border-radius: 999rpx;
  font-size: 26rpx;
  font-weight: 700;
  color: #547f9e;
}
.tab.on {
  background: linear-gradient(135deg, #0288d1, #29b6f6);
  color: #fff;
}
.panel {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}
.controls {
  background: rgba(255, 255, 255, 0.88);
  border: 2rpx solid rgba(79, 195, 247, 0.5);
  border-radius: 28rpx;
  padding: 24rpx;
  box-shadow: 0 12rpx 40rpx rgba(2, 136, 209, 0.1);
}
.ctrl {
  margin-bottom: 22rpx;
}
.ctrl__label {
  display: block;
  font-size: 26rpx;
  font-weight: 700;
  color: #01579b;
  margin-bottom: 12rpx;
}
.seg {
  display: flex;
  gap: 12rpx;
}
.seg__btn {
  flex: 1;
  text-align: center;
  padding: 18rpx;
  border-radius: 16rpx;
  background: #e1f5fe;
  color: #0277bd;
  font-weight: 700;
  font-size: 26rpx;
  border: 2rpx solid transparent;
}
.seg__btn.on {
  background: #0288d1;
  color: #fff;
  border-color: #01579b;
}
.slider {
  margin: 0 8rpx;
}
.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
}
.chip {
  padding: 12rpx 18rpx;
  border-radius: 999rpx;
  background: #e3f2fd;
  font-size: 24rpx;
  color: #0277bd;
  border: 2rpx solid transparent;
}
.chip.on {
  background: #0288d1;
  color: #fff;
}
.start {
  margin-top: 8rpx;
  background: linear-gradient(135deg, #0288d1, #00bcd4);
  color: #fff;
  text-align: center;
  padding: 24rpx;
  border-radius: 20rpx;
  font-size: 32rpx;
  font-weight: 800;
  box-shadow: 0 12rpx 28rpx rgba(2, 136, 209, 0.35);
}
.start.disabled {
  opacity: 0.6;
}
.bench {
  min-height: 420rpx;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.5), rgba(227, 242, 253, 0.9)),
    repeating-linear-gradient(90deg, transparent, transparent 40rpx, rgba(2, 136, 209, 0.04) 40rpx, rgba(2, 136, 209, 0.04) 42rpx);
  border-radius: 28rpx;
  border: 2rpx solid rgba(79, 195, 247, 0.45);
  padding: 28rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.beaker {
  text-align: center;
}
.beaker__glass {
  width: 180rpx;
  height: 220rpx;
  margin: 0 auto;
  border: 6rpx solid rgba(2, 136, 209, 0.45);
  border-top: none;
  border-radius: 0 0 40rpx 40rpx;
  position: relative;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.35);
}
.beaker__liquid {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 70%;
  animation: slosh 0.6s ease-in-out infinite alternate;
}
.stir {
  position: absolute;
  top: 10%;
  left: 50%;
  width: 8rpx;
  height: 70%;
  margin-left: -4rpx;
  background: #90a4ae;
  border-radius: 8rpx;
  transform-origin: top center;
  animation: stir 0.45s linear infinite;
}
.bubble {
  position: absolute;
  bottom: 20%;
  width: 16rpx;
  height: 16rpx;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.7);
  animation: rise 1.2s ease-in infinite;
}
.beaker__tip {
  margin-top: 16rpx;
  color: #0277bd;
  font-size: 26rpx;
}
@keyframes stir {
  from {
    transform: rotate(-18deg);
  }
  to {
    transform: rotate(18deg);
  }
}
@keyframes slosh {
  from {
    transform: skewX(-4deg);
  }
  to {
    transform: skewX(4deg);
  }
}
@keyframes rise {
  from {
    transform: translateY(40rpx);
    opacity: 0.8;
  }
  to {
    transform: translateY(-120rpx);
    opacity: 0;
  }
}
.light-btn {
  margin-top: 12rpx;
  font-size: 24rpx;
  color: #0277bd;
  background: #fff;
  border: 2rpx solid #4fc3f7;
  border-radius: 999rpx;
  padding: 10rpx 24rpx;
}
.result {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10rpx;
  justify-content: center;
  margin-top: 20rpx;
}
.tag {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 999rpx;
  padding: 8rpx 16rpx;
  font-size: 22rpx;
  color: #01579b;
  border: 1rpx solid #b3e5fc;
}
.hint {
  margin-top: 12rpx;
  font-size: 22rpx;
  color: #78909c;
}
.empty-bench {
  text-align: center;
  color: #78909c;
}
.empty-bench__icon {
  font-size: 64rpx;
  display: block;
  margin-bottom: 12rpx;
}
.sec-head {
  margin-top: 8rpx;
}
.sec-title {
  font-size: 30rpx;
  font-weight: 800;
  color: #01579b;
}
.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16rpx;
}
.card {
  background: rgba(255, 255, 255, 0.92);
  border-radius: 20rpx;
  padding: 20rpx;
  border: 2rpx solid #b3e5fc;
}
.card.locked {
  filter: grayscale(0.8);
  opacity: 0.75;
}
.card__swatch {
  height: 80rpx;
  border-radius: 16rpx;
  margin-bottom: 12rpx;
}
.card__name {
  display: block;
  font-size: 26rpx;
  font-weight: 800;
  color: #01579b;
}
.card__meta {
  display: block;
  font-size: 20rpx;
  color: #78909c;
  margin-top: 4rpx;
}
.list {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}
.row {
  display: flex;
  gap: 16rpx;
  align-items: center;
  background: rgba(255, 255, 255, 0.92);
  border-radius: 16rpx;
  padding: 16rpx;
  border: 2rpx solid #b3e5fc;
}
.row__swatch {
  width: 64rpx;
  height: 64rpx;
  border-radius: 50%;
}
.row__title {
  display: block;
  font-size: 26rpx;
  color: #01579b;
  font-weight: 700;
}
.row__date {
  font-size: 22rpx;
  color: #90a4ae;
}
.empty {
  text-align: center;
  color: #90a4ae;
  font-size: 26rpx;
  padding: 40rpx;
}
.safety {
  position: fixed;
  right: 16rpx;
  bottom: calc(12rpx + var(--safe-bottom));
  z-index: 5;
  font-size: 18rpx;
  color: #90a4ae;
  max-width: 70%;
  text-align: right;
  pointer-events: none;
}
.modal {
  position: fixed;
  inset: 0;
  background: rgba(1, 87, 155, 0.45);
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40rpx;
}
.modal__box {
  width: 100%;
  max-width: 640rpx;
  background: #fff;
  border-radius: 28rpx;
  padding: 36rpx;
  box-shadow: 0 24rpx 60rpx rgba(1, 87, 155, 0.3);
}
.modal__eyebrow {
  display: block;
  font-size: 24rpx;
  color: #0288d1;
  margin-bottom: 8rpx;
}
.modal__title {
  display: block;
  font-size: 36rpx;
  font-weight: 800;
  color: #01579b;
  margin-bottom: 16rpx;
}
.modal__body {
  display: block;
  font-size: 28rpx;
  line-height: 1.55;
  color: #37474f;
  white-space: pre-wrap;
}
.modal__body.tip {
  margin-top: 16rpx;
  padding: 16rpx;
  background: #e1f5fe;
  border-radius: 16rpx;
  font-size: 26rpx;
}
.modal__btn {
  margin-top: 28rpx;
  background: linear-gradient(135deg, #0288d1, #29b6f6);
  color: #fff;
  text-align: center;
  padding: 20rpx;
  border-radius: 16rpx;
  font-weight: 800;
}
.modal__btn.ghost {
  background: #e3f2fd;
  color: #0277bd;
}
.modal__actions {
  display: flex;
  gap: 16rpx;
}
.modal__actions .modal__btn {
  flex: 1;
}
.detail-swatch {
  height: 120rpx;
  border-radius: 20rpx;
  margin-bottom: 16rpx;
}
.share-canvas {
  position: fixed;
  left: -9999px;
  top: 0;
  width: 360px;
  height: 480px;
}
</style>
