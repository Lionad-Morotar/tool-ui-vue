# Phase 8: json-render demo - Context

**Gathered:** 2026-04-15
**Status:** Ready for planning

<domain>
## Phase Boundary

在 playground 中新增一个完全独立的 json-render demo 页面，与现有功能无任何交集。该页面仅作为 `@json-render/vue` 的集成验证和参考实现，按照 https://github.com/vercel-labs/json-render/blob/main/examples/vue/src/DemoRenderer.vue 的代码结构初始化 demo。

</domain>

<decisions>
## Implementation Decisions

### 页面入口方式
- **D-01:** 采用 element-plus playground 的动态入口模式（参考 `/Users/lionad/Github/Lionad-Morotar/element-plus/play/main.ts`）：
  - `playground/main.ts` 使用 `import.meta.glob` 动态扫描 `playground/pages/*.vue`
  - 根据 `location.pathname` 自动加载对应页面组件
  - 默认 path 为空时回退到加载 `App.vue`（现有 DemoRestaurant 入口）
  - 不引入 vue-router，保持 playground 的轻量性

### demo 页面位置与结构
- **D-02:** 新建 `playground/pages/json-render.vue` 作为 demo 入口页面
- **D-03:** 在 `playground/json-render/` 目录下创建以下文件，结构与参考代码一一对应：
  - `catalog.ts` — 组件/动作 schema 定义（对应 `examples/vue/src/lib/catalog.ts`）
  - `registry.ts` — 渲染器组件实现（对应 `examples/vue/src/lib/registry.ts`）
  - `spec.ts` — JSON 描述结构（对应 `examples/vue/src/lib/spec.ts`）
  - `handlers.ts`（可选）或内联 — action handler 逻辑
- **D-04:** `json-render.vue` 中完整引入 `ActionProvider`、`ValidationProvider`、`VisibilityProvider`、`Renderer`、`defineRegistry`、`useStateStore`

### 依赖
- **D-05:** 新增依赖：`@json-render/vue` 和 `@json-render/core`（项目已有 `zod`，无需重复安装）

### 与现有功能隔离
- **D-06:** json-render demo 不使用任何项目现有组件、工具、composables、theme 或样式系统
- **D-07:** 访问路径为 `http://localhost:5749/json-render/`，现有 `App.vue` 继续在根路径正常工作

### Dev Server 配置
- **D-08:** 保持现有 `playground/index.html` 不变；Vite dev server 的 history fallback 会自动将 `/json-render` 指向 `index.html`，由 `main.ts` 完成页面路由

</decisions>

<canonical_refs>
## Canonical References

### 外部参考代码
- `https://github.com/vercel-labs/json-render/blob/main/examples/vue/src/DemoRenderer.vue` — demo 入口组件结构
- `https://github.com/vercel-labs/json-render/blob/main/examples/vue/src/lib/catalog.ts` — schema/catalog 定义
- `https://github.com/vercel-labs/json-render/blob/main/examples/vue/src/lib/registry.ts` — 组件渲染器实现
- `https://github.com/vercel-labs/json-render/blob/main/examples/vue/src/lib/spec.ts` — JSON spec 描述

### 内部参考
- `/Users/lionad/Github/Lionad-Morotar/element-plus/play/main.ts` — 动态入口加载模式参考
- `playground/vite.config.ts` — playground 现有 Vite 配置
- `playground/App.vue` — 现有默认入口

</canonical_refs>
