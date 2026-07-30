import type { Subject } from '../../engine/types'
import {
  tapRead,
  listenChoose,
  dragMatch,
  quiz,
  sequence,
  miniLab,
  readAlong,
  level,
  unit,
} from '../helpers'

/* ── U1 物理小实验 ── */

const u1 = unit(
  'science-1',
  '物理小实验',
  [
    level('science-1-01', '浮与沉', [
      tapRead('什么会浮起来', [
        {
          id: 'f1',
          label: '木头',
          speak: '木头会浮在水面',
          icon: '🪵',
          subLabel: '通常会浮',
        },
        {
          id: 'f2',
          label: '泡沫',
          speak: '泡沫很轻会浮',
          icon: '🫧',
        },
        {
          id: 's1',
          label: '石头',
          speak: '石头会沉下去',
          icon: '🪨',
          subLabel: '通常会沉',
        },
        {
          id: 's2',
          label: '钥匙',
          speak: '金属钥匙会沉',
          icon: '🔑',
        },
      ]),
      miniLab('浮沉实验', {
        scene: 'float',
        title: '谁沉谁浮',
        intro: '把不同物品放进水里，看看谁浮起来，谁沉下去。',
        steps: [
          { id: 'st1', label: '准备一盆清水', action: '准备容器和水' },
          { id: 'st2', label: '放入小木块', action: '观察是否浮起' },
          { id: 'st3', label: '放入小石子', action: '观察是否下沉' },
          { id: 'st4', label: '比较轻重与材料', action: '说说发现' },
        ],
        conclusion: '有的东西会浮，有的会沉，和材料、形状都有关系。',
      }),
      quiz('浮沉判断', [
        {
          id: 'q1',
          question: '小石子放进水里通常会？',
          options: [
            { id: 'a', label: '沉下去' },
            { id: 'b', label: '飞起来' },
            { id: 'c', label: '消失' },
          ],
          answerId: 'a',
        },
        {
          id: 'q2',
          question: '充气的皮球在水里常常？',
          options: [
            { id: 'a', label: '浮着' },
            { id: 'b', label: '立刻熔化' },
            { id: 'c', label: '变成石头' },
          ],
          answerId: 'a',
        },
      ]),
    ], '观察物体的浮与沉'),

    level('science-1-02', '磁铁吸引力', [
      tapRead('磁铁小知识', [
        {
          id: 'm1',
          label: '磁铁',
          speak: '磁铁',
          icon: '🧲',
          subLabel: '能吸铁的东西',
        },
        {
          id: 'm2',
          label: '吸铁钉',
          speak: '磁铁能吸铁钉',
          icon: '钉子',
        },
        {
          id: 'm3',
          label: '不吸木头',
          speak: '磁铁一般吸不了木头',
          icon: '🪵',
        },
        {
          id: 'm4',
          label: '不吸塑料',
          speak: '磁铁一般吸不了塑料',
          icon: '🧩',
        },
      ]),
      miniLab('磁铁实验', {
        scene: 'magnet',
        title: '磁铁吸什么',
        intro: '用磁铁去靠近不同物品，看看哪些会被吸住。',
        steps: [
          { id: 'st1', label: '拿出磁铁', action: '准备磁铁' },
          { id: 'st2', label: '靠近铁回形针', action: '观察吸引' },
          { id: 'st3', label: '靠近橡皮', action: '观察无吸引' },
          { id: 'st4', label: '记录结果', action: '分类能吸/不能吸' },
        ],
        conclusion: '磁铁主要吸引含铁的物体，不是什么都能吸。',
      }),
      dragMatch('磁铁能吸吗', [
        { id: 'p1', left: '铁钉', right: '能吸' },
        { id: 'p2', left: '回形针', right: '能吸' },
        { id: 'p3', left: '木头', right: '不能吸' },
        { id: 'p4', left: '纸片', right: '不能吸' },
      ]),
    ], '认识磁铁的本领'),

    level('science-1-03', '光和影子', [
      tapRead('影子从哪里来', [
        {
          id: 'l1',
          label: '光',
          speak: '光',
          icon: '💡',
          subLabel: '手电能发光',
        },
        {
          id: 'l2',
          label: '遮挡',
          speak: '物体挡住光',
          icon: '✋',
        },
        {
          id: 'l3',
          label: '影子',
          speak: '影子',
          icon: '🌑',
          subLabel: '出现在光的另一边',
        },
        {
          id: 'l4',
          label: '太阳影子',
          speak: '太阳也能投下影子',
          icon: '☀️',
        },
      ]),
      miniLab('影子实验', {
        scene: 'shadow',
        title: '动手做影子',
        intro: '用手电筒照手，看看墙上会出现什么影子。',
        steps: [
          { id: 'st1', label: '打开手电筒', action: '制造光源' },
          { id: 'st2', label: '把手放在光前', action: '挡住光线' },
          { id: 'st3', label: '观察墙上的影子', action: '看形状' },
          { id: 'st4', label: '手靠近/远离光源', action: '看影子大小变化' },
        ],
        conclusion: '光被挡住就会出现影子；离光源越近，影子往往越大。',
      }),
      quiz('影子知识', [
        {
          id: 'q1',
          question: '影子产生需要？',
          options: [
            { id: 'a', label: '光和遮挡物' },
            { id: 'b', label: '只有风' },
            { id: 'c', label: '只有声音' },
          ],
          answerId: 'a',
        },
        {
          id: 'q2',
          question: '中午太阳很高时，影子通常？',
          options: [
            { id: 'a', label: '比较短' },
            { id: 'b', label: '特别特别长' },
            { id: 'c', label: '没有规律' },
          ],
          answerId: 'a',
        },
      ]),
    ], '光被挡住产生影子'),

    level('science-1-04', '声音的产生', [
      tapRead('声音从哪来', [
        {
          id: 'v1',
          label: '振动',
          speak: '振动会产生声音',
          icon: '📳',
        },
        {
          id: 'v2',
          label: '敲鼓',
          speak: '敲鼓鼓面振动发声',
          icon: '🥁',
        },
        {
          id: 'v3',
          label: '说话',
          speak: '说话时声带振动',
          icon: '🗣️',
        },
        {
          id: 'v4',
          label: '弹琴',
          speak: '琴弦振动发声',
          icon: '🎸',
        },
      ]),
      miniLab('声音实验', {
        scene: 'sound',
        title: '感受振动',
        intro: '轻轻敲击、拨动，感受发声物体在振动。',
        steps: [
          { id: 'st1', label: '轻敲桌面', action: '听声音' },
          { id: 'st2', label: '摸一摸发声处', action: '感受振动' },
          { id: 'st3', label: '对纸盒说话', action: '听声音变化' },
          { id: 'st4', label: '捂住耳朵', action: '比较听得清不清楚' },
        ],
        conclusion: '声音来自振动；捂住耳朵，听到的声音会变弱。',
      }),
      quiz('声音小测', [
        {
          id: 'q1',
          question: '声音通常由什么产生？',
          options: [
            { id: 'a', label: '振动' },
            { id: 'b', label: '颜色' },
            { id: 'c', label: '味道' },
          ],
          answerId: 'a',
        },
        {
          id: 'q2',
          question: '太大的声音会？',
          options: [
            { id: 'a', label: '伤害耳朵，要保护听力' },
            { id: 'b', label: '让耳朵更健康' },
            { id: 'c', label: '没有关系' },
          ],
          answerId: 'a',
        },
      ]),
    ], '振动产生声音'),

    level('science-1-05', '力的大小', [
      tapRead('推一推拉一拉', [
        { id: 'p1', label: '推力', speak: '推力', icon: '🤚', subLabel: '向前推' },
        { id: 'p2', label: '拉力', speak: '拉力', icon: '🪢', subLabel: '向后拉' },
        { id: 'p3', label: '轻推', speak: '轻轻推，动得慢', icon: '🪶' },
        { id: 'p4', label: '重推', speak: '用力推，动得快', icon: '💪' },
      ]),
      quiz('力的现象', [
        {
          id: 'q1',
          question: '球被踢出去是因为？',
          options: [
            { id: 'a', label: '受到了力' },
            { id: 'b', label: '自己想飞' },
            { id: 'c', label: '没有原因' },
          ],
          answerId: 'a',
        },
        {
          id: 'q2',
          question: '同样的小车，推得越用力通常？',
          options: [
            { id: 'a', label: '滑得更远或更快' },
            { id: 'b', label: '立刻消失' },
            { id: 'c', label: '变成飞机' },
          ],
          answerId: 'a',
        },
        {
          id: 'q3',
          question: '提不动很重的箱子说明？',
          options: [
            { id: 'a', label: '需要更大的力或请大人帮忙' },
            { id: 'b', label: '箱子没有质量' },
            { id: 'c', label: '力不存在' },
          ],
          answerId: 'a',
        },
      ]),
      listenChoose(
        '听一听',
        '推力',
        [
          { id: 'a', label: '推力' },
          { id: 'b', label: '颜色' },
          { id: 'c', label: '声音大小无关的词' },
        ],
        'a'
      ),
    ], '力可以改变物体运动'),

    level('science-1-06', '冷热与温度', [
      tapRead('冷和热', [
        { id: 'h', label: '热', speak: '热', icon: '🔥', subLabel: '太阳、热水' },
        { id: 'c', label: '冷', speak: '冷', icon: '🧊', subLabel: '冰块、冬天' },
        { id: 't', label: '温度', speak: '温度', icon: '🌡️', subLabel: '用温度计测量' },
        { id: 'w', label: '温水', speak: '温水', icon: '🚿', subLabel: '不烫也不冰' },
      ]),
      quiz('冷热安全', [
        {
          id: 'q1',
          question: '很烫的水应该？',
          options: [
            { id: 'a', label: '小心，不要随便碰' },
            { id: 'b', label: '用手去试很久' },
            { id: 'c', label: '倒在身上玩' },
          ],
          answerId: 'a',
        },
        {
          id: 'q2',
          question: '冰放在手里会？',
          options: [
            { id: 'a', label: '慢慢融化成水' },
            { id: 'b', label: '变成石头' },
            { id: 'c', label: '永远不变' },
          ],
          answerId: 'a',
        },
        {
          id: 'q3',
          question: '夏天觉得热可以？',
          options: [
            { id: 'a', label: '多喝水、待阴凉处' },
            { id: 'b', label: '一直晒太阳' },
            { id: 'c', label: '穿很厚的棉衣' },
          ],
          answerId: 'a',
        },
      ]),
      dragMatch('冷热配对', [
        { id: 'p1', left: '🔥', right: '热' },
        { id: 'p2', left: '🧊', right: '冷' },
        { id: 'p3', left: '☀️', right: '晒得暖和' },
        { id: 'p4', left: '❄️', right: '感到寒冷' },
      ]),
    ], '感受冷热注意安全'),

    level('science-1-07', '物理现象复习', [
      quiz('实验知识大闯关', [
        {
          id: 'q1',
          question: '磁铁最常吸引？',
          options: [
            { id: 'a', label: '铁制品' },
            { id: 'b', label: '棉花' },
            { id: 'c', label: '清水' },
          ],
          answerId: 'a',
        },
        {
          id: 'q2',
          question: '影子需要？',
          options: [
            { id: 'a', label: '光被挡住' },
            { id: 'b', label: '只有味道' },
            { id: 'c', label: '只有磁力' },
          ],
          answerId: 'a',
        },
        {
          id: 'q3',
          question: '敲鼓发声是因为？',
          options: [
            { id: 'a', label: '鼓面振动' },
            { id: 'b', label: '鼓会发光' },
            { id: 'c', label: '鼓会浮起来' },
          ],
          answerId: 'a',
        },
        {
          id: 'q4',
          question: '木头放水里常会？',
          options: [
            { id: 'a', label: '浮着' },
            { id: 'b', label: '立刻蒸发没了' },
            { id: 'c', label: '变成磁铁' },
          ],
          answerId: 'a',
        },
      ]),
      sequence('做实验顺序', [
        {
          id: 's1',
          prompt: '想问题 → 做实验 → 看结果 → 得结论',
          items: [
            { id: 'ask', label: '提出问题' },
            { id: 'do', label: '动手实验' },
            { id: 'see', label: '观察结果' },
            { id: 'say', label: '说出结论' },
          ],
          answerOrder: ['ask', 'do', 'see', 'say'],
        },
      ]),
      listenChoose(
        '科学态度',
        '仔细观察',
        [
          { id: 'a', label: '仔细观察' },
          { id: 'b', label: '乱猜就好' },
          { id: 'c', label: '不看结果' },
        ],
        'a'
      ),
    ], '复习浮沉磁光声'),
  ],
  '浮沉、磁铁、影子与声音'
)

