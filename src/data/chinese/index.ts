import type { Subject } from '../../engine/types'
import {
  tapRead,
  listenChoose,
  dragMatch,
  tracing,
  blend,
  quiz,
  sequence,
  readAlong,
  spiritLetterMorph,
  level,
  unit,
} from '../helpers'

/* ── U0 拼音入门（幼小衔接，先认再辨） ── */

const u0 = unit(
  'chinese-0',
  '拼音入门',
  [
    level(
      'chinese-0-01',
      '单韵母朋友',
      [
        tapRead('点读单韵母', [
          { id: 'a', label: 'ɑ', speak: '阿', icon: '🍉', color: '#FF6B6B' },
          { id: 'o', label: 'o', speak: '喔', icon: '🐓', color: '#FFB347' },
          { id: 'e', label: 'e', speak: '婀', icon: '🦢', color: '#4DA3FF' },
          { id: 'i', label: 'i', speak: '衣', icon: '👕', color: '#3ECF8E' },
          { id: 'u', label: 'u', speak: '乌', icon: '🐦‍⬛', color: '#9B7BFF' },
          { id: 'v', label: 'ü', speak: '淤', icon: '🐟', color: '#FF8FB8' },
        ], '先认识 6 个单韵母，点一点听一听'),
        listenChoose(
          '听一听，选韵母',
          '阿',
          [
            { id: 'a', label: 'ɑ', speak: '阿' },
            { id: 'b', label: 'o', speak: '喔' },
            { id: 'c', label: 'e', speak: '婀' },
          ],
          'a'
        ),
        listenChoose(
          '听一听，选韵母',
          '淤',
          [
            { id: 'a', label: 'u', speak: '乌' },
            { id: 'b', label: 'ü', speak: '淤' },
            { id: 'c', label: 'i', speak: '衣' },
          ],
          'b'
        ),
        quiz('认一认单韵母', [
          {
            id: 'q1',
            question: '哪个是单韵母 ɑ？',
            options: [
              { id: 'a', label: 'ɑ', speak: '阿' },
              { id: 'b', label: 'b', speak: '波' },
              { id: 'c', label: 'm', speak: '摸' },
            ],
            answerId: 'a',
          },
          {
            id: 'q2',
            question: '「鹅」对应哪个韵母？',
            options: [
              { id: 'a', label: 'ɑ', speak: '阿' },
              { id: 'b', label: 'e', speak: '婀' },
              { id: 'c', label: 'ü', speak: '淤' },
            ],
            answerId: 'b',
          },
          {
            id: 'q3',
            question: '圆圈上两点的韵母是？',
            options: [
              { id: 'a', label: 'u', speak: '乌' },
              { id: 'b', label: 'ü', speak: '淤' },
              { id: 'c', label: 'o', speak: '喔' },
            ],
            answerId: 'b',
          },
        ]),
        spiritLetterMorph('捏一捏单韵母', [
          { letter: 'ɑ', speak: '阿' },
          { letter: 'o', speak: '喔' },
          { letter: 'e', speak: '婀' },
        ]),
      ],
      'ɑ o e i u ü，一个一个认识'
    ),

    level(
      'chinese-0-02',
      '声母宝宝（一）',
      [
        tapRead('点读声母 b p m f', [
          { id: 'b', label: 'b', speak: '玻', icon: '🎈', color: '#FF6B6B' },
          { id: 'p', label: 'p', speak: '坡', icon: '🏔️', color: '#FFB347' },
          { id: 'm', label: 'm', speak: '摸', icon: '🤚', color: '#4DA3FF' },
          { id: 'f', label: 'f', speak: '佛', icon: '🪷', color: '#3ECF8E' },
        ]),
        tapRead('点读声母 d t n l', [
          { id: 'd', label: 'd', speak: '德', icon: '🥁', color: '#FF6B6B' },
          { id: 't', label: 't', speak: '特', icon: '🚕', color: '#FFB347' },
          { id: 'n', label: 'n', speak: '讷', icon: '🥜', color: '#4DA3FF' },
          { id: 'l', label: 'l', speak: '勒', icon: '🎵', color: '#3ECF8E' },
        ]),
        dragMatch('声母找朋友', [
          { id: 'p1', left: 'b', right: '爸爸 bɑ̀' },
          { id: 'p2', left: 'm', right: '妈妈 mɑ̄' },
          { id: 'p3', left: 'd', right: '大 dɑ̀' },
          { id: 'p4', left: 't', right: '他 tɑ̄' },
        ]),
        quiz('认声母', [
          {
            id: 'q1',
            question: '「妈妈」的声母是？',
            options: [
              { id: 'a', label: 'b', speak: '玻' },
              { id: 'b', label: 'm', speak: '摸' },
              { id: 'c', label: 'f', speak: '佛' },
            ],
            answerId: 'b',
          },
          {
            id: 'q2',
            question: '哪个是声母 p？',
            options: [
              { id: 'a', label: 'p', speak: '坡' },
              { id: 'b', label: 'ɑ', speak: '啊' },
              { id: 'c', label: 'o', speak: '喔' },
            ],
            answerId: 'a',
          },
        ]),
      ],
      'b p m f · d t n l'
    ),

    level(
      'chinese-0-03',
      '声母宝宝（二）',
      [
        tapRead('点读 g k h j q x', [
          { id: 'g', label: 'g', speak: '哥', icon: '🎸', color: '#FF6B6B' },
          { id: 'k', label: 'k', speak: '科', icon: '🔬', color: '#FFB347' },
          { id: 'h', label: 'h', speak: '喝', icon: '🥤', color: '#4DA3FF' },
          { id: 'j', label: 'j', speak: '基', icon: '🐔', color: '#3ECF8E' },
          { id: 'q', label: 'q', speak: '欺', icon: '7️⃣', color: '#9B7BFF' },
          { id: 'x', label: 'x', speak: '希', icon: '🍉', color: '#FF8FB8' },
        ]),
        tapRead('点读 z c s zh ch sh r', [
          { id: 'z', label: 'z', speak: '资', icon: '🔤', color: '#FF6B6B' },
          { id: 'c', label: 'c', speak: '雌', icon: '🐱', color: '#FFB347' },
          { id: 's', label: 's', speak: '思', icon: '💭', color: '#4DA3FF' },
          { id: 'zh', label: 'zh', speak: '知', icon: '📖', color: '#3ECF8E' },
          { id: 'ch', label: 'ch', speak: '吃', icon: '🍚', color: '#9B7BFF' },
          { id: 'sh', label: 'sh', speak: '诗', icon: '📜', color: '#FF8FB8' },
          { id: 'r', label: 'r', speak: '日', icon: '☀️', color: '#FFC84A' },
        ]),
        listenChoose(
          '听音选声母',
          '喝',
          [
            { id: 'a', label: 'g', speak: '哥' },
            { id: 'b', label: 'k', speak: '科' },
            { id: 'c', label: 'h', speak: '喝' },
          ],
          'c'
        ),
        quiz('认一认', [
          {
            id: 'q1',
            question: '「知」的声母是？',
            options: [
              { id: 'a', label: 'z', speak: '资' },
              { id: 'b', label: 'zh', speak: '知' },
              { id: 'c', label: 'j', speak: '基' },
            ],
            answerId: 'b',
          },
          {
            id: 'q2',
            question: '两个字母的声母是？',
            options: [
              { id: 'a', label: 'b', speak: '玻' },
              { id: 'b', label: 'sh', speak: '诗' },
              { id: 'c', label: 'ɑ', speak: '啊' },
            ],
            answerId: 'b',
          },
        ]),
      ],
      '后半截声母，慢慢认'
    ),

    level(
      'chinese-0-04',
      '拼一拼·读一读',
      [
        blend('两拼音节', [
          { id: 'b1', parts: ['b', 'ɑ̄'], result: 'bɑ̄', speak: '八' },
          { id: 'b2', parts: ['m', 'ɑ̄'], result: 'mɑ̄', speak: '妈' },
          { id: 'b3', parts: ['b', 'ɑ̀'], result: 'bɑ̀', speak: '爸' },
          { id: 'b4', parts: ['t', 'ɑ̄'], result: 'tɑ̄', speak: '他' },
        ], '声母加韵母，拼出来啦'),
        listenChoose(
          '听音节选一选',
          '妈',
          [
            { id: 'a', label: 'mɑ̄', speak: '妈' },
            { id: 'b', label: 'bɑ̄', speak: '八' },
            { id: 'c', label: 'tɑ̄', speak: '他' },
          ],
          'a'
        ),
        dragMatch('拼音和汉字', [
          { id: 'p1', left: 'bɑ̄', right: '八' },
          { id: 'p2', left: 'mɑ̄', right: '妈' },
          { id: 'p3', left: 'bɑ̀', right: '爸' },
          { id: 'p4', left: 'dɑ̀', right: '大' },
        ]),
        quiz('小小拼读', [
          {
            id: 'q1',
            question: 'b + ɑ̄ 拼出来是？',
            options: [
              { id: 'a', label: '八 bɑ̄', speak: '八' },
              { id: 'b', label: '妈 mɑ̄', speak: '妈' },
              { id: 'c', label: '爸 bɑ̀', speak: '爸' },
            ],
            answerId: 'a',
          },
          {
            id: 'q2',
            question: '「大」的拼音是？',
            options: [
              { id: 'a', label: 'tɑ̄', speak: '他' },
              { id: 'b', label: 'dɑ̀', speak: '大' },
              { id: 'c', label: 'bɑ̄', speak: '八' },
            ],
            answerId: 'b',
          },
        ]),
      ],
      '会认声母韵母，再学拼读'
    ),
  ],
  '认识声母、韵母，再开始拼'
)

