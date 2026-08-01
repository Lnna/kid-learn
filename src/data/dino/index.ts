import type { Subject } from '../../engine/types'
import { tapRead, listenChoose, dragMatch, quiz, sequence, gridDig, level, unit } from '../helpers'

/* ── U1 挖掘营地 ── */

const u1 = unit(
  'dino-1',
  '挖掘营地',
  [
    level(
      'dino-1-01',
      '化石坐标挖掘',
      [
        gridDig(
          '按坐标挖化石',
          'fossil',
          [
            { row: 2, col: 3, icon: '🦴', label: '腿骨化石', speak: '挖到一根腿骨化石' },
            { row: 4, col: 5, icon: '🦷', label: '牙齿化石', speak: '是一颗尖尖的牙齿' },
            { row: 5, col: 2, icon: '🥚', label: '恐龙蛋化石', speak: '哇，恐龙蛋化石' },
          ],
          '考古学家用“第几行第几列”标记化石位置，开工吧！'
        ),
        quiz('挖掘小常识', [
          {
            id: 'q1',
            question: '挖到化石时，考古学家会怎么做？',
            speak: '挖到化石的时候，考古学家会怎么做？',
            options: [
              { id: 'a', label: '轻轻刷掉土', icon: '🖌️' },
              { id: 'b', label: '用力摔一摔', icon: '💥' },
              { id: 'c', label: '丢进水里', icon: '💧' },
            ],
            answerId: 'a',
            explain: '化石很脆弱，要用小刷子轻轻清理。',
          },
        ]),
      ],
      '第几行第几列，化石挖出来',
      ['trex']
    ),
    level(
      'dino-1-02',
      '汉字拼龙名',
      [
        dragMatch('拼出恐龙名字', [
          { id: 'p1', left: '三', right: '角龙', leftIcon: '3️⃣' },
          { id: 'p2', left: '霸', right: '王龙', leftIcon: '👑' },
          { id: 'p3', left: '剑', right: '龙', leftIcon: '🗡️' },
          { id: 'p4', left: '迅', right: '猛龙', leftIcon: '💨' },
        ], '把汉字碎片拼成恐龙的名字'),
        tapRead('龙字大家族', [
          { id: 't1', label: '龙', speak: '龙，恐龙的龙', icon: '🐉' },
          { id: 't2', label: '角', speak: '角，三只角的角', icon: '🔺' },
          { id: 't3', label: '王', speak: '王，大王的王', icon: '👑' },
          { id: 't4', label: '剑', speak: '剑，宝剑的剑', icon: '🗡️' },
        ], '点一点，认一认恐龙名里的汉字'),
      ],
      '汉字碎片拼一拼',
      ['triceratops']
    ),
    level(
      'dino-1-03',
      '骨架测量员',
      [
        quiz('数格子量一量', [
          {
            id: 'q1',
            question: '霸王龙的腿骨占了 6 格，三角龙的腿骨占了 4 格，谁的腿骨更长？',
            speak: '霸王龙的腿骨占了六格，三角龙的腿骨占了四格，谁的腿骨更长？',
            options: [
              { id: 'a', label: '霸王龙', icon: '🦖' },
              { id: 'b', label: '三角龙', icon: '🦕' },
              { id: 'c', label: '一样长', icon: '➖' },
            ],
            answerId: 'a',
            explain: '6 格比 4 格长，所以霸王龙的腿骨更长。',
          },
          {
            id: 'q2',
            question: '一根肋骨长 3 格，另一根长 5 格，一共长几格？',
            speak: '一根肋骨长三格，另一根长五格，一共长几格？',
            options: [
              { id: 'a', label: '8 格', icon: '8️⃣' },
              { id: 'b', label: '7 格', icon: '7️⃣' },
              { id: 'c', label: '2 格', icon: '2️⃣' },
            ],
            answerId: 'a',
            explain: '3 加 5 等于 8。',
          },
          {
            id: 'q3',
            question: '腕龙脖子长 9 格，尾巴长 5 格，脖子比尾巴长几格？',
            speak: '腕龙脖子长九格，尾巴长五格，脖子比尾巴长几格？',
            options: [
              { id: 'a', label: '4 格', icon: '4️⃣' },
              { id: 'b', label: '14 格', icon: '🔢' },
              { id: 'c', label: '3 格', icon: '3️⃣' },
            ],
            answerId: 'a',
            explain: '9 减 5 等于 4。',
          },
        ]),
        sequence('从短到长排一排', [
          {
            id: 's1',
            prompt: '把恐龙按身长从短到长排队',
            speak: '迅猛龙两米，三角龙九米，腕龙二十三米，请按从短到长排一排',
            items: [
              { id: 'a', label: '迅猛龙 2米', icon: '🦅', speak: '迅猛龙' },
              { id: 'b', label: '三角龙 9米', icon: '🐂', speak: '三角龙' },
              { id: 'c', label: '腕龙 23米', icon: '🦕', speak: '腕龙' },
            ],
            answerOrder: ['a', 'b', 'c'],
          },
        ]),
      ],
      '数格子、比长短',
      ['brachiosaurus']
    ),
    level(
      'dino-1-04',
      '营地识字课',
      [
        tapRead('挖掘工具认一认', [
          { id: 't1', label: '挖', subLabel: '挖土的挖', speak: '挖，挖掘的挖', icon: '⛏️' },
          { id: 't2', label: '刷', subLabel: '刷土的刷', speak: '刷，刷子的刷', icon: '🖌️' },
          { id: 't3', label: '骨', subLabel: '骨头的骨', speak: '骨，骨头的骨', icon: '🦴' },
          { id: 't4', label: '蛋', subLabel: '恐龙蛋的蛋', speak: '蛋，恐龙蛋的蛋', icon: '🥚' },
        ], '点一点，认一认营地里的汉字'),
        listenChoose(
          '听音找字',
          '请找出「骨」字',
          [
            { id: 'a', label: '挖', speak: '挖' },
            { id: 'b', label: '骨', speak: '骨' },
            { id: 'c', label: '蛋', speak: '蛋' },
          ],
          'b'
        ),
        dragMatch('工具和汉字配配对', [
          { id: 'p1', left: '⛏️ 小铲子', right: '挖', rightIcon: '挖' },
          { id: 'p2', left: '🖌️ 小刷子', right: '刷', rightIcon: '刷' },
          { id: 'p3', left: '🦴 腿骨化石', right: '骨', rightIcon: '骨' },
        ], '把图片和汉字连起来'),
      ],
      '认识挖掘营地的汉字',
      []
    ),
  ],
  '挖化石、拼名字、量骨架'
)

