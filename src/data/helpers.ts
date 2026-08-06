import type {
  Activity,
  BlendActivity,
  DragMatchActivity,
  GridDigActivity,
  ListenChooseActivity,
  MiniLabActivity,
  MovePlayActivity,
  QuizActivity,
  ReadAlongActivity,
  RockLabActivity,
  SequenceActivity,
  SpiritLetterMorphActivity,
  SpiritStretchRulerActivity,
  TapReadActivity,
  TracingActivity,
  LabConfig,
  Level,
  Unit,
} from '../engine/types'

let seq = 0
const id = (p: string) => `${p}-${++seq}`

export function tapRead(
  title: string,
  items: TapReadActivity['items'],
  instruction = '点一点，听一听'
): TapReadActivity {
  return { id: id('tr'), type: 'tap-read', title, instruction, items }
}

export function listenChoose(
  title: string,
  promptSpeak: string,
  options: ListenChooseActivity['options'],
  answerId: string,
  extra: Partial<ListenChooseActivity> = {}
): ListenChooseActivity {
  return {
    id: id('lc'),
    type: 'listen-choose',
    title,
    instruction: '听声音，选出正确的答案',
    promptSpeak,
    options,
    answerId,
    ...extra,
  }
}

export function dragMatch(
  title: string,
  pairs: DragMatchActivity['pairs'],
  instruction = '把左边和右边配对'
): DragMatchActivity {
  return { id: id('dm'), type: 'drag-match', title, instruction, pairs }
}

export function tracing(
  title: string,
  items: TracingActivity['items'],
  instruction = '跟着虚线描一描'
): TracingActivity {
  return { id: id('tc'), type: 'tracing', title, instruction, items }
}

export function blend(
  title: string,
  items: BlendActivity['items'],
  instruction = '拼一拼，读一读'
): BlendActivity {
  return { id: id('bl'), type: 'blend', title, instruction, items }
}

export function quiz(
  title: string,
  items: QuizActivity['items'],
  instruction = '选出正确答案'
): QuizActivity {
  return { id: id('qz'), type: 'quiz', title, instruction, items }
}

export function sequence(
  title: string,
  items: SequenceActivity['items'],
  instruction = '按正确顺序排一排'
): SequenceActivity {
  return { id: id('sq'), type: 'sequence', title, instruction, items }
}

export function miniLab(title: string, lab: LabConfig, instruction?: string): MiniLabActivity {
  return {
    id: id('lab'),
    type: 'mini-lab',
    title,
    instruction: instruction || '动手试试看',
    lab,
  }
}

export function readAlong(
  title: string,
  titleText: string,
  lines: ReadAlongActivity['lines'],
  instruction = '点句子跟读'
): ReadAlongActivity {
  return { id: id('ra'), type: 'read-along', title, instruction, titleText, lines }
}

export function gridDig(
  title: string,
  scene: GridDigActivity['scene'],
  targets: GridDigActivity['targets'],
  intro: string,
  rows = 6,
  cols = 6
): GridDigActivity {
  return {
    id: id('gd'),
    type: 'grid-dig',
    title,
    instruction: '按行和列找到宝藏位置',
    rows,
    cols,
    targets,
    scene,
    intro,
  }
}

export function rockLab(
  title: string,
  mode: RockLabActivity['mode'],
  mineral: string,
  conclusion: string,
  extra: Partial<RockLabActivity> = {}
): RockLabActivity {
  return {
    id: id('rl'),
    type: 'rock-lab',
    title,
    instruction: '动手做实验',
    mode,
    mineral,
    conclusion,
    ...extra,
  }
}

export function movePlay(
  title: string,
  moves: MovePlayActivity['moves'],
  extra: Partial<Pick<MovePlayActivity, 'instruction' | 'encourage'>> = {}
): MovePlayActivity {
  return {
    id: id('mp'),
    type: 'move-play',
    title,
    instruction: extra.instruction || '跟着做动作，做完点一下',
    moves,
    encourage: extra.encourage,
  }
}

export function spiritStretchRuler(
  title: string,
  target: number,
  extra: Partial<Pick<SpiritStretchRulerActivity, 'instruction' | 'max'>> = {}
): SpiritStretchRulerActivity {
  return {
    id: id('ssr'),
    type: 'spirit-stretch-ruler',
    title,
    instruction: extra.instruction || '左右拖动，把小精灵拉到目标数字',
    target,
    max: extra.max ?? 10,
  }
}

export function spiritLetterMorph(
  title: string,
  letters: SpiritLetterMorphActivity['letters'],
  instruction = '拖一拖，松手捏成字母并听发音'
): SpiritLetterMorphActivity {
  return {
    id: id('slm'),
    type: 'spirit-letter-morph',
    title,
    instruction,
    letters,
  }
}

export function level(
  idStr: string,
  title: string,
  activities: Activity[],
  subtitle?: string,
  rewards?: string[]
): Level {
  return { id: idStr, title, subtitle, starsMax: 3, activities, rewards }
}

export function unit(idStr: string, title: string, levels: Level[], subtitle?: string): Unit {
  return { id: idStr, title, subtitle, levels }
}
