# 编码约定

**分析日期:** 2026-04-18

## 命名规范

**文件:**
- 组件主文件: `index.vue` — 放在以 kebab-case 组件名命名的目录下，如 `packages/components/src/code-block/index.vue`
- Schema 文件: `schema.ts` — 每个组件目录下一个，如 `packages/components/src/code-block/schema.ts`
- 状态逻辑: `states/useXxx.ts` — 以 `use` 前缀的 composable，如 `packages/components/src/code-block/states/useCodeBlock.ts`
- 子组件: `cmpts/xxx.vue` — kebab-case 命名，如 `packages/components/src/weather-widget/cmpts/weather-data-overlay.vue`
- 导出桶: `index.ts` — 每个组件目录、states、i18n 目录下各一个
- i18n 消息: `i18n/zh-CN.ts` / `i18n/en.ts` — 固定文件名，导出 `zhCN` / `en` 常量
- 测试文件: `__tests__/xxx.test.ts` — 每个组件目录下的 `__tests__` 子目录

**函数/Composable:**
- 状态 composable: `useXxx` — 如 `useCodeBlock`、`useOptionList`、`useWeatherWidget`
- 工具函数: camelCase — 如 `cn()`、`prefersReducedMotion()`、`formatZodError()`
- 解析函数: `parseSerializableXxx` / `safeParseSerializableXxx` — 如 `parseSerializableCodeBlock`

**常量:**
- Zod Schema: PascalCase + Schema 后缀 — 如 `CodeBlockPropsSchema`、`SerializableCodeBlockSchema`
- TypeScript 类型: PascalCase — 如 `CodeBlockProps`、`SerializableCodeBlock`
- CSS Schema: XxxCssSchema — 如 `CodeBlockCssSchema`
- i18n 导出: `zhCN` / `en` / `zhCNAll` / `enAll`

**组件注册名:**
- 所有组件使用 `defineOptions({ name: 'CmptXxx', inheritAttrs: false })` 注册
- 前缀 `Cmpt` + PascalCase 组件名，如 `CmptCodeBlock`、`CmptWeatherWidget`、`CmptItemCard`
- 模板中使用 kebab-case 引用: `<effect-compositor>`、`<weather-data-overlay>`

## 组件架构模式

### Headless Composable 分层

每个组件严格遵循三层分离:

```
component-name/
├── schema.ts          # 数据契约层：Zod Schema + TS 类型 + Props 接口
├── states/            # 逻辑层：composable 封装所有业务逻辑
│   ├── index.ts       # 桶导出
│   └── useCodeBlock.ts
├── i18n/              # 国际化：zh-CN.ts + en.ts
│   ├── zh-CN.ts
│   └── en.ts
├── cmpts/             # 子组件（可选，仅复杂组件）
│   └── xxx.vue
├── __tests__/         # 测试
│   └── index.test.ts
├── index.vue          # 视图层：仅模板 + 最小绑定
└── index.ts           # 导出桶
```

**关键规则:**
- `index.vue` 只做 `reactive(useXxx(props))` + 模板渲染，不含业务逻辑
- 所有状态、computed、事件处理放在 `states/useXxx.ts`
- Schema 和类型放在 `schema.ts`，不放在 composable 中

### index.vue 标准结构

```vue
<script setup lang="ts">
import { cn } from '../core';
import { useI18n } from '../core/i18n';
import { reactive } from 'vue';
import { useXxx } from './states';
import type { XxxProps } from './schema';

defineOptions({ name: 'CmptXxx', inheritAttrs: false })

const props = withDefaults(defineProps<XxxProps>(), {
  css: () => ({}),
})

const emit = defineEmits<{
  change: [value: XxxType];
  action: [actionId: string, value: XxxType];
}>()

const { t } = useI18n()

// 所有业务逻辑委托给 states 层
const state = reactive(useXxx(props, emit))
</script>
```

### 根元素属性约定

所有组件根元素必须包含:
- `data-slot="xxx"` — 组件标识（kebab-case），如 `data-slot="code-block"`
- `:data-tool-ui-id="id"` — 唯一实例标识
- `v-bind="$attrs"` — 透传属性（配合 `inheritAttrs: false`）

## Zod Schema 约定

### 标准 Schema 结构

每个组件的 `schema.ts` 包含:

