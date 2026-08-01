import type { Subject } from '../../engine/types'
import { tapRead, listenChoose, dragMatch, blend, quiz, sequence, readAlong, level, unit } from '../helpers'

/* ── U1 灰姑娘的钟声 ── */

const u1 = unit(
  'princess-1',
  '灰姑娘的钟声',
  [
    level(
      'princess-1-01',
      '十二点的钟声',
      [
        sequence('魔法时刻排一排', [
          {
            id: 's1',
            prompt: '把灰姑娘的一天按时间先后排一排',
            speak: '请按时间先后排一排：早上打扫，傍晚仙女出现，午夜十二点魔法消失',
            items: [
              { id: 'a', label: '早上打扫房间', icon: '🧹', speak: '早上打扫房间' },
              { id: 'b', label: '傍晚仙女变出马车', icon: '🎃', speak: '傍晚仙女变出马车' },
              { id: 'c', label: '午夜十二点魔法消失', icon: '🕛', speak: '午夜十二点魔法消失' },
            ],
            answerOrder: ['a', 'b', 'c'],
          },
        ]),
        quiz('认识钟表', [
          {
            id: 'q1',
            question: '魔法在几点消失？',
            speak: '灰姑娘的魔法在几点钟消失？',
            options: [
              { id: 'a', label: '12 点', icon: '🕛' },
              { id: 'b', label: '3 点', icon: '🕒' },
              { id: 'c', label: '6 点', icon: '🕕' },
            ],
            answerId: 'a',
            explain: '午夜十二点的钟声一响，魔法就消失了。',
          },
          {
            id: 'q2',
            question: '钟面上长长的针和短短的针都指着 12，是几点？',
            speak: '长针和短针都指着十二，是几点钟？',
            options: [
              { id: 'a', label: '12 点', icon: '🕛' },
              { id: 'b', label: '2 点', icon: '🕑' },
              { id: 'c', label: '6 点', icon: '🕕' },
            ],
            answerId: 'a',
            explain: '两根针都指着 12，就是 12 点整。',
          },
          {
            id: 'q3',
            question: '灰姑娘 9 点参加舞会，12 点离开，舞会进行了几个小时？',
            speak: '灰姑娘九点参加舞会，十二点离开，舞会进行了几个小时？',
            options: [
              { id: 'a', label: '3 小时', icon: '3️⃣' },
              { id: 'b', label: '2 小时', icon: '2️⃣' },
              { id: 'c', label: '12 小时', icon: '🔢' },
            ],
            answerId: 'a',
            explain: '从 9 点到 12 点，数一数：10、11、12，一共 3 个小时。',
          },
        ]),
      ],
      '认识钟表，赶在午夜前回家',
      ['cinderella']
    ),
    level(
      'princess-1-02',
      '一只水晶鞋',
      [
        quiz('数一数舞会上的东西', [
          {
            id: 'q1',
            question: '灰姑娘原来有 2 只水晶鞋，跑丢 1 只，还剩几只？',
            speak: '灰姑娘原来有两只水晶鞋，跑丢一只，还剩几只？',
            options: [
              { id: 'a', label: '1 只', icon: '👠' },
              { id: 'b', label: '2 只', icon: '👟' },
              { id: 'c', label: '0 只', icon: '⭕' },
            ],
            answerId: 'a',
            explain: '2 减 1 等于 1，还剩 1 只水晶鞋。',
          },
          {
            id: 'q2',
            question: '仙女把 1 个南瓜变成马车，又变出 4 匹白马，南瓜和马一共有几个？',
            speak: '一个南瓜，四匹白马，一共有几个？',
            options: [
              { id: 'a', label: '5 个', icon: '5️⃣' },
              { id: 'b', label: '4 个', icon: '4️⃣' },
              { id: 'c', label: '6 个', icon: '6️⃣' },
            ],
            answerId: 'a',
            explain: '1 加 4 等于 5。',
          },
          {
            id: 'q3',
            question: '王子捡到几只水晶鞋？',
            speak: '王子在台阶上捡到几只水晶鞋？',
            options: [
              { id: 'a', label: '1 只', icon: '👠' },
              { id: 'b', label: '2 只', icon: '👟' },
              { id: 'c', label: '3 只', icon: '🥿' },
            ],
            answerId: 'a',
            explain: '灰姑娘只落下了 1 只水晶鞋。',
          },
        ]),
        dragMatch('数量找朋友', [
          { id: 'p1', left: '水晶鞋', right: '1 只', leftIcon: '👠' },
          { id: 'p2', left: '南瓜马车', right: '1 辆', leftIcon: '🎃' },
          { id: 'p3', left: '白马', right: '4 匹', leftIcon: '🐴' },
          { id: 'p4', left: '钟声', right: '12 下', leftIcon: '🔔' },
        ], '把物品和它的数量连起来'),
      ],
      '2 减 1 等于 1，只剩一只水晶鞋',
      ['cinderella']
    ),
    level(
      'princess-1-03',
      '魔法单词屋',
      [
        tapRead('仙女教单词', [
          { id: 'e1', label: 'shoe', subLabel: '鞋子', speak: 'shoe', speakLang: 'en-US', icon: '👠' },
          { id: 'e2', label: 'dress', subLabel: '连衣裙', speak: 'dress', speakLang: 'en-US', icon: '👗' },
          { id: 'e3', label: 'pumpkin', subLabel: '南瓜', speak: 'pumpkin', speakLang: 'en-US', icon: '🎃' },
        ], '点一点，跟仙女读英语单词'),
        blend('拼出魔法单词', [
          { id: 'b1', parts: ['sh', 'oe'], result: 'shoe', speak: 'shoe', speakLang: 'en-US' },
          { id: 'b2', parts: ['dr', 'ess'], result: 'dress', speak: 'dress', speakLang: 'en-US' },
          { id: 'b3', parts: ['pump', 'kin'], result: 'pumpkin', speak: 'pumpkin', speakLang: 'en-US' },
        ]),
        listenChoose(
          '听单词找宝物',
          'shoe',
          [
            { id: 'a', label: '水晶鞋', icon: '👠', speak: 'shoe' },
            { id: 'b', label: '连衣裙', icon: '👗', speak: 'dress' },
            { id: 'c', label: '南瓜', icon: '🎃', speak: 'pumpkin' },
          ],
          'a',
          { promptLang: 'en-US', promptLabel: '听英语单词' }
        ),
      ],
      'shoe、dress、pumpkin，魔法单词记一记',
      ['aurora']
    ),
    level(
      'princess-1-04',
      '善良的心',
      [
        listenChoose(
          '谁做得对',
          '小动物饿了，灰姑娘把自己的面包分给它们吃，这样做对吗？请选出善良的做法',
          [
            { id: 'a', label: '分面包给小动物', icon: '🍞', speak: '分面包给小动物' },
            { id: 'b', label: '把面包藏起来', icon: '🙈', speak: '把面包藏起来' },
            { id: 'c', label: '赶走小动物', icon: '💢', speak: '赶走小动物' },
          ],
          'a'
        ),
        quiz('善良小判断', [
          {
            id: 'q1',
            question: '姐姐们嘲笑灰姑娘时，她应该怎么做？',
            speak: '姐姐们嘲笑灰姑娘的时候，她应该怎么做？',
            options: [
              { id: 'a', label: '保持友善，不吵架', icon: '😊' },
              { id: 'b', label: '大声骂回去', icon: '😡' },
              { id: 'c', label: '弄坏姐姐的裙子', icon: '✂️' },
            ],
            answerId: 'a',
            explain: '善良不是软弱，是不对别人做坏事。',
          },
          {
            id: 'q2',
            question: '灰姑娘当上王妃后，怎样对待姐姐们？',
            speak: '故事的最后，灰姑娘怎样对待姐姐们？',
            options: [
              { id: 'a', label: '原谅她们', icon: '🤝' },
              { id: 'b', label: '惩罚她们', icon: '⚔️' },
              { id: 'c', label: '赶走她们', icon: '🚪' },
            ],
            answerId: 'a',
            explain: '灰姑娘选择原谅，善良的心最闪亮。',
          },
        ]),
      ],
      '善良是最美的魔法',
      ['belle']
    ),
  ],
  '南瓜马车、水晶鞋，还有十二点的钟声'
)

