# Codebase Structure

**分析日期：** 2026-04-03

## 目录布局

```
[project-root]/
├── src/                       # 源代码
│   ├── components/            # Vue 组件（32 个组件）
│   ├── shared/                # 共享 schemas、类型、工具
│   ├── stories/               # Histoire story 文件（*.story.vue）
│   ├── test/                  # 测试配置和工具
│   ├── utils/                 # 工具函数（cn helper）
│   ├── index.ts               # 库入口点
│   └── types.d.ts             # 全局类型声明
├── playground/                # 开发 playground
├── dist/                      # 构建输出
├── docs/                      # 文档
├── .planning/                 # 规划文档
│   ├── codebase/              # 代码库分析文档
│   └── quick/                 # 快速任务计划
├── .histoire/                 # Histoire 配置
├── .vscode/                   # VS Code 设置
├── package.json               # 包清单
├── vite.config.ts             # Vite 构建配置
├── vitest.config.ts           # Vitest 测试配置
├── histoire.config.ts         # Histoire storybook 配置
├── tsconfig.json              # TypeScript 配置
└── eslint.config.*            # ESLint 配置
```

## 目录用途

**`src/components/`：**
- 目的：Vue 3 组件实现
- 包含：32 个组件目录，每个都有 schema.ts 和 index.vue
- 关键模式：每个组件导出 Serializable schema + parser 函数
- 示例：`src/components/weather-widget/`、`src/components/approval-card/`

**`src/shared/`：**
- 目的：共享契约、schemas 和工具
- 包含：
  - `schema.ts` - 基础 Tool UI schemas（ActionSchema、ToolUISurfaceSchema）
  - `contract.ts` - `defineToolUiContract()` 工厂
  - `parse.ts` - Zod 错误格式化工具
  - `utils.ts` - 共享工具（formatCount、formatRelativeTime）
  - `types.d.ts` - 模块声明
  - `media/` - 媒体处理工具
- 关键文件：`src/shared/schema.ts`、`src/shared/contract.ts`

**`src/stories/`：**
- 目的：Histoire story 文件用于组件文档
- 包含：`*.story.vue` 文件、`_shared/` 辅助文件
- 模式：每个组件一个 story 文件
- 关键文件：`src/stories/_shared/histoire-setup.ts`、`src/stories/_shared/tailwind.css`

**`src/test/`：**
- 目的：测试配置和工具
- 包含：`setup.ts`、`console-guard.ts`、`e2e/`
- 关键文件：`src/test/setup.ts` - Vitest 设置（带 Vue Test Utils）

**`src/utils/`：**
- 目的：核心工具函数
- 包含：`index.ts` 含 `cn()` 辅助函数
- 关键文件：`src/utils/index.ts`

**`playground/`：**
- 目的：开发环境
- 包含：`vite.config.ts`、测试文件

## 关键文件位置

**入口点：**
- `src/index.ts` - 库入口，从 shared 和 components 重新导出
- `src/components/index.ts` - 组件 barrel 导出
- `src/shared/index.ts` - 共享工具 barrel 导出

**配置：**
- `vite.config.ts` - Vite 库构建配置
- `vitest.config.ts` - Vitest 测试配置（jsdom 环境）
- `histoire.config.ts` - Histoire storybook 配置
- `tsconfig.json` - TypeScript 严格模式、路径别名 `@/*`
- `package.json` - Scripts：dev、build、test、story:dev

**核心逻辑：**
- `src/shared/schema.ts` - Tool UI 组件的基础 schemas
- `src/shared/contract.ts` - 契约工厂模式
- `src/shared/parse.ts` - Zod 错误格式化
- `src/utils/index.ts` - Tailwind class 合并（`cn()`）

**组件模板：**
- `src/components/.example/index.vue` - 示例组件结构
- `src/components/.example/cmpts/count-actions.vue` - 子组件示例

## 文件命名规范

**文件：**
- `*.vue` - Vue 单文件组件
- `*.ts` - TypeScript 模块
- `*.story.vue` - Histoire story 文件
- `*.test.ts` - 测试文件
- `schema.ts` - Zod schema 定义（每个组件）
- `index.ts` - Barrel 导出

**目录：**
- `cmpts/` - 子组件
- `composables/` - Vue composables
- `states/` - 状态管理逻辑
- `effects/` - 视觉效果实现
- `__tests__/` - 组件特定测试

**组件命名：**
- 目录：`kebab-case`（如 `weather-widget`、`approval-card`）
- 组件文件：`index.vue`
- 子组件：`cmpts/` 中的 `kebab-case.vue`
- Schema：导出 `SerializableXSchema` 的 `schema.ts`

## 在哪里添加新代码

**新组件：**
1. 创建目录：`src/components/{kebab-name}/`
2. 创建 `schema.ts` 含 Zod schema + 类型 + 契约
3. 创建 `index.vue` 含组件实现
4. 创建 `index.ts` 含导出
5. 添加到 `src/components/index.ts` barrel 导出
6. 创建 story：`src/stories/{name}.story.vue`

**新共享工具：**
- 添加到：`src/utils/index.ts` 或 `src/shared/utils.ts`
- 从以下导出：`src/shared/index.ts`

**新共享 Schema：**
- 添加到：`src/shared/schema.ts`
- 从以下重新导出：`src/shared/index.ts`

**新子组件：**
- 添加到：`src/components/{parent}/cmpts/{name}.vue`
- 从以下导出：`src/components/{parent}/index.ts`

**新 Composable：**
- 添加到：`src/components/{parent}/composables/useX.ts`
- 从以下导出：`src/components/{parent}/index.ts`

## 特殊目录

**`.example/`：**
- 目的：参考组件结构
- 包含：组件组织的极简示例
- 用途：作为新组件的模板复制

**`src/shared/media/`：**
- 目的：媒体处理工具
- 包含：`aspect-ratio.ts`、`format-utils.ts`、`safe-navigation.ts`、`sanitize-href.ts`
- 被用于：Image、Video、Gallery 组件

**`playground/e2e/`：**
- 目的：端到端测试场景
- 生成：否
- 提交：是

**`dist/`：**
- 目的：构建输出
- 生成：是（通过 `vite build`）
- 提交：否（在 .gitignore 中）

**`dist-histoire/`：**
- 目的：Histoire 静态构建输出
- 生成：是（通过 `histoire build`）
- 提交：否（在 .gitignore 中）

## 路径别名

**`@/` → `src/`**
- 用于：源文件、测试
- 配置于：`vite.config.ts`、`vitest.config.ts`、`tsconfig.json`

## 外部依赖

**Peer Dependencies：**
- `vue@^3.4.0` - Vue 3 框架

**关键依赖：**
- `zod@^3.23.0` - Schema 验证
- `clsx@^2.1.1` + `tailwind-merge@^2.6.1` - Class name 工具
- `@vueuse/core@^14.2.1` - Vue 工具
- `lucide-vue-next@^0.468.0` - 图标库
- `shiki@^1.24.0` - 语法高亮

**开发依赖：**
- `vite@^8.0.3` - 构建工具
- `vitest@^4.0.18` - 测试运行器
- `vue-tsc@^2.2.0` - Vue TypeScript
- `histoire@1.0.0-beta.1` - Storybook 替代品
- `tailwindcss@^4.1.18` - CSS 框架

---

*结构分析：2026-04-03*
