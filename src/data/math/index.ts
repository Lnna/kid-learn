import type { Subject } from '../../engine/types'
import {
  tapRead,
  listenChoose,
  dragMatch,
  tracing,
  quiz,
  sequence,
  level,
  unit,
} from '../helpers'
import {
  genAddSub,
  genCountQuiz,
  genCompare,
  genPattern,
  genSplit10,
} from '../../engine/generators'

/* ── U1 数感进阶 ── */

const u1 = unit(
  'math-1',
  '数感进阶',
  [
    level('math-1-01', '快速复习 1～10', [
      tapRead('点读 1～10', [
        { id: 'n1', label: '1', speak: '一', icon: '1️⃣', color: '#FF6B6B' },
        { id: 'n2', label: '2', speak: '二', icon: '2️⃣', color: '#FFA94D' },
        { id: 'n3', label: '3', speak: '三', icon: '3️⃣', color: '#FFD43B' },
        { id: 'n4', label: '4', speak: '四', icon: '4️⃣', color: '#69DB7C' },
        { id: 'n5', label: '5', speak: '五', icon: '5️⃣', color: '#4DABF7' },
        { id: 'n6', label: '6', speak: '六', icon: '6️⃣', color: '#9775FA' },
        { id: 'n7', label: '7', speak: '七', icon: '7️⃣', color: '#F783AC' },
        { id: 'n8', label: '8', speak: '八', icon: '8️⃣', color: '#63E6BE' },
        { id: 'n9', label: '9', speak: '九', icon: '9️⃣', color: '#FF922B' },
        { id: 'n10', label: '10', speak: '十', icon: '🔟', color: '#339AF0' },
      ]),
      tracing('描一描 1～10', [
        { id: 't1', char: '1', hint: '从上往下', speak: '一', grid: 'number' },
        { id: 't5', char: '5', hint: '横竖弯再横', speak: '五', grid: 'number' },
        { id: 't8', char: '8', speak: '八', grid: 'number' },
        { id: 't10', char: '10', speak: '十', grid: 'number' },
      ]),
      quiz('数感小测', genCountQuiz(10, 4)),
    ], '快速过一遍 1 到 10'),

    level('math-1-02', '11～20 与数位', [
      tapRead('点读 11～20', [
        { id: 'n11', label: '11', speak: '十一' },
        { id: 'n12', label: '12', speak: '十二' },
        { id: 'n15', label: '15', speak: '十五' },
        { id: 'n18', label: '18', speak: '十八' },
        { id: 'n20', label: '20', speak: '二十', icon: '2️⃣0️⃣' },
      ]),
      tracing('描一描十几', [
        { id: 't11', char: '11', speak: '十一', grid: 'number' },
        { id: 't15', char: '15', speak: '十五', grid: 'number' },
        { id: 't20', char: '20', speak: '二十', grid: 'number' },
      ]),
      quiz('十位与个位', [
        {
          id: 'q1',
          question: '15 里面有几个十？几个一？',
          options: [
            { id: 'a', label: '1个十和5个一' },
            { id: 'b', label: '5个十和1个一' },
            { id: 'c', label: '1个十和1个一' },
          ],
          answerId: 'a',
        },
        {
          id: 'q2',
          question: '1 个十和 3 个一合起来是？',
          options: [
            { id: 'a', label: '13' },
            { id: 'b', label: '31' },
            { id: 'c', label: '103' },
          ],
          answerId: 'a',
          speak: '一个十和三个一合起来是多少',
        },
        {
          id: 'q3',
          question: '两个十是？',
          options: [
            { id: 'a', label: '10' },
            { id: 'b', label: '12' },
            { id: 'c', label: '20' },
          ],
          answerId: 'c',
          speak: '两个十是多少',
        },
        {
          id: 'q4',
          question: '18 的十位上是几？个位上是几？',
          options: [
            { id: 'a', label: '十位1，个位8' },
            { id: 'b', label: '十位8，个位1' },
            { id: 'c', label: '十位18，个位0' },
          ],
          answerId: 'a',
        },
      ]),
    ], '读写十几，理解十位个位'),

    level('math-1-03', '顺数倒数与间隔数', [
      sequence('从 1 数到 10', [
        {
          id: 's1',
          prompt: '按从小到大排一排',
          items: [
            { id: '1', label: '1' },
            { id: '3', label: '3' },
            { id: '5', label: '5' },
            { id: '7', label: '7' },
            { id: '9', label: '9' },
          ],
          answerOrder: ['1', '3', '5', '7', '9'],
          speak: '按从小到大排一排',
        },
      ]),
      quiz('间隔数填空', [
        {
          id: 'q1',
          question: '2、4、6、8、？（隔 2 数）',
          options: [
            { id: 'a', label: '9' },
            { id: 'b', label: '10' },
            { id: 'c', label: '12' },
          ],
          answerId: 'b',
          explain: '每次加 2',
        },
        {
          id: 'q2',
          question: '5、10、15、？（隔 5 数）',
          options: [
            { id: 'a', label: '16' },
            { id: 'b', label: '18' },
            { id: 'c', label: '20' },
          ],
          answerId: 'c',
        },
        {
          id: 'q3',
          question: '20、18、16、14、？（倒数隔 2）',
          options: [
            { id: 'a', label: '12' },
            { id: 'b', label: '13' },
            { id: 'c', label: '10' },
          ],
          answerId: 'a',
        },
        {
          id: 'q4',
          question: '16、17、18、？',
          options: [
            { id: 'a', label: '19' },
            { id: 'b', label: '20' },
            { id: 'c', label: '15' },
          ],
          answerId: 'a',
        },
      ]),
      listenChoose(
        '听一听下一个数',
        '十、九、八、七，下一个是',
        [
          { id: 'a', label: '5' },
          { id: 'b', label: '6' },
          { id: 'c', label: '8' },
        ],
        'b'
      ),
    ], '顺数倒数，隔 2 隔 5 数'),

    level('math-1-04', '相邻数与中间数', [
      quiz('找相邻数', [
        {
          id: 'q1',
          question: '7 的前面是几？',
          options: [
            { id: 'a', label: '6' },
            { id: 'b', label: '8' },
            { id: 'c', label: '5' },
          ],
          answerId: 'a',
          speak: '七的前面是几',
        },
        {
          id: 'q2',
          question: '14 的后面是几？',
          options: [
            { id: 'a', label: '13' },
            { id: 'b', label: '15' },
            { id: 'c', label: '16' },
          ],
          answerId: 'b',
        },
        {
          id: 'q3',
          question: '？在 11 和 13 中间',
          options: [
            { id: 'a', label: '10' },
            { id: 'b', label: '12' },
            { id: 'c', label: '14' },
          ],
          answerId: 'b',
        },
        {
          id: 'q4',
          question: '19 的相邻数是？',
          options: [
            { id: 'a', label: '18 和 20' },
            { id: 'b', label: '17 和 19' },
            { id: 'c', label: '19 和 21' },
          ],
          answerId: 'a',
        },
      ]),
      dragMatch('前后邻居配对', [
        { id: 'p1', left: '9 的前面', right: '8' },
        { id: 'p2', left: '12 的后面', right: '13' },
        { id: 'p3', left: '16 和 18 中间', right: '17' },
        { id: 'p4', left: '20 的前面', right: '19' },
      ]),
    ], '找前后邻居和中间数'),

    level('math-1-05', '比较大小', [
      quiz('谁更大', genCompare(20, 5)),
      quiz('大几小几', [
        {
          id: 'q1',
          question: '13 比 9 大几？',
          options: [
            { id: 'a', label: '3' },
            { id: 'b', label: '4' },
            { id: 'c', label: '5' },
          ],
          answerId: 'b',
          speak: '十三比九大几',
        },
        {
          id: 'q2',
          question: '7 比 12 小几？',
          options: [
            { id: 'a', label: '4' },
            { id: 'b', label: '5' },
            { id: 'c', label: '6' },
          ],
          answerId: 'b',
        },
        {
          id: 'q3',
          question: '18 ○ 15，中间填什么？',
          options: [
            { id: 'a', label: '>' },
            { id: 'b', label: '<' },
            { id: 'c', label: '=' },
          ],
          answerId: 'a',
          explain: '18 比 15 大',
        },
        {
          id: 'q4',
          question: '10 ○ 10',
          options: [
            { id: 'a', label: '>' },
            { id: 'b', label: '<' },
            { id: 'c', label: '=' },
          ],
          answerId: 'c',
        },
      ]),
      listenChoose(
        '听一听谁更大',
        '十五比十二大吗',
        [
          { id: 'a', label: '对，15 更大', icon: '✅' },
          { id: 'b', label: '不对，12 更大', icon: '❌' },
          { id: 'c', label: '一样大', icon: '⚖️' },
        ],
        'a'
      ),
    ], '比大小，理解大几小几'),

    level('math-1-06', '序数：第几个', [
      tapRead('序数词', [
        { id: 'o1', label: '第 1', speak: '第一', icon: '🥇' },
        { id: 'o2', label: '第 2', speak: '第二', icon: '🥈' },
        { id: 'o3', label: '第 3', speak: '第三', icon: '🥉' },
        { id: 'o4', label: '第 4', speak: '第四' },
        { id: 'o5', label: '第 5', speak: '第五' },
      ]),
      quiz('第几排第几个', [
        {
          id: 'q1',
          question: '🐱🐶🐰🐻 从左数，🐰是第几个？',
          options: [
            { id: 'a', label: '第 2 个' },
            { id: 'b', label: '第 3 个' },
            { id: 'c', label: '第 4 个' },
          ],
          answerId: 'b',
        },
        {
          id: 'q2',
          question: '排队：小明排第 4，前面有几人？',
          options: [
            { id: 'a', label: '2 人' },
            { id: 'b', label: '3 人' },
            { id: 'c', label: '4 人' },
          ],
          answerId: 'b',
          explain: '第 4 表示前面有 3 人',
        },
        {
          id: 'q3',
          question: '第 2 排第 3 个，用哪个数表示位置？',
          options: [
            { id: 'a', label: '23' },
            { id: 'b', label: '第 2 排第 3 个' },
            { id: 'c', label: '5' },
          ],
          answerId: 'b',
        },
        {
          id: 'q4',
          question: '5 个小朋友排队，小红排最后，她是第几个？',
          options: [
            { id: 'a', label: '第 4 个' },
            { id: 'b', label: '第 5 个' },
            { id: 'c', label: '第 6 个' },
          ],
          answerId: 'b',
        },
      ]),
      sequence('按顺序排一排', [
        {
          id: 's1',
          prompt: '把第 1 到第 4 排好',
          items: [
            { id: '1', label: '第 1' },
            { id: '2', label: '第 2' },
            { id: '3', label: '第 3' },
            { id: '4', label: '第 4' },
          ],
          answerOrder: ['1', '2', '3', '4'],
        },
      ]),
    ], '理解第几排、第几个'),
  ],
  '20以内数位·比较·序数'
)

