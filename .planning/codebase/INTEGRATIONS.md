# 外部集成

**分析日期：** 2026-04-18

## API 与外部服务

**本项目为 Vue 3 组件库，核心运行时无业务后端 API 集成。** 组件通过 props 接收数据，不发起网络请求。

以下为组件运行时涉及的外部资源：

**地图 Tile 服务：**
- CartoDB basemaps - `GeoMap` 组件默认瓦片图层
  - Light theme: `https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png`
  - Dark theme: `https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png`
  - 文件: `packages/components/src/geo-map/cmpts/geo-map-engine.vue`
  - 注意: `tileUrl` 可通过 props 覆盖，用户可指定自定义瓦片服务

**语法高亮引擎：**
- Shiki - `CodeBlock` 组件的代码语法高亮
  - 运行时通过 `import('shiki')` 动态加载
  - 使用 `createJavaScriptRegexEngine()` 作为正则引擎
  - 语言包通过 `highlighter.loadLanguage()` 按需加载
  - 文件: `packages/components/src/code-block/states/useCodeBlock.ts`

**MCP (Model Context Protocol) 服务：**
- `@modelcontextprotocol/sdk` `^1.29.0` - 用于 `@lionad/vtu-server`
  - Transport: stdio
  - 用途: 为 AI 编码助手提供组件库的元数据、文档、示例查询能力
  - 文件: `packages/server/mcp/index.ts`
  - 注册的工具:
    - `searchComponents` - 搜索组件
    - `searchComposables` - 搜索 composable
    - `searchDocumentation` - 搜索文档
    - `searchIcons` - 搜索图标
    - `getComponent` - 获取组件源码
    - `getComponentMetadata` - 获取组件元数据
    - `getDocumentationPage` - 获取文档页面
    - `getExample` - 获取示例
    - `listExamples` - 列出所有示例
  - 注册的资源:
    - `components` - 组件列表
    - `composables` - composable 列表
    - `documentation-pages` - 文档页面列表
    - `examples` - 示例列表
  - 注册的提示:
    - `find-component-for-usecase` - 按使用场景查找组件
    - `implement-component-with-props` - 用 props 实现组件
    - `setup-project-with-template` - 使用模板设置项目

**JSON Schema 渲染引擎：**
- `@json-render/core` `^0.17.0` + `@json-render/vue` `^0.17.0`
  - 用途: 根据 JSON Schema spec 动态渲染 Vue 组件
  - 集成位置: `packages/renderer/`
  - 入口: `packages/renderer/src/renderer.vue` - 组合 `StateProvider`, `ActionProvider`, `VisibilityProvider`, `ValidationProvider`
  - Registry: `packages/renderer/src/registry.ts` - 注册所有 VTU 组件到渲染引擎
  - Catalog: `packages/renderer/src/catalog.ts` - 定义所有组件的 Zod schema 映射

## 数据存储

**数据库：**
- 无 - 纯前端组件库，不使用数据库

**文件存储：**
- 本地文件系统 - 组件接收 URL/数据，不直接管理存储

**缓存：**
- 无显式缓存层
- 浏览器原生缓存 Shiki 语言包与地图 tiles

## 认证与身份

**认证提供者：**
- 无 - 纯 UI 组件库，不承担认证职责

## 监控与可观测性

**错误追踪：**
- 无

**日志：**
- 控制台日志限于测试辅助（`src/test/console-guard.ts`）
- MCP Server 输出到 stderr（`console.error('tool-ui-vue MCP server running on stdio')`）

## CI/CD 与部署

**托管：**
- GitHub Pages - 官方站点 + Histoire 文档
  - 工作流: `.github/workflows/deploy-pages.yml`
  - 触发: push to `main`
  - 流程: pnpm install -> 递归构建 -> Nuxt SSG -> Histoire 构建 -> 合并 Histoire 到站点 `/docs/` -> 部署
  - 并发控制: `group: pages`, `cancel-in-progress: false`
  - Node 版本: 22 (CI), 本地 24 (`.node-version`)

**npm 发布：**
- Changesets 管理版本号和发布
- 三个包公开发布: `@lionad/vtu-components`, `@lionad/vtu-renderer`, `@lionad/vtu-server`
- 发布命令: `pnpm release` (build + changeset publish)

**CI 流水线详情：**
- Runner: `ubuntu-latest`
- 步骤: checkout -> pnpm setup (v10) -> Node 22 setup -> pnpm install -> 递归构建 -> 站点构建 -> Histoire 构建 -> 合并 -> Upload artifact -> Deploy to GitHub Pages

## 环境配置

**必需的环境变量：**
- 无 - 项目本身不依赖环境变量
- 站点 `baseURL` 根据 `process.env.NODE_ENV` 自动切换（生产环境 `/tool-ui-vue/`，开发环境 `/`）

**Secrets 位置：**
- 无 `.env` 文件
- Changesets 使用 `@changesets/changelog-github`，可能需要 GitHub token（CI 中通过默认 `GITHUB_TOKEN` 获取）

## Webhooks 与回调

**接收：**
- 无

**发送：**
- 无

## 仅用于文档/示例的外部资源

以下资源仅出现在 Story 和演示页面中，非组件库核心依赖：

- `picsum.photos` - Story 示例中的占位图片
- `cdn.jsdelivr.net/npm/tailwindcss@3.4.0/dist/tailwind.min.css` - Histoire 文档站点样式
- `cdn.tailwindcss.com` - Histoire 测试 Story 动态加载
- `commondatastorage.googleapis.com` - Story 中示例视频资源

## Histoire 文档配置

**配置文件:** `histoire.config.ts`
- 输出目录: `dist-histoire/`
- 路由模式: hash
- Vite base: `/tool-ui-vue/docs/`
- Setup 文件: `src/stories/_shared/histoire-setup.ts`
- 组件分组:
  - Data Display: chart, data-table, stats-display, weather-widget
  - Code & Terminal: code-block, code-diff, terminal
  - Media: audio, image, image-gallery, item-carousel, video
  - Social: approval-card, citation, instagram-post, linkedin-post, link-preview, message-draft, x-post
  - Forms & Input: option-list, parameter-slider, preferences-panel
  - Workflow: geo-map, plan, progress-tracker, question-flow, order-summary

---

*集成审计：2026-04-18*
