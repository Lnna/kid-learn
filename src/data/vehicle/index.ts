import type { Subject } from '../../engine/types'
import { tapRead, listenChoose, dragMatch, blend, quiz, sequence, level, unit } from '../helpers'

const EN = 'en-US'

/* ── U1 认识工程车 ── */

const u1 = unit(
  'vehicle-1',
  '认识工程车',
  [
    level(
      'vehicle-1-01',
      '工程车大集合',
      [
        tapRead('认识五位工地好朋友', [
          { id: 'v1', label: '挖掘机', subLabel: '挖土铲沙', speak: '挖掘机，挖土的大力士', icon: 'excavator' },
          { id: 'v2', label: '推土机', subLabel: '把地推平', speak: '推土机，平地小能手', icon: 'bulldozer' },
          { id: 'v3', label: '起重机', subLabel: '吊起重物', speak: '起重机，有高高的吊臂', icon: 'crane' },
          { id: 'v4', label: '自卸车', subLabel: '运土运沙', speak: '自卸车，会翻斗的卡车', icon: 'dumptruck' },
          { id: 'v5', label: '搅拌车', subLabel: '搅拌混凝土', speak: '搅拌车，肚子会转圈圈', icon: 'mixer' },
        ], '点一点，听一听它们的名字'),
        listenChoose(
          '听一听，它是谁',
          '它有一把大铲子，专门挖土挖沙，它是谁？',
          [
            { id: 'a', label: '挖掘机', icon: 'excavator', speak: '挖掘机' },
            { id: 'b', label: '起重机', icon: 'crane', speak: '起重机' },
            { id: 'c', label: '压路机', icon: 'roller', speak: '压路机' },
          ],
          'a'
        ),
        listenChoose(
          '再来猜一个',
          '它的肚子圆圆会转圈，一边走一边搅拌，它是谁？',
          [
            { id: 'a', label: '搅拌车', icon: 'mixer', speak: '搅拌车' },
            { id: 'b', label: '自卸车', icon: 'dumptruck', speak: '自卸车' },
            { id: 'c', label: '推土机', icon: 'bulldozer', speak: '推土机' },
          ],
          'a'
        ),
      ],
      '认一认工地上的大力士们',
      ['excavator']
    ),
    level(
      'vehicle-1-02',
      '谁来做这件事',
      [
        dragMatch('工作找帮手', [
          { id: 'p1', left: '挖土坑', right: '挖掘机', leftIcon: '🕳️', rightIcon: 'excavator' },
          { id: 'p2', left: '推平地面', right: '推土机', leftIcon: '⛰️', rightIcon: 'bulldozer' },
          { id: 'p3', left: '吊起钢筋', right: '起重机', leftIcon: '🏢', rightIcon: 'crane' },
          { id: 'p4', left: '运走泥土', right: '自卸车', leftIcon: '🟫', rightIcon: 'dumptruck' },
        ], '把工作和会干活的工程车连起来'),
        quiz('工地小裁判', [
          {
            id: 'q1',
            question: '要把新修的马路面压得平平的，该请谁帮忙？',
            speak: '要把新修的马路面压得平平的，该请谁帮忙？',
            options: [
              { id: 'a', label: '压路机', icon: 'roller' },
              { id: 'b', label: '搅拌车', icon: 'mixer' },
              { id: 'c', label: '叉车', icon: 'forklift' },
            ],
            answerId: 'a',
            explain: '压路机的大钢轮能把路面压得又平又结实。',
          },
          {
            id: 'q2',
            question: '仓库里的货箱太重了，要请谁搬上货架？',
            speak: '仓库里的货箱太重了，要请谁搬上货架？',
            options: [
              { id: 'a', label: '叉车', icon: 'forklift' },
              { id: 'b', label: '挖掘机', icon: 'excavator' },
              { id: 'c', label: '推土机', icon: 'bulldozer' },
            ],
            answerId: 'a',
            explain: '叉车的两根钢叉能举起很重的货箱。',
          },
          {
            id: 'q3',
            question: '盖楼房要把水泥搅得匀匀的，谁最在行？',
            speak: '盖楼房要把水泥搅得匀匀的，谁最在行？',
            options: [
              { id: 'a', label: '搅拌车', icon: 'mixer' },
              { id: 'b', label: '自卸车', icon: 'dumptruck' },
              { id: 'c', label: '起重机', icon: 'crane' },
            ],
            answerId: 'a',
            explain: '搅拌车的滚筒转呀转，混凝土就不会变硬。',
          },
        ]),
      ],
      '功能配配对',
      ['bulldozer']
    ),
    level(
      'vehicle-1-03',
      '英语车名说一说',
      [
        tapRead('工程车英文名', [
          { id: 'e1', label: 'Digger', subLabel: '挖掘机', speak: 'Digger', speakLang: EN, icon: 'excavator' },
          { id: 'e2', label: 'Crane', subLabel: '起重机', speak: 'Crane', speakLang: EN, icon: 'crane' },
          { id: 'e3', label: 'Truck', subLabel: '卡车', speak: 'Truck', speakLang: EN, icon: 'dumptruck' },
        ], '点一点，读一读英文名'),
        blend('拼一拼车名', [
          { id: 'b1', parts: ['d', 'i', 'gger'], result: 'digger', speak: 'digger', speakLang: EN },
          { id: 'b2', parts: ['c', 'r', 'ane'], result: 'crane', speak: 'crane', speakLang: EN },
          { id: 'b3', parts: ['t', 'r', 'uck'], result: 'truck', speak: 'truck', speakLang: EN },
        ]),
        listenChoose(
          '听英语找车',
          'digger',
          [
            { id: 'a', label: '挖掘机', icon: 'excavator', speak: '挖掘机' },
            { id: 'b', label: '起重机', icon: 'crane', speak: '起重机' },
            { id: 'c', label: '卡车', icon: 'dumptruck', speak: '卡车' },
          ],
          'a',
          { promptLang: EN, promptLabel: '听英语单词' }
        ),
      ],
      'digger、crane、truck',
      ['crane']
    ),
    level(
      'vehicle-1-04',
      '听声音，辨车辆',
      [
        listenChoose(
          '轰隆隆是谁',
          '轰隆隆，轰隆隆，大钢轮慢慢压过来，是谁来了？',
          [
            { id: 'a', label: '压路机', icon: 'roller', speak: '压路机' },
            { id: 'b', label: '搅拌车', icon: 'mixer', speak: '搅拌车' },
            { id: 'c', label: '叉车', icon: 'forklift', speak: '叉车' },
          ],
          'a'
        ),
        listenChoose(
          '滴滴倒车啦',
          '滴滴滴，车斗翘起来倒土啦，是谁在工作？',
          [
            { id: 'a', label: '自卸车', icon: 'dumptruck', speak: '自卸车' },
            { id: 'b', label: '起重机', icon: 'crane', speak: '起重机' },
            { id: 'c', label: '推土机', icon: 'bulldozer', speak: '推土机' },
          ],
          'a'
        ),
        quiz('声音小侦探', [
          {
            id: 'q1',
            question: '「嗡嗡嗡——」大圆筒转个不停，这是谁的声音？',
            speak: '嗡嗡嗡，大圆筒转个不停，这是谁的声音？',
            options: [
              { id: 'a', label: '搅拌车', icon: 'mixer' },
              { id: 'b', label: '挖掘机', icon: 'excavator' },
              { id: 'c', label: '压路机', icon: 'roller' },
            ],
            answerId: 'a',
            explain: '搅拌车的滚筒一直转，发出嗡嗡的声音。',
          },
          {
            id: 'q2',
            question: '「咔啦咔啦」履带响，大铲子一下一下挖土，是谁？',
            speak: '咔啦咔啦，履带响，大铲子一下一下挖土，是谁？',
            options: [
              { id: 'a', label: '挖掘机', icon: 'excavator' },
              { id: 'b', label: '自卸车', icon: 'dumptruck' },
              { id: 'c', label: '叉车', icon: 'forklift' },
            ],
            answerId: 'a',
            explain: '挖掘机踩着履带，挥动大铲子挖土。',
          },
        ]),
      ],
      '轰隆隆，是谁来了',
      ['mixer']
    ),
  ],
  '认车名、配功能、听声音'
)

