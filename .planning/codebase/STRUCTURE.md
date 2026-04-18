# 代码库结构

**分析日期:** 2026-04-18

## 目录布局

```
tool-ui-vue/                          # Monorepo 根目录
├── packages/
│   ├── components/                   # 27 个 Vue 3 组件 + core 基础设施
│   │   └── src/
│   │       ├── core/                 # 共享基础设施（contract、schema、i18n、UI 原语）
│   │       ├── shared/               # 类型声明、主题 JS、工具函数
│   │       ├── i18n/                 # 全局 i18n 消息聚合与自动注册
│   │       ├── index.ts              # Barrel 入口（所有组件 + core 导出）
│   │       ├── approval-card/        # 组件示例：审批卡片
│   │       ├── audio/                # 音频播放器
│   │       ├── chart/                # 数据可视化图表
│   │       ├── citation/             # 引用/链接卡片
│   │       ├── code-block/           # 语法高亮代码块
│   │       ├── code-diff/            # 代码差异对比
│   │       ├── data-table/           # 数据表格（排序/筛选）
│   │       ├── geo-map/              # 地理地图（Leaflet）
│   │       ├── image/                # 响应式图片
│   │       ├── image-gallery/        # 图片画廊（网格 + 灯箱）
│   │       ├── instagram-post/       # Instagram 帖子预览
│   │       ├── item-carousel/        # 水平滚动项轮播
│   │       ├── link-preview/         # 链接预览卡片
│   │       ├── linkedin-post/        # LinkedIn 帖子预览
│   │       ├── message-draft/        # 邮件/Slack 消息草稿
│   │       ├── option-list/          # 可选项列表
│   │       ├── order-summary/        # 订单摘要
│   │       ├── parameter-slider/     # 参数滑块
│   │       ├── plan/                 # 计划/待办列表
│   │       ├── preferences-panel/    # 偏好设置面板
│   │       ├── progress-tracker/     # 多步骤进度追踪
│   │       ├── question-flow/        # 问答流程
│   │       ├── stats-display/        # 统计数据显示
│   │       ├── terminal/             # 终端输出模拟
│   │       ├── video/                # 视频播放器
│   │       ├── weather-widget/       # 天气组件（WebGL 效果）
│   │       └── x-post/               # X/Twitter 帖子预览
│   ├── renderer/                     # JSON Renderer（@json-render/vue 集成）
│   │   └── src/
│   │       ├── catalog.ts            # Schema 到组件的 catalog 注册
│   │       ├── registry.ts           # Vue 组件 renderer 注册 + ErrorBoundary
│   │       ├── renderer.vue          # 顶层渲染组件
│   │       ├── error-boundary.vue    # 渲染错误降级 UI
│   │       └── with-error-boundary.ts # createRenderer/withErrorBoundary HOC
│   ├── server/                       # MCP Server（AI 工具集成）
│   │   ├── src/                      # 解析器、数据缓存、工具函数
│   │   └── mcp/                      # MCP 入口、tools、resources、prompts
│   ├── theme/                        # CSS 变量主题令牌
│   │   └── src/
│   │       ├── index.ts              # 导入 tokens.css
│   │       └── tokens.css            # :root 和 [data-theme="dark"] 变量
│   └── site/                         # Nuxt 3 展示站点
│       ├── app/                      # Nuxt 应用（pages、components、layouts）
│       └── nuxt.config.ts            # Nuxt 配置（alias 直连 components 源码）
├── src/                              # Histoire stories 和开发时共享工具
│   ├── stories/                      # 每个组件对应一个 story 目录
│   │   ├── _shared/                  # Story 共享 setup 和工具
│   │   ├── approval-card/
│   │   ├── code-block/
│   │   └── ...（27 个组件各一个）
│   ├── test/                         # 测试 setup
│   ├── utils/                        # 开发时工具
│   └── index.ts                      # Root lib 入口（开发时用）
├── playground/                       # 自由测试环境
│   ├── App.vue                       # 主应用
│   ├── pages/                        # 测试页面
│   ├── components/                   # 测试用组件
│   ├── composables/                  # 测试用 composables
│   ├── json-render/                  # JSON Renderer demo
│   └── weather-tuning/               # 天气效果调参工具
├── scripts/                          # 构建脚本
│   ├── check-i18n.mjs                # i18n 完整性检查
│   └── post-build-histoire.mjs       # Histoire 构建后处理
├── docs/                             # 文档
│   └── promo.md                      # 推广文档
├── .changeset/                       # Changesets 版本管理
├── .github/workflows/                # CI/CD
│   └── deploy-pages.yml              # GitHub Pages 部署
├── package.json                      # 根 package.json（workspace 根）
├── pnpm-workspace.yaml               # pnpm workspace 配置
├── histoire.config.ts                # Histoire 配置
├── vite.config.ts                    # 根 Vite 库构建配置
├── vitest.config.ts                  # Vitest 测试配置
└── tsconfig.json                     # TypeScript 配置
```

