---
phase: quick
plan: 260402-rjj
type: execute
wave: 1
depends_on: []
files_modified:
  - src/components/weather-widget/effects/
  - src/components/citation/schema.ts
  - src/components/citation/cmpts/citation-list.vue
  - src/components/stats-display/schema.ts
  - src/components/stats-display/cmpts/sparkline.vue
autonomous: true
requirements:
  - P0-01
  - P3-01
  - P3-02
must_haves:
  truths:
    - effects/ 目录已完全删除
    - CitationListProps 从 schema.ts 导入
    - SparklineProps 从 schema.ts 导入
  artifacts:
    - path: "src/components/weather-widget/effects/"
      provides: "已删除"
      min_lines: 0
    - path: "src/components/citation/schema.ts"
      provides: "CitationListProps 接口定义"
      contains: "export interface CitationListProps"
    - path: "src/components/citation/cmpts/citation-list.vue"
      provides: "导入 CitationListProps"
      contains: "import type { CitationListProps }"
    - path: "src/components/stats-display/schema.ts"
      provides: "SparklineProps 接口定义"
      contains: "export interface SparklineProps"
    - path: "src/components/stats-display/cmpts/sparkline.vue"
      provides: "导入 SparklineProps"
      contains: "import type { SparklineProps }"
  key_links:
    - from: "citation-list.vue"
      to: "citation/schema.ts"
      via: "import type"
    - from: "sparkline.vue"
      to: "stats-display/schema.ts"
      via: "import type"
---

<objective>
清理 React 迁移遗留的死代码和内联 Props 定义。

Purpose: 删除完全无法运行的 React 代码目录，统一 Props 类型定义来源，符合项目既有惯例。
Output: 删除 effects/ 目录，两个 SFC 改为从 schema.ts 导入 Props 类型。
</objective>

<execution_context>
@$HOME/.claude/get-shit-done/workflows/execute-plan.md
@$HOME/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/quick/260402-rjj-p0-weather-widget-effects-p3-props-inter/260402-rjj-CONTEXT.md
@docs/.research/react-to-vue-migration-audit.md

## 当前状态

### P0: effects/ 目录
- 34 个文件，全部为 React 代码（hooks、JSX、`"use client"`）
- react 不在 package.json 中，完全无法运行
- Vue 端已有对应 composable 和组件实现

### P3: 内联 Props Interface
- citation/cmpts/citation-list.vue (line 7): `export interface CitationListProps`
- stats-display/cmpts/sparkline.vue (line 6): `export interface SparklineProps`

## 目标 schema.ts 状态

### citation/schema.ts 已存在 CitationListProps (line 128-135):
```typescript
export interface CitationListProps {
  id: string;
  citations: SerializableCitation[];
  variant?: CitationVariant;
  maxVisible?: number;
  css?: { root?: string; item?: string };
  onNavigate?: (href: string, citation: SerializableCitation) => void;
}
```

### stats-display/schema.ts 需要新增 SparklineProps:
- 参考 sparkline.vue 内联定义 (line 6-15)
- 包含: data, color?, width?, height?, css?, style?, showFill?, fillOpacity?
</context>

<tasks>

<task type="auto">
  <name>Task 1: 删除 weather-widget/effects/ 死代码目录</name>
  <files>src/components/weather-widget/effects/</files>
  <action>
    完全删除 `src/components/weather-widget/effects/` 目录及其所有 34 个文件。
    这是 React 迁移遗留的死代码，包含完整的 React hooks、JSX 组件和 `"use client"` 指令，但项目依赖中根本没有 react，这些代码完全无法运行。
    Vue 端已有对应的 composable（useGlassStyles.ts、useWeatherEffects.ts）和组件（EffectCompositor.vue）实现。
  </action>
  <verify>
    <automated>test ! -d src/components/weather-widget/effects && echo "Directory deleted"</automated>
  </verify>
  <done>effects/ 目录已完全删除，无残留文件</done>
</task>

<task type="auto">
  <name>Task 2: 迁移 CitationListProps 到 schema.ts 并更新导入</name>
  <files>src/components/citation/schema.ts, src/components/citation/cmpts/citation-list.vue</files>
  <action>
    1. 检查 citation/schema.ts 是否已包含 CitationListProps 定义（根据 audit 报告已存在 line 128-135）
    2. 修改 citation/cmpts/citation-list.vue:
       - 删除内联的 `export interface CitationListProps` (line 7-14)
       - 添加导入: `import type { CitationListProps } from '../schema'`
       - 保留 `withDefaults(defineProps<CitationListProps & { css?: { root?: string } }>(), ...)` 的使用方式
    
    注意：schema.ts 中的 CitationListProps.css 是 `{ root?: string; item?: string }`，
    而组件内联定义是 `{ root?: string }`。withDefaults 中已额外声明 `& { css?: { root?: string } }`，
    所以导入 schema 的类型后仍然兼容。
  </action>
  <verify>
    <automated>grep -q "import type { CitationListProps } from '../schema'" src/components/citation/cmpts/citation-list.vue && echo "Import updated"</automated>
  </verify>
  <done>
    - citation-list.vue 不再内联定义 CitationListProps
    - 从 schema.ts 正确导入类型
    - 组件功能正常，类型检查通过
  </done>
</task>

<task type="auto">
  <name>Task 3: 添加 SparklineProps 到 schema.ts 并更新导入</name>
  <files>src/components/stats-display/schema.ts, src/components/stats-display/cmpts/sparkline.vue</files>
  <action>
    1. 在 stats-display/schema.ts 末尾添加 SparklineProps 接口（参考 sparkline.vue 内联定义）：
       ```typescript
       import type { CSSProperties } from 'vue';
       
       export interface SparklineProps {
         data: number[];
         color?: string;
         width?: number;
         height?: number;
         css?: { root?: string };
         style?: CSSProperties;
         showFill?: boolean;
         fillOpacity?: number;
       }
       ```
    
    2. 修改 stats-display/cmpts/sparkline.vue:
       - 删除内联的 `export interface SparklineProps` (line 6-15)
       - 添加导入: `import type { SparklineProps } from '../schema'`
       - 保留 withDefaults 的使用方式
  </action>
  <verify>
    <automated>grep -q "export interface SparklineProps" src/components/stats-display/schema.ts && grep -q "import type { SparklineProps } from '../schema'" src/components/stats-display/cmpts/sparkline.vue && echo "SparklineProps migrated"</automated>
  </verify>
  <done>
    - stats-display/schema.ts 包含 SparklineProps 定义
    - sparkline.vue 从 schema.ts 导入类型
    - 组件功能正常，类型检查通过
  </done>
</task>

</tasks>

<verification>
- [ ] effects/ 目录已完全删除（34 个文件）
- [ ] citation/schema.ts 包含 CitationListProps
- [ ] citation-list.vue 从 schema.ts 导入 CitationListProps
- [ ] stats-display/schema.ts 包含 SparklineProps
- [ ] sparkline.vue 从 schema.ts 导入 SparklineProps
- [ ] TypeScript 类型检查通过
- [ ] 无运行时错误
</verification>

<success_criteria>
- effects/ 目录不存在
- 两个 SFC 不再内联定义 Props interface
- 所有 Props 类型统一从对应 schema.ts 导入
- 符合项目既有惯例
</success_criteria>

<output>
After completion, create `.planning/quick/260402-rjj-p0-weather-widget-effects-p3-props-inter/260402-rjj-SUMMARY.md`
</output>
