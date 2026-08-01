import type { DinoItem } from '../../engine/types'

/** 恐龙图鉴 · 6 种 */
export const DINOSAURS: DinoItem[] = [
  {
    id: 'trex',
    name: '霸王龙',
    color: '#C0392B',
    era: '白垩纪',
    diet: '肉食',
    length: '约12米，比两辆小汽车还长',
    facts: ['霸王龙的牙齿像香蕉一样大', '它的前爪短短的，只有两根手指', '它是陆地上最厉害的猎手之一'],
  },
  {
    id: 'triceratops',
    name: '三角龙',
    color: '#E67E22',
    era: '白垩纪',
    diet: '植食',
    length: '约9米，像一辆大公交车',
    facts: ['三角龙头上有三只角', '它的脖子后面有一面大骨盾', '它用角来保护自己和朋友'],
  },
  {
    id: 'brachiosaurus',
    name: '腕龙',
    color: '#27AE60',
    era: '侏罗纪',
    diet: '植食',
    length: '约23米，有三层楼那么高',
    facts: ['腕龙前腿比后腿长，像长颈鹿', '它能吃到大树顶上的嫩叶', '它的心脏要大得才能把血送到头上'],
  },
  {
    id: 'stegosaurus',
    name: '剑龙',
    color: '#8E44AD',
    era: '侏罗纪',
    diet: '植食',
    length: '约9米，背上有两排骨板',
    facts: ['剑龙背上的骨板能调节体温', '它的尾巴有四根尖刺', '它的大脑只有核桃那么大'],
  },
  {
    id: 'pterosaur',
    name: '翼龙',
    color: '#2980B9',
    era: '侏罗纪',
    diet: '肉食',
    length: '翅膀展开约6米',
    facts: ['翼龙是会飞的爬行动物，不是恐龙', '它的翅膀是皮膜做的', '有些翼龙比老鹰还大'],
  },
  {
    id: 'raptor',
    name: '迅猛龙',
    color: '#D4AC0D',
    era: '白垩纪',
    diet: '肉食',
    length: '约2米，像一只大火鸡',
    facts: ['迅猛龙跑得像风一样快', '它脚上有一把弯弯的镰刀爪', '科学家发现它身上可能长有羽毛'],
  },
]

export const DINO_MAP: Record<string, DinoItem> = Object.fromEntries(
  DINOSAURS.map((d) => [d.id, d])
)
