# 组件使用

## 安装

```bash
pnpm add @lionad/vtu-components
```

导入主题 tokens：

```ts
import '@lionad/vtu-components/tokens.css'
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

1. 确认 `@lionad/vtu-components/tokens.css` 已导入
2. 确认 Tailwind v4 扫描到组件源码（检查 `@source` 指令或 `content` 配置）
3. 确认 `data-theme="dark"` 已设置（如需 dark mode）