/* ── U2 我的身体 ── */

const u2 = unit(
  'science-2',
  '我的身体',
  [
    level('science-2-01', '身体部位', [
      tapRead('我的身体', [
        { id: 'head', label: '头', speak: '头', icon: '🗣️' },
        { id: 'eye', label: '眼睛', speak: '眼睛', icon: '👁️' },
        { id: 'ear', label: '耳朵', speak: '耳朵', icon: '👂' },
        { id: 'nose', label: '鼻子', speak: '鼻子', icon: '👃' },
        { id: 'mouth', label: '嘴巴', speak: '嘴巴', icon: '👄' },
        { id: 'hand', label: '手', speak: '手', icon: '✋' },
        { id: 'foot', label: '脚', speak: '脚', icon: '🦶' },
        { id: 'heart', label: '心脏', speak: '心脏', icon: '❤️', subLabel: '在胸腔里跳动' },
      ]),
      dragMatch('部位和作用', [
        { id: 'p1', left: '眼睛', right: '看' },
        { id: 'p2', left: '耳朵', right: '听' },
        { id: 'p3', left: '鼻子', right: '闻' },
        { id: 'p4', left: '嘴巴', right: '吃和说' },
        { id: 'p5', left: '脚', right: '走路' },
      ]),
      listenChoose(
        '听部位',
        '眼睛',
        [
          { id: 'a', label: '👁️ 眼睛' },
          { id: 'b', label: '👂 耳朵' },
          { id: 'c', label: '👃 鼻子' },
        ],
        'a'
      ),
    ], '认识身体各部位'),

    level('science-2-02', '五感世界', [
      tapRead('五种感觉', [
        { id: 'see', label: '视觉', speak: '视觉', icon: '👀', subLabel: '用眼睛看' },
        { id: 'hear', label: '听觉', speak: '听觉', icon: '👂', subLabel: '用耳朵听' },
        { id: 'smell', label: '嗅觉', speak: '嗅觉', icon: '👃', subLabel: '用鼻子闻' },
        { id: 'taste', label: '味觉', speak: '味觉', icon: '👅', subLabel: '用舌头尝' },
        { id: 'touch', label: '触觉', speak: '触觉', icon: '✋', subLabel: '用手摸' },
      ]),
      quiz('五感判断', [
        {
          id: 'q1',
          question: '分辨铃声靠？',
          options: [
            { id: 'a', label: '听觉' },
            { id: 'b', label: '味觉' },
            { id: 'c', label: '嗅觉' },
          ],
          answerId: 'a',
        },
        {
          id: 'q2',
          question: '知道花香靠？',
          options: [
            { id: 'a', label: '嗅觉' },
            { id: 'b', label: '视觉' },
            { id: 'c', label: '听觉' },
          ],
          answerId: 'a',
        },
        {
          id: 'q3',
          question: '知道冰是凉的靠？',
          options: [
            { id: 'a', label: '触觉' },
            { id: 'b', label: '听觉' },
            { id: 'c', label: '味觉' },
          ],
          answerId: 'a',
        },
      ]),
    ], '看听闻尝摸'),

    level('science-2-03', '牙齿与保护', [
      tapRead('可爱的牙齿', [
        { id: 't1', label: '门牙', speak: '门牙', icon: '🦷', subLabel: '切断食物' },
        { id: 't2', label: '磨牙', speak: '磨牙', icon: '🦷', subLabel: '磨碎食物' },
        { id: 't3', label: '乳牙', speak: '乳牙', icon: '👶', subLabel: '小时候的牙' },
        { id: 't4', label: '刷牙', speak: '刷牙', icon: '🪥', subLabel: '早晚都要刷' },
      ]),
      sequence('正确刷牙顺序提示', [
        {
          id: 's1',
          prompt: '挤牙膏 → 刷外面 → 刷里面 → 漱口',
          items: [
            { id: 'paste', label: '挤牙膏' },
            { id: 'out', label: '刷外侧' },
            { id: 'in', label: '刷内侧' },
            { id: 'rinse', label: '漱口' },
          ],
          answerOrder: ['paste', 'out', 'in', 'rinse'],
        },
      ]),
      quiz('护牙知识', [
        {
          id: 'q1',
          question: '每天至少刷几次牙比较好？',
          options: [
            { id: 'a', label: '早晚两次' },
            { id: 'b', label: '一年一次' },
            { id: 'c', label: '从不刷' },
          ],
          answerId: 'a',
        },
        {
          id: 'q2',
          question: '吃完甜食最好？',
          options: [
            { id: 'a', label: '漱口或刷牙' },
            { id: 'b', label: '再吃更多不漱口' },
            { id: 'c', label: '用牙咬硬物玩' },
          ],
          answerId: 'a',
        },
      ]),
    ], '爱护牙齿'),

    level('science-2-04', '骨骼与肌肉', [
      tapRead('支架和力量', [
        {
          id: 'b1',
          label: '骨骼',
          speak: '骨骼',
          icon: '🦴',
          subLabel: '支撑身体',
        },
        {
          id: 'm1',
          label: '肌肉',
          speak: '肌肉',
          icon: '💪',
          subLabel: '帮助运动',
        },
        {
          id: 'j1',
          label: '关节',
          speak: '关节',
          icon: '🦵',
          subLabel: '让身体能弯曲',
        },
      ]),
      quiz('运动小知识', [
        {
          id: 'q1',
          question: '经常运动可以？',
          options: [
            { id: 'a', label: '让身体更强壮' },
            { id: 'b', label: '让骨头消失' },
            { id: 'c', label: '不用吃饭' },
          ],
          answerId: 'a',
        },
        {
          id: 'q2',
          question: '摔倒时要？',
          options: [
            { id: 'a', label: '告诉大人，必要时检查' },
            { id: 'b', label: '忍着不说继续猛跑' },
            { id: 'c', label: '自己用药乱涂' },
          ],
          answerId: 'a',
        },
        {
          id: 'q3',
          question: '坐姿端正有助于？',
          options: [
            { id: 'a', label: '保护脊椎' },
            { id: 'b', label: '长不高' },
            { id: 'c', label: '眼睛变差更快' },
          ],
          answerId: 'a',
        },
      ]),
      dragMatch('配对', [
        { id: 'p1', left: '骨骼', right: '支撑身体' },
        { id: 'p2', left: '肌肉', right: '产生力量' },
        { id: 'p3', left: '关节', right: '弯曲活动' },
        { id: 'p4', left: '运动', right: '强身健体' },
      ]),
    ], '骨骼肌肉帮我们运动'),

    level('science-2-05', '呼吸与心跳', [
      tapRead('呼吸心跳', [
        {
          id: 'r1',
          label: '鼻子呼吸',
          speak: '用鼻子呼吸',
          icon: '👃',
        },
        {
          id: 'l1',
          label: '肺',
          speak: '肺',
          icon: '🫁',
          subLabel: '交换气体',
        },
        {
          id: 'h1',
          label: '心跳',
          speak: '心跳',
          icon: '💓',
          subLabel: '把血液送到全身',
        },
        {
          id: 'b1',
          label: '血液',
          speak: '血液',
          icon: '🩸',
          subLabel: '运送氧气和养分',
        },
      ]),
      quiz('生命体征', [
        {
          id: 'q1',
          question: '跑步后会感觉？',
          options: [
            { id: 'a', label: '呼吸加快、心跳加快' },
            { id: 'b', label: '完全不喘气' },
            { id: 'c', label: '心脏停止' },
          ],
          answerId: 'a',
        },
        {
          id: 'q2',
          question: '新鲜空气对身体？',
          options: [
            { id: 'a', label: '很重要' },
            { id: 'b', label: '不需要' },
            { id: 'c', label: '有害' },
          ],
          answerId: 'a',
        },
      ]),
      listenChoose(
        '听一听',
        '心跳',
        [
          { id: 'a', label: '心跳' },
          { id: 'b', label: '脚印' },
          { id: 'c', label: '影子' },
        ],
        'a'
      ),
    ], '呼吸与血液循环入门'),

    level('science-2-06', '健康生活', [
      tapRead('健康好习惯', [
        { id: 'h1', label: '早睡早起', speak: '早睡早起', icon: '😴' },
        { id: 'h2', label: '洗手吃饭', speak: '吃饭前洗手', icon: '🧼' },
        { id: 'h3', label: '均衡饮食', speak: '均衡饮食', icon: '🥗' },
        { id: 'h4', label: '多喝水', speak: '多喝水', icon: '💧' },
        { id: 'h5', label: '户外活动', speak: '户外活动', icon: '🏃' },
        { id: 'h6', label: '少看屏幕', speak: '少看屏幕', icon: '📱' },
      ]),
      quiz('习惯判断', [
        {
          id: 'q1',
          question: '吃饭前应该？',
          options: [
            { id: 'a', label: '洗手' },
            { id: 'b', label: '玩泥巴再吃' },
            { id: 'c', label: '不洗也没关系' },
          ],
          answerId: 'a',
        },
        {
          id: 'q2',
          question: '晚上熬夜对身体？',
          options: [
            { id: 'a', label: '不好，要早点睡' },
            { id: 'b', label: '更好' },
            { id: 'c', label: '完全没影响' },
          ],
          answerId: 'a',
        },
        {
          id: 'q3',
          question: '只吃糖不吃菜会？',
          options: [
            { id: 'a', label: '营养不均衡' },
            { id: 'b', label: '更健康' },
            { id: 'c', label: '牙齿自动变好' },
          ],
          answerId: 'a',
        },
      ]),
      sequence('早上起床小流程', [
        {
          id: 's1',
          prompt: '起床 → 洗漱 → 吃早餐 → 出门',
          items: [
            { id: 'up', label: '起床' },
            { id: 'wash', label: '洗漱' },
            { id: 'eat', label: '吃早餐' },
            { id: 'go', label: '出门' },
          ],
          answerOrder: ['up', 'wash', 'eat', 'go'],
        },
      ]),
    ], '养成健康好习惯'),

    level('science-2-07', '生病与求助', [
      quiz('身体不舒服时', [
        {
          id: 'q1',
          question: '发烧了应该？',
          options: [
            { id: 'a', label: '告诉爸爸妈妈，必要时看医生' },
            { id: 'b', label: '自己乱吃药' },
            { id: 'c', label: '瞒着大家继续剧烈运动' },
          ],
          answerId: 'a',
        },
        {
          id: 'q2',
          question: '吃药必须？',
          options: [
            { id: 'a', label: '听医生或大人的指导' },
            { id: 'b', label: '觉得糖就多吃' },
            { id: 'c', label: '把药当糖玩' },
          ],
          answerId: 'a',
        },
        {
          id: 'q3',
          question: '打喷嚏时最好？',
          options: [
            { id: 'a', label: '用手肘或纸巾遮挡' },
            { id: 'b', label: '对着别人的脸' },
            { id: 'c', label: '不遮挡到处喷' },
          ],
          answerId: 'a',
        },
      ]),
      tapRead('防疫小常识', [
        { id: 'a1', label: '勤洗手', speak: '勤洗手', icon: '🧼' },
        { id: 'a2', label: '常通风', speak: '常通风', icon: '🪟' },
        { id: 'a3', label: '打疫苗听大人安排', speak: '打疫苗听大人安排', icon: '💉' },
        { id: 'a4', label: '不舒服早说', speak: '不舒服早说', icon: '🤒' },
      ]),
      readAlong(
        '健康儿歌',
        '身体棒棒',
        [
          { id: 'l1', text: '勤洗手，讲卫生，', speak: '勤洗手，讲卫生' },
          { id: 'l2', text: '多运动，身体棒。', speak: '多运动，身体棒' },
          { id: 'l3', text: '早睡觉，吃得香，', speak: '早睡觉，吃得香' },
          { id: 'l4', text: '天天向上喜洋洋。', speak: '天天向上喜洋洋' },
        ]
      ),
    ], '生病懂得求助与防护'),
  ],
  '身体部位、五感与健康'
)

