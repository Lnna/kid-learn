import { getItem, setItem } from '../utils/storage'
import { computeResult } from '../data/slime/mapping'
import { findLegendByFingerprint, LEGEND_RECIPES } from '../data/slime/recipes'
import type { MixOutcome, SlimeStoreState, SlimeVariables } from '../data/slime/types'

const KEY = 'slime'

function defaultState(): SlimeStoreState {
  return {
    unlockedLegendIds: [],
    creations: [],
    badges: [],
    tipSeenIds: [],
    guideDone: false,
  }
}

export function loadSlimeStore(): SlimeStoreState {
  const s = getItem<SlimeStoreState>(KEY, defaultState())
  if (!Array.isArray(s.unlockedLegendIds)) s.unlockedLegendIds = []
  if (!Array.isArray(s.creations)) s.creations = []
  if (!Array.isArray(s.badges)) s.badges = []
  if (!Array.isArray(s.tipSeenIds)) s.tipSeenIds = []
  if (typeof s.guideDone !== 'boolean') s.guideDone = false
  return s
}

export function saveSlimeStore(s: SlimeStoreState): void {
  setItem(KEY, s)
}

function addBadge(s: SlimeStoreState, id: string, bag: string[]): void {
  if (!s.badges.includes(id)) {
    s.badges.push(id)
    bag.push(id)
  }
}

function refreshBadges(s: SlimeStoreState, bag: string[]): void {
  const n = s.unlockedLegendIds.length
  if (n >= 1) addBadge(s, 'legend-1', bag)
  if (n >= 5) addBadge(s, 'legend-5', bag)
  if (n >= 10) addBadge(s, 'legend-10', bag)
  if (n >= 20) addBadge(s, 'legend-20', bag)

  const additives = new Set(
    [...s.unlockedLegendIds.map((id) => LEGEND_RECIPES.find((r) => r.id === id)?.additive), ...s.creations.map((c) => c.additive)].filter(
      Boolean
    )
  )
  const specials = ['glitter', 'glow', 'iron', 'pearl', 'fragrance']
  if (specials.every((a) => additives.has(a as never))) addBadge(s, 'all-additives', bag)
}

/** 记录一次合成：传说解锁或写入我的创作 */
export function recordMix(vars: SlimeVariables): MixOutcome {
  const result = computeResult(vars)
  const s = loadSlimeStore()
  const newBadges: string[] = []
  const legend = findLegendByFingerprint(result.fingerprint) || null
  let newlyUnlocked = false
  let tipId: string | null = null

  addBadge(s, 'first-mix', newBadges)

  if (legend) {
    if (!s.unlockedLegendIds.includes(legend.id)) {
      s.unlockedLegendIds.push(legend.id)
      newlyUnlocked = true
      tipId = legend.tipId
      if (!s.tipSeenIds.includes(legend.tipId)) s.tipSeenIds.push(legend.tipId)
    } else {
      tipId = legend.tipId
    }
  } else if (!s.creations.some((c) => c.fingerprint === result.fingerprint)) {
    s.creations.unshift({
      fingerprint: result.fingerprint,
      base: vars.base,
      borax: vars.borax,
      additive: vars.additive,
      createdAt: new Date().toISOString(),
    })
  }

  refreshBadges(s, newBadges)
  saveSlimeStore(s)

  return { result, legend, newlyUnlocked, tipId, newBadges }
}

export function markGuideDone(): void {
  const s = loadSlimeStore()
  s.guideDone = true
  saveSlimeStore(s)
}

export function badgeCount(): number {
  return loadSlimeStore().badges.length
}

export function unlockedLegendCount(): number {
  return loadSlimeStore().unlockedLegendIds.length
}

export const BADGE_LABELS: Record<string, string> = {
  'first-mix': '首次实验',
  'legend-1': '解锁传说',
  'legend-5': '传说收集家×5',
  'legend-10': '传说收集家×10',
  'legend-20': '图鉴大师',
  'all-additives': '添加剂全能',
}
