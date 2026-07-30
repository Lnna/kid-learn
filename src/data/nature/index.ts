import type { Subject } from '../../engine/types'
import {
  tapRead,
  listenChoose,
  dragMatch,
  quiz,
  sequence,
  readAlong,
  level,
  unit,
} from '../helpers'

/* ── U1 四季天气 ── */

const u1 = unit(
  'nature-1',
  '四季天气',
  [
    level('nature-1-01', '认识春天', [
      tapRead('春天来了', [
        { id: 's1', label: '春天', speak: '春天', icon: '🌸', color: '#FF8FB8' },
        { id: 's2', label: '暖和', speak: '暖和', icon: '🌤️' },
        { id: 's3', label: '花开了', speak: '花开了', icon: '🌷' },
        { id: 's4', label: '小草发芽', speak: '小草发芽', icon: '🌱' },
        { id: 's5', label: '燕子飞回来', speak: '燕子飞回来', icon: '🐦' },
      ]),
      quiz('春天小知识', [
        {
          id: 'q1',
          question: '春天的天气怎么样？',
          options: [
            { id: 'a', label: '暖和' },
            { id: 'b', label: '很热' },
            { id: 'c', label: '很冷' },
          ],
          answerId: 'a',
        },
        {
          id: 'q2',
          question: '春天常见什么？',
          options: [
            { id: 'a', label: '花开、草芽' },
            { id: 'b', label: '厚厚的雪' },
            { id: 'c', label: '落叶满地' },
          ],
          answerId: 'a',
        },
        {
          id: 'q3',
          question: '春天适合穿？',
          options: [
            { id: 'a', label: '薄外套' },
            { id: 'b', label: '羽绒服' },
            { id: 'c', label: '短袖短裤就够了（太早）' },
          ],
          answerId: 'a',
        },
      ]),
      listenChoose(
        '听季节',
        '春天',
        [
          { id: 'a', label: '🌸 春天' },
          { id: 'b', label: '☀️ 夏天' },
          { id: 'c', label: '❄️ 冬天' },
        ],
        'a'
      ),
    ], '春天的特点'),

    level('nature-1-02', '认识夏天', [
      tapRead('夏天到了', [
        { id: 's1', label: '夏天', speak: '夏天', icon: '☀️', color: '#FFD43B' },
        { id: 's2', label: '炎热', speak: '炎热', icon: '🥵' },
        { id: 's3', label: '知了叫', speak: '知了叫', icon: '🦗' },
        { id: 's4', label: '西瓜甜', speak: '西瓜甜', icon: '🍉' },
        { id: 's5', label: '去游泳', speak: '去游泳', icon: '🏊' },
        { id: 's6', label: '雷阵雨', speak: '雷阵雨', icon: '⛈️' },
      ]),
      dragMatch('夏天事物', [
        { id: 'p1', left: '☀️', right: '大太阳' },
        { id: 'p2', left: '🍉', right: '吃西瓜' },
        { id: 'p3', left: '🏊', right: '游泳消暑' },
        { id: 'p4', left: '🦗', right: '知了鸣叫' },
      ]),
      quiz('夏天安全', [
        {
          id: 'q1',
          question: '夏天出门最好？',
          options: [
            { id: 'a', label: '戴帽子涂防晒' },
            { id: 'b', label: '一直晒太阳' },
            { id: 'c', label: '不喝水' },
          ],
          answerId: 'a',
        },
        {
          id: 'q2',
          question: '游泳时应该？',
          options: [
            { id: 'a', label: '有大人陪同' },
            { id: 'b', label: '自己偷偷去深水' },
            { id: 'c', label: '吃得很饱立刻游' },
          ],
          answerId: 'a',
        },
      ]),
    ], '夏天的特点'),

    level('nature-1-03', '认识秋天', [
      tapRead('秋天来了', [
        { id: 'a1', label: '秋天', speak: '秋天', icon: '🍂', color: '#FF922B' },
        { id: 'a2', label: '凉爽', speak: '凉爽', icon: '🍃' },
        { id: 'a3', label: '叶子变黄', speak: '叶子变黄', icon: '🍁' },
        { id: 'a4', label: '水果成熟', speak: '水果成熟', icon: '🍎' },
        { id: 'a5', label: '稻谷丰收', speak: '稻谷丰收', icon: '🌾' },
        { id: 'a6', label: '菊花开', speak: '菊花开', icon: '🌼' },
      ]),
      quiz('秋天知识', [
        {
          id: 'q1',
          question: '秋天树叶常常？',
          options: [
            { id: 'a', label: '变黄落下' },
            { id: 'b', label: '开始发芽' },
            { id: 'c', label: '结冰' },
          ],
          answerId: 'a',
        },
        {
          id: 'q2',
          question: '秋天是？',
          options: [
            { id: 'a', label: '收获的季节' },
            { id: 'b', label: '最冷的季节' },
            { id: 'c', label: '花开最多的季节' },
          ],
          answerId: 'a',
        },
        {
          id: 'q3',
          question: '哪个水果常在秋天见到？',
          options: [
            { id: 'a', label: '苹果、柿子' },
            { id: 'b', label: '只有西瓜' },
            { id: 'c', label: '只有草莓' },
          ],
          answerId: 'a',
        },
      ]),
      listenChoose(
        '听一听',
        '秋天',
        [
          { id: 'a', label: '🌸 春天' },
          { id: 'b', label: '🍂 秋天' },
          { id: 'c', label: '❄️ 冬天' },
        ],
        'b'
      ),
    ], '秋天的特点'),

    level('nature-1-04', '认识冬天', [
      tapRead('冬天到了', [
        { id: 'w1', label: '冬天', speak: '冬天', icon: '❄️', color: '#74C0FC' },
        { id: 'w2', label: '寒冷', speak: '寒冷', icon: '🥶' },
        { id: 'w3', label: '下雪', speak: '下雪', icon: '🌨️' },
        { id: 'w4', label: '穿棉衣', speak: '穿棉衣', icon: '🧥' },
        { id: 'w5', label: '堆雪人', speak: '堆雪人', icon: '⛄' },
        { id: 'w6', label: '梅花开', speak: '梅花开', icon: '🌺' },
      ]),
      dragMatch('冬日配对', [
        { id: 'p1', left: '❄️', right: '雪花' },
        { id: 'p2', left: '⛄', right: '雪人' },
        { id: 'p3', left: '🧥', right: '保暖衣服' },
        { id: 'p4', left: '🧣', right: '围巾' },
      ]),
      quiz('冬天小测', [
        {
          id: 'q1',
          question: '冬天要注意？',
          options: [
            { id: 'a', label: '保暖防滑' },
            { id: 'b', label: '只穿短袖' },
            { id: 'c', label: '不喝热水' },
          ],
          answerId: 'a',
        },
        {
          id: 'q2',
          question: '雪是什么状态的水？',
          options: [
            { id: 'a', label: '固体' },
            { id: 'b', label: '气体' },
            { id: 'c', label: '石油' },
          ],
          answerId: 'a',
        },
      ]),
    ], '冬天的特点'),

    level('nature-1-05', '四季顺序', [
      sequence('一年四季排队', [
        {
          id: 's1',
          prompt: '春 → 夏 → 秋 → 冬',
          items: [
            { id: 'spring', label: '🌸 春' },
            { id: 'summer', label: '☀️ 夏' },
            { id: 'autumn', label: '🍂 秋' },
            { id: 'winter', label: '❄️ 冬' },
          ],
          answerOrder: ['spring', 'summer', 'autumn', 'winter'],
          speak: '春夏秋冬',
        },
      ]),
      quiz('四季判断', [
        {
          id: 'q1',
          question: '春天后面是？',
          options: [
            { id: 'a', label: '夏天' },
            { id: 'b', label: '秋天' },
            { id: 'c', label: '冬天' },
          ],
          answerId: 'a',
        },
        {
          id: 'q2',
          question: '一年有几个季节？',
          options: [
            { id: 'a', label: '3' },
            { id: 'b', label: '4' },
            { id: 'c', label: '5' },
          ],
          answerId: 'b',
        },
        {
          id: 'q3',
          question: '落叶最多通常在？',
          options: [
            { id: 'a', label: '秋天' },
            { id: 'b', label: '夏天' },
            { id: 'c', label: '春天' },
          ],
          answerId: 'a',
        },
      ]),
      dragMatch('季节特征', [
        { id: 'p1', left: '🌸', right: '春天' },
        { id: 'p2', left: '☀️', right: '夏天' },
        { id: 'p3', left: '🍂', right: '秋天' },
        { id: 'p4', left: '❄️', right: '冬天' },
      ]),
    ], '记住春夏秋冬'),

    level('nature-1-06', '常见天气', [
      tapRead('天气宝宝', [
        { id: 'sunny', label: '晴天', speak: '晴天', icon: '☀️' },
        { id: 'cloudy', label: '多云', speak: '多云', icon: '⛅' },
        { id: 'rainy', label: '雨天', speak: '雨天', icon: '🌧️' },
        { id: 'windy', label: '大风', speak: '大风', icon: '🌬️' },
        { id: 'snowy', label: '雪天', speak: '雪天', icon: '🌨️' },
        { id: 'foggy', label: '有雾', speak: '有雾', icon: '🌫️' },
        { id: 'storm', label: '雷雨', speak: '雷雨', icon: '⛈️' },
      ]),
      listenChoose(
        '听天气选图标',
        '雨天',
        [
          { id: 'a', label: '☀️ 晴天' },
          { id: 'b', label: '🌧️ 雨天' },
          { id: 'c', label: '❄️ 雪天' },
        ],
        'b'
      ),
      quiz('天气与穿着', [
        {
          id: 'q1',
          question: '下雨出门要带？',
          options: [
            { id: 'a', label: '雨伞' },
            { id: 'b', label: '墨镜就够' },
            { id: 'c', label: '泳圈' },
          ],
          answerId: 'a',
        },
        {
          id: 'q2',
          question: '打雷时最好？',
          options: [
            { id: 'a', label: '待在室内安全处' },
            { id: 'b', label: '去大树下躲' },
            { id: 'c', label: '去空旷地玩' },
          ],
          answerId: 'a',
        },
        {
          id: 'q3',
          question: '晴天可以看到？',
          options: [
            { id: 'a', label: '太阳和蓝天' },
            { id: 'b', label: '厚厚的雪' },
            { id: 'c', label: '大雾' },
          ],
          answerId: 'a',
        },
      ]),
    ], '认识各种天气'),

    level('nature-1-07', '天气与生活', [
      readAlong(
        '天气儿歌',
        '下雨了',
        [
          { id: 'l1', text: '嘀嗒嘀嗒，下雨了，', speak: '嘀嗒嘀嗒，下雨了' },
          { id: 'l2', text: '小朋友们撑起伞。', speak: '小朋友们撑起伞' },
          { id: 'l3', text: '雨过天晴出太阳，', speak: '雨过天晴出太阳' },
          { id: 'l4', text: '彩虹宝宝挂天上。', speak: '彩虹宝宝挂天上' },
        ]
      ),
      quiz('综合判断', [
        {
          id: 'q1',
          question: '彩虹常出现在？',
          options: [
            { id: 'a', label: '雨后出太阳时' },
            { id: 'b', label: '深夜很黑时' },
            { id: 'c', label: '一直下雪时' },
          ],
          answerId: 'a',
        },
        {
          id: 'q2',
          question: '风是？',
          options: [
            { id: 'a', label: '空气在流动' },
            { id: 'b', label: '水在流动' },
            { id: 'c', label: '土在流动' },
          ],
          answerId: 'a',
        },
        {
          id: 'q3',
          question: '看天气预报可以？',
          options: [
            { id: 'a', label: '知道明天穿什么' },
            { id: 'b', label: '知道明天考试题' },
            { id: 'c', label: '改变四季顺序' },
          ],
          answerId: 'a',
        },
      ]),
      dragMatch('天气对策', [
        { id: 'p1', left: '🌧️ 雨天', right: '带伞' },
        { id: 'p2', left: '☀️ 大太阳', right: '戴帽防晒' },
        { id: 'p3', left: '❄️ 很冷', right: '穿棉衣' },
        { id: 'p4', left: '🌬️ 大风', right: '小心被吹' },
      ]),
    ], '天气与我们的生活'),
  ],
  '春夏秋冬与天气现象'
)

