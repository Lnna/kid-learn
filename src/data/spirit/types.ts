/** 主课课程精灵 — 类型（与 slime lab 解耦） */

export type PotionColor = 'blue' | 'yellow' | 'green'

export type SpiritPattern = 'solid' | 'stripe' | 'glitter' | 'pearl'

/** 可爱外形（非史莱姆胶体） */
export type SpiritForm = 'droplet' | 'star' | 'sprout' | 'peach' | 'berry' | 'cloud' | 'rainbow'

export type SpiritMood = 'idle' | 'scared' | 'flat' | 'bounceBack' | 'cheer'

export interface SpiritAppearance {
  /** 图鉴 / 展示用中文名 */
  label: string
  /** 图鉴收集键，如 blue / blue-yellow */
  collectKey: string
  primary: string
  secondary: string
  pattern: SpiritPattern
  /** 角色外形 */
  form: SpiritForm
}

export interface SpiritPet {
  id: string
  createdAt: string
  /** 孵化时消耗的药水计数 */
  recipe: Record<PotionColor, number>
  appearance: SpiritAppearance
  name: string
}

export interface SpiritStoreState {
  potions: Record<PotionColor, number>
  spirits: SpiritPet[]
  activeSpiritId?: string
  /** 满星通关累计，喂食消耗 */
  goldenFeed: number
  toolsUnlocked: boolean
  tipSeen: string[]
  /** 去重：`${levelId}|${YYYY-MM-DD}` */
  potionGrants: string[]
}

export interface PotionGrantResult {
  granted: boolean
  color?: PotionColor
  /** 是否因此达到可孵化 */
  canHatch: boolean
}

export interface HatchResult {
  ok: boolean
  spirit?: SpiritPet
  reason?: string
}