/* ── U2 小美人鱼的海底 ── */

const u2 = unit(
  'princess-2',
  '小美人鱼的海底',
  [
    level(
      'princess-2-01',
      '海底朋友点名',
      [
        tapRead('认识海底朋友', [
          { id: 's1', label: '小鱼', speak: '小鱼，摇着尾巴游啊游', icon: '🐟' },
          { id: 's2', label: '海龟', speak: '海龟，慢慢游，活得很久很久', icon: '🐢' },
          { id: 's3', label: '海马', speak: '海马，头像马，住在海里', icon: '🌊' },
          { id: 's4', label: '珊瑚', speak: '珊瑚，海底的小花园', icon: '🪸' },
        ], '点一点，认识小美人鱼的朋友'),
        listenChoose(
          '听声音找朋友',
          '它有硬硬的壳，游得慢慢的，能活一百岁，它是谁？',
          [
            { id: 'a', label: '海龟', icon: '🐢', speak: '海龟' },
            { id: 'b', label: '小鱼', icon: '🐟', speak: '小鱼' },
            { id: 'c', label: '海马', icon: '🌊', speak: '海马' },
          ],
          'a'
        ),
      ],
      '小鱼、海龟、海马和珊瑚',
      ['mermaid']
    ),
    level(
      'princess-2-02',
      '珍珠比大小',
      [
        quiz('哪颗珍珠大', [
          {
            id: 'q1',
            question: '大蚌壳里有 5 颗珍珠，小蚌壳里有 3 颗，哪个蚌壳的珍珠多？',
            speak: '大蚌壳里有五颗珍珠，小蚌壳里有三颗，哪个蚌壳的珍珠多？',
            options: [
              { id: 'a', label: '大蚌壳', icon: '🦪' },
              { id: 'b', label: '小蚌壳', icon: '🐚' },
              { id: 'c', label: '一样多', icon: '➖' },
            ],
            answerId: 'a',
            explain: '5 比 3 大，所以大蚌壳里的珍珠多。',
          },
          {
            id: 'q2',
            question: '一颗珍珠占 2 格，另一颗占 6 格，哪颗更大？',
            speak: '一颗珍珠占两格，另一颗占六格，哪颗珍珠更大？',
            options: [
              { id: 'a', label: '占 6 格的', icon: '6️⃣' },
              { id: 'b', label: '占 2 格的', icon: '2️⃣' },
              { id: 'c', label: '一样大', icon: '➖' },
            ],
            answerId: 'a',
            explain: '6 比 2 大，占 6 格的珍珠更大。',
          },
        ]),
        sequence('珍珠从小到大排队', [
          {
            id: 's1',
            prompt: '把珍珠按从小到大排一排',
            speak: '请把珍珠按从小到大排一排：两颗、四颗、六颗',
            items: [
              { id: 'a', label: '2 颗珍珠', icon: '⚪', speak: '两颗' },
              { id: 'b', label: '4 颗珍珠', icon: '⚪', speak: '四颗' },
              { id: 'c', label: '6 颗珍珠', icon: '⚪', speak: '六颗' },
            ],
            answerOrder: ['a', 'b', 'c'],
          },
        ]),
      ],
      '比一比，哪颗珍珠大',
      ['mermaid']
    ),
    level(
      'princess-2-03',
      '贝壳数数歌',
      [
        quiz('帮小美人鱼数贝壳', [
          {
            id: 'q1',
            question: '沙滩上有 3 个白贝壳和 2 个粉贝壳，一共有几个？',
            speak: '沙滩上有三个白贝壳和两个粉贝壳，一共有几个贝壳？',
            options: [
              { id: 'a', label: '5 个', icon: '5️⃣' },
              { id: 'b', label: '4 个', icon: '4️⃣' },
              { id: 'c', label: '6 个', icon: '6️⃣' },
            ],
            answerId: 'a',
            explain: '3 加 2 等于 5。',
          },
          {
            id: 'q2',
            question: '小美人鱼有 7 个贝壳，送给朋友 2 个，还剩几个？',
            speak: '小美人鱼有七个贝壳，送给朋友两个，还剩几个？',
            options: [
              { id: 'a', label: '5 个', icon: '5️⃣' },
              { id: 'b', label: '9 个', icon: '9️⃣' },
              { id: 'c', label: '2 个', icon: '2️⃣' },
            ],
            answerId: 'a',
            explain: '7 减 2 等于 5。',
          },
        ]),
        sequence('按数量捡贝壳', [
          {
            id: 's1',
            prompt: '按 1、2、3、4 的顺序捡贝壳',
            speak: '请按一二三四的顺序捡贝壳',
            items: [
              { id: 'a', label: '1 个贝壳', icon: '🐚', speak: '一个' },
              { id: 'b', label: '2 个贝壳', icon: '🐚', speak: '两个' },
              { id: 'c', label: '3 个贝壳', icon: '🐚', speak: '三个' },
              { id: 'd', label: '4 个贝壳', icon: '🐚', speak: '四个' },
            ],
            answerOrder: ['a', 'b', 'c', 'd'],
          },
        ]),
      ],
      '数一数，贝壳有几个',
      ['aurora']
    ),
    level(
      'princess-2-04',
      '勇敢与分享',
      [
        quiz('勇气小选择', [
          {
            id: 'q1',
            question: '看到王子掉进海里，小美人鱼应该怎么做？',
            speak: '看到王子掉进海里，小美人鱼应该怎么做？',
            options: [
              { id: 'a', label: '勇敢地游过去救他', icon: '🌊' },
              { id: 'b', label: '假装没看见', icon: '🙈' },
              { id: 'c', label: '躲到珊瑚后面', icon: '🪸' },
            ],
            answerId: 'a',
            explain: '勇敢不是不害怕，是害怕了还愿意帮忙。',
          },
          {
            id: 'q2',
            question: '小美人鱼捡到一颗漂亮的珍珠，好朋友也很喜欢，她可以怎么做？',
            speak: '小美人鱼捡到一颗漂亮的珍珠，好朋友也很喜欢，她可以怎么做？',
            options: [
              { id: 'a', label: '和好朋友一起分享', icon: '🤲' },
              { id: 'b', label: '藏起来不给任何人看', icon: '🎁' },
              { id: 'c', label: '扔到海沟里去', icon: '🕳️' },
            ],
            answerId: 'a',
            explain: '分享会让快乐变成双份。',
          },
        ]),
        readAlong(
          '分享小诗',
          '大海的歌',
          [
            { id: 'l1', text: '小鱼小鱼游过来', speak: '小鱼小鱼游过来' },
            { id: 'l2', text: '贝壳贝壳分你一半', speak: '贝壳贝壳分你一半' },
            { id: 'l3', text: '勇敢的心不怕浪', speak: '勇敢的心不怕浪' },
            { id: 'l4', text: '分享的快乐最闪亮', speak: '分享的快乐最闪亮' },
          ],
          '点句子，跟着读一读'
        ),
      ],
      '勇敢救人，快乐分享',
      ['belle']
    ),
  ],
  '潜入海底，和小美人鱼一起探险'
)

