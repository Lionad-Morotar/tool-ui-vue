# Codebase Structure

**分析日期：** 2026-04-06

## 目录布局

```
[project-root]/
├── packages/                  # Monorepo 包
│   ├── core/                  # 基础组件 + 共享基础设施
│   │   ├── src/
│   │   │   ├── components/    # Badge、Button、Card、CopyButton
│   │   │   ├── contract.ts    # ToolUiContract 工厂
│   │   │   ├── schema.ts      # 基础 Zod schemas
│   │   │   ├── parse.ts       # Zod 错误格式化
│   │   │   ├── utils.ts       # cn()、prefersReducedMotion()
│   │   │   └── media/         # 媒体处理工具
│   │   ├── dist/              # 构建输出
│   │   ├── package.json       # @lionad/vtu-core
│   │   └── vite.config.ts
│   ├── components/            # 复杂 Tool UI 组件（32 个）
│   │   ├── src/
│   │   │   ├── approval-card/
│   │   │   ├── audio/
│   │   │   ├── chart/
│   │   │   ├── citation/
│   │   │   ├── code-block/
│   │   │   ├── code-diff/
│   │   │   ├── data-table/
│   │   │   ├── geo-map/
│   │   │   ├── image/
│   │   │   ├── image-gallery/
│   │   │   ├── instagram-post/
│   │   │   ├── item-carousel/
│   │   │   ├── link-preview/
│   │   │   ├── linkedin-post/
│   │   │   ├── message-draft/
│   │   │   ├── option-list/
│   │   │   ├── order-summary/
│   │   │   ├── parameter-slider/
│   │   │   ├── plan/
│   │   │   ├── preferences-panel/
│   │   │   ├── progress-tracker/
│   │   │   ├── question-flow/
│   │   │   ├── stats-display/
│   │   │   ├── terminal/
│   │   │   ├── video/
│   │   │   ├── weather-widget/
│   │   │   └── x-post/
│   │   ├── dist/              # 构建输出（含子路径 exports）
│   │   ├── package.json       # @lionad/vtu-components
│   │   └── vite.config.ts
│   └── theme/                 # Design tokens 和 CSS variables
│       ├── src/
│       │   ├── index.ts       # 入口（导入 tokens.css）
│       │   └── tokens.css     # CSS 变量定义
│       ├── dist/
│       ├── package.json       # @lionad/vtu-theme
│       └── vite.config.ts
├── src/                       # 根目录兼容层/文档层
│   ├── shared/                # 根级共享类型和工具（兼容层）
│   ├── stories/               # Histoire story 文件（*.story.vue）
│   ├── test/                  # Vitest 测试配置和 console-guard
│   ├── utils/                 # 根级工具函数
│   ├── index.ts               # 库入口：re-export from packages
│   └── types.d.ts             # 全局类型声明
├── playground/                # 开发 playground
│   ├── App.vue
│   ├── e2e/                   # E2E 测试
│   ├── vite.config.ts
│   └── weather-tuning/        # WeatherWidget 调试用例
├── dist/                      # 根目录构建输出（Histoire）
├── dist-histoire/             # Histoire 静态站点输出
├── docs/                      # 文档
├── .planning/                 # 规划文档
├── .histoire/                 # Histoire 配置
├── lib/                       # 自定义 ESLint 插件
├── package.json               # 根 workspace 配置
├── pnpm-workspace.yaml        # pnpm workspace
├── vite.config.ts             # 根 Vite 配置（lib 预览）
├── vitest.config.ts           # Vitest 测试配置
├── histoire.config.ts         # Histoire storybook 配置
├── tsconfig.json              # TypeScript 配置
└── eslint.config.mjs          # ESLint 配置
```

## 目录用途

**`packages/core/src/`：**
- 目的：基础组件和共享基础设施
- 包含：Button、Card、Badge、CopyButton 以及 schema/contract/parse/media 工具
- 关键文件：`contract.ts`、`schema.ts`、`parse.ts`、`utils.ts`
- 包名：`@lionad/vtu-core`

**`packages/components/src/`：**
- 目的：复杂 Tool UI 组件实现
- 包含：32 个组件目录，每个都有 schema.ts 和 index.vue
- 关键模式：Headless 架构，逻辑抽离到 `states/` 目录
- 包名：`@lionad/vtu-components`
- 依赖：`workspace:*` 引用 `@lionad/vtu-core` 和 `@lionad/vtu-theme`

**`packages/theme/src/`：**
- 目的：Design tokens 和 CSS variables
- 包含：`tokens.css`（颜色、间距、字体等变量）
- 包名：`@lionad/vtu-theme`
- 导出：`./tokens.css` 子路径

