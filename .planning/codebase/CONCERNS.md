# Codebase Concerns

**分析日期：** 2026-04-18

## 技术债务

### MCP Server 分发包臃肿（2.2MB 组件源码内嵌 dist）

- **问题：** `@lionad/vtu-server`（MCP server）通过 `scripts/copy-sources.mjs` 将整个 `packages/components/src` 和 `src/stories` 原样复制到 `dist/` 中，导致 `dist/packages/components/src/` 包含 303 个 `.ts`/`.vue` 文件，总计 2.2MB。这些源码文件包含 weather-widget 的 WebGL 着色器、Leaflet 地图引擎、所有测试文件等不必要内容。
- **文件：** `packages/server/scripts/copy-sources.mjs`、`packages/server/dist/`
- **影响：** npm 包体积膨胀；每次 `pnpm publish:server` 都会发布完整组件源码；消费者安装 MCP server 时也下载了 2.2MB 无关的组件源码。
- **修复方法：**
  1. 在 `copy-sources.mjs` 的 `filter` 中排除 `__tests__`、`*.test.ts`、`*.spec.ts`、`*.story.vue` 文件。
  2. 排除 `weather-widget/effects/generated/` 中的 GLSL 着色器源码（MCP server 不需要渲染 WebGL）。
  3. 排除 `geo-map/cmpts/` 中的 Leaflet 引擎代码（MCP server 仅需要 schema 和 metadata）。
  4. 仅保留 `schema.ts`、`index.ts`、类型声明和 i18n 文件。

### GeoMap 引擎组件过大（939 行 SFC）

- **问题：** `packages/components/src/geo-map/cmpts/geo-map-engine.vue` 是一个 939 行的 SFC，包含 `<script setup>` 中 649 行逻辑和 `<template>` 中约 290 行模板。模板中有大量重复的 marker/tooltip/popup 代码块——clustered markers 和 non-clustered markers 的 tooltip/popup 模板几乎完全相同，仅数据访问路径不同。
- **文件：** `packages/components/src/geo-map/cmpts/geo-map-engine.vue`
- **影响：** 维护成本高；任何 tooltip/popup 样式变更需要在 4 处（clustered custom icon / clustered circle marker / non-clustered custom icon / non-clustered circle marker）同步修改。
- **修复方法：**
  1. 将 tooltip+popup 模板提取为独立的 `GeoMapMarkerPopup.vue` 子组件，通过 props 接收 `label`、`description`、`tooltip`、`tooltipClassName`、`popupClassName`。
  2. 将 `markerById.get(feature.properties?.markerId ?? '')` 提取为局部变量或 computed，消除模板中的 20+ 次重复调用。
  3. 将工具函数（`resolveInitialView`、`collectFitPoints`、`splitDatelineBbox` 等）移入 `states/` 或独立的 `utils.ts`。

### WeatherWidget 效果系统高复杂度（6952 行，35 个文件）

- **问题：** `packages/components/src/weather-widget/` 总计 6952 行、35 个源码文件，是项目中最复杂的组件。核心 composable `useWeatherEffects.ts`（635 行）管理 7 个 WebGL 程序、双 framebuffer、月纹理、uniform 缓存、IntersectionObserver、ResizeObserver、上下文丢失/恢复等，是单个 composable 中的认知过载。
- **文件：** `packages/components/src/weather-widget/`
- **影响：** 新开发者难以理解和修改效果系统；容易引入回归 bug。
- **修复方法：**
  1. 将 `useWeatherEffects.ts` 中的生命周期管理（IntersectionObserver、context lost）提取为 `useWebglLifecycle.ts`。
  2. 将 framebuffer/program 创建提取为 `useWebglResources.ts`。
  3. 保持 render loop 逻辑在 `useWeatherEffects.ts` 中，但仅保留核心调度逻辑。

### i18n mergeMessages 使用 `as unknown` 强制类型转换（48 处）

- **问题：** `packages/components/src/i18n/index.ts` 中 `mergeMessages` 函数对每个组件的 locale 对象使用 `as unknown as Record<string, unknown>` 强制转换，共 48 处。所有 22 个组件的 zh-CN 和 en 消息均需手动 import 并 merge。
- **文件：** `packages/components/src/i18n/index.ts`（141 行）
- **影响：** 新增组件时必须手动添加 4 行代码（zh-CN import + en import + zh-CN merge + en merge）；类型不安全。
- **修复方法：**
  1. 使用 glob import（`import.meta.glob`）自动收集所有 `*/i18n/zh-CN.ts` 文件。
  2. 或定义统一的 `LocaleMessages` 类型，避免 `as unknown` 转换。
  3. 在组件 `index.ts` 中自动注册 i18n 消息，而非集中 merge。

