import type { Subject } from '../../engine/types'
import { tapRead, quiz, dragMatch, level, unit } from '../helpers'
import { getTip } from './tips'

const crosslinkIntro = getTip('tip-crosslink-basics')

const u1 = unit(
  'slime-1',
  '材料入门',
  [
    level(
      'slime-1-01',
      '认识基础胶体',
      [
        tapRead('两种胶水', [
          {
            id: 'white',
            label: '白胶',
            subLabel: '偏乳白、不太透光',
            speak: '白胶，看起来乳白乳白的，不太透明',
            icon: '🥛',
            color: '#FFF8E7',
          },
          {
            id: 'clear',
            label: '透明胶水',
            subLabel: '更透亮',
            speak: '透明胶水，看起来更透亮',
            icon: '💧',
            color: '#B3E5FC',
          },
        ]),
        quiz('胶体小测验', [
          {
            id: 'q1',
            question: '想做看起来更透亮的史莱姆，基础胶体选哪个？',
            speak: '想做看起来更透亮的史莱姆，基础胶体选哪个？',
            options: [
              { id: 'a', label: '白胶', icon: '🥛' },
              { id: 'b', label: '透明胶水', icon: '💧' },
            ],
            answerId: 'b',
            explain: '透明胶水透明度高；白胶更不透明。',
          },
          {
            id: 'q2',
            question: '白胶和透明胶水在游戏里主要影响什么？',
            speak: '白胶和透明胶水在游戏里主要影响什么？',
            options: [
              { id: 'a', label: '透明度', icon: '👀' },
              { id: 'b', label: '香味', icon: '👃' },
              { id: 'c', label: '磁性', icon: '🧲' },
            ],
            answerId: 'a',
            explain: '基础胶体决定透明度基础值。',
          },
        ]),
      ],
      '白胶不透明，透明胶更透亮'
    ),
    level(
      'slime-1-02',
      '交联剂与软硬',
      [
        tapRead('硼砂水的作用', [
          {
            id: 'c1',
            label: '交联',
            subLabel: '把长链分子拴成网',
            speak: '硼砂水能把胶水里的长链分子拴成一张网',
            icon: '🔗',
          },
          {
            id: 'c2',
            label: '滴数少',
            subLabel: '稀软、更流动',
            speak: '滴数少，交联少，史莱姆更稀软更流动',
            icon: '💧',
          },
          {
            id: 'c3',
            label: '滴数适中',
            subLabel: 'Q 弹最好',
            speak: '滴数适中，Q弹手感通常最好',
            icon: '🎾',
          },
          {
            id: 'c4',
            label: '滴数多',
            subLabel: '更硬更结实',
            speak: '滴数多，更硬更结实，交联太多还会变脆',
            icon: '🪨',
          },
        ]),
        quiz('软硬小测验', [
          {
            id: 'q1',
            question: '硼砂水加得很多时，史莱姆通常会怎样？',
            speak: '硼砂水加得很多时，史莱姆通常会怎样？',
            options: [
              { id: 'a', label: '更稀软', icon: '🌊' },
              { id: 'b', label: '更硬更结实', icon: '🪨' },
              { id: 'c', label: '自动发光', icon: '✨' },
            ],
            answerId: 'b',
            explain: crosslinkIntro.slice(0, 80) + '…',
          },
          {
            id: 'q2',
            question: 'Q 弹手感通常在什么时候最好？',
            speak: 'Q弹手感通常在什么时候最好？',
            options: [
              { id: 'a', label: '交联很少', icon: '💧' },
              { id: 'b', label: '交联适中', icon: '🎾' },
              { id: 'c', label: '交联越多越好', icon: '📈' },
            ],
            answerId: 'b',
            explain: '交联太多会变脆，弹性通常在适中时最好。',
          },
        ]),
      ],
      '交联像织网：适中最 Q，过多变硬脆'
    ),
    level(
      'slime-1-03',
      '添加剂特效',
      [
        dragMatch('添加剂配对', [
          { id: 'p1', left: '闪粉', right: '微小镜面反光', leftIcon: '✨', rightIcon: '🪞' },
          { id: 'p2', left: '夜光粉', right: '先存光再发光', leftIcon: '🌙', rightIcon: '💡' },
          { id: 'p3', left: '铁粉', right: '会被磁铁吸引', leftIcon: '⚙️', rightIcon: '🧲' },
          { id: 'p4', left: '珠光粉', right: '彩虹干涉色', leftIcon: '🌈', rightIcon: '🫧' },
          { id: 'p5', left: '香精', right: '分子扩散闻香', leftIcon: '🌸', rightIcon: '👃' },
        ]),
        quiz('特效小测验', [
          {
            id: 'q1',
            question: '想做能被磁铁微微拉动的史莱姆，该加什么？',
            speak: '想做能被磁铁微微拉动的史莱姆，该加什么？',
            options: [
              { id: 'a', label: '香精', icon: '🌸' },
              { id: 'b', label: '铁粉', icon: '⚙️' },
              { id: 'c', label: '闪粉', icon: '✨' },
            ],
            answerId: 'b',
            explain: '铁粉是铁磁性材料，会被磁铁吸引。',
          },
          {
            id: 'q2',
            question: '夜光粉为什么能在暗处发光？',
            speak: '夜光粉为什么能在暗处发光？',
            options: [
              { id: 'a', label: '自己制造能量', icon: '⚡' },
              { id: 'b', label: '先吸收光再慢慢放出', icon: '🔋' },
              { id: 'c', label: '因为加了硼砂水', icon: '💧' },
            ],
            answerId: 'b',
            explain: '夜光粉是光致发光：先存后放。',
          },
        ]),
      ],
      '五种添加剂，五种神奇效果'
    ),
  ],
  '三步认识史莱姆材料科学'
)

export const slime: Subject = {
  id: 'slime',
  name: '史莱姆材料科学家',
  emoji: '🧪',
  color: '#0288D1',
  mascot: 'slime',
  description: '调配变量，探索材料的神奇变化',
  units: [u1],
}
