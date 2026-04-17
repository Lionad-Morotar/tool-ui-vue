# Schema 与契约（Contract）

## defineToolUiContract

每个组件通过 `defineToolUiContract<T>()` 创建标准化契约对象：

```ts
// @lionad/vtu-components 中的 contract.ts
export interface ToolUiContract<T> {
  schema: z.ZodType<T>
  parse: (input: unknown) => T          // 无效时抛出异常
  safeParse: (input: unknown) => T | null // 无效时返回 null
}

export function defineToolUiContract<T>(
  componentName: string,
  schema: z.ZodType<T>,
): ToolUiContract<T>
```

## Serializable vs Props

**核心区分**：Serializable schema 是 JSON-safe 的，用于 LLM 工具调用数据传输。Props 是运行时完整接口。

| | Serializable Schema | Props Interface |
|---|---|---|
| **用途** | LLM JSON 输出验证、API 传输 | Vue 组件运行时 |
| **包含 css** | 否 | 是 |
| **包含回调** | 否（`onXxx`） | 是 |
| **命名** | `SerializableXxxSchema` | `XxxProps` |
| **来源** | Zod schema 定义 | 基于 schema 扩展 |

示例（以 OptionList 为代表）：

```ts
// JSON-safe，用于 AI/LLM pipeline
export const SerializableOptionListSchema = z.object({
  title: z.string(),
  options: z.array(OptionListOptionSchema),
  // 无 css、无 onXxx
})

// 运行时完整接口
export interface OptionListProps {
  title: string
  options: OptionListOption[]
  css?: { root?: string; option?: string }
  onSelect?: (selection: OptionListSelection) => void
}
```

## parse vs safeParse

```ts
// 抛出异常 — 用于受控上下文（服务端验证、开发调试）
const data = parseSerializableDataTable(input)

// 返回 null — 用于流式/工具调用上下文（数据可能不完整）
const data = safeParseSerializableDataTable(input)
if (!data) return null
```

`safeParse` 适用于 assistant-ui 的 `render` 函数，因为 `args` 是流式传入的，在工具调用完成前可能不完整。

## Action 模式

### ActionSchema

定义操作按钮：

```ts
const ActionSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  sentence: z.string().optional(),      // 操作后助手 narration
  variant: z.enum(['default', 'destructive', 'secondary', 'ghost', 'outline']).optional(),
  icon: z.string().optional(),          // Lucide 图标名
  loading: z.boolean().optional(),
  disabled: z.boolean().optional(),
})
```

### DecisionResultSchema

有后果的决策产生结构化结果：

```ts
const DecisionResultSchema = z.object({
  kind: z.literal('decision'),
  version: z.literal(1),
  decisionId: z.string().min(1),
  actionId: z.string().min(1),
  actionLabel: z.string().min(1),
  at: z.iso.datetime(),
  payload: z.record(z.string(), z.unknown()).optional(),
})
```

工厂函数：

```ts
import { createDecisionResult } from '@lionad/vtu-components'

const result = createDecisionResult({
  decisionId: 'approval-001',
  action: { id: 'confirm', label: '确认' },
  payload: { reason: '预算内' },
})
```

### ActionsConfig

批量操作配置：

```ts
// Serializable 版本（JSON-safe）
const SerializableActionsConfigSchema = z.object({
  items: z.array(SerializableActionSchema).min(1),
  align: z.enum(['left', 'center', 'right']).optional(),
  confirmTimeout: z.number().positive().optional(),
})
```

## ToolUISurface 基础 Schema

所有工具 UI 的基础结构：

```ts
const ToolUISurfaceSchema = z.object({
  id: ToolUIIdSchema,                    // 稳定唯一标识
  role: ToolUIRoleSchema.optional(),     // information | decision | control | state | composite
  receipt: ToolUIReceiptSchema.optional(), // 结果回执
})
```

`ToolUIId` 建议格式：`{component-type}-{semantic-identifier}`，如 `"data-table-expenses-q3"`。

## Receipt 模式

操作完成后生成的持久化摘要：

```ts
const ToolUIReceiptSchema = z.object({
  outcome: z.enum(['success', 'partial', 'failed', 'cancelled']),
  summary: z.string().min(1),
  identifiers: z.record(z.string(), z.string()).optional(),
  at: z.iso.datetime(),
})
```

使用场景：审批卡片确认后、偏好面板提交后等需要"结果快照"的场景。

## Schema-first 开发流程

1. 在 `schema.ts` 中定义 `SerializableXxxSchema`
2. 用 `z.infer` 生成 TypeScript 类型
3. 创建 `XxxProps` 接口（扩展 Serializable 类型 + css + 回调）
4. 调用 `defineToolUiContract()` 创建 parse/safeParse
5. 实现 `index.vue`（视图）和 `states/`（逻辑）