/* ── U2 修复工坊 ── */

const u2 = unit(
  'dino-2',
  '修复工坊',
  [
    level(
      'dino-2-01',
      '骨架拼拼乐',
      [
        dragMatch('骨头回家', [
          { id: 'p1', left: '头骨', right: '最上面', leftIcon: '💀' },
          { id: 'p2', left: '肋骨', right: '中间', leftIcon: '🩻' },
          { id: 'p3', left: '腿骨', right: '下面', leftIcon: '🦵' },
          { id: 'p4', left: '尾椎骨', right: '最后面', leftIcon: '🦴' },
        ], '把骨头放回身体正确的位置'),
        quiz('骨架小医生', [
          {
            id: 'q1',
            question: '三角龙的三只角长在身体的哪里？',
            speak: '三角龙的三只角长在身体的哪里？',
            options: [
              { id: 'a', label: '头上', icon: '🗣️' },
              { id: 'b', label: '尾巴上', icon: '🦎' },
              { id: 'c', label: '腿上', icon: '🦵' },
            ],
            answerId: 'a',
          },
          {
            id: 'q2',
            question: '剑龙的骨板长在身体的哪里？',
            speak: '剑龙的骨板长在身体的哪里？',
            options: [
              { id: 'a', label: '背上', icon: '🎒' },
              { id: 'b', label: '肚子上', icon: '🤰' },
              { id: 'c', label: '脚上', icon: '🦶' },
            ],
            answerId: 'a',
          },
        ]),
      ],
      '把散落的骨头拼回去',
      ['stegosaurus']
    ),
    level(
      'dino-2-02',
      '脚印侦探',
      [
        quiz('跟着脚印找恐龙', [
          {
            id: 'q1',
            question: '脚印脚尖都朝左边，恐龙往哪个方向走了？',
            speak: '地上的脚印脚尖都朝左边，恐龙往哪个方向走了？',
            options: [
              { id: 'a', label: '左边', icon: '⬅️' },
              { id: 'b', label: '右边', icon: '➡️' },
              { id: 'c', label: '原地转圈', icon: '🌀' },
            ],
            answerId: 'a',
            explain: '脚尖朝哪边，恐龙就往哪边走。',
          },
          {
            id: 'q2',
            question: '脚印又大又深，旁边还有小脚印，可能是？',
            speak: '脚印又大又深，旁边还有一排小脚印，可能是什么情况？',
            options: [
              { id: 'a', label: '恐龙妈妈带着宝宝', icon: '👩‍👧' },
              { id: 'b', label: '一只恐龙倒着走', icon: '🔄' },
              { id: 'c', label: '风吹出来的', icon: '🌬️' },
            ],
            answerId: 'a',
            explain: '大脚印配小脚印，很可能是妈妈和宝宝。',
          },
          {
            id: 'q3',
            question: '三瓣脚趾的脚印，最可能是谁留下的？',
            speak: '三瓣脚趾的脚印，最可能是谁留下的？',
            options: [
              { id: 'a', label: '三角龙', icon: '🐂' },
              { id: 'b', label: '翼龙', icon: '🦅' },
              { id: 'c', label: '小鱼', icon: '🐟' },
            ],
            answerId: 'a',
            explain: '三角龙的脚有三瓣脚趾。',
          },
        ]),
        listenChoose(
          '听脚印找方向',
          '脚印朝着大树的方向去了，恐龙去哪里了？',
          [
            { id: 'a', label: '大树那边', icon: '🌳', speak: '大树那边' },
            { id: 'b', label: '山洞里', icon: '🕳️', speak: '山洞里' },
            { id: 'c', label: '河边', icon: '🏞️', speak: '河边' },
          ],
          'a'
        ),
      ],
      '用脚印推理恐龙去哪了',
      ['raptor']
    ),
    level(
      'dino-2-03',
      '食性分分看',
      [
        dragMatch('给恐龙送午餐', [
          { id: 'p1', left: '霸王龙', right: '大鸡腿', leftIcon: '🦖', rightIcon: '🍗' },
          { id: 'p2', left: '腕龙', right: '树叶', leftIcon: '🦕', rightIcon: '🌿' },
          { id: 'p3', left: '三角龙', right: '嫩草', leftIcon: '🐂', rightIcon: '🌱' },
          { id: 'p4', left: '迅猛龙', right: '肉排', leftIcon: '💨', rightIcon: '🥩' },
        ], '肉食恐龙吃肉，植食恐龙吃植物'),
        quiz('牙齿里的秘密', [
          {
            id: 'q1',
            question: '牙齿又尖又弯的恐龙，多半是？',
            speak: '牙齿又尖又弯的恐龙，多半吃什么？',
            options: [
              { id: 'a', label: '吃肉', icon: '🥩' },
              { id: 'b', label: '吃草', icon: '🌿' },
              { id: 'c', label: '喝西北风', icon: '🌬️' },
            ],
            answerId: 'a',
            explain: '尖尖的牙齿适合撕肉。',
          },
          {
            id: 'q2',
            question: '牙齿平平的像小石磨，适合磨碎植物，这种恐龙是？',
            speak: '牙齿平平的像小石磨的恐龙，是植食恐龙还是肉食恐龙？',
            options: [
              { id: 'a', label: '植食恐龙', icon: '🌿' },
              { id: 'b', label: '肉食恐龙', icon: '🥩' },
            ],
            answerId: 'a',
            explain: '平平的牙齿用来磨碎植物。',
          },
        ]),
      ],
      '看牙齿，分食性',
      ['pterosaur']
    ),
    level(
      'dino-2-04',
      '修复数字账',
      [
        quiz('数一数修好的骨头', [
          {
            id: 'q1',
            question: '上午修好 4 根骨头，下午修好 3 根，一天修好几根？',
            speak: '上午修好四根骨头，下午修好三根，一天修好几根？',
            options: [
              { id: 'a', label: '7 根', icon: '7️⃣' },
              { id: 'b', label: '6 根', icon: '6️⃣' },
              { id: 'c', label: '1 根', icon: '1️⃣' },
            ],
            answerId: 'a',
            explain: '4 加 3 等于 7。',
          },
          {
            id: 'q2',
            question: '盒子里有 10 块化石碎片，用了 6 块，还剩几块？',
            speak: '盒子里有十块化石碎片，用了六块，还剩几块？',
            options: [
              { id: 'a', label: '4 块', icon: '4️⃣' },
              { id: 'b', label: '5 块', icon: '5️⃣' },
              { id: 'c', label: '16 块', icon: '🔢' },
            ],
            answerId: 'a',
            explain: '10 减 6 等于 4。',
          },
          {
            id: 'q3',
            question: '修好霸王龙用了 8 天，修好三角龙用了 5 天，哪个用的时间长？',
            speak: '修好霸王龙用了八天，修好三角龙用了五天，哪个用的时间长？',
            options: [
              { id: 'a', label: '霸王龙', icon: '🦖' },
              { id: 'b', label: '三角龙', icon: '🐂' },
              { id: 'c', label: '一样长', icon: '➖' },
            ],
            answerId: 'a',
            explain: '8 天比 5 天长。',
          },
        ]),
        sequence('修复步骤排一排', [
          {
            id: 's1',
            prompt: '把修复化石的步骤排一排',
            speak: '先清理，再拼接，最后固定。请把修复化石的步骤排一排',
            items: [
              { id: 'a', label: '刷掉泥土', icon: '🖌️' },
              { id: 'b', label: '拼好碎片', icon: '🧩' },
              { id: 'c', label: '胶水固定', icon: '🩹' },
            ],
            answerOrder: ['a', 'b', 'c'],
          },
        ]),
      ],
      '修复工坊里的加减法',
      []
    ),
  ],
  '拼骨架、追脚印、分食性'
)

