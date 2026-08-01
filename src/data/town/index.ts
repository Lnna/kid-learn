import type { Subject } from '../../engine/types'
import { tapRead, listenChoose, dragMatch, quiz, sequence, blend, readAlong, level, unit } from '../helpers'

const EN = 'en-US'

/* ── U1 神奇形容词 ── */

const u1 = unit(
  'town-1',
  '神奇形容词',
  [
    level(
      'town-1-01',
      '会说话的形容词',
      [
        tapRead('形容词朋友来啦', [
          { id: 'a1', label: '高高的', subLabel: '高高的楼房', speak: '高高的，像长颈鹿的脖子', icon: '🏢' },
          { id: 'a2', label: '红红的', subLabel: '红红的屋顶', speak: '红红的，像熟透的苹果', icon: '🔴' },
          { id: 'a3', label: '尖尖的', subLabel: '尖尖的塔顶', speak: '尖尖的，像小塔的尖顶', icon: '🗼' },
          { id: 'a4', label: '圆圆的', subLabel: '圆圆的窗户', speak: '圆圆的，像大皮球', icon: '🟡' },
        ], '点一点，听一听形容词'),
        listenChoose(
          '听描述找房子',
          '请找出「尖尖的屋顶」的房子',
          [
            { id: 'a', label: '尖尖的屋顶', icon: '🗼', speak: '尖尖的屋顶' },
            { id: 'b', label: '方方的屋顶', icon: '🏢', speak: '方方的屋顶' },
            { id: 'c', label: '平平的屋顶', icon: '🏚️', speak: '平平的屋顶' },
          ],
          'a'
        ),
        quiz('形容词小裁判', [
          {
            id: 'q1',
            question: '小狐狸说：「这座楼房真高呀！」哪个词说出了楼房的样子？',
            speak: '小狐狸说：这座楼房真高呀！哪个词说出了楼房的样子？',
            options: [
              { id: 'a', label: '高高的', icon: '🏢' },
              { id: 'b', label: '香香的', icon: '🍞' },
              { id: 'c', label: '快快的', icon: '💨' },
            ],
            answerId: 'a',
            explain: '「高高的」说出了楼房的样子，是形容词。',
          },
          {
            id: 'q2',
            question: '「红红的苹果」里，哪个词是形容词？',
            speak: '红红的苹果里，哪个词是形容词？',
            options: [
              { id: 'a', label: '红红的', icon: '🍎' },
              { id: 'b', label: '苹果', icon: '🍏' },
              { id: 'c', label: '一个', icon: '1️⃣' },
            ],
            answerId: 'a',
            explain: '「红红的」说出了苹果的颜色。',
          },
          {
            id: 'q3',
            question: '想夸一夸小镇的小桥，可以说？',
            speak: '想夸一夸小镇的小桥，可以说？',
            options: [
              { id: 'a', label: '弯弯的小桥', icon: '🌉' },
              { id: 'b', label: '吃小桥', icon: '🍽️' },
              { id: 'c', label: '跑小桥', icon: '🏃' },
            ],
            answerId: 'a',
            explain: '「弯弯的」让小桥的样子一下子出现在眼前。',
          },
        ]),
      ],
      '给房子选一顶合适的形容词帽子',
      ['cottage']
    ),
    level(
      'town-1-02',
      '量词小街',
      [
        tapRead('量词宝宝排排坐', [
          { id: 'm1', label: '一座', subLabel: '一座房子', speak: '一座房子', icon: '🏠' },
          { id: 'm2', label: '一棵', subLabel: '一棵树', speak: '一棵树', icon: '🌳' },
          { id: 'm3', label: '一条', subLabel: '一条小路', speak: '一条小路', icon: '🛤️' },
          { id: 'm4', label: '一盏', subLabel: '一盏路灯', speak: '一盏路灯', icon: '💡' },
        ], '点一点，认识量词'),
        dragMatch('量词找朋友', [
          { id: 'p1', left: '一座', right: '房子', leftIcon: '1️⃣', rightIcon: '🏠' },
          { id: 'p2', left: '一棵', right: '树', leftIcon: '1️⃣', rightIcon: '🌳' },
          { id: 'p3', left: '一条', right: '小路', leftIcon: '1️⃣', rightIcon: '🛤️' },
          { id: 'p4', left: '一盏', right: '路灯', leftIcon: '1️⃣', rightIcon: '💡' },
        ], '把量词和它的好朋友连起来'),
        quiz('量词小能手', [
          {
            id: 'q1',
            question: '一__小路，横线上填哪个量词？',
            speak: '一什么小路？请选出正确的量词',
            options: [
              { id: 'a', label: '条', icon: '🛤️' },
              { id: 'b', label: '座', icon: '🏠' },
              { id: 'c', label: '棵', icon: '🌳' },
            ],
            answerId: 'a',
            explain: '一条小路，小路长长的，用「条」。',
          },
          {
            id: 'q2',
            question: '一__大树，横线上填哪个量词？',
            speak: '一什么大树？请选出正确的量词',
            options: [
              { id: 'a', label: '棵', icon: '🌳' },
              { id: 'b', label: '条', icon: '🐟' },
              { id: 'c', label: '盏', icon: '💡' },
            ],
            answerId: 'a',
            explain: '一棵树，花草树木都用「棵」。',
          },
          {
            id: 'q3',
            question: '一__信箱，横线上填哪个量词？',
            speak: '一什么信箱？请选出正确的量词',
            options: [
              { id: 'a', label: '个', icon: '📮' },
              { id: 'b', label: '棵', icon: '🌳' },
              { id: 'c', label: '条', icon: '🛤️' },
            ],
            answerId: 'a',
            explain: '一个信箱，「个」是用得最多的量词。',
          },
        ]),
      ],
      '一座房子、一棵树、一条小路',
      ['tree']
    ),
    level(
      'town-1-03',
      '彩色粉刷匠',
      [
        tapRead('颜色英文读一读', [
          { id: 'c1', label: 'red', subLabel: '红色', speak: 'red', speakLang: EN, icon: '🔴' },
          { id: 'c2', label: 'blue', subLabel: '蓝色', speak: 'blue', speakLang: EN, icon: '🔵' },
          { id: 'c3', label: 'yellow', subLabel: '黄色', speak: 'yellow', speakLang: EN, icon: '🟡' },
        ], '点一点，读一读颜色的英文名'),
        listenChoose(
          '听英语选颜色',
          'red',
          [
            { id: 'a', label: '红色', icon: '🔴', speak: '红色 red' },
            { id: 'b', label: '蓝色', icon: '🔵', speak: '蓝色 blue' },
            { id: 'c', label: '黄色', icon: '🟡', speak: '黄色 yellow' },
          ],
          'a',
          { promptLang: EN, promptLabel: 'red' }
        ),
        quiz('粉刷匠考考你', [
          {
            id: 'q1',
            question: '花坛里的玫瑰花是 red，玫瑰花是什么颜色？',
            speak: '花坛里的玫瑰花是 red，玫瑰花是什么颜色？',
            options: [
              { id: 'a', label: '红色', icon: '🔴' },
              { id: 'b', label: '蓝色', icon: '🔵' },
              { id: 'c', label: '黄色', icon: '🟡' },
            ],
            answerId: 'a',
            explain: 'red 就是红色。',
          },
          {
            id: 'q2',
            question: '小镇的天空是 blue，天空是什么颜色？',
            speak: '小镇的天空是 blue，天空是什么颜色？',
            options: [
              { id: 'a', label: '蓝色', icon: '🔵' },
              { id: 'b', label: '红色', icon: '🔴' },
              { id: 'c', label: '绿色', icon: '🟢' },
            ],
            answerId: 'a',
            explain: 'blue 就是蓝色。',
          },
          {
            id: 'q3',
            question: '面包房卖的香蕉是 yellow，香蕉是什么颜色？',
            speak: '面包房卖的香蕉是 yellow，香蕉是什么颜色？',
            options: [
              { id: 'a', label: '黄色', icon: '🟡' },
              { id: 'b', label: '蓝色', icon: '🔵' },
              { id: 'c', label: '红色', icon: '🔴' },
            ],
            answerId: 'a',
            explain: 'yellow 就是黄色。',
          },
        ]),
      ],
      'red、blue、yellow 刷房子',
      ['flowerbed']
    ),
    level(
      'town-1-04',
      '寄出第一张明信片',
      [
        sequence('把句子排整齐', [
          {
            id: 's1',
            prompt: '帮小狐狸把明信片上的句子排好',
            speak: '请把句子排一排：一座红红的房子',
            items: [
              { id: 'a', label: '一座', icon: '1️⃣' },
              { id: 'b', label: '红红的', icon: '🔴' },
              { id: 'c', label: '房子', icon: '🏠' },
            ],
            answerOrder: ['a', 'b', 'c'],
          },
          {
            id: 's2',
            prompt: '再排一句，夸夸小镇的树',
            speak: '请把句子排一排：一棵高高的树',
            items: [
              { id: 'a', label: '一棵', icon: '1️⃣' },
              { id: 'b', label: '高高的', icon: '🌲' },
              { id: 'c', label: '树', icon: '🌳' },
            ],
            answerOrder: ['a', 'b', 'c'],
          },
        ]),
        readAlong('小镇儿歌', '我的小镇', [
          { id: 'l1', text: '一座小房红红的顶，', speak: '一座小房红红的顶' },
          { id: 'l2', text: '一棵大树绿绿的伞。', speak: '一棵大树绿绿的伞' },
          { id: 'l3', text: '一条小路弯弯的腰，', speak: '一条小路弯弯的腰' },
          { id: 'l4', text: '我的小镇真好看！', speak: '我的小镇真好看' },
        ]),
        quiz('明信片小作家', [
          {
            id: 'q1',
            question: '「一__弯弯的小桥」，横线上填？',
            speak: '一什么弯弯的小桥？请选出正确的量词',
            options: [
              { id: 'a', label: '座', icon: '🌉' },
              { id: 'b', label: '棵', icon: '🌳' },
              { id: 'c', label: '盏', icon: '💡' },
            ],
            answerId: 'a',
            explain: '一座弯弯的小桥。',
          },
          {
            id: 'q2',
            question: '想告诉朋友「我的小镇很美」，哪句话用了形容词？',
            speak: '哪句话用了形容词来夸小镇？',
            options: [
              { id: 'a', label: '美美的小镇', icon: '🌸' },
              { id: 'b', label: '跑小镇', icon: '🏃' },
              { id: 'c', label: '吃小镇', icon: '🍽️' },
            ],
            answerId: 'a',
            explain: '「美美的」是形容词，让小镇变得更可爱了。',
          },
        ]),
      ],
      '形容词和量词一起用',
      ['mailbox']
    ),
  ],
  '会说话的房子，会排队的事物'
)

