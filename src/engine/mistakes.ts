import { getItem, setItem } from '../utils/storage'
import type { ActivityType, ChoiceOption, SubjectId } from './types'

const KEY = 'mistakes'

export type MistakeActivityType = Extract<ActivityType, 'quiz' | 'listen-choose' | 'sequence'>

export interface MistakeItem {
  id: string
  subjectId: SubjectId
  levelId: string
  activityType: MistakeActivityType
  prompt: string
  speak?: string
  options?: ChoiceOption[]
  answerId: string
  answerOrder?: string[]
  wrongCount: number
  /** 体型阶段 0–3 */
  growStage: number
  createdAt: number
  updatedAt: number
}

export interface AddMistakeInput {
  subjectId: SubjectId
  levelId: string
  activityType: MistakeActivityType
  prompt: string
  speak?: string
  options?: ChoiceOption[]
  answerId?: string
  answerOrder?: string[]
}

function loadAll(): MistakeItem[] {
  return getItem<MistakeItem[]>(KEY, [])
}

function saveAll(list: MistakeItem[]): void {
  setItem(KEY, list)
}

function answerKey(answerId: string, answerOrder?: string[]): string {
  if (answerOrder && answerOrder.length) return answerOrder.join('|')
  return answerId
}

function mergeKey(input: {
  subjectId: string
  levelId: string
  prompt: string
  answerId: string
  answerOrder?: string[]
}): string {
  return [input.subjectId, input.levelId, input.prompt, answerKey(input.answerId, input.answerOrder)].join(
    '\u0001'
  )
}

function nextId(): string {
  return `m_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`
}

function bumpStage(stage: number): number {
  return Math.min(3, Math.max(0, stage) + 1)
}

/** 答错写入；同 subject+level+prompt+answer 合并加重 */
export function addMistake(input: AddMistakeInput): MistakeItem | null {
  if (!input.subjectId || !input.levelId || !input.prompt) return null
  const answerId =
    input.answerId || (input.answerOrder && input.answerOrder.length ? input.answerOrder.join('|') : '')
  if (!answerId && !(input.answerOrder && input.answerOrder.length)) return null

  const list = loadAll()
  const key = mergeKey({
    subjectId: input.subjectId,
    levelId: input.levelId,
    prompt: input.prompt,
    answerId,
    answerOrder: input.answerOrder,
  })
  const now = Date.now()
  const existing = list.find(
    (m) =>
      mergeKey({
        subjectId: m.subjectId,
        levelId: m.levelId,
        prompt: m.prompt,
        answerId: m.answerId,
        answerOrder: m.answerOrder,
      }) === key
  )

  if (existing) {
    existing.wrongCount += 1
    existing.growStage = bumpStage(existing.growStage)
    existing.updatedAt = now
    if (input.speak) existing.speak = input.speak
    if (input.options?.length) existing.options = input.options
    if (input.answerOrder?.length) existing.answerOrder = input.answerOrder
    saveAll(list)
    return existing
  }

  const item: MistakeItem = {
    id: nextId(),
    subjectId: input.subjectId,
    levelId: input.levelId,
    activityType: input.activityType,
    prompt: input.prompt,
    speak: input.speak,
    options: input.options,
    answerId,
    answerOrder: input.answerOrder,
    wrongCount: 1,
    growStage: 0,
    createdAt: now,
    updatedAt: now,
  }
  list.push(item)
  saveAll(list)
  return item
}

export function listMistakes(): MistakeItem[] {
  return loadAll().slice().sort((a, b) => b.updatedAt - a.updatedAt)
}

export function countMistakes(): number {
  return loadAll().length
}

export function removeMistake(id: string): boolean {
  const list = loadAll()
  const next = list.filter((m) => m.id !== id)
  if (next.length === list.length) return false
  saveAll(next)
  return true
}

/** 打怪页做错：加重并长大一档（已满级则只加重） */
export function bumpWrong(id: string): MistakeItem | null {
  const list = loadAll()
  const item = list.find((m) => m.id === id)
  if (!item) return null
  item.wrongCount += 1
  item.growStage = bumpStage(item.growStage)
  item.updatedAt = Date.now()
  saveAll(list)
  return item
}

export function getMistake(id: string): MistakeItem | null {
  return loadAll().find((m) => m.id === id) || null
}
