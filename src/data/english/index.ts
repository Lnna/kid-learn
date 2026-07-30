import type { Subject } from '../../engine/types'
import { englishUnit1 } from './u1'
import { englishUnit2 } from './u2'
import { englishUnit3 } from './u3'
import { englishUnit4 } from './u4'

export const english: Subject = {
  id: 'english',
  name: '英语',
  emoji: '🔤',
  color: '#4DA3FF',
  mascot: 'owl',
  description: '字母、自然拼读、高频词与儿歌，快乐开启英语启蒙',
  units: [englishUnit1, englishUnit2, englishUnit3, englishUnit4],
}
