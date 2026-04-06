# Codebase Concerns

**分析日期：** 2026-04-06

## 技术债务

### ESLint 严重阻塞 CI
- **问题：** `pnpm lint` 以代码 1 退出，共 **2344 个问题（1490 errors, 854 warnings）**，仅 1 个可自动修复。
- **主要错误来源：**
  - `packages/core/src/components/badge/index.vue:13` — `vue/multi-word-component-names`（"Badge" 应为多词组件名）。
  - `packages/core/src/components/button/index.vue:14` — `vue/multi-word-component-names` + `vue/no-reserved-component-names`（"Button" 为 HTML 保留名）。
  - `packages/core/src/components/card/index.vue:12` — `vue/multi-word-component-names`（"Card"）。
  - `packages/components/src/plan/states/index.ts:4` — `Ref` 仅作为类型使用，违反 `consistent-type-imports`。
  - `packages/components/src/option-list/index.vue:9` — `modelValue` 缺少默认值，违反 `vue/require-default-prop`。
  - `packages/core/src/components/button/__tests__/index.test.ts:4` — `buttonVariants` 定义未使用。
  - `src/stories/order-summary.story.vue:2` — `OrderSummaryRoot` 导入未使用。
  - `packages/core/src/shared/types.d.ts:2,7` — 使用了 `any` 类型。
- **影响：** Lint 步骤不能用作 CI 门禁；大量警告淹没有价值的错误。
- **修复方法：**
  1. 对 core 基础组件临时禁用 `vue/multi-word-component-names`（这些是有意保持简洁的基础组件名）。
  2. 修复 `plan/states/index.ts` 的类型导入。
  3. 为 `option-list` 的 `modelValue` 添加显式默认值 `undefined`。
  4. 清理 stories 和测试中的未使用导入。

### Playground E2E 失败（App.vue 运行时错误）
- **问题：** `pnpm test` 中 `playground/e2e/playground-loads.test.ts` 失败。
- **错误：** `setup playground/App.vue:35:16` 出现未处理的 setup 函数错误，被 `console-guard.ts` 捕获为异常。
- **影响：** 41 个测试文件通过，但 4 个 E2E 测试因 playground 本身无法挂载而失败；"playground 能否加载" 这一关键路径未在 CI 中验证。
- **修复方法：** 检查 `playground/App.vue` 第 35 行附近的依赖注入或初始化逻辑，修复运行时错误。

### 旧问题现状（已随 monorepo 重构修复）
- `question-flow` 联合类型 Prop 访问 TypeScript 错误 — **已修复**。
- `order-summary` 复合组件模式损坏（将 Vue SFC 当作函数调用）— **已修复**。
- `weather-widget/effects/index.ts` 僵尸 React 导出 — **已清理**，当前文件仅导出有效的 TypeScript 模块。
- `vite.config.ts` 中 `skipDiagnostics: true` 掩盖类型错误 — **已不适用**，当前各包通过 `vue-tsc --noEmit` 独立类型检查，且均通过。

## 已知 Bug

### Playground App.vue Setup 函数异常
- **症状：** `playground/App.vue` 在测试挂载时抛出未处理错误。
- **文件：** `playground/App.vue:35`
- **触发：** 运行 `pnpm test`（具体为 playground E2E 测试）。
- **变通方案：** 无。需要先定位并修复 `App.vue` 中的初始化逻辑。

## 安全考虑

### Terminal / CodeBlock 中无输出净化
- **风险：** `Terminal` 和 `CodeBlock` 通过 `v-html` 渲染原始 HTML（`ansi-to-html` 转换后的终端输出、Shiki 高亮后的代码）。
- **文件：** `packages/components/src/terminal/index.vue`、`packages/components/src/code-block/index.vue`
- **当前缓解：** ESLint 全局禁用 `vue/no-v-html`。未使用客户端 DOM 净化器（如 DOMPurify）。
- **建议：** 文档中明确消费者必须在服务器端净化输入。考虑添加可选的 `sanitize` prop，在启用时运行 DOMPurify。

## 性能瓶颈

### 库输出中的庞大 Shiki Bundle
- **问题：** `packages/components/dist/` 包含来自 Shiki 的数百个语言/主题 bundle，因为 `shiki` 被打包进了库中。
- **文件：** `packages/components/dist/*`
- **原因：** `vite.config.ts` 未将 `shiki` 标记为 `external`。
- **改进路径：**
  1. 在 `packages/components/vite.config.ts` 中将 `shiki` 标记为 `external`，让消费者提供自己的高亮器实例。
  2. 或将 `CodeBlock` / `Terminal` 拆分为单独的子包。
  3. 或使用 `shiki` 的 `createHighlighterCore` 并显式注册语言以 tree-shake 未使用的语法。

