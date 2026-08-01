import type { Subject, SubjectId, ThemeId } from './types'
import { chinese } from '../data/chinese'
import { math } from '../data/math'
import { english } from '../data/english'
import { nature } from '../data/nature'
import { science } from '../data/science'
import { gem } from '../data/gem'
import { dino } from '../data/dino'
import { town } from '../data/town'
import { princess } from '../data/princess'
import { vehicle } from '../data/vehicle'

export const SUBJECTS: Subject[] = [chinese, math, english, nature, science]

export const THEMES: Subject[] = [gem, dino, town, princess, vehicle]

export const THEME_IDS: ThemeId[] = ['gem', 'dino', 'town', 'princess', 'vehicle']

export const SUBJECT_MAP: Record<SubjectId, Subject> = {
  chinese,
  math,
  english,
  nature,
  science,
  gem,
  dino,
  town,
  princess,
  vehicle,
}

export function isTheme(id: SubjectId): id is ThemeId {
  return (THEME_IDS as string[]).includes(id)
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