/* ── U1 拼音冲刺 ── */

const u1 = unit(
  'chinese-1',
  '拼音冲刺',
  [
    level(
      'chinese-1-01',
      '易混声母：z/zh c/ch s/sh',
      [
      listenChoose(
        '听音选声母',
        '知',
        [
          { id: 'a', label: 'z' },
          { id: 'b', label: 'zh' },
          { id: 'c', label: 'j' },
        ],
        'b'
      ),
      listenChoose(
        '听音选声母',
        '词',
        [
          { id: 'a', label: 'c' },
          { id: 'b', label: 'ch' },
          { id: 'c', label: 's' },
        ],
        'a'
      ),
      dragMatch('声母和例字配对', [
        { id: 'p1', left: 'zh', right: '知' },
        { id: 'p2', left: 'ch', right: '吃' },
        { id: 'p3', left: 'sh', right: '诗' },
        { id: 'p4', left: 'z', right: '字' },
        { id: 'p5', left: 'c', right: '词' },
        { id: 'p6', left: 's', right: '四' },
      ]),
      quiz('平翘舌辨析', [
        {
          id: 'q1',
          question: '「桌子」的「桌」声母是？',
          options: [
            { id: 'a', label: 'zh' },
            { id: 'b', label: 'z' },
            { id: 'c', label: 'j' },
          ],
          answerId: 'a',
        },
        {
          id: 'q2',
          question: '「三个」的「三」声母是？',
          options: [
            { id: 'a', label: 'sh' },
            { id: 'b', label: 's' },
            { id: 'c', label: 'c' },
          ],
          answerId: 'b',
        },
        {
          id: 'q3',
          question: '「吃饭」的「吃」声母是？',
          options: [
            { id: 'a', label: 'c' },
            { id: 'b', label: 'ch' },
            { id: 'c', label: 'q' },
          ],
          answerId: 'b',
        },
      ]),
    ], '分清平舌音和翘舌音'),

    level(
      'chinese-1-02',
      '易混声母：n/l f/h',
      [
      listenChoose(
        '听音选声母',
        '牛奶',
        [
          { id: 'a', label: 'n' },
          { id: 'b', label: 'l' },
          { id: 'c', label: 'm' },
        ],
        'a'
      ),
      listenChoose(
        '听音选声母',
        '老虎',
        [
          { id: 'a', label: 'n' },
          { id: 'b', label: 'l' },
          { id: 'c', label: 'h' },
        ],
        'b'
      ),
      dragMatch('声母和词语配对', [
        { id: 'p1', left: 'n', right: '奶奶' },
        { id: 'p2', left: 'l', right: '老师' },
        { id: 'p3', left: 'f', right: '飞机' },
        { id: 'p4', left: 'h', right: '花朵' },
        { id: 'p5', left: 'n', right: '南方' },
        { id: 'p6', left: 'l', right: '蓝天' },
      ]),
      quiz('n/l f/h 辨析', [
        {
          id: 'q1',
          question: '「努力」的「努」声母是？',
          options: [
            { id: 'a', label: 'n' },
            { id: 'b', label: 'l' },
            { id: 'c', label: 'r' },
          ],
          answerId: 'a',
        },
        {
          id: 'q2',
          question: '「红色」的「红」声母是？',
          options: [
            { id: 'a', label: 'f' },
            { id: 'b', label: 'h' },
            { id: 'c', label: 'k' },
          ],
          answerId: 'b',
        },
        {
          id: 'q3',
          question: '「方法」的「方」声母是？',
          options: [
            { id: 'a', label: 'f' },
            { id: 'b', label: 'h' },
            { id: 'c', label: 'b' },
          ],
          answerId: 'a',
        },
      ]),
    ], '分清 n/l 和 f/h'),

    level(
      'chinese-1-03',
      '易混韵母：ɑn/ɑng en/eng',
      [
      listenChoose(
        '听音选韵母',
        '安',
        [
          { id: 'a', label: 'ɑn' },
          { id: 'b', label: 'ɑng' },
          { id: 'c', label: 'en' },
        ],
        'a'
      ),
      listenChoose(
        '听音选韵母',
        '灯',
        [
          { id: 'a', label: 'en' },
          { id: 'b', label: 'eng' },
          { id: 'c', label: 'ɑn' },
        ],
        'b'
      ),
      dragMatch('韵母和汉字配对', [
        { id: 'p1', left: 'ɑn', right: '安' },
        { id: 'p2', left: 'ɑng', right: '长' },
        { id: 'p3', left: 'en', right: '门' },
        { id: 'p4', left: 'eng', right: '风' },
        { id: 'p5', left: 'ɑn', right: '山' },
        { id: 'p6', left: 'ɑng', right: '上' },
      ]),
      quiz('前后鼻音辨析', [
        {
          id: 'q1',
          question: '「春天 chūn tiɑ̄n」的「天」韵母是？',
          options: [
            { id: 'a', label: 'ɑn' },
            { id: 'b', label: 'ɑng' },
            { id: 'c', label: 'iɑn' },
          ],
          answerId: 'a',
        },
        {
          id: 'q2',
          question: '「朋友 péng you」的「朋」韵母是？',
          options: [
            { id: 'a', label: 'en' },
            { id: 'b', label: 'eng' },
            { id: 'c', label: 'ong' },
          ],
          answerId: 'b',
        },
        {
          id: 'q3',
          question: '「认真 rèn zhēn」的「认」韵母是？',
          options: [
            { id: 'a', label: 'en' },
            { id: 'b', label: 'eng' },
            { id: 'c', label: 'ɑn' },
          ],
          answerId: 'a',
        },
      ]),
    ], '分清 ɑn/ɑng 和 en/eng'),

    level(
      'chinese-1-04',
      '易混韵母：in/ing üɑn/uɑn',
      [
      listenChoose(
        '听音选韵母',
        '星星',
        [
          { id: 'a', label: 'in' },
          { id: 'b', label: 'ing' },
          { id: 'c', label: 'iɑn' },
        ],
        'b'
      ),
      listenChoose(
        '听音选韵母',
        '圆圈',
        [
          { id: 'a', label: 'üɑn' },
          { id: 'b', label: 'uɑn' },
          { id: 'c', label: 'un' },
        ],
        'a'
      ),
      dragMatch('韵母辨析配对', [
        { id: 'p1', left: 'in', right: '今天' },
        { id: 'p2', left: 'ing', right: '听' },
        { id: 'p3', left: 'üɑn', right: '远' },
        { id: 'p4', left: 'uɑn', right: '玩' },
        { id: 'p5', left: 'in', right: '认真' },
        { id: 'p6', left: 'ing', right: '明' },
      ]),
      quiz('in/ing üɑn/uɑn 辨析', [
        {
          id: 'q1',
          question: '「音乐 yīn yuè」的「音」韵母是？',
          options: [
            { id: 'a', label: 'in' },
            { id: 'b', label: 'ing' },
            { id: 'c', label: 'en' },
          ],
          answerId: 'a',
        },
        {
          id: 'q2',
          question: '「花园 huɑ̄ yuɑ́n」的「园」韵母是？',
          options: [
            { id: 'a', label: 'uɑn' },
            { id: 'b', label: 'üɑn' },
            { id: 'c', label: 'un' },
          ],
          answerId: 'b',
        },
        {
          id: 'q3',
          question: '「完成 wɑ́n chéng」的「完」韵母是？',
          options: [
            { id: 'a', label: 'üɑn' },
            { id: 'b', label: 'uɑn' },
            { id: 'c', label: 'ɑn' },
          ],
          answerId: 'b',
        },
      ]),
    ], '分清 in/ing 和 üɑn/uɑn'),

    level(
      'chinese-1-05',
      '三拼与整体认读辨析',
      [
      dragMatch('整体认读还是三拼', [
        { id: 'p1', left: 'yuɑ́n', right: '整体认读' },
        { id: 'p2', left: 'yɑ́n', right: '三拼音节' },
        { id: 'p3', left: 'yún', right: '整体认读' },
        { id: 'p4', left: 'yīn', right: '整体认读' },
        { id: 'p5', left: 'xiɑ̌o', right: '三拼音节' },
        { id: 'p6', left: 'zhuɑ̄ng', right: '三拼音节' },
      ]),
      blend('三拼音节拼读', [
        { id: 'b1', parts: ['x', 'i', 'ɑ̀o'], result: 'xiɑ̀o', speak: '笑' },
        { id: 'b2', parts: ['j', 'i', 'ɑ̄n'], result: 'jiɑ̄n', speak: '间' },
        { id: 'b3', parts: ['g', 'u', 'ɑ̄ng'], result: 'guɑ̄ng', speak: '光' },
        { id: 'b4', parts: ['q', 'u', 'ɑ́n'], result: 'quɑ́n', speak: '全' },
      ]),
      quiz('整体认读辨析', [
        {
          id: 'q1',
          question: 'yuɑ́n（元/园）属于？',
          options: [
            { id: 'a', label: '整体认读音节' },
            { id: 'b', label: '两拼音节' },
            { id: 'c', label: '三拼音节' },
          ],
          answerId: 'a',
        },
        {
          id: 'q2',
          question: 'yɑ́n（言/颜）的拼读方式是？',
          options: [
            { id: 'a', label: 'y + ɑn（三拼）' },
            { id: 'b', label: '整体认读' },
            { id: 'c', label: 'y + ɑ́n（两拼）' },
          ],
          answerId: 'a',
        },
        {
          id: 'q3',
          question: '下面哪个是整体认读音节？',
          options: [
            { id: 'a', label: 'yún' },
            { id: 'b', label: 'yǔn' },
            { id: 'c', label: 'xiɑ̌o' },
          ],
          answerId: 'a',
        },
      ]),
    ], 'yuɑn/yɑn yun/yin 要分清'),

    level(
      'chinese-1-06',
      '四声·轻声·一不变调',
      [
      listenChoose(
        '听音选声调',
        '马',
        [
          { id: 'a', label: 'mɑ̄ 一声' },
          { id: 'b', label: 'mɑ̌ 三声' },
          { id: 'c', label: 'mɑ̀ 四声' },
        ],
        'b'
      ),
      quiz('声调与变调', [
        {
          id: 'q1',
          question: 'mɑ̄ 妈、mɑ́ 麻、mɑ̌ 马、mɑ̀ 骂 ——「马」是第几声？',
          options: [
            { id: 'a', label: '一声' },
            { id: 'b', label: '三声' },
            { id: 'c', label: '四声' },
          ],
          answerId: 'b',
        },
        {
          id: 'q2',
          question: '「妈妈 mɑ̄ mɑ」第二个「mɑ」读？',
          options: [
            { id: 'a', label: '一声' },
            { id: 'b', label: '轻声' },
            { id: 'c', label: '四声' },
          ],
          answerId: 'b',
        },
        {
          id: 'q3',
          question: '「一个 yí gè」中「一」读？',
          options: [
            { id: 'a', label: 'yī 一声' },
            { id: 'b', label: 'yí 二声（变调）' },
            { id: 'c', label: 'yì 四声' },
          ],
          answerId: 'b',
        },
        {
          id: 'q4',
          question: '「不对 bú duì」中「不」读？',
          options: [
            { id: 'a', label: 'bù 四声' },
            { id: 'b', label: 'bú 二声（变调）' },
            { id: 'c', label: '轻声' },
          ],
          answerId: 'b',
        },
      ]),
      dragMatch('词语和正确注音', [
        { id: 'p1', left: '爸爸', right: 'bɑ̀ bɑ' },
        { id: 'p2', left: '明白', right: 'míng bɑi' },
        { id: 'p3', left: '一会儿', right: 'yí huìr' },
        { id: 'p4', left: '一样', right: 'yí yɑ̀ng' },
      ]),
    ], '四声、轻声与「一」「不」变调'),

    level(
      'chinese-1-07',
      '看拼音选汉字',
      [
      quiz('同音不同调', [
        {
          id: 'q1',
          question: 'mɑ̄ 是哪个字？',
          options: [
            { id: 'a', label: '妈' },
            { id: 'b', label: '马' },
            { id: 'c', label: '骂' },
          ],
          answerId: 'a',
        },
        {
          id: 'q2',
          question: 'mɑ̌ 是哪个字？',
          options: [
            { id: 'a', label: '妈' },
            { id: 'b', label: '马' },
            { id: 'c', label: '麻' },
          ],
          answerId: 'b',
        },
        {
          id: 'q3',
          question: 'mɑ̀ 是哪个字？',
          options: [
            { id: 'a', label: '马' },
            { id: 'b', label: '骂' },
            { id: 'c', label: '妈' },
          ],
          answerId: 'b',
        },
      ]),
      quiz('看拼音选词语', [
        {
          id: 'q4',
          question: 'xué xiɑ̀o 是？',
          options: [
            { id: 'a', label: '学校' },
            { id: 'b', label: '学生' },
            { id: 'c', label: '学习' },
          ],
          answerId: 'a',
        },
        {
          id: 'q5',
          question: 'chūn tiɑ̄n 是？',
          options: [
            { id: 'a', label: '春天' },
            { id: 'b', label: '夏天' },
            { id: 'c', label: '秋天' },
          ],
          answerId: 'a',
        },
        {
          id: 'q6',
          question: 'péng you 是？',
          options: [
            { id: 'a', label: '朋友' },
            { id: 'b', label: '同学' },
            { id: 'c', label: '老师' },
          ],
          answerId: 'a',
        },
      ]),
      listenChoose(
        '听拼音选字',
        '高兴',
        [
          { id: 'a', label: 'gɑ̄o xìng' },
          { id: 'b', label: 'gɑ̄o xīn' },
          { id: 'c', label: 'gɑ̌o xìng' },
        ],
        'a'
      ),
    ], '拼音和汉字要对应'),

    level(
      'chinese-1-08',
      '快速拼读词语',
      [
      blend('两拼读词语', [
        { id: 'b1', parts: ['x', 'ué'], result: 'xué', speak: '学' },
        { id: 'b2', parts: ['xiɑ̀o'], result: 'xiɑ̀o', speak: '校' },
        { id: 'b3', parts: ['péng'], result: 'péng', speak: '朋' },
        { id: 'b4', parts: ['y', 'ou'], result: 'you', speak: '友' },
        { id: 'b5', parts: ['l', 'ɑ̌o'], result: 'lɑ̌o', speak: '老' },
        { id: 'b6', parts: ['sh', 'ī'], result: 'shī', speak: '师' },
      ]),
      blend('三拼读词语', [
        { id: 'b7', parts: ['x', 'i', 'ɑ̌ng'], result: 'xiɑ̌ng', speak: '想' },
        { id: 'b8', parts: ['n', 'i', 'ɑ̀n'], result: 'niɑ̀n', speak: '念' },
        { id: 'b9', parts: ['g', 'u', 'ɑ̄n'], result: 'guɑ̄n', speak: '关' },
        { id: 'b10', parts: ['x', 'i', 'n'], result: 'xīn', speak: '心' },
        { id: 'b11', parts: ['j', 'i', 'ɑ̀n'], result: 'jiɑ̀n', speak: '见' },
        { id: 'b12', parts: ['m', 'i', 'ɑ̀n'], result: 'miɑ̀n', speak: '面' },
      ]),
      quiz('拼读选词', [
        {
          id: 'q1',
          question: 'xué xiɑ̀o 拼出来是？',
          options: [
            { id: 'a', label: '学校' },
            { id: 'b', label: '学生' },
            { id: 'c', label: '学习' },
          ],
          answerId: 'a',
        },
        {
          id: 'q2',
          question: 'xiɑ̌ng niɑ̀n 是哪个词？',
          options: [
            { id: 'a', label: '想念' },
            { id: 'b', label: '见面' },
            { id: 'c', label: '关心' },
          ],
          answerId: 'a',
        },
      ]),
    ], '两拼三拼读出词语'),

    level(
      'chinese-1-09',
      '拼音纠错',
      [
      quiz('找出错误注音', [
        {
          id: 'q1',
          question: '哪个注音错了？',
          options: [
            { id: 'a', label: '书本 shū běn' },
            { id: 'b', label: '花朵 huɑ̄ duó' },
            { id: 'c', label: '老师 lɑ̌o shī' },
          ],
          answerId: 'b',
          explain: '「朵」读 duǒ 三声，不是 duó',
        },
        {
          id: 'q2',
          question: '「认真 rèn zhēn」注音正确吗？',
          options: [
            { id: 'a', label: '正确' },
            { id: 'b', label: '错误，应为 rèn zēn' },
            { id: 'c', label: '错误，应为 rèn zhēng' },
          ],
          answerId: 'a',
        },
        {
          id: 'q3',
          question: '哪个词语注音有误？',
          options: [
            { id: 'a', label: '长(chɑ́ng)短' },
            { id: 'b', label: '长(zhɑ̌ng)大' },
            { id: 'c', label: '长(chɑ́ng)大' },
          ],
          answerId: 'c',
          explain: '「长大」的「长」读 zhɑ̌ng',
        },
        {
          id: 'q4',
          question: '「一会儿 yī huìr」中哪个字读轻声？',
          options: [
            { id: 'a', label: '一' },
            { id: 'b', label: '会' },
            { id: 'c', label: '儿' },
          ],
          answerId: 'c',
        },
      ]),
      dragMatch('纠正错误配对', [
        { id: 'p1', left: 'huɑ̄ duó ✗', right: 'huɑ̄ duǒ' },
        { id: 'p2', left: 'chɑ́ng大 ✗', right: 'zhɑ̌ng大' },
        { id: 'p3', left: 'shɑ̄n ✗(翘舌错)', right: 'sɑ̄n 三' },
        { id: 'p4', left: 'tɑ̄ng ✗(后鼻错)', right: 'tiɑ̄n 天' },
      ]),
    ], '发现注音里的错误'),
  ],
  '易混音·快速拼读·词语注音'
)

