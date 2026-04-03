# Architecture

**分析日期：** 2026-04-03

## 模式概览

**整体：** 基于契约的组件库架构（Contract-Driven Design）

**关键特性：**
- 使用 Zod 进行运行时校验的 Schema-first 组件设计
- Copy-paste 风格的组件库（非传统 npm 包形式）
- 可序列化的数据契约，用于 AI/LLM 工具 UI 渲染
- 模块化组件结构，支持子组件（cmpts）
- Vue 3 Composition API + TypeScript

## 分层架构

**核心契约层：**
- 目的：定义数据 schemas、类型和验证逻辑
- 位置：`src/shared/`
- 包含：Zod schemas、基础类型、解析工具、契约
- 依赖：Zod 库
- 被用于：所有组件层

**组件层：**
- 目的：实现带 schema 验证的 Vue 组件
- 位置：`src/components/{component-name}/`
- 包含：组件逻辑、模板、样式、子组件
- 依赖：核心契约层、Vue 3
- 被用于：应用层、Story 层

**共享工具层：**
- 目的：通用工具函数
- 位置：`src/utils/`、`src/shared/utils.ts`
- 包含：`cn()` 辅助函数（Tailwind class 合并）、格式化工具
- 依赖：clsx、tailwind-merge
- 被用于：所有组件

**媒体层：**
- 目的：共享媒体处理逻辑（图片、视频等）
- 位置：`src/shared/media/`
- 包含：宽高比工具、格式化工具、安全导航
- 依赖：无
- 被用于：Image、Video、Gallery 组件

**Stories 层：**
- 目的：组件文档和视觉测试
- 位置：`src/stories/`
- 包含：Histoire story 文件（*.story.vue）
- 依赖：组件层
- 被用于：Histoire 开发服务器

**测试层：**
- 目的：单元测试和 E2E 测试
- 位置：`src/test/`
- 包含：配置文件、E2E 测试
- 依赖：Vitest、Vue Test Utils
- 被用于：CI/CD 流水线

## 数据流

**组件数据流：**

1. **输入验证：** 数据通过 props 进入，针对 Zod schema 进行验证
2. **状态管理：** 内部状态通过 Vue Composition API 管理
3. **事件发射：** 用户交互向父组件发射事件
4. **回执生成：** 决策操作创建结构化的决策结果

**Schema-Driven 开发流程：**

1. 在 `schema.ts` 中定义 Zod schema
2. 从 schema 生成 TypeScript 类型
3. 创建组件 props 接口
4. 实现带验证的组件
5. 导出契约函数（parse/safeParse）

**示例：**
```typescript
// schema.ts - 定义契约
export const SerializableXSchema = z.object({ ... });
export type SerializableX = z.infer<typeof SerializableXSchema>;
export interface XProps { ... }

// 契约函数
export const { parse, safeParse } = defineToolUiContract('X', SerializableXSchema);
```

## 关键抽象

**ToolUiContract：**
- 目的：组件数据验证的标准化接口
- 示例：`src/shared/contract.ts`
- 模式：返回 { schema, parse, safeParse } 的工厂函数

**Serializable Schemas：**
- 目的：用于 LLM 工具调用的 JSON-safe 数据结构
- 示例：`SerializableWeatherWidget`、`SerializableApprovalCard`
- 模式：无函数/css 对象的纯数据 Zod schemas

**Action Pattern：**
- 目的：定义用户交互
- 示例：`src/shared/schema.ts` 中的 `ActionSchema`
- 模式：{ id, label, sentence?, icon?, variant?, ... }

**CSS Prop Pattern：**
- 目的：通过 Tailwind 类允许外部样式定制
- 模式：`css?: { root?: string; header?: string; ... }`
- 示例：所有组件支持 css prop 作为样式钩子

**组件命名约定：**
- 目的：在 DOM 和工具中清晰识别
- 模式：`cmpt-{kebab-name}` 用于组件根元素
- Data 属性：`data-tool-ui-id`、`data-slot`

## 入口点

**库入口：**
- 位置：`src/index.ts`
- 触发：包导入
- 职责：导出所有组件和类型

**组件入口：**
- 位置：`src/components/{name}/index.ts`
- 触发：组件特定导入
- 职责：导出组件、类型、schemas、解析器

**Vite 构建入口：**
- 位置：`src/index.ts`
- 触发：构建过程
- 职责：打包库用于分发

## 错误处理

**策略：** Schema 验证与优雅降级

**模式：**
- `parseX(input)` - 数据无效时抛出异常（用于受控上下文）
- `safeParseX(input)` - 数据无效时返回 null（用于流式/工具调用上下文）
- Props 通过 `withDefaults()` 设置合理的默认值

**示例：**
```typescript
// 流式数据的安全解析
const data = safeParseSerializableWeatherWidget(args);
if (!data) return null; // 无效时不渲染
```

## 横切关注点

**日志：** 测试环境中的控制台守卫（`src/test/console-guard.ts`）

**验证：** 组件边界的 Zod schemas

**认证：** 不适用（纯 UI 库）

**样式：** Tailwind CSS v4，支持容器查询

**动画：** `@vueuse/motion` 用于过渡，尊重 `prefers-reduced-motion`

## 组件组合模式

**单文件组件：**
- 主组件：`index.vue`
- 子组件：`cmpts/*.vue`
- Composables：`composables/*.ts`（可选）
- States：`states/*.ts`（可选，用于复杂状态逻辑）

**示例结构（WeatherWidget）：**
```
weather-widget/
├── index.ts          # 公开导出
├── index.vue         # 主组件
├── schema.ts         # Zod schemas 和类型
├── time.ts           # 领域工具
├── cmpts/            # 子组件
│   ├── weather-data-overlay.vue
│   ├── effect-compositor.vue
│   └── weather-effects-canvas.vue
├── composables/      # 可复用逻辑
│   ├── useWeatherEffects.ts
│   └── useGlassStyles.ts
├── effects/          # 效果实现
│   └── parameter-mapper.ts
└── __tests__/        # 组件测试
```

---

*架构分析：2026-04-03*
