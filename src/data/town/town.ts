import type { TownItem } from '../../engine/types'

/** 小镇图鉴 · 12 个建筑与装饰 */
export const TOWN_ITEMS: TownItem[] = [
  {
    id: 'cottage',
    name: '小屋',
    icon: '🏠',
    color: '#FFAB91',
    purpose: '给小镇居民住的温暖的家',
    facts: ['小屋的屋顶大多是三角形，雨水会顺着斜坡滑下来', '有的小屋用木头盖，有的用砖头盖', '窗户是小屋的眼睛，让阳光照进屋里'],
  },
  {
    id: 'tree',
    name: '树木',
    icon: '🌳',
    color: '#81C784',
    purpose: '给小镇遮阴，送来新鲜空气',
    facts: ['大树通过叶子「吃」阳光长大', '树干里一圈年轮代表长大一岁', '一棵大树的树荫下可以坐好多人乘凉'],
  },
  {
    id: 'flowerbed',
    name: '花坛',
    icon: '🌷',
    color: '#F48FB1',
    purpose: '种满鲜花，把小镇打扮得漂漂亮亮',
    facts: ['花坛里的花按颜色排队会更好看', '蜜蜂和蝴蝶最喜欢来花坛做客', '给花浇水最好在早上或傍晚，中午太阳太晒'],
  },
  {
    id: 'mailbox',
    name: '信箱',
    icon: '📮',
    color: '#E57373',
    purpose: '帮大家寄信和收信的小房子',
    facts: ['邮递员每天定时来开信箱取信', '很久以前的信要靠马车和火车送', '给远方的朋友写信，贴上邮票就能寄到'],
  },
  {
    id: 'bakery',
    name: '面包房',
    icon: '🥖',
    color: '#D4A373',
    purpose: '烤出香喷喷面包的地方',
    facts: ['面包放进烤箱前是软软的面团', '酵母是让面团变胖的小帮手', '面包房天还没亮就开始工作啦'],
  },
  {
    id: 'school',
    name: '学校',
    icon: '🏫',
    color: '#64B5F6',
    purpose: '小朋友们学习和做游戏的地方',
    facts: ['学校上课和下课都会打铃', '世界上最早的学校已经有几千年历史了', '学校里不只有教室，还有图书馆和操场'],
  },
  {
    id: 'park',
    name: '公园',
    icon: '🏞️',
    color: '#AED581',
    purpose: '大家散步、玩耍、休息的绿色天地',
    facts: ['公园里的树会帮我们制造新鲜空气', '很多公园里都有滑梯和秋千', '在公园要爱护花草，不能乱踩草坪'],
  },
  {
    id: 'bridge',
    name: '小桥',
    icon: '🌉',
    color: '#90A4AE',
    purpose: '架在河面上，让大家不用游泳就能过河',
    facts: ['拱桥弯弯的，像一道彩虹', '桥洞能让小船从下面钻过去', '中国的赵州桥已经一千四百多岁了'],
  },
  {
    id: 'fountain',
    name: '喷泉',
    icon: '⛲',
    color: '#4DD0E1',
    purpose: '喷出漂亮的水花，给广场带来清凉',
    facts: ['喷泉的水会循环使用，不会浪费', '有的喷泉会跟着音乐跳舞', '冬天太冷时喷泉会休息，防止结冰'],
  },
  {
    id: 'bench',
    name: '长椅',
    icon: '🪑',
    color: '#A1887F',
    purpose: '走累了坐下来休息的地方',
    facts: ['公园的长椅大多朝着风景好的方向', '长椅的木板之间有小缝，雨水不会积在上面', '坐在长椅上可以看书、晒太阳、看鸽子'],
  },
  {
    id: 'streetlamp',
    name: '路灯',
    icon: '💡',
    color: '#FFD54F',
    purpose: '天黑后照亮小路，让大家看清方向',
    facts: ['现在的路灯天黑时会自动亮起来', '很久以前的路灯烧煤气，要人一盏盏点着', '路灯排得整整齐齐，像站岗的士兵'],
  },
  {
    id: 'windmill',
    name: '风车',
    icon: '🌀',
    color: '#B39DDB',
    purpose: '靠风力转动的大家伙，是小镇的地标',
    facts: ['风车靠风力转动，不用电也不用油', '荷兰被称为「风车之国」', '以前人们用风车磨面粉、抽海水'],
  },
]

export const TOWN_MAP: Record<string, TownItem> = Object.fromEntries(
  TOWN_ITEMS.map((t) => [t.id, t])
)