/* ── U2 汉字精进 ── */

const u2 = unit(
  'chinese-2',
  '汉字精进',
  [
    level(
      'chinese-2-01',
      '象形会意快复习',
      [
      tapRead('常见象形会意字', [
        { id: 'r', label: '日', speak: '日', icon: '☀️', subLabel: '像太阳' },
        { id: 'y', label: '月', speak: '月', icon: '🌙', subLabel: '像月亮' },
        { id: 'm', label: '木', speak: '木', icon: '🌳', subLabel: '像树木' },
        { id: 'k', label: '口', speak: '口', icon: '👄', subLabel: '像嘴巴' },
        { id: 'm2', label: '明', speak: '明', icon: '🌞', subLabel: '日+月=明亮' },
        { id: 'k2', label: '看', speak: '看', icon: '👀', subLabel: '手搭目=看' },
      ]),
      dragMatch('字义快速配对', [
        { id: 'p1', left: '日', right: '太阳' },
        { id: 'p2', left: '明', right: '日+月' },
        { id: 'p3', left: '休', right: '人+木' },
        { id: 'p4', left: '林', right: '两个木' },
      ]),
      quiz('象形会意', [
        {
          id: 'q1',
          question: '「明」由哪两个字组成？',
          options: [
            { id: 'a', label: '日 + 月' },
            { id: 'b', label: '日 + 目' },
            { id: 'c', label: '目 + 月' },
          ],
          answerId: 'a',
        },
        {
          id: 'q2',
          question: '「休」表示人在树下休息，由什么组成？',
          options: [
            { id: 'a', label: '人 + 木' },
            { id: 'b', label: '人 + 口' },
            { id: 'c', label: '人 + 日' },
          ],
          answerId: 'a',
        },
      ]),
    ], '快速回顾造字方法'),

    level(
      'chinese-2-02',
      '形近字：土士·未末·己已',
      [
      dragMatch('形近字辨析', [
        { id: 'p1', left: '土', right: '土地' },
        { id: 'p2', left: '士', right: '战士' },
        { id: 'p3', left: '未', right: '未来' },
        { id: 'p4', left: '末', right: '末尾' },
        { id: 'p5', left: '己', right: '自己' },
        { id: 'p6', left: '已', right: '已经' },
      ]),
      quiz('选正确的字', [
        {
          id: 'q1',
          question: '（  ）地 —— 种庄稼的地方',
          options: [
            { id: 'a', label: '土' },
            { id: 'b', label: '士' },
          ],
          answerId: 'a',
        },
        {
          id: 'q2',
          question: '（  ）来 —— 以后、将来',
          options: [
            { id: 'a', label: '未' },
            { id: 'b', label: '末' },
          ],
          answerId: 'a',
        },
        {
          id: 'q3',
          question: '自（  ） —— 我自己',
          options: [
            { id: 'a', label: '己' },
            { id: 'b', label: '已' },
          ],
          answerId: 'a',
        },
        {
          id: 'q4',
          question: '（  ）经 —— 表示动作完成',
          options: [
            { id: 'a', label: '己' },
            { id: 'b', label: '已' },
          ],
          answerId: 'b',
        },
      ]),
      listenChoose(
        '听音选字',
        '已经',
        [
          { id: 'a', label: '己经' },
          { id: 'b', label: '已经' },
          { id: 'c', label: '自已' },
        ],
        'b'
      ),
    ], '土士、未末、己已要分清'),

    level(
      'chinese-2-03',
      '形近字：人入八·日曰·干千',
      [
      dragMatch('形近字配对', [
        { id: 'p1', left: '人', right: '人民' },
        { id: 'p2', left: '入', right: '进入' },
        { id: 'p3', left: '八', right: '八个' },
        { id: 'p4', left: '日', right: '日子' },
        { id: 'p5', left: '曰', right: '子曰' },
        { id: 'p6', left: '干', right: '干活' },
        { id: 'p7', left: '千', right: '一千' },
        { id: 'p8', left: '天', right: '天空' },
      ]),
      quiz('形近字填空', [
        {
          id: 'q1',
          question: '（  ）口 —— 从外面进来',
          options: [
            { id: 'a', label: '入' },
            { id: 'b', label: '人' },
            { id: 'c', label: '八' },
          ],
          answerId: 'a',
        },
        {
          id: 'q2',
          question: '（  ）子 —— 太阳',
          options: [
            { id: 'a', label: '日' },
            { id: 'b', label: '曰' },
            { id: 'c', label: '目' },
          ],
          answerId: 'a',
        },
        {
          id: 'q3',
          question: '（  ）活 —— 做事、劳动',
          options: [
            { id: 'a', label: '干' },
            { id: 'b', label: '千' },
            { id: 'c', label: '十' },
          ],
          answerId: 'a',
        },
        {
          id: 'q4',
          question: '（  ）空 —— 蓝蓝的天',
          options: [
            { id: 'a', label: '天' },
            { id: 'b', label: '夫' },
            { id: 'c', label: '大' },
          ],
          answerId: 'a',
        },
      ]),
    ], '人入八、日曰、干千、天夫'),

    level(
      'chinese-2-04',
      '多音字辨析',
      [
      quiz('多音字选读音', [
        {
          id: 'q1',
          question: '「长大」的「长」读？',
          options: [
            { id: 'a', label: 'chɑ́ng' },
            { id: 'b', label: 'zhɑ̌ng' },
          ],
          answerId: 'b',
        },
        {
          id: 'q2',
          question: '「长短」的「长」读？',
          options: [
            { id: 'a', label: 'chɑ́ng' },
            { id: 'b', label: 'zhɑ̌ng' },
          ],
          answerId: 'a',
        },
        {
          id: 'q3',
          question: '「行走」的「行」读？',
          options: [
            { id: 'a', label: 'xíng' },
            { id: 'b', label: 'hɑ́ng' },
          ],
          answerId: 'a',
        },
        {
          id: 'q4',
          question: '「银行」的「行」读？',
          options: [
            { id: 'a', label: 'xíng' },
            { id: 'b', label: 'hɑ́ng' },
          ],
          answerId: 'b',
        },
        {
          id: 'q5',
          question: '「快乐」的「乐」读？',
          options: [
            { id: 'a', label: 'lè' },
            { id: 'b', label: 'yuè' },
          ],
          answerId: 'a',
        },
        {
          id: 'q6',
          question: '「音乐」的「乐」读？',
          options: [
            { id: 'a', label: 'lè' },
            { id: 'b', label: 'yuè' },
          ],
          answerId: 'b',
        },
      ]),
      dragMatch('多音字和词语', [
        { id: 'p1', left: '长(chɑ́ng)', right: '长短' },
        { id: 'p2', left: '长(zhɑ̌ng)', right: '长大' },
        { id: 'p3', left: '行(xíng)', right: '行走' },
        { id: 'p4', left: '行(hɑ́ng)', right: '银行' },
        { id: 'p5', left: '乐(lè)', right: '快乐' },
        { id: 'p6', left: '乐(yuè)', right: '音乐' },
        { id: 'p7', left: '数(shǔ)', right: '数一数' },
        { id: 'p8', left: '数(shù)', right: '数学' },
      ]),
    ], '长行乐数等要多读'),

    level(
      'chinese-2-05',
      '入学高频字：学习·校园',
      [
      tapRead('学习校园高频字', [
        { id: 'x1', label: '学', speak: '学', icon: '📖' },
        { id: 'x2', label: '校', speak: '校', icon: '🏫' },
        { id: 'x3', label: '读', speak: '读', icon: '📚' },
        { id: 'x4', label: '写', speak: '写', icon: '✏️' },
        { id: 'x5', label: '字', speak: '字', icon: '🔤' },
        { id: 'x6', label: '书', speak: '书', icon: '📕' },
        { id: 'x7', label: '笔', speak: '笔', icon: '🖊️' },
        { id: 'x8', label: '课', speak: '课', icon: '📝' },
        { id: 'x9', label: '师', speak: '师', icon: '👨‍🏫' },
        { id: 'x10', label: '同', speak: '同', icon: '👫' },
      ]),
      quiz('认字选词', [
        {
          id: 'q1',
          question: '我们在（  ）里读书写字。',
          options: [
            { id: 'a', label: '学校' },
            { id: 'b', label: '公园' },
            { id: 'c', label: '商店' },
          ],
          answerId: 'a',
        },
        {
          id: 'q2',
          question: '用（  ）写字。',
          options: [
            { id: 'a', label: '笔' },
            { id: 'b', label: '刀' },
            { id: 'c', label: '尺' },
          ],
          answerId: 'a',
        },
      ]),
      listenChoose(
        '听音选字',
        '读书',
        [
          { id: 'a', label: '读数' },
          { id: 'b', label: '读书' },
          { id: 'c', label: '读报' },
        ],
        'b'
      ),
    ], '学习校园常用字'),

    level(
      'chinese-2-06',
      '入学高频字：自然·家庭·身体',
      [
      tapRead('自然家庭身体', [
        { id: 'n1', label: '天', speak: '天', icon: '☁️' },
        { id: 'n2', label: '地', speak: '地', icon: '🌍' },
        { id: 'n3', label: '水', speak: '水', icon: '💧' },
        { id: 'n4', label: '火', speak: '火', icon: '🔥' },
        { id: 'n5', label: '爸', speak: '爸', icon: '👨' },
        { id: 'n6', label: '妈', speak: '妈', icon: '👩' },
        { id: 'n7', label: '手', speak: '手', icon: '✋' },
        { id: 'n8', label: '足', speak: '足', icon: '🦶' },
        { id: 'n9', label: '目', speak: '目', icon: '👁️' },
        { id: 'n10', label: '耳', speak: '耳', icon: '👂' },
      ]),
      dragMatch('字和词语配对', [
        { id: 'p1', left: '天', right: '天空' },
        { id: 'p2', left: '水', right: '河水' },
        { id: 'p3', left: '爸', right: '爸爸' },
        { id: 'p4', left: '手', right: '双手' },
        { id: 'p5', left: '目', right: '目光' },
        { id: 'p6', left: '耳', right: '耳朵' },
      ]),
      quiz('高频字运用', [
        {
          id: 'q1',
          question: '「天地人」中的「人」指？',
          options: [
            { id: 'a', label: '人类' },
            { id: 'b', label: '动物' },
            { id: 'c', label: '植物' },
          ],
          answerId: 'a',
        },
        {
          id: 'q2',
          question: '我们用（  ）听声音。',
          options: [
            { id: 'a', label: '耳' },
            { id: 'b', label: '目' },
            { id: 'c', label: '口' },
          ],
          answerId: 'a',
        },
      ]),
    ], '自然家庭身体常用字'),

    level(
      'chinese-2-07',
      '复杂字笔顺描红',
      [
      tracing('描复杂汉字', [
        { id: 't1', char: '春', speak: '春', grid: 'tian' },
        { id: 't2', char: '秋', speak: '秋', grid: 'tian' },
        { id: 't3', char: '明', speak: '明', grid: 'tian' },
        { id: 't4', char: '朋', speak: '朋', grid: 'tian' },
        { id: 't5', char: '看', speak: '看', grid: 'tian' },
        { id: 't6', char: '听', speak: '听', grid: 'tian' },
      ]),
      sequence('「明」的笔顺', [
        {
          id: 's1',
          prompt: '先写左边的「日」，再写右边的「月」',
          items: [
            { id: 'r', label: '日（左）' },
            { id: 'y', label: '月（右）' },
          ],
          answerOrder: ['r', 'y'],
          speak: '先日后月',
        },
      ]),
      tracing('描说写', [
        { id: 't7', char: '说', speak: '说', grid: 'tian' },
        { id: 't8', char: '写', speak: '写', grid: 'tian' },
      ]),
    ], '春秋明朋看听说写'),

    level(
      'chinese-2-08',
      '量词进阶',
      [
      dragMatch('量词和名词', [
        { id: 'p1', left: '一（  ）书', right: '本' },
        { id: 'p2', left: '一（  ）车', right: '辆' },
        { id: 'p3', left: '一（  ）花', right: '朵' },
        { id: 'p4', left: '一（  ）树', right: '棵' },
        { id: 'p5', left: '一（  ）鸟', right: '只' },
        { id: 'p6', left: '一（  ）牛', right: '头' },
      ]),
      quiz('量词填空', [
        {
          id: 'q1',
          question: '一（  ）飞机',
          options: [
            { id: 'a', label: '架' },
            { id: 'b', label: '条' },
            { id: 'c', label: '把' },
          ],
          answerId: 'a',
        },
        {
          id: 'q2',
          question: '一（  ）裤子',
          options: [
            { id: 'a', label: '条' },
            { id: 'b', label: '件' },
            { id: 'c', label: '双' },
          ],
          answerId: 'a',
        },
        {
          id: 'q3',
          question: '一（  ）鞋',
          options: [
            { id: 'a', label: '双' },
            { id: 'b', label: '条' },
            { id: 'c', label: '只' },
          ],
          answerId: 'a',
        },
        {
          id: 'q4',
          question: '一（  ）刀',
          options: [
            { id: 'a', label: '把' },
            { id: 'b', label: '条' },
            { id: 'c', label: '张' },
          ],
          answerId: 'a',
        },
      ]),
      listenChoose(
        '听句子选量词',
        '一本书',
        [
          { id: 'a', label: '一条书' },
          { id: 'b', label: '一本书' },
          { id: 'c', label: '一张书' },
        ],
        'b'
      ),
    ], '量词要和名词搭配'),
  ],
  '形近多音·高频字·笔顺量词'
)

