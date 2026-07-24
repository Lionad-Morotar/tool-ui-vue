---
name: tool-ui-vue
description: |
  Help developers use the tool-ui-vue (VTU) Vue 3 component library.
  TRIGGER this skill whenever the user asks about:
  - tool-ui-vue, VTU, or Vue Agent UI components
  - how to build tool-call widgets, chat cards, or interactive AI outputs
  - copying or integrating components from the monorepo
  - i18n, theming, or schema usage inside tool-ui-vue
  - which component to use for a specific scenario (maps, charts, social posts, code blocks, etc.)
  - styling issues with VTU components
  - headless states, JSON-driven rendering, or the renderer package
---

# tool-ui-vue Assistant

You are an expert on the `tool-ui-vue` (VTU) Vue 3 component library — a Vue 3 + Zod + Tailwind CSS v4 component toolkit for agent tool-call UIs.

**Stack**: Vue 3 + TypeScript + Zod + Tailwind CSS v4

**Monorepo layers**:
- `@lionad/vtu-components` — 27 tool-specific components (charts, maps, social posts, code blocks, etc.) + 内嵌 core primitives、i18n、design tokens
- `@lionad/vtu-renderer` — JSON-driven component rendering
- `@lionad/vtu-server` — MCP server exposing component data

## 安装本 skill

本 skill 托管在 GitHub 仓库中，通过 [`npx skills`](https://github.com/vercel-labs/skills) 安装：

```bash
# 仓库简写（若 SKILL.md 位于仓库根目录或 CLI 能自动发现）
npx skills add Lionad-Morotar/tool-ui-vue

# 或指向 skill 所在子目录
npx skills add https://github.com/Lionad-Morotar/tool-ui-vue/tree/main/packages/skills/tool-ui-vue
```

## 核心规则（始终遵循）

1. **组件根元素**使用 `cmpt-` kebab-case 标识（如 `cmpt-data-table`），带 `data-tool-ui-id` 属性
2. **数据验证**通过 Serializable Zod schemas（JSON-safe），运行时通过 Props 接口（含 css + 回调）
3. **样式覆盖**通过 `css` prop（Tailwind 类字符串），不修改组件源码
4. **默认中文** locale（zh-CN），组件导入时自动注册；通过 `registerEnglish()` 切换英文
5. **Headless 架构** — 组件逻辑在 `states/` composable 中，`index.vue` 仅绑定视图

## 如何使用本 skill

按需加载参考文件，不要一次全部读取。根据用户问题查阅路由表中对应的文件。

### 参考文件

#### 快速参考
- `references/components.md` — 组件索引（27 个组件，按类别分组）

#### 指南
- `references/guidelines/conventions.md` — 命名约定、目录结构、TypeScript 模式、CSS prop 系统
- `references/guidelines/schema-contracts.md` — Zod schema 模式、Contract 系统、Serializable vs Props、Action/Decision 模式
- `references/guidelines/theming.md` — Token 系统、CSS 变量、dark mode、css prop 覆盖
- `references/guidelines/i18n.md` — LocaleProvider、useI18n、registerEnglish、组件级 i18n

#### 配方
- `references/recipes/component-usage.md` — 安装、基本用法、事件处理、peer 依赖
- `references/recipes/headless-states.md` — 使用 states/ composables 自定义 UI
- `references/recipes/json-rendering.md` — Renderer 包、Catalog + Registry、错误边界
- `references/recipes/mcp-server.md` — MCP Server 安装（Claude Code / Cursor / Windsurf）

### 路由表

| 用户问题 | 加载文件 |
|---------|----------|
| "有哪些组件？/ 用哪个组件？" | `references/components.md` |
| "怎么命名？/ 文件结构？" | `references/guidelines/conventions.md` |
| "怎么定义 schema？/ parse 和 safeParse？" | `references/guidelines/schema-contracts.md` |
| "怎么改颜色？/ dark mode？" | `references/guidelines/theming.md` |
| "怎么切换语言？" | `references/guidelines/i18n.md` |
| "怎么安装？/ 怎么用？" | `references/recipes/component-usage.md` |
| "想自定义 UI / 只用逻辑" | `references/recipes/headless-states.md` |
| "JSON 渲染 / 动态渲染" | `references/recipes/json-rendering.md` |
| "样式坏了" | `references/guidelines/theming.md` + `references/recipes/component-usage.md` 中的故障排除 |
| "LLM/AI 集成" | `references/guidelines/schema-contracts.md` + `references/recipes/json-rendering.md` |
| "MCP server / 安装 server" | `references/recipes/mcp-server.md` |

## 安装

```bash
pnpm add @lionad/vtu-components
```

在入口 CSS 文件中，添加在 `@import "tailwindcss"` 之后：

```css
@import "@lionad/vtu-components/style.css";
```

不使用 Tailwind 的项目暂不支持（组件依赖 Tailwind utility classes 生成布局样式）。

> **Monorepo / pnpm 严格模式**：上条 `@import` 走 node 解析；若 vtu 是传递依赖（不在当前包 `node_modules`）会解析失败，需把 `@lionad/vtu-components` 提升为直接依赖或 hoist。**样式坏了**（边框发黑 / 颜色丢失，通常是 `style.css` 没进 Tailwind 入口致 `@theme` 未生效）见 `references/recipes/component-usage.md`「样式故障排除」。

### 快速开始

```vue
<script setup lang="ts">
import { CodeBlock } from '@lionad/vtu-components'
import type { SerializableCodeBlock } from '@lionad/vtu-components'

const data: SerializableCodeBlock = {
  code: "console.log('hello')",
  language: 'javascript',
  filename: 'hello.js',
  lineNumbers: true,
}
</script>

<template>
  <CodeBlock v-bind="data" />
</template>
```
