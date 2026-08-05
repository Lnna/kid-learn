import { fingerprint } from './mapping'
import type { Additive, BaseGlue, BoraxDrops, LegendRecipe } from './types'

function legend(
  id: string,
  name: string,
  base: BaseGlue,
  borax: BoraxDrops,
  additive: Additive,
  tipId: string
): LegendRecipe {
  return { id, name, base, borax, additive, tipId, fingerprint: fingerprint(base, borax, additive) }
}

/** 20 种传说配方 */
export const LEGEND_RECIPES: LegendRecipe[] = [
  legend('legend-glow-ghost', '夜光幽灵', 'clear', 3, 'glow', 'tip-glow-ghost'),
  legend('legend-galaxy', '银河星云', 'white', 3, 'glitter', 'tip-galaxy'),
  legend('legend-magneto', '万磁王', 'clear', 3, 'iron', 'tip-magneto'),
  legend('legend-firm', '硬实大师', 'clear', 5, 'none', 'tip-firm'),
  legend('legend-tears', '流动之泪', 'clear', 1, 'none', 'tip-tears'),
  legend('legend-pearl-rainbow', '珠光彩虹', 'clear', 3, 'pearl', 'tip-pearl-rainbow'),
  legend('legend-scent-candy', '香氛软糖', 'white', 3, 'fragrance', 'tip-scent-candy'),
  legend('legend-night-meteor', '暗夜流星', 'clear', 2, 'glow', 'tip-night-meteor'),
  legend('legend-armor', '硬核装甲', 'white', 5, 'iron', 'tip-armor'),
  legend('legend-soft-glitter', '闪闪软泥', 'clear', 2, 'glitter', 'tip-soft-glitter'),
  legend('legend-moon-jelly', '月光果冻', 'clear', 4, 'glow', 'tip-moon-jelly'),
  legend('legend-iron-rider', '银河铁骑', 'white', 4, 'iron', 'tip-iron-rider'),
  legend('legend-pearl-fall', '珍珠瀑布', 'clear', 1, 'pearl', 'tip-pearl-fall'),
  legend('legend-scent-ghost', '香气幽灵', 'clear', 3, 'fragrance', 'tip-scent-ghost'),
  legend('legend-star-warrior', '星尘战士', 'white', 5, 'glitter', 'tip-star-warrior'),
  legend('legend-clear-standard', '透明标准体', 'clear', 3, 'none', 'tip-clear-standard'),
  legend('legend-white-standard', '乳白标准体', 'white', 3, 'none', 'tip-white-standard'),
  legend('legend-pearl-armor', '珠光盔甲', 'white', 5, 'pearl', 'tip-pearl-armor'),
  legend('legend-iron-river', '铁屑河流', 'clear', 1, 'iron', 'tip-iron-river'),
  legend('legend-glitter-fort', '闪粉堡垒', 'clear', 5, 'glitter', 'tip-glitter-fort'),
]

export const LEGEND_BY_FINGERPRINT: Record<string, LegendRecipe> = Object.fromEntries(
  LEGEND_RECIPES.map((r) => [r.fingerprint, r])
)

export const LEGEND_BY_ID: Record<string, LegendRecipe> = Object.fromEntries(
  LEGEND_RECIPES.map((r) => [r.id, r])
)

export function findLegendByFingerprint(fp: string): LegendRecipe | undefined {
  return LEGEND_BY_FINGERPRINT[fp]
}