/* ── U3 白雪公主与长发公主 ── */

const u3 = unit(
  'princess-3',
  '白雪公主与长发公主',
  [
    level(
      'princess-3-01',
      '有礼貌的小木屋',
      [
        readAlong(
          '礼貌用语跟读',
          '小木屋的礼貌歌',
          [
            { id: 'l1', text: '进门先说“你们好”', speak: '进门先说，你们好' },
            { id: 'l2', text: '请人帮忙说声“请”', speak: '请人帮忙说声，请' },
            { id: 'l3', text: '收到帮助说“谢谢”', speak: '收到帮助说，谢谢' },
            { id: 'l4', text: '做错事情说“对不起”', speak: '做错事情说，对不起' },
          ],
          '点句子，学白雪公主说礼貌话'
        ),
        quiz('礼貌小场景', [
          {
            id: 'q1',
            question: '白雪公主想喝小矮人递来的水，接过水杯时应该说什么？',
            speak: '接过小矮人递来的水杯，应该说什么？',
            options: [
              { id: 'a', label: '谢谢', icon: '🙏' },
              { id: 'b', label: '快点', icon: '💢' },
              { id: 'c', label: '什么都不说', icon: '🤐' },
            ],
            answerId: 'a',
            explain: '收到帮助要说“谢谢”。',
          },
          {
            id: 'q2',
            question: '不小心碰倒了小矮人的椅子，应该说什么？',
            speak: '不小心碰倒了小矮人的椅子，应该说什么？',
            options: [
              { id: 'a', label: '对不起', icon: '🙇' },
              { id: 'b', label: '不是我', icon: '🙅' },
              { id: 'c', label: '哈哈大笑', icon: '😆' },
            ],
            answerId: 'a',
            explain: '做错事情要主动说“对不起”。',
          },
        ]),
      ],
      '请、谢谢、对不起',
      ['snowwhite']
    ),
    level(
      'princess-3-02',
      '七个小矮人',
      [
        quiz('小矮人加减法', [
          {
            id: 'q1',
            question: '7 个小矮人里，2 个去山里采矿，还剩几个在家？',
            speak: '七个小矮人里，两个去山里采矿，还剩几个在家？',
            options: [
              { id: 'a', label: '5 个', icon: '5️⃣' },
              { id: 'b', label: '7 个', icon: '7️⃣' },
              { id: 'c', label: '9 个', icon: '9️⃣' },
            ],
            answerId: 'a',
            explain: '7 减 2 等于 5。',
          },
          {
            id: 'q2',
            question: '3 个小矮人在扫地，4 个在做饭，一共有几个小矮人？',
            speak: '三个小矮人在扫地，四个在做饭，一共有几个小矮人？',
            options: [
              { id: 'a', label: '7 个', icon: '7️⃣' },
              { id: 'b', label: '6 个', icon: '6️⃣' },
              { id: 'c', label: '8 个', icon: '8️⃣' },
            ],
            answerId: 'a',
            explain: '3 加 4 等于 7，正好七个小矮人。',
          },
          {
            id: 'q3',
            question: '白雪公主做了 8 个苹果派，小矮人吃掉 3 个，还剩几个？',
            speak: '白雪公主做了八个苹果派，小矮人吃掉三个，还剩几个？',
            options: [
              { id: 'a', label: '5 个', icon: '🥧' },
              { id: 'b', label: '11 个', icon: '🔢' },
              { id: 'c', label: '3 个', icon: '3️⃣' },
            ],
            answerId: 'a',
            explain: '8 减 3 等于 5。',
          },
        ]),
        sequence('小矮人排队去采矿', [
          {
            id: 's1',
            prompt: '按 4、5、6、7 的顺序给小矮人排队',
            speak: '请按四五六七的顺序给小矮人排队',
            items: [
              { id: 'a', label: '第 4 个', icon: '⛏️', speak: '第四个' },
              { id: 'b', label: '第 5 个', icon: '⛏️', speak: '第五个' },
              { id: 'c', label: '第 6 个', icon: '⛏️', speak: '第六个' },
              { id: 'd', label: '第 7 个', icon: '⛏️', speak: '第七个' },
            ],
            answerOrder: ['a', 'b', 'c', 'd'],
          },
        ]),
      ],
      '3 加 4 等于 7，正好七个小矮人',
      ['snowwhite']
    ),
    level(
      'princess-3-03',
      '高塔英语角',
      [
        tapRead('长发公主教单词', [
          { id: 'e1', label: 'apple', subLabel: '苹果', speak: 'apple', speakLang: 'en-US', icon: '🍎' },
          { id: 'e2', label: 'hair', subLabel: '头发', speak: 'hair', speakLang: 'en-US', icon: '💇' },
          { id: 'e3', label: 'tower', subLabel: '高塔', speak: 'tower', speakLang: 'en-US', icon: '🗼' },
        ], '点一点，跟着读英语单词'),
        blend('拼出高塔单词', [
          { id: 'b1', parts: ['ap', 'ple'], result: 'apple', speak: 'apple', speakLang: 'en-US' },
          { id: 'b2', parts: ['h', 'air'], result: 'hair', speak: 'hair', speakLang: 'en-US' },
          { id: 'b3', parts: ['tow', 'er'], result: 'tower', speak: 'tower', speakLang: 'en-US' },
        ]),
        listenChoose(
          '听单词找图片',
          'tower',
          [
            { id: 'a', label: '高塔', icon: '🗼', speak: 'tower' },
            { id: 'b', label: '苹果', icon: '🍎', speak: 'apple' },
            { id: 'c', label: '长发', icon: '💇', speak: 'hair' },
          ],
          'a',
          { promptLang: 'en-US', promptLabel: '听英语单词' }
        ),
      ],
      'apple、hair、tower，高塔上学英语',
      ['rapunzel']
    ),
    level(
      'princess-3-04',
      '诚实与友谊大考验',
      [
        quiz('诚实小判断', [
          {
            id: 'q1',
            question: '长发公主想去看天灯，她应该怎么做？',
            speak: '长发公主想去看天灯，她应该怎么做？',
            options: [
              { id: 'a', label: '把心愿诚实地说出来', icon: '💬' },
              { id: 'b', label: '撒谎骗妈妈', icon: '🤥' },
              { id: 'c', label: '偷偷溜走不告诉任何人', icon: '🫣' },
            ],
            answerId: 'a',
            explain: '诚实地说出心愿，别人才能帮助你。',
          },
          {
            id: 'q2',
            question: '好朋友不小心弄坏了你的画笔，他主动承认，你应该？',
            speak: '好朋友不小心弄坏了你的画笔，主动承认错误，你应该怎么做？',
            options: [
              { id: 'a', label: '原谅他，还是好朋友', icon: '🤝' },
              { id: 'b', label: '再也不理他', icon: '😤' },
              { id: 'c', label: '弄坏他的东西报复', icon: '💥' },
            ],
            answerId: 'a',
            explain: '诚实的朋友值得原谅，友谊最珍贵。',
          },
        ]),
        listenChoose(
          '综合大复习',
          '七个小矮人去采矿，两个先回家，还剩几个在采矿？',
          [
            { id: 'a', label: '5 个', icon: '5️⃣', speak: '五个' },
            { id: 'b', label: '7 个', icon: '7️⃣', speak: '七个' },
            { id: 'c', label: '2 个', icon: '2️⃣', speak: '两个' },
          ],
          'a'
        ),
      ],
      '诚实与友谊，童话的最后一课',
      ['rapunzel']
    ),
  ],
  '礼貌、加减法、英语单词，和公主们一起学'
)

export const princess: Subject = {
  id: 'princess',
  name: '公主奇遇',
  emoji: '👸',
  color: '#F06292',
  mascot: 'princess',
  description: '走进城堡，开启勇敢与善良的公主奇遇',
  units: [u1, u2, u3],
}