## 目录用途

**`packages/components/src/core/`:**
- 用途：所有组件共享的基础设施
- 包含：contract 工厂、基础 Schema、parse 工具、cn() 样式工具、i18n 系统、UI 原语组件
- 关键文件：`contract.ts`、`schema.ts`、`parse.ts`、`utils.ts`、`i18n/use-i18n.ts`、`components/button/`

**`packages/components/src/shared/`:**
- 用途：跨组件共享的非核心工具
- 包含：Shiki 主题类型声明（`types.d.ts`）、Pierre 亮/暗主题 JS、`utils.ts`
- 关键文件：`types.d.ts`、`pierre-dark-theme.js`、`pierre-light-theme.js`

**`packages/components/src/i18n/`:**
- 用途：全局 i18n 消息聚合入口
- 包含：从所有组件导入 zh-CN/en 消息，合并后自动注册
- 关键文件：`index.ts`

**组件目录（以 `code-block` 为例）：**
```
code-block/
├── index.ts           # Barrel 导出（组件 + Schema + composable）
├── index.vue          # 视图层（UI-only，逻辑委托 states）
├── schema.ts          # Zod Schema + TypeScript 类型 + defineToolUiContract
├── states/            # Headless composable 层
│   ├── index.ts       # 重新导出 useCodeBlock
│   └── useCodeBlock.ts # 核心业务逻辑
├── i18n/              # 组件级国际化消息
│   ├── zh-CN.ts
│   └── en.ts
├── __tests__/         # 组件测试
│   └── index.test.ts
├── pierre-dark-theme.js  # Shiki 暗色主题（仅 code-block 使用）
└── pierre-light-theme.js # Shiki 亮色主题（仅 code-block 使用）
```

**多子组件目录（如 `geo-map`、`image-gallery`、`weather-widget`）：**
```
geo-map/
├── index.ts           # Barrel 导出（含子组件）
├── index.vue          # 主组件
├── schema.ts          # Schema 定义
├── states/            # Composable 层
├── cmpts/             # 子组件目录
│   ├── geo-map-engine.vue
│   └── geo-map-overlays.vue
├── i18n/
├── __tests__/
├── geo-map-icons.ts   # 组件专用工具
└── geo-map-theme.module.css  # 组件专用样式
```

**`packages/renderer/src/`:**
- 用途：JSON Renderer 集成层
- 包含：catalog（Schema 注册）、registry（组件注册）、renderer 组件、error boundary
- 关键文件：`catalog.ts`（25 个组件的 Schema 注册）、`registry.ts`（组件到 renderer 的映射）

**`packages/server/`:**
- 用途：MCP Server，AI 工具可查询组件元数据
- 包含：源码解析器、数据缓存、MCP tools/resources/prompts
- 关键文件：`src/resolver.ts`（路径解析）、`src/data.ts`（元数据缓存）、`mcp/index.ts`（MCP 入口）

**`packages/site/`:**
- 用途：Nuxt 3 展示站点
- 包含：页面、Demo 组件、布局、插件
- 关键文件：`nuxt.config.ts`（alias 直连 components 源码）、`app/pages/index.vue`、`app/components/demo-*.vue`

**`src/stories/`:**
- 用途：Histoire 可视化开发 story
- 包含：每个组件一个目录，含 `index.story.vue`
- 关键文件：`_shared/histoire-setup.ts`

**`playground/`:**
- 用途：自由测试环境
- 包含：独立 Vite 应用，测试页面、JSON Renderer demo、天气调参工具
- 关键文件：`App.vue`、`json-render/`、`weather-tuning/`

## 关键文件位置

**入口点：**
- `packages/components/src/index.ts` — npm 包 barrel 导出（473 行，所有组件 + core）
- `packages/renderer/src/index.ts` — Renderer 导出
- `packages/server/mcp/index.ts` — MCP Server CLI 入口
- `src/index.ts` — Root lib 入口（开发/Histoire 用）

**配置：**
- `package.json` — 根 workspace 配置、依赖、scripts
- `pnpm-workspace.yaml` — workspace 包定义
- `tsconfig.json` — TypeScript 配置（strict、ESNext、bundler resolution）
- `vite.config.ts` — 根 Vite 库构建配置
- `vitest.config.ts` — Vitest 测试配置（jsdom、auto-import、路径 alias）
- `histoire.config.ts` — Histoire 组件文档配置
- `eslint.config.mjs` — ESLint flat config

**核心逻辑：**
- `packages/components/src/core/contract.ts` — 契约工厂
- `packages/components/src/core/schema.ts` — 基础 Schema 定义
- `packages/components/src/core/parse.ts` — 解析工具
- `packages/components/src/core/i18n/use-i18n.ts` — i18n composable
- `packages/renderer/src/catalog.ts` — Schema catalog 注册
- `packages/server/src/resolver.ts` — 组件路径解析

