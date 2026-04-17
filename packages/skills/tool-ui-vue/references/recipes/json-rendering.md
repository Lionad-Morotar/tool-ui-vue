# JSON 渲染

## 概述

`@lionad/vtu-renderer` 包提供 JSON 驱动的组件渲染能力。基于 `@json-render/core` 和 `@json-render/vue`，将 JSON spec 动态渲染为 Vue 组件。

适用场景：
- LLM 工具调用返回组件数据，前端动态渲染
- 低代码平台通过 JSON schema 驱动 UI
- 需要运行时决定渲染哪些组件的场景

## VtuRenderer

主渲染组件：

```vue
<script setup lang="ts">
import { VtuRenderer } from '@lionad/vtu-renderer'
import type { Spec } from '@json-render/core'

const spec: Spec = {
  component: 'CodeBlock',
  props: {
    code: "console.log('hello')",
    language: 'javascript',
    filename: 'hello.js',
  },
}
</script>

<template>
  <VtuRenderer :spec="spec" />
</template>
```

### Props

| Prop | 类型 | 说明 |
|------|------|------|
| `spec` | `Spec` | 渲染规格（组件名 + props） |
| `handlers` | `Record<string, (...args) => unknown>` | 自定义动作处理器 |
| `initialState` | `Record<string, unknown>` | 初始状态 |

## Catalog

Catalog 注册所有组件的 Serializable Schema：

```ts
import { catalog, type AppCatalog } from '@lionad/vtu-renderer'

// catalog 包含 27 个组件的 schema 定义
// 每个 entry: { props: SerializableXxxSchema, slots: [], description: string }
```

Catalog 用于：
- 验证 JSON spec 的 props 是否合法
- 为 LLM 提供组件 schema 信息（通过 MCP server）
- 自动补全和类型检查

## Registry

Registry 将组件名映射到 Vue 组件渲染器：

```ts
import { registry } from '@lionad/vtu-renderer'

// 内部使用 defineRegistry(catalog, { components }) 创建
// 每个组件通过 createRenderer(Component) 包装
// 再通过 withErrorBoundary() 包裹，提供错误降级
```

## 错误边界

每个组件渲染器都被 `withErrorBoundary` HOC 包裹：

```ts
import { withErrorBoundary } from '@lionad/vtu-renderer'
import ErrorBoundary from './error-boundary.vue'

// 如果组件渲染出错，ErrorBoundary 会捕获并显示降级 UI
```

这确保单个组件的错误不会影响整个渲染树。

## 完整示例

```vue
<script setup lang="ts">
import { VtuRenderer } from '@lionad/vtu-renderer'
import type { Spec } from '@json-render/core'
import { ref } from 'vue'

const specs = ref<Spec[]>([
  {
    component: 'WeatherWidget',
    props: {
      id: 'weather-hz',
      location: { name: '杭州' },
      current: { temperature: 22, conditionCode: 'clear' },
    },
  },
  {
    component: 'DataTable',
    props: {
      id: 'expenses-q3',
      title: 'Q3 支出',
      columns: [
        { key: 'name', label: '名称' },
        { key: 'amount', label: '金额' },
      ],
      data: [
        { name: '服务器', amount: '¥12,000' },
        { name: '域名', amount: '¥200' },
      ],
    },
  },
])

function handleAction(action: string, ...args: unknown[]) {
  console.log('Action:', action, args)
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <VtuRenderer
      v-for="(spec, i) in specs"
      :key="i"
      :spec="spec"
      :handlers="{ submit: handleAction }"
    />
  </div>
</template>
```

## 包依赖

```bash
pnpm add @lionad/vtu-renderer @json-render/core @json-render/vue
```

> `@lionad/vtu-components` 是唯一需要安装的包，包含所有组件、类型和主题 tokens。