```typescript
// 1. CSS Schema（可选的样式覆盖）
export const XxxCssSchema = z.object({
  root: z.string().optional(),
  header: z.string().optional(),
  content: z.string().optional(),
});
export type XxxCss = z.infer<typeof XxxCssSchema>;

// 2. Props Schema（完整 props 验证）
export const XxxPropsSchema = z.object({
  id: ToolUIIdSchema,
  role: ToolUIRoleSchema.optional(),
  receipt: ToolUIReceiptSchema.optional(),
  // ... 组件特有字段
  css: XxxCssSchema.optional().default({}),
});

// 3. TypeScript Props 接口（手写，非 z.infer）
export interface XxxProps {
  id: string;
  // ...
  css?: XxxCss;
}

// 4. Serializable Schema（JSON 安全版本，排除 css）
export const SerializableXxxSchema = XxxPropsSchema.omit({ css: true });

// 5. 类型导出
export type SerializableXxx = z.infer<typeof SerializableXxxSchema>;

// 6. Contract + 解析函数
const contract = defineToolUiContract('Xxx', SerializableXxxSchema);
export const parseSerializableXxx = contract.parse;
export const safeParseSerializableXxx = contract.safeParse;
```

### 核心共享 Schema

来源: `packages/components/src/core/schema.ts`

- `ToolUIIdSchema`: `z.string().min(1)` — 必需的唯一 ID
- `ToolUIRoleSchema`: `z.enum(['information','decision','control','state','composite'])` — 可选角色
- `ToolUIReceiptSchema`: `{ outcome, summary, identifiers?, at }` — 可选收据
- `ActionSchema`: `{ id, label, sentence?, variant?, icon?, loading?, disabled? }`
- `SerializableActionsConfigSchema`: `{ items: Action[], align?, confirmTimeout? }`

### Schema 复杂验证

使用 `superRefine` 进行跨字段验证:

```typescript
export const OptionListPropsSchema = OptionListPropsSchemaBase.superRefine(
  validateOptionListInvariants,
);
```

`validateOptionListInvariants` 检查: minSelections <= maxSelections、选项 ID 唯一、选中项在选项中存在。

## CSS 样式约定

### css prop 对象模式

不使用 className prop，而是通过 `css` 对象传递样式覆盖:

```typescript
interface XxxCss {
  root?: string;
  header?: string;
  content?: string;
  copyButton?: string;
}
```

模板中通过 `cn()` 合并:

```vue
:class="cn('base-classes', css?.root)"
```

### cn() 工具函数

来源: `packages/components/src/core/utils.ts`

```typescript
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(...inputs))
}
```

所有 Tailwind CSS 类合并必须通过 `cn()` 处理，支持冲突解决和条件类。

### Tailwind CSS v4 约定

- 使用 `@container` 响应式前缀: `@container/option-list`、`@[240px]/actions`
- 使用 `motion-safe:` 前缀处理动画降级: `motion-safe:animate-in`
- 使用语义色彩 token: `bg-card`、`text-foreground`、`border-border`、`text-muted-foreground`
- 暗色主题: `dark:text-green-400`

## i18n 约定

### 消息文件结构

每个组件的 `i18n/zh-CN.ts`:

```typescript
export const zhCN = {
  codeBlock: {
    copied: '已复制',
    copyCode: '复制代码',
    showAllLines: '显示全部 {count} 行',
    collapse: '收起',
  },
} as const
```

- 顶层 key 为组件名（camelCase）: `codeBlock`、`optionList`、`weatherWidget`
- 支持 `{param}` 插值
- 导出 `as const` 保证类型安全

### useI18n 使用模式

```typescript
const { t } = useI18n()

// 模板中（自动解包 ComputedRef）
{{ t('codeBlock.showAllLines', { count: lineCount }) }}

// 属性绑定中（需要 computed 解包）
const ariaLabel = computed(() => t('codeBlock.copied').value)
```

- `t()` 返回 `ComputedRef<string>`，模板中自动解包
- 属性绑定中需要 `.value` 访问或通过 `computed` 包装
- 默认 locale: `zh-CN`
- 测试中通过 `registerEnglish()` 切换到 `en`

### 消息聚合

来源: `packages/components/src/i18n/index.ts`

- `zhCNAll` / `enAll` 合并所有组件消息（23 个组件各两份）
- `registerEnglish()` 原子切换 locale + messages
- 自动注册 zh-CN 为默认（非显式配置时）

## 代码风格

### 格式化工具
- 无 Prettier，由 ESLint 规则控制格式

### ESLint 规则

来源: `eslint.config.mjs`

