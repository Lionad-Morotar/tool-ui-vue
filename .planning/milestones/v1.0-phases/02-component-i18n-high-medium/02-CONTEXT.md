# Phase 2: Component i18n (High + Medium) - Context

**Gathered:** 2026-04-11
**Status:** Ready for planning

<domain>
## Phase Boundary

13 个组件（7 高优 + 6 中优）消除硬编码英文文本，通过 `t()` 函数消费 i18n 系统，响应语言切换。

**高优 7：** terminal, code-block, code-diff, order-summary, question-flow, message-draft, data-table
**中优 6：** audio, video, image-gallery, geo-map, item-carousel, preferences-panel

Phase 1（I18N Core）提供 `LocaleProvider` + `useI18n()` 基础设施。

</domain>

<decisions>
## Implementation Decisions

### 消息 key 组织方式
- **D-01:** 使用嵌套路径格式：`t('terminal.copy.copied')`、`t('orderSummary.pricing.discount')`
- **D-02:** key 命名以组件名为根命名空间，子路径按功能域分组（如 `terminal.copy.*`、`terminal.emptyState.*`）

### 组件消息文件存放位置
- **D-03:** 分布式布局 — 每个组件自带 `i18n/` 目录，包含 `zh-CN.json` 和 `en.json`
- **D-04:** 目录结构：`packages/components/src/{component}/i18n/zh-CN.json`

### 非 i18n 用户 fallback
- **D-05:** 全局默认 Provider 模式 — core 入口自动注册 zh-CN 默认 `LocaleProvider`
- **D-06:** copy-paste 用户无需任何额外配置，`t()` 调用自动返回 zh-CN 默认值
- **D-07:** 显式传入 `LocaleProvider` 时覆盖默认，支持语言切换

### Schema 动态 label 处理
- **D-08:** 不 i18n 化 schema 字段（如 order-summary 的 `discountLabel`、data-table 的 `emptyMessage`）
- **D-09:** schema 传入什么就用什么，组件不做二次翻译
- **D-10:** 如需 i18n 化 label，由调用方自行传入翻译后的值

### Claude's Discretion
- 每个组件具体消息 key 的命名（只要遵循嵌套路径格式即可）
- 消息 JSON 文件的缩进格式
- 组件内 `t()` 调用的具体代码组织（computed vs inline）

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### i18n 设计文档
- `.gstack/projects/tool-ui-vue/lionad-main-design-20260411-120000.md` — i18n 架构设计（provide/inject、zh-CN 默认、dev/prod fallback）

### 需求文档
- `.planning/REQUIREMENTS.md` — COMPS-01（高优 7 组件）、COMPS-02（中优 6 组件）
- `.planning/ROADMAP.md` — Phase 2 目标和成功标准

### 代码库约定
- `.planning/codebase/STRUCTURE.md` — 组件目录结构和文件命名规范
- `.planning/codebase/CONVENTIONS.md` — Vue SFC 约定、TypeScript 规范、命名规范
- `.planning/codebase/ARCHITECTURE.md` — Headless 架构模式（states/ 分离）

</canonical_refs>

<code_context>
## Existing Code Insights

### 已识别硬编码英文字符串（高优 7）
- **terminal:** `"No output to copy"`, `"Copied"`, `"Copy output"`, `"Show all {n} lines"`, `"Collapse"`, `"No output"`
- **order-summary:** `"Order Summary"`, `"Discount"`, `"Free"`（fallback 默认值）
- **question-flow:** `"Completed"`, `"Back"`
- **data-table:** `"No data available"`（fallback 默认值）
- **code-block:** 少量，主要是 UI 标签
- **code-diff:** 少量，主要是 UI 标签
- **message-draft:** 几乎无硬编码文本

### 已识别硬编码英文字符串（中优 6）
- **video:** `"Your browser does not support the video element."`, `"Video controls"`, `"Pause"`, `"Watch"`
- **audio:** 少量 UI 标签（需进一步扫描）
- **image-gallery:** 暂无明显硬编码文本
- **geo-map:** 暂无明显硬编码文本
- **item-carousel:** 暂无明显硬编码文本
- **preferences-panel:** 暂无明显硬编码文本

### Reusable Assets
- `cn()` 工具函数 — `packages/core/src/utils.ts`，用于 class 合并
- `states/` headless 逻辑 — 各组件已有分离的状态逻辑
- Zod schema — 各组件 `schema.ts`，提供类型定义

### Established Patterns
- `<script setup lang="ts">` + `defineProps` + `defineOptions`
- Headless 架构：逻辑在 `states/`，UI 在 `index.vue`
- 组件名：`defineOptions({ name: 'CmptXxx' })`
- 组件目录：kebab-case（如 `packages/components/src/order-summary/`）

### Integration Points
- Phase 1 提供的 `useI18n()` composable 从 `@lionad/vtu-core/i18n` 导入
- 各组件的 `index.vue` 模板中替换硬编码字符串为 `t()` 调用
- 全局默认 LocaleProvider 在 core 包入口自动注册

</code_context>

<specifics>
## Specific Ideas

- 嵌套 key 格式：`t('componentName.domain.action')`，如 `t('terminal.copy.copied')`
- 每个组件自带 `i18n/zh-CN.json` 和 `i18n/en.json`
- 非 i18n 用户零配置：core 入口自动注册 zh-CN 默认 Provider
- schema 字段（如 `discountLabel`、`emptyMessage`）不 i18n 化，原样渲染

</specifics>

<deferred>
## Deferred Ideas

- 低优 10 组件 i18n 改造 — Phase 3
- i18n 测试覆盖 — Phase 3
- CI key 一致性校验 — Phase 4
- 复数形式支持（pluralization）— 后续 milestone
- 更多语言（ja, ko, fr, de）— 后续 milestone
- RTL 布局支持 — 后续 milestone

</deferred>

---

*Phase: 02-component-i18n-high-medium*
*Context gathered: 2026-04-11*
