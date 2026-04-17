# Technology Stack

**分析日期：** 2026-04-06

## 编程语言

**主要语言：**
- TypeScript 5.9+ / 6.0+ — 源码、测试、构建配置全部使用 TS
- Vue SFC (`.vue`) — 组件开发

**次要语言：**
- CSS / Tailwind CSS — 组件样式（v4 新引擎）

## 运行时环境

**环境：**
- Node.js（由 `pnpm` 和 `vite` 推断，无显式 `.nvmrc`）

**包管理器：**
- pnpm — 由 `pnpm-lock.yaml` 和 `pnpm-workspace.yaml` 确认
- Lockfile: `pnpm-lock.yaml` 存在
- 工作区配置: `pnpm-workspace.yaml`（包含 `allowBuilds: '@parcel/watcher': true`）
- Monorepo 包：**`@lionad/vtu-components`**（对外发布）、`@lionad/vtu-core`（内嵌）、`@lionad/vtu-theme`（内部）

## 框架

**核心：**
- Vue 3.5+ — 前端框架（peer dependency，组件库目标运行时）
- Vite 8.0.3 — 构建工具与开发服务器
- Tailwind CSS 4.2.2 — 原子化 CSS 框架（`@tailwindcss/vite` 插件 4.2.2）

**测试：**
- Vitest 4.1.2 — 单元测试与 E2E 组件挂载测试
- `@vue/test-utils` 2.4.6 — Vue 组件测试工具
- jsdom 29.0.1 — 测试运行时的 DOM 环境
- `@vitest/coverage-v8` — 覆盖率收集

**构建/开发：**
- `vue-tsc` 2.2.0 / 3.2.6 — Vue + TypeScript 类型检查
  - `packages/theme` 使用 2.2.0
  - `packages/core`、`packages/components` 使用 3.2.6
- `vite-plugin-dts` 4.5.4 — 自动生成 `.d.ts` 声明文件
- Histoire 1.0.0-beta.1 — Story 文档与组件展示
- `@histoire/plugin-vue` 1.0.0-beta.1 — Histoire 的 Vue 支持
- `unplugin-auto-import` 21.0.0 — 自动导入组合式函数
- `unplugin-vue-components` 32.0.0 — 自动组件解析

**代码检查：**
- ESLint 10.2.0 + `typescript-eslint` 8.58.0 + `eslint-plugin-vue` 10.8.0
- 自定义 ESLint 插件：`lib/eslint-plugin-v-tw-merge.mjs`

## 关键依赖

**核心（组件功能依赖）：**
- `zod` 4.3.6 — 所有组件 props 的 schema 校验与类型推导（`packages/core/src/schema.ts` 及各组件 `schema.ts`）
- `@vueuse/core` / `@vueuse/components` / `@vueuse/integrations` / `@vueuse/motion` / `@vueuse/router` / `@vueuse/nuxt` 14.2.1 — Vue 组合式工具集
- `shiki` 4.0.2 — 代码高亮（`code-block` 组件）
- `chart.js` 4.5.1 + `vue-chartjs` 5.3.3 — 图表渲染（`stats-display`、`chart` 组件）
- `leaflet` 1.9.4 + `@vue-leaflet/vue-leaflet` 0.10.1 + `supercluster` 8.0.1 — 地图组件（`geo-map`）
- `diff` 8.0.4 — 代码 diff 计算（`code-diff` 组件）
- `ansi-to-html` 0.7.2 — ANSI 终端输出转 HTML（`terminal` 组件）
- `lucide-vue-next` 1.0.0 — 图标库
- `clsx` 2.1.1 + `tailwind-merge` 3.5.0 — class 合并工具（`packages/core/src/utils.ts`）
- `class-variance-authority` 0.7.1 — Core 包中的 variant 定义工具

**基础设施：**
- `autoprefixer` 10.4.27 + `postcss` 8.5.8 — CSS 后处理
- `eslint-import-resolver-typescript` 4.4.4 + `eslint-plugin-import-x` 4.16.2 + `eslint-plugin-tailwindcss` 4.0.0-beta.0 — ESLint 扩展

## 配置

**环境：**
- 无 `.env` 文件 — 项目为纯前端组件库，不依赖运行时环境变量
- 类型声明引用了 Vite 客户端类型：`src/types.d.ts` 包含 `/// <reference types="vite/client" />`

**构建：**
- `packages/*/vite.config.ts` — 各包的库模式构建配置（输出 `es` + `cjs`）
- `packages/*/tsconfig.json` — 严格 TS 配置，各包独立
- `tsconfig.json` / `tsconfig.node.json` — 根配置和 Node 脚本配置
- `vitest.config.ts` — 测试配置
- `histoire.config.ts` — Story 文档站点配置

## 平台要求

**开发：**
- pnpm
- 支持 ES2021+ 的浏览器运行时

**生产：**
- 输出为 npm workspace packages，无独立部署流程
- 发布产物位于各包 `dist/`（`.js`、`.cjs`、`.d.ts`）
- 通过 `package.json` `exports` 暴露入口和子路径：
  - `@lionad/vtu-components/components/*`
  - `@lionad/vtu-components/tokens.css`

## 开发命令

```bash
# 开发
pnpm dev            # 启动 playground（port 5740）
pnpm dev:lib        # 启动库模式 Vite 预览
pnpm story:dev      # 启动 Histoire story 服务（port 5741）
pnpm story:build    # 构建 Histoire 站点
pnpm story:preview  # 预览 Histoire 构建产物

# 构建与检查
pnpm build          # 递归构建所有 packages/*
pnpm typecheck      # 递归类型检查所有 packages/*
pnpm typecheck:all  # 递归类型检查所有 workspace 包
pnpm lint           # ESLint 自动修复
pnpm check          # lint + typecheck:all

# 测试
pnpm test           # 运行 Vitest（单次）
pnpm test:watch     # 运行 Vitest（watch 模式）
```

---

*技术栈分析：2026-04-06*
