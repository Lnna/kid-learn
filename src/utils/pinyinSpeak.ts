/**
 * 拼音教学发音：
 * - 仅 d/t/n/l/f 用本地预录（src/static/audio/pinyin/，体积小）
 * - 其它声母/韵母一律网络 TTS（已准确），不往 static 堆 mp3
 * - 源文件可放 audio/，需要时只同步这 5 个到 src/static/audio/pinyin/
 */

/** 去声调、统一 ü（须在 NFD 去音符之前处理，否则 ü 会变成 u）；教材 ɑ 亦归一为 a */
export function normalizePinyinKey(raw: string): string {
  return raw
    .trim()
    .replace(/ü|Ü|ｖ/g, 'v')
    .replace(/ɑ/g, 'a')
    .normalize('NFD')
    .replace(/u\u0308/gi, 'v')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}

/** 声母 → 呼读用的韵母骨架（再套四声） */
const INITIAL_BASE: Record<string, string> = {
  b: 'bo',
  p: 'po',
  m: 'mo',
  f: 'fo',
  d: 'de',
  t: 'te',
  n: 'ne',
  l: 'le',
  g: 'ge',
  k: 'ke',
  h: 'he',
  j: 'ji',
  q: 'qi',
  x: 'xi',
  zh: 'zhi',
  ch: 'chi',
  sh: 'shi',
  r: 'ri',
  z: 'zi',
  c: 'ci',
  s: 'si',
  y: 'yi',
  w: 'wu',
}

/** 兼容旧查找：声母也算「可识别拼音」 */
const INITIAL: Record<string, string> = { ...INITIAL_BASE }

/** 韵母 → 便于朗读的汉字 */
const FINAL: Record<string, string> = {
  a: '阿',
  o: '喔',
  e: '婀',
  i: '衣',
  u: '乌',
  v: '淤',
  ü: '淤',
  ai: '爱',
  ei: '欸',
  ui: '威',
  ao: '袄',
  ou: '欧',
  iu: '优',
  ie: '耶',
  ve: '约',
  üe: '约',
  er: '儿',
  an: '安',
  en: '恩',
  in: '因',
  un: '温',
  vn: '晕',
  ün: '晕',
  ang: '昂',
  eng: '鞥',
  ing: '英',
  ong: '翁',
  ia: '呀',
  iao: '腰',
  ian: '烟',
  iang: '央',
  iong: '雍',
  ua: '蛙',
  uo: '窝',
  uai: '歪',
  uan: '弯',
  uang: '汪',
  ueng: '翁',
  van: '冤',
  üan: '冤',
}