/* ── U3 词语句子 ── */

const u3 = unit(
  'chinese-3',
  '词语句子',
  [
    level(
      'chinese-3-01',
      '反义词与近义词',
      [
      dragMatch('反义词配对', [
        { id: 'p1', left: '大', right: '小' },
        { id: 'p2', left: '高', right: '矮' },
        { id: 'p3', left: '快', right: '慢' },
        { id: 'p4', left: '冷', right: '热' },
        { id: 'p5', left: '开', right: '关' },
        { id: 'p6', left: '高兴', right: '难过' },
      ]),
      quiz('近义词选择', [
        {
          id: 'q1',
          question: '「美丽」的近义词是？',
          options: [
            { id: 'a', label: '漂亮' },
            { id: 'b', label: '丑陋' },
            { id: 'c', label: '高大' },
          ],
          answerId: 'a',
        },
        {
          id: 'q2',
          question: '「高兴」的近义词是？',
          options: [
            { id: 'a', label: '开心' },
            { id: 'b', label: '伤心' },
            { id: 'c', label: '生气' },
          ],
          answerId: 'a',
        },
        {
          id: 'q3',
          question: '「认真」的反义词是？',
          options: [
            { id: 'a', label: '马虎' },
            { id: 'b', label: '努力' },
            { id: 'c', label: '仔细' },
          ],
          answerId: 'a',
        },
      ]),
      quiz('反义词填空', [
        {
          id: 'q4',
          question: '太阳从东边（  ），从西边（  ）。',
          options: [
            { id: 'a', label: '升起 / 落下' },
            { id: 'b', label: '落下 / 升起' },
            { id: 'c', label: '升起 / 升起' },
          ],
          answerId: 'a',
        },
      ]),
    ], '反义近义要会用'),

    level(
      'chinese-3-02',
      '词语搭配',
      [
      dragMatch('词语搭配', [
        { id: 'p1', left: '明亮的', right: '月亮' },
        { id: 'p2', left: '绿油油的', right: '禾苗' },
        { id: 'p3', left: '红红的', right: '太阳' },
        { id: 'p4', left: '蓝蓝的', right: '天空' },
        { id: 'p5', left: '可爱的', right: '小鸟' },
        { id: 'p6', left: '快乐的', right: '童年' },
      ]),
      quiz('选最佳搭配', [
        {
          id: 'q1',
          question: '（  ）的雪花',
          options: [
            { id: 'a', label: '洁白' },
            { id: 'b', label: '绿色' },
            { id: 'c', label: '滚烫' },
          ],
          answerId: 'a',
        },
        {
          id: 'q2',
          question: '（  ）地读书',
          options: [
            { id: 'a', label: '认真' },
            { id: 'b', label: '红色' },
            { id: 'c', label: '高高' },
          ],
          answerId: 'a',
        },
        {
          id: 'q3',
          question: '（  ）地奔跑',
          options: [
            { id: 'a', label: '飞快' },
            { id: 'b', label: '安静' },
            { id: 'c', label: '慢慢' },
          ],
          answerId: 'a',
        },
      ]),
      listenChoose(
        '听搭配选词',
        '蓝蓝的天空',
        [
          { id: 'a', label: '红红的太阳' },
          { id: 'b', label: '蓝蓝的天空' },
          { id: 'c', label: '绿绿的小草' },
        ],
        'b'
      ),
    ], '形容词和名词要搭对'),

    level(
      'chinese-3-03',
      '扩句练习',
      [
      quiz('把短句扩长', [
        {
          id: 'q1',
          question: '「小鸟飞」扩成最完整的句子是？',
          options: [
            { id: 'a', label: '可爱的小鸟在蓝天上快乐地飞。' },
            { id: 'b', label: '小鸟。' },
            { id: 'c', label: '飞小鸟。' },
          ],
          answerId: 'a',
        },
        {
          id: 'q2',
          question: '「小明读书」可以扩成？',
          options: [
            { id: 'a', label: '小明在教室里认真地读书。' },
            { id: 'b', label: '小明书。' },
            { id: 'c', label: '读书小明。' },
          ],
          answerId: 'a',
        },
        {
          id: 'q3',
          question: '扩句时可以先加什么？',
          options: [
            { id: 'a', label: '什么样的、在哪里、怎么样' },
            { id: 'b', label: '随便乱加' },
            { id: 'c', label: '只加一个字' },
          ],
          answerId: 'a',
        },
      ]),
      sequence('扩句顺序', [
        {
          id: 's1',
          prompt: '「花开了」扩句：先加什么样的，再加在哪里',
          items: [
            { id: 'a', label: '美丽的' },
            { id: 'b', label: '花儿' },
            { id: 'c', label: '在花园里' },
            { id: 'd', label: '开了' },
          ],
          answerOrder: ['a', 'b', 'c', 'd'],
          speak: '美丽的花儿在花园里开了',
        },
      ]),
      dragMatch('扩句要素', [
        { id: 'p1', left: '什么样的', right: '可爱的小鸟' },
        { id: 'p2', left: '在哪里', right: '在蓝天上' },
        { id: 'p3', left: '怎么样', right: '快乐地飞' },
      ]),
    ], '让句子更完整生动'),

    level(
      'chinese-3-04',
      '排序成句',
      [
      sequence('排出完整句子', [
        {
          id: 's1',
          prompt: '「我在学校里读书。」',
          items: [
            { id: 'wo', label: '我' },
            { id: 'zai', label: '在' },
            { id: 'xue', label: '学校' },
            { id: 'li', label: '里' },
            { id: 'du', label: '读书' },
          ],
          answerOrder: ['wo', 'zai', 'xue', 'li', 'du'],
          speak: '我在学校里读书',
        },
        {
          id: 's2',
          prompt: '「春天来了，花儿开了。」',
          items: [
            { id: 'chun', label: '春天' },
            { id: 'lai', label: '来了' },
            { id: 'hua', label: '花儿' },
            { id: 'kai', label: '开了' },
          ],
          answerOrder: ['chun', 'lai', 'hua', 'kai'],
          speak: '春天来了花儿开了',
        },
      ]),
      quiz('标点选句', [
        {
          id: 'q1',
          question: '哪个是完整的句子？',
          options: [
            { id: 'a', label: '小鸟在树上唱歌。' },
            { id: 'b', label: '小鸟树上' },
            { id: 'c', label: '唱歌小鸟' },
          ],
          answerId: 'a',
        },
      ]),
    ], '词语排成通顺句子'),

    level(
      'chinese-3-05',
      '看图选完整句子',
      [
      quiz('看图选句子', [
        {
          id: 'q1',
          question: '☀️🌳🐦 最合适的句子是？',
          options: [
            { id: 'a', label: '太阳出来了，小鸟在树上快乐地唱歌。' },
            { id: 'b', label: '下雨了，小鸟在游泳。' },
            { id: 'c', label: '晚上月亮很圆。' },
          ],
          answerId: 'a',
        },
        {
          id: 'q2',
          question: '🌧️🐸 可以说？',
          options: [
            { id: 'a', label: '下雨了，青蛙在荷叶上呱呱叫。' },
            { id: 'b', label: '下雪了，青蛙在天上飞。' },
            { id: 'c', label: '出太阳了，青蛙睡觉。' },
          ],
          answerId: 'a',
        },
        {
          id: 'q3',
          question: '👨‍🏫📚👧 可以说？',
          options: [
            { id: 'a', label: '老师教我们认真读书写字。' },
            { id: 'b', label: '小猫在钓鱼。' },
            { id: 'c', label: '汽车开得很快。' },
          ],
          answerId: 'a',
        },
        {
          id: 'q4',
          question: '🏃‍♂️⚽ 可以说？',
          options: [
            { id: 'a', label: '小男孩在操场上开心地踢足球。' },
            { id: 'b', label: '小男孩在教室里踢足球。' },
            { id: 'c', label: '小男孩在睡觉。' },
          ],
          answerId: 'a',
        },
      ]),
      dragMatch('图意配对', [
        { id: 'p1', left: '🌸', right: '春天花儿开了' },
        { id: 'p2', left: '🌙', right: '晚上月亮出来了' },
        { id: 'p3', left: '🍎', right: '苹果红红的' },
        { id: 'p4', left: '🐶', right: '小狗在跑步' },
      ]),
    ], '选最完整合适的句子'),

    level(
      'chinese-3-06',
      '谁在哪里做什么',
      [
      quiz('句式填空', [
        {
          id: 'q1',
          question: '（  ）在（  ）里（  ）。—— 小明在教室里写字。',
          options: [
            { id: 'a', label: '小明 / 教室 / 写字' },
            { id: 'b', label: '写字 / 小明 / 教室' },
            { id: 'c', label: '教室 / 小明 / 写字' },
          ],
          answerId: 'a',
        },
        {
          id: 'q2',
          question: '「谁 + 在哪里 + 做什么」—— 哪句正确？',
          options: [
            { id: 'a', label: '小鸟在蓝天上飞翔。' },
            { id: 'b', label: '在飞翔小鸟蓝天。' },
            { id: 'c', label: '飞翔小鸟。' },
          ],
          answerId: 'a',
        },
        {
          id: 'q3',
          question: '「小猫 ___ 鱼。」填什么？',
          options: [
            { id: 'a', label: '在河边钓' },
            { id: 'b', label: '书' },
            { id: 'c', label: '鞋' },
          ],
          answerId: 'a',
        },
        {
          id: 'q4',
          question: '「同学们 ___ 操场上 ___ 。」',
          options: [
            { id: 'a', label: '在 / 做操' },
            { id: 'b', label: '做操 / 在' },
            { id: 'c', label: '书 / 读' },
          ],
          answerId: 'a',
        },
      ]),
      sequence('组句：谁在做什么', [
        {
          id: 's1',
          prompt: '「爸爸在厨房做饭。」',
          items: [
            { id: 'ba', label: '爸爸' },
            { id: 'zai', label: '在' },
            { id: 'chu', label: '厨房' },
            { id: 'zuo', label: '做饭' },
          ],
          answerOrder: ['ba', 'zai', 'chu', 'zuo'],
          speak: '爸爸在厨房做饭',
        },
      ]),
      listenChoose(
        '听句子选答案',
        '小朋友在操场上跑步',
        [
          { id: 'a', label: '在教室读书' },
          { id: 'b', label: '在操场跑步' },
          { id: 'c', label: '在家里睡觉' },
        ],
        'b'
      ),
    ], '谁在哪里做什么'),

    level(
      'chinese-3-07',
      '词语句子综合',
      [
      quiz('综合练习', [
        {
          id: 'q1',
          question: '「认真」的反义词是？',
          options: [
            { id: 'a', label: '马虎' },
            { id: 'b', label: '努力' },
            { id: 'c', label: '仔细' },
          ],
          answerId: 'a',
        },
        {
          id: 'q2',
          question: '（  ）地听老师讲课',
          options: [
            { id: 'a', label: '认真' },
            { id: 'b', label: '红色' },
            { id: 'c', label: '飞快' },
          ],
          answerId: 'a',
        },
        {
          id: 'q3',
          question: '哪一句最完整？',
          options: [
            { id: 'a', label: '美丽的蝴蝶在花丛中飞舞。' },
            { id: 'b', label: '蝴蝶花' },
            { id: 'c', label: '飞呀飞' },
          ],
          answerId: 'a',
        },
      ]),
      sequence('综合排序', [
        {
          id: 's1',
          prompt: '「我们在春天里快乐地玩耍。」',
          items: [
            { id: 'wo', label: '我们' },
            { id: 'zai', label: '在' },
            { id: 'chun', label: '春天' },
            { id: 'li', label: '里' },
            { id: 'wan', label: '快乐地玩耍' },
          ],
          answerOrder: ['wo', 'zai', 'chun', 'li', 'wan'],
        },
      ]),
    ], '词语句子一起练'),
  ],
  '搭配扩句·排序表达'
)

