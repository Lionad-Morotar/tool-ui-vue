# tool-ui-vue

## What This Is

Vue 3 组件库，为 AI/LLM 工具调用提供可序列化的 UI widgets。当前是 26 个工具组件（ApprovalCard、WeatherWidget、DataTable 等），采用 copy-paste 风格分发，使用 Zod 进行契约驱动设计（Contract-Driven Design）。

目标：从 copy-paste 模式重构为标准 npm 包组件库，采用 Monorepo 分层架构（core → components → nuxt-module → theme），支持版本管理、Tree-shaking、主题定制。

## Core Value

组件可以通过 `pnpm add @lionad/components` 安装使用，所有 26 个现有工具组件正常运行且 Zod 契约不变。

## Requirements

### Validated

<!-- 从现有代码推断的能力 -->

- ✓ Zod schema 契约层 — 现有 26 个组件均有完整的 Zod schemas、类型推导、parse/safeParse 函数
- ✓ Vue 3 Composition API 组件 — 使用 `<script setup>` + TypeScript + `withDefaults`
- ✓ Tailwind CSS v4 样式 — 使用 `@theme` 指令定义设计 tokens
- ✓ 无头架构（Headless） — 组件逻辑已分离到 `states/` composables 层
- ✓ Histoire Storybook — 组件开发文档和视觉测试
- ✓ Vitest 单元测试 — 部分组件有 `__tests__/` 测试

### Active

<!-- 当前重构范围 -->

- [ ] Monorepo 结构（pnpm workspace）：packages/core + packages/components + packages/theme
- [ ] 基础组件层（P0）：Button（17 处使用）+ Card（25 处使用），使用 cva 变体系统
- [ ] 基础组件层（P1）：Badge（7 处使用）+ CopyButton（3 处使用）
- [ ] 工具组件迁移：26 个组件迁移到 packages/components，消费 core 基础组件
- [ ] 主题系统：CSS 变量 + `@theme` 指令，`data-theme` 属性切换
- [ ] 构建系统：纯 pnpm scripts，Vite 库模式，支持 ESM/CJS + Tree-shaking
- [ ] TypeScript 类型声明：完整的 `.d.ts` 输出

### Out of Scope

- Nuxt module（`packages/nuxt-module`）— 推迟到 core + components 稳定后
- 文档站点（VitePress）— 推迟到基础组件层完成后
- CI/CD Pipeline — 推迟到首次手动发布验证流程后
- Vue 2 支持 — 已停止维护，团队使用 Vue 3 + Nuxt 3
- Input/Select/Dialog/Table 基础组件 — 使用频率低，当前阶段不需要独立基础组件

## Context

**现有架构：** 基于 Zod 契约的组件库，schema-first 设计。每个组件结构为 `{name}/index.vue + schema.ts + states/`。工具组件直接使用内联 Tailwind 类，没有共享基础组件。

**参考项目：** `/Users/lionad/Github/Run/tool-ui/apps/www/components/ui/` 提供 32 个 React/TSX 基础组件设计，使用 cva + @radix-ui/react-slot 模式。

**重复模式分析：** Card 容器样式重复 25 次（最高频），Button 样式 17 次，Badge 7 次，CopyButton 3 次。这些是基础组件层的首要目标。

**已完成的重构：** 组件已迁移到无头架构模式（逻辑分离到 `states/` composables），这为消费基础组件层做好了准备。

## Constraints

- **Tech Stack:** Vue 3 + TypeScript + Zod + Tailwind CSS v4 — 锁定，不更改
- **Contract Layer:** Zod schemas 是核心资产，不能破坏
- **Internal Project:** 需要快速交付但也要考虑长期维护
- **Nuxt Priority:** 团队主要使用 Nuxt，Nuxt module 是优先级最高的子包（但延后实现）

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Monorepo + pnpm workspace | 标准组件库架构，支持独立版本发布 | — Pending |
| cva 变体系统 | 用户明确覆盖，成熟库 ~1KB，参考项目使用 | — Pending |
| Tailwind v4 @theme 指令 | 项目已使用，不需要迁移到 JS config | — Pending |
| 纯 pnpm scripts | 3-4 个包不需要 Turborepo | — Pending |
| 基础组件按频率优先级 | Button(17)+Card(25) 为 P0，Badge(7)+CopyButton(3) 为 P1 | — Pending |
| 主题包保持独立 | 不合并到 core，单独 @lionad/theme | — Pending |
| Nuxt module 延后 | 优先稳定 core + components，Nuxt 集成后补 | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd:transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd:complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-04-03 after initialization*