/* ── U2 动物世界 ── */

const u2 = unit(
  'nature-2',
  '动物世界',
  [
    level('nature-2-01', '家禽家畜', [
      tapRead('家里常见动物', [
        { id: 'dog', label: '狗', speak: '狗', icon: '🐶', subLabel: '汪汪叫' },
        { id: 'cat', label: '猫', speak: '猫', icon: '🐱', subLabel: '喵喵叫' },
        { id: 'chicken', label: '鸡', speak: '鸡', icon: '🐔', subLabel: '会下蛋' },
        { id: 'duck', label: '鸭', speak: '鸭', icon: '🦆', subLabel: '会游泳' },
        { id: 'pig', label: '猪', speak: '猪', icon: '🐷' },
        { id: 'cow', label: '牛', speak: '牛', icon: '🐮', subLabel: '产牛奶' },
        { id: 'rabbit', label: '兔', speak: '兔', icon: '🐰', subLabel: '爱吃胡萝卜' },
      ]),
      listenChoose(
        '听叫声猜动物',
        '喵喵',
        [
          { id: 'a', label: '🐶 狗' },
          { id: 'b', label: '🐱 猫' },
          { id: 'c', label: '🐮 牛' },
        ],
        'b'
      ),
      dragMatch('动物和特点', [
        { id: 'p1', left: '🐶', right: '看家' },
        { id: 'p2', left: '🐔', right: '下蛋' },
        { id: 'p3', left: '🐮', right: '产奶' },
        { id: 'p4', left: '🐰', right: '吃胡萝卜' },
      ]),
    ], '认识家养动物'),

    level('nature-2-02', '森林动物', [
      tapRead('森林里的朋友', [
        { id: 'tiger', label: '老虎', speak: '老虎', icon: '🐯' },
        { id: 'bear', label: '熊', speak: '熊', icon: '🐻' },
        { id: 'fox', label: '狐狸', speak: '狐狸', icon: '🦊' },
        { id: 'deer', label: '鹿', speak: '鹿', icon: '🦌' },
        { id: 'wolf', label: '狼', speak: '狼', icon: '🐺' },
        { id: 'squirrel', label: '松鼠', speak: '松鼠', icon: '🐿️', subLabel: '爱存坚果' },
      ]),
      quiz('森林动物', [
        {
          id: 'q1',
          question: '老虎身上有？',
          options: [
            { id: 'a', label: '条纹' },
            { id: 'b', label: '斑点（像豹）' },
            { id: 'c', label: '羽毛' },
          ],
          answerId: 'a',
        },
        {
          id: 'q2',
          question: '松鼠喜欢？',
          options: [
            { id: 'a', label: '存坚果' },
            { id: 'b', label: '游泳捕鱼' },
            { id: 'c', label: '下蛋' },
          ],
          answerId: 'a',
        },
        {
          id: 'q3',
          question: '看到野生老虎应该？',
          options: [
            { id: 'a', label: '远离并告诉大人' },
            { id: 'b', label: '上前摸一摸' },
            { id: 'c', label: '喂它吃零食' },
          ],
          answerId: 'a',
        },
      ]),
    ], '认识野生动物'),

    level('nature-2-03', '鸟类朋友', [
      tapRead('飞上天的鸟', [
        { id: 'sparrow', label: '麻雀', speak: '麻雀', icon: '🐦' },
        { id: 'swallow', label: '燕子', speak: '燕子', icon: '🕊️', subLabel: '春天归来' },
        { id: 'eagle', label: '老鹰', speak: '老鹰', icon: '🦅' },
        { id: 'owl', label: '猫头鹰', speak: '猫头鹰', icon: '🦉', subLabel: '夜里活动' },
        { id: 'peacock', label: '孔雀', speak: '孔雀', icon: '🦚' },
        { id: 'penguin', label: '企鹅', speak: '企鹅', icon: '🐧', subLabel: '不会飞会游泳' },
      ]),
      dragMatch('鸟的特点', [
        { id: 'p1', left: '燕子', right: '春天飞回来' },
        { id: 'p2', left: '猫头鹰', right: '夜间捕猎' },
        { id: 'p3', left: '企鹅', right: '生活在寒冷地区' },
        { id: 'p4', left: '老鹰', right: '飞得很高' },
      ]),
      quiz('鸟类知识', [
        {
          id: 'q1',
          question: '大多数鸟有？',
          options: [
            { id: 'a', label: '羽毛和翅膀' },
            { id: 'b', label: '鳞片和鳃' },
            { id: 'c', label: '四条腿走路' },
          ],
          answerId: 'a',
        },
        {
          id: 'q2',
          question: '小鸟的家常常是？',
          options: [
            { id: 'a', label: '鸟巢' },
            { id: 'b', label: '狗窝' },
            { id: 'c', label: '鱼缸' },
          ],
          answerId: 'a',
        },
      ]),
    ], '认识常见鸟类'),

    level('nature-2-04', '水生动物', [
      tapRead('水里的动物', [
        { id: 'fish', label: '鱼', speak: '鱼', icon: '🐟', subLabel: '用鳃呼吸' },
        { id: 'shrimp', label: '虾', speak: '虾', icon: '🦐' },
        { id: 'crab', label: '螃蟹', speak: '螃蟹', icon: '🦀' },
        { id: 'frog', label: '青蛙', speak: '青蛙', icon: '🐸', subLabel: '两栖动物' },
        { id: 'turtle', label: '乌龟', speak: '乌龟', icon: '🐢' },
        { id: 'whale', label: '鲸鱼', speak: '鲸鱼', icon: '🐋', subLabel: '是哺乳动物' },
      ]),
      quiz('水生知识', [
        {
          id: 'q1',
          question: '鱼用什么呼吸？',
          options: [
            { id: 'a', label: '鳃' },
            { id: 'b', label: '肺（像人）' },
            { id: 'c', label: '翅膀' },
          ],
          answerId: 'a',
        },
        {
          id: 'q2',
          question: '青蛙小时候叫？',
          options: [
            { id: 'a', label: '蝌蚪' },
            { id: 'b', label: '小鸡' },
            { id: 'c', label: '幼虫蚕' },
          ],
          answerId: 'a',
        },
        {
          id: 'q3',
          question: '鲸鱼是？',
          options: [
            { id: 'a', label: '哺乳动物' },
            { id: 'b', label: '真正的鱼' },
            { id: 'c', label: '鸟类' },
          ],
          answerId: 'a',
        },
      ]),
      listenChoose(
        '听名字选动物',
        '青蛙',
        [
          { id: 'a', label: '🐟 鱼' },
          { id: 'b', label: '🐸 青蛙' },
          { id: 'c', label: '🐢 乌龟' },
        ],
        'b'
      ),
    ], '认识水生动物'),

    level('nature-2-05', '昆虫世界', [
      tapRead('小昆虫', [
        { id: 'bee', label: '蜜蜂', speak: '蜜蜂', icon: '🐝', subLabel: '采蜜' },
        { id: 'butterfly', label: '蝴蝶', speak: '蝴蝶', icon: '🦋' },
        { id: 'ant', label: '蚂蚁', speak: '蚂蚁', icon: '🐜', subLabel: '很勤劳' },
        { id: 'ladybug', label: '瓢虫', speak: '瓢虫', icon: '🐞' },
        { id: 'dragonfly', label: '蜻蜓', speak: '蜻蜓', icon: '🦟' },
        { id: 'silkworm', label: '蚕', speak: '蚕', icon: '🐛', subLabel: '能吐丝' },
      ]),
      sequence('蝴蝶成长', [
        {
          id: 's1',
          prompt: '卵 → 毛毛虫 → 蛹 → 蝴蝶',
          items: [
            { id: 'egg', label: '卵' },
            { id: 'larva', label: '毛毛虫' },
            { id: 'pupa', label: '蛹' },
            { id: 'adult', label: '蝴蝶' },
          ],
          answerOrder: ['egg', 'larva', 'pupa', 'adult'],
        },
      ]),
      quiz('昆虫小测', [
        {
          id: 'q1',
          question: '蜜蜂能帮植物？',
          options: [
            { id: 'a', label: '传粉' },
            { id: 'b', label: '下雨' },
            { id: 'c', label: '下雪' },
          ],
          answerId: 'a',
        },
        {
          id: 'q2',
          question: '蚂蚁搬家说明？',
          options: [
            { id: 'a', label: '它们很勤劳会合作' },
            { id: 'b', label: '它们会飞' },
            { id: 'c', label: '它们是鸟' },
          ],
          answerId: 'a',
        },
      ]),
    ], '认识常见昆虫'),

    level('nature-2-06', '动物吃什么', [
      tapRead('食性分类', [
        {
          id: 'h1',
          label: '草食动物',
          speak: '草食动物',
          icon: '🦌',
          subLabel: '吃植物，如兔、牛、羊',
        },
        {
          id: 'c1',
          label: '肉食动物',
          speak: '肉食动物',
          icon: '🐯',
          subLabel: '吃肉，如老虎、狼',
        },
        {
          id: 'o1',
          label: '杂食动物',
          speak: '杂食动物',
          icon: '🐻',
          subLabel: '什么都吃一点，如熊、猪',
        },
      ]),
      dragMatch('谁吃什么', [
        { id: 'p1', left: '🐰 兔子', right: '🥕 胡萝卜' },
        { id: 'p2', left: '🐯 老虎', right: '🥩 肉' },
        { id: 'p3', left: '🐮 牛', right: '🌿 草' },
        { id: 'p4', left: '🐻 熊', right: '🐟🍓 鱼和浆果' },
      ]),
      quiz('食性判断', [
        {
          id: 'q1',
          question: '羊主要吃？',
          options: [
            { id: 'a', label: '草' },
            { id: 'b', label: '肉' },
            { id: 'c', label: '石头' },
          ],
          answerId: 'a',
        },
        {
          id: 'q2',
          question: '猫会抓？',
          options: [
            { id: 'a', label: '老鼠' },
            { id: 'b', label: '大象' },
            { id: 'c', label: '飞机' },
          ],
          answerId: 'a',
        },
      ]),
    ], '动物的食物'),

    level('nature-2-07', '爱护动物', [
      quiz('怎样对待动物', [
        {
          id: 'q1',
          question: '看到流浪小动物应该？',
          options: [
            { id: 'a', label: '告诉大人求助' },
            { id: 'b', label: '吓唬它' },
            { id: 'c', label: '扔石头' },
          ],
          answerId: 'a',
        },
        {
          id: 'q2',
          question: '动物园里可以？',
          options: [
            { id: 'a', label: '安静观察，不投喂危险食物' },
            { id: 'b', label: '敲玻璃吓动物' },
            { id: 'c', label: '随便给它们吃零食' },
          ],
          answerId: 'a',
        },
        {
          id: 'q3',
          question: '为什么要保护野生动物？',
          options: [
            { id: 'a', label: '它们是大自然的朋友' },
            { id: 'b', label: '因为它们很吵' },
            { id: 'c', label: '因为不需要' },
          ],
          answerId: 'a',
        },
      ]),
      tapRead('保护小行动', [
        { id: 'a1', label: '不伤害小鸟', speak: '不伤害小鸟', icon: '🐦' },
        { id: 'a2', label: '不乱抓昆虫', speak: '不乱抓昆虫', icon: '🐞' },
        { id: 'a3', label: '爱护宠物', speak: '爱护宠物', icon: '🐶' },
        { id: 'a4', label: '保护栖息地', speak: '保护栖息地', icon: '🌲' },
      ]),
      readAlong(
        '爱动物小诗',
        '小动物是朋友',
        [
          { id: 'l1', text: '小鸟飞，小鱼游，', speak: '小鸟飞，小鱼游' },
          { id: 'l2', text: '小猫小狗身边走。', speak: '小猫小狗身边走' },
          { id: 'l3', text: '它们都是好朋友，', speak: '它们都是好朋友' },
          { id: 'l4', text: '我们一起手拉手。', speak: '我们一起手拉手' },
        ]
      ),
    ], '学会爱护小动物'),
  ],
  '家养、野生、鸟虫与爱护'
)