/* ── U2 小镇规划师 ── */

const u2 = unit(
  'town-2',
  '小镇规划师',
  [
    level(
      'town-2-01',
      '面包房分面包',
      [
        tapRead('面包出炉啦', [
          { id: 'b1', label: '5 个面包', subLabel: '分给 2 只小动物', speak: '五个面包，分给两只小动物', icon: '🍞' },
          { id: 'b2', label: '2 和 3', subLabel: '5 可以分成 2 和 3', speak: '五可以分成二和三', icon: '🥖' },
          { id: 'b3', label: '1 和 4', subLabel: '5 可以分成 1 和 4', speak: '五可以分成一和四', icon: '🥐' },
        ], '点一点，看看 5 的分解'),
        quiz('分面包小帮手', [
          {
            id: 'q1',
            question: '5 个面包，小兔分 2 个，小松鼠分几个？',
            speak: '五个面包，小兔分两个，小松鼠分几个？',
            options: [
              { id: 'a', label: '3 个', icon: '🍞' },
              { id: 'b', label: '2 个', icon: '🥖' },
              { id: 'c', label: '4 个', icon: '🥐' },
            ],
            answerId: 'a',
            explain: '5 可以分成 2 和 3。',
          },
          {
            id: 'q2',
            question: '5 个面包，小猫分 1 个，还剩几个？',
            speak: '五个面包，小猫分一个，还剩几个？',
            options: [
              { id: 'a', label: '4 个', icon: '🍞' },
              { id: 'b', label: '3 个', icon: '🥖' },
              { id: 'c', label: '5 个', icon: '🥐' },
            ],
            answerId: 'a',
            explain: '5 可以分成 1 和 4。',
          },
          {
            id: 'q3',
            question: '4 个面包分成一样多的两份，每份几个？',
            speak: '四个面包分成一样多的两份，每份几个？',
            options: [
              { id: 'a', label: '2 个', icon: '🍞' },
              { id: 'b', label: '1 个', icon: '🥖' },
              { id: 'c', label: '3 个', icon: '🥐' },
            ],
            answerId: 'a',
            explain: '4 可以分成 2 和 2，两份一样多。',
          },
        ]),
        listenChoose(
          '听一听，分一分',
          '面包房里有 5 个面包，小狐狸吃掉 3 个，还剩几个？',
          [
            { id: 'a', label: '2 个', icon: '🍞', speak: '两个' },
            { id: 'b', label: '3 个', icon: '🥖', speak: '三个' },
            { id: 'c', label: '5 个', icon: '🥐', speak: '五个' },
          ],
          'a'
        ),
      ],
      '5 可以分成几和几',
      ['bakery']
    ),
    level(
      'town-2-02',
      '房屋的图形密码',
      [
        tapRead('房子上的图形', [
          { id: 's1', label: '圆形', subLabel: '圆圆的窗户', speak: '圆形，圆圆的窗户', icon: '⭕' },
          { id: 's2', label: '正方形', subLabel: '方方的门', speak: '正方形，方方的门', icon: '🟦' },
          { id: 's3', label: '三角形', subLabel: '尖尖的屋顶', speak: '三角形，尖尖的屋顶', icon: '🔺' },
          { id: 's4', label: '长方形', subLabel: '长长的墙', speak: '长方形，长长的墙', icon: '🧱' },
        ], '点一点，找一找房子上的图形'),
        dragMatch('图形回家', [
          { id: 'p1', left: '圆圆的窗户', right: '圆形', leftIcon: '🪟', rightIcon: '⭕' },
          { id: 'p2', left: '方方的门', right: '正方形', leftIcon: '🚪', rightIcon: '🟦' },
          { id: 'p3', left: '尖尖的屋顶', right: '三角形', leftIcon: '🏠', rightIcon: '🔺' },
          { id: 'p4', left: '长长的墙', right: '长方形', leftIcon: '🧱', rightIcon: '🟧' },
        ], '把房子的部位和图形配配对'),
        quiz('图形小侦探', [
          {
            id: 'q1',
            question: '学校钟楼的钟面是什么形状？',
            speak: '学校钟楼的钟面是什么形状？',
            options: [
              { id: 'a', label: '圆形', icon: '⭕' },
              { id: 'b', label: '三角形', icon: '🔺' },
              { id: 'c', label: '正方形', icon: '🟦' },
            ],
            answerId: 'a',
            explain: '钟面圆圆的，是圆形。',
          },
          {
            id: 'q2',
            question: '尖尖的屋顶像什么图形？',
            speak: '尖尖的屋顶像什么图形？',
            options: [
              { id: 'a', label: '三角形', icon: '🔺' },
              { id: 'b', label: '圆形', icon: '⭕' },
              { id: 'c', label: '长方形', icon: '🧱' },
            ],
            answerId: 'a',
            explain: '屋顶尖尖的，有三条边，是三角形。',
          },
          {
            id: 'q3',
            question: '小屋的门通常是什么形状？',
            speak: '小屋的门通常是什么形状？',
            options: [
              { id: 'a', label: '长方形', icon: '🚪' },
              { id: 'b', label: '圆形', icon: '⭕' },
              { id: 'c', label: '三角形', icon: '🔺' },
            ],
            answerId: 'a',
            explain: '门高高的、方方的，是长方形。',
          },
        ]),
      ],
      '圆窗、方门、三角屋顶',
      ['school']
    ),
    level(
      'town-2-03',
      '小镇摆摆看',
      [
        sequence('按方位摆一摆', [
          {
            id: 's1',
            prompt: '学校在公园的左边，请从左到右排一排',
            speak: '学校在公园的左边，请把学校和公园从左到右排一排',
            items: [
              { id: 'a', label: '学校', icon: '🏫', speak: '学校' },
              { id: 'b', label: '公园', icon: '🏞️', speak: '公园' },
            ],
            answerOrder: ['a', 'b'],
          },
          {
            id: 's2',
            prompt: '学校在最左边，面包房在中间，公园在最右边',
            speak: '请把学校、面包房、公园，按照左边、中间、右边排一排',
            items: [
              { id: 'a', label: '学校', icon: '🏫', speak: '学校' },
              { id: 'b', label: '面包房', icon: '🥖', speak: '面包房' },
              { id: 'c', label: '公园', icon: '🏞️', speak: '公园' },
            ],
            answerOrder: ['a', 'b', 'c'],
          },
        ]),
        quiz('方位小达人', [
          {
            id: 'q1',
            question: '学校在公园的左边，那么公园在学校的哪一边？',
            speak: '学校在公园的左边，那么公园在学校的哪一边？',
            options: [
              { id: 'a', label: '右边', icon: '➡️' },
              { id: 'b', label: '左边', icon: '⬅️' },
              { id: 'c', label: '上面', icon: '⬆️' },
            ],
            answerId: 'a',
            explain: '你在我的左边，我就在你的右边。',
          },
          {
            id: 'q2',
            question: '看地图有个小口诀「上北下南」，地图的上面是？',
            speak: '地图的上面是哪个方向？',
            options: [
              { id: 'a', label: '北', icon: '⬆️' },
              { id: 'b', label: '南', icon: '⬇️' },
              { id: 'c', label: '西', icon: '⬅️' },
            ],
            answerId: 'a',
            explain: '上北下南，左西右东。',
          },
          {
            id: 'q3',
            question: '「上北下南，左西右东」，左边是什么方向？',
            speak: '上北下南，左西右东，左边是什么方向？',
            options: [
              { id: 'a', label: '西', icon: '⬅️' },
              { id: 'b', label: '东', icon: '➡️' },
              { id: 'c', label: '南', icon: '⬇️' },
            ],
            answerId: 'a',
            explain: '左西右东，左边是西。',
          },
        ]),
        listenChoose(
          '听指令找位置',
          '学校在公园的左边，请找出学校',
          [
            { id: 'a', label: '学校', icon: '🏫', speak: '学校' },
            { id: 'b', label: '公园', icon: '🏞️', speak: '公园' },
            { id: 'c', label: '面包房', icon: '🥖', speak: '面包房' },
          ],
          'a'
        ),
      ],
      '学校在公园的左边',
      ['park']
    ),
    level(
      'town-2-04',
      '铺路小能手',
      [
        sequence('按规律铺石板', [
          {
            id: 's1',
            prompt: '小桥的石板按「红、黄」排队，接下来铺哪块？',
            speak: '红黄红黄，接下来该铺什么颜色？',
            items: [
              { id: 'a', label: '红石板', icon: '🔴', speak: '红石板' },
              { id: 'b', label: '黄石板', icon: '🟡', speak: '黄石板' },
              { id: 'c', label: '蓝石板', icon: '🔵', speak: '蓝石板' },
            ],
            answerOrder: ['a'],
          },
          {
            id: 's2',
            prompt: '按「红、黄、黄」的规律接着铺两块',
            speak: '红黄黄红黄黄，请接着铺两块',
            items: [
              { id: 'a', label: '红石板', icon: '🔴', speak: '红石板' },
              { id: 'b', label: '黄石板', icon: '🟡', speak: '黄石板' },
              { id: 'c', label: '蓝石板', icon: '🔵', speak: '蓝石板' },
            ],
            answerOrder: ['a', 'b'],
          },
        ]),
        listenChoose(
          '听规律选石板',
          '红红黄，红红黄，接下来是什么颜色？',
          [
            { id: 'a', label: '红色', icon: '🔴', speak: '红色' },
            { id: 'b', label: '黄色', icon: '🟡', speak: '黄色' },
            { id: 'c', label: '蓝色', icon: '🔵', speak: '蓝色' },
          ],
          'a'
        ),
        quiz('规律小能手', [
          {
            id: 'q1',
            question: '🔵🟡🔵🟡🔵 接下来是？',
            speak: '蓝黄蓝黄蓝，接下来是什么颜色？',
            options: [
              { id: 'a', label: '🟡 黄色', icon: '🟡' },
              { id: 'b', label: '🔵 蓝色', icon: '🔵' },
              { id: 'c', label: '🔴 红色', icon: '🔴' },
            ],
            answerId: 'a',
          },
          {
            id: 'q2',
            question: '路灯按「一盏亮、一盏灭」排队：亮、灭、亮、灭、亮，接下来？',
            speak: '亮灭亮灭亮，接下来是亮还是灭？',
            options: [
              { id: 'a', label: '灭', icon: '🌑' },
              { id: 'b', label: '亮', icon: '💡' },
            ],
            answerId: 'a',
            explain: '一亮一灭轮流来，亮后面是灭。',
          },
        ]),
      ],
      '红黄红黄，接着铺',
      ['bridge']
    ),
  ],
  '数一数、摆一摆，规划你的小镇'
)

