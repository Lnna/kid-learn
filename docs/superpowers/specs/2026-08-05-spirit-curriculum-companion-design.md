# 史莱姆课程精灵（主课伴侣）— 设计规格

**日期：** 2026-08-05  
**状态：** 已锁定并实施  
**一期：** 药水掉落 → 孵化小精灵 → 答错安慰  
**二期：** 满星黄金饲料 → 喂饱解锁变形学具；英语绿药水与混色图鉴

---

## 1. 目标与用户

面向幼小衔接主课（语文 / 数学；二期扩英语）的情绪与收藏驱动：学完知识点掉落「魔法药水」，集齐孵化会眨眼的 Q 弹小精灵；答错时角落精灵瘪掉，点击安慰弹回——**不替代**重试/下一题流程。

二期用满星通关累计的「黄金饲料」喂饱精灵后，解锁拉伸数感尺、捏字母等变形学具，避免挤占主线。

---

## 2. 与史莱姆材料实验室的边界（必须遵守）

| | 主课「课程精灵」 | 主题「材料科学家」 |
|--|------------------|-------------------|
| 叙事 | 孵化/复活小精灵 | 制作史莱姆、变量实验 |
| 入口 | 首页「我的小精灵」、通关「去孵化」 | 主题基地 → `pages/slime/hub` |
| 存储 | `kidlearn:spirit`（`spiritStore`） | `kidlearn:slime`（`slimeStore`） |
| 数据 | `src/data/spirit/*` | `src/data/slime/*` |
| 组件 | `src/components/spirit/*` | `src/components/slime/*` |

**明确不做：** 不改 `slimeStore`、传说配方、交联变量、hub 文案与行为；两套系统互不合成原料，不合并叙事。

视觉可借鉴 SoftBody 的戳弹/拉伸思路，但**不复用**实验室的传说/合成逻辑。

---

## 3. 产品叙事（主课专用）

```
主课通关 → 掉落药水 → 药水瓶×3 → 烧杯孵化 → 小精灵
答错 → 角落吓一跳/瘪掉 → 点击噗嗤弹回（安慰）
满星通关 → 黄金饲料 → 喂饱 → 变形学具（二期）
```

- 语文 = 蓝药水；数学 = 黄药水；英语 = 绿药水（二期）
- 任意组合共 3 瓶可孵化；蓝/黄/绿比例映射外观（纯色 / 条纹 / 珠光等）
- 每关每天首次通关才掉药水（`levelId + date` 去重）

---

## 4. 存储与 API

`SpiritStoreState`：

- `potions: { blue, yellow, green }`
- `spirits: SpiritPet[]`、`activeSpiritId?`
- `goldenFeed`、`toolsUnlocked`、`tipSeen[]`
- `potionGrants: string[]`（去重键 `levelId|YYYY-MM-DD`）

核心 API：`grantPotion`、`canHatch` / `hatch`、`grantGoldenFeed`（3 星）、`feedSpirit`（达阈值 → `toolsUnlocked`）、`load` / `save`。

黄金饲料解锁阈值见 `src/data/spirit/tools.ts`（`FEED_TO_UNLOCK`）。

---

## 5. 一期竖切

1. `play.vue` `finish()`：chinese|math 调 `grantPotion`；满星累计 `goldenFeed`
2. `StarReward`：药水掉落文案；`canHatch` 时「去孵化」
3. `pages/spirit/home`：库存、烧杯孵化（冒泡 + 震动）、SpiritBuddy、图鉴 Tab
4. `SpiritCompanion`：有 active 精灵时挂在 play；QuizPop 等 `miss` → scared/flat；点击 bounce + sfx

---

## 6. 二期

1. 喂食黄金饲料 → `toolsUnlocked`
2. `SpiritStretchRuler`：拖拽长度 ↔ 刻度数字；接入数学至少 1 关
3. `SpiritLetterMorph`：字母 path 吸附 + speak；接入语文 U0 与/或英语试点关
4. 英语绿药水、三色混色外观、home 收集图鉴
5. ListenChoose / SequenceFun 错题同样触发安慰

学具活动在未解锁时由活动组件提示去精灵页喂食，不阻断其他关卡。

---

## 7. 验收

**一期：** 语文/数学通关可见药水；3 瓶可孵化（冒泡+震动+眨眼）；有精灵时答错瘪/吓、点击弹回；实验室无回归。

**二期：** 满星得饲料，喂饱后可用拉伸尺/捏字母；英药水与混色外观可区分；错题钩子覆盖听选/排序。
