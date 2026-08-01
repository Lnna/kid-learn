import type { Subject } from '../../engine/types'
import { tapRead, listenChoose, dragMatch, quiz, sequence, gridDig, rockLab, level, unit } from '../helpers'

/* ── U1 岩石观察站 ── */

const u1 = unit(
  'gem-1',
  '岩石观察站',
  [
    level(
      'gem-1-01',
      '岩石诊所',
      [
        tapRead('认识岩石的皮肤', [
          { id: 'r1', label: '光滑', speak: '光滑，摸起来滑滑的', icon: '🪨', subLabel: '像鹅卵石' },
          { id: 'r2', label: '粗糙', speak: '粗糙，摸起来毛毛的', icon: '🧱', subLabel: '像砖块' },
          { id: 'r3', label: '有颗粒', speak: '有颗粒，能看到小点点', icon: '🍚', subLabel: '像砂糖' },
          { id: 'r4', label: '会反光', speak: '会反光，亮晶晶的', icon: '✨', subLabel: '像镜子' },
        ], '点一点，听一听岩石的特征词'),
        quiz('小医生来诊断', [
          {
            id: 'q1',
            question: '河边的鹅卵石摸起来是什么感觉？',
            speak: '河边的鹅卵石摸起来是什么感觉？',
            options: [
              { id: 'a', label: '光滑', icon: '🪨' },
              { id: 'b', label: '扎手', icon: '🌵' },
              { id: 'c', label: '软软', icon: '🧽' },
            ],
            answerId: 'a',
            explain: '鹅卵石被河水冲得圆圆的，摸起来很光滑。',
          },
          {
            id: 'q2',
            question: '花岗岩表面有许多小点点，用哪个词形容最合适？',
            speak: '花岗岩表面有许多小点点，用哪个词形容最合适？',
            options: [
              { id: 'a', label: '有颗粒', icon: '🍚' },
              { id: 'b', label: '透明', icon: '🥛' },
              { id: 'c', label: '毛茸茸', icon: '🐻' },
            ],
            answerId: 'a',
            explain: '花岗岩由好几种矿物小颗粒组成。',
          },
          {
            id: 'q3',
            question: '云母片在阳光下会怎样？',
            speak: '云母片在阳光下会怎样？',
            options: [
              { id: 'a', label: '闪闪发光', icon: '✨' },
              { id: 'b', label: '马上融化', icon: '🫠' },
              { id: 'c', label: '变成水', icon: '💧' },
            ],
            answerId: 'a',
            explain: '云母亮晶晶的，会反光。',
          },
        ]),
      ],
      '学会用放大镜观察岩石',
      ['mica']
    ),
    level(
      'gem-1-02',
      '硬度大挑战',
      [
        rockLab('给滑石做体检', 'scratch', '滑石', '指甲就能划动滑石，它是最软的矿物。', {
          hardness: 1,
          outerColor: '#E8F5E9',
        }),
        rockLab('给方解石做体检', 'scratch', '方解石', '指甲划不动、硬币能划动，方解石硬度中等。', {
          hardness: 2,
          outerColor: '#FFF3E0',
        }),
        rockLab('给石英做体检', 'scratch', '石英', '连小刀都划不动，石英是很硬的矿物。', {
          hardness: 3,
          outerColor: '#FFFFFF',
        }),
      ],
      '用指甲和硬币当工具',
      ['talc']
    ),
    level(
      'gem-1-03',
      '颜色迷局',
      [
        rockLab('黄铁矿的秘密', 'streak', '黄铁矿', '黄铁矿外表金色，条痕却是墨绿色！', {
          outerColor: '#D4AF37',
          streakColor: '#2E5A1C',
        }),
        quiz('条痕小侦探', [
          {
            id: 'q1',
            question: '石头的外表颜色和条痕颜色，可能一样吗？',
            speak: '石头的外表颜色和条痕颜色，可能不一样吗？',
            options: [
              { id: 'a', label: '可能不一样', icon: '🎨' },
              { id: 'b', label: '永远一样', icon: '♾️' },
            ],
            answerId: 'a',
            explain: '条痕色才是矿物的“本色”，常常和外表不一样。',
          },
          {
            id: 'q2',
            question: '想知道矿物的本色，地质学家会把它在哪里擦一擦？',
            speak: '想知道矿物的本色，地质学家会把它在哪里擦一擦？',
            options: [
              { id: 'a', label: '白色瓷板上', icon: '⬜' },
              { id: 'b', label: '草地上', icon: '🌱' },
              { id: 'c', label: '水里', icon: '💧' },
            ],
            answerId: 'a',
            explain: '白色无釉瓷板是地质学家的好帮手。',
          },
        ]),
      ],
      '石头也会“流血”',
      ['pyrite']
    ),
    level(
      'gem-1-04',
      '矿物身份证',
      [
        listenChoose(
          '听线索找矿物',
          '它是金色的，硬币划不动它，条痕是墨绿色的，它是谁？',
          [
            { id: 'a', label: '黄铁矿', icon: '🟡', speak: '黄铁矿' },
            { id: 'b', label: '滑石', icon: '🟢', speak: '滑石' },
            { id: 'c', label: '石膏', icon: '⚪', speak: '石膏' },
          ],
          'a'
        ),
        quiz('三条线索定身份', [
          {
            id: 'q1',
            question: '线索：很硬、透明、沙子是它变的。它是？',
            speak: '线索：很硬、透明、沙子是它变的。它是？',
            options: [
              { id: 'a', label: '石英', icon: '💎' },
              { id: 'b', label: '滑石', icon: '🧼' },
              { id: 'c', label: '云母', icon: '📄' },
            ],
            answerId: 'a',
            explain: '石英很硬，沙子主要就是石英小颗粒。',
          },
          {
            id: 'q2',
            question: '线索：最软、滑滑的、爽身粉里有它。它是？',
            speak: '线索：最软、滑滑的、爽身粉里有它。它是？',
            options: [
              { id: 'a', label: '滑石', icon: '🧼' },
              { id: 'b', label: '磁铁矿', icon: '🧲' },
              { id: 'c', label: '黑曜石', icon: '⚫' },
            ],
            answerId: 'a',
            explain: '滑石是世界上最软的矿物。',
          },
          {
            id: 'q3',
            question: '线索：能被磁铁吸住、古代指南针用它。它是？',
            speak: '线索：能被磁铁吸住、古代指南针用它。它是？',
            options: [
              { id: 'a', label: '磁铁矿', icon: '🧲' },
              { id: 'b', label: '紫水晶', icon: '🔮' },
              { id: 'c', label: '孔雀石', icon: '🦚' },
            ],
            answerId: 'a',
            explain: '磁铁矿有磁性，司南就是用它做的。',
          },
        ]),
      ],
      '用三条线索锁定矿物',
      ['calcite']
    ),
  ],
  '摸摸、划划、擦擦，认识矿物的皮肤'
)