/* ── U2 运算主力 ── */

const u2 = unit(
  'math-2',
  '运算主力',
  [
    level('math-2-01', '口算热身', [
      quiz('5 以内加减', genAddSub(0, 5, ['+', '-'], 6)),
      dragMatch('算式配对', [
        { id: 'p1', left: '3+2', right: '5' },
        { id: 'p2', left: '5-1', right: '4' },
        { id: 'p3', left: '2+2', right: '4' },
        { id: 'p4', left: '4-3', right: '1' },
      ]),
      listenChoose(
        '听题选答案',
        '三加二等于几',
        [
          { id: 'a', label: '4' },
          { id: 'b', label: '5' },
          { id: 'c', label: '6' },
        ],
        'b'
      ),
    ], '热身激活加减记忆'),

    level('math-2-02', '10 的分与合', [
      tapRead('10 的好朋友', [
        { id: 's1', label: '10=1+9', speak: '十可以分成一和九' },
        { id: 's2', label: '10=2+8', speak: '十可以分成二和八' },
        { id: 's3', label: '10=3+7', speak: '十可以分成三和七' },
        { id: 's4', label: '10=4+6', speak: '十可以分成四和六' },
        { id: 's5', label: '10=5+5', speak: '十可以分成五和五' },
      ]),
      quiz('分与合练习', genSplit10(6)),
      dragMatch('凑成 10', [
        { id: 'p1', left: '1', right: '9' },
        { id: 'p2', left: '2', right: '8' },
        { id: 'p3', left: '3', right: '7' },
        { id: 'p4', left: '4', right: '6' },
        { id: 'p5', left: '5', right: '5' },
      ]),
    ], '记住 10 的分与合'),

    level('math-2-03', '10 以内加减熟练', [
      quiz('10 以内加法', genAddSub(0, 10, ['+'], 6)),
      quiz('10 以内减法', genAddSub(0, 10, ['-'], 6)),
      listenChoose(
        '听算式',
        '七加二等于几',
        [
          { id: 'a', label: '8' },
          { id: 'b', label: '9' },
          { id: 'c', label: '10' },
        ],
        'b'
      ),
    ], '10 以内口算要熟练'),

    level('math-2-04', '凑十法', [
      tapRead('凑十小窍门', [
        {
          id: 't1',
          label: '8+5',
          subLabel: '8+2=10，再加 3',
          speak: '八加五，先凑十再加三等于十三',
        },
        {
          id: 't2',
          label: '9+6',
          subLabel: '9+1=10，再加 5',
          speak: '九加六，先凑十再加五等于十五',
        },
        {
          id: 't3',
          label: '7+4',
          subLabel: '7+3=10，再加 1',
          speak: '七加四，先凑十再加一等于十一',
        },
      ]),
      quiz('用凑十算一算', [
        {
          id: 'q1',
          question: '8+3 = ?（提示：8+2+1）',
          options: [
            { id: 'a', label: '10' },
            { id: 'b', label: '11' },
            { id: 'c', label: '12' },
          ],
          answerId: 'b',
        },
        {
          id: 'q2',
          question: '9+4 = ?',
          options: [
            { id: 'a', label: '12' },
            { id: 'b', label: '13' },
            { id: 'c', label: '14' },
          ],
          answerId: 'b',
        },
        {
          id: 'q3',
          question: '7+5 = ?',
          options: [
            { id: 'a', label: '11' },
            { id: 'b', label: '12' },
            { id: 'c', label: '13' },
          ],
          answerId: 'b',
        },
        {
          id: 'q4',
          question: '6+8 = ?',
          options: [
            { id: 'a', label: '13' },
            { id: 'b', label: '14' },
            { id: 'c', label: '15' },
          ],
          answerId: 'b',
        },
      ]),
      quiz('凑十口算', genAddSub(1, 9, ['+'], 4)),
    ], '先凑十，再加剩下的'),

    level('math-2-05', '20 以内进位加·技巧', [
      tapRead('进位加思路', [
        {
          id: 'c1',
          label: '9+8',
          subLabel: '9+1=10，10+7=17',
          speak: '九加八等于十七',
        },
        {
          id: 'c2',
          label: '8+7',
          subLabel: '8+2=10，10+5=15',
          speak: '八加七等于十五',
        },
      ]),
      quiz('进位加练习', genAddSub(5, 15, ['+'], 6)),
      dragMatch('算式找答案', [
        { id: 'p1', left: '9+6', right: '15' },
        { id: 'p2', left: '8+5', right: '13' },
        { id: 'p3', left: '7+8', right: '15' },
        { id: 'p4', left: '6+9', right: '15' },
      ]),
    ], '两数相加超过 10'),

    level('math-2-06', '20 以内进位加·综合', [
      quiz('进位加挑战', [
        {
          id: 'q1',
          question: '9+8 = ?',
          options: [
            { id: 'a', label: '16' },
            { id: 'b', label: '17' },
            { id: 'c', label: '18' },
          ],
          answerId: 'b',
          speak: '九加八等于多少',
        },
        {
          id: 'q2',
          question: '6+7 = ?',
          options: [
            { id: 'a', label: '12' },
            { id: 'b', label: '13' },
            { id: 'c', label: '14' },
          ],
          answerId: 'b',
        },
        {
          id: 'q3',
          question: '5+9 = ?',
          options: [
            { id: 'a', label: '13' },
            { id: 'b', label: '14' },
            { id: 'c', label: '15' },
          ],
          answerId: 'b',
        },
        {
          id: 'q4',
          question: '8+7 = ?',
          options: [
            { id: 'a', label: '14' },
            { id: 'b', label: '15' },
            { id: 'c', label: '16' },
          ],
          answerId: 'b',
        },
      ]),
      quiz('20 以内加法', genAddSub(0, 20, ['+'], 6)),
      listenChoose(
        '听算式选答案',
        '九加九等于几',
        [
          { id: 'a', label: '17' },
          { id: 'b', label: '18' },
          { id: 'c', label: '19' },
        ],
        'b'
      ),
    ], '进位加综合训练'),

    level('math-2-07', '20 以内退位减', [
      quiz('退位减法', genAddSub(5, 18, ['-'], 6)),
      quiz('退位减挑战', [
        {
          id: 'q1',
          question: '15-7 = ?',
          options: [
            { id: 'a', label: '7' },
            { id: 'b', label: '8' },
            { id: 'c', label: '9' },
          ],
          answerId: 'b',
          speak: '十五减七等于多少',
        },
        {
          id: 'q2',
          question: '13-6 = ?',
          options: [
            { id: 'a', label: '6' },
            { id: 'b', label: '7' },
            { id: 'c', label: '8' },
          ],
          answerId: 'b',
        },
        {
          id: 'q3',
          question: '11-4 = ?',
          options: [
            { id: 'a', label: '6' },
            { id: 'b', label: '7' },
            { id: 'c', label: '8' },
          ],
          answerId: 'b',
        },
        {
          id: 'q4',
          question: '16-9 = ?',
          options: [
            { id: 'a', label: '6' },
            { id: 'b', label: '7' },
            { id: 'c', label: '8' },
          ],
          answerId: 'b',
        },
      ]),
    ], '个位不够减要退位'),

    level('math-2-08', '应用题', [
      quiz('读题算一算', [
        {
          id: 'q1',
          question: '篮子里有 8 个苹果，又买了 5 个，现在有几个？',
          options: [
            { id: 'a', label: '12 个' },
            { id: 'b', label: '13 个' },
            { id: 'c', label: '14 个' },
          ],
          answerId: 'b',
          speak: '篮子里有八个苹果又买了五个现在有几个',
        },
        {
          id: 'q2',
          question: '小明有 15 支铅笔，用掉 6 支，还剩几支？',
          options: [
            { id: 'a', label: '8 支' },
            { id: 'b', label: '9 支' },
            { id: 'c', label: '10 支' },
          ],
          answerId: 'b',
        },
        {
          id: 'q3',
          question: '树上有 12 只鸟，飞走了 5 只，还剩几只？',
          options: [
            { id: 'a', label: '6 只' },
            { id: 'b', label: '7 只' },
            { id: 'c', label: '8 只' },
          ],
          answerId: 'b',
        },
        {
          id: 'q4',
          question: '图书角有 9 本书，又放进 8 本，一共几本？',
          options: [
            { id: 'a', label: '16 本' },
            { id: 'b', label: '17 本' },
            { id: 'c', label: '18 本' },
          ],
          answerId: 'b',
        },
      ]),
      listenChoose(
        '听故事选算式',
        '盒子里有七个糖又得到三个一共几个',
        [
          { id: 'a', label: '7-3=4' },
          { id: 'b', label: '7+3=10' },
          { id: 'c', label: '3+3=6' },
        ],
        'b'
      ),
    ], '读懂文字题再计算'),

    level('math-2-09', '连加连减', [
      quiz('连加连减', [
        {
          id: 'q1',
          question: '3+2+4 = ?',
          options: [
            { id: 'a', label: '8' },
            { id: 'b', label: '9' },
            { id: 'c', label: '10' },
          ],
          answerId: 'b',
        },
        {
          id: 'q2',
          question: '10-2-3 = ?',
          options: [
            { id: 'a', label: '4' },
            { id: 'b', label: '5' },
            { id: 'c', label: '6' },
          ],
          answerId: 'b',
        },
        {
          id: 'q3',
          question: '5+3+2 = ?',
          options: [
            { id: 'a', label: '9' },
            { id: 'b', label: '10' },
            { id: 'c', label: '11' },
          ],
          answerId: 'b',
        },
        {
          id: 'q4',
          question: '18-5-4 = ?',
          options: [
            { id: 'a', label: '8' },
            { id: 'b', label: '9' },
            { id: 'c', label: '10' },
          ],
          answerId: 'b',
        },
      ]),
      quiz('连加应用', [
        {
          id: 'q5',
          question: '小红捡了 4 个贝壳，又捡 3 个，再捡 2 个，一共几个？',
          options: [
            { id: 'a', label: '8 个' },
            { id: 'b', label: '9 个' },
            { id: 'c', label: '10 个' },
          ],
          answerId: 'b',
        },
        {
          id: 'q6',
          question: '15-3-5 = ?',
          options: [
            { id: 'a', label: '6' },
            { id: 'b', label: '7' },
            { id: 'c', label: '8' },
          ],
          answerId: 'b',
        },
      ]),
    ], '从左往右依次计算'),

    level('math-2-10', '加减混合', [
      quiz('加减混合口算', genAddSub(0, 20, ['+', '-'], 8)),
      quiz('混合应用题', [
        {
          id: 'q1',
          question: '小明有 10 颗糖，吃了 3 颗又得到 5 颗，现在几颗？',
          options: [
            { id: 'a', label: '11 颗' },
            { id: 'b', label: '12 颗' },
            { id: 'c', label: '13 颗' },
          ],
          answerId: 'b',
          explain: '10-3+5=12',
        },
        {
          id: 'q2',
          question: '8+4-3 = ?',
          options: [
            { id: 'a', label: '8' },
            { id: 'b', label: '9' },
            { id: 'c', label: '10' },
          ],
          answerId: 'b',
        },
        {
          id: 'q3',
          question: '16-7+4 = ?',
          options: [
            { id: 'a', label: '12' },
            { id: 'b', label: '13' },
            { id: 'c', label: '14' },
          ],
          answerId: 'b',
        },
      ]),
      dragMatch('故事和算式', [
        { id: 'p1', left: '9个又买4个', right: '9+4' },
        { id: 'p2', left: '14个吃掉6个', right: '14-6' },
        { id: 'p3', left: '7个再加8个', right: '7+8' },
        { id: 'p4', left: '11个拿走3个', right: '11-3' },
      ]),
    ], '加减混合简单题'),
  ],
  '20以内运算、凑十与应用题'
)

