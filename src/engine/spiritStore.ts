import { getItem, setItem } from '../utils/storage'
import {
  appearanceFromRecipe,
  COLLECT_KEYS,
  FEED_TO_UNLOCK,
  formFromCollectKey,
  HATCH_COST,
  SPIRIT_NAMES,
  SUBJECT_POTION,
} from '../data/spirit'
import type {
  HatchResult,
  PotionColor,
  PotionGrantResult,
  SpiritPet,
  SpiritStoreState,
} from '../data/spirit/types'

const KEY = 'spirit'

function todayKey(): string {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function defaultState(): SpiritStoreState {
  return {
    potions: { blue: 0, yellow: 0, green: 0 },
    spirits: [],
    activeSpiritId: undefined,
    goldenFeed: 0,
    toolsUnlocked: false,
    tipSeen: [],
    potionGrants: [],
  }
}

export function loadSpiritStore(): SpiritStoreState {
  const s = getItem<SpiritStoreState>(KEY, defaultState())
  if (!s.potions) s.potions = { blue: 0, yellow: 0, green: 0 }
  s.potions.blue = s.potions.blue || 0
  s.potions.yellow = s.potions.yellow || 0
  s.potions.green = s.potions.green || 0
  if (!Array.isArray(s.spirits)) s.spirits = []
  if (!Array.isArray(s.tipSeen)) s.tipSeen = []
  if (!Array.isArray(s.potionGrants)) s.potionGrants = []
  if (typeof s.goldenFeed !== 'number') s.goldenFeed = 0
  if (typeof s.toolsUnlocked !== 'boolean') s.toolsUnlocked = false
  // 兼容旧存档：按配方/图鉴键刷新可爱卡通外观
  s.spirits = s.spirits.map((p) => {
    const fromRecipe = p.recipe ? appearanceFromRecipe(p.recipe) : null
    const key = fromRecipe?.collectKey || p.appearance?.collectKey || 'blue'
    const meta = COLLECT_KEYS.find((x) => x.key === key)
    const appearance = fromRecipe || {
      label: meta?.label || p.appearance?.label || '小伙伴',
      collectKey: key,
      primary: meta?.primary || p.appearance?.primary || '#4DA3FF',
      secondary: meta?.secondary || p.appearance?.secondary || '#8FC4FF',
      pattern: meta?.pattern || p.appearance?.pattern || 'solid',
      form: meta?.form || formFromCollectKey(key),
    }
    return { ...p, appearance }
  })
  return s
}

export function saveSpiritStore(s: SpiritStoreState): void {
  setItem(KEY, s)
}

export function potionTotal(s?: SpiritStoreState): number {
  const st = s || loadSpiritStore()
  return (st.potions.blue || 0) + (st.potions.yellow || 0) + (st.potions.green || 0)
}

export function canHatch(s?: SpiritStoreState): boolean {
  return potionTotal(s) >= HATCH_COST
}

function grantKey(levelId: string, date = todayKey()): string {
  return `${levelId}|${date}`
}

/**
 * 通关掉落药水：chinese→蓝，math→黄，english→绿。
 * 同一 levelId 当天只掉一次。
 */
export function grantPotion(subjectId: string, levelId: string): PotionGrantResult {
  const color = SUBJECT_POTION[subjectId]
  if (!color || !levelId) return { granted: false, canHatch: canHatch() }

  const s = loadSpiritStore()
  const key = grantKey(levelId)
  if (s.potionGrants.includes(key)) {
    return { granted: false, canHatch: canHatch(s) }
  }

  s.potionGrants.push(key)
  // 防止无限增长：只保留近 60 天量级
  if (s.potionGrants.length > 200) s.potionGrants = s.potionGrants.slice(-120)
  s.potions[color] = (s.potions[color] || 0) + 1
  saveSpiritStore(s)
  return { granted: true, color, canHatch: canHatch(s) }
}

/** 满星通关 +1 黄金饲料（可重复关卡累计） */
export function grantGoldenFeed(stars: number): boolean {
  if (stars < 3) return false
  const s = loadSpiritStore()
  s.goldenFeed += 1
  saveSpiritStore(s)
  return true
}

/**
 * 从库存中取 3 瓶（优先按传入 recipe；否则自动凑齐）。
 * recipe 各色之和须为 HATCH_COST，且不超过库存。
 */
export function hatch(recipe?: Partial<Record<PotionColor, number>>): HatchResult {
  const s = loadSpiritStore()
  if (!canHatch(s)) return { ok: false, reason: '药水不足 3 瓶' }

  const used: Record<PotionColor, number> = { blue: 0, yellow: 0, green: 0 }

  if (recipe) {
    let sum = 0
    ;(['blue', 'yellow', 'green'] as PotionColor[]).forEach((c) => {
      const n = Math.max(0, Math.floor(recipe[c] || 0))
      used[c] = n
      sum += n
    })
    if (sum !== HATCH_COST) return { ok: false, reason: '请正好滴入 3 瓶' }
    for (const c of ['blue', 'yellow', 'green'] as PotionColor[]) {
      if (used[c] > (s.potions[c] || 0)) return { ok: false, reason: '该色药水不够' }
    }
  } else {
    // 自动：按蓝→黄→绿顺序取满 3
    let need = HATCH_COST
    for (const c of ['blue', 'yellow', 'green'] as PotionColor[]) {
      const take = Math.min(s.potions[c] || 0, need)
      used[c] = take
      need -= take
      if (need <= 0) break
    }
    if (need > 0) return { ok: false, reason: '药水不足 3 瓶' }
  }

  ;(['blue', 'yellow', 'green'] as PotionColor[]).forEach((c) => {
    s.potions[c] = (s.potions[c] || 0) - used[c]
  })

  const appearance = appearanceFromRecipe(used)
  const name = SPIRIT_NAMES[s.spirits.length % SPIRIT_NAMES.length]
  const spirit: SpiritPet = {
    id: `spirit-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    createdAt: new Date().toISOString(),
    recipe: used,
    appearance,
    name,
  }
  s.spirits.push(spirit)
  if (!s.activeSpiritId) s.activeSpiritId = spirit.id
  saveSpiritStore(s)
  return { ok: true, spirit }
}

export function getActiveSpirit(): SpiritPet | null {
  const s = loadSpiritStore()
  if (!s.activeSpiritId) return s.spirits[0] || null
  return s.spirits.find((x) => x.id === s.activeSpiritId) || s.spirits[0] || null
}

export function setActiveSpirit(id: string): void {
  const s = loadSpiritStore()
  if (!s.spirits.some((x) => x.id === id)) return
  s.activeSpiritId = id
  saveSpiritStore(s)
}

/** 喂 1 份黄金饲料；达阈值解锁学具 */
export function feedSpirit(amount = 1): { fed: boolean; toolsUnlocked: boolean; remaining: number } {
  const s = loadSpiritStore()
  const n = Math.max(0, Math.floor(amount))
  if (n <= 0 || s.goldenFeed < n) {
    return { fed: false, toolsUnlocked: s.toolsUnlocked, remaining: s.goldenFeed }
  }
  s.goldenFeed -= n
  // 用 tipSeen 累计已喂次数
  const fedKey = 'feed-count'
  const prev = Number(s.tipSeen.find((t) => t.startsWith(fedKey + ':'))?.split(':')[1] || 0)
  const next = prev + n
  s.tipSeen = s.tipSeen.filter((t) => !t.startsWith(fedKey + ':'))
  s.tipSeen.push(`${fedKey}:${next}`)
  if (next >= FEED_TO_UNLOCK) s.toolsUnlocked = true
  saveSpiritStore(s)
  return { fed: true, toolsUnlocked: s.toolsUnlocked, remaining: s.goldenFeed }
}

export function getFeedProgress(): { fed: number; need: number; unlocked: boolean } {
  const s = loadSpiritStore()
  const fed = Number(s.tipSeen.find((t) => t.startsWith('feed-count:'))?.split(':')[1] || 0)
  return { fed, need: FEED_TO_UNLOCK, unlocked: s.toolsUnlocked }
}

export function markTipSeen(id: string): void {
  const s = loadSpiritStore()
  if (!s.tipSeen.includes(id)) {
    s.tipSeen.push(id)
    saveSpiritStore(s)
  }
}

export function collectedAppearanceKeys(): string[] {
  const s = loadSpiritStore()
  return [...new Set(s.spirits.map((sp) => sp.appearance.collectKey))]
}

export function areToolsUnlocked(): boolean {
  return loadSpiritStore().toolsUnlocked
}