/* ── U2 矿洞历险 ── */

const u2 = unit(
  'gem-2',
  '矿洞历险',
  [
    level(
      'gem-2-01',
      '宝石坐标矿洞',
      [
        gridDig(
          '按坐标挖宝石',
          'mine',
          [
            { row: 2, col: 4, icon: '💎', label: '石英', speak: '哇，挖到石英啦' },
            { row: 4, col: 2, icon: '🔮', label: '紫水晶', speak: '漂亮的紫水晶' },
            { row: 5, col: 5, icon: '🦴', label: '小化石', speak: '意外惊喜，一块小化石' },
          ],
          '地质学家用“第几行第几列”记录宝藏位置，你也来试试！'
        ),
      ],
      '第几行第几列，一挖一个准',
      ['quartz']
    ),
    level(
      'gem-2-02',
      '矿车修路',
      [
        sequence('按规律铺轨道', [
          {
            id: 's1',
            prompt: '矿车轨道缺了一块，按规律应该放哪颗宝石？',
            speak: '红蓝红蓝红蓝，接下来该放什么颜色？',
            items: [
              { id: 'a', label: '红宝石', icon: '🔴', speak: '红宝石' },
              { id: 'b', label: '蓝宝石', icon: '🔵', speak: '蓝宝石' },
              { id: 'c', label: '绿宝石', icon: '🟢', speak: '绿宝石' },
            ],
            answerOrder: ['b'],
          },
          {
            id: 's2',
            prompt: '把宝石按“红、红、蓝”的规律排下去',
            speak: '红红蓝红红蓝，请接着排两个',
            items: [
              { id: 'a', label: '红宝石', icon: '🔴' },
              { id: 'b', label: '蓝宝石', icon: '🔵' },
              { id: 'c', label: '红宝石', icon: '🔴' },
            ],
            answerOrder: ['a', 'b'],
          },
        ]),
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
        ]),
      ],
      '修好矿车轨道',
      ['fluorite']
    ),
    level(
      'gem-2-03',
      '宝石首字母宝箱',
      [
        dragMatch('宝石回家', [
          { id: 'p1', left: 'Ruby 红宝石', right: 'R', leftIcon: '🔴' },
          { id: 'p2', left: 'Emerald 祖母绿', right: 'E', leftIcon: '🟢' },
          { id: 'p3', left: 'Sapphire 蓝宝石', right: 'S', leftIcon: '🔵' },
          { id: 'p4', left: 'Amethyst 紫水晶', right: 'A', leftIcon: '🟣' },
        ], '把宝石放进对应首字母的宝箱'),
        tapRead('宝石英文名叫一叫', [
          { id: 'e1', label: 'Ruby', subLabel: '红宝石', speak: 'Ruby', speakLang: 'en-US', icon: '🔴' },
          { id: 'e2', label: 'Emerald', subLabel: '祖母绿', speak: 'Emerald', speakLang: 'en-US', icon: '🟢' },
          { id: 'e3', label: 'Sapphire', subLabel: '蓝宝石', speak: 'Sapphire', speakLang: 'en-US', icon: '🔵' },
          { id: 'e4', label: 'Amethyst', subLabel: '紫水晶', speak: 'Amethyst', speakLang: 'en-US', icon: '🟣' },
        ], '点一点，读一读英文名'),
      ],
      '字母宝箱开一开',
      ['amethyst']
    ),
    level(
      'gem-2-04',
      '硬度排排队',
      [
        sequence('从软到硬排一排', [
          {
            id: 's1',
            prompt: '把矿物按从软到硬排队',
            speak: '请把滑石、方解石、石英按从软到硬排一排',
            items: [
              { id: 'a', label: '滑石', icon: '🧼', speak: '滑石最软' },
              { id: 'b', label: '方解石', icon: '🟨', speak: '方解石中等' },
              { id: 'c', label: '石英', icon: '💎', speak: '石英最硬' },
            ],
            answerOrder: ['a', 'b', 'c'],
          },
          {
            id: 's2',
            prompt: '把工具按“能划动的矿物越来越多”排队',
            speak: '指甲、硬币、小刀，谁最厉害？请从弱到强排一排',
            items: [
              { id: 'a', label: '指甲', icon: '💅' },
              { id: 'b', label: '硬币', icon: '🪙' },
              { id: 'c', label: '小刀', icon: '🔪' },
            ],
            answerOrder: ['a', 'b', 'c'],
          },
        ]),
        listenChoose(
          '谁最硬',
          '滑石、方解石、石英，谁最硬？',
          [
            { id: 'a', label: '滑石', icon: '🧼', speak: '滑石' },
            { id: 'b', label: '方解石', icon: '🟨', speak: '方解石' },
            { id: 'c', label: '石英', icon: '💎', speak: '石英' },
          ],
          'c'
        ),
      ],
      '给矿物和工具排队',
      ['gypsum']
    ),
  ],
  '深入矿洞，规律、字母、坐标全用上'
)