**`src/stories/`：**
- 目的：Histoire story 文件用于组件文档和视觉测试
- 包含：`*.story.vue` 文件、`_shared/` 辅助文件
- 模式：每个组件一个 story 文件

**`src/test/`：**
- 目的：测试配置和工具
- 包含：`setup.ts`、`console-guard.ts`、`e2e/`
- 关键文件：`setup.ts` - Vitest 全局设置（含 Canvas/WebGL mock）

**`playground/`：**
- 目的：开发环境
- 包含：`App.vue`、测试文件、weather-tuning 调试用例

## 关键文件位置

**入口点：**
- `src/index.ts` - 根库入口，从 `src/shared` 和 `@lionad/vtu-components` 重新导出
- `packages/core/src/index.ts` - core 包入口
- `packages/components/src/index.ts` - components barrel 导出（所有组件、类型、schemas）
- `packages/theme/src/index.ts` - theme 包入口

**配置：**
- `packages/*/vite.config.ts` - 各包的 Vite 库构建配置
- `packages/*/tsconfig.json` - 各包的 TypeScript 配置
- `vitest.config.ts` - 根测试配置
- `histoire.config.ts` - Histoire storybook 配置

**核心逻辑：**
- `packages/core/src/schema.ts` - Tool UI 组件的基础 schemas
- `packages/core/src/contract.ts` - 契约工厂模式
- `packages/core/src/parse.ts` - Zod 错误格式化
- `packages/core/src/utils.ts` - Tailwind class 合并（`cn()`）

## 文件命名规范

**文件：**
- `*.vue` - Vue 单文件组件
- `*.ts` - TypeScript 模块
- `*.story.vue` - Histoire story 文件
- `*.test.ts` - 测试文件
- `schema.ts` - Zod schema 定义（每个组件）
- `index.ts` - Barrel 导出

**目录：**
- `cmpts/` - 子组件（如 `image-gallery/cmpts/`）
- `composables/` - Vue composables（如 `weather-widget/composables/`）
- `states/` - Headless 状态逻辑（重构后主要模式）
- `effects/` - 视觉效果实现
- `__tests__/` - 组件特定测试

**组件命名：**
- 目录：`kebab-case`（如 `weather-widget`、`approval-card`）
- 组件文件：`index.vue`
- 子组件：`cmpts/` 中的 `kebab-case.vue`
- Schema：导出 `SerializableXSchema` 的 `schema.ts`

## 在哪里添加新代码

**新组件（复杂 Tool UI）：**
1. 创建目录：`packages/components/src/{kebab-name}/`
2. 创建 `schema.ts` 含 Zod schema + 类型 + 契约
3. 创建 `index.vue` 含组件实现
4. （可选）创建 `states/` 目录抽取 headless 逻辑
5. 创建 `index.ts` 含导出
6. 添加到 `packages/components/src/index.ts` barrel 导出
7. 创建 story：`src/stories/{name}.story.vue`

**新基础组件（core）：**
1. 创建目录：`packages/core/src/components/{kebab-name}/`
2. 创建 `index.vue`、`index.ts`、（可选）`variants.ts`
3. 添加到 `packages/core/src/index.ts` 导出

**新共享 Schema：**
- 添加到：`packages/core/src/schema.ts`
- 从以下重新导出：`packages/core/src/index.ts`

**新子组件：**
- 添加到：`packages/components/src/{parent}/cmpts/{name}.vue`
- 从以下导出：`packages/components/src/{parent}/index.ts`

## 路径别名

**`@/` → 各包自己的 `src/`**
- 用于：源文件、测试
- 配置于：各包 `vite.config.ts`、`tsconfig.json`

## 外部依赖

**Peer Dependencies：**
- `vue@^3.4.0` - Vue 3 框架

**关键依赖：**
- `zod@^4.3.6` - Schema 验证与类型推导
- `clsx@^2.1.1` + `tailwind-merge@^3.5.0` - Class name 工具
- `@vueuse/core@^14.2.1` - Vue 工具
- `lucide-vue-next@^1.0.0` - 图标库
- `shiki@^4.0.2` - 语法高亮
- `class-variance-authority@^0.7.1` - Core 包中的 variant 工具

**开发依赖：**
- `vite@^8.0.3` - 构建工具
- `vitest@^4.1.2` - 测试运行器
- `vue-tsc@^3.2.6` - Vue + TypeScript 类型检查
- `histoire@1.0.0-beta.1` - Storybook 替代品
- `tailwindcss@^4.2.2` - CSS 框架

---

*结构分析：2026-04-06*