/* ── U3 图形空间 ── */

const u3 = unit(
  'math-3',
  '图形空间',
  [
    level('math-3-01', '平面图形特征', [
      tapRead('平面图形朋友', [
        { id: 'c', label: '圆形', speak: '圆形', icon: '⭕', color: '#FF6B6B' },
        { id: 's', label: '正方形', speak: '正方形', icon: '⬜', color: '#4DABF7' },
        { id: 't', label: '三角形', speak: '三角形', icon: '🔺', color: '#69DB7C' },
        { id: 'r', label: '长方形', speak: '长方形', icon: '▬', color: '#FFA94D' },
      ]),
      quiz('边和角', [
        {
          id: 'q1',
          question: '三角形有几条边？几个角？',
          options: [
            { id: 'a', label: '3 条边 3 个角' },
            { id: 'b', label: '4 条边 4 个角' },
            { id: 'c', label: '没有角' },
          ],
          answerId: 'a',
          speak: '三角形有几条边几个角',
        },
        {
          id: 'q2',
          question: '正方形有几个角？',
          options: [
            { id: 'a', label: '3' },
            { id: 'b', label: '4' },
            { id: 'c', label: '5' },
          ],
          answerId: 'b',
        },
        {
          id: 'q3',
          question: '圆形有角吗？',
          options: [
            { id: 'a', label: '有' },
            { id: 'b', label: '没有' },
            { id: 'c', label: '有一个' },
          ],
          answerId: 'b',
        },
        {
          id: 'q4',
          question: '长方形和正方形都有？',
          options: [
            { id: 'a', label: '3 条边' },
            { id: 'b', label: '4 个直角' },
            { id: 'c', label: '没有角' },
          ],
          answerId: 'b',
        },
      ]),
      listenChoose(
        '听特征猜图形',
        '有三条边三个角',
        [
          { id: 'a', label: '圆形', icon: '⭕' },
          { id: 'b', label: '三角形', icon: '🔺' },
          { id: 'c', label: '正方形', icon: '⬜' },
        ],
        'b'
      ),
    ], '数边数角认图形'),

    level('math-3-02', '数一数有几个三角形', [
      quiz('图形里数三角', [
        {
          id: 'q1',
          question: '一个大三角形分成 4 个小三角，一共几个三角形？',
          options: [
            { id: 'a', label: '4 个' },
            { id: 'b', label: '5 个' },
            { id: 'c', label: '6 个' },
          ],
          answerId: 'b',
          explain: '4 个小三角 + 1 个大三角',
        },
        {
          id: 'q2',
          question: '两个三角形拼在一起，最少有几个三角形？',
          options: [
            { id: 'a', label: '1 个' },
            { id: 'b', label: '2 个' },
            { id: 'c', label: '3 个' },
          ],
          answerId: 'b',
        },
        {
          id: 'q3',
          question: '🔺🔺🔺 图中有几个三角形？',
          options: [
            { id: 'a', label: '2 个' },
            { id: 'b', label: '3 个' },
            { id: 'c', label: '4 个' },
          ],
          answerId: 'b',
        },
        {
          id: 'q4',
          question: '房子图形（🔺屋顶+⬜墙）里有几个三角形？',
          options: [
            { id: 'a', label: '0 个' },
            { id: 'b', label: '1 个' },
            { id: 'c', label: '2 个' },
          ],
          answerId: 'b',
        },
      ]),
      dragMatch('图形和边数', [
        { id: 'p1', left: '三角形', right: '3 条边' },
        { id: 'p2', left: '正方形', right: '4 条边' },
        { id: 'p3', left: '五边形', right: '5 条边' },
        { id: 'p4', left: '圆形', right: '0 条直边' },
      ]),
    ], '在组合图形里找三角形'),

    level('math-3-03', '立体图形与生活', [
      tapRead('立体图形', [
        { id: 'cube', label: '正方体', speak: '正方体', icon: '🎲' },
        { id: 'rect', label: '长方体', speak: '长方体', icon: '📦' },
        { id: 'ball', label: '球体', speak: '球体', icon: '⚽' },
        { id: 'cyl', label: '圆柱', speak: '圆柱', icon: '🥫' },
        { id: 'cone', label: '圆锥', speak: '圆锥', icon: '🍦' },
      ]),
      dragMatch('物品和立体图形', [
        { id: 'p1', left: '足球 ⚽', right: '球体' },
        { id: 'p2', left: '魔方 🎲', right: '正方体' },
        { id: 'p3', left: '易拉罐 🥫', right: '圆柱' },
        { id: 'p4', left: '冰淇淋筒 🍦', right: '圆锥' },
        { id: 'p5', left: '鞋盒 📦', right: '长方体' },
      ]),
      listenChoose(
        '听名字选立体',
        '圆柱',
        [
          { id: 'a', label: '正方体', icon: '🎲' },
          { id: 'b', label: '圆柱', icon: '🥫' },
          { id: 'c', label: '球体', icon: '⚽' },
        ],
        'b'
      ),
    ], '立体图形对应生活物品'),

    level('math-3-04', '对称', [
      tapRead('对称小发现', [
        {
          id: 'sy1',
          label: '蝴蝶',
          subLabel: '左右一样',
          speak: '蝴蝶左右两边一样，是对称的',
          icon: '🦋',
        },
        {
          id: 'sy2',
          label: '爱心',
          subLabel: '左右对称',
          speak: '爱心是左右对称的',
          icon: '❤️',
        },
        {
          id: 'sy3',
          label: '正方形',
          subLabel: '对折能重合',
          speak: '正方形对折后能重合',
          icon: '⬜',
        },
      ]),
      quiz('谁是对称的', [
        {
          id: 'q1',
          question: '下面哪个是左右对称的？',
          options: [
            { id: 'a', label: '🦋 蝴蝶' },
            { id: 'b', label: '🥾 一只鞋' },
            { id: 'c', label: '✋ 一只手' },
          ],
          answerId: 'a',
        },
        {
          id: 'q2',
          question: '对折后两边完全重合叫？',
          options: [
            { id: 'a', label: '对称' },
            { id: 'b', label: '旋转' },
            { id: 'c', label: '放大' },
          ],
          answerId: 'a',
        },
        {
          id: 'q3',
          question: '圆形对折后能重合吗？',
          options: [
            { id: 'a', label: '能' },
            { id: 'b', label: '不能' },
            { id: 'c', label: '不一定' },
          ],
          answerId: 'a',
        },
      ]),
      listenChoose(
        '听一听选对称',
        '爱心是对称的吗',
        [
          { id: 'a', label: '是对称的', icon: '❤️' },
          { id: 'b', label: '不是对称的', icon: '❌' },
        ],
        'a'
      ),
    ], '认识对称现象'),

    level('math-3-05', '方位综合', [
      tapRead('方位词', [
        { id: 'up', label: '上', speak: '上', icon: '⬆️' },
        { id: 'right', label: '右', speak: '右', icon: '➡️' },
        { id: 'down', label: '下', speak: '下', icon: '⬇️' },
        { id: 'left', label: '左', speak: '左', icon: '⬅️' },
      ]),
      quiz('谁在谁的哪边', [
        {
          id: 'q1',
          question: '🐱 在 🐶 的左边，🐰 在 🐶 的右边。🐱 在 🐰 的？',
          options: [
            { id: 'a', label: '左边' },
            { id: 'b', label: '右边' },
            { id: 'c', label: '上面' },
          ],
          answerId: 'a',
        },
        {
          id: 'q2',
          question: '面向北，右手指向？',
          options: [
            { id: 'a', label: '东' },
            { id: 'b', label: '西' },
            { id: 'c', label: '南' },
          ],
          answerId: 'a',
        },
        {
          id: 'q3',
          question: '小鸟在树的？🌳🐦（鸟在树上方）',
          options: [
            { id: 'a', label: '上面' },
            { id: 'b', label: '下面' },
            { id: 'c', label: '里面' },
          ],
          answerId: 'a',
        },
        {
          id: 'q4',
          question: '小明在小红左边，小刚在小红右边。谁在最中间？',
          options: [
            { id: 'a', label: '小明' },
            { id: 'b', label: '小红' },
            { id: 'c', label: '小刚' },
          ],
          answerId: 'b',
        },
      ]),
      listenChoose(
        '听方位选方向',
        '向左',
        [
          { id: 'a', label: '⬅️ 左' },
          { id: 'b', label: '➡️ 右' },
          { id: 'c', label: '⬆️ 上' },
        ],
        'a'
      ),
    ], '上右下左与相对位置'),
  ],
  '图形特征、立体与方位'
)