**强制规则:**
- 单引号: `quotes: ['error', 'single']`
- 2 空格缩进（Vue HTML）: `vue/html-indent: ['error', 2]`
- 单行最多 3 属性: `vue/max-attributes-per-line: ['error', { singleline: { max: 3 } }]`
- 模板中 kebab-case 组件名: `vue/component-name-in-template-casing: ['error', 'kebab-case']`
- Type import 分离: `@typescript-eslint/consistent-type-imports: ['error', { prefer: 'type-imports', fixStyle: 'separate-type-imports' }]`
- 导入排序（字母升序）: `import-x/order` 按 `[builtin/external, internal, parent/sibling/index, type]` 分组

**自定义插件:**
- `bem-order/bem-order`: BEM CSS 类排序（warn）
- `i18n/key-consistency`: i18n key 一致性检查（error）
- `tailwindcss/classnames-order`: Tailwind 类名排序（warn）
- `tailwindcss/no-contradicting-classname`: 矛盾类名检测（error）
- `v-tw-merge/v-tw-merge`: 已关闭（项目未使用 vue directive 版本）

### TypeScript

- `no-explicit-any: 'warn'` — 允许但警告
- `no-unused-vars: ['warn', { argsIgnorePattern: '^_' }]` — 下划线前缀忽略
- Props 接口手写，不依赖 `z.infer`（保持灵活性）
- 类型导入使用 `import type { ... }` 分离写法

### Vue 特定

- `<script setup lang="ts">` — 所有 SFC 使用 setup 语法
- `defineOptions({ name: 'CmptXxx', inheritAttrs: false })` — 所有组件必须声明
- `v-html` 允许使用（code-block/terminal 需要渲染原始 HTML）
- `withDefaults(defineProps<XxxProps>(), { css: () => ({}) })` — css 默认空对象

## 错误处理

### 解析层

来源: `packages/components/src/core/parse.ts`

```typescript
// 抛出可读错误
parseWithSchema(schema, input, 'ComponentName')
// → Error: "Invalid ComponentName payload: path: message"

// 安全解析（流式数据）
safeParseWithSchema(schema, input)
// → T | null
```

### Composable 层

- 使用 `try/catch` 包裹异步操作，fallback 到降级状态
- 不吞掉错误但也不中断渲染

```typescript
// packages/components/src/code-block/states/useCodeBlock.ts
try {
  const html = highlighter.codeToHtml(code, { ... });
  setCachedHtml(cacheKey, html);
  highlightedHtml.value = html;
} catch {
  // Fallback to escaped text
  const escaped = code.replace(/&/g, '&amp;')...;
  highlightedHtml.value = `<pre><code>${escaped}</code></pre>`;
} finally {
  isLoading.value = false;
}
```

### i18n 回退

- 缺少 key → 返回 key 字符串本身
- 无 LocaleProvider → fallback 到内置 zh-CN
- DEV 模式输出 `console.warn`

## 导出约定

### 组件导出桶 (index.ts)

```typescript
import CodeBlock from './index.vue'
export { CodeBlock }
export default CodeBlock

export type {
  CodeBlockProps,
  SerializableCodeBlock,
  CodeBlockLineNumbersMode,
} from './schema';
export {
  CodeBlockPropsSchema,
  SerializableCodeBlockSchema,
  parseSerializableCodeBlock,
  safeParseSerializableCodeBlock,
} from './schema';
```

每个组件同时导出: Vue 组件 + Props 类型 + Serializable 类型 + Zod Schema + 解析函数

## 导入组织

**顺序（`import-x/order` 强制）:**
1. `builtin` + `external`（vue、zod、第三方库）
2. `internal`（`@/`、`~/**`、`#/**` 别名 + `../core`）
3. `parent`、`sibling`、`index`（相对路径）
4. `type` 导入（`import type { ... }`）

**组间无空行:** `newlines-between: 'never'`

**按字母排序:** 升序，每组内不区分大小写

## 注释和文档约定

**JSDoc 使用:**
- `schema.ts` 文件顶部的模块级注释解释 schema 用途
- 公共工具函数有 JSDoc 块
- 内联注释解释非明显的逻辑

**ESLint 配置中的节:**
- 用 `// ========== Section ==========` 注释分隔

## 特殊目录

**`src/stories/`（Histoire story 文件）:**
- ESLint 规则放宽: `no-export-in-script-setup`、`valid-template-root`、`multi-word-component-names`

---

*约定分析: 2026-04-18*
