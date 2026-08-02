<template>
  <view class="renderer">
    <TapRead
      v-if="activity.type === 'tap-read'"
      :activity="activity"
      :color="color"
      :tts="tts"
      @done="onDone"
    />
    <ListenChoose
      v-else-if="activity.type === 'listen-choose'"
      :activity="activity"
      :color="color"
      :tts="tts"
      :subject-id="subjectId"
      :level-id="levelId"
      @done="onDone"
    />
    <DragMatch
      v-else-if="activity.type === 'drag-match'"
      :activity="activity"
      :color="color"
      @done="onDone"
    />
    <TracingPad
      v-else-if="activity.type === 'tracing'"
      :activity="activity"
      :color="color"
      :tts="tts"
      @done="onDone"
    />
    <BlendBoard
      v-else-if="activity.type === 'blend'"
      :activity="activity"
      :color="color"
      :tts="tts"
      @done="onDone"
    />
    <QuizPop
      v-else-if="activity.type === 'quiz'"
      :activity="activity"
      :color="color"
      :tts="tts"
      :subject-id="subjectId"
      :level-id="levelId"
      @done="onDone"
    />
    <SequenceFun
      v-else-if="activity.type === 'sequence'"
      :activity="activity"
      :color="color"
      :tts="tts"
      :subject-id="subjectId"
      :level-id="levelId"
      @done="onDone"
    />
    <MiniLab
      v-else-if="activity.type === 'mini-lab'"
      :activity="activity"
      :color="color"
      :tts="tts"
      @done="onDone"
    />
    <ReadAlong
      v-else-if="activity.type === 'read-along'"
      :activity="activity"
      :color="color"
      :tts="tts"
      @done="onDone"
    />
    <GridDig
      v-else-if="activity.type === 'grid-dig'"
      :activity="activity"
      :color="color"
      :tts="tts"
      @done="onDone"
    />
    <RockLab
      v-else-if="activity.type === 'rock-lab'"
      :activity="activity"
      :color="color"
      :tts="tts"
      @done="onDone"
    />
    <MovePlay
      v-else-if="activity.type === 'move-play'"
      :activity="activity"
      :color="color"
      :tts="tts"
      @done="onDone"
    />
  </view>
</template>

<script setup lang="ts">
import type { Activity, SubjectId } from './types'
import TapRead from '../components/activities/TapRead.vue'
import ListenChoose from '../components/activities/ListenChoose.vue'
import DragMatch from '../components/activities/DragMatch.vue'
import TracingPad from '../components/activities/TracingPad.vue'
import BlendBoard from '../components/activities/BlendBoard.vue'
import QuizPop from '../components/activities/QuizPop.vue'
import SequenceFun from '../components/activities/SequenceFun.vue'
import MiniLab from '../components/activities/MiniLab.vue'
import ReadAlong from '../components/activities/ReadAlong.vue'
import GridDig from '../components/activities/GridDig.vue'
import RockLab from '../components/activities/RockLab.vue'
import MovePlay from '../components/activities/MovePlay.vue'

defineProps<{
  activity: Activity
  color?: string
  tts?: boolean
  subjectId?: SubjectId
  levelId?: string
}>()
const emit = defineEmits<{ done: [score: { correct: number; total: number }] }>()

function onDone(score: { correct: number; total: number }) {
  emit('done', score)
}
</script>

<style scoped>
.renderer {
  width: 100%;
}
</style>
