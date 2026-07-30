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

const EN = 'en-US'

export const englishUnit4 = unit(
  'english-4',
  '儿歌阅读',
  [
    level('english-4-01', 'ABC Song', [
      readAlong('ABC Song', 'ABC Song', [
        { id: 'l1', text: 'A B C D E F G,', speak: 'A B C D E F G', speakLang: EN },
        { id: 'l2', text: 'H I J K L M N O P,', speak: 'H I J K L M N O P', speakLang: EN },
        { id: 'l3', text: 'Q R S, T U V,', speak: 'Q R S T U V', speakLang: EN },
        { id: 'l4', text: 'W X Y and Z.', speak: 'W X Y and Z', speakLang: EN },
        { id: 'l5', text: 'Now I know my ABCs,', speak: 'Now I know my ABCs', speakLang: EN },
        { id: 'l6', text: 'Next time wont you sing with me?', speak: 'Next time wont you sing with me', speakLang: EN },
      ]),
      quiz('Song check', [
        {
          id: 'q1',
          question: 'ABC Song 教我们什么？',
          options: [
            { id: 'a', label: '字母表' },
            { id: 'b', label: '加法' },
            { id: 'c', label: '颜色' },
          ],
          answerId: 'a',
        },
        {
          id: 'q2',
          question: 'After Y is?',
          options: [
            { id: 'a', label: 'X' },
            { id: 'b', label: 'Z' },
            { id: 'c', label: 'W' },
          ],
          answerId: 'b',
        },
      ]),
    ], '跟唱字母歌'),

    level('english-4-02', 'Twinkle Twinkle', [
      readAlong('Twinkle Twinkle Little Star', 'Twinkle Twinkle Little Star', [
        { id: 'l1', text: 'Twinkle, twinkle, little star,', speak: 'Twinkle twinkle little star', speakLang: EN },
        { id: 'l2', text: 'How I wonder what you are!', speak: 'How I wonder what you are', speakLang: EN },
        { id: 'l3', text: 'Up above the world so high,', speak: 'Up above the world so high', speakLang: EN },
        { id: 'l4', text: 'Like a diamond in the sky.', speak: 'Like a diamond in the sky', speakLang: EN },
        { id: 'l5', text: 'Twinkle, twinkle, little star,', speak: 'Twinkle twinkle little star', speakLang: EN },
        { id: 'l6', text: 'How I wonder what you are!', speak: 'How I wonder what you are', speakLang: EN },
      ]),
      tapRead('关键词', [
        { id: 'star', label: 'star', speak: 'star', speakLang: EN, icon: '⭐' },
        { id: 'sky', label: 'sky', speak: 'sky', speakLang: EN, icon: '🌌' },
        { id: 'diamond', label: 'diamond', speak: 'diamond', speakLang: EN, icon: '💎' },
      ]),
      quiz('理解小测', [
        {
          id: 'q1',
          question: '这首歌唱的是？',
          options: [
            { id: 'a', label: '小星星' },
            { id: 'b', label: '小猫' },
            { id: 'c', label: '小汽车' },
          ],
          answerId: 'a',
        },
        {
          id: 'q2',
          question: 'Star is like a ___ in the sky.',
          options: [
            { id: 'a', label: 'diamond' },
            { id: 'b', label: 'apple' },
            { id: 'c', label: 'bus' },
          ],
          answerId: 'a',
        },
      ]),
    ], '一闪一闪小星星'),

    level('english-4-03', 'If You Are Happy', [
      readAlong('If You Are Happy', 'If You Are Happy and You Know It', [
        { id: 'l1', text: 'If you are happy and you know it, clap your hands.', speak: 'If you are happy and you know it clap your hands', speakLang: EN },
        { id: 'l2', text: 'If you are happy and you know it, clap your hands.', speak: 'If you are happy and you know it clap your hands', speakLang: EN },
        { id: 'l3', text: 'If you are happy and you know it,', speak: 'If you are happy and you know it', speakLang: EN },
        { id: 'l4', text: 'then your face will surely show it.', speak: 'then your face will surely show it', speakLang: EN },
        { id: 'l5', text: 'If you are happy and you know it, clap your hands.', speak: 'If you are happy and you know it clap your hands', speakLang: EN },
      ]),
      dragMatch('动作配对', [
        { id: 'p1', left: 'clap your hands', right: '拍手' },
        { id: 'p2', left: 'stomp your feet', right: '跺脚' },
        { id: 'p3', left: 'shout hurray', right: '欢呼' },
        { id: 'p4', left: 'happy', right: '开心' },
      ]),
      listenChoose(
        '听关键词',
        'happy',
        [
          { id: 'a', label: 'happy' },
          { id: 'b', label: 'sad' },
          { id: 'c', label: 'angry' },
        ],
        'a',
        { promptLang: EN }
      ),
    ], '如果感到幸福'),

    level('english-4-04', 'Head Shoulders', [
      readAlong('Head Shoulders Knees and Toes', 'Head, Shoulders, Knees and Toes', [
        { id: 'l1', text: 'Head, shoulders, knees and toes, knees and toes.', speak: 'Head shoulders knees and toes knees and toes', speakLang: EN },
        { id: 'l2', text: 'Head, shoulders, knees and toes, knees and toes.', speak: 'Head shoulders knees and toes knees and toes', speakLang: EN },
        { id: 'l3', text: 'And eyes and ears and mouth and nose.', speak: 'And eyes and ears and mouth and nose', speakLang: EN },
        { id: 'l4', text: 'Head, shoulders, knees and toes, knees and toes.', speak: 'Head shoulders knees and toes knees and toes', speakLang: EN },
      ]),
      sequence('Body parts order', [
        {
          id: 's1',
          prompt: 'head → shoulders → knees → toes',
          items: [
            { id: 'h', label: 'head' },
            { id: 's', label: 'shoulders' },
            { id: 'k', label: 'knees' },
            { id: 't', label: 'toes' },
          ],
          answerOrder: ['h', 's', 'k', 't'],
        },
      ]),
      quiz('身体部位', [
        {
          id: 'q1',
          question: 'knees 是？',
          options: [
            { id: 'a', label: '膝盖' },
            { id: 'b', label: '肩膀' },
            { id: 'c', label: '脚趾' },
          ],
          answerId: 'a',
        },
        {
          id: 'q2',
          question: 'We smell with our?',
          options: [
            { id: 'a', label: 'nose' },
            { id: 'b', label: 'toes' },
            { id: 'c', label: 'knees' },
          ],
          answerId: 'a',
        },
      ]),
    ], '头肩膀膝盖脚'),

    level('english-4-05', '短文：My Pet', [
      readAlong('My Pet', 'My Pet', [
        { id: 'l1', text: 'I have a cat.', speak: 'I have a cat', speakLang: EN },
        { id: 'l2', text: 'My cat is small.', speak: 'My cat is small', speakLang: EN },
        { id: 'l3', text: 'It is white and soft.', speak: 'It is white and soft', speakLang: EN },
        { id: 'l4', text: 'I like my cat.', speak: 'I like my cat', speakLang: EN },
        { id: 'l5', text: 'We play every day.', speak: 'We play every day', speakLang: EN },
      ]),
      quiz('阅读理解', [
        {
          id: 'q1',
          question: 'What pet does the child have?',
          options: [
            { id: 'a', label: 'a cat' },
            { id: 'b', label: 'a dog' },
            { id: 'c', label: 'a bird' },
          ],
          answerId: 'a',
        },
        {
          id: 'q2',
          question: 'What color is the cat?',
          options: [
            { id: 'a', label: 'black' },
            { id: 'b', label: 'white' },
            { id: 'c', label: 'brown' },
          ],
          answerId: 'b',
        },
        {
          id: 'q3',
          question: 'Does the child like the cat?',
          options: [
            { id: 'a', label: 'Yes' },
            { id: 'b', label: 'No' },
            { id: 'c', label: 'Maybe' },
          ],
          answerId: 'a',
        },
      ]),
    ], '短文阅读：我的宠物'),

    level('english-4-06', '短文：At School', [
      readAlong('At School', 'At School', [
        { id: 'l1', text: 'I go to school.', speak: 'I go to school', speakLang: EN },
        { id: 'l2', text: 'I see my teacher.', speak: 'I see my teacher', speakLang: EN },
        { id: 'l3', text: 'I see my friends.', speak: 'I see my friends', speakLang: EN },
        { id: 'l4', text: 'We read and write.', speak: 'We read and write', speakLang: EN },
        { id: 'l5', text: 'We sing and play.', speak: 'We sing and play', speakLang: EN },
        { id: 'l6', text: 'School is fun!', speak: 'School is fun', speakLang: EN },
      ]),
      tapRead('学校词汇', [
        { id: 'school', label: 'school', speak: 'school', speakLang: EN, icon: '🏫' },
        { id: 'teacher', label: 'teacher', speak: 'teacher', speakLang: EN, icon: '👩‍🏫' },
        { id: 'friend', label: 'friend', speak: 'friend', speakLang: EN, icon: '👫' },
        { id: 'read', label: 'read', speak: 'read', speakLang: EN, icon: '📖' },
        { id: 'write', label: 'write', speak: 'write', speakLang: EN, icon: '✍️' },
      ]),
      quiz('理解', [
        {
          id: 'q1',
          question: 'Where does the child go?',
          options: [
            { id: 'a', label: 'school' },
            { id: 'b', label: 'zoo' },
            { id: 'c', label: 'beach' },
          ],
          answerId: 'a',
        },
        {
          id: 'q2',
          question: 'School is?',
          options: [
            { id: 'a', label: 'fun' },
            { id: 'b', label: 'sad' },
            { id: 'c', label: 'scary' },
          ],
          answerId: 'a',
        },
      ]),
    ], '短文：在学校'),

    level('english-4-07', '对话：Hello Friend', [
      readAlong('Dialogue', 'Hello, Friend!', [
        { id: 'l1', text: 'Tom: Hello! What is your name?', speak: 'Hello What is your name', speakLang: EN },
        { id: 'l2', text: 'Amy: My name is Amy. Nice to meet you.', speak: 'My name is Amy Nice to meet you', speakLang: EN },
        { id: 'l3', text: 'Tom: Nice to meet you, too.', speak: 'Nice to meet you too', speakLang: EN },
        { id: 'l4', text: 'Amy: Do you like cats?', speak: 'Do you like cats', speakLang: EN },
        { id: 'l5', text: 'Tom: Yes, I do. I like dogs, too.', speak: 'Yes I do I like dogs too', speakLang: EN },
        { id: 'l6', text: 'Amy: Lets play!', speak: 'Lets play', speakLang: EN },
        { id: 'l7', text: 'Tom: OK! Lets go!', speak: 'OK Lets go', speakLang: EN },
      ]),
      quiz('对话理解', [
        {
          id: 'q1',
          question: '女孩叫什么名字？',
          options: [
            { id: 'a', label: 'Amy' },
            { id: 'b', label: 'Tom' },
            { id: 'c', label: 'Ann' },
          ],
          answerId: 'a',
        },
        {
          id: 'q2',
          question: 'Tom likes?',
          options: [
            { id: 'a', label: 'cats and dogs' },
            { id: 'b', label: 'only birds' },
            { id: 'c', label: 'nothing' },
          ],
          answerId: 'a',
        },
        {
          id: 'q3',
          question: 'Nice to meet you 意思是？',
          options: [
            { id: 'a', label: '很高兴认识你' },
            { id: 'b', label: '再见' },
            { id: 'c', label: '对不起' },
          ],
          answerId: 'a',
        },
      ]),
      sequence('对话顺序', [
        {
          id: 's1',
          prompt: '打招呼 → 问名字 → 一起玩',
          items: [
            { id: 'hi', label: 'Hello!' },
            { id: 'name', label: 'What is your name?' },
            { id: 'play', label: 'Lets play!' },
          ],
          answerOrder: ['hi', 'name', 'play'],
        },
      ]),
    ], '情景对话练习'),
  ],
  '儿歌、短文与对话跟读'
)