/** 常见整体认读 / 音节 → 汉字（点读、选项里的带调拼音） */
const SYLLABLE: Record<string, string> = {
  zhi: '知',
  chi: '吃',
  shi: '诗',
  ri: '日',
  zi: '字',
  ci: '词',
  si: '丝',
  yi: '衣',
  wu: '乌',
  yu: '鱼',
  ye: '也',
  yue: '月',
  yuan: '圆',
  yin: '音',
  yun: '云',
  ying: '英',
  ba: '八',
  pa: '怕',
  ma: '妈',
  fa: '发',
  da: '大',
  ta: '他',
  na: '拿',
  la: '拉',
  ga: '嘎',
  ka: '卡',
  ha: '哈',
  bo: '波',
  po: '坡',
  mo: '摸',
  fo: '佛',
  lo: '咯',
  me: '么',
  de: '的',
  te: '特',
  ne: '呢',
  le: '了',
  ge: '个',
  ke: '科',
  he: '喝',
  bi: '笔',
  pi: '皮',
  mi: '米',
  di: '地',
  ti: '体',
  ni: '你',
  li: '里',
  ji: '鸡',
  qi: '七',
  xi: '西',
  bu: '不',
  pu: '普',
  mu: '木',
  fu: '服',
  du: '读',
  tu: '土',
  nu: '努',
  lu: '路',
  gu: '谷',
  ku: '哭',
  hu: '湖',
  nv: '女',
  lv: '绿',
  ju: '句',
  qu: '去',
  xu: '需',
  bai: '白',
  bei: '贝',
  bao: '包',
  ban: '班',
  bang: '帮',
  ben: '本',
  beng: '蹦',
  bing: '冰',
  pai: '排',
  pei: '陪',
  pao: '跑',
  pou: '剖',
  pan: '盘',
  pang: '旁',
  pen: '盆',
  peng: '朋',
  pin: '拼',
  ping: '平',
  mai: '买',
  mei: '美',
  mao: '猫',
  mou: '某',
  man: '慢',
  mang: '忙',
  men: '门',
  meng: '梦',
  min: '民',
  ming: '明',
  fei: '飞',
  fan: '饭',
  fang: '方',
  fen: '分',
  feng: '风',
  dai: '带',
  dei: '得',
  dao: '到',
  dou: '豆',
  dan: '单',
  dang: '当',
  den: '扽',
  deng: '灯',
  dong: '东',
  dia: '嗲',
  diao: '掉',
  diu: '丢',
  die: '爹',
  dian: '点',
  tai: '太',
  tei: '忒',
  tao: '桃',
  tou: '头',
  tan: '谈',
  tang: '糖',
  teng: '疼',
  tong: '同',
  tiao: '条',
  tie: '贴',
  tian: '天',
  nai: '奶',
  nei: '内',
  nao: '脑',
  nou: '耨',
  nan: '南',
  nang: '囊',
  nen: '嫩',
  neng: '能',
  nong: '农',
  niao: '鸟',
  nie: '捏',
  niu: '牛',
  nian: '年',
  niang: '娘',
  ning: '宁',
  lai: '来',
  lei: '累',
  lao: '老',
  lou: '楼',
  lan: '蓝',
  lang: '狼',
  leng: '冷',
  long: '龙',
  lia: '俩',
  liao: '了',
  lie: '列',
  liu: '六',
  lian: '连',
  liang: '两',
  lin: '林',
  ling: '零',
  gai: '该',
  gei: '给',
  gao: '高',
  gou: '狗',
  gan: '干',
  gang: '刚',
  gen: '跟',
  geng: '更',
  gong: '工',
  gua: '瓜',
  guo: '果',
  guai: '乖',
  gui: '贵',
  guan: '关',
  guang: '光',
  gun: '滚',
  kai: '开',
  kei: '剋',
  kao: '考',
  kou: '口',
  kan: '看',
  kang: '康',
  ken: '肯',
  keng: '坑',
  kong: '空',
  kua: '夸',
  kuo: '阔',
  kuai: '快',
  kui: '亏',
  kuan: '宽',
  kuang: '筐',
  kun: '困',
  hai: '海',
  hei: '黑',
  hao: '好',
  hou: '后',
  han: '汉',
  hang: '航',
  hen: '很',
  heng: '横',
  hong: '红',
  hua: '花',
  huo: '火',
  huai: '怀',
  hui: '会',
  huan: '欢',
  huang: '黄',
  hun: '混',
  jia: '家',
  jiao: '叫',
  jie: '街',
  jiu: '九',
  jian: '见',
  jiang: '江',
  jin: '金',
  jing: '京',
  jiong: '窘',
  juan: '卷',
  jue: '决',
  jun: '军',
  qia: '恰',
  qiao: '桥',
  qie: '切',
  qiu: '球',
  qian: '前',
  qiang: '强',
  qin: '亲',
  qing: '青',
  qiong: '穷',
  quan: '全',
  que: '却',
  qun: '群',
  xia: '下',
  xiao: '小',
  xie: '写',
  xiu: '休',
  xian: '先',
  xiang: '想',
  xin: '新',
  xing: '星',
  xiong: '兄',
  xuan: '宣',
  xue: '学',
  xun: '寻',
  zha: '炸',
  zhe: '这',
  zhao: '找',
  zhou: '周',
  zhan: '站',
  zhang: '张',
  zhen: '真',
  zheng: '正',
  zhong: '中',
  zhua: '抓',
  zhuo: '桌',
  zhuai: '拽',
  zhui: '追',
  zhuan: '专',
  zhuang: '装',
  zhun: '准',
  zhu: '住',
  cha: '茶',
  che: '车',
  chao: '朝',
  chou: '抽',
  chan: '产',
  chang: '长',
  chen: '陈',
  cheng: '成',
  chong: '冲',
  chu: '出',
  chua: '欻',
  chuo: '戳',
  chuai: '揣',
  chui: '吹',
  chuan: '穿',
  chuang: '窗',
  chun: '春',
  sha: '沙',
  she: '蛇',
  shao: '少',
  shou: '手',
  shan: '山',
  shang: '上',
  shen: '身',
  sheng: '生',
  shu: '书',
  shua: '刷',
  shuo: '说',
  shuai: '帅',
  shui: '水',
  shuan: '栓',
  shuang: '双',
  shun: '顺',
  re: '热',
  rao: '绕',
  rou: '肉',
  ran: '然',
  rang: '让',
  ren: '人',
  reng: '仍',
  rong: '容',
  ru: '如',
  ruo: '若',
  rui: '瑞',
  ruan: '软',
  run: '润',
  za: '砸',
  ze: '则',
  zai: '在',
  zao: '早',
  zou: '走',
  zan: '咱',
  zang: '脏',
  zen: '怎',
  zeng: '增',
  zong: '总',
  zu: '组',
  zuo: '做',
  zui: '最',
  zuan: '钻',
  zun: '尊',
  ca: '擦',
  ce: '册',
  cai: '才',
  cao: '草',
  cou: '凑',
  can: '参',
  cang: '仓',
  cen: '岑',
  ceng: '层',
  cong: '从',
  cu: '粗',
  cuo: '错',
  cui: '催',
  cuan: '窜',
  cun: '村',
  sa: '撒',
  se: '色',
  sai: '赛',
  sao: '扫',
  sou: '搜',
  san: '三',
  sang: '桑',
  sen: '森',
  seng: '僧',
  song: '松',
  su: '苏',
  suo: '所',
  sui: '岁',
  suan: '算',
  sun: '孙',
  ya: '牙',
  yao: '要',
  you: '有',
  yan: '言',
  yang: '羊',
  yo: '哟',
  yong: '用',
  wa: '娃',
  wo: '我',
  wai: '外',
  wei: '喂',
  wan: '完',
  wang: '王',
  wen: '文',
  weng: '翁',
  a: '阿',
  o: '喔',
  e: '婀',
}

