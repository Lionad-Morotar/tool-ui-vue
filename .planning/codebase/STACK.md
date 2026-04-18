# 技术栈

**分析日期：** 2026-04-18

## 语言

**主要：**
- TypeScript `^6.0.2` - 全项目核心语言，所有包均使用 strict 模式
- Vue SFC (`.vue`) - 组件开发，`<script setup lang="ts">` 标准写法

**辅助：**
- CSS (Tailwind CSS v4 语法) - 样式与设计令牌
- JSON - Zod schema 定义与数据序列化

## 运行时

**环境：**
- Node.js `v24`（`.node-version` 指定 `v24`）
- ESM 优先：`"type": "module"` 贯穿所有包

**包管理器：**
- pnpm `10.15.0`（`packages/site` 的 `packageManager` 指定 `pnpm@10.33.0`）
- Lockfile: `pnpm-lock.yaml` (lockfileVersion `9.0`)，已提交
- `.npmrc`: `min-release-age=7`（防止依赖过新）

## 框架

**核心：**
- Vue `^3.5.32` - 组件库基础框架，peerDependency `^3.4.0`
- Zod `^4.3.6` - Schema 验证，所有组件的 props 类型与序列化校验均基于 Zod schema
- Tailwind CSS `^4.2.2` - 样式系统，通过 `@tailwindcss/vite` 集成

**站点：**
- Nuxt `^4.4.2` - 官方站点 (`@lionad/vtu-site`)，SSG 静态生成
- `@nuxt/ui` `^4.6.1` - Nuxt UI 组件框架
- TresJS (`@tresjs/core` `^5.8.0`, `@tresjs/nuxt` `^5.6.0`) - 3D 场景（hexnut 动画）
- Three.js (`three` `^0.174.0`) - 3D 渲染底层

**文档：**
- Histoire `1.0.0-beta.1` - 组件 Storybook，`@histoire/plugin-vue` 插件

**测试：**
- Vitest `^4.1.2` - 单元测试框架
- `@vue/test-utils` `^2.4.6` - Vue 组件测试工具
- `@vitest/coverage-v8` `^4.1.2` - 覆盖率收集
- jsdom `^29.0.1` - DOM 环境模拟

**版本管理：**
- Changesets (`@changesets/cli` `^2.30.0`) - 版本号管理与发布
- `@changesets/changelog-github` `^0.6.0` - GitHub changelog 生成

**构建/开发：**
- Vite `^8.0.3` - 构建工具，library mode 输出 ESM + CJS 双格式
- `vite-plugin-dts` `^4.5.4` - `.d.ts` 类型声明生成
- `@vitejs/plugin-vue` `^6.0.5` - Vue SFC 编译
- `vue-tsc` `^3.2.6` - Vue TypeScript 类型检查
- `unplugin-auto-import` `^21.0.0` - 自动导入 Vue/VueUse API
- `unplugin-vue-components` `^32.0.0` - 自动注册组件

**Lint/格式化：**
- ESLint `^10.2.0` - 代码检查（flat config: `eslint.config.mjs`）
- `typescript-eslint` `^8.58.0` - TypeScript 规则
- `eslint-plugin-vue` `^10.8.0` - Vue 规则
- `eslint-plugin-tailwindcss` `4.0.0-beta.0` - Tailwind class 规则
- `eslint-plugin-import-x` `^4.16.2` - 导入顺序规则
- 自定义 ESLint 插件: `v-tw-merge`, `bem-order`, `i18n`（位于 `lib/` 目录）

## 关键依赖

**核心库：**
- `zod` `^4.3.6` - 所有组件 props 的 schema 定义、序列化/反序列化校验
- `shiki` `^4.0.2` - 代码高亮，用于 `CodeBlock` 组件 (`packages/components/src/code-block/`)
- `diff` `^8.0.4` - 文本差异计算，用于 `CodeDiff` 组件 (`packages/components/src/code-diff/`)
- `ansi-to-html` `^0.7.2` - ANSI 转义序列转 HTML，用于 `Terminal` 组件
- `class-variance-authority` `^0.7.1` - 组件变体样式，用于 `Badge`/`Button` 等核心组件 (`packages/components/src/core/components/`)
- `clsx` `^2.1.1` + `tailwind-merge` `^3.5.0` - CSS class 合并工具 (`cn()` 函数)
- `lucide-vue-next` `^1.0.0` - 图标库，广泛用于各组件

**地图/可视化：**
- `leaflet` `^1.9.4` + `@vue-leaflet/vue-leaflet` `^0.10.1` - 交互地图，`GeoMap` 组件
- `supercluster` `^8.0.1` - 地图标记聚类算法

**注意：** `chart.js` 和 `vue-chartjs` 虽在 `package.json` 中声明，但 `Chart` 组件实际使用自定义 Canvas 渲染，未引用 chart.js。

**JSON 渲染：**
- `@json-render/core` `^0.17.0` + `@json-render/vue` `^0.17.0` - JSON Schema 驱动的组件渲染引擎

**MCP 服务器：**
- `@modelcontextprotocol/sdk` `^1.29.0` - Model Context Protocol SDK，用于 `@lionad/vtu-server`

**UI 工具：**
- `overlayscrollbars` `^2.15.1` + `overlayscrollbars-vue` `^0.5.9` - 自定义滚动条
- `@vueuse/core` `^14.2.1` - Vue composable 工具集（`useMediaControls`, `useVModel`, `usePreferredReducedMotion`, `createSharedComposable` 等）

