import type { PotionColor, SpiritAppearance, SpiritForm, SpiritPattern } from './types'

export const POTION_META: Record<
  PotionColor,
  { label: string; emoji: string; hex: string; subjectHint: string }
> = {
  blue: { label: '蓝色药水', emoji: '💧', hex: '#4DA3FF', subjectHint: '语文' },
  yellow: { label: '黄色药水', emoji: '⭐', hex: '#FFC84A', subjectHint: '数学' },
  green: { label: '绿色药水', emoji: '🌱', hex: '#3ECF8E', subjectHint: '英语' },
}

export const SUBJECT_POTION: Partial<Record<string, PotionColor>> = {
  chinese: 'blue',
  math: 'yellow',
  english: 'green',
}

const HEX: Record<PotionColor, string> = {
  blue: '#4DA3FF',
  yellow: '#FFC84A',
  green: '#3ECF8E',
}

const FORM_BY_KEY: Record<string, SpiritForm> = {
  blue: 'droplet',
  yellow: 'star',
  green: 'sprout',
  'blue-yellow': 'peach',
  'blue-green': 'cloud',
  'yellow-green': 'berry',
  rainbow: 'rainbow',
}

/** 图鉴中全部可收集外观键（含混色） */
export const COLLECT_KEYS: {
  key: string
  label: string
  primary: string
  secondary: string
  pattern: SpiritPattern
  form: SpiritForm
}[] = [
  { key: 'blue', label: '蝴蝶结猫咪', primary: '#FFF8EE', secondary: '#FFB6D0', pattern: 'solid', form: 'droplet' },
  { key: 'yellow', label: '闪电豆豆', primary: '#FFE566', secondary: '#FFC84A', pattern: 'solid', form: 'star' },
  { key: 'green', label: '小芽熊', primary: '#B8E986', secondary: '#7FE0B2', pattern: 'solid', form: 'sprout' },
  {
    key: 'blue-yellow',
    label: '蜜桃熊',
    primary: '#FFB6D0',
    secondary: '#FFE08A',
    pattern: 'stripe',
    form: 'peach',
  },
  {
    key: 'blue-green',
    label: '软软兔',
    primary: '#E8F4FF',
    secondary: '#B8E986',
    pattern: 'pearl',
    form: 'cloud',
  },
  {
    key: 'yellow-green',
    label: '草莓熊',
    primary: '#FF6B8A',
    secondary: '#3ECF8E',
    pattern: 'glitter',
    form: 'berry',
  },
  {
    key: 'rainbow',
    label: '彩虹角角',
    primary: '#9B7BFF',
    secondary: '#FFC84A',
    pattern: 'glitter',
    form: 'rainbow',
  },
]

export function formFromCollectKey(key: string): SpiritForm {
  return FORM_BY_KEY[key] || 'droplet'
}

export function appearanceFromRecipe(recipe: Record<PotionColor, number>): SpiritAppearance {
  const b = recipe.blue || 0
  const y = recipe.yellow || 0
  const g = recipe.green || 0
  const total = b + y + g
  const colors: PotionColor[] = []
  if (b > 0) colors.push('blue')
  if (y > 0) colors.push('yellow')
  if (g > 0) colors.push('green')

  if (total === 0 || colors.length === 0) {
    const meta = COLLECT_KEYS[0]
    return {
      label: meta.label,
      collectKey: meta.key,
      primary: meta.primary,
      secondary: meta.secondary,
      pattern: 'solid',
      form: meta.form,
    }
  }

  if (colors.length === 3) {
    const meta = COLLECT_KEYS.find((x) => x.key === 'rainbow')!
    return {
      label: meta.label,
      collectKey: meta.key,
      primary: meta.primary,
      secondary: meta.secondary,
      pattern: meta.pattern,
      form: meta.form,
    }
  }

  if (colors.length === 1) {
    const meta = COLLECT_KEYS.find((x) => x.key === colors[0])!
    return {
      label: meta.label,
      collectKey: meta.key,
      primary: meta.primary,
      secondary: meta.secondary,
      pattern: 'solid',
      form: meta.form,
    }
  }

  const pair = [...colors].sort().join('-')
  const found = COLLECT_KEYS.find((x) => x.key === pair)
  if (found) {
    return {
      label: found.label,
      collectKey: found.key,
      primary: found.primary,
      secondary: found.secondary,
      pattern: found.pattern,
      form: found.form,
    }
  }
  return {
    label: '混色小伙伴',
    collectKey: pair,
    primary: HEX[colors[0]],
    secondary: HEX[colors[1]],
    pattern: 'stripe',
    form: 'peach',
  }
}

export const HATCH_COST = 3

/** 小朋友向昵称（避免果冻/史莱姆感） */
export const SPIRIT_NAMES = ['豆豆', '星星', '芽芽', '桃桃', '云云', '莓莓', '虹虹', '乐乐', '圆圆', '叮叮']