const VOWEL_TONES: Record<string, [string, string, string, string]> = {
  a: ['ā', 'á', 'ǎ', 'à'],
  o: ['ō', 'ó', 'ǒ', 'ò'],
  e: ['ē', 'é', 'ě', 'è'],
  i: ['ī', 'í', 'ǐ', 'ì'],
  u: ['ū', 'ú', 'ǔ', 'ù'],
  v: ['ǖ', 'ǘ', 'ǚ', 'ǜ'],
}

function isKnownPinyinKey(key: string): boolean {
  return key in INITIAL_BASE || key in FINAL || key in SYLLABLE
}

/** 声母/韵母/音节 → 用于套四声的无调骨架；无法识别则 null */
export function toPinyinDrillBase(token: string): string | null {
  const key = normalizePinyinKey(token)
  if (!key || !isKnownPinyinKey(key)) return null
  if (INITIAL_BASE[key]) return INITIAL_BASE[key]
  if (key === 'ü') return 'v'
  return key
}

/** 给无调音节标第 tone 声（1–4） */
export function applyToneToSyllable(base: string, tone: 1 | 2 | 3 | 4): string {
  let s = normalizePinyinKey(base).replace(/ü/g, 'v')
  if (!s) return base
  let idx = -1
  if (s.includes('a')) idx = s.indexOf('a')
  else if (s.includes('o')) idx = s.indexOf('o')
  else if (s.includes('e')) idx = s.indexOf('e')
  else if (s.includes('ui')) idx = s.indexOf('i')
  else if (s.includes('iu')) idx = s.lastIndexOf('u')
  else {
    for (let i = s.length - 1; i >= 0; i--) {
      if (s[i] === 'i' || s[i] === 'u' || s[i] === 'v') {
        idx = i
        break
      }
    }
  }
  if (idx < 0) return s.replace(/v/g, 'ü')
  const v = s[idx]
  const marks = VOWEL_TONES[v]
  if (!marks) return s.replace(/v/g, 'ü')
  return (s.slice(0, idx) + marks[tone - 1] + s.slice(idx + 1)).replace(/v/g, 'ü')
}

