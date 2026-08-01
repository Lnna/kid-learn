import type { PrincessItem } from '../../engine/types'

/** 公主图鉴 · 6 位（公版童话原创形象） */
export const PRINCESS_ITEMS: PrincessItem[] = [
  {
    id: 'cinderella',
    name: '灰姑娘',
    color: '#64B5F6',
    story: '善良的姑娘在仙女的帮助下参加舞会，午夜钟声敲响时匆匆离开，落下一只水晶鞋。',
    quality: '善良',
    facts: [
      '灰姑娘的故事在全世界有几百个版本',
      '最早的灰姑娘故事一千多年前就有了',
      '水晶鞋在最早的故事里其实是毛皮做的',
    ],
  },
  {
    id: 'mermaid',
    name: '小美人鱼',
    color: '#4DD0E1',
    story: '海底的小人鱼公主救了落水的王子，用勇气和善良追寻自己的梦想。',
    quality: '勇敢',
    facts: [
      '小美人鱼的故事出自安徒生童话',
      '丹麦海边有一座小美人鱼的雕像',
      '真正的美人鱼传说在世界各地流传了几千年',
    ],
  },
  {
    id: 'snowwhite',
    name: '白雪公主',
    color: '#EF5350',
    story: '皮肤像雪一样白的公主，用真诚赢得了七个小矮人和森林动物的友谊。',
    quality: '真诚',
    facts: [
      '白雪公主的故事收录在《格林童话》里',
      '故事里的七个小矮人每天去山里采矿',
      '红苹果在童话里常常代表诱惑与考验',
    ],
  },
  {
    id: 'rapunzel',
    name: '长发公主',
    color: '#F9A825',
    story: '住在高塔上的姑娘有一头金色长发，她用乐观和智慧走出高塔看世界。',
    quality: '乐观',
    facts: [
      '长发公主的故事也收录在《格林童话》里',
      '她的名字来自一种可以吃的野菜',
'人的头发大约有十万根，每天还会长长一点点',
    ],
  },
  {
    id: 'aurora',
    name: '睡美人',
    color: '#BA68C8',
    story: '被魔法沉睡的公主，因为大家的守护与希望，在百年后醒来。',
    quality: '希望',
    facts: [
      '睡美人的故事有法国和德国两个版本',
      '故事里整个城堡的人和公主一起睡着了',
      '科学家说睡个好觉能让我们长得更高更聪明',
    ],
  },
  {
    id: 'belle',
    name: '贝儿',
    color: '#FDD835',
    story: '爱读书的姑娘用真诚的心看到了野兽外表下的善良，化解了魔法。',
    quality: '好学',
    facts: [
      '贝儿的故事来自法国童话《美女与野兽》',
      '故事告诉我们不能只看外表判断一个人',
      '贝儿最喜欢的事情是读书，书能带人去任何地方',
    ],
  },
]

export const PRINCESS_MAP: Record<string, PrincessItem> = Object.fromEntries(
  PRINCESS_ITEMS.map((p) => [p.id, p])
)