/* ── U4 生活数学 ── */

const u4 = unit(
  'math-4',
  '生活数学',
  [
    level('math-4-01', '整点与半点', [
      tapRead('整点和半点', [
        { id: 't1', label: '3 点', speak: '三点整', icon: '🕒', subLabel: '长针指 12' },
        { id: 't2', label: '6 点', speak: '六点整', icon: '🕕', subLabel: '长针指 12' },
        { id: 'h1', label: '1 点半', speak: '一点半', icon: '🕜', subLabel: '长针指 6' },
        { id: 'h2', label: '7 点半', speak: '七点半', icon: '🕢', subLabel: '长针指 6' },
      ]),
      quiz('认时间', [
        {
          id: 'q1',
          question: '短针指 7，长针指 12，是几点？',
          options: [
            { id: 'a', label: '7 点' },
            { id: 'b', label: '12 点' },
            { id: 'c', label: '6 点' },
          ],
          answerId: 'a',
        },
        {
          id: 'q2',
          question: '半点时长针指着？',
          options: [
            { id: 'a', label: '12' },
            { id: 'b', label: '6' },
            { id: 'c', label: '3' },
          ],
          answerId: 'b',
        },
        {
          id: 'q3',
          question: '短针在 4 和 5 之间，长针指 6，是？',
          options: [
            { id: 'a', label: '4 点' },
            { id: 'b', label: '4 点半' },
            { id: 'c', label: '5 点' },
          ],
          answerId: 'b',
        },
      ]),
      dragMatch('时间配对', [
        { id: 'p1', left: '🕐 短针1长针12', right: '1 点' },
        { id: 'p2', left: '🕜 短针近2长针6', right: '1 点半' },
        { id: 'p3', left: '🕕 短针6长针12', right: '6 点' },
        { id: 'p4', left: '🕡 短针近7长针6', right: '6 点半' },
      ]),
    ], '认识整点和半点'),

    level('math-4-02', '时间应用', [
      quiz('什么时候做什么', [
        {
          id: 'q1',
          question: '早上 8 点半该？',
          options: [
            { id: 'a', label: '准备上学 🎒' },
            { id: 'b', label: '上床睡觉 🛏️' },
            { id: 'c', label: '吃午饭 🍱' },
          ],
          answerId: 'a',
        },
        {
          id: 'q2',
          question: '从 3 点到 3 点半过了多久？',
          options: [
            { id: 'a', label: '15 分钟' },
            { id: 'b', label: '30 分钟' },
            { id: 'c', label: '60 分钟' },
          ],
          answerId: 'b',
        },
        {
          id: 'q3',
          question: '现在是 7 点，再过 1 小时是？',
          options: [
            { id: 'a', label: '6 点' },
            { id: 'b', label: '7 点半' },
            { id: 'c', label: '8 点' },
          ],
          answerId: 'c',
        },
        {
          id: 'q4',
          question: '中午 12 点通常？',
          options: [
            { id: 'a', label: '吃午饭' },
            { id: 'b', label: '起床' },
            { id: 'c', label: '看星星' },
          ],
          answerId: 'a',
        },
      ]),
      listenChoose(
        '听时间选活动',
        '六点半该吃晚饭了吗',
        [
          { id: 'a', label: '对，该吃晚饭了', icon: '🍽️' },
          { id: 'b', label: '不对，该睡觉了', icon: '🛏️' },
          { id: 'c', label: '不对，该上学了', icon: '🎒' },
        ],
        'a'
      ),
    ], '联系生活判断时间'),

    level('math-4-03', '人民币与找零', [
      tapRead('人民币面额', [
        { id: 'y1', label: '1 元', speak: '一元', icon: '💴' },
        { id: 'y5', label: '5 元', speak: '五元', icon: '💴' },
        { id: 'y10', label: '10 元', speak: '十元', icon: '💴' },
        { id: 'j1', label: '1 角', speak: '一角', icon: '🪙' },
        { id: 'j5', label: '5 角', speak: '五角', icon: '🪙' },
      ]),
      quiz('找零练习', [
        {
          id: 'q1',
          question: '10 元买 6 元的东西，应找回？',
          options: [
            { id: 'a', label: '3 元' },
            { id: 'b', label: '4 元' },
            { id: 'c', label: '5 元' },
          ],
          answerId: 'b',
          speak: '十元买六元的东西应找回几元',
        },
        {
          id: 'q2',
          question: '买 3 元零食，给 5 元，应找回？',
          options: [
            { id: 'a', label: '1 元' },
            { id: 'b', label: '2 元' },
            { id: 'c', label: '3 元' },
          ],
          answerId: 'b',
        },
        {
          id: 'q3',
          question: '1 元等于几角？',
          options: [
            { id: 'a', label: '5 角' },
            { id: 'b', label: '10 角' },
            { id: 'c', label: '100 角' },
          ],
          answerId: 'b',
        },
        {
          id: 'q4',
          question: '2 元 + 3 元 = ?',
          options: [
            { id: 'a', label: '4 元' },
            { id: 'b', label: '5 元' },
            { id: 'c', label: '6 元' },
          ],
          answerId: 'b',
        },
      ]),
      dragMatch('面额配对', [
        { id: 'p1', left: '1 元', right: '10 角' },
        { id: 'p2', left: '5 角', right: '半元' },
        { id: 'p3', left: '2 个 5 元', right: '10 元' },
        { id: 'p4', left: '10 个 1 角', right: '1 元' },
      ]),
    ], '认识元角与简单找零'),

    level('math-4-04', '分类统计', [
      dragMatch('按颜色分类', [
        { id: 'p1', left: '红苹果 🍎', right: '红色组' },
        { id: 'p2', left: '绿叶子 🍃', right: '绿色组' },
        { id: 'p3', left: '黄香蕉 🍌', right: '黄色组' },
        { id: 'p4', left: '蓝气球 🔵', right: '蓝色组' },
      ]),
      quiz('哪一类最多', [
        {
          id: 'q1',
          question: '🍎🍎🍎 🍌🍌 ⭐ 哪一类最多？',
          options: [
            { id: 'a', label: '苹果（3个）' },
            { id: 'b', label: '香蕉（2个）' },
            { id: 'c', label: '星星（1个）' },
          ],
          answerId: 'a',
        },
        {
          id: 'q2',
          question: '🐱🐱 🐶🐶🐶🐶 🐰 哪一类最多？',
          options: [
            { id: 'a', label: '猫' },
            { id: 'b', label: '狗' },
            { id: 'c', label: '兔' },
          ],
          answerId: 'b',
        },
        {
          id: 'q3',
          question: '统计：5 个红球、3 个蓝球、5 个黄球，哪种和红色一样多？',
          options: [
            { id: 'a', label: '蓝色' },
            { id: 'b', label: '黄色' },
            { id: 'c', label: '都不相同' },
          ],
          answerId: 'b',
        },
        {
          id: 'q4',
          question: '哪个不属于水果？',
          options: [
            { id: 'a', label: '🍊 橙子' },
            { id: 'b', label: '🍇 葡萄' },
            { id: 'c', label: '🚗 小汽车' },
          ],
          answerId: 'c',
        },
      ]),
    ], '分类后比多少'),

    level('math-4-05', '测量比较', [
      quiz('谁更长更重', [
        {
          id: 'q1',
          question: '📏 铅笔和 🖍️ 蜡笔，通常哪个更长？',
          options: [
            { id: 'a', label: '铅笔' },
            { id: 'b', label: '蜡笔' },
            { id: 'c', label: '一样长' },
          ],
          answerId: 'a',
        },
        {
          id: 'q2',
          question: '三本书摞起来和一本书，哪个更高？',
          options: [
            { id: 'a', label: '三本书' },
            { id: 'b', label: '一本书' },
            { id: 'c', label: '一样高' },
          ],
          answerId: 'a',
        },
        {
          id: 'q3',
          question: '🐘 和 🐭，哪个更重？',
          options: [
            { id: 'a', label: '大象' },
            { id: 'b', label: '老鼠' },
            { id: 'c', label: '一样重' },
          ],
          answerId: 'a',
        },
        {
          id: 'q4',
          question: '比较长短不用尺子，可以？',
          options: [
            { id: 'a', label: '放在一起比一比' },
            { id: 'b', label: '用耳朵听' },
            { id: 'c', label: '用鼻子闻' },
          ],
          answerId: 'a',
        },
      ]),
      sequence('从短到长排一排', [
        {
          id: 's1',
          prompt: '把线段从短到长排好',
          items: [
            { id: 'short', label: '短线 —' },
            { id: 'mid', label: '中线 ———' },
            { id: 'long', label: '长线 —————' },
          ],
          answerOrder: ['short', 'mid', 'long'],
        },
      ]),
    ], '直观比较长短轻重'),
  ],
  '时间、钱币、统计与测量'
)

