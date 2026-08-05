/** 史莱姆实验室变量与结果类型 */

export type BaseGlue = 'white' | 'clear'
export type BoraxDrops = 1 | 2 | 3 | 4 | 5
export type Additive = 'none' | 'glitter' | 'glow' | 'iron' | 'pearl' | 'fragrance'

export type PhysicalState = 'runny' | 'standard' | 'firm'
export type LevelLabel = '低' | '中' | '高'

export interface SlimeVariables {
  base: BaseGlue
  borax: BoraxDrops
  additive: Additive
}

export interface SlimeResult extends Omit<SlimeVariables, never> {
  fingerprint: string
  transparency: LevelLabel
  physical: PhysicalState
  hardness: LevelLabel
  elasticity: LevelLabel
  fluidity: LevelLabel
  effect: Additive
  /** CSS 主色 */
  color: string
  /** 是否偏不透明 */
  opaque: boolean
}

export interface LegendRecipe {
  id: string
  name: string
  base: BaseGlue
  borax: BoraxDrops
  additive: Additive
  tipId: string
  fingerprint: string
}

export interface SlimeCreation {
  fingerprint: string
  base: BaseGlue
  borax: BoraxDrops
  additive: Additive
  createdAt: string
}

export interface SlimeStoreState {
  unlockedLegendIds: string[]
  creations: SlimeCreation[]
  badges: string[]
  tipSeenIds: string[]
  guideDone: boolean
}

export interface MixOutcome {
  result: SlimeResult
  legend: LegendRecipe | null
  newlyUnlocked: boolean
  tipId: string | null
  newBadges: string[]
}

export const BASE_LABELS: Record<BaseGlue, string> = {
  white: '白胶',
  clear: '透明胶水',
}

export const ADDITIVE_LABELS: Record<Additive, string> = {
  none: '无',
  glitter: '闪粉',
  glow: '夜光粉',
  iron: '铁粉',
  pearl: '珠光粉',
  fragrance: '香精',
}

export const PHYSICAL_LABELS: Record<PhysicalState, string> = {
  runny: '稀软',
  standard: '标准',
  firm: '硬实',
}