/* ── U2 工地上显身手 ── */

const u2 = unit(
  'vehicle-2',
  '工地上显身手',
  [
    level(
      'vehicle-2-01',
      '铲斗量一量',
      [
        tapRead('工地量词小课堂', [
          { id: 'm1', label: '方', subLabel: '一方土', speak: '方，一方土的方', icon: '🟫' },
          { id: 'm2', label: '吨', subLabel: '一吨货', speak: '吨，一吨货的吨', icon: '⚖️' },
          { id: 'm3', label: '斗', subLabel: '一斗沙', speak: '斗，一斗沙的斗', icon: '🪣' },
        ], '点一点，认识工地上的量词'),
        quiz('数格子，装几斗', [
          {
            id: 'q1',
            question: '挖掘机的铲斗一次能装 1 方土，装了 3 斗，一共是几方？',
            speak: '挖掘机的铲斗一次能装一方土，装了三斗，一共是几方？',
            options: [
              { id: 'a', label: '3 方', icon: '3️⃣' },
              { id: 'b', label: '2 方', icon: '2️⃣' },
              { id: 'c', label: '5 方', icon: '5️⃣' },
            ],
            answerId: 'a',
            explain: '一斗一方，三斗就是三方。',
          },
          {
            id: 'q2',
            question: '一堆土占 4 格，另一堆占 2 格，哪堆土更多？',
            speak: '一堆土占四格，另一堆占两格，哪堆土更多？',
            options: [
              { id: 'a', label: '4 格那堆', icon: '🟫' },
              { id: 'b', label: '2 格那堆', icon: '🟤' },
              { id: 'c', label: '一样多', icon: '➖' },
            ],
            answerId: 'a',
            explain: '4 格比 2 格多，占格子多的土堆更大。',
          },
          {
            id: 'q3',
            question: '装载机的铲斗能装 3 方，挖掘机的铲斗能装 1 方，谁的铲斗大？',
            speak: '装载机的铲斗能装三方，挖掘机的铲斗能装一方，谁的铲斗大？',
            options: [
              { id: 'a', label: '装载机', icon: 'loader' },
              { id: 'b', label: '挖掘机', icon: 'excavator' },
              { id: 'c', label: '一样大', icon: '➖' },
            ],
            answerId: 'a',
            explain: '3 方比 1 方大，装载机的铲斗更大。',
          },
        ]),
      ],
      '一斗一方，数格子量一量',
      ['loader']
    ),
    level(
      'vehicle-2-02',
      '车辆排排队',
      [
        sequence('按大小排一排', [
          {
            id: 's1',
            prompt: '把工程车按从小到大排队',
            speak: '叉车最小，挖掘机中等，起重机最大，请按从小到大排一排',
            items: [
              { id: 'a', label: '叉车', icon: 'forklift', speak: '叉车最小' },
              { id: 'b', label: '挖掘机', icon: 'excavator', speak: '挖掘机中等' },
              { id: 'c', label: '起重机', icon: 'crane', speak: '起重机最大' },
            ],
            answerOrder: ['a', 'b', 'c'],
          },
          {
            id: 's2',
            prompt: '把工程车按从大到小排队',
            speak: '请把起重机、挖掘机、叉车按从大到小排一排',
            items: [
              { id: 'a', label: '起重机', icon: 'crane' },
              { id: 'b', label: '挖掘机', icon: 'excavator' },
              { id: 'c', label: '叉车', icon: 'forklift' },
            ],
            answerOrder: ['a', 'b', 'c'],
          },
        ]),
        listenChoose(
          '谁装得多',
          '自卸车能装 5 吨，叉车能举 3 吨，谁装得多？',
          [
            { id: 'a', label: '自卸车', icon: 'dumptruck', speak: '自卸车' },
            { id: 'b', label: '叉车', icon: 'forklift', speak: '叉车' },
            { id: 'c', label: '一样多', icon: '➖', speak: '一样多' },
          ],
          'a'
        ),
      ],
      '从小到大排一排',
      ['roller']
    ),
    level(
      'vehicle-2-03',
      '工地安全小卫士',
      [
        quiz('安全记心上', [
          {
            id: 'q1',
            question: '走进工地前，第一件事要做什么？',
            speak: '走进工地前，第一件事要做什么？',
            options: [
              { id: 'a', label: '戴上安全帽', icon: '⛑️' },
              { id: 'b', label: '跑进去玩', icon: '🏃' },
              { id: 'c', label: '大声唱歌', icon: '🎤' },
            ],
            answerId: 'a',
            explain: '安全帽能保护我们的脑袋。',
          },
          {
            id: 'q2',
            question: '起重机吊着重物时，可以站在吊臂下面吗？',
            speak: '起重机吊着重物的时候，可以站在吊臂下面吗？',
            options: [
              { id: 'a', label: '不可以', icon: '🚫' },
              { id: 'b', label: '可以', icon: '✅' },
              { id: 'c', label: '吊得高就可以', icon: 'crane' },
            ],
            answerId: 'a',
            explain: '吊臂下面最危险，要离得远远的。',
          },
          {
            id: 'q3',
            question: '在工地边上走路，应该走哪里？',
            speak: '在工地边上走路，应该走哪里？',
            options: [
              { id: 'a', label: '安全通道', icon: '🦺' },
              { id: 'b', label: '车辆中间', icon: 'dumptruck' },
              { id: 'c', label: '土堆上面', icon: '⛰️' },
            ],
            answerId: 'a',
            explain: '安全通道是专门为行人留出来的路。',
          },
        ]),
        dragMatch('安全装备配配对', [
          { id: 'p1', left: '⛑️ 安全帽', right: '保护脑袋' },
          { id: 'p2', left: '🦺 反光背心', right: '让人看见我' },
          { id: 'p3', left: '🚧 围栏', right: '不能走进去' },
        ], '把安全装备和它的作用连起来'),
      ],
      '安全帽戴戴好',
      ['dumptruck']
    ),
    level(
      'vehicle-2-04',
      '启动步骤排一排',
      [
        sequence('开车前的准备', [
          {
            id: 's1',
            prompt: '把启动工程车的步骤排一排',
            speak: '先戴好安全帽，再看看周围有没有人，最后鸣笛启动。请排一排',
            items: [
              { id: 'a', label: '戴好安全帽', icon: '⛑️', speak: '先戴好安全帽' },
              { id: 'b', label: '看看周围有没有人', icon: '👀', speak: '再看看周围' },
              { id: 'c', label: '鸣笛再启动', icon: '📢', speak: '最后鸣笛启动' },
            ],
            answerOrder: ['a', 'b', 'c'],
          },
        ]),
        quiz('操作小司机', [
          {
            id: 'q1',
            question: '启动工程车前先按喇叭，是为了什么？',
            speak: '启动工程车前先按喇叭，是为了什么？',
            options: [
              { id: 'a', label: '提醒大家躲开', icon: '📢' },
              { id: 'b', label: '叫醒小鸟', icon: '🐦' },
              { id: 'c', label: '觉得好玩', icon: '🎉' },
            ],
            answerId: 'a',
            explain: '鸣笛是告诉周围的人：车要动啦，请注意安全！',
          },
          {
            id: 'q2',
            question: '收工了，司机应该把车停在哪里？',
            speak: '收工了，司机应该把车停在哪里？',
            options: [
              { id: 'a', label: '平坦的空地上', icon: '🅿️' },
              { id: 'b', label: '斜坡上', icon: '⛰️' },
              { id: 'c', label: '吊臂下面', icon: 'crane' },
            ],
            answerId: 'a',
            explain: '平坦的空地最安全，斜坡上车会滑走。',
          },
        ]),
      ],
      '先鸣笛，再启动',
      ['forklift']
    ),
  ],
  '量一量、排一排、安全记心上'
)