### PreferencesPanel states 层使用 `as unknown` 类型断言

- **问题：** `usePreferencesPanel.ts` 中有 4 处 `(props as unknown) as PreferencesPanelReceiptProps` 强制类型转换。这是因为函数签名将 props 类型混合了 `PreferencesPanelProps & Partial<PreferencesPanelReceiptProps>`，但在 receipt 模式下需要访问 `choice` 和 `error` 属性。
- **文件：** `packages/components/src/preferences-panel/states/usePreferencesPanel.ts`
- **影响：** 类型不安全；如果 schema 变更，编译器不会捕获运行时属性访问错误。
- **修复方法：** 使用类型守卫函数或 discriminated union 来区分 interactive/receipt 模式。

### GeoMap 中 eslint-disable 行内注释屏蔽 any 类型

- **问题：** `geo-map-engine.vue` 第 475 行使用 `/* eslint-disable @typescript-eslint/no-explicit-any */ any` 注释来绕过 `applyViewportToMap` 的参数类型检查。第 574 行 `removeLayer` monkey-patch 也使用 `any`。
- **文件：** `packages/components/src/geo-map/cmpts/geo-map-engine.vue:475`、`packages/components/src/geo-map/cmpts/geo-map-engine.vue:574`
- **影响：** 丢失类型安全；Leaflet Map 实例的类型定义可用但被忽略。
- **修复方法：** 从 `leaflet` 包导入 `Map` 类型并正确标注参数类型。

### i18n 仅支持 zh-CN / en，4 个组件缺少 i18n

- **问题：** 项目内建 i18n 系统，但仅提供 zh-CN 和 en 两种语言。以下组件完全没有 i18n 目录，硬编码中文文本：
  - `weather-widget`（无 i18n 目录，6952 行代码中可能有硬编码字符串）
  - `image-gallery`（无 i18n 目录）
  - `link-preview`（无 i18n 目录）
  - `progress-tracker`（无 i18n 目录）
- **文件：** 上述组件目录中无 `i18n/` 子目录
- **影响：** 国际化用户无法翻译这些组件的文本。
- **修复方法：** 为每个缺少 i18n 的组件添加 `i18n/zh-CN.ts` 和 `i18n/en.ts`，提取硬编码字符串。

### 双锁文件并存（bun.lock + pnpm-lock.yaml）

- **问题：** 根目录同时存在 `bun.lock` 和 `pnpm-lock.yaml`，但项目使用 pnpm 作为包管理器（`pnpm-workspace.yaml` 配置存在）。`bun.lock` 可能是开发者本地使用 bun 时生成的残留文件。
- **文件：** `/bun.lock`、`/pnpm-lock.yaml`
- **影响：** 可能导致依赖版本不一致；CI/CD 环境可能使用错误的锁文件。
- **修复方法：** 删除 `bun.lock`，确保 `.gitignore` 中包含 `bun.lock`。

## 已知 Bug

### WeatherWidget 月纹理未加载

- **症状：** `useWeatherEffects.ts` 第 308-326 行注释明确写道 "Moon texture loading would require the actual image asset - This is simplified"。实际代码仅创建 1x1 灰色占位纹理，`moonTextureLoadedRef` 始终为 `false`。
- **文件：** `packages/components/src/weather-widget/composables/useWeatherEffects.ts:308-326`
- **触发：** 任何使用 WeatherWidget 且天体效果包含月亮的场景。
- **变通方案：** 着色器代码中有 fallback 路径（`if (u_hasMoonTexture)` 分支），使用程序化纹理代替。
- **修复方法：** 加载实际月亮纹理资源，设置 `moonTextureLoadedRef.value = true`。

### WeatherWidget watch 回调为空操作

- **症状：** `useWeatherEffects.ts` 第 627-634 行有一个 `watch(() => propsGetter(), ...)` 但回调函数体为空，仅有注释 "Props are accessed via propsGetter() in render loop, No need to restart"。这个 watch 设置了 `{ deep: true }`，对复杂的 props 对象执行深监听但什么都不做，浪费性能。
- **文件：** `packages/components/src/weather-widget/composables/useWeatherEffects.ts:627-634`
- **触发：** 任何 props 变更都会触发无用的深度比较。
- **修复方法：** 删除这个空 watch 或在注释中说明其存在原因（如响应式追踪依赖收集）。

