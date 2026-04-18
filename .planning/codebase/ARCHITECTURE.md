# 架构

**分析日期:** 2026-04-18

## 模式概览

**整体:** Headless Composable + Schema-Driven Monorepo

**核心特征:**
- 每个组件采用 Headless 架构：逻辑层（`states/use*.ts`）与视图层（`index.vue`）分离
- Zod Schema 作为数据契约，定义 Props 类型、可序列化数据格式和运行时验证
- JSON Renderer 实现声明式渲染：Schema 类型到 Vue 组件的映射注册
- MCP Server 运行时读取组件源码，为 AI 工具提供组件发现和元数据查询
- Tailwind CSS v4 + CSS 变量主题系统

## 层级

**组件层（Components）:**
- 用途：27 个工具 UI 组件的实现，包含逻辑、视图、Schema、测试、i18n
- 位置：`packages/components/src/`
- 包含：每个组件目录下含 `schema.ts`、`states/use*.ts`、`index.vue`、`i18n/`、`__tests__/`
- 依赖：`packages/components/src/core/`（基础设施）、`packages/theme/`（主题令牌）
- 被依赖：`packages/renderer`、`packages/server`、`packages/site`

**核心基础设施层（Core）:**
- 用途：所有组件共享的工具、类型、Schema、UI 原语、i18n 系统
- 位置：`packages/components/src/core/`
- 包含：
  - `contract.ts` — `defineToolUiContract` 契约工厂
  - `schema.ts` — 基础 Schema（`ToolUIIdSchema`、`ToolUIRoleSchema`、`ActionSchema`、`DecisionResultSchema`）
  - `parse.ts` — `parseWithSchema` / `safeParseWithSchema` 统一解析
  - `utils.ts` — `cn()`（clsx + tailwind-merge）、`prefersReducedMotion()`
  - `media/` — 宽高比、媒体适配、URL 安全导航
  - `i18n/` — `useI18n` composable、`LocaleProvider` 组件、`zh-CN`/`en` 内置消息
  - `components/` — Button、Card、Badge、CopyButton 共享 UI 原语
- 依赖：Vue、Zod、clsx、tailwind-merge
- 被依赖：所有 27 个组件

**渲染器层（Renderer）:**
- 用途：将 JSON Spec 声明式映射到 Vue 组件实例
- 位置：`packages/renderer/src/`
- 包含：
  - `catalog.ts` — 将所有 `SerializableXxxSchema` 注册到 `@json-render/vue` catalog
  - `registry.ts` — 将所有 Vue 组件注册为 renderer，包裹 ErrorBoundary
  - `renderer.vue` — 顶层渲染组件，接收 Spec + handlers + initialState
  - `error-boundary.vue` — 渲染错误捕获与降级显示
  - `with-error-boundary.ts` — `createRenderer()` 和 `withErrorBoundary()` HOC 工具
- 依赖：`@json-render/core`、`@json-render/vue`、`@lionad/vtu-components`
- 被依赖：消费端应用通过 `VtuRenderer` 使用

**MCP Server 层（Server）:**
- 用途：为 AI 工具（Claude、Cursor 等）提供组件发现、查询、文档检索
- 位置：`packages/server/`
- 包含：
  - `src/resolver.ts` — 运行时扫描 `packages/components/src` 目录，解析组件路径
  - `src/data.ts` — 构建组件元数据缓存（schema、vue、tests、i18n 内容）
  - `src/types.ts` — Tool/Resource/Prompt 类型定义
  - `src/utils.ts` — JSDoc 提取、示例提取、文档页面枚举
  - `mcp/tools/` — 9 个 MCP Tool（search-components、get-component 等）
  - `mcp/resources/` — 4 个 MCP Resource
  - `mcp/prompts/` — 3 个 MCP Prompt
- 依赖：`@lionad/vtu-components`、`@modelcontextprotocol/sdk`
- 被依赖：AI 编辑器通过 MCP 协议调用

**主题层（Theme）:**
- 用途：CSS 变量令牌定义（颜色、间距、阴影、圆角）
- 位置：`packages/theme/src/`
- 包含：`tokens.css` — `:root` 和 `[data-theme="dark"]` 下的 CSS 变量
- 依赖：无
- 被依赖：`@lionad/vtu-components`（构建时复制到 dist）

**站点层（Site）:**
- 用途：展示站点 / 文档站点，基于 Nuxt 3
- 位置：`packages/site/`
- 包含：Nuxt 页面、Demo 组件、布局、插件
- 依赖：`@lionad/vtu-components`（通过 alias 直连源码）、`@nuxt/ui`、`@tresjs/nuxt`
- 被依赖：无（终端消费层）

## 数据流

**组件数据流（标准路径）：**

1. 外部传入 JSON 数据 → `parseSerializableXxx(input)` 或 `safeParseSerializableXxx(input)` 验证
2. 验证后的数据作为 Props 传入 Vue 组件 `<XxxComponent v-bind={props} />`
3. 组件内部调用 `useXxx(props)` composable 获取响应式状态
4. Vue 模板读取 composable 返回的 refs/computed 进行渲染

**JSON Renderer 数据流：**

1. 消费端构造 `Spec` 对象（JSON 描述组件树）
2. `<VtuRenderer :spec="spec" :handlers="handlers" />` 接收 Spec
3. `@json-render/vue` 的 `<Renderer>` 根据 catalog 中的 Schema 映射到 Vue 组件
4. 每个 Vue 组件通过 `createRenderer(Component)` 包装为 `({ props }) => h(Component, props)`
5. `withErrorBoundary` 包裹每个渲染器，捕获运行时错误

**MCP Server 数据流：**

