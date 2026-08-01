import fs from 'fs'

const path = 'src/data/vehicle/index.ts'
let s = fs.readFileSync(path, 'utf8')

const globalMap = [
  ['🚜', 'excavator'],
  ['🛻', 'bulldozer'],
  ['🏗️', 'crane'],
  ['🏗', 'crane'],
  ['🚛', 'dumptruck'],
  ['🚚', 'mixer'],
  ['📦', 'forklift'],
]
for (const [emoji, id] of globalMap) {
  s = s.split(emoji).join(id)
}

// 🛞: only 压路机 -> roller; keep 轮胎
s = s.replaceAll("label: '压路机', icon: '🛞'", "label: '压路机', icon: 'roller'")
s = s.replaceAll("icon: '🛞', speak: '压路机'", "icon: 'roller', speak: '压路机'")

// 🪣: 装载机 -> loader; keep 铲斗 / 一斗沙
s = s.replaceAll("label: '装载机', icon: '🪣'", "label: '装载机', icon: 'loader'")
s = s.replaceAll("label: '装载机 3方', icon: '🪣'", "label: '装载机 3方', icon: 'loader'")
s = s.replaceAll("icon: '🪣', speak: '装载机'", "icon: 'loader', speak: '装载机'")

fs.writeFileSync(path, s)

const vehicleIds = [
  'excavator',
  'bulldozer',
  'crane',
  'dumptruck',
  'mixer',
  'roller',
  'loader',
  'forklift',
]
for (const id of vehicleIds) {
  const n = (s.match(new RegExp(`'${id}'`, 'g')) || []).length
  console.log(id, n)
}

const leftover = s
  .split('\n')
  .filter((l) => /[🚜🛻🏗🚛🚚📦🛞🪣]/.test(l) && /icon|Icon/.test(l))
console.log('Leftover vehicle-ish emoji icon lines:')
leftover.forEach((l) => console.log(l.trim()))
