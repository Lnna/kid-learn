import type { VehicleItem } from '../../engine/types'

/** 工程车图鉴 · 8 种（icon 存车种 id，由 VehicleIcon 渲染） */
export const VEHICLE_ITEMS: VehicleItem[] = [
  {
    id: 'excavator',
    name: '挖掘机',
    icon: 'excavator',
    color: '#F5A623',
    function: '挥动大铲斗，挖土又挖沙',
    stat: { label: '铲斗容量', value: 1, unit: '方' },
    facts: [
      '挖掘机的长手臂像大象鼻子一样灵活',
      '它踩着履带走路，泥地里也不会陷进去',
      '它的上半身会转圈圈，不用掉头就能把土装上车',
    ],
  },
  {
    id: 'bulldozer',
    name: '推土机',
    icon: 'bulldozer',
    color: '#E67E22',
    function: '前面大铲刀，把地推平平',
    stat: { label: '铲刀宽度', value: 3, unit: '米' },
    facts: [
      '推土机前面有一面大铲刀，像一块大大的刮板',
      '坑坑洼洼的地面，它推几下就变平了',
      '它的履带像两条大铁链，力气特别大',
    ],
  },
  {
    id: 'crane',
    name: '起重机',
    icon: 'crane',
    color: '#E74C3C',
    function: '长吊臂一举，重物轻轻起',
    stat: { label: '能吊起', value: 50, unit: '吨' },
    facts: [
      '起重机的吊臂能伸得比楼房还高',
      '它用钢丝绳和大吊钩，把重物轻轻吊起来',
      '盖高楼时，塔吊是工地上最高的“巨人”',
    ],
  },
  {
    id: 'dumptruck',
    name: '自卸车',
    icon: 'dumptruck',
    color: '#3498DB',
    function: '车斗一翘，自己倒土',
    stat: { label: '能装', value: 5, unit: '吨' },
    facts: [
      '自卸车的车斗会翘起来，自己把土倒出去',
      '它还有一个名字叫“翻斗车”',
      '它的大轮胎比小朋友还要高',
    ],
  },
  {
    id: 'mixer',
    name: '搅拌车',
    icon: 'mixer',
    color: '#9B59B6',
    function: '大圆筒转呀转，搅拌混凝土',
    stat: { label: '滚筒能装', value: 6, unit: '方' },
    facts: [
      '搅拌车的大圆筒一直转，防止混凝土变硬',
      '它的肚子里装着水泥、沙子和水',
      '到了工地，混凝土从车后的“滑梯”流出来',
    ],
  },
  {
    id: 'roller',
    name: '压路机',
    icon: 'roller',
    color: '#7F8C8D',
    function: '大钢轮滚过去，路面平又实',
    stat: { label: '钢轮重', value: 10, unit: '吨' },
    facts: [
      '压路机前面的大钢轮又重又光滑',
      '它慢慢开过去，坑坑洼洼的路就变平了',
      '有的压路机还会轻轻震动，把路压得更结实',
    ],
  },
  {
    id: 'loader',
    name: '装载机',
    icon: 'loader',
    color: '#27AE60',
    function: '大铲斗一抱，装土装沙快',
    stat: { label: '铲斗容量', value: 3, unit: '方' },
    facts: [
      '装载机的大铲斗像两只大手，一下抱起好多土',
      '它专门负责把土和沙子装进卡车',
      '它的轮胎又大又宽，跑得比挖掘机快多了',
    ],
  },
  {
    id: 'forklift',
    name: '叉车',
    icon: 'forklift',
    color: '#D4AC0D',
    function: '两根钢叉一抬，货箱上架',
    stat: { label: '能举起', value: 3, unit: '吨' },
    facts: [
      '叉车前面有两根钢叉，像一把大叉子',
      '它能举起很重的货箱，轻轻放上高高的货架',
      '仓库和码头里，到处都有它忙碌的身影',
    ],
  },
]

export const VEHICLE_MAP: Record<string, VehicleItem> = Object.fromEntries(
  VEHICLE_ITEMS.map((v) => [v.id, v])
)