/* ── U3 恐龙博士站 ── */

const u3 = unit(
  'dino-3',
  '恐龙博士站',
  [
    level(
      'dino-3-01',
      '年代排排队',
      [
        sequence('恐龙时光机', [
          {
            id: 's1',
            prompt: '把三个年代按从早到晚排队',
            speak: '三叠纪、侏罗纪、白垩纪，请按从早到晚排一排',
            items: [
              { id: 'a', label: '三叠纪', icon: '🌋', speak: '三叠纪，恐龙刚刚出现' },
              { id: 'b', label: '侏罗纪', icon: '🌳', speak: '侏罗纪，恐龙越来越大' },
              { id: 'c', label: '白垩纪', icon: '☄️', speak: '白垩纪，恐龙最后的日子' },
            ],
            answerOrder: ['a', 'b', 'c'],
          },
          {
            id: 's2',
            prompt: '把恐龙按出现的年代排队',
            speak: '腕龙住在侏罗纪，霸王龙住在白垩纪，谁先谁后？',
            items: [
              { id: 'a', label: '腕龙（侏罗纪）', icon: '🦕' },
              { id: 'b', label: '霸王龙（白垩纪）', icon: '🦖' },
            ],
            answerOrder: ['a', 'b'],
          },
        ]),
      ],
      '坐上时光机看恐龙',
      []
    ),
    level(
      'dino-3-02',
      '高矮比比看',
      [
        quiz('量感大挑战', [
          {
            id: 'q1',
            question: '腕龙有三层楼那么高，“三层楼”大约是？',
            speak: '腕龙有三层楼那么高，三层楼大约是多少？',
            options: [
              { id: 'a', label: '10 米左右', icon: '🏢' },
              { id: 'b', label: '1 米', icon: '📏' },
              { id: 'c', label: '100 米', icon: '🗼' },
            ],
            answerId: 'a',
          },
          {
            id: 'q2',
            question: '迅猛龙只有 2 米，和下面哪个差不多大？',
            speak: '迅猛龙只有两米，和下面哪个差不多大？',
            options: [
              { id: 'a', label: '一只大火鸡', icon: '🦃' },
              { id: 'b', label: '一头大象', icon: '🐘' },
              { id: 'c', label: '一辆公交车', icon: '🚌' },
            ],
            answerId: 'a',
          },
          {
            id: 'q3',
            question: '谁是最高的恐龙？',
            speak: '腕龙、三角龙、迅猛龙，谁最高？',
            options: [
              { id: 'a', label: '腕龙', icon: '🦕' },
              { id: 'b', label: '三角龙', icon: '🐂' },
              { id: 'c', label: '迅猛龙', icon: '💨' },
            ],
            answerId: 'a',
          },
        ]),
      ],
      '恐龙到底有多高',
      []
    ),
    level(
      'dino-3-03',
      '恐龙命名所',
      [
        quiz('给恐龙起名字', [
          {
            id: 'q1',
            question: '一种恐龙头上有三只角，你会叫它？',
            speak: '一种恐龙，头上有三只角，你觉得它叫什么名字最合适？',
            options: [
              { id: 'a', label: '三角龙', icon: '🔺' },
              { id: 'b', label: '无角龙', icon: '⭕' },
              { id: 'c', label: '短尾龙', icon: '🦎' },
            ],
            answerId: 'a',
            explain: '科学家就是按特征给恐龙命名的。',
          },
          {
            id: 'q2',
            question: '“霸王龙”这个名字，是因为它的什么特点？',
            speak: '霸王龙这个名字，是因为它的什么特点？',
            options: [
              { id: 'a', label: '凶猛像大王', icon: '👑' },
              { id: 'b', label: '喜欢吃草', icon: '🌿' },
              { id: 'c', label: '长得很小', icon: '🐜' },
            ],
            answerId: 'a',
          },
          {
            id: 'q3',
            question: '跑得飞快的恐龙，哪个名字最合适？',
            speak: '跑得飞快的恐龙，下面哪个名字最合适？',
            options: [
              { id: 'a', label: '迅猛龙', icon: '💨' },
              { id: 'b', label: '慢吞龙', icon: '🐌' },
              { id: 'c', label: '瞌睡龙', icon: '😴' },
            ],
            answerId: 'a',
          },
        ]),
        tapRead('名字里的秘密', [
          { id: 'n1', label: '角', subLabel: '三只角 → 三角龙', speak: '角，三角龙的角', icon: '🔺' },
          { id: 'n2', label: '霸', subLabel: '霸气 → 霸王龙', speak: '霸，霸王龙的霸', icon: '👑' },
          { id: 'n3', label: '剑', subLabel: '背上骨板 → 剑龙', speak: '剑，剑龙的剑', icon: '🗡️' },
          { id: 'n4', label: '迅', subLabel: '迅速 → 迅猛龙', speak: '迅，迅猛龙的迅', icon: '💨' },
        ], '点一点，发现名字里的秘密'),
      ],
      '名字里藏着特征',
      []
    ),
    level(
      'dino-3-04',
      '小小古生物家',
      [
        quiz('毕业大考验', [
          {
            id: 'q1',
            question: '挖化石最应该用什么工具？',
            speak: '挖化石最应该用什么工具？',
            options: [
              { id: 'a', label: '小刷子', icon: '🖌️' },
              { id: 'b', label: '大锤子', icon: '🔨' },
              { id: 'c', label: '水龙头', icon: '🚿' },
            ],
            answerId: 'a',
          },
          {
            id: 'q2',
            question: '牙齿尖尖的恐龙多半吃什么？',
            speak: '牙齿尖尖的恐龙多半吃什么？',
            options: [
              { id: 'a', label: '肉', icon: '🥩' },
              { id: 'b', label: '草', icon: '🌿' },
              { id: 'c', label: '石头', icon: '🪨' },
            ],
            answerId: 'a',
          },
          {
            id: 'q3',
            question: '三叠纪、侏罗纪、白垩纪，哪个最早？',
            speak: '三叠纪、侏罗纪、白垩纪，哪个年代最早？',
            options: [
              { id: 'a', label: '三叠纪', icon: '🌋' },
              { id: 'b', label: '白垩纪', icon: '☄️' },
              { id: 'c', label: '侏罗纪', icon: '🌳' },
            ],
            answerId: 'a',
          },
        ]),
        listenChoose(
          '听描述找恐龙',
          '它脖子特别长，能吃到树顶的叶子，它是谁？',
          [
            { id: 'a', label: '腕龙', icon: '🦕', speak: '腕龙' },
            { id: 'b', label: '霸王龙', icon: '🦖', speak: '霸王龙' },
            { id: 'c', label: '迅猛龙', icon: '💨', speak: '迅猛龙' },
          ],
          'a'
        ),
      ],
      '综合运用所有本领',
      []
    ),
  ],
  '成为真正的恐龙小博士'
)

export const dino: Subject = {
  id: 'dino',
  name: '恐龙考古学家',
  emoji: '🦖',
  color: '#E67E22',
  mascot: 'dino',
  description: '拿起小刷子，挖掘修复命名，当恐龙小博士',
  units: [u1, u2, u3],
}
