<template>
  <view class="act">
    <text class="act__title">{{ activity.title }}</text>
    <text class="act__hint">{{ activity.instruction }}</text>
    <view class="lab-card">
      <text class="lab-title">{{ activity.lab.title }}</text>
      <text class="lab-intro">{{ activity.lab.intro }}</text>
      <view class="scene" :class="'scene--' + activity.lab.scene">
        <view v-if="activity.lab.scene === 'float'" class="tank">
          <view class="water" />
          <view
            v-for="obj in floatObjs"
            :key="obj.id"
            class="floater"
            :class="{ sunk: obj.sunk, chosen: obj.id === activeId }"
            :style="{ left: obj.x + '%' }"
            @click="toggleFloat(obj)"
          >{{ obj.icon }}</view>
        </view>
        <view v-else-if="activity.lab.scene === 'magnet'" class="magnet-box">
          <view class="magnet" @click="waveMagnet">🧲</view>
          <view class="items">
            <view
              v-for="it in magnetItems"
              :key="it.id"
              class="m-item"
              :class="{ stuck: it.stuck }"
              @click="tryMagnet(it)"
            >{{ it.icon }}</view>
          </view>
        </view>
        <view v-else-if="activity.lab.scene === 'shadow'" class="shadow-box">
          <view class="sun" :style="{ left: sunPos + '%' }" @click="moveSun">☀️</view>
          <view class="obj">🌲</view>
          <view class="shadow" :style="{ width: shadowW + 'rpx', transform: 'skewX(' + shadowSkew + 'deg)' }" />
        </view>
        <view v-else-if="activity.lab.scene === 'sound'" class="sound-box" @click="ping">
          <text class="drum">🥁</text>
          <view class="waves" :class="{ on: waving }" />
          <text class="sound-tip">点鼓听振动</text>
        </view>
        <view v-else-if="activity.lab.scene === 'water'" class="water-states">
          <view
            v-for="s in waterStates"
            :key="s.id"
            class="w-state"
            :class="{ on: waterOn === s.id }"
            @click="setWater(s.id)"
          >
            <text class="w-icon">{{ s.icon }}</text>
            <text>{{ s.label }}</text>
          </view>
        </view>
        <view v-else class="dissolve-box">
          <view class="cup">🥤</view>
          <view class="powders">
            <view
              v-for="p in powders"
              :key="p.id"
              class="powder"
              :class="{ dropped: p.dropped }"
              @click="dropPowder(p)"
            >{{ p.icon }} {{ p.label }}</view>
          </view>
          <text class="dissolve-tip">{{ dissolveTip }}</text>
        </view>
      </view>
      <view class="steps">
        <view
          v-for="(st, i) in activity.lab.steps"
          :key="st.id"
          class="step"
          :class="{ done: stepDone > i }"
          @click="doStep(i)"
        >
          <text>{{ i + 1 }}. {{ st.label }}</text>
        </view>
      </view>
      <text v-if="stepDone >= activity.lab.steps.length" class="conclusion">
        {{ activity.lab.conclusion }}
      </text>
    </view>
    <KButton
      v-if="stepDone >= activity.lab.steps.length"
      label="实验完成 ✓"
      block
      :color="color"
      @click="emit('done', { correct: 1, total: 1 })"
    />
  </view>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import type { MiniLabActivity } from '../../engine/types'
import { playSfx } from '../../utils/sfx'
import { speak, unlockSpeak } from '../../utils/tts'
import KButton from '../ui/KButton.vue'

const props = defineProps<{ activity: MiniLabActivity; color?: string; tts?: boolean }>()
const emit = defineEmits<{ done: [score: { correct: number; total: number }] }>()

const stepDone = ref(0)
const activeId = ref('')
const sunPos = ref(20)
const shadowW = ref(80)
const shadowSkew = ref(-20)
const waving = ref(false)
const waterOn = ref('ice')
const dissolveTip = ref('把粉末丢进杯子看看')

onMounted(() => {
  const intro = props.activity.lab.intro?.trim()
  if (props.tts !== false && intro) {
    setTimeout(() => speak(intro, { silent: true }), 400)
  }
})

const floatObjs = reactive([
  { id: 'wood', icon: '🪵', sunk: false, x: 15 },
  { id: 'stone', icon: '🪨', sunk: true, x: 45 },
  { id: 'apple', icon: '🍎', sunk: false, x: 75 },
])

const magnetItems = reactive([
  { id: 'key', icon: '🔑', metal: true, stuck: false },
  { id: 'paper', icon: '📄', metal: false, stuck: false },
  { id: 'clip', icon: '📎', metal: true, stuck: false },
  { id: 'eraser', icon: '🧹', metal: false, stuck: false },
])

const waterStates = [
  { id: 'ice', icon: '🧊', label: '固态' },
  { id: 'water', icon: '💧', label: '液态' },
  { id: 'steam', icon: '💨', label: '气态' },
]

const powders = reactive([
  { id: 'salt', icon: '🧂', label: '盐', dissolves: true, dropped: false },
  { id: 'sand', icon: '🏖️', label: '沙', dissolves: false, dropped: false },
  { id: 'sugar', icon: '🍬', label: '糖', dissolves: true, dropped: false },
])

function doStep(i: number) {
  if (i !== stepDone.value) return
  unlockSpeak()
  stepDone.value++
  playSfx('tap')
  const st = props.activity.lab.steps[i]
  if (props.tts !== false) speak(st.label)
}

function toggleFloat(obj: (typeof floatObjs)[0]) {
  unlockSpeak()
  activeId.value = obj.id
  playSfx('tap')
  if (props.tts !== false) speak(obj.sunk ? '沉下去了' : '浮起来了')
}

