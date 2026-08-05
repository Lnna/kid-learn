# 史莱姆材料科学家 Implementation Plan

> **For agentic workers:** Execute task-by-task. Steps use checkbox syntax.

**Goal:** 在主题基地落地「史莱姆材料科学家」一期：实验室三变量实验、20 传说图鉴、科学小贴士、展览馆分享、轻引导 3 关。

**Architecture:** 独立 `pages/slime/hub` 三 Tab 壳；配方数据与贴士在 `src/data/slime/`；进度存 `slimeStore`；引导关复用 `lesson/play`；`slime` 豁免主题锁定。

**Tech Stack:** UniApp + Vue3 + TypeScript；Canvas/CSS 程序化视觉；`uni` storage；Web Audio sfx。

## Global Constraints

- 材料名与科学文案必须与 `docs/slime-science-tips.md` 一致
- 安全提示固定不可关闭
- 一期不做每周挑战、原料互通
- 视觉程序化，无外部帧动画/音效文件
- H5 优先；震动不可用时静默降级
- 传说仅由实验室组合解锁

## File Structure

```
src/data/slime/types.ts       # BaseGlue, BoraxDrops, Additive, SlimeResult…
src/data/slime/mapping.ts     # fingerprint + 属性映射
src/data/slime/tips.ts        # 贴士正文（对齐 md）
src/data/slime/recipes.ts     # 20 传说
src/data/slime/index.ts       # Subject 3 引导关
src/engine/slimeStore.ts
src/utils/haptics.ts          # vibrate 封装
src/components/slime/*.vue
src/pages/slime/hub.vue
```

修改：`types.ts`、`catalog.ts`、`progress.ts`、`themeLock.ts`、`collection.ts`（可选）、`pages.json`、`base.vue`

---

### Task 1: 数据层（类型 / 映射 / 贴士 / 配方）

**Files:** Create `src/data/slime/{types,mapping,tips,recipes}.ts`

- [ ] 实现 `fingerprint(base, borax, additive)` → `white-3-glow`
- [ ] 实现 `computeResult(...)` → 透明度/物理态/硬度/弹性/流动性/特效
- [ ] 弹性映射：1–2 低，3 高，4–5 中→低；硬度相反
- [ ] `LEGEND_RECIPES` 20 条；`TIPS` 与 md 正文一致
- [ ] `findLegend(fingerprint)` / `getTip(tipId)`

### Task 2: slimeStore + haptics

**Files:** Create `src/engine/slimeStore.ts`, `src/utils/haptics.ts`

- [ ] storage key `slime`（经现有 `getItem`/`setItem` 前缀）
- [ ] `recordMix`：解锁传说或写入创作；发徽章；返回 `{ legend?, isNewTip, tipId? }`
- [ ] `lightTap` / `stirPulse(progress0to1)` / `dragPulse(firmness)`

### Task 3: 注册主题 + 锁定豁免 + 引导关

**Files:** Modify types/catalog/progress/themeLock/collection；Create `src/data/slime/index.ts`；Modify `pages.json`、`base.vue`

- [ ] ThemeId 加 `slime`；THEMES 注册
- [ ] `canEnter('slime')` 恒 true；`enter(slime)` → hub，且不 `chooseTheme`
- [ ] 3 引导关：胶体 / 交联 / 添加剂（quiz + tapRead）
- [ ] base 展示徽章摘要

### Task 4: Hub + 实验室 UI

**Files:** Create `pages/slime/hub.vue` + `components/slime/{LabPanel,BeakerMix,SlimeBlob,TipModal}.vue`

- [ ] Tab：实验室 / 图鉴 / 展览馆 + 安全文案 + 引导入口
- [ ] 变量面板 → 搅拌 → 成品交互（拖/戳/拉）+ 特效（闪粉/夜光关灯/磁铁/珠光）
- [ ] 解锁弹 TipModal

### Task 5: 图鉴 + 展览馆分享

**Files:** Create `components/slime/{RecipesPanel,GalleryPanel,ShareCard}.vue`

- [ ] 传说网格 + 我的创作
- [ ] 展览馆详情 + Canvas 分享图下载

### Task 6: 验收

- [ ] `npm run type-check`
- [ ] 手动冒烟：任意组合、20 传说命中、豁免锁定、分享图

---

**Execution:** 本会话 inline 执行（用户已要求实现）。