/* ── U3 我的小镇 ── */

const u3 = unit(
  'town-3',
  '我的小镇',
  [
    level(
      'town-3-01',
      '小镇英语角',
      [
        tapRead('小镇建筑英文名', [
          { id: 'e1', label: 'house', subLabel: '房子', speak: 'house', speakLang: EN, icon: '🏠' },
          { id: 'e2', label: 'school', subLabel: '学校', speak: 'school', speakLang: EN, icon: '🏫' },
          { id: 'e3', label: 'park', subLabel: '公园', speak: 'park', speakLang: EN, icon: '🏞️' },
          { id: 'e4', label: 'shop', subLabel: '商店', speak: 'shop', speakLang: EN, icon: '🏪' },
        ], '点一点，读一读建筑的英文名'),
        blend('拼一拼小镇单词', [
          { id: 'b1', parts: ['h', 'ou', 'se'], result: 'house', speak: 'house', speakLang: EN },
          { id: 'b2', parts: ['p', 'ar', 'k'], result: 'park', speak: 'park', speakLang: EN },
          { id: 'b3', parts: ['sh', 'o', 'p'], result: 'shop', speak: 'shop', speakLang: EN },
        ]),
        listenChoose(
          '听英语找建筑',
          'school',
          [
            { id: 'a', label: '学校', icon: '🏫', speak: '学校 school' },
            { id: 'b', label: '房子', icon: '🏠', speak: '房子 house' },
            { id: 'c', label: '公园', icon: '🏞️', speak: '公园 park' },
          ],
          'a',
          { promptLang: EN, promptLabel: 'school' }
        ),
      ],
      'house、school、park、shop',
      ['fountain']
    ),
    level(
      'town-3-02',
      '一句话介绍我的小镇',
      [
        readAlong('小镇介绍词', '我的小镇', [
          { id: 'l1', text: '高高的楼房里，住着我和我的家。', speak: '高高的楼房里，住着我和我的家' },
          { id: 'l2', text: '弯弯的小桥下，小河哗哗地唱歌。', speak: '弯弯的小桥下，小河哗哗地唱歌' },
          { id: 'l3', text: '长长的长椅上，爷爷在晒太阳。', speak: '长长的长椅上，爷爷在晒太阳' },
          { id: 'l4', text: '这就是我的小镇，我爱我的小镇！', speak: '这就是我的小镇，我爱我的小镇' },
        ]),
        dragMatch('句子两半配配对', [
          { id: 'p1', left: '高高的', right: '楼房', leftIcon: '🏢', rightIcon: '🏢' },
          { id: 'p2', left: '弯弯的', right: '小桥', leftIcon: '🌉', rightIcon: '🌉' },
          { id: 'p3', left: '长长的', right: '长椅', leftIcon: '🪑', rightIcon: '🪑' },
          { id: 'p4', left: '美丽的', right: '花坛', leftIcon: '🌷', rightIcon: '🌷' },
        ], '把形容词和它的好朋友配配对'),
        quiz('造句小能手', [
          {
            id: 'q1',
            question: '「高高的楼房里住着__」，选谁最合适？',
            speak: '高高的楼房里住着谁？选谁最合适？',
            options: [
              { id: 'a', label: '许多人', icon: '👨‍👩‍👧' },
              { id: 'b', label: '一条小鱼', icon: '🐟' },
              { id: 'c', label: '一朵云', icon: '☁️' },
            ],
            answerId: 'a',
            explain: '楼房是人们住的地方。',
          },
          {
            id: 'q2',
            question: '用「弯弯的」造句，哪句最通顺？',
            speak: '用弯弯的造句，哪句最通顺？',
            options: [
              { id: 'a', label: '弯弯的小桥', icon: '🌉' },
              { id: 'b', label: '弯弯的石头', icon: '🪨' },
              { id: 'c', label: '弯弯的房子', icon: '🏠' },
            ],
            answerId: 'a',
            explain: '小桥弯弯的，像一道彩虹。',
          },
          {
            id: 'q3',
            question: '「长长的长椅上，坐着__」，选谁最合适？',
            speak: '长长的长椅上坐着谁？选谁最合适？',
            options: [
              { id: 'a', label: '看书的爷爷', icon: '📖' },
              { id: 'b', label: '一只老虎', icon: '🐯' },
              { id: 'c', label: '一架飞机', icon: '✈️' },
            ],
            answerId: 'a',
            explain: '爷爷坐在长椅上看书，多舒服呀。',
          },
        ]),
      ],
      '高高的楼房里住着谁',
      ['bench']
    ),
    level(
      'town-3-03',
      '小镇安全小卫士',
      [
        tapRead('认识安全标志', [
          { id: 's1', label: '红灯停', subLabel: '红灯亮了停一停', speak: '红灯停一停', icon: '🔴' },
          { id: 's2', label: '绿灯行', subLabel: '绿灯亮了才能走', speak: '绿灯向前行', icon: '🟢' },
          { id: 's3', label: '黄灯等一等', subLabel: '黄灯亮了等一等', speak: '黄灯亮了等一等', icon: '🟡' },
          { id: 's4', label: '人行道', subLabel: '过马路要走斑马线', speak: '过马路要走人行道', icon: '🚸' },
        ], '点一点，记住安全规则'),
        quiz('安全小考官', [
          {
            id: 'q1',
            question: '过马路时红灯亮了，应该？',
            speak: '过马路时红灯亮了，应该怎么做？',
            options: [
              { id: 'a', label: '停下等一等', icon: '✋' },
              { id: 'b', label: '快快跑过去', icon: '🏃' },
              { id: 'c', label: '闭上眼睛', icon: '🙈' },
            ],
            answerId: 'a',
            explain: '红灯停，绿灯行。',
          },
          {
            id: 'q2',
            question: '过马路要走哪里才安全？',
            speak: '过马路要走哪里才安全？',
            options: [
              { id: 'a', label: '斑马线', icon: '🦓' },
              { id: 'b', label: '马路中间', icon: '🚗' },
              { id: 'c', label: '随便哪里', icon: '🙅' },
            ],
            answerId: 'a',
            explain: '斑马线是行人的安全通道。',
          },
          {
            id: 'q3',
            question: '天黑了，路灯亮起来是为了？',
            speak: '天黑了，路灯亮起来是为了什么？',
            options: [
              { id: 'a', label: '照亮小路', icon: '💡' },
              { id: 'b', label: '烤面包', icon: '🍞' },
              { id: 'c', label: '给小鸟睡觉', icon: '🐦' },
            ],
            answerId: 'a',
            explain: '路灯照亮街道，大家走路更安全。',
          },
        ]),
        listenChoose(
          '听声音辨一辨',
          '过马路时听到汽车嘀嘀叫，应该马上怎么做？',
          [
            { id: 'a', label: '退到路边等一等', icon: '✋', speak: '退到路边等一等' },
            { id: 'b', label: '继续慢慢走', icon: '🚶', speak: '继续慢慢走' },
            { id: 'c', label: '在马路上玩球', icon: '⚽', speak: '在马路上玩球' },
          ],
          'a'
        ),
      ],
      '红绿灯和人行道',
      ['streetlamp']
    ),
    level(
      'town-3-04',
      '小镇设计师毕业礼',
      [
        listenChoose(
          '终极考验一',
          'red house',
          [
            { id: 'a', label: '红色的房子', icon: '🏠', speak: '红色的房子' },
            { id: 'b', label: '蓝色的学校', icon: '🏫', speak: '蓝色的学校' },
            { id: 'c', label: '黄色的公园', icon: '🌼', speak: '黄色的公园' },
          ],
          'a',
          { promptLang: EN, promptLabel: 'red house' }
        ),
        quiz('设计师毕业考', [
          {
            id: 'q1',
            question: '「一__高高的风车」，横线上填哪个量词？',
            speak: '一什么高高的风车？请选出正确的量词',
            options: [
              { id: 'a', label: '座', icon: '🌀' },
              { id: 'b', label: '棵', icon: '🌳' },
              { id: 'c', label: '条', icon: '🐟' },
            ],
            answerId: 'a',
            explain: '一座高高的风车。',
          },
          {
            id: 'q2',
            question: '小镇广场按「喷泉、花坛」轮流布置：喷泉、花坛、喷泉，接下来摆什么？',
            speak: '喷泉花坛喷泉，接下来摆什么？',
            options: [
              { id: 'a', label: '花坛', icon: '🌷' },
              { id: 'b', label: '喷泉', icon: '⛲' },
              { id: 'c', label: '路灯', icon: '💡' },
            ],
            answerId: 'a',
            explain: '喷泉、花坛轮流来，喷泉后面是花坛。',
          },
          {
            id: 'q3',
            question: 'shop 是什么地方？',
            speak: 'shop 是什么地方？',
            options: [
              { id: 'a', label: '商店', icon: '🏪' },
              { id: 'b', label: '学校', icon: '🏫' },
              { id: 'c', label: '公园', icon: '🏞️' },
            ],
            answerId: 'a',
            explain: 'shop 就是商店，可以买到好多东西。',
          },
        ]),
        sequence('设计我的小镇', [
          {
            id: 's1',
            prompt: '按从矮到高，把小镇的建筑排一排',
            speak: '请把小树、小屋、大风车，按从矮到高排一排',
            items: [
              { id: 'a', label: '小树', icon: '🌱', speak: '小树' },
              { id: 'b', label: '小屋', icon: '🏠', speak: '小屋' },
              { id: 'c', label: '大风车', icon: '🌀', speak: '大风车' },
            ],
            answerOrder: ['a', 'b', 'c'],
          },
        ]),
      ],
      '综合运用所有本领',
      ['windmill']
    ),
  ],
  '用英语和句子介绍你的小镇'
)

export const town: Subject = {
  id: 'town',
  name: '童话小镇设计师',
  emoji: '🏘️',
  color: '#4FC3F7',
  mascot: 'town',
  description: '铺上小路盖起房，设计属于你的童话小镇',
  units: [u1, u2, u3],
}
