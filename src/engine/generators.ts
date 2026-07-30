import type { QuizItem, ChoiceOption } from './types'

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function uid(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`
}

/** 生成加减法口算题 */
export function genAddSub(
  min: number,
  max: number,
  ops: Array<'+' | '-'> = ['+', '-'],
  count = 6
): QuizItem[] {
  const items: QuizItem[] = []
  for (let i = 0; i < count; i++) {
    const op = ops[Math.floor(Math.random() * ops.length)]
    let a = min + Math.floor(Math.random() * (max - min + 1))
    let b = min + Math.floor(Math.random() * (max - min + 1))
    if (op === '-' && a < b) [a, b] = [b, a]
    if (op === '+' && a + b > max * 2) b = Math.max(0, max - a)
    const answer = op === '+' ? a + b : a - b
    const wrongs = new Set<number>()
    while (wrongs.size < 3) {
      const w = answer + (Math.floor(Math.random() * 7) - 3)
      if (w !== answer && w >= 0) wrongs.add(w)
    }
    const options: ChoiceOption[] = shuffle([
      { id: 'a', label: String(answer) },
      ...[...wrongs].slice(0, 3).map((w, idx) => ({ id: `w${idx}`, label: String(w) })),
    ])
    const answerId = options.find((o) => o.label === String(answer))!.id
    items.push({
      id: uid('q'),
      question: `${a} ${op} ${b} = ?`,
      options,
      answerId,
      speak: `${a} ${op === '+' ? '加' : '减'} ${b} 等于多少`,
    })
  }
  return items
}

/** 生成数物对应题：数几个苹果 */
export function genCountQuiz(max = 10, count = 5): QuizItem[] {
  const icons = ['🍎', '⭐', '🎈', '🍓', '🐟', '🌸', '🍬', '🦋']
  const items: QuizItem[] = []
  for (let i = 0; i < count; i++) {
    const n = 1 + Math.floor(Math.random() * max)
    const icon = icons[i % icons.length]
    const wrongs = new Set<number>()
    while (wrongs.size < 3) {
      const w = 1 + Math.floor(Math.random() * max)
      if (w !== n) wrongs.add(w)
    }
    const options = shuffle([
      { id: 'a', label: String(n) },
      ...[...wrongs].map((w, idx) => ({ id: `w${idx}`, label: String(w) })),
    ])
    items.push({
      id: uid('c'),
      question: `${icon.repeat(n)}\n一共有几个？`,
      options,
      answerId: options.find((o) => o.label === String(n))!.id,
      speak: `数一数，一共有几个`,
    })
  }
  return items
}

/** 比较大小 */
export function genCompare(max = 20, count = 5): QuizItem[] {
  const items: QuizItem[] = []
  for (let i = 0; i < count; i++) {
    let a = 1 + Math.floor(Math.random() * max)
    let b = 1 + Math.floor(Math.random() * max)
    if (a === b) b = (b % max) + 1
    const bigger = Math.max(a, b)
    const options = shuffle([
      { id: 'a', label: String(a) },
      { id: 'b', label: String(b) },
    ])
    items.push({
      id: uid('cmp'),
      question: `${a} 和 ${b}，哪个更大？`,
      options,
      answerId: options.find((o) => o.label === String(bigger))!.id,
      speak: `${a} 和 ${b}，哪个更大`,
    })
  }
  return items
}

/** 找规律：数字序列下一格 */
export function genPattern(count = 5): QuizItem[] {
  const items: QuizItem[] = []
  for (let i = 0; i < count; i++) {
    const start = 1 + Math.floor(Math.random() * 5)
    const step = 1 + Math.floor(Math.random() * 3)
    const seq = [start, start + step, start + step * 2, start + step * 3]
    const answer = start + step * 4
    const wrongs = [answer + 1, answer - 1, answer + step]
    const options = shuffle([
      { id: 'a', label: String(answer) },
      ...wrongs.map((w, idx) => ({ id: `w${idx}`, label: String(w) })),
    ])
    items.push({
      id: uid('pat'),
      question: `${seq.join('、')}、？\n下一个数是多少？`,
      options,
      answerId: options.find((o) => o.label === String(answer))!.id,
      speak: '找规律，下一个数是多少',
    })
  }
  return items
}

/** 10 的分与合 */
export function genSplit10(count = 6): QuizItem[] {
  const items: QuizItem[] = []
  for (let i = 0; i < count; i++) {
    const a = Math.floor(Math.random() * 11)
    const b = 10 - a
    const mode = Math.random() > 0.5
    if (mode) {
      const options = shuffle([
        { id: 'a', label: String(b) },
        { id: 'w1', label: String((b + 1) % 11) },
        { id: 'w2', label: String((b + 2) % 11) },
        { id: 'w3', label: String(Math.abs(b - 2)) },
      ])
      items.push({
        id: uid('sp'),
        question: `10 = ${a} + ?`,
        options,
        answerId: options.find((o) => o.label === String(b))!.id,
        speak: `10 可以分成 ${a} 和几`,
      })
    } else {
      const options = shuffle([
        { id: 'a', label: '10' },
        { id: 'w1', label: String(a + b + 1) },
        { id: 'w2', label: String(Math.max(0, a + b - 1)) },
        { id: 'w3', label: String(a) },
      ])
      items.push({
        id: uid('sp'),
        question: `${a} + ${b} = ?`,
        options,
        answerId: options.find((o) => o.label === '10')!.id,
        speak: `${a} 加 ${b} 等于多少`,
      })
    }
  }
  return items
}