### GeoMap markerById 在模板中重复调用 20+ 次

- **症状：** `geo-map-engine.vue` 模板中 `markerById.get(feature.properties?.markerId ?? '')` 出现超过 20 次（clustered 和 non-clustered 分支各约 10 次）。Vue 模板表达式无缓存机制，每次渲染都会重新执行 Map.get 查找。
- **文件：** `packages/components/src/geo-map/cmpts/geo-map-engine.vue`（模板部分）
- **触发：** 任何包含大量 marker 的地图渲染。
- **修复方法：** 在 clustered 和 non-clustered 分支外层使用 `<template>` 或 computed 预计算 marker 数据列表，将 Map 查找从模板移入 computed。

## 安全考虑

### Terminal / CodeBlock 中 v-html 无输出净化

- **风险：** `Terminal` 和 `CodeBlock` 通过 `v-html` 渲染原始 HTML（`ansi-to-html` 转换后的终端输出、Shiki 高亮后的代码）。如果组件库消费者将未经净化的用户输入传入 `stdout` 或 `code` prop，可能导致 XSS 攻击。
- **文件：** `packages/components/src/terminal/index.vue`、`packages/components/src/code-block/index.vue`
- **当前缓解：** ESLint 全局禁用 `vue/no-v-html`。未使用客户端 DOM 净化器（如 DOMPurify）。
- **建议：** 文档中明确声明消费者必须在服务器端净化输入。考虑添加可选的 `sanitize` prop，在启用时运行 DOMPurify。

### MCP Server 包含完整组件源码

- **风险：** `packages/server/dist/packages/components/src/` 包含了完整的组件源码（包括 schema、states 逻辑、API key 占位等），这些文件会被发布到 npm。
- **文件：** `packages/server/dist/packages/`
- **当前缓解：** 无（这是构建产物，不包含密钥）。
- **建议：** 审查 `dist/` 中是否有意外包含的敏感信息（API endpoint、内网地址等）。

## 性能瓶颈

### WeatherWidget WebGL 全帧渲染循环

- **问题：** `useWeatherEffects.ts` 中的 `render()` 函数在 `requestAnimationFrame` 循环中执行完整的 WebGL 渲染管线（celestial → cloud → rain → lightning → snow → composite），即使大部分效果层被禁用时也是如此。每个 pass 都涉及 framebuffer 绑定、纹理采样和着色器执行。
- **文件：** `packages/components/src/weather-widget/composables/useWeatherEffects.ts:366-546`
- **原因：** 即使某层（如 rain、lightning）被禁用，composite pass 仍会执行 bloom、god rays、haze 等后处理。
- **改进路径：**
  1. 在所有层都禁用后处理时跳过 composite pass。
  2. 仅在 celestial 状态变化时渲染 celestial pass（而非每帧）。
  3. 考虑在静态场景中使用降频渲染（如 30fps 或按需渲染）。

### WebGL 着色器字符串内联为 JS 常量（单行最长 ~8KB）

- **问题：** `weather-effect-shaders.generated.ts` 中的着色器源码以单行字符串常量形式存储（`COMPOSITE_FRAGMENT` 等），每个着色器是一个 ~8KB 的字符串字面量。这些字符串在 JS bundle 中不可被压缩工具优化（GLSL 代码无重复模式）。
- **文件：** `packages/components/src/weather-widget/effects/generated/weather-effect-shaders.generated.ts`
- **原因：** GLSL 着色器在构建时从 `lib/weather-authoring/shaders/*.glsl` 编译为 JS 常量，但 `lib/weather-authoring/` 目录不存在（仅 `generated/` 文件存在），意味着编译管线可能不可用。
- **改进路径：** 确认着色器编译工具链是否可用（`pnpm weather:compile`）；如果 GLSL 源文件丢失，重新建立着色器编辑/编译工作流。

### GeoMap Leaflet 动态 import 导致首屏延迟

- **问题：** `geo-map-engine.vue` 在 `onMounted` 中 `await import('leaflet')`，这是一个异步阻塞操作。Leaflet 库本身约 200KB+，在网络条件差时可能导致地图组件首屏延迟。
- **文件：** `packages/components/src/geo-map/cmpts/geo-map-engine.vue:108-113`
- **原因：** Leaflet 不支持 SSR，需要动态导入以避免 Node.js 环境报错。
- **改进路径：** 考虑添加加载骨架屏或使用 `<Suspense>` 提供更好的加载体验。