1. MCP 客户端（AI 编辑器）通过 stdio 连接 `vtu-mcp-server`
2. Server 启动时调用 `buildComponentCache()` 扫描组件源码目录
3. Tool 调用（如 `search-components`）查询缓存的 `componentData`
4. 返回组件的 schema、vue 源码、测试示例、i18n 状态等元数据

**状态管理:**
- 无全局状态管理（无 Pinia/Vuex）
- 每个组件状态通过 composable 返回的 `ref` / `computed` 管理
- i18n 状态通过 `setMessages()` / `setLocale()` 全局设置（模块级变量）
- `LocaleProvider` 组件可提供作用域级 i18n 覆盖

## 关键抽象

**组件契约（ToolUiContract）：**
- 用途：统一每个组件的数据验证接口
- 定义：`packages/components/src/core/contract.ts`
- 模式：`defineToolUiContract(componentName, schema)` 返回 `{ schema, parse, safeParse }`
- 每个组件的 `schema.ts` 调用此工厂创建契约

**可序列化 Schema（Serializable Schema）：**
- 用途：定义组件的 JSON 安全数据格式（排除 `css` 等 styling 对象）
- 命名：`SerializableXxxSchema`（如 `SerializableCodeBlockSchema`）
- 解析器：`parseSerializableXxx()` 抛异常、`safeParseSerializableXxx()` 返回 null
- 示例：`packages/components/src/code-block/schema.ts`

**Headless Composable：**
- 用途：将组件逻辑从视图完全分离
- 命名：`useXxx`（如 `useCodeBlock`、`useGeoMap`）
- 位置：每个组件的 `states/useXxx.ts`
- 返回：`{ ...Refs, ...ComputedRefs, ...Actions }` 接口
- 视图层通过 `reactive(useXxx(props))` 消费
- 示例：`packages/components/src/code-block/states/useCodeBlock.ts`

**组件命名体系（Tool UI 命名规范）：**
- `data-tool-ui-id` — 组件唯一标识
- `data-slot` — 组件语义插槽名
- `role` — 工具角色（information / decision / control / state / composite）
- `receipt` — 执行结果收据（outcome + summary + identifiers + at）
- `LocalAction` / `DecisionAction` — 动作类型

## 入口点

**npm 包入口（@lionad/vtu-components）：**
- 位置：`packages/components/src/index.ts`
- 触发：`import { CodeBlock, ... } from '@lionad/vtu-components'`
- 职责：Barrel export 所有 27 个组件、Schema、类型、解析器、i18n、core 工具

**npm 包入口（@lionad/vtu-renderer）：**
- 位置：`packages/renderer/src/index.ts`
- 触发：`import { VtuRenderer, registry, catalog } from '@lionad/vtu-renderer'`
- 职责：导出 Renderer 组件、组件注册表、catalog 类型

**MCP Server CLI：**
- 位置：`packages/server/mcp/index.ts`
- 触发：`npx vtu-mcp-server` 或 `pnpm --filter @lionad/vtu-server dev`
- 职责：启动 MCP stdio 服务器，注册 9 tools + 4 resources + 3 prompts

**Histoire 开发服务器：**
- 位置：`histoire.config.ts`（根目录）
- 触发：`pnpm dev:histoire`
- 职责：组件 Story 开发与可视化测试

**Nuxt 展示站点：**
- 位置：`packages/site/nuxt.config.ts`
- 触发：`pnpm dev:site`
- 职责：展示站点开发与静态生成

**Playground：**
- 位置：`playground/`
- 触发：`pnpm dev:playground`
- 职责：自由测试环境，包含 JSON Renderer demo、天气调参等

## 错误处理

**策略：** 分层错误处理——Schema 层验证 + Renderer 层 ErrorBoundary + 组件层 try/catch

**模式：**
- Schema 层：`parseWithSchema` 抛出带路径信息的可读错误（`Invalid Xxx payload: path: message`）
- Schema 层：`safeParseWithSchema` 返回 null（适用于流式增量数据）
- Renderer 层：`error-boundary.vue` 通过 `onErrorCaptured` 捕获渲染错误，显示红色降级 UI
- 组件层：`useCodeBlock` 等内部 try/catch 降级到纯文本渲染
- MCP Server 层：`readTextFile` 文件不存在时返回 null，不抛异常

## 横切关注点

**日志：** 无统一日志框架，使用 `console.error`（仅 MCP Server 启动信息）

**验证：** Zod Schema 统一数据验证。每个组件的 `schema.ts` 定义 PropsSchema 和 SerializableSchema。`defineToolUiContract` 工厂确保一致的 parse/safeParse 接口

**国际化（i18n）：**
- 核心系统：`packages/components/src/core/i18n/use-i18n.ts` — `useI18n` composable
- 全局注册：`packages/components/src/i18n/index.ts` — 聚合所有组件的 zh-CN/en 消息，自动注册 zh-CN 默认
- 组件级消息：每个组件 `i18n/zh-CN.ts` + `i18n/en.ts`
- 作用域覆盖：`<LocaleProvider>` 组件可注入自定义消息

**主题：**
- CSS 变量令牌：`packages/theme/src/tokens.css`
- 暗色模式：通过 `data-theme="dark"` 或 `.dark` class 切换
- 组件内主题检测：`getDocumentTheme()` + `getSystemTheme()` + `MutationObserver`
- 样式合并：`cn()` 函数（clsx + tailwind-merge）处理 class 冲突

**CSS 注入：**
- 组件 Props 接受 `css` 对象（如 `css.root`、`css.header`）
- `css` 字段不包含在 `SerializableXxxSchema` 中（仅客户端样式覆盖）
- 通过 `cn()` 合并 Tailwind 类和自定义类

---

*架构分析: 2026-04-18*
