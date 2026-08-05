import { getItem, setItem } from '../utils/storage'
import type { CollectionState, ThemeId } from './types'

const KEY = 'collection'

const THEME_KEYS: ThemeId[] = ['gem', 'dino', 'town', 'princess', 'vehicle', 'slime']

function defaultState(): CollectionState {
  return { unlocked: { gem: [], dino: [], town: [], princess: [], vehicle: [], slime: [] } }
}

export function loadCollection(): CollectionState {
  const s = getItem<CollectionState>(KEY, defaultState())
  if (!s.unlocked) s.unlocked = defaultState().unlocked
  THEME_KEYS.forEach((t) => {
    if (!Array.isArray(s.unlocked[t])) s.unlocked[t] = []
  })
  return s
}

export function saveCollection(s: CollectionState): void {
  setItem(KEY, s)
}

/** 解锁图鉴，返回本次新解锁的 id */
export function unlockItems(theme: ThemeId, ids: string[]): string[] {
  if (!ids.length) return []
  const s = loadCollection()
  const cur = s.unlocked[theme]
  const fresh = ids.filter((id) => !cur.includes(id))
  if (fresh.length) {
    s.unlocked[theme] = [...cur, ...fresh]
    saveCollection(s)
  }
  return fresh
}

export function getUnlocked(theme: ThemeId): string[] {
  return loadCollection().unlocked[theme]
}

export function isUnlocked(theme: ThemeId, id: string): boolean {
  return getUnlocked(theme).includes(id)
}

export function resetCollection(): void {
  saveCollection(defaultState())
}
