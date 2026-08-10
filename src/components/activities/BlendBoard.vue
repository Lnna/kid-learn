<template>
  <view class="act">
    <text class="act__title">{{ activity.title }}</text>
    <text class="act__hint">{{ activity.instruction }}</text>
    <view class="blend-card">
      <view class="parts">
        <view
          v-for="(p, i) in current.parts"
          :key="i"
          class="part"
          :class="{ on: revealed > i }"
          @click="revealTo(i)"
        >
          <text class="part__text">{{ p }}</text>
        </view>
      </view>
      <text class="plus">→</text>
      <view class="result" :class="{ show: revealed >= current.parts.length }" @click="sayResult">
        <text class="result__text">{{ current.result }}</text>
      </view>
    </view>
    <view class="tools">
      <KButton label="再拼一次" variant="soft" size="sm" @click="reset" />
      <KButton
        v-if="revealed >= current.parts.length"
        label="下一个"
        size="sm"
        :color="color"
        @click="next"
      />
    </view>
    <text class="progress">{{ idx + 1 }} / {{ activity.items.length }}</text>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { BlendActivity } from '../../engine/types'
import { speak, getLessonSpeakLang } from '../../utils/tts'
import { playSfx } from '../../utils/sfx'
import KButton from '../ui/KButton.vue'

const props = defineProps<{ activity: BlendActivity; color?: string; tts?: boolean }>()
const emit = defineEmits<{ done: [score: { correct: number; total: number }] }>()

const idx = ref(0)
const revealed = ref(0)
const done = ref(0)
const current = computed(() => props.activity.items[idx.value])

watch(
  () => props.activity.id,
  () => {
    idx.value = 0
    revealed.value = 0
    done.value = 0
  }
)

function revealTo(i: number) {
  if (i > revealed.value) return
  if (i === revealed.value) {
    revealed.value++
    playSfx('tap')
    if (props.tts !== false) {
      // 有 speakLang / 英文课 → 英文；否则交 resolveLang（语文拼音走中文/本地预录）
      const lang = current.value.speakLang || getLessonSpeakLang()
      // 拼读部件保持字面（c-a-t），勿扩成字母名 see-ay-tee
      speak(
        current.value.parts[i],
        lang ? { lang, rate: 0.7, keepLetterLiteral: true } : { rate: 0.7, keepLetterLiteral: true }
      )
    }
    if (revealed.value >= current.value.parts.length) {
      setTimeout(sayResult, 300)
    }
  }
}

function sayResult() {
  playSfx('correct')
  if (props.tts !== false) {
    const lang = current.value.speakLang || getLessonSpeakLang()
    speak(current.value.speak || current.value.result, lang ? { lang } : undefined)
  }
}

function reset() {
  revealed.value = 0
}

function next() {
  done.value++
  if (idx.value < props.activity.items.length - 1) {
    idx.value++
    revealed.value = 0
  } else {
    emit('done', { correct: done.value, total: props.activity.items.length })
  }
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
  margin-bottom: 24rpx;
}
.blend-card {
  background: #fff;
  border-radius: var(--radius-lg);
  padding: 40rpx 24rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16rpx;
  flex-wrap: wrap;
  box-shadow: var(--shadow-soft);
  margin-bottom: 28rpx;
}
.parts {
  display: flex;
  gap: 12rpx;
}
.part {
  width: 100rpx;
  height: 100rpx;
  border-radius: var(--radius-md);
  background: #fff8ee;
  border: 4rpx dashed #e8dcc8;
  display: flex;
  align-items: center;
  justify-content: center;
}
.part.on {
  background: #eef6ff;
  border-style: solid;
  border-color: var(--color-english);
}
.part__text {
  font-size: 40rpx;
  font-weight: 800;
}
.plus {
  font-size: 40rpx;
  color: var(--color-muted);
}
.result {
  min-width: 140rpx;
  height: 100rpx;
  border-radius: var(--radius-md);
  background: #f5ebd8;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.35;
}
.result.show {
  opacity: 1;
  background: #e8fff3;
  border: 4rpx solid var(--color-success);
  animation: bounce-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.result__text {
  font-size: 48rpx;
  font-weight: 800;
}
.tools {
  display: flex;
  gap: 16rpx;
  justify-content: center;
  margin-bottom: 16rpx;
}
.progress {
  display: block;
  text-align: center;
  color: var(--color-muted);
  font-size: 26rpx;
}
</style>