/* ── U3 岩石的由来 ── */

const u3 = unit(
  'gem-3',
  '岩石的由来',
  [
    level(
      'gem-3-01',
      '火山快递',
      [
        rockLab('岩浆冷却实验', 'volcano', '岩浆', '冷却快变黑曜石，冷却慢变花岗岩。', {}),
        quiz('快与慢的秘密', [
          {
            id: 'q1',
            question: '岩浆喷出地面快速冷却，会变成？',
            speak: '岩浆喷出地面快速冷却，会变成？',
            options: [
              { id: 'a', label: '黑曜石', icon: '⚫' },
              { id: 'b', label: '花岗岩', icon: '🩶' },
              { id: 'c', label: '石膏', icon: '⚪' },
            ],
            answerId: 'a',
            explain: '喷出地表冷得快，来不及结晶，就成了黑曜石。',
          },
          {
            id: 'q2',
            question: '在地下慢慢冷却的岩浆会变成？',
            speak: '在地下慢慢冷却的岩浆会变成？',
            options: [
              { id: 'a', label: '花岗岩', icon: '🩶' },
              { id: 'b', label: '黑曜石', icon: '⚫' },
              { id: 'c', label: '滑石', icon: '🧼' },
            ],
            answerId: 'a',
            explain: '慢慢冷却，晶体有时间长大，就成了花岗岩。',
          },
        ]),
      ],
      '送岩浆小火车回家',
      ['obsidian']
    ),
    level(
      'gem-3-02',
      '海底层层叠',
      [
        sequence('沉积岩的诞生', [
          {
            id: 's1',
            prompt: '把沉积岩形成的过程排一排',
            speak: '请把沉积岩形成的过程排一排：先掉进水里，再一层层压紧，最后变成石头',
            items: [
              { id: 'a', label: '沙子和泥土沉到水底', icon: '🏖️' },
              { id: 'b', label: '一层一层越压越紧', icon: '🥞' },
              { id: 'c', label: '经过很久变成石头', icon: '🪨' },
            ],
            answerOrder: ['a', 'b', 'c'],
          },
        ]),
        tapRead('地层像千层糕', [
          { id: 'l1', label: '最上层', subLabel: '最新的沉积', speak: '最上面一层最新', icon: '🟫' },
          { id: 'l2', label: '中间层', subLabel: '更早的沉积', speak: '中间的层更早', icon: '🟧' },
          { id: 'l3', label: '最下层', subLabel: '最古老', speak: '越往下越古老', icon: '🟨' },
        ], '点一点，认识地层'),
      ],
      '水底的千层糕',
      ['granite']
    ),
    level(
      'gem-3-03',
      '挤压变变变',
      [
        quiz('变质岩小课堂', [
          {
            id: 'q1',
            question: '岩石被高温高压“挤压烘烤”很久，会？',
            speak: '岩石被高温高压挤压烘烤很久，会怎么样？',
            options: [
              { id: 'a', label: '变成新的变质岩', icon: '🦋' },
              { id: 'b', label: '消失不见', icon: '👻' },
              { id: 'c', label: '变成水', icon: '💧' },
            ],
            answerId: 'a',
            explain: '高温高压会让岩石“变身”，成为变质岩。',
          },
          {
            id: 'q2',
            question: '大理石是石灰岩变质来的，它属于？',
            speak: '大理石是石灰岩变质来的，它属于哪一类岩石？',
            options: [
              { id: 'a', label: '变质岩', icon: '🦋' },
              { id: 'b', label: '火成岩', icon: '🌋' },
              { id: 'c', label: '沉积岩', icon: '🥞' },
            ],
            answerId: 'a',
            explain: '石灰岩受热受压就变成了大理石。',
          },
        ]),
        dragMatch('岩石变变看', [
          { id: 'p1', left: '岩浆冷却', right: '火成岩', leftIcon: '🌋' },
          { id: 'p2', left: '泥沙压紧', right: '沉积岩', leftIcon: '🥞' },
          { id: 'p3', left: '高温高压', right: '变质岩', leftIcon: '🦋' },
        ], '把成因和岩石种类配配对'),
      ],
      '岩石也会“变身”',
      ['malachite']
    ),
    level(
      'gem-3-04',
      '宝石大侦探',
      [
        listenChoose(
          '终极推理一',
          '它很硬，透明，是沙子的爸爸，它是谁？',
          [
            { id: 'a', label: '石英', icon: '💎', speak: '石英' },
            { id: 'b', label: '黄铁矿', icon: '🟡', speak: '黄铁矿' },
            { id: 'c', label: '滑石', icon: '🧼', speak: '滑石' },
          ],
          'a'
        ),
        quiz('毕业考试', [
          {
            id: 'q1',
            question: '想知道矿物本色，要把它擦在什么上面？',
            speak: '想知道矿物的本色，要把它擦在什么上面？',
            options: [
              { id: 'a', label: '白瓷板', icon: '⬜' },
              { id: 'b', label: '报纸上', icon: '📰' },
              { id: 'c', label: '手心里', icon: '✋' },
            ],
            answerId: 'a',
            explain: '白瓷板上的条痕色最可靠。',
          },
          {
            id: 'q2',
            question: '岩浆在地下慢慢冷却，会形成哪种岩石？',
            speak: '岩浆在地下慢慢冷却，会形成哪种岩石？',
            options: [
              { id: 'a', label: '花岗岩', icon: '🩶' },
              { id: 'b', label: '黑曜石', icon: '⚫' },
              { id: 'c', label: '大理石', icon: '⬜' },
            ],
            answerId: 'a',
            explain: '慢冷却，晶体大，就是花岗岩。',
          },
          {
            id: 'q3',
            question: '“第3行第4列”是地质学家记录什么的办法？',
            speak: '第几行第几列，是地质学家记录什么的办法？',
            options: [
              { id: 'a', label: '宝藏的位置', icon: '🗺️' },
              { id: 'b', label: '宝石的颜色', icon: '🎨' },
              { id: 'c', label: '矿物的硬度', icon: '💪' },
            ],
            answerId: 'a',
            explain: '行列坐标能准确记下每一块宝石的位置。',
          },
        ]),
      ],
      '综合运用所有本领',
      ['magnetite']
    ),
  ],
  '火山、海底、挤压力，岩石从哪来'
)

export const gem: Subject = {
  id: 'gem',
  name: '宝石地质学家',
  emoji: '💎',
  color: '#26A69A',
  mascot: 'mole',
  description: '戴上探照灯，像地质学家一样观察与推理',
  units: [u1, u2, u3],
}
