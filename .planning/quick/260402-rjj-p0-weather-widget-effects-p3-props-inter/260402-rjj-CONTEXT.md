# Quick Task 260402-rjj: P0: 删除 weather-widget/effects/ 死代码目录 + P3: 统一内联 Props Interface - Context

**Gathered:** 2026-04-02
**Status:** Ready for planning

<domain>
## Task Boundary

基于 react-to-vue-migration-audit.md 诊断报告，完成剩余问题清理：

1. **P0** — weather-widget/effects/ 整个 React 子树未清理
   - 包含完整的 React 组件（hooks、JSX、`"use client"`）
   - `react` 不在 package.json 中 —— 完全无法运行
   - Vue 端已有对应 composable，属纯死代码

2. **P3** — 内联 Props Interface 统一
   - 2 个 SFC 在 `<script setup>` 内定义内联 interface
   - 项目惯例是从 schema.ts 导入类型

</domain>

<decisions>
## Implementation Decisions

### P0: effects 目录删除范围
- **Claude's Discretion**: 完全删除整个 `effects/` 目录
- 理由：根据 audit 报告，该目录下全部为 React 代码，且 Vue 端已有对应实现
- 受影响文件：effect-compositor.tsx, effect-compositor-runtime.tsx, weather-effects-canvas.tsx, generated/*, use-*.ts 等

### P3: Props Interface 迁移方式
- **Claude's Discretion**: 将内联 interface 移动到对应组件的 schema.ts 并更新导入
- 文件清单：
  - citation/cmpts/citation-list.vue (interface CitationListProps)
  - stats-display/cmpts/sparkline.vue (interface SparklineProps)

</decisions>

<specifics>
## Specific Ideas

迁移后所有组件的 Props 类型统一从 schema.ts 导入，符合项目既有惯例。

</specifics>

<canonical_refs>
## Canonical References

- docs/.research/react-to-vue-migration-audit.md (诊断报告)

</canonical_refs>