/** 返回四声形式，如 e → [ē, é, ě, è]；b → [bō, bó, bǒ, bò] */
export function fourToneSyllables(token: string): string[] | null {
  const base = toPinyinDrillBase(token)
  if (!base) return null
  return ([1, 2, 3, 4] as const).map((t) => applyToneToSyllable(base, t))
}

/** 仅这 5 个用本地预录；其它走网络 TTS */
const PINYIN_LOCAL_AUDIO = new Set(['d', 't', 'n', 'l', 'f'])

/** 本地预录禁止回退 TTS（避免德/特/讷/勒/佛错调） */
export const PINYIN_LOCAL_ONLY = new Set(['d', 't', 'n', 'l', 'f'])

/** 预录文件版本号：换音后改这个，避免线上缓存旧 mp3 */
const PINYIN_AUDIO_VER = '20260806-dtnlf5'

export function isPinyinLocalOnly(token: string): boolean {
  const key = normalizePinyinKey(token)
  return !!key && PINYIN_LOCAL_ONLY.has(key)
}

/** 本地预录 URL；仅 d/t/n/l/f 有文件 */
export function pinyinLocalAudioUrl(token: string): string | null {
  const key = normalizePinyinKey(token)
  if (!key || !PINYIN_LOCAL_AUDIO.has(key)) return null
  const base =
    (typeof import.meta !== 'undefined' &&
      (import.meta as { env?: { BASE_URL?: string } }).env?.BASE_URL) ||
    '/'
  const prefix = base.endsWith('/') ? base : `${base}/`
  return `${prefix}static/audio/pinyin/${key}.mp3?v=${PINYIN_AUDIO_VER}`
}

/** 无预录时的汉字兜底（声调可能不准，仅备用） */
const INITIAL_SPEAK_HAN: Record<string, string> = {
  b: '波',
  p: '坡',
  m: '摸',
  f: '佛',
  d: '德',
  t: '特',
  n: '讷',
  l: '勒',
  g: '哥',
  k: '科',
  h: '喝',
  j: '机',
  q: '七',
  x: '西',
  zh: '知',
  ch: '吃',
  sh: '诗',
  r: '日',
  z: '资',
  c: '疵',
  s: '丝',
  y: '衣',
  w: '乌',
}

