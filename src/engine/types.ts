/** 课程数据 Schema */

export type SubjectId = 'chinese' | 'math' | 'english' | 'nature' | 'science'

export type ActivityType =
  | 'tap-read'
  | 'listen-choose'
  | 'drag-match'
  | 'tracing'
  | 'blend'
  | 'quiz'
  | 'sequence'
  | 'mini-lab'
  | 'read-along'

export interface TapReadItem {
  id: string
  label: string
  subLabel?: string
  speak?: string
  speakLang?: string
  icon?: string
  color?: string
}

export interface ChoiceOption {
  id: string
  label: string
  icon?: string
  speak?: string
}

export interface MatchPair {
  id: string
  left: string
  right: string
  leftIcon?: string
  rightIcon?: string
}

export interface TraceItem {
  id: string
  char: string
  hint?: string
  speak?: string
  grid?: 'tian' | 'pinyin' | 'english' | 'number'
}

export interface BlendItem {
  id: string
  parts: string[]
  result: string
  speak?: string
  speakLang?: string
}

export interface QuizItem {
  id: string
  question: string
  options: ChoiceOption[]
  answerId: string
  speak?: string
  explain?: string
}

export interface SequenceItem {
  id: string
  prompt: string
  items: ChoiceOption[]
  answerOrder: string[]
  speak?: string
}

export interface LabStep {
  id: string
  label: string
  action: string
}

export interface LabConfig {
  scene: 'float' | 'magnet' | 'shadow' | 'sound' | 'water' | 'dissolve'
  title: string
  intro: string
  steps: LabStep[]
  conclusion: string
}

export interface ReadAlongLine {
  id: string
  text: string
  speak?: string
  speakLang?: string
}

export interface ActivityBase {
  id: string
  type: ActivityType
  title: string
  instruction?: string
}

export interface TapReadActivity extends ActivityBase {
  type: 'tap-read'
  items: TapReadItem[]
}

export interface ListenChooseActivity extends ActivityBase {
  type: 'listen-choose'
  promptSpeak: string
  promptLang?: string
  promptLabel?: string
  options: ChoiceOption[]
  answerId: string
}

export interface DragMatchActivity extends ActivityBase {
  type: 'drag-match'
  pairs: MatchPair[]
}

export interface TracingActivity extends ActivityBase {
  type: 'tracing'
  items: TraceItem[]
}

export interface BlendActivity extends ActivityBase {
  type: 'blend'
  items: BlendItem[]
}

export interface QuizActivity extends ActivityBase {
  type: 'quiz'
  items: QuizItem[]
}

export interface SequenceActivity extends ActivityBase {
  type: 'sequence'
  items: SequenceItem[]
}

export interface MiniLabActivity extends ActivityBase {
  type: 'mini-lab'
  lab: LabConfig
}

export interface ReadAlongActivity extends ActivityBase {
  type: 'read-along'
  titleText: string
  lines: ReadAlongLine[]
}

export type Activity =
  | TapReadActivity
  | ListenChooseActivity
  | DragMatchActivity
  | TracingActivity
  | BlendActivity
  | QuizActivity
  | SequenceActivity
  | MiniLabActivity
  | ReadAlongActivity

export interface Level {
  id: string
  title: string
  subtitle?: string
  starsMax?: number
  activities: Activity[]
}

export interface Unit {
  id: string
  title: string
  subtitle?: string
  levels: Level[]
}

export interface Subject {
  id: SubjectId
  name: string
  emoji: string
  color: string
  mascot: string
  description: string
  units: Unit[]
}

export interface LevelProgress {
  stars: number
  bestStars: number
  completed: boolean
  attempts: number
  lastAt?: number
}

export interface SubjectProgress {
  levels: Record<string, LevelProgress>
  totalStars: number
  studyMinutes: number
}

export interface AppProgress {
  subjects: Record<SubjectId, SubjectProgress>
  settings: {
    ttsEnabled: boolean
    sfxEnabled: boolean
  }
}
