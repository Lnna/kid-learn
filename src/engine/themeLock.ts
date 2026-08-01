import { getItem, setItem } from '../utils/storage'
import { loadProgress } from './progress'
import type { ThemeId } from './types'

const KEY = 'themelock'

/** 穿梭解锁所需星星数（主题合计） */
export const SHUTTLE_STARS = 10

export interface ThemeLockState {
  /** 首次锁定选择的门 */
  chosen?: ThemeId
}

export function loadThemeLock(): ThemeLockState {
  return getItem<ThemeLockState>(KEY, {})
}

export function saveThemeLock(s: ThemeLockState): void {
  setItem(KEY, s)
}

/** 两个主题合计已获星星 */
export function themeTotalStars(): number {
  const p = loadProgress()
  const gem = p.subjects.gem?.totalStars || 0
  const dino = p.subjects.dino?.totalStars || 0
  return gem + dino
}

/** 是否已开启时空穿梭（两门自由进出） */
export function shuttleUnlocked(): boolean {
  return themeTotalStars() >= SHUTTLE_STARS
}

/** 能否进入某扇门 */
export function canEnter(theme: ThemeId): boolean {
  const { chosen } = loadThemeLock()
  if (!chosen) return true
  if (chosen === theme) return true
  return shuttleUnlocked()
}

/** 首次选择并锁定一扇门 */
export function chooseTheme(theme: ThemeId): void {
  const s = loadThemeLock()
  if (!s.chosen) {
    s.chosen = theme
    saveThemeLock(s)
  }
}

export function resetThemeLock(): void {
  saveThemeLock({})
}