**测试：**
- `vitest.config.ts` — 测试框架配置
- `src/test/setup.ts` — 测试 setup
- 各组件 `__tests__/index.test.ts` — 组件级测试

## 命名规范

**文件：**
- 组件主文件：`index.vue`（每个组件目录的根）
- 子组件文件：`cmpts/*.vue`（kebab-case，如 `gallery-grid.vue`、`geo-map-engine.vue`）
- Schema 文件：`schema.ts`（每个组件目录固定命名）
- Composable 文件：`states/use*.ts`（PascalCase 组件名，如 `useCodeBlock.ts`、`useGeoMap.ts`）
- 测试文件：`__tests__/index.test.ts`
- i18n 文件：`i18n/zh-CN.ts`、`i18n/en.ts`
- Barrel 导出：`index.ts`

**目录：**
- 组件目录：kebab-case（如 `code-block/`、`geo-map/`、`x-post/`）
- 子组件目录：`cmpts/`（统一命名，不使用 `components/` 避免与根混淆）
- Composable 目录：`states/`（简单组件）或 `composables/` + `states/`（复杂组件如 weather-widget）
- 共享代码目录：`core/`（全局）、`shared/`（跨组件非核心）
- Story 目录：`src/stories/<component-name>/`

**Vue 组件注册名：**
- `defineOptions({ name: 'CmptCodeBlock' })` — `Cmpt` 前缀 + PascalCase
- 根组件使用 `index.vue`，子组件文件名即组件名

## 新增代码放置指南

**新组件：**
- 创建目录：`packages/components/src/<component-name>/`
- 必需文件：`schema.ts`、`states/use<ComponentName>.ts`、`states/index.ts`、`index.vue`、`index.ts`
- 可选文件：`i18n/zh-CN.ts`、`i18n/en.ts`、`__tests__/index.test.ts`
- 如果有子组件，创建 `cmpts/` 目录
- 在 `packages/components/src/index.ts` 添加 barrel export
- 在 `packages/renderer/src/catalog.ts` 添加 Schema 注册
- 在 `packages/renderer/src/registry.ts` 添加组件注册
- 创建 Histoire story：`src/stories/<component-name>/index.story.vue`

**新 Schema/类型：**
- 组件级 Schema：`packages/components/src/<component>/schema.ts`
- 全局基础 Schema：`packages/components/src/core/schema.ts`

**新 Composable：**
- 组件级：`packages/components/src/<component>/states/use*.ts`
- 跨组件共享：`packages/components/src/core/` 下的新模块

**新共享 UI 原语：**
- 放置：`packages/components/src/core/components/<name>/`
- 导出：`packages/components/src/core/index.ts`

**新 i18n 消息：**
- 组件级：`packages/components/src/<component>/i18n/zh-CN.ts` 和 `en.ts`
- 全局聚合：`packages/components/src/i18n/index.ts` 中添加 import 和 mergeMessages

**新 MCP Tool：**
- 放置：`packages/server/mcp/tools/<tool-name>.ts`
- 注册：`packages/server/mcp/index.ts` 的 tools 数组

**新测试：**
- 组件测试：`packages/components/src/<component>/__tests__/index.test.ts`
- Core 测试：`packages/components/src/core/__tests__/`
- Renderer 测试：`packages/renderer/src/__tests__/`
- MCP 测试：`packages/server/mcp/__test__/`

## 特殊目录

**`packages/components/src/shared/`:**
- 用途：Shiki 主题 JS 和非核心共享类型声明
- 生成：否
- 提交：是

**`.histoire/`:**
- 用途：Histoire 开发服务器缓存
- 生成：是
- 提交：否（.gitignore）

**`dist-histoire/`:**
- 用途：Histoire 构建产物（部署到 GitHub Pages）
- 生成：是（`pnpm build:story`）
- 提交：否

**`dist/`:**
- 用途：Vite 库构建产物
- 生成：是（`pnpm build`）
- 提交：否

**`patches/`:**
- 用途：pnpm 补丁（如 `@histoire/app` 修复）
- 生成：否
- 提交：是

**`.changeset/`:**
- 用途：Changesets 版本管理配置
- 生成：否
- 提交：是

**`playground/`:**
- 用途：独立 Vite 测试应用（非 workspace 包）
- 生成：否
- 提交：是

**`packages/site/`:**
- 用途：独立 Nuxt 3 应用（有自己的 pnpm-lock.yaml 和 workspace）
- 生成：否
- 提交：是
- 注意：通过 `nuxt.config.ts` 中的 alias 直连 `@lionad/vtu-components` 源码

---

*结构分析: 2026-04-18*
