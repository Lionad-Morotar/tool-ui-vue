# Coding Conventions

**分析日期：** 2026-04-03

## 代码风格

**格式化工具/检查器：** `eslint` 配合 `typescript-eslint` + `eslint-plugin-vue` + `eslint-plugin-tailwindcss` + `eslint-plugin-import-x`

**配置文件：** `eslint.config.mjs`

**关键设置：**
- 通过 `projectService: true` 对 `.vue` 文件启用类型感知检查
- Vue 解析器：`vue-eslint-parser`，`<script>` 块使用 `typescript-eslint` 解析器
- 强制使用单引号：`quotes: ['error', 'single', { avoidEscape: true }]`
- 允许未使用变量前缀 `_`

**运行命令：**
```bash
pnpm lint        # eslint . --fix
pnpm check       # pnpm lint && pnpm typecheck
```

## 命名规范

**组件（导出）：**
- 组件名使用 PascalCase：`Citation`、`Audio`、`MessageDraft`
- 内部组件名通过 `defineOptions({ name: 'cmpt-citation' })` 设置，使用带 `cmpt-` 前缀的 kebab-case
- 组件目录使用 kebab-case：`message-draft/`、`stats-display/`、`weather-widget/`
- 子组件放在 `cmpts/` 目录：`cmpts/citation-list.vue`

**文件：**
- Vue SFC：`index.vue`（主组件）、`*.vue`（子组件）
- Barrel 文件：`index.ts` 导出组件 + 类型 + schema 函数
- Schema 文件：`schema.ts`（每个组件）
- Story 文件：`src/stories/` 中的 `*.story.vue`
- 测试文件：`__tests__/index.test.ts` 或 `__tests__/ComponentName.test.ts`
- 工具文件：kebab-case `.ts` 文件

**函数：**
- 函数使用 camelCase：`handleClick()`、`formatDate()`、`createProps()`
- 事件处理函数前缀 `handle`：`handleMouseEnter`、`handleSeekStart`
- Composables 前缀 `use`：`useAudio`、`useLocalAudio`、`useMediaControls`
- Provider 函数前缀 `provide`：`provideAudio`

**变量：**
- 变量使用 camelCase
- 常量使用大写下划线（模块级常量）：`FALLBACK_LOCALE = 'en-US'`
- Ref 使用纯 camelCase：`isPopoverOpen`、`audioRef`

**类型：**
- Props 接口：`XxxProps`（如 `CitationProps`、`AudioProps`）
- Serializable schema 类型：`SerializableXxx`（如 `SerializableCitation`）
- 变体/枚举类型使用 PascalCase：`CitationType`、`AudioVariant`
- Zod schemas 使用 PascalCase + `Schema` 后缀：`CitationTypeSchema`、`SerializableAudioSchema`
- Parser 函数使用 camelCase：`parseSerializableXxx`、`safeParseSerializableXxx`

## TypeScript 使用

**严格性：**
- `tsconfig.json` 中 `strict: true`
- `noUnusedLocals: true`
- `noUnusedParameters: true`
- `isolatedModules: true`

**类型导入：**
- 必须使用 `type` 导入（`@typescript-eslint/consistent-type-imports` 强制）
- 类型导入通过 `import-x/order` 单独分组并放在最后

**Vue SFC script 块：**
- 始终使用 `<script setup lang="ts">`
- Props 使用 `defineProps<PropsType>()` 定义
- Emits 使用 `defineEmits<{ eventName: [arg: Type] }>()` 定义
- 组件选项通过 `defineOptions({ name: '...', inheritAttrs: false })` 设置

**Schema-driven 契约：**
- 每个组件都有一个 `schema.ts`，包含：
  - Zod schema：`SerializableXxxSchema`
  - 类型导出：`export type SerializableXxx = z.infer<typeof SerializableXxxSchema>`
  - Parser：`parseSerializableXxx`
  - Safe parser：`safeParseSerializableXxx`
- 使用 `src/shared/contract.ts` 中的 `defineToolUiContract(componentName, schema)` 构建解析器

## 注释和文档约定

**JSDoc 使用：**
- `schema.ts` 文件顶部的模块级注释解释 schema 用途
- `src/shared/utils.ts` 中的公共工具函数有 JSDoc 块
- 内联注释解释非明显的逻辑（如净化原理）

**代码块标记：**
- ESLint 配置中的节用 `// ========== Section ==========` 注释分隔

**测试注释：**
- 测试使用带 ID 的块注释：`/** TEST-PLAYGROUND-01: Description */`
- Story 变体在 Histoire `Variant` 组件中有描述性标题

## 导入组织

**顺序（`import-x/order` 强制）：**
1. `builtin` + `external`
2. `internal`（包括 `@/` 和 `~/` 别名）
3. `parent`、`sibling`、`index`
4. `type` 导入

**组间无空行：** `newlines-between: 'never'`

**按字母排序：** 升序，每组内不区分大小写

**别名：**
- `@/` → `src/`（在 `vite.config.ts` 和 `vitest.config.ts` 中配置）

## Vue 模板约定

**模板中的组件大小写：**
- `vue/component-name-in-template-casing` 强制 kebab-case
- 示例：`<audio id="audio-basic" src="..." />`

**Tailwind 类：**
- 使用 `src/utils/index.ts` 中的 `cn()` 合并（使用 `clsx` + `tailwind-merge`）
- 复杂情况优先多行 class 绑定
- BEM 风格排序由自定义 `bem-order/bem-order` 规则强制执行（警告）

**可访问性：**
- 交互元素有 `type="button"`
- 装饰图片使用 `alt=""` + `aria-hidden="true"`
- 仅图标按钮的 ARIA 标签：`:aria-label="state.playing ? 'Pause' : 'Play'"`

## 错误处理

**模式：**
- 安全回退用空 catch 的 try/catch：`try { ... } catch { return undefined }`
- 外部数据验证用 Zod `safeParse`

## 特殊目录

**`src/components/.example/`：**
- ESLint 忽略
- 包含不属于构建的示例/参考组件

**`src/stories/`：**
- Histoire story 文件
- ESLint 规则放宽：`no-export-in-script-setup`、`valid-template-root`、`multi-word-component-names`

---

*约定分析：2026-04-03*
