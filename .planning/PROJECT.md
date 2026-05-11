# tool-ui-vue

## What This Is

Vue 3 组件库，为 AI/LLM 工具调用提供可序列化的 UI widgets。当前是 26 个工具组件（ApprovalCard、WeatherWidget、DataTable 等），采用 copy-paste 风格分发，使用 Zod 进行契约驱动设计（Contract-Driven Design）。

目标：从 copy-paste 模式重构为标准 npm 包组件库，采用 Monorepo 分层架构（core → components → nuxt-module → theme），支持版本管理、Tree-shaking、主题定制。

## Current State

**Shipped:** v1.0.0 多语言 i18n 系统 (2026-04-14)

- 7 个阶段，31 个 plans，145 个 commits
- 自研轻量 i18n 基础设施（零外部依赖），23+ 组件全面 i18n 改造
- 353/353 测试通过，CI 校验 + ESLint 规则保障 key 一致性
- README / Story / Histoire 全站点双语化
- Story 目录结构重构完成（28 个 story 迁移为 key-based i18n 解耦结构）

## Core Value

组件可以通过 `pnpm add @lionad/components` 安装使用，所有 26 个现有工具组件正常运行且 Zod 契约不变。

## Requirements

### Validated

- ✓ Zod schema 契约层 — 现有 26 个组件均有完整的 Zod schemas、类型推导、parse/safeParse 函数
- ✓ Vue 3 Composition API 组件 — 使用 `<script setup>` + TypeScript + `withDefaults`
- ✓ Tailwind CSS v4 样式 — 使用 `@theme` 指令定义设计 tokens
- ✓ 无头架构（Headless） — 组件逻辑已分离到 `states/` composables 层
- ✓ Histoire Storybook — 组件开发文档和视觉测试
- ✓ Vitest 单元测试 — 部分组件有 `__tests__/` 测试
- ✓ 多语言 i18n 系统 — LocaleProvider + useI18n() + zh-CN/en 消息文件，零外部依赖 — v1.0
- ✓ 组件 i18n 改造 — 23+ 组件消除硬编码英文文本，响应式语言切换 — v1.0
- ✓ 文档多语言 — README / Story / Histoire 站点中英文支持 — v1.0

### Active

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

**已完成的重构（v1.0）：**
- i18n 系统：provide/inject 模式，DeepKeyPath 类型推导，280 键双语消息文件
- 组件 i18n：23+ 组件全部使用 t()，aria-label 类型安全
- 测试覆盖：353 tests passing，vi.mock + shared locale state 模式
- CI 保障：GitHub Actions 运行 lint → typecheck → test → i18n check

**参考项目：** `/Users/lionad/Github/Run/tool-ui/apps/www/components/ui/` 提供 32 个 React/TSX 基础组件设计，使用 cva + @radix-ui/react-slot 模式。

**重复模式分析：** Card 容器样式重复 25 次（最高频），Button 样式 17 次，Badge 7 次，CopyButton 3 次。这些是基础组件层的首要目标。

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
| 自研 i18n（零 vue-i18n） | 轻量、copy-paste 兼容、tree-shakeable | ✓ Good — v1.0 验证成功 |
| DeepKeyPath 递归类型推导 | t() key 自动补全 + 无效 key 类型报错 | ✓ Good |
| vi.mock + shared locale state 测试模式 | 跨测试文件统一 locale 切换 | ✓ Good |
| Story 目录结构 + key-based i18n | 解耦内联文案，提升可维护性 | ✓ Good |

## Next Milestone Goals

（待定义 — 运行 `/gsd-new-milestone` 开始下一里程碑规划）

---
*Last updated: 2026-04-14 after v1.0 milestone completion*
