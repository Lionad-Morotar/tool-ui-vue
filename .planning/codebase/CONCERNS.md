# Codebase Concerns

**分析日期：** 2026-04-03

## 技术债务

### TypeScript 类型错误（构建损坏）
- **问题：** `pnpm typecheck` 失败，有 22+ TypeScript 错误。生产构建中这些错误被掩盖，因为 `vite.config.ts` 中 `vite-plugin-dts` 配置了 `skipDiagnostics: true`。
- **文件：**
  - `src/components/order-summary/index.ts:19,24` — 将 Vue SFC（`OrderSummaryRoot`）作为普通函数调用。Vue 组件不可调用；此模式仅在 React 中有效。
  - `src/components/order-summary/index.vue:120,147,236` — 传递 `:cols="false"` 但期望 `Numberish | undefined`。
  - `src/components/question-flow/index.vue:25-27` — 在联合类型上访问判别属性（`step`、`options`、`choice`）而不缩小范围，导致 TS2339 错误，因为 `withDefaults` 抹去了判别结构。
  - `src/components/stats-display/index.ts:3` — 从 `./cmpts/sparkline.vue` 导入命名类型 `SparklineProps`。SFC 文件不以此方式导出命名类型。
  - `src/components/video/index.vue:114` — 测试 `void` 表达式（`mediaControls.mute()`）的真值。
  - `src/components/weather-widget/composables/useGlassStyles.ts:215` — 在期望 `GlassStyles` 的地方分配 `Ref<GlassStyles>`。
  - `src/components/weather-widget/effects/index.ts:1,26,46` — 仍从已删除的 React 文件（`effect-compositor`、`weather-effects-canvas`、`glass-panel-svg`）导出。此文件是死/僵尸代码。
  - `src/stories/_shared/wrappers.vue:86` — `h()` 调用签名无效（`unknown` 类型参数不可分配给 `RawSlots | RawChildren`）。
  - `src/stories/audio.story.vue:4`、`src/stories/image.story.vue:4`、`src/stories/video.story.vue:4` — 声明但未读取的组件导入。
  - `src/stories/data-table.story.vue:278` — 使用 `compact` 属性，但货币格式化器 schema 中不存在。
  - `src/stories/terminal.story.vue:57` — 在不保证存在的联合类型上访问 `.default`。
  - `src/test/setup.ts:41` — 不完整的 `CanvasRenderingContext2D` mock（缺少 50+ 必需属性）。
- **影响：** 类型安全受损；消费者可能收到损坏的 `.d.ts` 文件。
- **修复方法：**
  1. 从 `vite.config.ts` 中移除 `skipDiagnostics: true`，在 CI 中暴露错误。
  2. 通过返回 `h(OrderSummaryRoot, props)` 而非将其作为函数调用来修复 `order-summary/index.ts`。
  3. 在访问模式特定 props 之前，通过 `zod` 解析或显式类型守卫缩小范围来修复 `question-flow`。
  4. 将 `SparklineProps` 移入 `schema.ts` 或在 `sparkline.vue` 中用 `export interface SparklineProps` 显式声明。
  5. 将 `!previousMuted.value && mediaControls.mute()` 替换为 `if (!previousMuted.value) mediaControls.mute()`。
  6. 删除或重新生成 `weather-widget/effects/index.ts`（它引用了已移除的 React 文件）。

### Weather Widget 中的僵尸 React 导出
- **问题：** `src/components/weather-widget/effects/index.ts` 从 React → Vue 迁移清理（P0 任务）期间删除的文件导出符号。
- **文件：** `src/components/weather-widget/effects/index.ts`
- **影响：** 破坏从此 barrel 导入的任何人的 `tsc`，且死代码仍保留在发布的包中。
- **修复方法：** 删除整个文件或重写为仅导出剩余的 TypeScript 模块（`types.ts`、`canvas-resolver.ts` 等）。

### ESLint 错误阻塞 CI
- **问题：** `pnpm lint` 以代码 1 退出。
- **文件：**
  - `src/components/weather-widget/cmpts/effect-compositor.vue:2` — `import-x/order` 错误（导入组间空行）。
  - `src/components/message-draft/cmpts/message-draft.vue:13-16` — 可选回调 props（`undoGracePeriod`、`onSend`、`onUndo`、`onCancel`）的 `vue/require-default-prop` 警告。
  - `src/components/option-list/index.vue:8` — `modelValue` 的 `vue/require-default-prop` 警告。
- **影响：** Lint 步骤不能用作 CI 门禁。
- **修复方法：** 修复 `effect-compositor.vue` 中的空导入行。对于回调 props，要么提供显式默认值（`default: undefined`），要么每文件禁用规则。对于 `modelValue`，添加 `default: undefined`。

