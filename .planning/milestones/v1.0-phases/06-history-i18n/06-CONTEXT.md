# Phase 6: Histoire 站点数据 i18n — Context

**Gathered:** 2026-04-11
**Status:** Ready for planning

<domain>
## Phase Boundary

将 Histoire 站点中所有用户可见的文本数据接入 i18n 系统，使其跟随语言切换实时更新。

Phase 5 已完成：语言切换按钮（LocaleToggle）、`useStoryLocale` composable、表格表头双语化。

Phase 6 覆盖：Variant titles、页面标题（h2/h3）、描述文本（p 标签）、示例数据中的英文文本（如 props 数组的 description 字段）、Landing Page 文本。

</domain>

<requirements>
## Requirements

### HIST-01: Variant title 双语化
- 所有 `<Variant title="...">` 中的英文 title 使用 `useStoryLocale` 包裹
- 切换语言后 Variant 标签跟随变化
- 覆盖 28 个 story 文件，约 270+ 个 Variant titles

### HIST-02: 页面标题/标题双语化
- Story 内的 `<h2>`, `<h3>` 等标题文本使用 `useStoryLocale` 包裹
- 如 `"Terminal Props"` → `useStoryLocale({ zh: 'Terminal 属性', en: 'Terminal Props' })`

### HIST-03: 描述文本双语化
- `<p>` 标签中的描述性英文文本双语化
- 如 `"Terminal component supports ANSI escape codes for colors and formatting."`

### HIST-04: 示例数据双语化
- props 数组等示例数据中的 `description` 字段使用双语
- 如 `{ name: 'id', type: 'string', description: 'Unique identifier for the terminal' }`
  → description 字段改为 computed 或使用 useStoryLocale

### HIST-05: Landing Page 双语化
- `src/stories/landing.story.vue` 中的所有文本跟随 i18n
- 当前该文件有 0 个英文硬编码 title，但仍需检查其他文本

</requirements>

<current_state>
## 当前状态

### 基础设施（Phase 5 完成）
- `src/stories/_shared/use-story-locale.ts` — 模块级 `currentLocale: Ref<string>` + `useStoryLocale(labels)` 
- `src/stories/_shared/LocaleToggle.vue` — 语言切换按钮
- `src/stories/_shared/histoire-setup.ts` — MutationObserver 挂载 LocaleToggle

### Story 文件现状
- 28 个 `.story.vue` 文件（不含 tailwind-test）
- 表格表头已双语化（headerName, headerType, headerDefault, headerDesc）
- Variant title 全部英文硬编码（约 270+ 处）
- `<h2>`/`<h3>` 标题英文硬编码
- `<p>` 描述文本英文硬编码
- 示例数据（props 数组等）英文硬编码

### 技术约束
- Story 文件不使用 `@lionad/vtu-core/i18n`（避免依赖注入问题）
- 继续使用 `useStoryLocale` 模块级 ref 模式
- `useStoryLocale` 返回 `ComputedRef<string>`，模板中自动解包

</current_state>

<decisions>
## Implementation Decisions

### D-01: Variant title 跟随语言切换
- 所有 `<Variant title="...">` 使用 `useStoryLocale` 包裹
- 格式：`:title="useStoryLocale({ zh: '中文', en: 'English' })"`
- 注意：Variant title 需要是 `:title` 动态绑定而非静态 `title`

### D-02: 描述文本全部双语化
- `<p>` 标签、`<span>` 等内联描述文本使用 `useStoryLocale`
- 短描述可采用 `"中文描述 / English description"` 简写格式（不切换，同时显示）
- 长段落描述使用 `useStoryLocale` 完整切换

### D-03: 示例数据（props 数组等）双语化
- 对于对象数组中的文本字段，使用 computed 属性 + map 生成双语版本
- 或使用 `useStoryLocale` 在模板层处理
- 具体实现方式由 planner 决定

### D-04: Landing Page 包含在范围内
- `landing.story.vue` 的所有用户可见文本需要双语化
- 作为 Histoire 站点的入口页面

### D-05: 复用现有 useStoryLocale 模式
- 不引入新的依赖或模式
- 继续使用 `import { useStoryLocale } from './_shared/use-story-locale'`
- 保持零 `@lionad/vtu-core/i18n` 依赖

### D-06: 范围 = 所有内容
- 用户确认：全部 28 个 story 文件的所有英文文本都需要处理
- 包括 Variant title、页面标题、描述文本、示例数据、Landing Page

</decisions>

<canonical_refs>
## Canonical refs

- `src/stories/_shared/use-story-locale.ts` — 核心 composable
- `src/stories/_shared/LocaleToggle.vue` — 语言切换按钮
- `src/stories/_shared/histoire-setup.ts` — Histoire 初始化
- `src/stories/*.story.vue` — 所有 28 个 story 文件
- `src/stories/landing.story.vue` — 着陆页
- `histoire.config.ts` — Histoire 配置
- `.planning/phases/05-documentation/` — Phase 5 的计划和总结

</canonical_refs>

<scope>
## In Scope

- 28 个 `.story.vue` 文件的英文文本双语化
- Variant title 动态绑定
- 页面标题/描述文本 `useStoryLocale` 化
- 示例数据字段双语化
- Landing Page 文本双语化

## Out of Scope

- 组件本身的 i18n（Phase 2-3 已完成）
- Histoire 框架自身的多语言（如导航栏英文标签）
- 新增组件或功能
- 第三方库集成

</scope>

<deferred>
## Deferred Ideas

无。

</deferred>
