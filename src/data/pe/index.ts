import type { Subject } from '../../engine/types'
import { movePlay, level, unit } from '../helpers'

/* ── U1 热身伸展 ── */

const u1 = unit(
  'pe-1',
  '热身伸展',
  [
    level('pe-1-01', '伸个懒腰', [
      movePlay(
        '伸懒腰',
        [
          {
            id: 'm1',
            name: '双手向上伸',
            speak: '双手慢慢向上伸，像大树一样高',
            emoji: '🙆',
            durationSec: 8,
            tip: '踮一踮脚尖，把身体拉长',
          },
          {
            id: 'm2',
            name: '左右轻轻晃',
            speak: '双手还在上面，身体轻轻左右晃一晃',
            emoji: '🌿',
            durationSec: 8,
            tip: '动作要慢，呼吸要稳',
          },
          {
            id: 'm3',
            name: '放松放下',
            speak: '慢慢把手放下来，肩膀放松',
            emoji: '😌',
            durationSec: 6,
            tip: '做完会感觉身体舒展开了',
          },
        ],
        { encourage: '伸懒腰真棒，身体醒过来啦！' }
      ),
    ], '把身体拉开'),

    level('pe-1-02', '转转手腕', [
      movePlay(
        '转手腕',
        [
          {
            id: 'm1',
            name: '右手画圈',
            speak: '举起右手，慢慢画小圆圈',
            emoji: '🤚',
            reps: 8,
            tip: '手腕轻轻转，不要太用力',
          },
          {
            id: 'm2',
            name: '左手画圈',
            speak: '换左手，慢慢画小圆圈',
            emoji: '✋',
            reps: 8,
            tip: '跟着数，转八下',
          },
          {
            id: 'm3',
            name: '双手一起转',
            speak: '双手一起转，像小风车',
            emoji: '🌀',
            durationSec: 8,
            tip: '转转手腕，写字画画更轻松',
          },
        ],
        { encourage: '手腕灵活啦，继续加油！' }
      ),
    ], '活动小手腕'),

    level('pe-1-03', '踮踮脚尖', [
      movePlay(
        '踮脚尖',
        [
          {
            id: 'm1',
            name: '踮起来',
            speak: '双手叉腰，慢慢踮起脚尖',
            emoji: '🩰',
            durationSec: 6,
            tip: '脚跟贴紧，身体站直',
          },
          {
            id: 'm2',
            name: '轻轻落下',
            speak: '慢慢把脚跟放回地面',
            emoji: '👣',
            durationSec: 6,
            tip: '轻一点，像小猫落地',
          },
          {
            id: 'm3',
            name: '踮十下',
            speak: '再踮起来落下，做十次',
            emoji: '🦵',
            reps: 10,
            tip: '一上一下算一次',
          },
        ],
        { encourage: '小腿有力气了，真棒！' }
      ),
    ], '练平衡与小腿'),

    level('pe-1-04', '深呼吸', [
      movePlay(
        '深呼吸放松',
        [
          {
            id: 'm1',
            name: '慢慢吸气',
            speak: '鼻子慢慢吸气，肚子鼓起来',
            emoji: '🌬️',
            durationSec: 5,
            tip: '像闻一朵花',
          },
          {
            id: 'm2',
            name: '慢慢呼气',
            speak: '嘴巴轻轻呼气，把气慢慢放出去',
            emoji: '😮‍💨',
            durationSec: 5,
            tip: '像吹灭一根蜡烛',
          },
          {
            id: 'm3',
            name: '再来三次',
            speak: '再做三次深呼吸，身体放松',
            emoji: '🧘',
            reps: 3,
            tip: '吸气呼气算一次',
          },
        ],
        { encourage: '呼吸平稳，准备好运动啦！' }
      ),
    ], '平静又有力'),
  ],
  '伸展、手腕、踮脚与呼吸'
)

/* ── U2 全身动一动 ── */

