<template>
  <view class="act">
    <text class="act__title">{{ activity.title }}</text>
    <text class="act__hint">{{ activity.instruction }}</text>

    <!-- 硬度划痕实验 -->
    <view v-if="activity.mode === 'scratch'" class="lab">
      <text class="lab__intro">用不同工具划一划「{{ activity.mineral }}」，看谁能在它身上留下痕迹？</text>
      <view class="stage">
        <view class="mineral" :style="{ background: activity.outerColor || '#DDD' }">
          <view v-for="(m, i) in marks" :key="i" class="scratch" :style="{ left: 18 + i * 22 + '%' }" />
          <text class="mineral__name">{{ activity.mineral }}</text>
        </view>
      </view>
      <view class="tools">
        <view
          v-for="tool in scratchTools"
          :key="tool.id"
          class="tool"
          :class="{ used: tool.used }"
          @click="useTool(tool)"
        >
          <text class="tool__icon">{{ tool.icon }}</text>
          <text class="tool__label">{{ tool.label }}</text>
        </view>
      </view>
      <text v-if="scratchMsg" class="lab__msg">{{ scratchMsg }}</text>
      <view v-if="scratchDone">
        <text class="conclusion">{{ activity.conclusion }}</text>
        <KButton label="实验完成 ✓" block :color="color" @click="done" />
      </view>
    </view>

    <!-- 条痕色实验 -->
    <view v-else-if="activity.mode === 'streak'" class="lab">
      <text class="lab__intro">把「{{ activity.mineral }}」在白瓷板上擦一擦，看看会留下什么颜色？</text>
      <view class="stage">
        <view class="plate" @touchstart="onStreakStart" @touchmove="onStreakMove" @mousedown="onStreakStart" @mousemove="onStreakMove">
          <view class="streak-line" :style="{ background: activity.streakColor, width: streakPct + '%' }" />
          <text v-if="streakPct < 20" class="plate__tip">按住矿物拖到瓷板上擦一擦 →</text>
        </view>
        <view
          class="chunk"
          :style="{ background: activity.outerColor, left: chunkX + '%' }"
          @touchstart="onStreakStart"
          @mousedown="onStreakStart"
        />
      </view>
      <view v-if="streakPct >= 100" class="streak-result">
        <text class="lab__msg">外表是{{ outerColorName }}，擦出来的条痕却是另一种颜色！</text>
        <text class="conclusion">{{ activity.conclusion }}</text>
        <KButton label="发现秘密啦 ✓" block :color="color" @click="done" />
      </view>
    </view>

    <!-- 火山冷却实验 -->
    <view v-else class="lab">
      <text class="lab__intro">岩浆小火车出发啦！你选择让它「快点冷却」还是「慢慢冷却」？</text>
      <view class="stage stage--volcano">
        <text class="volcano-icon">🌋</text>
        <view v-if="volcanoChoice" class="lava" :class="volcanoChoice">
          <text class="lava__rock">{{ volcanoChoice === 'fast' ? '⚫' : '🩶' }}</text>
          <text class="lava__name">{{ volcanoChoice === 'fast' ? '黑曜石' : '花岗岩' }}</text>
        </view>
      </view>
      <view v-if="!volcanoChoice" class="choice-row">
        <view class="choice" @click="chooseVolcano('fast')">
          <text class="choice__icon">💨</text>
          <text class="choice__label">喷出地面\n快速冷却</text>
        </view>
        <view class="choice" @click="chooseVolcano('slow')">
          <text class="choice__icon">🐌</text>
          <text class="choice__label">留在地下\n慢慢冷却</text>
        </view>
      </view>
      <view v-else>
        <text class="conclusion">{{ activity.conclusion }}</text>
        <KButton label="实验完成 ✓" block :color="color" @click="done" />
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { RockLabActivity } from '../../engine/types'
import { speak, unlockSpeak } from '../../utils/tts'
import { playSfx } from '../../utils/sfx'
import KButton from '../ui/KButton.vue'

const props = defineProps<{ activity: RockLabActivity; color?: string; tts?: boolean }>()
const emit = defineEmits<{ done: [score: { correct: number; total: number }] }>()

/* scratch */
interface Tool {
  id: string
  icon: string
  label: string
  power: 1 | 2 | 3
  used: boolean
}
const scratchTools = ref<Tool[]>([
  { id: 'nail', icon: '💅', label: '指甲', power: 1, used: false },
  { id: 'coin', icon: '🪙', label: '硬币', power: 2, used: false },
  { id: 'knife', icon: '🔪', label: '小刀', power: 3, used: false },
])
const marks = ref<number[]>([])
const scratchMsg = ref('')

const hardness = computed(() => props.activity.hardness || 2)
const scratchDone = computed(() => scratchTools.value.every((t) => t.used))

function useTool(tool: Tool) {
  unlockSpeak()
  if (tool.used) {
    playSfx('tap')
    return
  }
  tool.used = true
  const canScratch = tool.power >= hardness.value
  if (canScratch) {
    marks.value.push(marks.value.length)
    playSfx('correct')
    scratchMsg.value = `${tool.label}划动了！留下了痕迹。`
  } else {
    playSfx('wrong')
    scratchMsg.value = `${tool.label}划不动，这块石头更硬。`
  }
  if (props.tts !== false) speak(scratchMsg.value)
}

/* streak */
const streakPct = ref(0)
const chunkX = ref(5)
let streakActive = false

