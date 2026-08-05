/** 课程数据 Schema */

export type SubjectId =
  | 'chinese'
  | 'math'
  | 'english'
  | 'nature'
  | 'science'
  | 'pe'
  | 'gem'
  | 'dino'
  | 'town'
  | 'princess'
  | 'vehicle'
  | 'slime'

/** 兴趣主题（基地里的门） */
export type ThemeId = 'gem' | 'dino' | 'town' | 'princess' | 'vehicle' | 'slime'

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
  | 'grid-dig'
  | 'rock-lab'
  | 'move-play'

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
  speakLang?: string
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

/* ── 主题课程专用活动 ── */

/** 坐标挖掘目标 */
export interface DigTarget {
  row: number
  col: number
  icon: string
  label: string
  speak?: string
}

export interface GridDigActivity extends ActivityBase {
  type: 'grid-dig'
  rows: number
  cols: number
  targets: DigTarget[]
  /** 场景皮肤：矿洞 / 化石坑 */
  scene: 'mine' | 'fossil'
  intro: string
}

/** 岩石实验：硬度划痕 / 条痕色 / 火山冷却 */
export type RockLabMode = 'scratch' | 'streak' | 'volcano'

export interface RockLabActivity extends ActivityBase {
  type: 'rock-lab'
  mode: RockLabMode
  /** 实验对象名，如「黄铁矿」 */
  mineral: string
  /** 外表颜色（streak 模式用） */
  outerColor?: string
  /** 条痕颜色（streak 模式用） */
  streakColor?: string
  /** 硬度档位 1软 2中 3硬（scratch 模式用） */
  hardness?: 1 | 2 | 3
  /** 实验结论 */
  conclusion: string
}

/** 体育课动作：倒计时或次数引导，孩子自评完成 */
export interface MovePlayItem {
  id: string
  name: string
  speak: string
  emoji: string
  durationSec?: number
  reps?: number
  tip: string
}

export interface MovePlayActivity extends ActivityBase {
  type: 'move-play'
  moves: MovePlayItem[]
  encourage?: string
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
  | GridDigActivity
  | RockLabActivity
  | MovePlayActivity

export interface Level {
  id: string
  title: string
  subtitle?: string
  starsMax?: number
  activities: Activity[]
  /** 通关解锁的图鉴 id（主题课程用） */
  rewards?: string[]
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

/* ── 图鉴收藏 ── */

/** 矿物图鉴 */
export interface MineralItem {
  id: string
  name: string
  /** 手绘 SVG 用的主色 */
  color: string
  /** 辅色/斑纹色 */
  accent?: string
  /** 形状：晶体 / 圆石 / 层状 */
  shape: 'crystal' | 'pebble' | 'layer'
  hardness: 1 | 2 | 3
  hardnessLabel: string
  streakColor: string
  facts: [string, string, string]
  origin: string
  /** 世界地图上的大致坐标（百分比） */
  mapX: number
  mapY: number
}

/** 恐龙图鉴 */
export interface DinoItem {
  id: string
  name: string
  color: string
  era: string
  diet: '植食' | '肉食'
  length: string
  facts: [string, string, string]
}

/** 小镇建筑图鉴 */
export interface TownItem {
  id: string
  name: string
  icon: string
  /** 手绘 SVG 用的主色 */
  color: string
  /** 建筑用途，如「给大家看病的地方」 */
  purpose: string
  facts: [string, string, string]
}

/** 公主图鉴 */
export interface PrincessItem {
  id: string
  name: string
  /** 代表色 */
  color: string
  /** 一句话故事 */
  story: string
  /** 品质，如「勇敢」「善良」 */
  quality: string
  facts: [string, string, string]
}

/** 工程车图鉴 */
export interface VehicleItem {
  id: string
  name: string
  icon: string
  /** 车身主色 */
  color: string
  /** 功能，如「挖土铲沙」 */
  function: string
  /** 数字参数，如铲斗容量、最高时速 */
  stat: { label: string; value: number; unit: string }
  facts: [string, string, string]
}

/** 图鉴存储 */
export interface CollectionState {
  unlocked: Record<ThemeId, string[]>
}