/* ── U4 阅读表达 ── */

const u4 = unit(
  'chinese-4',
  '阅读表达',
  [
    level(
      'chinese-4-01',
      '古诗：咏鹅·静夜思',
      [
      readAlong(
        '咏鹅',
        '咏鹅',
        [
          { id: 'l1', text: '鹅，鹅，鹅，', speak: '鹅鹅鹅' },
          { id: 'l2', text: '曲项向天歌。', speak: '曲项向天歌' },
          { id: 'l3', text: '白毛浮绿水，', speak: '白毛浮绿水' },
          { id: 'l4', text: '红掌拨清波。', speak: '红掌拨清波' },
        ]
      ),
      quiz('《咏鹅》理解', [
        {
          id: 'q1',
          question: '《咏鹅》写的是什么动物？',
          options: [
            { id: 'a', label: '鹅' },
            { id: 'b', label: '鸭' },
            { id: 'c', label: '鸡' },
          ],
          answerId: 'a',
        },
        {
          id: 'q2',
          question: '哪句写鹅的颜色？',
          options: [
            { id: 'a', label: '白毛浮绿水' },
            { id: 'b', label: '曲项向天歌' },
            { id: 'c', label: '鹅，鹅，鹅' },
          ],
          answerId: 'a',
        },
      ]),
      readAlong(
        '静夜思',
        '静夜思',
        [
          { id: 'l1', text: '床前明月光，', speak: '床前明月光' },
          { id: 'l2', text: '疑是地上霜。', speak: '疑是地上霜' },
          { id: 'l3', text: '举头望明月，', speak: '举头望明月' },
          { id: 'l4', text: '低头思故乡。', speak: '低头思故乡' },
        ]
      ),
      quiz('《静夜思》理解', [
        {
          id: 'q1',
          question: '诗人看到什么想起了故乡？',
          options: [
            { id: 'a', label: '明月' },
            { id: 'b', label: '太阳' },
            { id: 'c', label: '星星' },
          ],
          answerId: 'a',
        },
        {
          id: 'q2',
          question: '这首诗表达了什么感情？',
          options: [
            { id: 'a', label: '思念故乡' },
            { id: 'b', label: '高兴玩耍' },
            { id: 'c', label: '生气愤怒' },
          ],
          answerId: 'a',
        },
      ]),
    ], '读诗并理解内容'),

    level(
      'chinese-4-02',
      '古诗：春晓·登鹳雀楼',
      [
      readAlong(
        '春晓',
        '春晓',
        [
          { id: 'l1', text: '春眠不觉晓，', speak: '春眠不觉晓' },
          { id: 'l2', text: '处处闻啼鸟。', speak: '处处闻啼鸟' },
          { id: 'l3', text: '夜来风雨声，', speak: '夜来风雨声' },
          { id: 'l4', text: '花落知多少。', speak: '花落知多少' },
        ]
      ),
      quiz('《春晓》理解', [
        {
          id: 'q1',
          question: '《春晓》写的是什么季节？',
          options: [
            { id: 'a', label: '春天' },
            { id: 'b', label: '夏天' },
            { id: 'c', label: '冬天' },
          ],
          answerId: 'a',
        },
        {
          id: 'q2',
          question: '「处处闻啼鸟」写的是什么声音？',
          options: [
            { id: 'a', label: '鸟叫' },
            { id: 'b', label: '风声' },
            { id: 'c', label: '雨声' },
          ],
          answerId: 'a',
        },
      ]),
      readAlong(
        '登鹳雀楼',
        '登鹳雀楼',
        [
          { id: 'l1', text: '白日依山尽，', speak: '白日依山尽' },
          { id: 'l2', text: '黄河入海流。', speak: '黄河入海流' },
          { id: 'l3', text: '欲穷千里目，', speak: '欲穷千里目' },
          { id: 'l4', text: '更上一层楼。', speak: '更上一层楼' },
        ]
      ),
      quiz('《登鹳雀楼》理解', [
        {
          id: 'q1',
          question: '「黄河入海流」写的是什么？',
          options: [
            { id: 'a', label: '黄河' },
            { id: 'b', label: '长江' },
            { id: 'c', label: '湖泊' },
          ],
          answerId: 'a',
        },
        {
          id: 'q2',
          question: '「更上一层楼」告诉我们？',
          options: [
            { id: 'a', label: '站得高看得远，要努力向上' },
            { id: 'b', label: '要往下走' },
            { id: 'c', label: '要睡觉' },
          ],
          answerId: 'a',
        },
      ]),
    ], '春天与登高望远'),

    level(
      'chinese-4-03',
      '古诗：悯农',
      [
      readAlong(
        '悯农（其一）',
        '悯农',
        [
          { id: 'l1', text: '春种一粒粟，', speak: '春种一粒粟' },
          { id: 'l2', text: '秋收万颗子。', speak: '秋收万颗子' },
          { id: 'l3', text: '四海无闲田，', speak: '四海无闲田' },
          { id: 'l4', text: '农夫犹饿死。', speak: '农夫犹饿死' },
        ]
      ),
      readAlong(
        '悯农（其二）',
        '悯农',
        [
          { id: 'l1', text: '锄禾日当午，', speak: '锄禾日当午' },
          { id: 'l2', text: '汗滴禾下土。', speak: '汗滴禾下土' },
          { id: 'l3', text: '谁知盘中餐，', speak: '谁知盘中餐' },
          { id: 'l4', text: '粒粒皆辛苦。', speak: '粒粒皆辛苦' },
        ]
      ),
      quiz('《悯农》理解', [
        {
          id: 'q1',
          question: '「粒粒皆辛苦」告诉我们什么？',
          options: [
            { id: 'a', label: '粮食来之不易，要珍惜' },
            { id: 'b', label: '粮食很多' },
            { id: 'c', label: '不用吃饭' },
          ],
          answerId: 'a',
        },
        {
          id: 'q2',
          question: '「汗滴禾下土」写农民在做什么？',
          options: [
            { id: 'a', label: '锄禾劳动' },
            { id: 'b', label: '睡觉' },
            { id: 'c', label: '玩耍' },
          ],
          answerId: 'a',
        },
        {
          id: 'q3',
          question: '两首《悯农》都和什么有关？',
          options: [
            { id: 'a', label: '农民和粮食' },
            { id: 'b', label: '月亮' },
            { id: 'c', label: '游戏' },
          ],
          answerId: 'a',
        },
      ]),
    ], '珍惜粮食懂农民'),

    level(
      'chinese-4-04',
      '短文阅读（一）',
      [
      quiz('阅读：小明的早晨', [
        {
          id: 'q1',
          question: '「早上，小明背上书包，高高兴兴地去上学。路上，他看见太阳升起来了，小鸟在唱歌。」—— 小明去哪里？',
          options: [
            { id: 'a', label: '上学' },
            { id: 'b', label: '去公园' },
            { id: 'c', label: '去商店' },
          ],
          answerId: 'a',
        },
        {
          id: 'q2',
          question: '小明在路上看见什么？',
          options: [
            { id: 'a', label: '太阳升起来，小鸟唱歌' },
            { id: 'b', label: '下雨了' },
            { id: 'c', label: '月亮出来了' },
          ],
          answerId: 'a',
        },
        {
          id: 'q3',
          question: '小明的心情怎么样？',
          options: [
            { id: 'a', label: '高高兴兴' },
            { id: 'b', label: '很难过' },
            { id: 'c', label: '很生气' },
          ],
          answerId: 'a',
        },
      ]),
      quiz('阅读：春天的公园', [
        {
          id: 'q4',
          question: '「春天来了，公园里的花儿开了，红的、黄的、白的，真美丽。小朋友们在草地上奔跑、玩耍。」—— 这是什么季节？',
          options: [
            { id: 'a', label: '春天' },
            { id: 'b', label: '冬天' },
            { id: 'c', label: '秋天' },
          ],
          answerId: 'a',
        },
        {
          id: 'q5',
          question: '小朋友们在做什么？',
          options: [
            { id: 'a', label: '奔跑玩耍' },
            { id: 'b', label: '睡觉' },
            { id: 'c', label: '读书' },
          ],
          answerId: 'a',
        },
      ]),
    ], '读懂短文说了什么'),

    level(
      'chinese-4-05',
      '短文阅读（二）',
      [
      quiz('阅读：小兔子借书', [
        {
          id: 'q1',
          question: '「小兔子向小熊借了一本书。它认真地读完了，还把小熊的书还了，并说谢谢。」—— 小兔子向谁借书？',
          options: [
            { id: 'a', label: '小熊' },
            { id: 'b', label: '小鸟' },
            { id: 'c', label: '小猫' },
          ],
          answerId: 'a',
        },
        {
          id: 'q2',
          question: '小兔子读完书后做了什么？',
          options: [
            { id: 'a', label: '还书并说谢谢' },
            { id: 'b', label: '把书弄丢了' },
            { id: 'c', label: '把书撕了' },
          ],
          answerId: 'a',
        },
        {
          id: 'q3',
          question: '先发生什么，后发生什么？',
          options: [
            { id: 'a', label: '先借书，后还书' },
            { id: 'b', label: '先还书，后借书' },
            { id: 'c', label: '只借不还' },
          ],
          answerId: 'a',
        },
      ]),
      quiz('阅读：为什么下雨', [
        {
          id: 'q4',
          question: '「乌云来了，天空暗了。不一会儿，雨点落下来了。小草和花儿喝饱了水，笑弯了腰。」—— 下雨前天空怎么样？',
          options: [
            { id: 'a', label: '变暗了' },
            { id: 'b', label: '更亮了' },
            { id: 'c', label: '出现彩虹' },
          ],
          answerId: 'a',
        },
        {
          id: 'q5',
          question: '雨下完后，小草和花儿怎么样？',
          options: [
            { id: 'a', label: '喝饱水，很高兴' },
            { id: 'b', label: '枯死了' },
            { id: 'c', label: '飞走了' },
          ],
          answerId: 'a',
        },
      ]),
    ], '谁做了什么·先发生什么'),

    level(
      'chinese-4-06',
      '故事图片排序',
      [
      sequence('「种苹果树」排顺序', [
        {
          id: 's1',
          prompt: '🌱→💧→🌳→🍎 按事情发展排',
          items: [
            { id: 'a', label: '🌱 种下小树苗' },
            { id: 'b', label: '💧 浇水施肥' },
            { id: 'c', label: '🌳 小树长大了' },
            { id: 'd', label: '🍎 结出大苹果' },
          ],
          answerOrder: ['a', 'b', 'c', 'd'],
          speak: '种下浇水长大结果',
        },
      ]),
      sequence('「洗手吃饭」排顺序', [
        {
          id: 's2',
          prompt: '吃饭前要先洗手',
          items: [
            { id: 'a', label: '🚰 打开水龙头' },
            { id: 'b', label: '🧼 用肥皂洗手' },
            { id: 'c', label: '🍚 坐在桌前吃饭' },
          ],
          answerOrder: ['a', 'b', 'c'],
        },
      ]),
      quiz('复述选择', [
        {
          id: 'q1',
          question: '种苹果树的故事告诉我们？',
          options: [
            { id: 'a', label: '要劳动才有收获' },
            { id: 'b', label: '不用浇水也会结果' },
            { id: 'c', label: '苹果会自己长出来' },
          ],
          answerId: 'a',
        },
      ]),
    ], '图片排序并理解故事'),

    level(
      'chinese-4-07',
      '看图说话',
      [
      quiz('三要点选表达', [
        {
          id: 'q1',
          question: '要点：👧 小女孩 / 🏞️ 公园 / 🎈 放风筝 —— 哪句最完整？',
          options: [
            { id: 'a', label: '小女孩在公园里开心地放风筝。' },
            { id: 'b', label: '小女孩。' },
            { id: 'c', label: '放风筝公园。' },
          ],
          answerId: 'a',
        },
        {
          id: 'q2',
          question: '要点：👨‍👩‍👧 一家人 / 🏠 家里 / 🍽️ 吃饭 —— 选最好的表达',
          options: [
            { id: 'a', label: '一家人在家里高高兴兴地吃饭。' },
            { id: 'b', label: '吃饭。' },
            { id: 'c', label: '家里一家人。' },
          ],
          answerId: 'a',
        },
        {
          id: 'q3',
          question: '要点：🐱 小猫 / 🐟 鱼 / 🌊 河边 —— 哪句对？',
          options: [
            { id: 'a', label: '小猫在河边看着水里的小鱼。' },
            { id: 'b', label: '小猫飞上了天。' },
            { id: 'c', label: '鱼在追小猫。' },
          ],
          answerId: 'a',
        },
      ]),
      sequence('说话顺序', [
        {
          id: 's1',
          prompt: '看图说话：先说谁，再说在哪里，最后做什么',
          items: [
            { id: 'who', label: '谁（人物）' },
            { id: 'where', label: '在哪里（地点）' },
            { id: 'what', label: '做什么（事件）' },
          ],
          answerOrder: ['who', 'where', 'what'],
        },
      ]),
    ], '人物·地点·事件说完整'),

    level(
      'chinese-4-08',
      '阅读表达综合',
      [
      quiz('根据短文选标题', [
        {
          id: 'q1',
          question: '「秋天到了，树叶变黄了。一阵风吹过，树叶飘飘落下来，像蝴蝶在飞。」—— 最好的标题是？',
          options: [
            { id: 'a', label: '秋天的落叶' },
            { id: 'b', label: '夏天游泳' },
            { id: 'c', label: '冬天下雪' },
          ],
          answerId: 'a',
        },
        {
          id: 'q2',
          question: '「小明上课认真听讲，积极举手发言，老师表扬了他。」—— 最好的标题是？',
          options: [
            { id: 'a', label: '认真听讲的小明' },
            { id: 'b', label: '小明去公园' },
            { id: 'c', label: '小明睡觉' },
          ],
          answerId: 'a',
        },
        {
          id: 'q3',
          question: '「妈妈做了香喷喷的饭菜，一家人围坐在一起，真幸福。」—— 最好的标题是？',
          options: [
            { id: 'a', label: '幸福的一家人' },
            { id: 'b', label: '去上学' },
            { id: 'c', label: '踢足球' },
          ],
          answerId: 'a',
        },
      ]),
      quiz('综合理解', [
        {
          id: 'q4',
          question: '🌅🏞️ 早上可以看到？',
          options: [
            { id: 'a', label: '太阳从东边升起来，新的一天开始了。' },
            { id: 'b', label: '月亮圆圆的。' },
            { id: 'c', label: '星星在眨眼。' },
          ],
          answerId: 'a',
        },
        {
          id: 'q5',
          question: '想夸一朵花，怎么说更好？',
          options: [
            { id: 'a', label: '这朵花红红的，真好看！' },
            { id: 'b', label: '花。' },
            { id: 'c', label: '嗯。' },
          ],
          answerId: 'a',
        },
      ]),
    ], '选标题·综合表达'),
  ],
  '古诗理解·短文阅读·看图说话'
)

export const chinese: Subject = {
  id: 'chinese',
  name: '语文',
  emoji: '📚',
  color: '#FF7A59',
  mascot: 'panda',
  description: '拼音入门、易混辨析、汉字形近多音、阅读与表达',
  units: [u0, u1, u2, u3, u4],
}
