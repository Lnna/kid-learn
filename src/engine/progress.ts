import { getItem, setItem } from '../utils/storage'
import type { AppProgress, LevelProgress, SubjectId, SubjectProgress } from './types'

const KEY = 'progress'

function emptySubject(): SubjectProgress {
  return { levels: {}, totalStars: 0, studyMinutes: 0 }
}

function defaultProgress(): AppProgress {
  return {
    subjects: {
      chinese: emptySubject(),
      math: emptySubject(),
      english: emptySubject(),
      nature: emptySubject(),
      science: emptySubject(),
    },
    settings: { ttsEnabled: true, sfxEnabled: true },
  }
}

export function loadProgress(): AppProgress {
  return getItem<AppProgress>(KEY, defaultProgress())
}

export function saveProgress(p: AppProgress): void {
  setItem(KEY, p)
}

export function getLevelProgress(subjectId: SubjectId, levelId: string): LevelProgress {
  const p = loadProgress()
  return (
    p.subjects[subjectId]?.levels[levelId] || {
      stars: 0,
      bestStars: 0,
      completed: false,
      attempts: 0,
    }
  )
}

export function recordLevelResult(
  subjectId: SubjectId,
  levelId: string,
  stars: number,
  studySeconds = 0
): AppProgress {
  const p = loadProgress()
  const sub = p.subjects[subjectId] || emptySubject()
  const prev = sub.levels[levelId] || {
    stars: 0,
    bestStars: 0,
    completed: false,
    attempts: 0,
  }
  const best = Math.max(prev.bestStars, stars)
  sub.levels[levelId] = {
    stars,
    bestStars: best,
    completed: true,
    attempts: prev.attempts + 1,
    lastAt: Date.now(),
  }
  sub.totalStars = Object.values(sub.levels).reduce((s, l) => s + l.bestStars, 0)
  sub.studyMinutes += Math.max(1, Math.round(studySeconds / 60))
  p.subjects[subjectId] = sub
  saveProgress(p)
  return p
}

export function isLevelUnlocked(
  subjectId: SubjectId,
  levelIds: string[],
  levelId: string
): boolean {
  const idx = levelIds.indexOf(levelId)
  if (idx <= 0) return true
  const prevId = levelIds[idx - 1]
  return getLevelProgress(subjectId, prevId).completed
}

export function calcStars(correct: number, total: number): number {
  if (total <= 0) return 3
  const ratio = correct / total
  if (ratio >= 0.9) return 3
  if (ratio >= 0.6) return 2
  if (ratio > 0) return 1
  return 1
}

export function updateSettings(partial: Partial<AppProgress['settings']>): AppProgress {
  const p = loadProgress()
  p.settings = { ...p.settings, ...partial }
  saveProgress(p)
  return p
}

export function resetProgress(): AppProgress {
  const p = defaultProgress()
  const cur = loadProgress()
  p.settings = cur.settings
  saveProgress(p)
  return p
}

export function getTotalStars(): number {
  const p = loadProgress()
  return (Object.values(p.subjects) as SubjectProgress[]).reduce((s, sub) => s + sub.totalStars, 0)
}
