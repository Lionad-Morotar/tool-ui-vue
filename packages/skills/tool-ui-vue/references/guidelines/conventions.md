# 约定

## 目录结构

每个组件遵循统一目录结构：

```
<component-name>/
├── index.ts          # 公开导出（组件、类型、schema、parser）
├── index.vue         # 主组件 UI（纯视图绑定）
├── schema.ts         # Zod schemas、类型、Props 接口
├── states/           # Headless 状态逻辑（composable）
│   └── index.ts      # 聚合导出
├── cmpts/            # 子组件
├── composables/      # 可复用 composable
├── i18n/             # 国际化
│   ├── zh-CN.ts
│   └── en.ts
└── __tests__/        # 测试
    └── index.test.ts
```

## 命名规则

| 类别 | 格式 | 示例 |
|------|------|------|
| 组件目录 | kebab-case | `data-table/`, `code-block/` |
| 组件导出 | PascalCase | `DataTable`, `CodeBlock` |
| `defineOptions.name` | `cmpt-` + kebab-case | `cmpt-data-table` |
| Composable | `use` 前缀 | `useDataTable`, `useSort` |
| Provider | `provide` 前缀 | `provideImageGallery` |
| 事件处理函数 | `handle` 前缀 | `handleClick` |

## 类型命名模式

每个组件通常导出以下类型集合：

```ts
// Props 接口（运行时）
export interface DataTableProps { ... }

// Serializable 类型（JSON-safe）
export type SerializableDataTable = z.infer<typeof SerializableDataTableSchema>

// Zod Schema
export const SerializableDataTableSchema = z.object({ ... })

// Parser 函数
export const parseSerializableDataTable: (input: unknown) => DataTable
export const safeParseSerializableDataTable: (input: unknown) => DataTable | null
```

命名规律：
- Props 接口：`XxxProps`
- Serializable 类型：`SerializableXxx`
- Zod Schema：`SerializableXxxSchema`
- Parser：`parseSerializableXxx` / `safeParseSerializableXxx`

## TypeScript

- 严格模式：`strict: true`、`noUnusedLocals`、`noUnusedParameters`
- 始终使用 `<script setup lang="ts">`
- Props 通过 `defineProps<XxxProps>()` 定义
- Emits 通过 `defineEmits<{}>()` 定义
- 强制 type-only imports

## 模板约定

```vue
<template>
  <div
    data-tool-ui-id="cmpt-data-table"
    :data-slot="css?.root ? undefined : undefined"
    :class="cn('...', css?.root)"
  >
    ...
  </div>
</template>
```

关键规则：
- 模板中使用 kebab-case 组件名：`<data-table>` 而非 `<DataTable>`
- Tailwind 类通过 `cn()` 合并（`clsx` + `tailwind-merge`）
- 根元素带 `data-tool-ui-id="cmpt-xxx"` 属性
- 子区域可带 `data-slot` 属性标识

## CSS Prop 系统

每个组件支持 `css` prop，允许外部通过 Tailwind 类字符串覆盖内部样式：

```ts
// schema.ts 中定义
export const DataTableCssSchema = z.object({
  root: z.string().optional(),
  header: z.string().optional(),
  row: z.string().optional(),
  cell: z.string().optional(),
})

// Props 中使用
export interface DataTableProps {
  css?: z.infer<typeof DataTableCssSchema>
}
```

使用方式：

```vue
<DataTable v-bind="data" :css="{ root: 'rounded-xl shadow-lg', header: 'bg-gray-100' }" />
```

## Import 排序

1. builtin + external（`vue`, `zod`）
2. 内部（`@/`, `~/`, `@lionad/vtu-*`）
3. 父级/兄弟/当前目录
4. type imports

同组内按字母排序。

## ESLint

- 单引号
- 未使用变量以 `_` 前缀
- BEM 风格 Tailwind 类排序（通过自定义 `eslint-plugin-v-tw-merge`）
