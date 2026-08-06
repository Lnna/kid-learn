/** 二期变形学具：喂食阈值与文案 */

/** 累计喂入黄金饲料达到该值后解锁 toolsUnlocked */
export const FEED_TO_UNLOCK = 5

export const TOOL_META = {
  stretchRuler: {
    id: 'stretch-ruler',
    title: '拉伸数感尺',
    desc: '把小精灵拉长，对准刻度数字',
  },
  letterMorph: {
    id: 'letter-morph',
    title: '捏字母 / 捏数字',
    desc: '把小精灵捏成字母或数字形状，听发音',
  },
} as const

/** 学具试点关（嵌在关卡活动内；进关后按顺序出现） */
export const TOOL_PILOTS = [
  {
    tool: 'stretchRuler' as const,
    subjectId: 'math',
    levelId: 'math-1-01',
    unitTitle: '数感进阶',
    levelTitle: '快速复习 1～10',
    activityTitle: '精灵拉伸数到 5',
    buttonLabel: '去数学试玩拉伸尺',
  },
  {
    tool: 'letterMorph' as const,
    subjectId: 'math',
    levelId: 'math-1-01',
    unitTitle: '数感进阶',
    levelTitle: '快速复习 1～10',
    activityTitle: '捏一捏数字',
    buttonLabel: '去数学试玩捏数字',
  },
  {
    tool: 'letterMorph' as const,
    subjectId: 'chinese',
    levelId: 'chinese-0-01',
    unitTitle: '拼音入门',
    levelTitle: '单韵母朋友',
    activityTitle: '捏一捏单韵母',
    buttonLabel: '去拼音试玩捏字母',
  },
  {
    tool: 'letterMorph' as const,
    subjectId: 'english',
    levelId: 'english-1-01',
    unitTitle: '字母乐园',
    levelTitle: 'Letters A-E',
    activityTitle: '捏字母 A O',
    buttonLabel: '去英语试玩捏字母',
  },
] as const
