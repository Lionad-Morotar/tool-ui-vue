# Phase 7: Story 结构重构与 i18n 解耦 — Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-13
**Phase:** 07-story-i18n
**Areas discussed:** i18n file organization, useStoryLocale API, Histoire tree matching, migration batches, shared design

---

## i18n 文件组织方式

| Option | Description | Selected |
|--------|-------------|----------|
| 双语分文件 | 每个 story 目录下 `i18n/zh.ts` + `i18n/en.ts` | ✓ |
| 单一 locale.ts | 统一导出 `{ zh, en }` 对象 | |

**User's choice:** 双语分文件
**Notes:** 保持语言分离，方便后续扩展新语言；目录结构为 `src/stories/{name}/i18n/zh.ts` + `en.ts`

---

## useStoryLocale API 演进

| Option | Description | Selected |
|--------|-------------|----------|
| key-based | `useStoryLocale('variant.withImage')`，函数内部查表 | ✓ |
| 保持兼容 | `import label from './locale'` 后 `useStoryLocale(label.title)` | |

**User's choice:** key-based
**Notes:** 升级 `_shared/use-story-locale.ts` 以支持 key-based 查找；保持返回 `ComputedRef<string>` 的模板层兼容

---

## Histoire tree 分组匹配策略

| Option | Description | Selected |
|--------|-------------|----------|
| 按目录名匹配 | 修改 `histoire.config.ts` 的 `include` | |
| 混合策略 | 保留部分顶层 anchor | |
| You decide | 由 planner/executor 决定具体方案 | ✓ |

**User's choice:** You decide
**Notes:** 核心约束是唯一要求：分组树与迁移前一致或更优

---

## 迁移批次

| Option | Description | Selected |
|--------|-------------|----------|
| 一次性全量 | 全部 29 个 story 一批迁移 | |
| 12 批左右 | 按复杂度拆分，约 12 批 | ✓ |

**User's choice:** 12 批左右
**Notes:** 29 个 story；高密度复杂 story（item-carousel 77 处、geo-map 73 处等）单独成批，低密度可合并

---

## _shared 文案处理

| Option | Description | Selected |
|--------|-------------|----------|
| 下沉到各目录 | 表格表头等通用 label 也分走 | |
| 保持现状 | `_shared/` 中的内容不改动 | ✓ |

**User's choice:** 保持现状 / 无需 _shared 设计
**Notes:** `_shared/use-story-locale.ts` 升级 key-based API，位置不变

---

## Claude's Discretion

- Histoire tree 分组匹配的具体实现方式
- 每批内部 exact story 组合（由 planner 根据密度/复杂度决定）
- key-based API 的具体类型定义（嵌套对象 vs 扁平 key）

## Deferred Ideas

- 将 _shared 通用 labels 下沉到各 story 目录（用户明确 defer）
- `zh-CN` 重命名为 `zh`（超出本 Phase 范围）
- Histoire 框架导航栏本身的英文标签翻译
