# 组件使用

## 安装

```bash
pnpm add @lionad/vtu-components
```

导入样式：

```css
@import "@lionad/vtu-components/style.css";
```

## 基本用法

### 使用 Serializable 数据

通过 `v-bind` 将 Serializable 数据传递给组件：

```vue
<script setup lang="ts">
import { CodeBlock } from '@lionad/vtu-components'
import type { SerializableCodeBlock } from '@lionad/vtu-components'

const data: SerializableCodeBlock = {
  code: "console.log('hello')",
  language: 'javascript',
  filename: 'hello.js',
  lineNumbers: true,
}
</script>

<template>
  <CodeBlock v-bind="data" />
</template>
```

### 使用 Props

直接传递 typed props：

```vue
<script setup lang="ts">
import { OptionList } from '@lionad/vtu-components'
</script>

<template>
  <OptionList
    title="选择部署目标"
    :options="[
      { id: '1', label: '生产环境', value: 'prod' },
      { id: '2', label: '测试环境', value: 'staging' },
    ]"
    @select="handleSelect"
  />
</template>
```

## 事件处理

组件通过 `onXxx` 回调通知父组件：

```vue
<template>
  <ApprovalCard
    v-bind="data"
    @decision="handleDecision"
  />
</template>

<script setup lang="ts">
import { createDecisionResult } from '@lionad/vtu-components'

function handleDecision(action: { id: string; label: string }) {
  const result = createDecisionResult({
    decisionId: data.id,
    action,
  })
  // 发送到后端...
}
</script>
```

## css Prop 定制

不修改源码，通过 Tailwind 类覆盖样式：

```vue
<template>
  <ItemCarousel
    v-bind="data"
    :css="{
      root: 'rounded-2xl shadow-xl',
      card: 'hover:scale-105 transition-transform',
    }"
  />
</template>
```

每个组件的 `css` 支持的 key 不同，常见 key：`root`、`header`、`content`、`footer`、`item`/`card`/`row`。

## 组件导出结构

从 `@lionad/vtu-components` 导入：

```ts
// 组件
import { DataTable } from '@lionad/vtu-components'

// 类型
import type { DataTableProps, SerializableDataTable } from '@lionad/vtu-components'

// Schema
import { SerializableDataTableSchema } from '@lionad/vtu-components'

// Parser
import { parseSerializableDataTable, safeParseSerializableDataTable } from '@lionad/vtu-components'
```

或从根包聚合导入：

```ts
import { DataTable } from 'tool-ui-vue'
```

## Peer 依赖注意

部分组件有额外 peer 依赖：

| 组件 | 依赖 |
|------|------|
| `GeoMap` | `leaflet`, `@vue-leaflet/vue-leaflet` |
| `Chart` | `chart.js`, `vue-chartjs` |
| `CodeBlock` / `CodeDiff` | `shiki`（动态 import） |
| `Terminal` | `ansi-to-html` |

## 样式故障排除

1. 确认 `@import "@lionad/vtu-components/style.css"` 已添加在 `@import "tailwindcss"` **之后**，且在**同一个** Tailwind 入口里（见下「为什么顺序/位置重要」）
2. 确认 Tailwind v4 扫描到组件源码（`style.css` 内置 `@source "."` 指令，无需手动配置）
3. 确认 `data-theme="dark"` 已设置（如需 dark mode）

### 典型症状：边框发黑 / 底色或字色丢失

布局正常、但**边框变成近黑实线**，或 `bg-*`/`text-*` 颜色不对——几乎都是 `style.css` 的 `@theme` 没进入 Tailwind 入口作用域：颜色工具类（`border-border`、`bg-muted`、`text-foreground` 等）因此未生成，边框宽度工具类回退到 preflight 的 `currentColor`（≈ 文字色）。常见诱因：

- `style.css` 被当作**独立/并行** stylesheet 注入（如框架模块里 `css.push(style.css)`），而不是在含 `@import "tailwindcss"` 的入口里 `@import` 它，导致 `@theme`/`@source` 不在带引擎的上下文中。
- 在框架模块里**另行 `@source` 扫描** vtu dist，却没引入 vtu 的 `@theme`，于是扫得到类名、查不到颜色名。

修法：回到「安装」的写法——在入口 css 的 `@import "tailwindcss"` 之后 `@import` style.css，不要并行注入或单独扫描。

### Monorepo / pnpm 严格模式

`@import "@lionad/vtu-components/style.css"` 走 node 解析。pnpm 严格模式下，若 vtu 只是**传递依赖**（不在当前包的 `node_modules`），该 `@import` 会解析失败（构建报找不到文件，或样式静默缺失）。二选一：把 `@lionad/vtu-components` 提升为**直接依赖**，或在 `.npmrc` 用 `public-hoist-pattern` / `shamefully-hoist` 提升。

### 为什么顺序/位置重要

`style.css` 同时承载 `@theme`（注册颜色 token）与 `@source`（扫描 dist 生成工具类）。Tailwind v4 按需生成颜色工具类时，按**当前入口的 `@theme`** 查颜色名；只有 `style.css` 被 `@import` 进「含 `@import "tailwindcss"` 的入口」，它的 `@theme` 才并入该入口、`@source` 才跑在带引擎的上下文里。把它当并行条目或单独扫描，颜色名查不到 → 颜色工具类不生成 → 上述黑边症状。vtu 用 shadcn 命名（`--color-muted/card/foreground/border`），与多数 UI 库（如 Nuxt UI 的 `--ui-*`）不重叠，故全局 `@import` 一般安全、不会互相覆盖。