/* ── U5 逻辑思维 ── */

const u5 = unit(
  'math-5',
  '逻辑思维',
  [
    level('math-5-01', '数字规律', [
      quiz('找规律', genPattern(5)),
      quiz('更难数字规律', [
        {
          id: 'q1',
          question: '2、4、6、8、？',
          options: [
            { id: 'a', label: '9' },
            { id: 'b', label: '10' },
            { id: 'c', label: '12' },
          ],
          answerId: 'b',
          explain: '每次加 2',
        },
        {
          id: 'q2',
          question: '5、10、15、20、？',
          options: [
            { id: 'a', label: '22' },
            { id: 'b', label: '25' },
            { id: 'c', label: '30' },
          ],
          answerId: 'b',
        },
        {
          id: 'q3',
          question: '10、8、6、4、？',
          options: [
            { id: 'a', label: '2' },
            { id: 'b', label: '3' },
            { id: 'c', label: '0' },
          ],
          answerId: 'a',
        },
        {
          id: 'q4',
          question: '1、4、7、10、？',
          options: [
            { id: 'a', label: '11' },
            { id: 'b', label: '12' },
            { id: 'c', label: '13' },
          ],
          answerId: 'c',
          explain: '每次加 3',
        },
      ]),
    ], '发现数字排列规律'),

    level('math-5-02', '图形规律', [
      sequence('按规律排队', [
        {
          id: 's1',
          prompt: '红、黄、红、黄……排出前四个',
          items: [
            { id: 'r1', label: '🔴' },
            { id: 'y1', label: '🟡' },
            { id: 'r2', label: '🔴' },
            { id: 'y2', label: '🟡' },
          ],
          answerOrder: ['r1', 'y1', 'r2', 'y2'],
        },
      ]),
      quiz('图形下一个', [
        {
          id: 'q1',
          question: '▲●▲●？ 下一个是',
          options: [
            { id: 'a', label: '▲' },
            { id: 'b', label: '●' },
            { id: 'c', label: '■' },
          ],
          answerId: 'a',
        },
        {
          id: 'q2',
          question: '大中小大中？',
          options: [
            { id: 'a', label: '大' },
            { id: 'b', label: '中' },
            { id: 'c', label: '小' },
          ],
          answerId: 'c',
        },
        {
          id: 'q3',
          question: '🔴🔴🟡🔴🔴🟡🔴🔴？',
          options: [
            { id: 'a', label: '🔴' },
            { id: 'b', label: '🟡' },
            { id: 'c', label: '🟢' },
          ],
          answerId: 'b',
        },
      ]),
      listenChoose(
        '听规律选下一个',
        '圆方圆方，下一个是圆',
        [
          { id: 'a', label: '⭕ 圆' },
          { id: 'b', label: '⬜ 方' },
          { id: 'c', label: '🔺 三角' },
        ],
        'a'
      ),
    ], '发现图形排列规律'),

    level('math-5-03', '简单推理', [
      quiz('谁最高谁最重', [
        {
          id: 'q1',
          question: '小明比小红高，小红比小刚高。谁最高？',
          options: [
            { id: 'a', label: '小明' },
            { id: 'b', label: '小红' },
            { id: 'c', label: '小刚' },
          ],
          answerId: 'a',
        },
        {
          id: 'q2',
          question: '苹果比梨重，梨比葡萄重。谁最重？',
          options: [
            { id: 'a', label: '苹果' },
            { id: 'b', label: '梨' },
            { id: 'c', label: '葡萄' },
          ],
          answerId: 'a',
        },
        {
          id: 'q3',
          question: '比 5 大、比 7 小的数是？',
          options: [
            { id: 'a', label: '4' },
            { id: 'b', label: '6' },
            { id: 'c', label: '8' },
          ],
          answerId: 'b',
        },
        {
          id: 'q4',
          question: '小明排队，前面 2 人后面 3 人，一共几人？',
          options: [
            { id: 'a', label: '5' },
            { id: 'b', label: '6' },
            { id: 'c', label: '7' },
          ],
          answerId: 'b',
          explain: '前面 2 + 自己 1 + 后面 3 = 6',
        },
      ]),
      dragMatch('条件对应结论', [
        { id: 'p1', left: '白天太阳出来', right: '天空亮' },
        { id: 'p2', left: '下雨了', right: '地面湿' },
        { id: 'p3', left: '肚子饿', right: '想吃饭' },
        { id: 'p4', left: '冬天很冷', right: '穿棉衣' },
      ]),
    ], '根据条件推理判断'),

    level('math-5-04', '等量代换', [
      tapRead('天平小故事', [
        {
          id: 'b1',
          label: '1🐔 = 2🦆',
          speak: '一只鸡等于两只鸭',
          subLabel: '可以互相替换',
        },
        {
          id: 'b2',
          label: '1🍎 = 2🍬',
          speak: '一个苹果等于两颗糖',
          subLabel: '相同可以代换',
        },
      ]),
      quiz('等量代换', [
        {
          id: 'q1',
          question: '如果 1 鸡 = 2 鸭，那么 2 鸡 = 几只鸭？',
          options: [
            { id: 'a', label: '2 只' },
            { id: 'b', label: '3 只' },
            { id: 'c', label: '4 只' },
          ],
          answerId: 'c',
        },
        {
          id: 'q2',
          question: '如果 🍎=🍬🍬，那么 🍎🍎 = 几颗糖？',
          options: [
            { id: 'a', label: '2' },
            { id: 'b', label: '3' },
            { id: 'c', label: '4' },
          ],
          answerId: 'c',
        },
        {
          id: 'q3',
          question: '1 支笔 = 2 块橡皮，2 支笔 = 几块橡皮？',
          options: [
            { id: 'a', label: '2' },
            { id: 'b', label: '3' },
            { id: 'c', label: '4' },
          ],
          answerId: 'c',
        },
        {
          id: 'q4',
          question: '⭐⭐⭐ = 🎈，⭐⭐⭐⭐⭐⭐ = 几个气球？',
          options: [
            { id: 'a', label: '1' },
            { id: 'b', label: '2' },
            { id: 'c', label: '3' },
          ],
          answerId: 'b',
        },
      ]),
      listenChoose(
        '听一听算代换',
        '一个苹果等于两颗糖，两个苹果等于几颗糖',
        [
          { id: 'a', label: '2' },
          { id: 'b', label: '3' },
          { id: 'c', label: '4' },
        ],
        'c'
      ),
    ], '相同可以互相替换'),

    level('math-5-05', '综合应用闯关', [
      quiz('规律挑战', genPattern(3)),
      quiz('比较挑战', genCompare(20, 3)),
      quiz('口算冲刺', genAddSub(0, 20, ['+', '-'], 4)),
      quiz('逻辑大闯关', [
        {
          id: 'q1',
          question: '小红有 10 颗糖，吃了 3 颗又得到 2 颗，还有？',
          options: [
            { id: 'a', label: '8' },
            { id: 'b', label: '9' },
            { id: 'c', label: '10' },
          ],
          answerId: 'b',
        },
        {
          id: 'q2',
          question: '篮子里 8 个苹果，妈妈又放 5 个，一共几个？',
          options: [
            { id: 'a', label: '12' },
            { id: 'b', label: '13' },
            { id: 'c', label: '14' },
          ],
          answerId: 'b',
        },
        {
          id: 'q3',
          question: '1 鸡 = 2 鸭，3 鸡 = 几只鸭？',
          options: [
            { id: 'a', label: '4 只' },
            { id: 'b', label: '5 只' },
            { id: 'c', label: '6 只' },
          ],
          answerId: 'c',
        },
      ]),
    ], '综合运用本册知识'),
  ],
  '规律、推理与等量代换'
)

export const math: Subject = {
  id: 'math',
  name: '数学',
  emoji: '🔢',
  color: '#3ECF8E',
  mascot: 'fox',
  description: '20以内运算、应用题与生活数学，衔接小学一年级',
  units: [u1, u2, u3, u4, u5],
}