const u2 = unit(
  'pe-2',
  '全身动一动',
  [
    level('pe-2-01', '开合跳', [
      movePlay(
        '开合跳',
        [
          {
            id: 'm1',
            name: '看示范',
            speak: '脚分开跳开，双手拍一下；再跳回来',
            emoji: '🤸',
            durationSec: 8,
            tip: '落地要轻，膝盖微弯',
          },
          {
            id: 'm2',
            name: '跳八下',
            speak: '跟着节奏开合跳八下',
            emoji: '⭐',
            reps: 8,
            tip: '跳一下数一下',
          },
          {
            id: 'm3',
            name: '再跳八下',
            speak: '休息一下，再跳八下',
            emoji: '💪',
            reps: 8,
            tip: '累了可以放慢一点',
          },
        ],
        { encourage: '开合跳完成，心脏跳得欢！' }
      ),
    ], '跳起来动一动'),

    level('pe-2-02', '想象骑车', [
      movePlay(
        '假装骑自行车',
        [
          {
            id: 'm1',
            name: '坐好准备',
            speak: '假装坐在自行车上，双手握住车把',
            emoji: '🚲',
            durationSec: 6,
            tip: '没有真车，我们原地假装骑',
          },
          {
            id: 'm2',
            name: '双脚轮流蹬',
            speak: '双脚轮流往前蹬，像踩脚蹬',
            emoji: '🦵',
            durationSec: 15,
            tip: '左脚一下，右脚一下，保持节奏',
          },
          {
            id: 'm3',
            name: '再蹬一会儿',
            speak: '继续蹬，想象骑过一座小桥',
            emoji: '🌉',
            durationSec: 12,
            tip: '腿动起来，上身保持稳',
          },
        ],
        {
          instruction: '假装骑车，双脚轮流蹬，不用真车',
          encourage: '骑到终点啦，腿脚真有劲！',
        }
      ),
    ], '原地想象骑行'),

    level('pe-2-03', '小小蹲', [
      movePlay(
        '小小蹲',
        [
          {
            id: 'm1',
            name: '半蹲一下',
            speak: '双手前平举，慢慢蹲下一半再站起',
            emoji: '🦆',
            durationSec: 8,
            tip: '膝盖对准脚尖，不要蹲太低',
          },
          {
            id: 'm2',
            name: '蹲六次',
            speak: '小小蹲六次',
            emoji: '🪴',
            reps: 6,
            tip: '慢一点更稳',
          },
          {
            id: 'm3',
            name: '再蹲六次',
            speak: '休息一下，再蹲六次',
            emoji: '✨',
            reps: 6,
            tip: '腿有点酸说明在用力哦',
          },
        ],
        { encourage: '小小蹲完成，腿更有力啦！' }
      ),
    ], '练腿力'),

    level('pe-2-04', '平衡站', [
      movePlay(
        '平衡站',
        [
          {
            id: 'm1',
            name: '金鸡独立左',
            speak: '抬起右脚，用左脚站稳',
            emoji: '🦩',
            durationSec: 8,
            tip: '眼睛看前方，手臂张开帮忙',
          },
          {
            id: 'm2',
            name: '金鸡独立右',
            speak: '换一边，抬起左脚，用右脚站稳',
            emoji: '🦩',
            durationSec: 8,
            tip: '摇晃也没关系，再站稳一点',
          },
          {
            id: 'm3',
            name: '闭眼试试',
            speak: '双脚并拢站好，轻轻闭上眼睛数数',
            emoji: '👀',
            durationSec: 6,
            tip: '旁边有大人陪着更安全',
          },
        ],
        { encourage: '平衡练好了，像小树一样稳！' }
      ),
    ], '站稳不晃'),
  ],
  '开合跳、想象骑车、蹲与平衡'
)

/* ── U3 护眼护体 ── */

const u3 = unit(
  'pe-3',
  '护眼护体',
  [
    level('pe-3-01', '眼保健操上', [
      movePlay(
        '眼保健操 · 上',
        [
          {
            id: 'm1',
            name: '揉天应穴',
            speak: '轻轻揉眉毛内侧的天应穴',
            emoji: '👁️',
            durationSec: 10,
            tip: '用指腹轻轻按揉，不要用力按眼球',
          },
          {
            id: 'm2',
            name: '挤按睛明穴',
            speak: '轻轻按鼻梁两侧的睛明穴',
            emoji: '👃',
            durationSec: 10,
            tip: '一挤一放，动作温柔',
          },
        ],
        { encourage: '眼睛舒服一点了！' }
      ),
    ], '眼操前两节'),

    level('pe-3-02', '眼保健操下', [
      movePlay(
        '眼保健操 · 下',
        [
          {
            id: 'm1',
            name: '按揉四白穴',
            speak: '轻轻按眼睛下方的四白穴',
            emoji: '😊',
            durationSec: 10,
            tip: '找到颧骨旁的小凹陷',
          },
          {
            id: 'm2',
            name: '按太阳穴刮眼眶',
            speak: '按太阳穴，再轻轻刮一圈眼眶',
            emoji: '🌞',
            durationSec: 12,
            tip: '沿着骨头边缘刮，不要碰眼睛',
          },
        ],
        { encourage: '眼保健操做完啦！' }
      ),
    ], '眼操后两节'),

    level('pe-3-03', '眨眼眺望', [
      movePlay(
        '眨眼与眺望',
        [
          {
            id: 'm1',
            name: '快快眨眼',
            speak: '快快眨眨眼，让眼睛湿润一下',
            emoji: '😉',
            reps: 10,
            tip: '眨十下，眼睛休息片刻',
          },
          {
            id: 'm2',
            name: '看远处',
            speak: '想象看窗外很远的树，眼睛放松',
            emoji: '🌳',
            durationSec: 12,
            tip: '有窗就看真树，没窗就想象远方',
          },
          {
            id: 'm3',
            name: '近远交替',
            speak: '先看指尖，再看远处，交替几次',
            emoji: '🔄',
            reps: 5,
            tip: '近一下远一下算一次',
          },
        ],
        { encourage: '眼睛休息好了，继续学习更轻松！' }
      ),
    ], '眨眼休息与眺望'),

    level('pe-3-04', '整理放松', [
      movePlay(
        '整理放松',
        [
          {
            id: 'm1',
            name: '甩甩手臂',
            speak: '双手轻轻甩一甩，把力气放掉',
            emoji: '👋',
            durationSec: 8,
            tip: '像甩掉水滴一样',
          },
          {
            id: 'm2',
            name: '转转肩膀',
            speak: '肩膀向前向后各转几圈',
            emoji: '🔄',
            reps: 6,
            tip: '转一圈数一下',
          },
          {
            id: 'm3',
            name: '安静站立',
            speak: '双脚站稳，做一次深呼吸，体育课结束',
            emoji: '🌸',
            durationSec: 8,
            tip: '微笑一下，给自己点个赞',
          },
        ],
        { encourage: '今天运动很棒，身体会谢谢你！' }
      ),
    ], '收尾放松'),
  ],
  '眼保健操、眺望与放松'
)

export const pe: Subject = {
  id: 'pe',
  name: '体育课',
  emoji: '🏃',
  color: '#5EC8A0',
  mascot: 'bear',
  description: '热身伸展、全身动一动、护眼护体，在家也能上体育课',
  units: [u1, u2, u3],
}