### Playground E2E 模块解析失败
- **问题：** `pnpm test` 因来自 `playground/e2e/playground-loads.test.ts` 的未处理拒绝而失败。
- **文件：** `playground/e2e/playground-loads.test.ts`
- **错误：** `ERR_MODULE_NOT_FOUND` — `@vue-leaflet/vue-leaflet` 在其 CJS 构建中尝试导入 `leaflet/dist/leaflet-src.esm`（缺少 `.js` 扩展名）。
- **影响：** 测试表面上通过（39 个测试文件，1037 个测试），但 8 个未处理拒绝污染 CI 输出，可能掩盖真实失败。
- **修复方法：** 通过 `pnpm patch` 修补 `@vue-leaflet/vue-leaflet` 或添加 Vitest 别名将 `leaflet/dist/leaflet-src.esm` → `leaflet/dist/leaflet-src.esm.js`。

## 已知 Bug

### QuestionFlow 联合类型 Prop 访问
- **症状：** `question-flow/index.vue` 中的模板表达式如 `props.step !== undefined` 产生 TypeScript 错误，因为 `QuestionFlowProps` 是三个形状（`progressive` | `upfront` | `receipt`）的联合。`withDefaults` 后，TypeScript 无法缩小类型范围。
- **文件：** `src/components/question-flow/index.vue:25-27`、`src/components/question-flow/schema.ts`
- **触发：** 运行 `vue-tsc --noEmit`。
- **变通方案：** 无。组件在 Vite 中编译（使用较宽松的 TS 检查），但严格类型检查失败。

### OrderSummary 复合组件模式损坏
- **症状：** `OrderSummaryDisplay` 和 `OrderSummaryReceipt` 包装器尝试将 Vue SFC 作为函数调用。
- **文件：** `src/components/order-summary/index.ts:18-25`
- **触发：** TypeScript 编译；在 SSR 或测试环境中也可能运行时失败。
- **变通方案：** 使用 `h(OrderSummaryRoot, props)` 或重写为包装器组件。

## 安全考虑

### Terminal / CodeBlock 中无输出净化
- **风险：** `Terminal` 和 `CodeBlock` 通过 `v-html` 渲染原始 HTML（虽有理由但仍存在风险）。
- **文件：** `src/components/terminal/index.vue`、`src/components/code-block/index.vue`
- **当前缓解：** `eslint` 全局禁用 `vue/no-v-html`。未使用客户端 DOM 净化器（如 DOMPurify）。
- **建议：** 记录消费者必须在服务器端净化输入。考虑添加 `sanitize` prop，当为 `true` 时运行 DOMPurify 或类似工具。

## 性能瓶颈

### 库输出中的庞大 Shiki Bundle
- **问题：** `dist/` 文件夹包含来自 Shiki 的约 200 个语言/主题 bundle，因为 `shiki` 作为运行时依赖被打包。
- **文件：** `dist/*`（每个语法高亮语言的数百个 `*.js`/`*.cjs` 文件）
- **原因：** `vite.config.ts` 将 `shiki` 打包入库。`CodeBlock` 和 `Terminal` 可能执行按需 `shiki` 导入或使用完整 bundle。
- **改进路径：**
  1. 在 `vite.config.ts` 中将 `shiki` 标记为 `external`，让消费者提供自己的高亮器实例。
  2. 或将 `CodeBlock` / `Terminal` 拆分为单独的子包，不需要语法高亮的用户无需承担 bundle 成本。
  3. 或使用 `shiki` 的 `createHighlighterCore` 并显式注册语言以 tree-shake 未使用的语法。

### 超大 SFC 组件
- **问题：** 多个 SFC 超过 500–1000 行，难以审查、测试和维护。
- **文件：**
  - `src/components/parameter-slider/index.vue` (1071 行)
  - `src/components/data-table/index.vue` (930 行)
  - `src/components/question-flow/index.vue` (742 行)
  - `src/components/preferences-panel/index.vue` (619 行)
- **改进路径：** 将 composables、展示性子组件和工具函数提取到组件目录内的单独文件中。

### WeatherWidget 中的 WebGL Canvas（运行时成本）
- **问题：** 即使 `effects.enabled` 为 `false` 或在低功耗设备上，`WeatherWidget` 也会挂载带基于着色器天气效果的 WebGL canvas。
- **文件：** `src/components/weather-widget/cmpts/weather-effects-canvas.vue`、`src/components/weather-widget/composables/useWeatherEffects.ts`
- **改进路径：** 效果禁用时完全跳过 canvas 初始化。在创建 WebGL 上下文前添加 `prefers-reduced-motion` / 电池电量检查。

## 脆弱区域

