import {
  tapRead,
  listenChoose,
  dragMatch,
  quiz,
  sequence,
  level,
  unit,
} from '../helpers'

const EN = 'en-US'

export const englishUnit3 = unit(
  'english-3',
  '高频词句',
  [
    level('english-3-01', 'Sight Words 1', [
      tapRead('Sight Words 1', [
        { id: 'i', label: 'I', speak: 'I', speakLang: EN },
        { id: 'a', label: 'a', speak: 'a', speakLang: EN },
        { id: 'the', label: 'the', speak: 'the', speakLang: EN },
        { id: 'is', label: 'is', speak: 'is', speakLang: EN },
        { id: 'am', label: 'am', speak: 'am', speakLang: EN },
        { id: 'to', label: 'to', speak: 'to', speakLang: EN },
        { id: 'and', label: 'and', speak: 'and', speakLang: EN },
        { id: 'you', label: 'you', speak: 'you', speakLang: EN },
      ]),
      listenChoose(
        '听高频词',
        'you',
        [
          { id: 'a', label: 'you' },
          { id: 'b', label: 'yes' },
          { id: 'c', label: 'your' },
        ],
        'a',
        { promptLang: EN }
      ),
      quiz('认词', [
        {
          id: 'q1',
          question: '“我”用英语说？',
          options: [
            { id: 'a', label: 'I' },
            { id: 'b', label: 'you' },
            { id: 'c', label: 'the' },
          ],
          answerId: 'a',
        },
        {
          id: 'q2',
          question: 'I ___ a student.',
          options: [
            { id: 'a', label: 'am' },
            { id: 'b', label: 'is' },
            { id: 'c', label: 'are' },
          ],
          answerId: 'a',
        },
      ]),
    ], '最常用 Sight Words'),

    level('english-3-02', 'Sight Words 2', [
      tapRead('Sight Words 2', [
        { id: 'we', label: 'we', speak: 'we', speakLang: EN },
        { id: 'he', label: 'he', speak: 'he', speakLang: EN },
        { id: 'she', label: 'she', speak: 'she', speakLang: EN },
        { id: 'it', label: 'it', speak: 'it', speakLang: EN },
        { id: 'my', label: 'my', speak: 'my', speakLang: EN },
        { id: 'me', label: 'me', speak: 'me', speakLang: EN },
        { id: 'see', label: 'see', speak: 'see', speakLang: EN },
        { id: 'like', label: 'like', speak: 'like', speakLang: EN },
        { id: 'can', label: 'can', speak: 'can', speakLang: EN },
        { id: 'go', label: 'go', speak: 'go', speakLang: EN },
      ]),
      dragMatch('词义配对', [
        { id: 'p1', left: 'he', right: '他' },
        { id: 'p2', left: 'she', right: '她' },
        { id: 'p3', left: 'we', right: '我们' },
        { id: 'p4', left: 'like', right: '喜欢' },
        { id: 'p5', left: 'can', right: '能 / 可以' },
      ]),
      quiz('填空', [
        {
          id: 'q1',
          question: '___ is a girl. (她)',
          options: [
            { id: 'a', label: 'He' },
            { id: 'b', label: 'She' },
            { id: 'c', label: 'It' },
          ],
          answerId: 'b',
        },
        {
          id: 'q2',
          question: 'I ___ run.',
          options: [
            { id: 'a', label: 'can' },
            { id: 'b', label: 'she' },
            { id: 'c', label: 'the' },
          ],
          answerId: 'a',
        },
      ]),
    ], '更多 Sight Words'),

    level('english-3-03', '颜色与数字', [
      tapRead('Colors', [
        { id: 'red', label: 'red', speak: 'red', speakLang: EN, icon: '🔴' },
        { id: 'blue', label: 'blue', speak: 'blue', speakLang: EN, icon: '🔵' },
        { id: 'green', label: 'green', speak: 'green', speakLang: EN, icon: '🟢' },
        { id: 'yellow', label: 'yellow', speak: 'yellow', speakLang: EN, icon: '🟡' },
        { id: 'orange', label: 'orange', speak: 'orange', speakLang: EN, icon: '🟠' },
        { id: 'pink', label: 'pink', speak: 'pink', speakLang: EN, icon: '🩷' },
        { id: 'black', label: 'black', speak: 'black', speakLang: EN, icon: '⚫' },
        { id: 'white', label: 'white', speak: 'white', speakLang: EN, icon: '⚪' },
      ]),
      tapRead('Numbers 1-10', [
        { id: '1', label: 'one', speak: 'one', speakLang: EN, icon: '1️⃣' },
        { id: '2', label: 'two', speak: 'two', speakLang: EN, icon: '2️⃣' },
        { id: '3', label: 'three', speak: 'three', speakLang: EN, icon: '3️⃣' },
        { id: '4', label: 'four', speak: 'four', speakLang: EN, icon: '4️⃣' },
        { id: '5', label: 'five', speak: 'five', speakLang: EN, icon: '5️⃣' },
        { id: '6', label: 'six', speak: 'six', speakLang: EN, icon: '6️⃣' },
        { id: '7', label: 'seven', speak: 'seven', speakLang: EN, icon: '7️⃣' },
        { id: '8', label: 'eight', speak: 'eight', speakLang: EN, icon: '8️⃣' },
        { id: '9', label: 'nine', speak: 'nine', speakLang: EN, icon: '9️⃣' },
        { id: '10', label: 'ten', speak: 'ten', speakLang: EN, icon: '🔟' },
      ]),
      listenChoose(
        '听颜色',
        'green',
        [
          { id: 'a', label: 'red' },
          { id: 'b', label: 'green' },
          { id: 'c', label: 'blue' },
        ],
        'b',
        { promptLang: EN }
      ),
    ], '颜色和 1-10'),

    level('english-3-04', '动物与食物', [
      tapRead('Animals', [
        { id: 'cat', label: 'cat', speak: 'cat', speakLang: EN, icon: '🐱' },
        { id: 'dog', label: 'dog', speak: 'dog', speakLang: EN, icon: '🐶' },
        { id: 'bird', label: 'bird', speak: 'bird', speakLang: EN, icon: '🐦' },
        { id: 'fish', label: 'fish', speak: 'fish', speakLang: EN, icon: '🐟' },
        { id: 'rabbit', label: 'rabbit', speak: 'rabbit', speakLang: EN, icon: '🐰' },
        { id: 'bear', label: 'bear', speak: 'bear', speakLang: EN, icon: '🐻' },
      ]),
      tapRead('Food', [
        { id: 'apple', label: 'apple', speak: 'apple', speakLang: EN, icon: '🍎' },
        { id: 'banana', label: 'banana', speak: 'banana', speakLang: EN, icon: '🍌' },
        { id: 'milk', label: 'milk', speak: 'milk', speakLang: EN, icon: '🥛' },
        { id: 'bread', label: 'bread', speak: 'bread', speakLang: EN, icon: '🍞' },
        { id: 'egg', label: 'egg', speak: 'egg', speakLang: EN, icon: '🥚' },
        { id: 'water', label: 'water', speak: 'water', speakLang: EN, icon: '💧' },
      ]),
      dragMatch('Word and picture', [
        { id: 'p1', left: 'dog', right: '狗' },
        { id: 'p2', left: 'apple', right: '苹果' },
        { id: 'p3', left: 'bird', right: '鸟' },
        { id: 'p4', left: 'milk', right: '牛奶' },
        { id: 'p5', left: 'fish', right: '鱼' },
      ]),
    ], '动物与食物词汇'),

    level('english-3-05', '家庭与身体', [
      tapRead('Family', [
        { id: 'mom', label: 'mom', speak: 'mom', speakLang: EN, icon: '👩' },
        { id: 'dad', label: 'dad', speak: 'dad', speakLang: EN, icon: '👨' },
        { id: 'sister', label: 'sister', speak: 'sister', speakLang: EN, icon: '👧' },
        { id: 'brother', label: 'brother', speak: 'brother', speakLang: EN, icon: '👦' },
        { id: 'baby', label: 'baby', speak: 'baby', speakLang: EN, icon: '👶' },
      ]),
      tapRead('Body', [
        { id: 'head', label: 'head', speak: 'head', speakLang: EN, icon: '🗣️' },
        { id: 'eye', label: 'eye', speak: 'eye', speakLang: EN, icon: '👁️' },
        { id: 'ear', label: 'ear', speak: 'ear', speakLang: EN, icon: '👂' },
        { id: 'hand', label: 'hand', speak: 'hand', speakLang: EN, icon: '✋' },
        { id: 'foot', label: 'foot', speak: 'foot', speakLang: EN, icon: '🦶' },
        { id: 'nose', label: 'nose', speak: 'nose', speakLang: EN, icon: '👃' },
      ]),
      quiz('选词', [
        {
          id: 'q1',
          question: '妈妈是？',
          options: [
            { id: 'a', label: 'mom' },
            { id: 'b', label: 'dad' },
            { id: 'c', label: 'baby' },
          ],
          answerId: 'a',
        },
        {
          id: 'q2',
          question: 'We see with our?',
          options: [
            { id: 'a', label: 'eyes' },
            { id: 'b', label: 'ears' },
            { id: 'c', label: 'feet' },
          ],
          answerId: 'a',
        },
      ]),
    ], '家庭与身体部位'),

    level('english-3-06', '常用句型', [
      tapRead('Useful sentences', [
        { id: 's1', label: 'Hello!', speak: 'Hello', speakLang: EN, subLabel: '你好' },
        { id: 's2', label: 'How are you?', speak: 'How are you', speakLang: EN, subLabel: '你好吗' },
        { id: 's3', label: 'I am fine.', speak: 'I am fine', speakLang: EN, subLabel: '我很好' },
        { id: 's4', label: 'Thank you!', speak: 'Thank you', speakLang: EN, subLabel: '谢谢' },
        { id: 's5', label: 'Nice to meet you.', speak: 'Nice to meet you', speakLang: EN, subLabel: '很高兴认识你' },
      ]),
      sequence('Greeting order', [
        {
          id: 's1',
          prompt: 'Hello → How are you → I am fine',
          items: [
            { id: 'h', label: 'Hello!' },
            { id: 'q', label: 'How are you?' },
            { id: 'a', label: 'I am fine.' },
          ],
          answerOrder: ['h', 'q', 'a'],
        },
      ]),
      listenChoose(
        '听句子',
        'Thank you',
        [
          { id: 'a', label: 'Thank you!' },
          { id: 'b', label: 'Hello!' },
          { id: 'c', label: 'Goodbye!' },
        ],
        'a',
        { promptLang: EN }
      ),
    ], '打招呼与礼貌用语'),

    level('english-3-07', 'I like / I can', [
      tapRead('句型：I like', [
        { id: 'l1', label: 'I like apples.', speak: 'I like apples', speakLang: EN, icon: '🍎' },
        { id: 'l2', label: 'I like cats.', speak: 'I like cats', speakLang: EN, icon: '🐱' },
        { id: 'l3', label: 'I like red.', speak: 'I like red', speakLang: EN, icon: '🔴' },
      ]),
      tapRead('句型：I can', [
        { id: 'c1', label: 'I can run.', speak: 'I can run', speakLang: EN, icon: '🏃' },
        { id: 'c2', label: 'I can jump.', speak: 'I can jump', speakLang: EN, icon: '🦘' },
        { id: 'c3', label: 'I can sing.', speak: 'I can sing', speakLang: EN, icon: '🎤' },
      ]),
      quiz('选正确句子', [
        {
          id: 'q1',
          question: '表达“我喜欢狗”',
          options: [
            { id: 'a', label: 'I like dogs.' },
            { id: 'b', label: 'I am dogs.' },
            { id: 'c', label: 'Dogs like I.' },
          ],
          answerId: 'a',
        },
        {
          id: 'q2',
          question: '“我会游泳”',
          options: [
            { id: 'a', label: 'I can swim.' },
            { id: 'b', label: 'I swim can.' },
            { id: 'c', label: 'Can I swimming.' },
          ],
          answerId: 'a',
        },
        {
          id: 'q3',
          question: 'This is ___ apple.',
          options: [
            { id: 'a', label: 'a' },
            { id: 'b', label: 'an' },
            { id: 'c', label: 'the the' },
          ],
          answerId: 'b',
        },
      ]),
    ], 'I like / I can 句型'),
  ],
  'Sight Words、主题词汇与句型'
)