/* ── U3 植物奥秘 ── */

const u3 = unit(
  'nature-3',
  '植物奥秘',
  [
    level('nature-3-01', '植物的身体', [
      tapRead('植物有哪些部分', [
        { id: 'root', label: '根', speak: '根', icon: '🪴', subLabel: '吸水和固定' },
        { id: 'stem', label: '茎', speak: '茎', icon: '🎋', subLabel: '输送养分' },
        { id: 'leaf', label: '叶', speak: '叶', icon: '🍃', subLabel: '制造养分' },
        { id: 'flower', label: '花', speak: '花', icon: '🌸', subLabel: '美丽又结果' },
        { id: 'fruit', label: '果实', speak: '果实', icon: '🍎', subLabel: '包着种子' },
        { id: 'seed', label: '种子', speak: '种子', icon: '🌰', subLabel: '能长出新植物' },
      ]),
      dragMatch('部位和作用', [
        { id: 'p1', left: '根', right: '吸水、固定' },
        { id: 'p2', left: '叶', right: '制造养分' },
        { id: 'p3', left: '花', right: '开放结果' },
        { id: 'p4', left: '种子', right: '长出新苗' },
      ]),
      quiz('植物结构', [
        {
          id: 'q1',
          question: '叶子的主要作用是？',
          options: [
            { id: 'a', label: '制造养分' },
            { id: 'b', label: '走路' },
            { id: 'c', label: '叫喊' },
          ],
          answerId: 'a',
        },
        {
          id: 'q2',
          question: '苹果属于？',
          options: [
            { id: 'a', label: '果实' },
            { id: 'b', label: '根' },
            { id: 'c', label: '叶子' },
          ],
          answerId: 'a',
        },
      ]),
    ], '认识根茎叶花果种子'),

    level('nature-3-02', '种子发芽', [
      sequence('发芽过程', [
        {
          id: 's1',
          prompt: '种子 → 吸水 → 发芽 → 长叶',
          items: [
            { id: 'seed', label: '🌰 种子' },
            { id: 'water', label: '💧 吸水' },
            { id: 'sprout', label: '🌱 发芽' },
            { id: 'leaf', label: '🍃 长叶' },
          ],
          answerOrder: ['seed', 'water', 'sprout', 'leaf'],
        },
      ]),
      quiz('发芽条件', [
        {
          id: 'q1',
          question: '种子发芽通常需要？',
          options: [
            { id: 'a', label: '适量水分、空气和温度' },
            { id: 'b', label: '只要黑暗' },
            { id: 'c', label: '只要唱歌' },
          ],
          answerId: 'a',
        },
        {
          id: 'q2',
          question: '绿豆芽是？',
          options: [
            { id: 'a', label: '种子发芽长出的' },
            { id: 'b', label: '石头变的' },
            { id: 'c', label: '塑料做的' },
          ],
          answerId: 'a',
        },
        {
          id: 'q3',
          question: '没有水，种子会？',
          options: [
            { id: 'a', label: '很难发芽' },
            { id: 'b', label: '长得更快' },
            { id: 'c', label: '变成蝴蝶' },
          ],
          answerId: 'a',
        },
      ]),
      tapRead('常见种子', [
        { id: 'bean', label: '豆子', speak: '豆子', icon: '🫘' },
        { id: 'sunflower', label: '瓜子', speak: '瓜子', icon: '🌻' },
        { id: 'corn', label: '玉米粒', speak: '玉米粒', icon: '🌽' },
        { id: 'rice', label: '稻谷', speak: '稻谷', icon: '🌾' },
      ]),
    ], '种子怎样发芽'),

    level('nature-3-03', '树木与花草', [
      tapRead('大树和小花', [
        { id: 'pine', label: '松树', speak: '松树', icon: '🌲', subLabel: '冬天也绿' },
        { id: 'willow', label: '柳树', speak: '柳树', icon: '🌳', subLabel: '枝条柔软' },
        { id: 'apple', label: '苹果树', speak: '苹果树', icon: '🍎' },
        { id: 'rose', label: '玫瑰', speak: '玫瑰', icon: '🌹' },
        { id: 'sunflower', label: '向日葵', speak: '向日葵', icon: '🌻', subLabel: '朝着太阳' },
        { id: 'grass', label: '小草', speak: '小草', icon: '🌱' },
      ]),
      listenChoose(
        '听名字选植物',
        '向日葵',
        [
          { id: 'a', label: '🌹 玫瑰' },
          { id: 'b', label: '🌻 向日葵' },
          { id: 'c', label: '🌲 松树' },
        ],
        'b'
      ),
      quiz('树木知识', [
        {
          id: 'q1',
          question: '树能帮我们？',
          options: [
            { id: 'a', label: '净化空气、遮阴' },
            { id: 'b', label: '打电话' },
            { id: 'c', label: '做饭' },
          ],
          answerId: 'a',
        },
        {
          id: 'q2',
          question: '我们应该？',
          options: [
            { id: 'a', label: '爱护花草树木' },
            { id: 'b', label: '随便折树枝' },
            { id: 'c', label: '在树上乱刻字' },
          ],
          answerId: 'a',
        },
      ]),
    ], '认识常见植物'),

    level('nature-3-04', '植物需要什么', [
      tapRead('植物生长需要', [
        { id: 'sun', label: '阳光', speak: '阳光', icon: '☀️' },
        { id: 'water', label: '水分', speak: '水分', icon: '💧' },
        { id: 'air', label: '空气', speak: '空气', icon: '💨' },
        { id: 'soil', label: '土壤', speak: '土壤', icon: '🟤' },
        { id: 'warm', label: '合适温度', speak: '合适温度', icon: '🌡️' },
      ]),
      quiz('生长条件', [
        {
          id: 'q1',
          question: '长时间不浇水，花会？',
          options: [
            { id: 'a', label: '枯萎' },
            { id: 'b', label: '长得更好' },
            { id: 'c', label: '变成动物' },
          ],
          answerId: 'a',
        },
        {
          id: 'q2',
          question: '绿植放在太暗的地方会？',
          options: [
            { id: 'a', label: '长势变差' },
            { id: 'b', label: '立刻开花更多' },
            { id: 'c', label: '变成石头' },
          ],
          answerId: 'a',
        },
        {
          id: 'q3',
          question: '浇太多水可能？',
          options: [
            { id: 'a', label: '根会烂' },
            { id: 'b', label: '一定更好' },
            { id: 'c', label: '没有影响' },
          ],
          answerId: 'a',
        },
      ]),
      dragMatch('需要配对', [
        { id: 'p1', left: '☀️', right: '光合作用需要光' },
        { id: 'p2', left: '💧', right: '根要喝水' },
        { id: 'p3', left: '🟤', right: '提供养分' },
        { id: 'p4', left: '💨', right: '呼吸需要空气' },
      ]),
    ], '阳光水分空气土壤'),

    level('nature-3-05', '蔬菜水果', [
      tapRead('常见蔬菜', [
        { id: 'tomato', label: '西红柿', speak: '西红柿', icon: '🍅' },
        { id: 'carrot', label: '胡萝卜', speak: '胡萝卜', icon: '🥕' },
        { id: 'cabbage', label: '白菜', speak: '白菜', icon: '🥬' },
        { id: 'potato', label: '土豆', speak: '土豆', icon: '🥔' },
        { id: 'cucumber', label: '黄瓜', speak: '黄瓜', icon: '🥒' },
      ]),
      tapRead('常见水果', [
        { id: 'apple', label: '苹果', speak: '苹果', icon: '🍎' },
        { id: 'banana', label: '香蕉', speak: '香蕉', icon: '🍌' },
        { id: 'orange', label: '橙子', speak: '橙子', icon: '🍊' },
        { id: 'grape', label: '葡萄', speak: '葡萄', icon: '🍇' },
        { id: 'watermelon', label: '西瓜', speak: '西瓜', icon: '🍉' },
        { id: 'strawberry', label: '草莓', speak: '草莓', icon: '🍓' },
      ]),
      quiz('蔬果分类', [
        {
          id: 'q1',
          question: '哪个是水果？',
          options: [
            { id: 'a', label: '🍎 苹果' },
            { id: 'b', label: '🥕 胡萝卜' },
            { id: 'c', label: '🥬 白菜' },
          ],
          answerId: 'a',
        },
        {
          id: 'q2',
          question: '多吃蔬菜水果有助于？',
          options: [
            { id: 'a', label: '身体健康' },
            { id: 'b', label: '不睡觉' },
            { id: 'c', label: '变成超人' },
          ],
          answerId: 'a',
        },
      ]),
    ], '认识常见蔬果'),

    level('nature-3-06', '植物的用处', [
      quiz('植物了不起', [
        {
          id: 'q1',
          question: '木头可以用来？',
          options: [
            { id: 'a', label: '做家具、盖房子' },
            { id: 'b', label: '当饮料喝' },
            { id: 'c', label: '打电话' },
          ],
          answerId: 'a',
        },
        {
          id: 'q2',
          question: '棉花可以做？',
          options: [
            { id: 'a', label: '衣服' },
            { id: 'b', label: '玻璃' },
            { id: 'c', label: '铁锅' },
          ],
          answerId: 'a',
        },
        {
          id: 'q3',
          question: '中药里也有很多？',
          options: [
            { id: 'a', label: '植物' },
            { id: 'b', label: '塑料' },
            { id: 'c', label: '钢筋' },
          ],
          answerId: 'a',
        },
      ]),
      tapRead('植物礼物', [
        { id: 'g1', label: '粮食', speak: '粮食', icon: '🍚', subLabel: '稻麦等' },
        { id: 'g2', label: '蔬菜水果', speak: '蔬菜水果', icon: '🥗' },
        { id: 'g3', label: '木材', speak: '木材', icon: '🪵' },
        { id: 'g4', label: '新鲜空气', speak: '新鲜空气', icon: '🌬️' },
        { id: 'g5', label: '美丽风景', speak: '美丽风景', icon: '🏞️' },
      ]),
      dragMatch('来自植物', [
        { id: 'p1', left: '米饭', right: '水稻' },
        { id: 'p2', left: '棉衣', right: '棉花' },
        { id: 'p3', left: '桌子', right: '木材' },
        { id: 'p4', left: '果汁', right: '水果' },
      ]),
    ], '植物给我们的帮助'),

    level('nature-3-07', '爱护植物', [
      readAlong(
        '爱绿小诗',
        '小树苗',
        [
          { id: 'l1', text: '小树苗，沙沙沙，', speak: '小树苗，沙沙沙' },
          { id: 'l2', text: '风儿吹，雨儿洒。', speak: '风儿吹，雨儿洒' },
          { id: 'l3', text: '我们给它浇浇水，', speak: '我们给它浇浇水' },
          { id: 'l4', text: '它长大，开出花。', speak: '它长大，开出花' },
        ]
      ),
      quiz('护绿行动', [
        {
          id: 'q1',
          question: '公园里的花可以？',
          options: [
            { id: 'a', label: '欣赏，不随意采摘' },
            { id: 'b', label: '全部拔回家' },
            { id: 'c', label: '踩着玩' },
          ],
          answerId: 'a',
        },
        {
          id: 'q2',
          question: '植树节我们可以？',
          options: [
            { id: 'a', label: '种树护绿' },
            { id: 'b', label: '砍树玩' },
            { id: 'c', label: '放火' },
          ],
          answerId: 'a',
        },
        {
          id: 'q3',
          question: '纸张来自树木，所以要？',
          options: [
            { id: 'a', label: '节约用纸' },
            { id: 'b', label: '浪费纸张' },
            { id: 'c', label: '乱扔课本' },
          ],
          answerId: 'a',
        },
      ]),
      tapRead('护绿小妙招', [
        { id: 't1', label: '不踩草坪', speak: '不踩草坪', icon: '🚫' },
        { id: 't2', label: '给花浇水', speak: '给花浇水', icon: '💧' },
        { id: 't3', label: '节约用纸', speak: '节约用纸', icon: '📄' },
        { id: 't4', label: '参与植树', speak: '参与植树', icon: '🌳' },
      ]),
    ], '保护身边的绿色'),
  ],
  '植物结构、生长与爱护'
)

