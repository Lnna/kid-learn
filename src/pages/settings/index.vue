<template>
  <view class="settings">
    <view class="settings__inner">
      <text class="back" @click="goBack">← 返回</text>
      <text class="title">设置</text>

      <view class="row" @click="toggleTts">
        <view>
          <text class="row__label">语音朗读</text>
          <text class="row__hint">点读、听音时播放发音</text>
        </view>
        <text class="switch">{{ tts ? '开' : '关' }}</text>
      </view>

      <view class="row" @click="toggleSfx">
        <view>
          <text class="row__label">音效</text>
          <text class="row__hint">答对答错的提示音</text>
        </view>
        <text class="switch">{{ sfx ? '开' : '关' }}</text>
      </view>

      <view class="row" @click="testSpeak">
        <view>
          <text class="row__label">测试发音</text>
          <text class="row__hint">点我听「你好」。安卓需联网或安装中文语音引擎</text>
        </view>
        <text class="switch">试听</text>
      </view>

      <view class="row danger" @click="onReset">
        <view>
          <text class="row__label">重置学习进度</text>
          <text class="row__hint">清除所有星星与通关记录</text>
        </view>
        <text class="switch">清空</text>
      </view>

      <view class="about">
        <text class="about__title">小小衔</text>
        <text class="about__text">幼小衔接自学 · 语文 / 数学 / 英语 / 自然 / 科学</text>
        <text class="about__text">版本 1.0.0 · 纯离线可用</text>
        <text class="about__tip">小米等安卓机：设置 → 更多设置 → 无障碍 → 文字转语音输出，安装「Google 文字转语音」或系统中文引擎；点读时请保持网络畅通（安卓会走在线发音兜底）。</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { loadProgress, updateSettings, resetProgress } from '../../engine/progress'
import { setSfxEnabled } from '../../utils/sfx'
import { speak, unlockSpeak, getTtsDebugInfo } from '../../utils/tts'

const tts = ref(true)
const sfx = ref(true)

function refresh() {
  const s = loadProgress().settings
  tts.value = s.ttsEnabled
  sfx.value = s.sfxEnabled
  setSfxEnabled(s.sfxEnabled)
}

function toggleTts() {
  tts.value = !tts.value
  updateSettings({ ttsEnabled: tts.value })
}

function toggleSfx() {
  sfx.value = !sfx.value
  updateSettings({ sfxEnabled: sfx.value })
  setSfxEnabled(sfx.value)
}

function testSpeak() {
  unlockSpeak()
  speak('你好')
  console.log('[tts-debug]', getTtsDebugInfo())
}

function onReset() {
  uni.showModal({
    title: '确认重置？',
    content: '将清除所有科目的学习进度，不可恢复。',
    success(res) {
      if (res.confirm) {
        resetProgress()
        uni.showToast({ title: '已重置', icon: 'success' })
      }
    },
  })
}

function goBack() {
  uni.navigateBack()
}

onShow(refresh)
</script>

<style scoped lang="scss">
.settings {
  min-height: 100vh;
  background: var(--color-cream);
  padding: calc(16rpx + var(--safe-top)) 24rpx calc(40rpx + var(--safe-bottom));
}
.settings__inner {
  max-width: var(--content-max);
  margin: 0 auto;
}
.back {
  font-size: 28rpx;
  color: var(--color-ink-soft);
}
.title {
  display: block;
  font-size: 48rpx;
  font-weight: 900;
  margin: 12rpx 0 28rpx;
}
.row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fff;
  border-radius: var(--radius-md);
  padding: 28rpx;
  margin-bottom: 16rpx;
  box-shadow: var(--shadow-soft);
}
.row.danger .row__label {
  color: var(--color-error);
}
.row__label {
  display: block;
  font-size: 30rpx;
  font-weight: 700;
}
.row__hint {
  display: block;
  font-size: 22rpx;
  color: var(--color-muted);
  margin-top: 4rpx;
}
.switch {
  font-size: 28rpx;
  font-weight: 800;
  color: var(--color-math);
  min-width: 80rpx;
  text-align: right;
}
.about {
  margin-top: 48rpx;
  text-align: center;
}
.about__title {
  display: block;
  font-size: 36rpx;
  font-weight: 800;
  margin-bottom: 8rpx;
}
.about__text {
  display: block;
  font-size: 24rpx;
  color: var(--color-muted);
  margin-top: 4rpx;
}
.about__tip {
  display: block;
  margin-top: 20rpx;
  font-size: 22rpx;
  color: var(--color-muted);
  line-height: 1.5;
  text-align: left;
  padding: 0 12rpx;
}
</style>