### Courier 模式：组件 Barrels 与 SFC 重新导出混合
- **文件：** `src/components/order-summary/index.ts`、`src/components/stats-display/index.ts`、`src/components/index.ts`
- **脆弱原因：** `index.ts` barrels 有时默认导出 `.vue` SFC，有时用普通函数包装。更改一种模式会破坏导入站点。
- **安全修改：** 始终使用 `export { default as ComponentName } from './index.vue'` 或命名包装器组件（另一个 `.vue` 文件），绝不用普通函数。

### 测试 Mocks 依赖实现内部
- **文件：** `src/test/setup.ts`、`src/components/geo-map/__tests__/index.test.ts`
- **脆弱原因：** Leaflet 和 WebGL mocks 是手写的且不完整。`vue-leaflet` 或 WebGL 使用的任何更改都可能导致晦涩的测试失败。
- **测试覆盖缺口：** Canvas 2D 上下文仅部分 mock；任何使用 `ctx.fill()`、`ctx.arc()` 等的组件都会在测试中抛出。

## 扩展限制

### 库入口点导出所有内容
- **当前容量：** `src/components/index.ts` 在一个 barrel 中重新导出所有 27 个组件以及 schemas、类型和解析器。
- **限制：** 如果 bundler 不支持深度重新导出分析，消费者无法 tree-shake 未使用的 schemas/parsers。barrel 还会产生大量类型检查开销。
- **扩展路径：** 将导出拆分为分类 barrels（如 `tool-ui-vue/media`、`tool-ui-vue/social`、`tool-ui-vue/data`）或依赖直接组件导入（`tool-ui-vue/components/option-list`）。

## 依赖风险

### `@vue-leaflet/vue-leaflet` ESM/CJS 不匹配
- **风险：** 包在其 CJS 构建中导入 `leaflet/dist/leaflet-src.esm` 而不带 `.js` 扩展名，导致 Node/Vitest 环境中 `ERR_MODULE_NOT_FOUND`。
- **影响：** 破坏 playground 测试和任何 SSR 使用。
- **迁移计划：** 本地修补包或考虑用薄自定义 Leaflet 包装器替换，因为仅使用基本标记和 tile 层。

### Tailwind CSS 4 Beta 插件
- **风险：** `eslint-plugin-tailwindcss` 固定到 `4.0.0-beta.0`。
- **影响：** Beta 规则可能在升级时更改或消失，导致未来 lint 失败。
- **迁移计划：** 发布时升级到稳定的 Tailwind CSS v4 兼容 ESLint 插件。

## 测试覆盖缺口

### Playground E2E 测试依赖环境
- **未测试内容：** `playground/e2e/playground-loads.test.ts` 因模块解析 bug 而非应用 bug 失败，因此 "playground 加载" 断言在 CI 中实际上未测试。
- **文件：** `playground/e2e/playground-loads.test.ts`
- **风险：** 损坏的 playground 可能在未察觉的情况下发布。
- **优先级：** 中等。

### 缺少可访问性（a11y）测试
- **未测试内容：** 没有测试验证 ARIA 角色、键盘导航、焦点陷阱（ImageGallery 灯箱、MessageDraft 对话框）或 `prefers-reduced-motion`。
- **文件：** 所有组件测试目录。
- **风险：** 组件可能发布损坏屏幕阅读器的不可访问标记。
- **优先级：** 中等。

### Canvas/WebGL 测试仅为烟雾测试
- **未测试内容：** `WeatherWidget` 测试仅验证组件挂载；无测试验证 WebGL 上下文创建、着色器编译或 WebGL 不可用时的优雅回退。
- **文件：** `src/components/weather-widget/__tests__/index.test.ts`
- **风险：** 图形回归（黑屏、控制台错误）未捕获。
- **优先级：** 低。

## 缺失的关键特性

### 组件中无运行时 Prop 验证
- **问题：** 组件通过 `defineProps<T>()` 接受 props，但在 SFC 内部不运行 Zod schemas。序列化辅助函数存在（`parseSerializableX`），但 Vue 组件本身信任模板调用者。
- **阻塞：** 在渲染周期早期捕获格式错误的服务器 payload。
- **建议：** 添加轻量级 `usePropsValidator(schema)` composable（仅开发），在 props 违反 Zod schema 时警告。

### 浏览器专用 API 无 SSR 安全守卫
- **问题：** 组件在某些路径中访问 `window`、`document`、`matchMedia`、`ResizeObserver` 和 `HTMLCanvasElement` 而无守卫。
- **阻塞：** 在 Nuxt 或类似框架中安全的服务器端渲染（SSR）。
- **建议：** 一致使用 `typeof window !== 'undefined'` 守卫，特别是在 `useWeatherEffects.ts` 和 `useGlassStyles.ts` 中。

---

*问题审计：2026-04-03*
