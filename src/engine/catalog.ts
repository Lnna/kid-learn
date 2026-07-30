import type { Subject, SubjectId } from './types'
import { chinese } from '../data/chinese'
import { math } from '../data/math'
import { english } from '../data/english'
import { nature } from '../data/nature'
import { science } from '../data/science'

export const SUBJECTS: Subject[] = [chinese, math, english, nature, science]

export const SUBJECT_MAP: Record<SubjectId, Subject> = {
  chinese,
  math,
  english,
  nature,
  science,
}

export function getSubject(id: SubjectId): Subject {
  return SUBJECT_MAP[id]
}

export function getAllLevelIds(subject: Subject): string[] {
  return subject.units.flatMap((u) => u.levels.map((l) => l.id))
}

export function findLevel(subjectId: SubjectId, levelId: string) {
  const subject = getSubject(subjectId)
  for (const unit of subject.units) {
    const level = unit.levels.find((l) => l.id === levelId)
    if (level) return { subject, unit, level }
  }
  return null
}
