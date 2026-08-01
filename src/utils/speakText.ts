/** 把题干/算式转成更适合中文 TTS 的朗读文案（轻量，不改关卡数据） */

const DIGIT_ZH = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九']

function numToZh(n: number): string {
  if (!Number.isFinite(n) || n < 0) return String(n)
  if (n <= 10) return n === 10 ? '十' : DIGIT_ZH[n]
  if (n < 20) return `十${n % 10 === 0 ? '' : DIGIT_ZH[n % 10]}`
  if (n < 100) {
    const tens = Math.floor(n / 10)
    const ones = n % 10
    return `${DIGIT_ZH[tens]}十${ones ? DIGIT_ZH[ones] : ''}`
  }
  return String(n)
}

/**
 * 去掉 emoji / 装饰符号，保留可朗读文字。
 * Web Speech / 有道遇到 emoji 常直接失败，必须在送引擎前清干净。
 */
export function stripDecorations(text: string): string {
  return text
    // 扩展绘文字（含多数新 emoji）
    .replace(/\p{Extended_Pictographic}/gu, ' ')
    // ZWJ / 变体选择符 / 肤色修饰
    .replace(/[\u200D\uFE0E\uFE0F\u{1F3FB}-\u{1F3FF}]/gu, '')
    // 杂项符号与箭头区（部分老 emoji）
    .replace(/[\u2600-\u27BF]/g, ' ')
    // 常见装饰字符兜底
    .replace(/[⭐❀✿🌸🍬🎈★☆✦✧◆◇●○■□▲△♥♡]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/** 文本里是否仍含可能搞挂 TTS 的符号 */
export function hasUnsafeSpeakChars(text: string): boolean {
  return /\p{Extended_Pictographic}|[\u2600-\u27BF]/u.test(text)
}

/**
 * 中文数学题朗读：如「3+2=?」→「三加二等于多少」
 * 已是通顺中文则尽量原样保留（仅清装饰、规范算符）。
 * 若清完只剩 emoji，返回空串（调用方勿再回退到原文）。
 */
export function toSpeakText(raw: string): string {
  if (!raw) return ''
  let t = stripDecorations(raw)
  if (!t) return ''

  // 纯英文短词交给原 TTS 逻辑，不改写
  if (/[a-zA-Z]/.test(t) && !/[\u4e00-\u9fff]/.test(t) && !/[+\-−–×÷=＝]/.test(t)) {
    return t
  }

  t = t
    .replace(/[＋+]/g, ' 加 ')
    .replace(/(\d)\s*[-−–]\s*(\d)/g, '$1 减 $2')
    .replace(/[×✖]/g, ' 乘 ')
    .replace(/[÷／]/g, ' 除以 ')
    .replace(/[＝=]\s*[?？]/g, ' 等于 多少')
    .replace(/[＝=]/g, ' 等于 ')
    .replace(/～/g, ' 到 ')
    .replace(/、/g, ' ')

  // 已有「几/多少…」的问句只去掉问号；纯算式才补「多少」
  if (/[几多少什么哪谁怎何]/.test(t)) {
    t = t.replace(/[?？]+/g, '')
  } else {
    t = t.replace(/[?？]+/g, ' 多少')
  }

  t = t.replace(/\d+/g, (m) => numToZh(parseInt(m, 10)))

  return t.replace(/\s+/g, ' ').trim()
}
