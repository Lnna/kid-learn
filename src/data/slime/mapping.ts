import type {
  Additive,
  BaseGlue,
  BoraxDrops,
  LevelLabel,
  PhysicalState,
  SlimeResult,
  SlimeVariables,
} from './types'

export function fingerprint(base: BaseGlue, borax: BoraxDrops, additive: Additive): string {
  return `${base}-${borax}-${additive}`
}

export function parseFingerprint(fp: string): SlimeVariables | null {
  const m = /^(white|clear)-([1-5])-(none|glitter|glow|iron|pearl|fragrance)$/.exec(fp)
  if (!m) return null
  return {
    base: m[1] as BaseGlue,
    borax: Number(m[2]) as BoraxDrops,
    additive: m[3] as Additive,
  }
}

function physicalOf(borax: BoraxDrops): PhysicalState {
  if (borax <= 2) return 'runny'
  if (borax === 3) return 'standard'
  return 'firm'
}

/** Q 弹在中等交联最高；高交联更硬而非更弹 */
function elasticityOf(borax: BoraxDrops): LevelLabel {
  if (borax <= 2) return '低'
  if (borax === 3) return '高'
  if (borax === 4) return '中'
  return '低'
}

function hardnessOf(borax: BoraxDrops): LevelLabel {
  if (borax <= 2) return '低'
  if (borax === 3) return '中'
  return '高'
}

function fluidityOf(borax: BoraxDrops): LevelLabel {
  if (borax <= 2) return '高'
  if (borax === 3) return '中'
  return '低'
}

function colorOf(base: BaseGlue, additive: Additive): string {
  if (additive === 'glow') return base === 'white' ? '#C8E6C9' : '#69F0AE'
  if (additive === 'iron') return base === 'white' ? '#B0BEC5' : '#78909C'
  if (additive === 'pearl') return base === 'white' ? '#F3E5F5' : '#E1BEE7'
  if (additive === 'glitter') return base === 'white' ? '#FFF9C4' : '#80D8FF'
  if (additive === 'fragrance') return base === 'white' ? '#FFE0B2' : '#FFCC80'
  return base === 'white' ? '#FFF8E7' : '#B3E5FC'
}

export function computeResult(vars: SlimeVariables): SlimeResult {
  const { base, borax, additive } = vars
  return {
    base,
    borax,
    additive,
    fingerprint: fingerprint(base, borax, additive),
    transparency: base === 'white' ? '低' : '高',
    physical: physicalOf(borax),
    hardness: hardnessOf(borax),
    elasticity: elasticityOf(borax),
    fluidity: fluidityOf(borax),
    effect: additive,
    color: colorOf(base, additive),
    opaque: base === 'white',
  }
}
