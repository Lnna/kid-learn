/**
 * 生成极简 PNG 图标（无需 canvas 依赖）
 * 橙色圆角底 + 中央白色方块作为占位标记
 */
const fs = require('fs')
const path = require('path')
const zlib = require('zlib')

function crc32(buf) {
  let c = ~0
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i]
    for (let k = 0; k < 8; k++) c = c & 1 ? (0xedb88320 ^ (c >>> 1)) : c >>> 1
  }
  return ~c >>> 0
}

function chunk(type, data) {
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length)
  const typeB = Buffer.from(type)
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(Buffer.concat([typeB, data])))
  return Buffer.concat([len, typeB, data, crc])
}

function createPNG(size, file) {
  const raw = Buffer.alloc((size * 4 + 1) * size)
  for (let y = 0; y < size; y++) {
    raw[y * (size * 4 + 1)] = 0
    for (let x = 0; x < size; x++) {
      const i = y * (size * 4 + 1) + 1 + x * 4
      const nx = x / size - 0.5
      const ny = y / size - 0.5
      const r = size * 0.22
      const inRound =
        Math.abs(nx) < 0.5 - r / size ||
        Math.abs(ny) < 0.5 - r / size ||
        (Math.abs(nx) - (0.5 - r / size)) ** 2 + (Math.abs(ny) - (0.5 - r / size)) ** 2 <=
          (r / size) ** 2
      // 中央“衔”用简化的十字/方块表现
      const glyph =
        (Math.abs(nx) < 0.08 && Math.abs(ny) < 0.22) ||
        (Math.abs(ny) < 0.08 && Math.abs(nx) < 0.22) ||
        (ny > 0.05 && ny < 0.28 && Math.abs(nx) < 0.18)
      if (!inRound) {
        raw[i] = 0
        raw[i + 1] = 0
        raw[i + 2] = 0
        raw[i + 3] = 0
      } else if (glyph) {
        raw[i] = 255
        raw[i + 1] = 255
        raw[i + 2] = 255
        raw[i + 3] = 255
      } else {
        raw[i] = 255
        raw[i + 1] = 122
        raw[i + 2] = 89
        raw[i + 3] = 255
      }
    }
  }
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(size, 0)
  ihdr.writeUInt32BE(size, 4)
  ihdr[8] = 8
  ihdr[9] = 6
  const png = Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk('IHDR', ihdr),
    chunk('IDAT', zlib.deflateSync(raw)),
    chunk('IEND', Buffer.alloc(0)),
  ])
  fs.writeFileSync(file, png)
}

const dir = path.join(process.cwd(), 'public', 'icons')
fs.mkdirSync(dir, { recursive: true })
createPNG(192, path.join(dir, 'icon-192.png'))
createPNG(512, path.join(dir, 'icon-512.png'))
console.log('icons ok')
