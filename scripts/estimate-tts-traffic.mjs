import fs from 'node:fs'
import path from 'node:path'

function walk(dir, acc = []) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name)
    const st = fs.statSync(p)
    if (st.isDirectory()) walk(p, acc)
    else if (/\.ts$/.test(name)) acc.push(p)
  }
  return acc
}

const files = walk('src/data')
const texts = new Set()
const re = /\b(?:speak|promptSpeak)\s*:\s*['"]([^'"]+)['"]/g

let raw = 0
for (const f of files) {
  const c = fs.readFileSync(f, 'utf8')
  let m
  while ((m = re.exec(c))) {
    raw++
    const t = m[1].trim()
    if (t) texts.add(t)
  }
}

// 运行时还会播结论/反馈短句（代码里写死的），粗算加一档
const runtimeExtras = [
  '沉下去了',
  '浮起来了',
  '吸住了，这是金属',
  '吸不住哦',
  '声音是振动产生的',
  '挖到一根腿骨化石',
]
for (const t of runtimeExtras) texts.add(t)

const arr = [...texts]
const lens = arr.map((t) => [...t].length)
const sumChars = lens.reduce((a, b) => a + b, 0)
const avg = sumChars / arr.length
const sorted = [...lens].sort((a, b) => a - b)
const p50 = sorted[Math.floor(sorted.length * 0.5)]
const p90 = sorted[Math.floor(sorted.length * 0.9)]

// 实测标定：2字=10368B，8字=23328B → size ≈ 6048 + 2160×字数
const overhead = 6048
const perChar = 2160
let modelBytes = 0
for (const t of arr) modelBytes += overhead + perChar * [...t].length

const withRuntime = modelBytes * 1.2 // 代码内反馈短句、选项朗读等
const noCache15 = withRuntime * 1.5
const cloud2x = withRuntime * 2 // 云函数拉百度 + 回传用户

console.log(
  JSON.stringify(
    {
      dataFiles: files.length,
      speakFieldHits: raw,
      uniqueSpeakTexts: arr.length,
      totalChars: sumChars,
      avgChars: Number(avg.toFixed(1)),
      p50Chars: p50,
      p90Chars: p90,
      maxChars: sorted[sorted.length - 1],
      calibratedModel: '6048 + 2160*chars (from live /api/tts)',
      onePlayerFullClear_MB: {
        proxyToUser_withCache: Number((withRuntime / 1048576).toFixed(2)),
        proxyToUser_noCache_1_5xReplay: Number((noCache15 / 1048576).toFixed(2)),
        cloudFunction_pullPlusPush: Number((cloud2x / 1048576).toFixed(2)),
      },
    },
    null,
    2
  )
)