/* ── U3 地球宇宙 ── */

const u3 = unit(
  'science-3',
  '地球宇宙',
  [
    level('science-3-01', '太阳和地球', [
      tapRead('太阳系小入门', [
        {
          id: 'sun',
          label: '太阳',
          speak: '太阳',
          icon: '☀️',
          subLabel: '给我们光和热',
        },
        {
          id: 'earth',
          label: '地球',
          speak: '地球',
          icon: '🌍',
          subLabel: '我们生活的星球',
        },
        {
          id: 'day',
          label: '白天',
          speak: '白天',
          icon: '🌤️',
          subLabel: '有阳光',
        },
        {
          id: 'night',
          label: '夜晚',
          speak: '夜晚',
          icon: '🌃',
          subLabel: '背对太阳的一面',
        },
      ]),
      quiz('日夜成因', [
        {
          id: 'q1',
          question: '白天主要因为？',
          options: [
            { id: 'a', label: '有太阳光照到' },
            { id: 'b', label: '月亮特别亮一直照' },
            { id: 'c', label: '没有原因' },
          ],
          answerId: 'a',
        },
        {
          id: 'q2',
          question: '地球是？',
          options: [
            { id: 'a', label: '一颗行星' },
            { id: 'b', label: '一颗恒星' },
            { id: 'c', label: '一块饼干' },
          ],
          answerId: 'a',
        },
        {
          id: 'q3',
          question: '不能长时间直视太阳，因为？',
          options: [
            { id: 'a', label: '会伤害眼睛' },
            { id: 'b', label: '会更明亮看得更清' },
            { id: 'c', label: '没有关系' },
          ],
          answerId: 'a',
        },
      ]),
    ], '太阳给地球光和热'),

    level('science-3-02', '月亮和星星', [
      tapRead('夜空朋友', [
        { id: 'moon', label: '月亮', speak: '月亮', icon: '🌙', subLabel: '有圆有缺' },
        { id: 'star', label: '星星', speak: '星星', icon: '⭐', subLabel: '夜里闪烁' },
        { id: 'full', label: '满月', speak: '满月', icon: '🌕' },
        { id: 'crescent', label: '弯月', speak: '弯月', icon: '🌛' },
      ]),
      listenChoose(
        '听一听',
        '月亮',
        [
          { id: 'a', label: '🌙 月亮' },
          { id: 'b', label: '☀️ 太阳' },
          { id: 'c', label: '🌍 地球' },
        ],
        'a'
      ),
      quiz('夜空知识', [
        {
          id: 'q1',
          question: '月亮自己会发光吗？',
          options: [
            { id: 'a', label: '主要是反射太阳光' },
            { id: 'b', label: '像手电筒自己发电' },
            { id: 'c', label: '靠电池' },
          ],
          answerId: 'a',
        },
        {
          id: 'q2',
          question: '星星看起来很小是因为？',
          options: [
            { id: 'a', label: '离我们非常远' },
            { id: 'b', label: '真的只有米粒大' },
            { id: 'c', label: '它们是玩具' },
          ],
          answerId: 'a',
        },
      ]),
    ], '认识月亮与星星'),

    level('science-3-03', '昼夜与旋转', [
      tapRead('地球在转', [
        {
          id: 'r1',
          label: '自转',
          speak: '自转',
          icon: '🔄',
          subLabel: '地球自己旋转',
        },
        {
          id: 'r2',
          label: '昼夜交替',
          speak: '昼夜交替',
          icon: '🌓',
          subLabel: '白天黑夜轮流出现',
        },
        {
          id: 'r3',
          label: '东边日出',
          speak: '太阳从东边升起',
          icon: '🌅',
        },
        {
          id: 'r4',
          label: '西边日落',
          speak: '太阳从西边落下',
          icon: '🌇',
        },
      ]),
      sequence('一天的顺序', [
        {
          id: 's1',
          prompt: '早晨 → 中午 → 傍晚 → 夜晚',
          items: [
            { id: 'm', label: '🌅 早晨' },
            { id: 'n', label: '☀️ 中午' },
            { id: 'e', label: '🌇 傍晚' },
            { id: 'night', label: '🌃 夜晚' },
          ],
          answerOrder: ['m', 'n', 'e', 'night'],
        },
      ]),
      quiz('昼夜小测', [
        {
          id: 'q1',
          question: '太阳升起的方向通常是？',
          options: [
            { id: 'a', label: '东方' },
            { id: 'b', label: '西方' },
            { id: 'c', label: '正下方' },
          ],
          answerId: 'a',
        },
        {
          id: 'q2',
          question: '昼夜变化主要和什么有关？',
          options: [
            { id: 'a', label: '地球自转' },
            { id: 'b', label: '我们眨眼' },
            { id: 'c', label: '关灯开关' },
          ],
          answerId: 'a',
        },
      ]),
    ], '昼夜为什么会交替'),

    level('science-3-04', '地球上的水陆', [
      tapRead('陆地和海洋', [
        { id: 'land', label: '陆地', speak: '陆地', icon: '🏞️' },
        { id: 'ocean', label: '海洋', speak: '海洋', icon: '🌊' },
        { id: 'river', label: '河流', speak: '河流', icon: '🏞️' },
        { id: 'lake', label: '湖泊', speak: '湖泊', icon: '🏞️' },
        { id: 'mountain', label: '高山', speak: '高山', icon: '⛰️' },
        { id: 'plain', label: '平原', speak: '平原', icon: '🌾' },
      ]),
      quiz('水陆知识', [
        {
          id: 'q1',
          question: '地球表面大部分是？',
          options: [
            { id: 'a', label: '海洋' },
            { id: 'b', label: '只有沙漠' },
            { id: 'c', label: '只有冰' },
          ],
          answerId: 'a',
        },
        {
          id: 'q2',
          question: '淡水对生命？',
          options: [
            { id: 'a', label: '非常重要' },
            { id: 'b', label: '不需要' },
            { id: 'c', label: '有害' },
          ],
          answerId: 'a',
        },
      ]),
      dragMatch('地貌配对', [
        { id: 'p1', left: '⛰️', right: '高山' },
        { id: 'p2', left: '🌊', right: '海洋' },
        { id: 'p3', left: '🌾', right: '平原/田野' },
        { id: 'p4', left: '🏜️', right: '沙漠' },
      ]),
    ], '认识陆地与水体'),

    level('science-3-05', '天气与空气', [
      tapRead('看不见的空气', [
        {
          id: 'a1',
          label: '空气',
          speak: '空气',
          icon: '💨',
          subLabel: '无处不在',
        },
        {
          id: 'a2',
          label: '风',
          speak: '风',
          icon: '🌬️',
          subLabel: '空气流动',
        },
        {
          id: 'a3',
          label: '呼吸',
          speak: '我们靠空气呼吸',
          icon: '😮‍💨',
        },
        {
          id: 'a4',
          label: '干净空气',
          speak: '干净空气对健康很重要',
          icon: '🌳',
        },
      ]),
      quiz('空气小测', [
        {
          id: 'q1',
          question: '人离开空气能长时间生存吗？',
          options: [
            { id: 'a', label: '不能' },
            { id: 'b', label: '能很多天' },
            { id: 'c', label: '完全不需要空气' },
          ],
          answerId: 'a',
        },
        {
          id: 'q2',
          question: '风是？',
          options: [
            { id: 'a', label: '空气在流动' },
            { id: 'b', label: '水在唱歌' },
            { id: 'c', label: '土在走路' },
          ],
          answerId: 'a',
        },
      ]),
      listenChoose(
        '听概念',
        '空气',
        [
          { id: 'a', label: '空气' },
          { id: 'b', label: '积木' },
          { id: 'c', label: '书包' },
        ],
        'a'
      ),
    ], '空气与风'),

    level('science-3-06', '太空梦想', [
      tapRead('航天小百科', [
        { id: 'r1', label: '火箭', speak: '火箭', icon: '🚀' },
        { id: 'a1', label: '宇航员', speak: '宇航员', icon: '👨‍🚀' },
        { id: 's1', label: '太空站', speak: '太空站', icon: '🛰️' },
        { id: 'm1', label: '登月', speak: '登月', icon: '🌕' },
      ]),
      quiz('航天兴趣', [
        {
          id: 'q1',
          question: '火箭可以？',
          options: [
            { id: 'a', label: '把航天器送上太空' },
            { id: 'b', label: '在水里游泳' },
            { id: 'c', label: '当普通铅笔用' },
          ],
          answerId: 'a',
        },
        {
          id: 'q2',
          question: '宇航员在太空常穿？',
          options: [
            { id: 'a', label: '航天服' },
            { id: 'b', label: '普通拖鞋出门' },
            { id: 'c', label: '雨衣就够' },
          ],
          answerId: 'a',
        },
        {
          id: 'q3',
          question: '对宇宙保持好奇很好，但首先要？',
          options: [
            { id: 'a', label: '好好学习、注意安全' },
            { id: 'b', label: '自己做危险实验' },
            { id: 'c', label: '不吃饭去太空' },
          ],
          answerId: 'a',
        },
      ]),
      readAlong(
        '太空小诗',
        '飞向太空',
        [
          { id: 'l1', text: '太阳公公眯眯笑，', speak: '太阳公公眯眯笑' },
          { id: 'l2', text: '月亮姐姐挂树梢。', speak: '月亮姐姐挂树梢' },
          { id: 'l3', text: '星星眨着小眼睛，', speak: '星星眨着小眼睛' },
          { id: 'l4', text: '我坐火箭去逍遥。', speak: '我坐火箭去逍遥' },
        ]
      ),
    ], '认识航天与太空'),

    level('science-3-07', '宇宙综合', [
      dragMatch('天体配对', [
        { id: 'p1', left: '☀️', right: '太阳' },
        { id: 'p2', left: '🌍', right: '地球' },
        { id: 'p3', left: '🌙', right: '月亮' },
        { id: 'p4', left: '⭐', right: '星星' },
        { id: 'p5', left: '🚀', right: '火箭' },
      ]),
      quiz('综合测验', [
        {
          id: 'q1',
          question: '给我们光和热的主要是？',
          options: [
            { id: 'a', label: '太阳' },
            { id: 'b', label: '冰箱' },
            { id: 'c', label: '石头' },
          ],
          answerId: 'a',
        },
        {
          id: 'q2',
          question: '昼夜交替和地球什么有关？',
          options: [
            { id: 'a', label: '自转' },
            { id: 'b', label: '眨眼' },
            { id: 'c', label: '吃饭' },
          ],
          answerId: 'a',
        },
        {
          id: 'q3',
          question: '保护地球家园要？',
          options: [
            { id: 'a', label: '爱护环境' },
            { id: 'b', label: '随意污染' },
            { id: 'c', label: '浪费资源' },
          ],
          answerId: 'a',
        },
      ]),
    ], '太阳地球月亮综合'),
  ],
  '太阳、月亮、地球与太空'
)