### 超大 SFC 组件

- **问题：** 以下组件 SFC 过大（超过 300 行建议阈值）：
  - `packages/components/src/geo-map/cmpts/geo-map-engine.vue`（939 行）
  - `packages/components/src/weather-widget/cmpts/weather-data-overlay.vue`（619 行）
  - `packages/components/src/citation/cmpts/citation-list.vue`（491 行）
  - `packages/components/src/message-draft/cmpts/message-draft.vue`（390 行）
  - `packages/components/src/image-gallery/cmpts/gallery-lightbox.vue`（261 行）
  - `packages/components/src/linkedin-post/cmpts/linkedin-post.vue`（202 行）
- **文件：** 上述文件
- **改进路径：** 提取子组件和 composables 以降低单文件复杂度。

## 脆弱区域

### WeatherWidget 效果编译管线可能不可用

- **文件：** `packages/components/src/weather-widget/effects/shaders/*.glsl`（不存在）、`packages/components/src/weather-widget/effects/generated/weather-effect-shaders.generated.ts`
- **脆弱原因：** `weather-effect-shaders.ts` 注释写着 "Authoring sources: lib/weather-authoring/shaders/*.glsl"，但 `lib/weather-authoring/` 目录在项目中不存在。`pnpm weather:compile` 命令未在 `package.json` 的 `scripts` 中定义。如果需要修改着色器，开发者无法重新编译。
- **安全修改：** 仅修改 `generated/*.ts` 文件中的字符串常量（不推荐但可行）；或重建 `lib/weather-authoring` 工具链。
- **测试覆盖：** `weather-widget.perf.test.ts` 存在，但仅测试性能指标，不验证着色器正确性。

### GeoMap vue-leaflet 兼容性

- **文件：** `packages/components/src/geo-map/cmpts/geo-map-engine.vue`
- **脆弱原因：** 使用 `@vue-leaflet/vue-leaflet@0.10.1`（非官方维护活跃版本），模板中使用了 `LMap`、`LMarker`、`LCircleMarker`、`LPolyline` 等 9 个子组件。代码中已有 monkey-patch 来修复 vue-leaflet 卸载时传递 undefined layer 导致的 TypeError。
- **安全修改：** 避免 vue-leaflet 版本升级；如需升级，完整运行 `geo-map/__tests__/index.test.ts`。
- **测试覆盖：** `packages/components/src/geo-map/__tests__/index.test.ts`（396 行），覆盖基本挂载和 clustering。

### i18n 全局模块状态（非注入式）

- **文件：** `packages/components/src/core/i18n/use-i18n.ts`
- **脆弱原因：** `_messages` 和 `_locale` 是模块级 `ref`，而非通过 Vue provide/inject 管理。`setMessages()` 和 `setLocale()` 直接修改模块状态。这意味着：
  1. 同一页面多个 Vue 应用实例会共享 i18n 状态。
  2. 测试中不同测试用例可能互相污染 i18n 状态。
  3. SSR 场景中多个请求会共享同一份消息。
- **安全修改：** 确保 `LocaleProvider` 正确包裹应用；测试中在每个 case 前重置 i18n 状态。
- **测试覆盖：** `packages/components/src/core/i18n/__tests__/` 有 2 个测试文件，覆盖基本 t() 和 locale 切换。

## 扩展限制

### Components 单 barrel 导出所有组件

- **当前容量：** `packages/components/src/index.ts` 在一个 barrel 中重新导出所有组件以及 schemas、类型和解析器。
- **限制：** 不支持 tree-shake 的 bundler 会引入所有组件。添加新组件会增加所有消费者的类型检查时间。
- **扩展路径：** 支持深度导入路径（如 `@lionad/vtu-components/geo-map`），使消费者可以按需引入。

### WebGL 并发 Canvas 预算硬编码为 8

- **当前容量：** `weather-webgl-budget.ts` 默认最多 8 个并发 WebGL canvas，最大 64。
- **限制：** 在仪表板或列表页面中，8 个以上 WeatherWidget 实例会导致部分组件无法渲染效果。
- **扩展路径：** 当前已提供 `setMaxConcurrentWeatherWebglCanvases()` API，消费者可按需调整。

## 依赖风险

### `@vue-leaflet/vue-leaflet@0.10.1` 维护风险

