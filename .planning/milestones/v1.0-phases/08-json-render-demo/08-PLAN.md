# Phase 8: json-render demo - Plan

**Objective:** 在 playground 中新增一个完全独立的 json-render demo 页面，按照 Vercel 参考代码初始化，与现有功能零交集。

## Pre-flight
- 已确认 npm 包：`@json-render/vue@0.17.0`（已内联依赖 `@json-render/core@0.17.0`）
- 参考代码来源：https://github.com/vercel-labs/json-render/blob/main/examples/vue/src/DemoRenderer.vue 及其 lib/ 下的 catalog.ts、registry.ts、spec.ts

## Task 1: 安装依赖
- [ ] 运行 `pnpm add @json-render/vue -D`（core 作为 transitive dep 自动引入；zod 项目已有）

## Task 2: 改造 playground 入口为动态加载模式
- [ ] 提前创建 `playground/pages/` 目录
- [ ] 修改 `playground/main.ts`：
  - 使用 `import.meta.glob('./pages/*.vue')` 扫描页面（返回 `{ './pages/xxx.vue': () => Promise<...> }`）
  - 读取 `location.pathname.replace(/^\//, '').replace(/\/$/, '')` 决定页面名
  - 如果页面名为空字符串，或 glob 中找不到 `./pages/{name}.vue`，则回退到 `App.vue`
  - 调用对应的加载函数获取 `.default` 组件，然后 `createApp(Component).mount('#app')`

## Task 3: 创建 json-render demo 页面和配套文件
- [ ] 新建 `playground/pages/json-render.vue`：
  - 参考 `DemoRenderer.vue` 结构，在 `<script setup>` 中引入 `ActionProvider`、`ValidationProvider`、`VisibilityProvider`、`Renderer`、`defineRegistry`、`useStateStore`
  - 从 `../json-render/catalog` 导入 `catalog`，从 `../json-render/registry` 导入 `components`，从 `../json-render/spec` 导入 `demoSpec`
  - 在组件内直接内联定义 `handlers`（increment / decrement / reset / toggleItem），通过 `useStateStore` 的 `get/set` 操作状态
  - Template 中按顺序嵌套：`<ActionProvider :handlers="handlers">` → `<VisibilityProvider>` → `<ValidationProvider>` → `<Renderer :spec="demoSpec" :registry="registry" />`
- [ ] 新建 `playground/json-render/catalog.ts`：完整复刻参考 `lib/catalog.ts`（Stack / Card / Text / Button / Badge / ListItem / Input 的 zod schema + actions 定义）
- [ ] 新建 `playground/json-render/registry.ts`：完整复刻参考 `lib/registry.ts`（用 `h()` 实现的 7 个组件渲染器）
- [ ] 新建 `playground/json-render/spec.ts`：完整复刻参考 `lib/spec.ts`（含 root / state / elements 的 demoSpec）

## Task 4: 验证运行
- [ ] 启动 `pnpm dev:playground`
- [ ] 访问 `http://localhost:5749/json-render`，确认页面正常渲染（Counter、Todo List、Bound Input）
- [ ] 访问 `http://localhost:5749/json-render/`，确认带尾部斜杠也能正常渲染
- [ ] 访问根路径 `http://localhost:5749/`，确认现有 DemoRestaurant 仍然正常显示
- [ ] 运行 `pnpm vue-tsc --noEmit`（或项目等效类型检查命令），确保 playground 新增代码无类型错误

## Success Criteria
1. `pnpm dev:playground` 启动后 `/json-render` 和 `/json-render/` 路径都能正常展示 json-render demo
2. 根路径 `/` 仍然展示现有的 DemoRestaurant
3. json-render demo 不导入任何项目内部组件/工具/theme
4. 类型检查通过，无新增 build/type 错误