/** 韵母/音节 → 一声汉字 */
const FINAL_FIRST_TONE_HAN: Record<string, string> = {
  a: '阿',
  o: '喔',
  e: '婀',
  i: '衣',
  u: '乌',
  v: '淤',
  ü: '淤',
  ai: '哀',
  ei: '欸',
  ui: '威',
  ao: '凹',
  ou: '欧',
  iu: '优',
  ie: '耶',
  ve: '约',
  üe: '约',
  er: '儿',
  an: '安',
  en: '恩',
  in: '因',
  un: '温',
  vn: '晕',
  ün: '晕',
  ang: '肮',
  eng: '鞥',
  ing: '英',
  ong: '翁',
  ia: '呀',
  iao: '腰',
  ian: '烟',
  iang: '央',
  iong: '雍',
  ua: '蛙',
  uo: '窝',
  uai: '歪',
  uan: '弯',
  uang: '汪',
  ueng: '翁',
  van: '冤',
  üan: '冤',
  ba: '八',
  pa: '趴',
  ma: '妈',
  fa: '发',
  da: '搭',
  ta: '他',
  na: '纳',
  la: '拉',
  ga: '嘎',
  ka: '咖',
  ha: '哈',
  bo: '波',
  po: '坡',
  mo: '摸',
  yi: '衣',
  wu: '乌',
  yu: '淤',
  ye: '耶',
  yue: '约',
  yuan: '冤',
  yin: '因',
  yun: '晕',
  ying: '英',
  ya: '呀',
  yao: '腰',
  you: '优',
  yan: '烟',
  yang: '央',
  yong: '雍',
  wa: '蛙',
  wo: '窝',
  wai: '歪',
  wei: '威',
  wan: '弯',
  wang: '汪',
  wen: '温',
  weng: '翁',
  zhi: '知',
  chi: '吃',
  shi: '诗',
  ri: '日',
  zi: '资',
  ci: '疵',
  si: '丝',
  ji: '机',
  qi: '七',
  xi: '西',
  ge: '哥',
  ke: '科',
  he: '喝',
}

/**
 * 点读 TTS 文本：
 * - 声母 → 呼读汉字（波/坡/德…），勿送 bō 给有道（易读成英文）
 * - 韵母/音节 → 一声汉字（阿/婀…）
 */
export function pinyinTtsText(token: string): string | null {
  const key = normalizePinyinKey(token)
  if (!key || !isKnownPinyinKey(key)) return null
  if (INITIAL_SPEAK_HAN[key]) return INITIAL_SPEAK_HAN[key]
  const base = toPinyinDrillBase(token)
  if (!base) return null
  return FINAL_FIRST_TONE_HAN[key] || FINAL_FIRST_TONE_HAN[base] || null
}

/** @deprecated 旧名 */
export function firstToneSpeakHan(token: string): string | null {
  return pinyinTtsText(token)
}

/** 拼音拉丁字（含教材体 ɑ 与组合声调符） */
const PINYIN_LATIN_RE = /[a-zA-ZüÜvɑāáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ\u0300-\u036f]+/g
const PINYIN_LATIN_ONLY_RE = /^[a-zA-ZüÜvɑāáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ\u0300-\u036f]+$/

/** 整段是否为单个可识别拼音 token（声母/韵母/音节） */
export function isPinyinDrillToken(text: string): boolean {
  const t = text.trim()
  if (!t || /\s/.test(t) || /[\u4e00-\u9fff0-9]/.test(t)) return false
  if (!PINYIN_LATIN_ONLY_RE.test(t)) return false
  return toPinyinDrillBase(t) != null
}

/** @deprecated 兼容旧名 */
export function lookupPinyinSpeak(token: string): string | null {
  return pinyinTtsText(token) || toPinyinDrillBase(token)
}

/** 句子/点读里的拼音 → TTS 可读形式 */
export function expandPinyinForSpeech(text: string): string {
  if (!text) return text
  return text.replace(PINYIN_LATIN_RE, (tok) => {
    return pinyinTtsText(tok) || tok
  })
}

/** 整段是否「主要是拼音」（用于强制中文引擎） */
export function isMostlyPinyinLatin(text: string): boolean {
  const t = text.trim()
  if (!t || /[\u4e00-\u9fff]/.test(t)) return false
  const parts = t.match(PINYIN_LATIN_RE)
  if (!parts?.length) return false
  return parts.every((p) => toPinyinDrillBase(p) != null)
}