- **风险：** 该包最后发布于 2023 年，npm 周下载量低，且已知有 ESM/CJS 模块解析问题。当前通过 monkey-patch 绕过了部分 bug。
- **影响：** Leaflet 或 Vue 升级可能导致不兼容；安全问题可能无人修复。
- **迁移计划：** 考虑用薄自定义 Leaflet 包装器替换（仅使用基本的 marker、tile layer、polyline、circle marker 功能）。

### `eslint-plugin-tailwindcss@4.0.0-beta.0` Beta 依赖

- **风险：** 固定到 beta 版本，未来升级可能导致规则变更或移除。
- **影响：** 升级 ESLint 或 Tailwind CSS 时可能产生大量新 lint 报错。
- **迁移计划：** Tailwind CSS v4 正式发布后升级到对应稳定版插件。

### `histoire@1.0.0-beta.1` Beta 依赖（含 patch）

- **风险：** 项目使用 Histoire beta 版本，且通过 `patches/@histoire__app@1.0.0-beta.1.patch` 进行了本地修补。
- **影响：** Histoire 正式版发布后可能需要移除 patch 并调整配置。
- **迁移计划：** 跟踪 Histoire 正式版发布，验证兼容性后升级。

## 测试覆盖缺口

### 4 个组件无 i18n 测试

- **未测试内容：** `weather-widget`、`image-gallery`、`link-preview`、`progress-tracker` 缺少 i18n 目录，无法验证文本本地化正确性。
- **文件：** 上述组件目录
- **风险：** 文本硬编码在组件中，翻译时容易遗漏。
- **优先级：** 中等。

### WebGL 效果渲染无视觉回归测试

- **未测试内容：** `weather-widget` 的 WebGL 渲染管线（6 个 shader pass）没有快照或截图测试。`EffectCompositor.test.ts` 仅测试 composable 逻辑，不验证实际像素输出。
- **文件：** `packages/components/src/weather-widget/__tests__/`
- **风险：** 着色器代码变更可能导致视觉效果回归（黑屏、颜色错误、闪烁）而未被捕获。
- **优先级：** 低（WebGL 测试实现成本高）。

### 缺少可访问性（a11y）测试

- **未测试内容：** 没有测试验证 ARIA 角色、键盘导航、焦点陷阱（ImageGallery 灯箱、MessageDraft 对话框）或 `prefers-reduced-motion` 响应。
- **文件：** 所有组件测试目录
- **风险：** 组件可能发布不兼容屏幕阅读器的标记。
- **优先级：** 中等。

### E2E 挂载测试仅验证 `wrapper.exists()`

- **未测试内容：** `src/test/e2e/component-mounts.test.ts`（409 行）对 27 个组件逐一执行动态 import + mount，但仅断言 `wrapper.exists()` 为 `true`。不验证渲染输出、不触发交互、不检查 props 传递。
- **文件：** `src/test/e2e/component-mounts.test.ts`
- **风险：** 组件可能 mount 成功但渲染空白或错误内容。
- **优先级：** 中等。

## 缺失的关键特性

### 无运行时 Props 验证（开发模式）

- **问题：** 组件通过 `defineProps<T>()` 接受 TypeScript 类型化 props，但在运行时不执行 Zod schema 验证。每个组件的 `schema.ts` 定义了完整的 Zod schema，但这些 schema 仅用于 MCP server 端，不在组件内部使用。
- **阻塞：** 格式错误的服务器 payload 不会在渲染周期早期被捕获，可能导致难以调试的运行时错误。
- **建议：** 添加轻量级 `usePropsValidator(schema)` composable（仅开发模式），在 props 违反 Zod schema 时输出警告。

### 部分组件无 SSR 安全守卫

- **问题：** 以下组件在初始化路径中访问浏览器 API 而无守卫：
  - `weather-widget/composables/useWeatherEffects.ts` — `canvas.getContext('webgl2')`、`IntersectionObserver`
  - `geo-map/cmpts/geo-map-engine.vue` — `document.addEventListener`
  - `code-diff/use-theme.ts` — `document.documentElement`、`document.querySelector('.dark')`
  - `code-block/states/useCodeBlock.ts` — `document.createElement`
- **阻塞：** 在 Nuxt SSR 环境中，这些组件会在服务器端执行并抛出 `document is not defined` 错误。
- **建议：** 一致使用 `typeof window !== 'undefined'` 或 `import.meta.env.SSR` 守卫；使用 `onMounted` 延迟所有浏览器 API 访问。

---

*问题审计：2026-04-18*
