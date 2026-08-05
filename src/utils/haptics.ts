/** H5 震动封装；不可用时静默失败 */

export function lightTap(): void {
  try {
    // #ifdef H5
    navigator.vibrate?.(10)
    // #endif
    // #ifndef H5
    uni.vibrateShort?.({ type: 'light' })
    // #endif
  } catch {
    /* ignore */
  }
}

/** 搅拌进度 0–1，震动逐渐增强 */
export function stirPulse(progress: number): void {
  const p = Math.max(0, Math.min(1, progress))
  const ms = Math.round(8 + p * 40)
  try {
    // #ifdef H5
    navigator.vibrate?.(ms)
    // #endif
    // #ifndef H5
    uni.vibrateShort?.({ type: p > 0.6 ? 'heavy' : 'medium' })
    // #endif
  } catch {
    /* ignore */
  }
}

/** 按硬度：稀软低频轻震，硬实高频强震 */
export function dragPulse(hardness: '低' | '中' | '高'): void {
  const pattern: number | number[] =
    hardness === '低' ? [12, 40, 12] : hardness === '中' ? [18, 30, 18] : [28, 20, 28, 20, 28]
  try {
    // #ifdef H5
    navigator.vibrate?.(pattern)
    // #endif
    // #ifndef H5
    uni.vibrateShort?.({ type: hardness === '高' ? 'heavy' : 'medium' })
    // #endif
  } catch {
    /* ignore */
  }
}