/* ── U4 人与自然 ── */

const u4 = unit(
  'nature-4',
  '人与自然',
  [
    level('nature-4-01', '我们的地球家园', [
      tapRead('美丽地球', [
        { id: 'e1', label: '地球', speak: '地球', icon: '🌍', subLabel: '我们的家' },
        { id: 'e2', label: '蓝天', speak: '蓝天', icon: '天空' },
        { id: 'e3', label: '大海', speak: '大海', icon: '🌊' },
        { id: 'e4', label: '高山', speak: '高山', icon: '⛰️' },
        { id: 'e5', label: '森林', speak: '森林', icon: '🌲' },
        { id: 'e6', label: '草原', speak: '草原', icon: '草地' },
      ]),
      quiz('地球小知识', [
        {
          id: 'q1',
          question: '地球上有？',
          options: [
            { id: 'a', label: '陆地和海洋' },
            { id: 'b', label: '只有沙漠' },
            { id: 'c', label: '没有水' },
          ],
          answerId: 'a',
        },
        {
          id: 'q2',
          question: '保护地球就是？',
          options: [
            { id: 'a', label: '保护我们自己的家' },
            { id: 'b', label: '和我们无关' },
            { id: 'c', label: '只保护玩具' },
          ],
          answerId: 'a',
        },
      ]),
      listenChoose(
        '听一听',
        '地球',
        [
          { id: 'a', label: '🌍 地球' },
          { id: 'b', label: '🌙 月亮' },
          { id: 'c', label: '⭐ 星星' },
        ],
        'a'
      ),
    ], '认识地球家园'),

    level('nature-4-02', '垃圾分类入门', [
      tapRead('四类垃圾', [
        {
          id: 'recyclable',
          label: '可回收物',
          speak: '可回收物',
          icon: '♻️',
          subLabel: '纸、塑料瓶、金属',
          color: '#4DABF7',
        },
        {
          id: 'hazardous',
          label: '有害垃圾',
          speak: '有害垃圾',
          icon: '🔋',
          subLabel: '电池、灯管、过期药',
          color: '#FF6B6B',
        },
        {
          id: 'food',
          label: '厨余垃圾',
          speak: '厨余垃圾',
          icon: '🍎',
          subLabel: '剩饭、果皮',
          color: '#69DB7C',
        },
        {
          id: 'other',
          label: '其他垃圾',
          speak: '其他垃圾',
          icon: '🗑️',
          subLabel: '污染纸、尘土等',
          color: '#868E96',
        },
      ]),
      dragMatch('垃圾放哪里', [
        { id: 'p1', left: '塑料瓶', right: '可回收物' },
        { id: 'p2', left: '废电池', right: '有害垃圾' },
        { id: 'p3', left: '苹果核', right: '厨余垃圾' },
        { id: 'p4', left: '用过的纸巾', right: '其他垃圾' },
      ]),
      quiz('分类小测', [
        {
          id: 'q1',
          question: '空矿泉水瓶属于？',
          options: [
            { id: 'a', label: '可回收物' },
            { id: 'b', label: '有害垃圾' },
            { id: 'c', label: '厨余垃圾' },
          ],
          answerId: 'a',
        },
        {
          id: 'q2',
          question: '过期药品属于？',
          options: [
            { id: 'a', label: '有害垃圾' },
            { id: 'b', label: '厨余垃圾' },
            { id: 'c', label: '可回收物' },
          ],
          answerId: 'a',
        },
        {
          id: 'q3',
          question: '香蕉皮属于？',
          options: [
            { id: 'a', label: '厨余垃圾' },
            { id: 'b', label: '有害垃圾' },
            { id: 'c', label: '可回收物' },
          ],
          answerId: 'a',
        },
      ]),
    ], '学会垃圾分类'),

    level('nature-4-03', '节约资源', [
      tapRead('节约小达人', [
        { id: 'w', label: '节约用水', speak: '节约用水', icon: '💧', subLabel: '关紧水龙头' },
        { id: 'e', label: '节约用电', speak: '节约用电', icon: '💡', subLabel: '人走灯灭' },
        { id: 'f', label: '珍惜粮食', speak: '珍惜粮食', icon: '🍚', subLabel: '不浪费饭菜' },
        { id: 'p', label: '节约用纸', speak: '节约用纸', icon: '📄', subLabel: '双面使用' },
      ]),
      quiz('节约判断', [
        {
          id: 'q1',
          question: '刷牙时应该？',
          options: [
            { id: 'a', label: '关掉水龙头' },
            { id: 'b', label: '一直开着水' },
            { id: 'c', label: '用很多水玩' },
          ],
          answerId: 'a',
        },
        {
          id: 'q2',
          question: '离开房间要？',
          options: [
            { id: 'a', label: '关灯' },
            { id: 'b', label: '把所有灯打开' },
            { id: 'c', label: '开空调吹一夜不管' },
          ],
          answerId: 'a',
        },
        {
          id: 'q3',
          question: '吃饭时最好？',
          options: [
            { id: 'a', label: '吃多少盛多少' },
            { id: 'b', label: '故意剩很多' },
            { id: 'c', label: '把饭扔地上' },
          ],
          answerId: 'a',
        },
      ]),
      sequence('洗手节约步骤', [
        {
          id: 's1',
          prompt: '打湿 → 关水搓洗 → 再开水冲净 → 关水',
          items: [
            { id: 'wet', label: '打湿双手' },
            { id: 'soap', label: '关水搓肥皂' },
            { id: 'rinse', label: '冲干净' },
            { id: 'off', label: '关掉龙头' },
          ],
          answerOrder: ['wet', 'soap', 'rinse', 'off'],
        },
      ]),
    ], '节水节电惜粮食'),

    level('nature-4-04', '减少污染', [
      quiz('环保选择', [
        {
          id: 'q1',
          question: '出门购物更好的是？',
          options: [
            { id: 'a', label: '自带布袋' },
            { id: 'b', label: '每次要很多新塑料袋' },
            { id: 'c', label: '把垃圾扔河里' },
          ],
          answerId: 'a',
        },
        {
          id: 'q2',
          question: '废纸应该？',
          options: [
            { id: 'a', label: '回收利用' },
            { id: 'b', label: '扔进河里' },
            { id: 'c', label: '烧掉玩' },
          ],
          answerId: 'a',
        },
        {
          id: 'q3',
          question: '汽车尾气太多会？',
          options: [
            { id: 'a', label: '污染空气' },
            { id: 'b', label: '让空气更香' },
            { id: 'c', label: '没有影响' },
          ],
          answerId: 'a',
        },
      ]),
      tapRead('绿色出行', [
        { id: 'w', label: '步行', speak: '步行', icon: '🚶' },
        { id: 'b', label: '骑自行车', speak: '骑自行车', icon: '🚲' },
        { id: 'bus', label: '坐公交', speak: '坐公交', icon: '🚌' },
        { id: 'm', label: '地铁', speak: '地铁', icon: '🚇' },
      ]),
      dragMatch('污染与对策', [
        { id: 'p1', left: '乱扔垃圾', right: '放入垃圾桶' },
        { id: 'p2', left: '浪费水', right: '随手关紧龙头' },
        { id: 'p3', left: '过多塑料袋', right: '用布袋' },
        { id: 'p4', left: '空气不好', right: '多种树少开私家车' },
      ]),
    ], '减少污染保护环境'),

    level('nature-4-05', '安全认识自然', [
      tapRead('户外注意', [
        { id: 'n1', label: '不跟陌生人走', speak: '不跟陌生人走', icon: '🚫' },
        { id: 'n2', label: '不随便采野果', speak: '不随便采野果', icon: '🍇' },
        { id: 'n3', label: '不摸陌生动物', speak: '不摸陌生动物', icon: '🐕' },
        { id: 'n4', label: '雷雨不躲树下', speak: '雷雨不躲树下', icon: '⛈️' },
        { id: 'n5', label: '和大人一起', speak: '和大人一起', icon: '👪' },
      ]),
      quiz('安全小测', [
        {
          id: 'q1',
          question: '看到漂亮蘑菇应该？',
          options: [
            { id: 'a', label: '不采不吃，问大人' },
            { id: 'b', label: '立刻尝一口' },
            { id: 'c', label: '带回家乱煮' },
          ],
          answerId: 'a',
        },
        {
          id: 'q2',
          question: '河边玩耍要？',
          options: [
            { id: 'a', label: '有大人陪伴，注意安全' },
            { id: 'b', label: '独自去深水' },
            { id: 'c', label: '推别人下水' },
          ],
          answerId: 'a',
        },
      ]),
      listenChoose(
        '安全提醒',
        '和大人一起',
        [
          { id: 'a', label: '和大人一起' },
          { id: 'b', label: '自己偷偷出门很远' },
          { id: 'c', label: '不告诉家人' },
        ],
        'a'
      ),
    ], '亲近自然也要安全'),

    level('nature-4-06', '自然保护者', [
      readAlong(
        '环保儿歌',
        '小小环保家',
        [
          { id: 'l1', text: '地球妈妈笑哈哈，', speak: '地球妈妈笑哈哈' },
          { id: 'l2', text: '绿树红花美如画。', speak: '绿树红花美如画' },
          { id: 'l3', text: '垃圾分类做得好，', speak: '垃圾分类做得好' },
          { id: 'l4', text: '节约资源人人夸。', speak: '节约资源人人夸' },
        ]
      ),
      quiz('我是小卫士', [
        {
          id: 'q1',
          question: '保护自然从？',
          options: [
            { id: 'a', label: '身边小事做起' },
            { id: 'b', label: '什么都不做' },
            { id: 'c', label: '破坏环境' },
          ],
          answerId: 'a',
        },
        {
          id: 'q2',
          question: '下面哪项是环保行为？',
          options: [
            { id: 'a', label: '垃圾分类、节约水电' },
            { id: 'b', label: '随地扔垃圾' },
            { id: 'c', label: '浪费粮食' },
          ],
          answerId: 'a',
        },
        {
          id: 'q3',
          question: '人和自然应该？',
          options: [
            { id: 'a', label: '和谐相处' },
            { id: 'b', label: '只管破坏' },
            { id: 'c', label: '互不理睬' },
          ],
          answerId: 'a',
        },
      ]),
      tapRead('今日行动清单', [
        { id: 'a1', label: '关紧水龙头', speak: '关紧水龙头', icon: '💧' },
        { id: 'a2', label: '垃圾扔进桶', speak: '垃圾扔进桶', icon: '🗑️' },
        { id: 'a3', label: '爱护花草', speak: '爱护花草', icon: '🌸' },
        { id: 'a4', label: '不浪费粮食', speak: '不浪费粮食', icon: '🍚' },
        { id: 'a5', label: '对小动物温柔', speak: '对小动物温柔', icon: '🐰' },
      ]),
    ], '做小小自然保护者'),
  ],
  '垃圾分类、节约与环保'
)

export const nature: Subject = {
  id: 'nature',
  name: '自然',
  emoji: '🌿',
  color: '#FF8FB8',
  mascot: 'rabbit',
  description: '四季、动植物与环保，带孩子认识身边的大自然',
  units: [u1, u2, u3, u4],
}