function waveMagnet() {
  playSfx('tap')
}

function tryMagnet(it: (typeof magnetItems)[0]) {
  if (it.metal) {
    it.stuck = true
    playSfx('correct')
    if (props.tts !== false) speak('吸住了，这是金属')
  } else {
    playSfx('wrong')
    if (props.tts !== false) speak('吸不住哦')
  }
}

function moveSun() {
  sunPos.value = sunPos.value >= 70 ? 20 : sunPos.value + 25
  shadowSkew.value = sunPos.value < 40 ? -25 : sunPos.value < 60 ? 0 : 25
  shadowW.value = sunPos.value < 40 || sunPos.value > 60 ? 120 : 60
  playSfx('tap')
}

function ping() {
  waving.value = true
  playSfx('star')
  setTimeout(() => (waving.value = false), 600)
  if (props.tts !== false) speak('声音是振动产生的')
}

function setWater(id: string) {
  waterOn.value = id
  playSfx('tap')
  const map: Record<string, string> = { ice: '冰是固态的水', water: '水是液态', steam: '水蒸气是气态' }
  if (props.tts !== false) speak(map[id])
}

function dropPowder(p: (typeof powders)[0]) {
  p.dropped = true
  dissolveTip.value = p.dissolves ? `${p.label}溶解了！` : `${p.label}没有溶解`
  playSfx(p.dissolves ? 'correct' : 'wrong')
  if (props.tts !== false) speak(dissolveTip.value)
}
</script>

<style scoped lang="scss">
.act__title {
  display: block;
  font-size: 40rpx;
  font-weight: 800;
  margin-bottom: 8rpx;
}
.act__hint {
  display: block;
  font-size: 26rpx;
  color: var(--color-muted);
  margin-bottom: 20rpx;
}
.lab-card {
  background: #fff;
  border-radius: var(--radius-lg);
  padding: 28rpx;
  box-shadow: var(--shadow-soft);
  margin-bottom: 24rpx;
}
.lab-title {
  display: block;
  font-size: 34rpx;
  font-weight: 800;
  margin-bottom: 8rpx;
}
.lab-intro {
  display: block;
  font-size: 26rpx;
  color: var(--color-ink-soft);
  margin-bottom: 20rpx;
}
.scene {
  min-height: 240rpx;
  background: linear-gradient(180deg, #e8f4ff, #fff8ee);
  border-radius: var(--radius-md);
  margin-bottom: 20rpx;
  position: relative;
  overflow: hidden;
  padding: 20rpx;
}
.tank {
  position: relative;
  height: 220rpx;
}
.water {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 55%;
  background: rgba(77, 163, 255, 0.35);
  border-radius: 0 0 var(--radius-md) var(--radius-md);
}
.floater {
  position: absolute;
  font-size: 48rpx;
  bottom: 50%;
  transition: bottom 0.4s;
}
.floater.sunk {
  bottom: 8%;
}
.floater.chosen {
  transform: scale(1.2);
}
.magnet-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20rpx;
}
.magnet {
  font-size: 64rpx;
}
.items {
  display: flex;
  gap: 20rpx;
  flex-wrap: wrap;
  justify-content: center;
}
.m-item {
  font-size: 48rpx;
  padding: 12rpx;
  background: #fff;
  border-radius: 16rpx;
}
.m-item.stuck {
  transform: translateY(-40rpx);
  filter: drop-shadow(0 0 8rpx #ff6b6b);
}
.shadow-box {
  height: 200rpx;
  position: relative;
}
.sun {
  position: absolute;
  top: 10rpx;
  font-size: 48rpx;
  transition: left 0.3s;
}
.obj {
  position: absolute;
  bottom: 40rpx;
  left: 45%;
  font-size: 56rpx;
}
.shadow {
  position: absolute;
  bottom: 20rpx;
  left: 48%;
  height: 16rpx;
  background: rgba(44, 36, 22, 0.25);
  border-radius: 50%;
  transition: all 0.3s;
}
.sound-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12rpx;
  padding: 24rpx;
}
.drum {
  font-size: 72rpx;
}
.waves {
  width: 40rpx;
  height: 40rpx;
  border: 4rpx solid var(--color-science);
  border-radius: 50%;
  opacity: 0;
}
.waves.on {
  animation: pulse-soft 0.6s ease;
  opacity: 1;
}
.water-states {
  display: flex;
  justify-content: space-around;
  padding: 20rpx 0;
}
.w-state {
  text-align: center;
  padding: 16rpx;
  border-radius: var(--radius-md);
  background: #fff;
  opacity: 0.6;
}
.w-state.on {
  opacity: 1;
  box-shadow: var(--shadow-pop);
}
.w-icon {
  display: block;
  font-size: 48rpx;
}
.dissolve-box {
  text-align: center;
}
.cup {
  font-size: 72rpx;
}
.powders {
  display: flex;
  gap: 12rpx;
  justify-content: center;
  flex-wrap: wrap;
  margin: 16rpx 0;
}
.powder {
  background: #fff;
  padding: 12rpx 20rpx;
  border-radius: 999rpx;
  font-size: 26rpx;
  border: 3rpx solid #f5ebd8;
}
.powder.dropped {
  opacity: 0.4;
}
.steps {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}
.step {
  padding: 16rpx 20rpx;
  background: #fff8ee;
  border-radius: var(--radius-sm);
  font-size: 28rpx;
  border: 3rpx dashed #e8dcc8;
}
.step.done {
  background: #e8fff3;
  border-style: solid;
  border-color: var(--color-success);
}
.conclusion {
  display: block;
  margin-top: 16rpx;
  font-size: 28rpx;
  font-weight: 700;
  color: var(--color-science);
  text-align: center;
}
</style>
