import {
  tapRead,
  listenChoose,
  dragMatch,
  tracing,
  quiz,
  sequence,
  spiritLetterMorph,
  level,
  unit,
} from '../helpers'

const EN = 'en-US'

export const englishUnit1 = unit(
  'english-1',
  '字母乐园',
  [
    level('english-1-01', 'Letters A-E', [
      tapRead(
        '点读 A-E',
        [
          { id: 'a', label: 'A a', speak: 'A', speakLang: EN, icon: '🍎', subLabel: 'apple' },
          { id: 'b', label: 'B b', speak: 'B', speakLang: EN, icon: '🐻', subLabel: 'bear' },
          { id: 'c', label: 'C c', speak: 'C', speakLang: EN, icon: '🐱', subLabel: 'cat' },
          { id: 'd', label: 'D d', speak: 'D', speakLang: EN, icon: '🐶', subLabel: 'dog' },
          { id: 'e', label: 'E e', speak: 'E', speakLang: EN, icon: '🐘', subLabel: 'elephant' },
        ],
        '点字母，听字母和单词'
      ),
      tracing('描字母 A-E', [
        { id: 'ta', char: 'A', speak: 'A', grid: 'english' },
        { id: 'tb', char: 'B', speak: 'B', grid: 'english' },
        { id: 'tc', char: 'C', speak: 'C', grid: 'english' },
        { id: 'td', char: 'D', speak: 'D', grid: 'english' },
        { id: 'te', char: 'E', speak: 'E', grid: 'english' },
      ]),
      listenChoose(
        '听字母',
        'C',
        [
          { id: 'a', label: 'A', speak: 'A' },
          { id: 'b', label: 'C', speak: 'C' },
          { id: 'c', label: 'E', speak: 'E' },
        ],
        'b',
        { promptLang: EN }
      ),
      spiritLetterMorph(
        '捏字母 A O',
        [
          { letter: 'A', speak: 'A', speakLang: EN },
          { letter: 'O', speak: 'O', speakLang: EN },
        ],
        '拖一拖捏成字母，听英语发音'
      ),
    ], '认识 A 到 E'),

    level('english-1-02', 'Letters F-J', [
      tapRead(
        '点读 F-J',
        [
          { id: 'f', label: 'F f', speak: 'F', speakLang: EN, icon: '🐟', subLabel: 'fish' },
          { id: 'g', label: 'G g', speak: 'G', speakLang: EN, icon: '🐐', subLabel: 'goat' },
          { id: 'h', label: 'H h', speak: 'H', speakLang: EN, icon: '🏠', subLabel: 'house' },
          { id: 'i', label: 'I i', speak: 'I', speakLang: EN, icon: '🍦', subLabel: 'ice cream' },
          { id: 'j', label: 'J j', speak: 'J', speakLang: EN, icon: '🧃', subLabel: 'juice' },
        ],
        '点字母，听字母和单词'
      ),
      tracing('描字母 F-J', [
        { id: 'tf', char: 'F', speak: 'F', grid: 'english' },
        { id: 'tg', char: 'G', speak: 'G', grid: 'english' },
        { id: 'th', char: 'H', speak: 'H', grid: 'english' },
        { id: 'ti', char: 'I', speak: 'I', grid: 'english' },
        { id: 'tj', char: 'J', speak: 'J', grid: 'english' },
      ]),
      dragMatch('字母和单词', [
        { id: 'p1', left: 'F', right: 'fish' },
        { id: 'p2', left: 'G', right: 'goat' },
        { id: 'p3', left: 'H', right: 'house' },
        { id: 'p4', left: 'I', right: 'ice cream' },
        { id: 'p5', left: 'J', right: 'juice' },
      ]),
    ], '认识 F 到 J'),

    level('english-1-03', 'Letters K-O', [
      tapRead(
        '点读 K-O',
        [
          { id: 'k', label: 'K k', speak: 'K', speakLang: EN, icon: '🪁', subLabel: 'kite' },
          { id: 'l', label: 'L l', speak: 'L', speakLang: EN, icon: '🦁', subLabel: 'lion' },
          { id: 'm', label: 'M m', speak: 'M', speakLang: EN, icon: '🐵', subLabel: 'monkey' },
          { id: 'n', label: 'N n', speak: 'N', speakLang: EN, icon: '🪺', subLabel: 'nest' },
          { id: 'o', label: 'O o', speak: 'O', speakLang: EN, icon: '🐙', subLabel: 'octopus' },
        ],
        '点字母，听字母和单词'
      ),
      tracing('描字母 K-O', [
        { id: 'tk', char: 'K', speak: 'K', grid: 'english' },
        { id: 'tl', char: 'L', speak: 'L', grid: 'english' },
        { id: 'tm', char: 'M', speak: 'M', grid: 'english' },
        { id: 'tn', char: 'N', speak: 'N', grid: 'english' },
        { id: 'to', char: 'O', speak: 'O', grid: 'english' },
      ]),
      listenChoose(
        '听字母选一选',
        'M',
        [
          { id: 'a', label: 'K' },
          { id: 'b', label: 'M' },
          { id: 'c', label: 'O' },
        ],
        'b',
        { promptLang: EN }
      ),
    ], '认识 K 到 O'),

    level('english-1-04', 'Letters P-T', [
      tapRead(
        '点读 P-T',
        [
          { id: 'p', label: 'P p', speak: 'P', speakLang: EN, icon: '🐷', subLabel: 'pig' },
          { id: 'q', label: 'Q q', speak: 'Q', speakLang: EN, icon: '👸', subLabel: 'queen' },
          { id: 'r', label: 'R r', speak: 'R', speakLang: EN, icon: '🐰', subLabel: 'rabbit' },
          { id: 's', label: 'S s', speak: 'S', speakLang: EN, icon: '☀️', subLabel: 'sun' },
          { id: 't', label: 'T t', speak: 'T', speakLang: EN, icon: '🐯', subLabel: 'tiger' },
        ],
        '点字母，听字母和单词'
      ),
      tracing('描字母 P-T', [
        { id: 'tp', char: 'P', speak: 'P', grid: 'english' },
        { id: 'tq', char: 'Q', speak: 'Q', grid: 'english' },
        { id: 'tr', char: 'R', speak: 'R', grid: 'english' },
        { id: 'ts', char: 'S', speak: 'S', grid: 'english' },
        { id: 'tt', char: 'T', speak: 'T', grid: 'english' },
      ]),
      quiz('字母小测', [
        {
          id: 'q1',
          question: 'Which letter starts pig?',
          options: [
            { id: 'a', label: 'P' },
            { id: 'b', label: 'B' },
            { id: 'c', label: 'D' },
          ],
          answerId: 'a',
        },
        {
          id: 'q2',
          question: 'Sun starts with?',
          options: [
            { id: 'a', label: 'S' },
            { id: 'b', label: 'C' },
            { id: 'c', label: 'Z' },
          ],
          answerId: 'a',
        },
        {
          id: 'q3',
          question: 'Tiger starts with?',
          options: [
            { id: 'a', label: 'D' },
            { id: 'b', label: 'T' },
            { id: 'c', label: 'R' },
          ],
          answerId: 'b',
        },
      ]),
    ], '认识 P 到 T'),

    level('english-1-05', 'Letters U-Z', [
      tapRead(
        '点读 U-Z',
        [
          { id: 'u', label: 'U u', speak: 'U', speakLang: EN, icon: '☂️', subLabel: 'umbrella' },
          { id: 'v', label: 'V v', speak: 'V', speakLang: EN, icon: '🎻', subLabel: 'violin' },
          { id: 'w', label: 'W w', speak: 'W', speakLang: EN, icon: '🍉', subLabel: 'watermelon' },
          { id: 'x', label: 'X x', speak: 'X', speakLang: EN, icon: '📦', subLabel: 'box' },
          { id: 'y', label: 'Y y', speak: 'Y', speakLang: EN, icon: '💛', subLabel: 'yellow' },
          { id: 'z', label: 'Z z', speak: 'Z', speakLang: EN, icon: '🦓', subLabel: 'zebra' },
        ],
        '点字母，听字母和单词'
      ),
      tracing('描字母 U-Z', [
        { id: 'tu', char: 'U', speak: 'U', grid: 'english' },
        { id: 'tv', char: 'V', speak: 'V', grid: 'english' },
        { id: 'tw', char: 'W', speak: 'W', grid: 'english' },
        { id: 'tx', char: 'X', speak: 'X', grid: 'english' },
        { id: 'ty', char: 'Y', speak: 'Y', grid: 'english' },
        { id: 'tz', char: 'Z', speak: 'Z', grid: 'english' },
      ]),
      sequence('字母顺序 A B C D', [
        {
          id: 's1',
          prompt: 'Put A B C D in order',
          items: [
            { id: 'a', label: 'A' },
            { id: 'b', label: 'B' },
            { id: 'c', label: 'C' },
            { id: 'd', label: 'D' },
          ],
          answerOrder: ['a', 'b', 'c', 'd'],
          speak: 'A B C D',
        },
      ]),
    ], '认识 U 到 Z'),

    level('english-1-06', 'Letter Sounds 1', [
      tapRead(
        '字母发音 A-M',
        [
          { id: 'a', label: 'A', speak: 'A', speakLang: EN, icon: '🍎', subLabel: 'apple' },
          { id: 'b', label: 'B', speak: 'B', speakLang: EN, icon: '⚽', subLabel: 'ball' },
          { id: 'c', label: 'C', speak: 'C', speakLang: EN, icon: '🐱', subLabel: 'cat' },
          { id: 'd', label: 'D', speak: 'D', speakLang: EN, icon: '🐶', subLabel: 'dog' },
          { id: 'f', label: 'F', speak: 'F', speakLang: EN, icon: '🐟', subLabel: 'fish' },
          { id: 'm', label: 'M', speak: 'M', speakLang: EN, icon: '👩', subLabel: 'mom' },
        ],
        '点字母，听字母和单词'
      ),
      listenChoose(
        '听发音选字母',
        'b',
        [
          { id: 'a', label: 'B' },
          { id: 'b', label: 'D' },
          { id: 'c', label: 'P' },
        ],
        'a',
        { promptLang: EN, promptLabel: 'b sound' }
      ),
      dragMatch('发音配对', [
        { id: 'p1', left: 'A', right: 'apple' },
        { id: 'p2', left: 'B', right: 'ball' },
        { id: 'p3', left: 'C', right: 'cat' },
        { id: 'p4', left: 'M', right: 'mom' },
      ]),
    ], '字母发音入门'),

    level('english-1-07', 'Letter Sounds 2', [
      tapRead(
        '字母发音 N-Z',
        [
          { id: 'n', label: 'N', speak: 'N', speakLang: EN, icon: '👃', subLabel: 'nose' },
          { id: 'p', label: 'P', speak: 'P', speakLang: EN, icon: '🖊️', subLabel: 'pen' },
          { id: 's', label: 'S', speak: 'S', speakLang: EN, icon: '☀️', subLabel: 'sun' },
          { id: 't', label: 'T', speak: 'T', speakLang: EN, icon: '🔝', subLabel: 'top' },
          { id: 'r', label: 'R', speak: 'R', speakLang: EN, icon: '🟥', subLabel: 'red' },
          { id: 'z', label: 'Z', speak: 'Z', speakLang: EN, icon: '🦓', subLabel: 'zoo' },
        ],
        '点字母，听字母和单词'
      ),
      quiz('首字母发音', [
        {
          id: 'q1',
          question: 'Sun starts with sound?',
          options: [
            { id: 'a', label: 's' },
            { id: 'b', label: 'z' },
            { id: 'c', label: 't' },
          ],
          answerId: 'a',
        },
        {
          id: 'q2',
          question: 'Pen starts with?',
          options: [
            { id: 'a', label: 'b' },
            { id: 'b', label: 'p' },
            { id: 'c', label: 'd' },
          ],
          answerId: 'b',
        },
        {
          id: 'q3',
          question: 'Red starts with?',
          options: [
            { id: 'a', label: 'r' },
            { id: 'b', label: 'l' },
            { id: 'c', label: 'w' },
          ],
          answerId: 'a',
        },
      ]),
      listenChoose(
        '听音选词',
        'sun',
        [
          { id: 'a', label: 'sun' },
          { id: 'b', label: 'fun' },
          { id: 'c', label: 'run' },
        ],
        'a',
        { promptLang: EN }
      ),
    ], '更多字母发音'),

    level('english-1-08', '大小写配对', [
      dragMatch('大写小写', [
        { id: 'p1', left: 'A', right: 'a' },
        { id: 'p2', left: 'B', right: 'b' },
        { id: 'p3', left: 'M', right: 'm' },
        { id: 'p4', left: 'S', right: 's' },
        { id: 'p5', left: 'Z', right: 'z' },
        { id: 'p6', left: 'T', right: 't' },
      ]),
      sequence('Alphabet W X Y Z', [
        {
          id: 's1',
          prompt: 'Order: W X Y Z',
          items: [
            { id: 'w', label: 'W' },
            { id: 'x', label: 'X' },
            { id: 'y', label: 'Y' },
            { id: 'z', label: 'Z' },
          ],
          answerOrder: ['w', 'x', 'y', 'z'],
        },
      ]),
      quiz('字母总复习', [
        {
          id: 'q1',
          question: 'How many letters in English?',
          options: [
            { id: 'a', label: '24' },
            { id: 'b', label: '26' },
            { id: 'c', label: '28' },
          ],
          answerId: 'b',
        },
        {
          id: 'q2',
          question: 'First letter is?',
          options: [
            { id: 'a', label: 'A' },
            { id: 'b', label: 'Z' },
            { id: 'c', label: 'B' },
          ],
          answerId: 'a',
        },
        {
          id: 'q3',
          question: 'Last letter is?',
          options: [
            { id: 'a', label: 'Y' },
            { id: 'b', label: 'Z' },
            { id: 'c', label: 'X' },
          ],
          answerId: 'b',
        },
      ]),
    ], '大小写与字母表'),
  ],
  '26 个字母认读、发音与描红'
)