const outerColorName = computed(() => {
  const c = (props.activity.outerColor || '').toUpperCase()
  if (c.includes('D4AF37')) return '金色'
  if (c.includes('1B2631') || c.includes('000')) return '黑色'
  if (c.includes('FFF') || c.includes('FFFFFF')) return '白色'
  return '彩色'
})

function onStreakStart(e: unknown) {
  unlockSpeak()
  streakActive = true
  onStreakMove(e)
}
function onStreakMove(e: unknown) {
  if (!streakActive || streakPct.value >= 100) return
  streakPct.value = Math.min(100, streakPct.value + 9)
  chunkX.value = Math.min(70, chunkX.value + 6)
  if (streakPct.value >= 100) {
    playSfx('star')
    if (props.tts !== false) speak(props.activity.conclusion)
  } else if (streakPct.value % 27 === 0) {
    playSfx('tap')
  }
}

/* volcano */
const volcanoChoice = ref<'' | 'fast' | 'slow'>('')

function chooseVolcano(c: 'fast' | 'slow') {
  unlockSpeak()
  volcanoChoice.value = c
  playSfx('correct')
  if (props.tts !== false) {
    speak(c === 'fast' ? '岩浆喷出地面，冷得飞快，变成了黑曜石！' : '岩浆躲在地下慢慢冷却，长出了大晶体，变成花岗岩！')
  }
}

function done() {
  emit('done', { correct: 1, total: 1 })
}
</script>

<style scoped lang="scss">
.act__title {
  display: block;
  font-size: 40rpx;
  font-weight: 800;
  margin-bottom: 8rpx;
  color: var(--color-ink);
}
.act__hint {
  display: block;
  font-size: 26rpx;
  color: var(--color-muted);
  margin-bottom: 16rpx;
}
.lab {
  background: #fff;
  border-radius: var(--radius-lg);
  padding: 28rpx;
  box-shadow: var(--shadow-soft);
}
.lab__intro {
  display: block;
  font-size: 28rpx;
  color: var(--color-ink-soft);
  margin-bottom: 20rpx;
}
.lab__msg {
  display: block;
  text-align: center;
  font-size: 28rpx;
  font-weight: 700;
  color: var(--color-ink);
  margin: 16rpx 0;
}
.stage {
  min-height: 220rpx;
  background: linear-gradient(180deg, #efe6d8, #fff8ee);
  border-radius: var(--radius-md);
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20rpx;
  padding: 20rpx;
}
.stage--volcano {
  flex-direction: column;
  gap: 12rpx;
}
.mineral {
  width: 60%;
  height: 160rpx;
  border-radius: 40% 45% 42% 48%;
  border: 4rpx solid var(--color-ink);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}
.mineral__name {
  font-size: 28rpx;
  font-weight: 800;
  color: var(--color-ink);
  text-shadow: 0 0 8rpx #fff;
}
.scratch {
  position: absolute;
  top: 20%;
  width: 6rpx;
  height: 60%;
  background: rgba(44, 36, 22, 0.55);
  border-radius: 4rpx;
  transform: rotate(12deg);
}
.tools {
  display: flex;
  justify-content: center;
  gap: 24rpx;
}
.tool {
  background: var(--color-cream);
  border-radius: var(--radius-md);
  padding: 20rpx 28rpx;
  text-align: center;
  border: 4rpx solid transparent;
}
.tool.used {
  opacity: 0.5;
  border-color: #e8dcc8;
}
.tool__icon {
  display: block;
  font-size: 56rpx;
}
.tool__label {
  font-size: 24rpx;
  color: var(--color-ink-soft);
}
.plate {
  width: 80%;
  height: 120rpx;
  background: #fff;
  border: 4rpx solid #e8dcc8;
  border-radius: var(--radius-sm);
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  padding: 0 16rpx;
}
.plate__tip {
  font-size: 24rpx;
  color: var(--color-muted);
  margin: 0 auto;
}
.streak-line {
  height: 24rpx;
  border-radius: 12rpx;
  transition: width 0.15s;
}
.chunk {
  position: absolute;
  bottom: 12rpx;
  width: 72rpx;
  height: 72rpx;
  border-radius: 40% 45% 42% 48%;
  border: 4rpx solid var(--color-ink);
  transition: left 0.15s;
}
.streak-result {
  margin-top: 8rpx;
}
.volcano-icon {
  font-size: 96rpx;
}
.lava {
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: bounce-in 0.5s ease;
}
.lava__rock {
  font-size: 72rpx;
}
.lava__name {
  font-size: 32rpx;
  font-weight: 800;
  color: var(--color-ink);
}
.choice-row {
  display: flex;
  gap: 24rpx;
  justify-content: center;
}
.choice {
  flex: 1;
  background: var(--color-cream);
  border-radius: var(--radius-md);
  padding: 28rpx 16rpx;
  text-align: center;
  border: 4rpx solid #f5ebd8;
}
.choice:active {
  transform: scale(0.97);
}
.choice__icon {
  display: block;
  font-size: 56rpx;
  margin-bottom: 8rpx;
}
.choice__label {
  font-size: 26rpx;
  font-weight: 700;
  color: var(--color-ink);
  white-space: pre-line;
}
.conclusion {
  display: block;
  margin: 16rpx 0 20rpx;
  font-size: 28rpx;
  font-weight: 700;
  color: var(--c, #26a69a);
  text-align: center;
}
</style>