**站点专属：**
- `markstream-vue` `^0.0.12` - 流式 Markdown 渲染
- `@iconify-json/lucide` + `@iconify-json/simple-icons` - 图标数据集
- `@nuxtjs/color-mode` `^3.5.2` - 暗色/亮色主题切换

**VueUse 子包使用情况：**
- `@vueuse/core` - 实际在源码中广泛使用
- `@vueuse/nuxt` - 仅在 Nuxt 站点作为 module 注册
- `@vueuse/motion`, `@vueuse/components`, `@vueuse/integrations`, `@vueuse/router` - 在 `package.json` 中声明但源码中未发现直接引用

## Monorepo 包结构

| 包名 | 用途 | 构建产物 |
|------|------|----------|
| `@lionad/vtu-components` | Vue 3 组件库核心（29 个组件） | ESM + CJS + `.d.ts` + `tokens.css` |
| `@lionad/vtu-renderer` | JSON Schema 驱动 Vue 组件渲染器 | ESM + CJS + `.d.ts` |
| `@lionad/vtu-server` | MCP 服务器（stdio transport） | Node.js CLI (`vtu-mcp-server`) |
| `@lionad/vtu-theme` | 设计令牌与 CSS 变量 | ESM + CJS + `tokens.css` |
| `@lionad/vtu-site` | 官方站点 (Nuxt SSG) | 静态 HTML |
| `packages/skills/tool-ui-vue/` | MCP 技能定义 | 非独立发布 |

**发布策略（`.changeset/config.json`）：**
- `@lionad/vtu-components`, `@lionad/vtu-renderer`, `@lionad/vtu-server` 固定版本联动（fixed versioning）
- `@lionad/vtu-theme` 和 `@lionad/vtu-site` 不参与 Changesets 发布
- 仓库: `Lionad-Morotar/tool-ui-vue`
- npm access: public

## 构建

**构建配置：**
- `packages/components/vite.config.ts` - library mode，外部化所有非 `@lionad/vtu-*` 依赖
- `packages/renderer/vite.config.ts` - library mode，外部化 `vue`, `@json-render/*`, `@lionad/vtu-components`
- `packages/theme/vite.config.ts` - 纯 CSS/TS 输出，无外部化
- `packages/server/tsconfig.json` - `tsc` 直接编译 + `scripts/copy-sources.mjs` 后处理
- `packages/site/nuxt.config.ts` - Nuxt SSG 生成
- `histoire.config.ts` - Histoire 文档构建，Vite 集成 Tailwind CSS v4
- `vitest.config.ts` - Vitest 测试配置，集成 auto-import 和 component resolver
- `playground/vite.config.ts` - Playground 开发服务器

**TypeScript 配置：**
- 根 `tsconfig.json` - `target: ES2021`, `module: ESNext`, `moduleResolution: bundler`, `strict: true`
- `tsconfig.node.json` - Vite 配置专用
- `packages/server/tsconfig.json` - `target: ES2022`, `module: Node16`, `moduleResolution: Node16`（Node.js 运行时）

**TypeScript 关键设置：**
- `"noUnusedLocals": true`, `"noUnusedParameters": true` - 严格未使用检查
- `"declaration": true`, `"declarationMap": true` - 生成类型声明
- 路径别名: `@/*` → `./src/*`, `@lionad/vtu-components` → `./packages/components/src`

**CSS 架构：**
- Tailwind CSS v4 - 使用 `@theme` 块注册设计令牌
- 设计令牌文件: `packages/theme/src/tokens.css` - 定义颜色、间距、圆角、阴影等 CSS 变量
- 支持亮色/暗色主题：通过 `[data-theme="dark"]`（站点）和 `.dark`（Histoire）选择器
- 站点 CSS 入口: `packages/site/app/assets/css/main.css` - 导入 Tailwind + Nuxt UI + 主题令牌

## 开发命令

```bash
# 开发
pnpm dev:site              # 启动 Nuxt 站点 (127.0.0.1:5740)
pnpm dev:histoire           # 启动 Histoire Storybook (--host, port 5741)
pnpm dev:playground         # 启动 Playground (port 5749)

# 构建
pnpm build                  # 构建所有 packages/*
pnpm build:site             # Nuxt SSG 静态生成
pnpm build:story            # Histoire 构建文档
pnpm build:pages            # 同时构建站点 + Histoire
pnpm build:server           # 仅构建 MCP server

# 代码质量
pnpm test                   # 运行 Vitest 全部测试（单次）
pnpm lint                   # ESLint 检查 + 自动修复
pnpm typecheck              # TypeScript 类型检查（所有包）
pnpm check                  # lint + typecheck

# 发布
pnpm changeset              # 创建 changeset
pnpm version                # 更新版本号
pnpm release                # 构建 + 发布
pnpm publish:components     # 发布组件库到 npm
pnpm publish:renderer       # 发布渲染器到 npm
pnpm publish:server         # 发布 MCP server 到 npm
pnpm publish:all            # 发布全部三个包

# 其他
pnpm serve:pages            # 合并站点 + Histoire 到本地静态服务
```

## 平台要求

**开发环境：**
- Node.js >= 24（`.node-version` 指定）
- pnpm >= 10（workspace 需要 lockfileVersion 9.0）
- 系统字体支持（设计令牌使用 `ui-sans-serif, system-ui`）

**生产部署：**
- GitHub Pages - 站点 + Histoire 文档通过 GitHub Actions 部署
- npm Registry - 组件库包公开发布 (`@lionad/vtu-*`)
- MCP Server - 通过 stdio transport 运行，支持任意 MCP 客户端

---

*技术栈分析：2026-04-18*
