# 史莱姆材料科学家 — 设计规格

**日期：** 2026-08-05  
**状态：** 已评审（待实现计划）  
**一期范围：** 实验室 / 图鉴 / 小贴士 / 展览馆+分享 / 特效互动 / 轻引导 3 关  
**二期（不做）：** 每周挑战、与宝石主题原料互通

---

## 1. 目标与用户

面向 10–12 岁少年，在主题基地中新增独立主题「史莱姆材料科学家」。以真实材料科学为基础，通过变量组合实验、配方图鉴收集、科学知识解锁，提供兼具教育性与创造性的体验。

核心驱动力：科学探索欲、创作成就感、独特性表达。

---

## 2. 架构决策

采用 **独立主题 App 壳**（方案 1）：

- 主题基地入口进入 `pages/slime/hub`（单页三 Tab：实验室 / 图鉴 / 展览馆）。
- 另挂轻引导 3 关，复用现有 `subject/map` + `lesson/play`。
- 配方解锁、创作、徽章独立存储（`kidlearn:slime`），不与 gem/dino 的 `collection` 强耦合。
- `slime` 注册为 `ThemeId`，**豁免主题锁定**（`canEnter('slime')` 恒为 true）。

### 导航

```
主题基地 base.vue
  └─ 史莱姆材料科学家（并列入口，无前置解锁）
       └─ /pages/slime/hub
            ├─ Tab 实验室
            ├─ Tab 图鉴（传说 + 我的创作）
            └─ Tab 展览馆（展示 + 分享）
       └─ 引导：/pages/subject/map?id=slime → lesson/play（3 关）
```

### 模块文件

```
src/data/slime/
  index.ts       # Subject：3 引导关
  recipes.ts     # 20 传说配方元数据 + 引用贴士 id
  mapping.ts     # 变量 → 属性映射

src/engine/slimeStore.ts
src/components/slime/   # BeakerMix、SlimeBlob、MagnetDrag、TipModal、ShareCard 等

docs/slime-science-tips.md   # 小贴士全文（外审源文件）
```

视觉：程序化（Canvas/CSS/SVG），无外部帧动画/音效文件；音效用现有 Web Audio 合成。

---

## 3. 变量与映射

### 变量

| 变量 | 类型 | 选项 |
|------|------|------|
| 基础胶体 `base` | 二选一 | `white` 白胶 / `clear` 透明胶水 |
| 交联剂 `borax` | 滑块 1–5 | 硼砂水滴数 |
| 添加剂 `additive` | 多选一可取消 | `none` / `glitter` / `glow` / `iron` / `pearl` / `fragrance` |

配方指纹：`{base}-{borax}-{additive}`，例：`clear-5-iron`。

### 属性映射

| 维度 | 规则 |
|------|------|
| 透明度 | white → 低；clear → 高 |
| 物理态 | 1–2 → 稀软；3 → 标准；4–5 → 硬实 |
| 特效 | 由添加剂决定 |

由物理态推导的标签（科学审核修订：Q 弹在中等交联最好，高交联更硬而非更弹）：

| 滴数 | 物理态 | 硬度 | 弹性（Q 弹） | 流动性 |
|------|--------|------|--------------|--------|
| 1–2 | 稀软 | 低 | 低 | 高 |
| 3 | 标准 | 中 | **高** | 中 |
| 4–5 | 硬实 | 高 | 中→低 | 低 |

材料名称必须使用真实市售原料名，不得虚构。科学小贴士全文见 `docs/slime-science-tips.md`（已按 2026-08-05 科学审核意见修订）。

---

## 4. 配方实验室（主玩法）

1. 用户调节三变量 → 点击「开始实验」。
2. 轻震动（H5：`navigator.vibrate`，可用时）；搅拌动画 3–5 秒，震动随进度增强。
3. 成品出现在实验台；显示属性标签。
4. 手指拖拽 / 戳 / 拉伸：按稀软 / 标准 / 硬实切换 CSS 质感与震动频率。
5. 命中传说 → 解锁并弹科学小贴士；否则写入「我的创作」（按指纹去重）。

### 特效

| 添加剂 | 表现 |
|--------|------|
| 闪粉 | 粒子闪烁 |
| 夜光 | 「关灯」开关 + 发光 |
| 铁粉 | 可拖磁铁，距离阈值内史莱姆缓动跟随 |
| 珠光 | 虹彩光泽 |
| 香精 | 仅标签，无视觉特效 |

### 引导关（3 关）

1. 认识基础胶体  
2. 交联剂用量与软硬  
3. 添加剂特效  

通关后提示前往实验室自由实验。引导关不通过 `collection.rewards` 解锁传说配方；传说仅由实验室变量组合命中解锁，避免两套解锁路径互相打架。

---

## 5. 传说配方（20）

