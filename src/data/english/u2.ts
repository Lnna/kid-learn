import {
  tapRead,
  listenChoose,
  dragMatch,
  blend,
  quiz,
  level,
  unit,
} from '../helpers'

const EN = 'en-US'

export const englishUnit2 = unit(
  'english-2',
  '自然拼读',
  [
    level('english-2-01', 'Short a CVC', [
      tapRead('短元音 a', [
        { id: 'cat', label: 'cat', speak: 'cat', speakLang: EN, icon: '🐱' },
        { id: 'bat', label: 'bat', speak: 'bat', speakLang: EN, icon: '🦇' },
        { id: 'hat', label: 'hat', speak: 'hat', speakLang: EN, icon: '🎩' },
        { id: 'map', label: 'map', speak: 'map', speakLang: EN, icon: '🗺️' },
        { id: 'bag', label: 'bag', speak: 'bag', speakLang: EN, icon: '👜' },
      ]),
      blend('拼读 short a', [
        { id: 'b1', parts: ['c', 'a', 't'], result: 'cat', speak: 'cat', speakLang: EN },
        { id: 'b2', parts: ['h', 'a', 't'], result: 'hat', speak: 'hat', speakLang: EN },
        { id: 'b3', parts: ['m', 'a', 'p'], result: 'map', speak: 'map', speakLang: EN },
        { id: 'b4', parts: ['b', 'a', 'g'], result: 'bag', speak: 'bag', speakLang: EN },
      ]),
      listenChoose(
        '听词选一选',
        'cat',
        [
          { id: 'a', label: 'cat' },
          { id: 'b', label: 'dog' },
          { id: 'c', label: 'pig' },
        ],
        'a',
        { promptLang: EN }
      ),
    ], 'CVC 短元音 a'),

    level('english-2-02', 'Short e / i', [
      tapRead('短元音 e', [
        { id: 'pen', label: 'pen', speak: 'pen', speakLang: EN, icon: '🖊️' },
        { id: 'hen', label: 'hen', speak: 'hen', speakLang: EN, icon: '🐔' },
        { id: 'bed', label: 'bed', speak: 'bed', speakLang: EN, icon: '🛏️' },
        { id: 'red', label: 'red', speak: 'red', speakLang: EN, icon: '🔴' },
      ]),
      tapRead('短元音 i', [
        { id: 'pig', label: 'pig', speak: 'pig', speakLang: EN, icon: '🐷' },
        { id: 'big', label: 'big', speak: 'big', speakLang: EN, icon: '🐘' },
        { id: 'sit', label: 'sit', speak: 'sit', speakLang: EN, icon: '🪑' },
        { id: 'six', label: 'six', speak: 'six', speakLang: EN, icon: '6️⃣' },
      ]),
      blend('拼读 e / i', [
        { id: 'b1', parts: ['p', 'e', 'n'], result: 'pen', speak: 'pen', speakLang: EN },
        { id: 'b2', parts: ['r', 'e', 'd'], result: 'red', speak: 'red', speakLang: EN },
        { id: 'b3', parts: ['p', 'i', 'g'], result: 'pig', speak: 'pig', speakLang: EN },
        { id: 'b4', parts: ['s', 'i', 't'], result: 'sit', speak: 'sit', speakLang: EN },
      ]),
    ], '短元音 e 和 i'),

    level('english-2-03', 'Short o / u', [
      tapRead('短元音 o', [
        { id: 'dog', label: 'dog', speak: 'dog', speakLang: EN, icon: '🐶' },
        { id: 'hot', label: 'hot', speak: 'hot', speakLang: EN, icon: '🥵' },
        { id: 'box', label: 'box', speak: 'box', speakLang: EN, icon: '📦' },
        { id: 'fox', label: 'fox', speak: 'fox', speakLang: EN, icon: '🦊' },
      ]),
      tapRead('短元音 u', [
        { id: 'sun', label: 'sun', speak: 'sun', speakLang: EN, icon: '☀️' },
        { id: 'bus', label: 'bus', speak: 'bus', speakLang: EN, icon: '🚌' },
        { id: 'cup', label: 'cup', speak: 'cup', speakLang: EN, icon: '🥤' },
        { id: 'fun', label: 'fun', speak: 'fun', speakLang: EN, icon: '🎉' },
      ]),
      quiz('CVC 辨词', [
        {
          id: 'q1',
          question: 'd-o-g is?',
          options: [
            { id: 'a', label: 'dog' },
            { id: 'b', label: 'dig' },
            { id: 'c', label: 'dug' },
          ],
          answerId: 'a',
        },
        {
          id: 'q2',
          question: 'Which has short u?',
          options: [
            { id: 'a', label: 'sun' },
            { id: 'b', label: 'cake' },
            { id: 'c', label: 'bike' },
          ],
          answerId: 'a',
        },
        {
          id: 'q3',
          question: 'fox rhymes with?',
          options: [
            { id: 'a', label: 'fun' },
            { id: 'b', label: 'box' },
            { id: 'c', label: 'pig' },
          ],
          answerId: 'b',
        },
      ]),
    ], '短元音 o 和 u'),

    level('english-2-04', 'Digraphs sh / ch', [
      tapRead('sh 和 ch', [
        { id: 'sh1', label: 'ship', speak: 'ship', speakLang: EN, icon: '🚢', subLabel: 'sh' },
        { id: 'sh2', label: 'fish', speak: 'fish', speakLang: EN, icon: '🐟', subLabel: 'sh' },
        { id: 'sh3', label: 'shop', speak: 'shop', speakLang: EN, icon: '🏪', subLabel: 'sh' },
        { id: 'ch1', label: 'chip', speak: 'chip', speakLang: EN, icon: '🍟', subLabel: 'ch' },
        { id: 'ch2', label: 'chop', speak: 'chop', speakLang: EN, icon: '🔪', subLabel: 'ch' },
        { id: 'ch3', label: 'chin', speak: 'chin', speakLang: EN, subLabel: 'ch' },
      ]),
      blend('拼 sh / ch', [
        { id: 'b1', parts: ['sh', 'i', 'p'], result: 'ship', speak: 'ship', speakLang: EN },
        { id: 'b2', parts: ['f', 'i', 'sh'], result: 'fish', speak: 'fish', speakLang: EN },
        { id: 'b3', parts: ['ch', 'i', 'p'], result: 'chip', speak: 'chip', speakLang: EN },
        { id: 'b4', parts: ['ch', 'o', 'p'], result: 'chop', speak: 'chop', speakLang: EN },
      ]),
      listenChoose(
        '听辨 sh / ch',
        'ship',
        [
          { id: 'a', label: 'ship' },
          { id: 'b', label: 'chip' },
          { id: 'c', label: 'sip' },
        ],
        'a',
        { promptLang: EN }
      ),
    ], '组合音 sh、ch'),

    level('english-2-05', 'Digraphs th / ck', [
      tapRead('th 和 ck', [
        { id: 'th1', label: 'this', speak: 'this', speakLang: EN, subLabel: 'th' },
        { id: 'th2', label: 'that', speak: 'that', speakLang: EN, subLabel: 'th' },
        { id: 'th3', label: 'three', speak: 'three', speakLang: EN, icon: '3️⃣', subLabel: 'th' },
        { id: 'ck1', label: 'duck', speak: 'duck', speakLang: EN, icon: '🦆', subLabel: 'ck' },
        { id: 'ck2', label: 'sock', speak: 'sock', speakLang: EN, icon: '🧦', subLabel: 'ck' },
        { id: 'ck3', label: 'back', speak: 'back', speakLang: EN, icon: '🔙', subLabel: 'ck' },
      ]),
      dragMatch('Digraph match', [
        { id: 'p1', left: 'sh', right: 'ship / fish' },
        { id: 'p2', left: 'ch', right: 'chip / chin' },
        { id: 'p3', left: 'th', right: 'this / three' },
        { id: 'p4', left: 'ck', right: 'duck / sock' },
      ]),
      quiz('选正确拼写', [
        {
          id: 'q1',
          question: '鸭子 duck 怎么拼？',
          options: [
            { id: 'a', label: 'duk' },
            { id: 'b', label: 'duck' },
            { id: 'c', label: 'dk' },
          ],
          answerId: 'b',
        },
        {
          id: 'q2',
          question: 'Which has th?',
          options: [
            { id: 'a', label: 'three' },
            { id: 'b', label: 'tree' },
            { id: 'c', label: 'free' },
          ],
          answerId: 'a',
        },
      ]),
    ], '组合音 th、ck'),

    level('english-2-06', '长元音 a_e / i_e', [
      tapRead('Magic e: a_e', [
        { id: 'cake', label: 'cake', speak: 'cake', speakLang: EN, icon: '🍰' },
        { id: 'name', label: 'name', speak: 'name', speakLang: EN, icon: '📛' },
        { id: 'lake', label: 'lake', speak: 'lake', speakLang: EN, icon: '🏞️' },
        { id: 'gate', label: 'gate', speak: 'gate', speakLang: EN, icon: '🚪' },
      ]),
      tapRead('Magic e: i_e', [
        { id: 'bike', label: 'bike', speak: 'bike', speakLang: EN, icon: '🚲' },
        { id: 'kite', label: 'kite', speak: 'kite', speakLang: EN, icon: '🪁' },
        { id: 'five', label: 'five', speak: 'five', speakLang: EN, icon: '5️⃣' },
        { id: 'like', label: 'like', speak: 'like', speakLang: EN, icon: '👍' },
      ]),
      quiz('短音还是长音', [
        {
          id: 'q1',
          question: 'cap to cape, the vowel becomes?',
          options: [
            { id: 'a', label: 'long a' },
            { id: 'b', label: 'short a' },
            { id: 'c', label: 'short o' },
          ],
          answerId: 'a',
        },
        {
          id: 'q2',
          question: 'Which is long i?',
          options: [
            { id: 'a', label: 'bit' },
            { id: 'b', label: 'bike' },
            { id: 'c', label: 'bat' },
          ],
          answerId: 'b',
        },
      ]),
    ], 'Magic e 长元音'),

    level('english-2-07', '长元音 o_e / u_e / ee', [
      tapRead('o_e / u_e / ee', [
        { id: 'home', label: 'home', speak: 'home', speakLang: EN, icon: '🏠' },
        { id: 'nose', label: 'nose', speak: 'nose', speakLang: EN, icon: '👃' },
        { id: 'cute', label: 'cute', speak: 'cute', speakLang: EN, icon: '🥰' },
        { id: 'tube', label: 'tube', speak: 'tube', speakLang: EN, icon: '🧪' },
        { id: 'see', label: 'see', speak: 'see', speakLang: EN, icon: '👀' },
        { id: 'tree', label: 'tree', speak: 'tree', speakLang: EN, icon: '🌳' },
        { id: 'bee', label: 'bee', speak: 'bee', speakLang: EN, icon: '🐝' },
      ]),
      blend('拼长元音词', [
        { id: 'b1', parts: ['h', 'o', 'me'], result: 'home', speak: 'home', speakLang: EN },
        { id: 'b2', parts: ['n', 'o', 'se'], result: 'nose', speak: 'nose', speakLang: EN },
        { id: 'b3', parts: ['t', 'r', 'ee'], result: 'tree', speak: 'tree', speakLang: EN },
        { id: 'b4', parts: ['b', 'ee'], result: 'bee', speak: 'bee', speakLang: EN },
      ]),
      listenChoose(
        '听长元音词',
        'tree',
        [
          { id: 'a', label: 'tree' },
          { id: 'b', label: 'try' },
          { id: 'c', label: 'true' },
        ],
        'a',
        { promptLang: EN }
      ),
    ], '更多长元音'),

    level('english-2-08', '拼读小闯关', [
      blend('综合拼读', [
        { id: 'b1', parts: ['c', 'a', 't'], result: 'cat', speak: 'cat', speakLang: EN },
        { id: 'b2', parts: ['sh', 'i', 'p'], result: 'ship', speak: 'ship', speakLang: EN },
        { id: 'b3', parts: ['d', 'u', 'ck'], result: 'duck', speak: 'duck', speakLang: EN },
        { id: 'b4', parts: ['c', 'a', 'ke'], result: 'cake', speak: 'cake', speakLang: EN },
        { id: 'b5', parts: ['b', 'i', 'ke'], result: 'bike', speak: 'bike', speakLang: EN },
      ]),
      quiz('Phonics quiz', [
        {
          id: 'q1',
          question: 'c-a-t →',
          options: [
            { id: 'a', label: 'cat' },
            { id: 'b', label: 'cot' },
            { id: 'c', label: 'cut' },
          ],
          answerId: 'a',
        },
        {
          id: 'q2',
          question: 'Which has sh?',
          options: [
            { id: 'a', label: 'fish' },
            { id: 'b', label: 'fan' },
            { id: 'c', label: 'fit' },
          ],
          answerId: 'a',
        },
        {
          id: 'q3',
          question: 'cake has?',
          options: [
            { id: 'a', label: 'short a' },
            { id: 'b', label: 'long a' },
            { id: 'c', label: 'short e' },
          ],
          answerId: 'b',
        },
      ]),
      dragMatch('词义配对', [
        { id: 'p1', left: 'cat', right: '小猫' },
        { id: 'p2', left: 'ship', right: '船' },
        { id: 'p3', left: 'cake', right: '蛋糕' },
        { id: 'p4', left: 'bike', right: '自行车' },
        { id: 'p5', left: 'tree', right: '树' },
      ]),
    ], '拼读综合练习'),
  ],
  'CVC、digraph 与长元音'
)