/* ── U4 身边科学 ── */

const u4 = unit(
  'science-4',
  '身边科学',
  [
    level('science-4-01', '水的形态', [
      tapRead('水的三态', [
        {
          id: 'liquid',
          label: '液态水',
          speak: '液态水',
          icon: '💧',
          subLabel: '能流动',
        },
        {
          id: 'solid',
          label: '冰',
          speak: '冰',
          icon: '🧊',
          subLabel: '固态',
        },
        {
          id: 'gas',
          label: '水蒸气',
          speak: '水蒸气',
          icon: '💨',
          subLabel: '气态',
        },
      ]),
      miniLab('水的变化', {
        scene: 'water',
        title: '水会变身',
        intro: '观察水结冰、融化，以及加热出现“白气”的现象（需大人陪伴）。',
        steps: [
          { id: 'st1', label: '看一看常温的水', action: '观察液体' },
          { id: 'st2', label: '观察冰块', action: '认识固态' },
          { id: 'st3', label: '冰慢慢融化', action: '固态变液态' },
          { id: 'st4', label: '热水上方的“白气”', action: '认识水蒸气凝结' },
        ],
        conclusion: '水可以在固态、液态、气态之间变化，温度很关键。',
      }),
      quiz('水的形态', [
        {
          id: 'q1',
          question: '冰是水的？',
          options: [
            { id: 'a', label: '固态' },
            { id: 'b', label: '气态' },
            { id: 'c', label: '香味' },
          ],
          answerId: 'a',
        },
        {
          id: 'q2',
          question: '冰变水主要因为？',
          options: [
            { id: 'a', label: '温度升高融化' },
            { id: 'b', label: '它想变成糖' },
            { id: 'c', label: '没有原因' },
          ],
          answerId: 'a',
        },
      ]),
    ], '认识水的三态变化'),

    level('science-4-02', '溶解现象', [
      tapRead('什么是溶解', [
        {
          id: 'd1',
          label: '溶解',
          speak: '溶解',
          icon: '🧂',
          subLabel: '像盐进水里“看不见”了',
        },
        {
          id: 'd2',
          label: '食盐',
          speak: '食盐能溶在水里',
          icon: '🧂',
        },
        {
          id: 'd3',
          label: '沙子',
          speak: '沙子不容易溶解',
          icon: '🏜️',
        },
        {
          id: 'd4',
          label: '搅拌',
          speak: '搅拌可以加快溶解',
          icon: '🥄',
        },
      ]),
      miniLab('溶解实验', {
        scene: 'dissolve',
        title: '谁能溶进水里',
        intro: '把盐、糖、沙等放进水里，看看哪些会溶解（大人陪伴）。',
        steps: [
          { id: 'st1', label: '准备两杯清水', action: '准备材料' },
          { id: 'st2', label: '一杯加盐并搅拌', action: '观察溶解' },
          { id: 'st3', label: '一杯加沙并搅拌', action: '观察不溶或沉淀' },
          { id: 'st4', label: '比较结果', action: '说说不同' },
        ],
        conclusion: '有的物质能溶解在水里，有的不能；搅拌和温度会影响快慢。',
      }),
      quiz('溶解判断', [
        {
          id: 'q1',
          question: '白糖放进温水里常会？',
          options: [
            { id: 'a', label: '逐渐溶解' },
            { id: 'b', label: '变成小鱼' },
            { id: 'c', label: '立刻结冰' },
          ],
          answerId: 'a',
        },
        {
          id: 'q2',
          question: '沙子放进水里通常？',
          options: [
            { id: 'a', label: '沉底，不容易溶解' },
            { id: 'b', label: '完全变成空气' },
            { id: 'c', label: '变成糖' },
          ],
          answerId: 'a',
        },
      ]),
    ], '观察溶解现象'),

    level('science-4-03', '材料大不同', [
      tapRead('身边材料', [
        { id: 'wood', label: '木头', speak: '木头', icon: '🪵' },
        { id: 'metal', label: '金属', speak: '金属', icon: '🔩' },
        { id: 'plastic', label: '塑料', speak: '塑料', icon: '🧴' },
        { id: 'glass', label: '玻璃', speak: '玻璃', icon: '🪟', subLabel: '易碎要小心' },
        { id: 'paper', label: '纸', speak: '纸', icon: '📄' },
        { id: 'cloth', label: '布', speak: '布', icon: '👕' },
      ]),
      dragMatch('物品与材料', [
        { id: 'p1', left: '木头桌子', right: '木头' },
        { id: 'p2', left: '钥匙', right: '金属' },
        { id: 'p3', left: '水瓶', right: '塑料或金属' },
        { id: 'p4', left: '窗户', right: '玻璃' },
        { id: 'p5', left: '书本', right: '纸' },
      ]),
      quiz('材料性质', [
        {
          id: 'q1',
          question: '玻璃制品要？',
          options: [
            { id: 'a', label: '轻拿轻放' },
            { id: 'b', label: '用力摔着玩' },
            { id: 'c', label: '当球踢' },
          ],
          answerId: 'a',
        },
        {
          id: 'q2',
          question: '金属勺子常常？',
          options: [
            { id: 'a', label: '比较坚硬' },
            { id: 'b', label: '像棉花软' },
            { id: 'c', label: '会飞' },
          ],
          answerId: 'a',
        },
      ]),
    ], '认识常见材料'),

    level('science-4-04', '简单机械', [
      tapRead('省力小工具', [
        {
          id: 'lever',
          label: '杠杆',
          speak: '杠杆',
          icon: '⚖️',
          subLabel: '像跷跷板',
        },
        {
          id: 'wheel',
          label: '轮子',
          speak: '轮子',
          icon: '🛞',
          subLabel: '让物体更好移动',
        },
        {
          id: 'slope',
          label: '斜面',
          speak: '斜面',
          icon: '📐',
          subLabel: '滑梯也是斜面',
        },
        {
          id: 'screw',
          label: '螺丝',
          speak: '螺丝',
          icon: '🔩',
        },
      ]),
      quiz('机械现象', [
        {
          id: 'q1',
          question: '箱子底下装轮子是为了？',
          options: [
            { id: 'a', label: '更容易推动' },
            { id: 'b', label: '更难移动' },
            { id: 'c', label: '让箱子消失' },
          ],
          answerId: 'a',
        },
        {
          id: 'q2',
          question: '滑梯利用了？',
          options: [
            { id: 'a', label: '斜面' },
            { id: 'b', label: '磁铁' },
            { id: 'c', label: '影子' },
          ],
          answerId: 'a',
        },
        {
          id: 'q3',
          question: '跷跷板两边一上一下像？',
          options: [
            { id: 'a', label: '杠杆' },
            { id: 'b', label: '彩虹' },
            { id: 'c', label: '云朵' },
          ],
          answerId: 'a',
        },
      ]),
    ], '轮子、斜面与杠杆'),

    level('science-4-05', '电池与电路启蒙', [
      tapRead('电的小常识', [
        {
          id: 'b1',
          label: '电池',
          speak: '电池',
          icon: '🔋',
          subLabel: '能提供电能',
        },
        {
          id: 'l1',
          label: '小灯泡',
          speak: '小灯泡',
          icon: '💡',
        },
        {
          id: 'w1',
          label: '电线',
          speak: '电线',
          icon: '🔌',
        },
        {
          id: 's1',
          label: '安全第一',
          speak: '用电安全第一',
          icon: '⚠️',
          subLabel: '不玩插座',
        },
      ]),
      quiz('用电安全', [
        {
          id: 'q1',
          question: '插座可以玩吗？',
          options: [
            { id: 'a', label: '不可以，很危险' },
            { id: 'b', label: '可以随便插手指' },
            { id: 'c', label: '可以浇水玩' },
          ],
          answerId: 'a',
        },
        {
          id: 'q2',
          question: '废电池应该？',
          options: [
            { id: 'a', label: '投放到有害垃圾处' },
            { id: 'b', label: '扔进河里' },
            { id: 'c', label: '当玩具咬' },
          ],
          answerId: 'a',
        },
        {
          id: 'q3',
          question: '手电筒亮是因为？',
          options: [
            { id: 'a', label: '电池提供电能' },
            { id: 'b', label: '它会自己变魔法' },
            { id: 'c', label: '和影子有关' },
          ],
          answerId: 'a',
        },
      ]),
      listenChoose(
        '安全提醒',
        '用电安全第一',
        [
          { id: 'a', label: '用电安全第一' },
          { id: 'b', label: '随便玩电线' },
          { id: 'c', label: '插座当积木' },
        ],
        'a'
      ),
    ], '认识电池并强调安全'),

    level('science-4-06', '观察与记录', [
      tapRead('小小科学家', [
        {
          id: 'o1',
          label: '观察',
          speak: '观察',
          icon: '🔍',
          subLabel: '用眼睛仔细看',
        },
        {
          id: 'q1',
          label: '提问',
          speak: '提问',
          icon: '❓',
        },
        {
          id: 't1',
          label: '尝试',
          speak: '尝试',
          icon: '🧪',
        },
        {
          id: 'r1',
          label: '记录',
          speak: '记录',
          icon: '📝',
        },
        {
          id: 'c1',
          label: '分享',
          speak: '分享发现',
          icon: '🗣️',
        },
      ]),
      sequence('探究步骤', [
        {
          id: 's1',
          prompt: '观察 → 提问 → 实验 → 记录',
          items: [
            { id: 'obs', label: '观察' },
            { id: 'ask', label: '提问' },
            { id: 'exp', label: '实验' },
            { id: 'note', label: '记录' },
          ],
          answerOrder: ['obs', 'ask', 'exp', 'note'],
        },
      ]),
      quiz('科学态度', [
        {
          id: 'q1',
          question: '实验时最好？',
          options: [
            { id: 'a', label: '仔细看、认真想' },
            { id: 'b', label: '闭着眼睛猜' },
            { id: 'c', label: '随便破坏材料' },
          ],
          answerId: 'a',
        },
        {
          id: 'q2',
          question: '结果和预想不同时？',
          options: [
            { id: 'a', label: '再想想为什么' },
            { id: 'b', label: '生气扔掉' },
            { id: 'c', label: '说谎隐瞒' },
          ],
          answerId: 'a',
        },
      ]),
    ], '学习科学探究方法'),

    level('science-4-07', '身边科学综合', [
      quiz('综合闯关', [
        {
          id: 'q1',
          question: '水结成冰是？',
          options: [
            { id: 'a', label: '液态变固态' },
            { id: 'b', label: '变成木头' },
            { id: 'c', label: '消失了' },
          ],
          answerId: 'a',
        },
        {
          id: 'q2',
          question: '盐放入水中搅拌，常会？',
          options: [
            { id: 'a', label: '溶解' },
            { id: 'b', label: '变成磁铁' },
            { id: 'c', label: '飞走' },
          ],
          answerId: 'a',
        },
        {
          id: 'q3',
          question: '轮子的作用是？',
          options: [
            { id: 'a', label: '让搬运更轻松' },
            { id: 'b', label: '让东西更重' },
            { id: 'c', label: '制造影子' },
          ],
          answerId: 'a',
        },
        {
          id: 'q4',
          question: '做科学最重要的是？',
          options: [
            { id: 'a', label: '安全、观察、思考' },
            { id: 'b', label: '乱跑乱碰' },
            { id: 'c', label: '不看结果' },
          ],
          answerId: 'a',
        },
      ]),
      dragMatch('现象配对', [
        { id: 'p1', left: '🧊→💧', right: '融化' },
        { id: 'p2', left: '🧂+💧', right: '溶解' },
        { id: 'p3', left: '🛞', right: '便于移动' },
        { id: 'p4', left: '🔋+💡', right: '电能发光' },
      ]),
      readAlong(
        '科学儿歌',
        '我爱科学',
        [
          { id: 'l1', text: '问一问，看一看，', speak: '问一问，看一看' },
          { id: 'l2', text: '做实验，记一记。', speak: '做实验，记一记' },
          { id: 'l3', text: '身边科学真有趣，', speak: '身边科学真有趣' },
          { id: 'l4', text: '小小发现大秘密。', speak: '小小发现大秘密' },
        ]
      ),
    ], '综合运用身边科学'),
  ],
  '水、溶解、材料与探究'
)

export const science: Subject = {
  id: 'science',
  name: '科学',
  emoji: '🔬',
  color: '#9B7BFF',
  mascot: 'bear',
  description: '动手实验、认识身体与宇宙，在好奇中爱上科学',
  units: [u1, u2, u3, u4],
}