### 超大 SFC 组件
- **问题：** 多个 SFC 超过 500–1000 行，难以审查、测试和维护。
- **文件：**
  - `packages/components/src/parameter-slider/index.vue` (~1071 行)
  - `packages/components/src/data-table/index.vue` (~930 行)
  - `packages/components/src/question-flow/index.vue` (~742 行)
  - `packages/components/src/preferences-panel/index.vue` (~619 行)
- **改进路径：** 将 composables、展示性子组件和工具函数提取到组件目录内的单独文件中（已在 headless 迁移中部分完成，但视图层仍可进一步拆分）。

### WeatherWidget 中的 WebGL Canvas（运行时成本）
- **问题：** 即使 `effects.enabled` 为 `false` 或在低功耗设备上，`WeatherWidget` 仍可能初始化 WebGL canvas。
- **文件：** `packages/components/src/weather-widget/cmpts/weather-effects-canvas.vue`、`packages/components/src/weather-widget/composables/useWeatherEffects.ts`
- **改进路径：** 效果禁用时完全跳过 canvas 初始化。在创建 WebGL 上下文前添加 `prefers-reduced-motion` / 电池电量检查。

## 脆弱区域

### 组件 Barrels 与 SFC 重新导出混合
- **文件：** `packages/components/src/order-summary/index.ts`、`packages/components/src/stats-display/index.ts`、`packages/components/src/index.ts`
- **脆弱原因：** `index.ts` barrels 有时默认导出 `.vue` SFC，有时用函数包装。更改一种模式会破坏导入站点。
- **安全修改：** 始终使用 `export { default as ComponentName } from './index.vue'` 或命名包装器组件（另一个 `.vue` 文件），绝不用普通函数包装 Vue SFC。

### 测试 Mocks 依赖实现内部
- **文件：** `src/test/setup.ts`、`packages/components/src/geo-map/__tests__/index.test.ts`
- **脆弱原因：** Leaflet 和 WebGL mocks 是手写的且不完整。`vue-leaflet` 或 WebGL 使用的任何更改都可能导致晦涩的测试失败。
- **测试覆盖缺口：** Canvas 2D 上下文仅部分 mock；任何使用 `ctx.fill()`、`ctx.arc()` 等的组件可能在测试中抛出。

## 扩展限制

### Components barrel 导出所有内容
- **当前容量：** `packages/components/src/index.ts` 在一个 barrel 中重新导出 32 个组件以及 schemas、类型和解析器。
- **限制：** 如果 bundler 不支持深度重新导出分析，消费者无法 tree-shake 未使用的 schemas/parsers。barrel 还会产生大量类型检查开销。
- **扩展路径：** 将导出拆分为分类 barrels（如 `@lionad/vtu-components/media`、`@lionad/vtu-components/social`、`@lionad/vtu-components/data`）或依赖直接组件导入（`@lionad/vtu-components/components/option-list`）。

## 依赖风险

### `@vue-leaflet/vue-leaflet` ESM/CJS 不匹配
- **风险：** 包在其 CJS 构建中导入 `leaflet/dist/leaflet-src.esm` 而不带 `.js` 扩展名，导致 Node/Vitest 环境中 `ERR_MODULE_NOT_FOUND`。
- **影响：** 历史上有 playground E2E 测试因此产生未处理拒绝。当前 playground E2E 失败被 `App.vue` 错误掩盖，但底层问题仍可能在 SSR 场景中复现。
- **迁移计划：** 本地修补包或考虑用薄自定义 Leaflet 包装器替换，因为仅使用基本标记和 tile 层。

### Tailwind CSS 4 Beta ESLint 插件
- **风险：** `eslint-plugin-tailwindcss` 固定到 `4.0.0-beta.0`。
- **影响：** Beta 规则可能在升级时更改或消失，导致未来 lint 失败。
- **迁移计划：** 发布时升级到稳定的 Tailwind CSS v4 兼容 ESLint 插件。

## 测试覆盖缺口

### Playground E2E 测试因应用错误失败
- **未测试内容：** `playground/e2e/playground-loads.test.ts` 当前因 `App.vue` 的运行时错误而非模块解析 bug 失败。
- **风险：** 损坏的 playground 可能在未察觉的情况下发布。
- **优先级：** 高（阻塞 CI）。

### 缺少可访问性（a11y）测试
- **未测试内容：** 没有测试验证 ARIA 角色、键盘导航、焦点陷阱（ImageGallery 灯箱、MessageDraft 对话框）或 `prefers-reduced-motion`。
- **文件：** 所有组件测试目录。
- **风险：** 组件可能发布损坏屏幕阅读器的不可访问标记。
- **优先级：** 中等。

### Canvas/WebGL 测试仅为烟雾测试
- **未测试内容：** `WeatherWidget` 测试仅验证组件挂载；无测试验证 WebGL 上下文创建、着色器编译或 WebGL 不可用时的优雅回退。
- **文件：** `packages/components/src/weather-widget/__tests__/index.test.ts`
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

*问题审计：2026-04-06*