/* ── U3 小小驾驶员 ── */

const u3 = unit(
  'vehicle-3',
  '小小驾驶员',
  [
    level(
      'vehicle-3-01',
      '数字与容量',
      [
        quiz('装车小会计', [
          {
            id: 'q1',
            question: '自卸车能装 5 吨土，已经装了 3 吨，还能装几吨？',
            speak: '自卸车能装五吨土，已经装了三吨，还能装几吨？',
            options: [
              { id: 'a', label: '2 吨', icon: '2️⃣' },
              { id: 'b', label: '8 吨', icon: '8️⃣' },
              { id: 'c', label: '5 吨', icon: '5️⃣' },
            ],
            answerId: 'a',
            explain: '5 减 3 等于 2，还能装 2 吨。',
          },
          {
            id: 'q2',
            question: '两辆自卸车，一辆装 5 吨，一辆装 3 吨，一共装了几吨？',
            speak: '两辆自卸车，一辆装五吨，一辆装三吨，一共装了几吨？',
            options: [
              { id: 'a', label: '8 吨', icon: '8️⃣' },
              { id: 'b', label: '2 吨', icon: '2️⃣' },
              { id: 'c', label: '53 吨', icon: '🔢' },
            ],
            answerId: 'a',
            explain: '5 加 3 等于 8。',
          },
          {
            id: 'q3',
            question: '搅拌车的滚筒能装 6 方混凝土，已经装了 6 方，说明？',
            speak: '搅拌车的滚筒能装六方混凝土，已经装了六方，说明什么？',
            options: [
              { id: 'a', label: '装满了', icon: '✅' },
              { id: 'b', label: '还是空的', icon: '🈳' },
              { id: 'c', label: '装了一半', icon: '🌗' },
            ],
            answerId: 'a',
            explain: '能装 6 方，装了 6 方，正好装满。',
          },
        ]),
        sequence('按容量排一排', [
          {
            id: 's1',
            prompt: '把工程车按“能装的量”从小到大排队',
            speak: '挖掘机铲斗装一方，装载机铲斗装三方，搅拌车滚筒装六方，请从小到大排一排',
            items: [
              { id: 'a', label: '挖掘机 1方', icon: 'excavator', speak: '挖掘机装一方' },
              { id: 'b', label: '装载机 3方', icon: 'loader', speak: '装载机装三方' },
              { id: 'c', label: '搅拌车 6方', icon: 'mixer', speak: '搅拌车装六方' },
            ],
            answerOrder: ['a', 'b', 'c'],
          },
        ]),
      ],
      '自卸车装几吨',
      ['dumptruck']
    ),
    level(
      'vehicle-3-02',
      '英语复习大闯关',
      [
        listenChoose(
          '听英语找车 · 一',
          'crane',
          [
            { id: 'a', label: '起重机', icon: 'crane', speak: '起重机' },
            { id: 'b', label: '挖掘机', icon: 'excavator', speak: '挖掘机' },
            { id: 'c', label: '搅拌车', icon: 'mixer', speak: '搅拌车' },
          ],
          'a',
          { promptLang: EN, promptLabel: '听英语单词' }
        ),
        listenChoose(
          '听英语找车 · 二',
          'truck',
          [
            { id: 'a', label: '卡车', icon: 'dumptruck', speak: '卡车' },
            { id: 'b', label: '压路机', icon: 'roller', speak: '压路机' },
            { id: 'c', label: '叉车', icon: 'forklift', speak: '叉车' },
          ],
          'a',
          { promptLang: EN, promptLabel: '听英语单词' }
        ),
        dragMatch('中英文配配对', [
          { id: 'p1', left: 'Digger', right: '挖掘机', leftIcon: 'excavator' },
          { id: 'p2', left: 'Crane', right: '起重机', leftIcon: 'crane' },
          { id: 'p3', left: 'Truck', right: '卡车', leftIcon: 'dumptruck' },
        ], '把英文车名和中文车名连起来'),
      ],
      'digger、crane、truck 全记住',
      ['crane']
    ),
    level(
      'vehicle-3-03',
      '车辆部件认一认',
      [
        tapRead('部件认一认', [
          { id: 'p1', label: '铲斗', subLabel: '挖土装土用', speak: '铲斗，挖土装土的大铲子', icon: '🪣' },
          { id: 'p2', label: '吊臂', subLabel: '吊起重物用', speak: '吊臂，起重机的长手臂', icon: 'crane' },
          { id: 'p3', label: '车斗', subLabel: '装土运土用', speak: '车斗，自卸车装土的大箱子', icon: 'dumptruck' },
          { id: 'p4', label: '轮胎', subLabel: '跑路全靠它', speak: '轮胎，又大又圆的轮子', icon: '🛞' },
        ], '点一点，认识工程车的部件'),
        dragMatch('部件回家', [
          { id: 'p1', left: '大铲斗', right: '挖掘机', leftIcon: '🪣', rightIcon: 'excavator' },
          { id: 'p2', left: '长吊臂', right: '起重机', leftIcon: '💪', rightIcon: 'crane' },
          { id: 'p3', left: '翻斗', right: '自卸车', leftIcon: '📤', rightIcon: 'dumptruck' },
          { id: 'p4', left: '钢叉', right: '叉车', leftIcon: '🍴', rightIcon: 'forklift' },
        ], '把部件送回正确的工程车'),
      ],
      '铲斗、吊臂、大轮胎',
      ['excavator']
    ),
    level(
      'vehicle-3-04',
      '工地任务总动员',
      [
        quiz('选对车，干对活', [
          {
            id: 'q1',
            question: '工地要挖一个大坑建地基，该派谁去？',
            speak: '工地要挖一个大坑建地基，该派谁去？',
            options: [
              { id: 'a', label: '挖掘机', icon: 'excavator' },
              { id: 'b', label: '压路机', icon: 'roller' },
              { id: 'c', label: '搅拌车', icon: 'mixer' },
            ],
            answerId: 'a',
            explain: '挖地基是挖掘机的拿手好戏。',
          },
          {
            id: 'q2',
            question: '钢筋太重了，要吊到楼顶去，请谁帮忙？',
            speak: '钢筋太重了，要吊到楼顶去，请谁帮忙？',
            options: [
              { id: 'a', label: '起重机', icon: 'crane' },
              { id: 'b', label: '自卸车', icon: 'dumptruck' },
              { id: 'c', label: '叉车', icon: 'forklift' },
            ],
            answerId: 'a',
            explain: '起重机的长吊臂能把重物吊到高高的地方。',
          },
          {
            id: 'q3',
            question: '新路修好了，要把路面压得平平的，谁来收尾？',
            speak: '新路修好了，要把路面压得平平的，谁来收尾？',
            options: [
              { id: 'a', label: '压路机', icon: 'roller' },
              { id: 'b', label: '推土机', icon: 'bulldozer' },
              { id: 'c', label: '挖掘机', icon: 'excavator' },
            ],
            answerId: 'a',
            explain: '压路机慢慢开过去，路面就又平又结实。',
          },
        ]),
        listenChoose(
          '终极考验',
          '它肚子圆圆会转圈，一边走一边搅拌混凝土，它是谁？',
          [
            { id: 'a', label: '搅拌车', icon: 'mixer', speak: '搅拌车' },
            { id: 'b', label: '自卸车', icon: 'dumptruck', speak: '自卸车' },
            { id: 'c', label: '装载机', icon: 'loader', speak: '装载机' },
          ],
          'a'
        ),
      ],
      '帮工地选对车',
      ['loader']
    ),
  ],
  '带上本领，出发干活'
)

export const vehicle: Subject = {
  id: 'vehicle',
  name: '工程车驾驶员',
  emoji: 'excavator',
  color: '#FFB300',
  mascot: 'vehicle',
  description: '发动引擎，驾驶工程车建设城市',
  units: [u1, u2, u3],
}