| id | 名称 | base | borax | additive | tipId |
|----|------|------|-------|----------|-------|
| legend-glow-ghost | 夜光幽灵 | clear | 3 | glow | tip-glow-ghost |
| legend-galaxy | 银河星云 | white | 3 | glitter | tip-galaxy |
| legend-magneto | 万磁王 | clear | 3 | iron | tip-magneto |
| legend-firm | 硬实大师 | clear | 5 | none | tip-firm |
| legend-tears | 流动之泪 | clear | 1 | none | tip-tears |
| legend-pearl-rainbow | 珠光彩虹 | clear | 3 | pearl | tip-pearl-rainbow |
| legend-scent-candy | 香氛软糖 | white | 3 | fragrance | tip-scent-candy |
| legend-night-meteor | 暗夜流星 | clear | 2 | glow | tip-night-meteor |
| legend-armor | 硬核装甲 | white | 5 | iron | tip-armor |
| legend-soft-glitter | 闪闪软泥 | clear | 2 | glitter | tip-soft-glitter |
| legend-moon-jelly | 月光果冻 | clear | 4 | glow | tip-moon-jelly |
| legend-iron-rider | 银河铁骑 | white | 4 | iron | tip-iron-rider |
| legend-pearl-fall | 珍珠瀑布 | clear | 1 | pearl | tip-pearl-fall |
| legend-scent-ghost | 香气幽灵 | clear | 3 | fragrance | tip-scent-ghost |
| legend-star-warrior | 星尘战士 | white | 5 | glitter | tip-star-warrior |
| legend-clear-standard | 透明标准体 | clear | 3 | none | tip-clear-standard |
| legend-white-standard | 乳白标准体 | white | 3 | none | tip-white-standard |
| legend-pearl-armor | 珠光盔甲 | white | 5 | pearl | tip-pearl-armor |
| legend-iron-river | 铁屑河流 | clear | 1 | iron | tip-iron-river |
| legend-glitter-fort | 闪粉堡垒 | clear | 5 | glitter | tip-glitter-fort |

完整科学小贴士正文见 **`docs/slime-science-tips.md`**（外审源文件）。产品内文案必须与该文件一致。

另含添加剂通用贴士：`tip-additive-glitter` / `glow` / `iron` / `pearl` / `fragrance`。

---

## 6. 存储

Key：`kidlearn:slime`

```ts
{
  unlockedLegendIds: string[]
  creations: {
    fingerprint: string
    base: BaseGlue
    borax: BoraxDrops
    additive: Additive
    createdAt: string // ISO
  }[]
  badges: string[]
  tipSeenIds: string[]
  guideDone: boolean
}
```

徽章示例：`first-mix`、`legend-5`、`legend-10`、`legend-20`、`all-additives`。

主题基地个人区展示徽章数量 / 最近徽章（轻量）。

---

## 7. 图鉴与展览馆

### 图鉴

- 传说 20 格：解锁显名称/缩略图/变量；未解锁「？」+ 剪影。
- 「我的创作」：非传说指纹，含变量与日期。
- 已解锁传说可再查看科学小贴士。

### 展览馆

- 展示已解锁传说 + 我的创作；点击放大。
- 分享：Canvas 绘制卡片（成品示意 + 配方 + 用户名 + 日期）→ H5 `toDataURL` 下载；他端不支持则降级提示。
- 用户名：设置页昵称，缺省「小小科学家」。

---

## 8. 视觉、交互与合规

- 色调：科技蓝 + 实验白 + 玻璃质感；仪器 SVG。
- 按钮轻震；搅拌渐进震动；拖拽按硬度调震动频率。
- 右下角固定安全文案（不可关闭）：  
  「本游戏为科学模拟，真实制作需在家长陪同下进行。」
- 科学原理须真实（PVA 交联、荧光储能、磁性吸附等），禁止伪科学。

---

## 9. 与现有系统衔接

| 系统 | 处理 |
|------|------|
| `types.ts` ThemeId / SubjectId | 增加 `slime` |
| `catalog.ts` | 注册 slime Subject |
| `themeLock.ts` | slime 始终可进入 |
| `progress.ts` | 默认进度含 slime（引导关星星） |
| `pages.json` | 注册 `pages/slime/hub` |
| `base.vue` | 并列门卡片；展示徽章摘要 |
| `collection.ts` | 一期不强制接入；传说走 slimeStore |

---

## 10. 验收标准（一期）

1. 任意变量组合均可合成，无空白或报错。
2. 20 传说均可按组合解锁，并弹出对应小贴士。
3. 拖拽/戳/拉反馈与稀软/标准/硬实标签一致。
4. 展览馆分享图清晰可读。
5. `docs/slime-science-tips.md` 与产品内文案一致，可供外审。
6. 史莱姆入口无锁定；安全提示始终可见。

---

## 11. 明确不做（一期）

- 每周挑战 / 创意排行榜
- 宝石主题原料互通
- 真实序列帧图片、外部音效文件
- 服务端同步
