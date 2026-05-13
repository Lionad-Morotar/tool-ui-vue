# Phase 7: Story 结构重构与 i18n 解耦 — Context

**Gathered:** 2026-04-13
**Status:** Ready for planning

<domain>
## Phase Boundary

将 `src/stories/*.story.vue` 的平铺结构重构为 `src/stories/{component-name}/` 目录结构，并将 story 级别内联的 `useStoryLocale({ zh, en })` 调用抽取到独立的 i18n 文件中，提升可维护性。

本 Phase 仅涉及 story 文件的重构与文案迁移，不改动组件本身的 i18n 逻辑（Phase 2-3 已完成），也不引入新的 Histoire 框架功能。

</domain>

<decisions>
## Implementation Decisions

### D-01: i18n 文件组织 — 双语分文件
- 每个 story 目录下包含独立的 `i18n/zh.ts` 和 `i18n/en.ts`
- 目录结构形如：
  ```
  src/stories/link-preview/
    index.story.vue
    i18n/
      zh.ts
      en.ts
  ```
- 不采用单一 `locale.ts` 文件，保持语言分离，方便后续扩展新语言

### D-02: useStoryLocale API — 演进为 key-based
- 扩展 `useStoryLocale` 支持 key-based 查找：`useStoryLocale('title.withImage')`
- 函数内部根据 `currentLocale` 从导入的消息对象中查找对应 key
- `i18n/zh.ts` 和 `i18n/en.ts` 导出同构的嵌套对象（或扁平 key 对象），保证类型安全
- Story `<script setup>` 中不再有数十处 `useStoryLocale({ zh: '...', en: '...' })` 内联调用

### D-03: Histoire tree 分组匹配 — Claude's Discretion
- 由 planner/executor 决定如何同步更新 `histoire.config.ts` 中的 `tree.include` 规则
- 可选方案：
  a) 修改为按目录名匹配（如 `/link-preview/index.story.vue`）
  b) 保留混合策略，向后兼容
- 核心约束：Histoire 站点分组树必须与迁移前一致或更优

### D-04: 迁移批次 — 分为 12 批左右
- 共 29 个 story 文件（不含 tailwind-test）
- 按复杂度/组件数量拆分为约 12 批执行
- 高密度复杂 story（item-carousel、geo-map、question-flow、preferences-panel 等）可单独成批
- 简单/低密度的 story 可 2-3 个合并为一批

### D-05: _shared 文案处理 — 不改动
- `src/stories/_shared/` 中的表格表头 labels 等通用文案保持现状
- 无需将 _shared 内容下沉到各 story 目录
- `_shared/use-story-locale.ts` 需升级以支持 key-based API，但位置不变

### D-06: 文件命名规范
- Story 入口统一命名为 `index.story.vue`
- 目录名与组件 kebab-case 名称一致（如 `link-preview`、`item-carousel`）
- i18n 子目录固定名为 `i18n/`，内部固定为 `zh.ts` 和 `en.ts`

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Core infrastructure
- `src/stories/_shared/use-story-locale.ts` — `useStoryLocale` / `currentLocale` 实现（需升级 key-based 支持）
- `src/stories/_shared/histoire-setup.ts` — Histoire 初始化与 LocaleToggle 挂载
- `histoire.config.ts` — `tree.include` 分组规则，迁移后需同步更新

### Representative story files (for pattern extraction)
- `src/stories/link-preview.story.vue` — 中等密度 useStoryLocale（25 处），含交互数据双语化
- `src/stories/item-carousel.story.vue` — 高密度（77 处 useStoryLocale），最复杂文案场景
- `src/stories/geo-map.story.vue` — 高密度（73 处），含 props 描述数组
- `src/stories/landing.story.vue` — Landing Page 特殊结构

### Prior phase context
- `.planning/phases/06-history-i18n/06-CONTEXT.md` — Phase 6 story i18n 决策与约束

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/stories/_shared/use-story-locale.ts` — 核心 composable，需backward-compatible升级
- `src/stories/_shared/index.ts` — story 工具导出，可新增 key-based 辅助类型

### Established Patterns
- Story 文件目前统一使用 `import { useStoryLocale, currentLocale } from './_shared/use-story-locale'`
- `useStoryLocale` 返回 `ComputedRef<string>`，模板中自动解包
- 交互式 state（如 `interactiveState`）通过 `watch(currentLocale, ...)` 切换语言

### Integration Points
- `histoire.config.ts` 的 `tree.include` 使用 `file.path.includes('${story}.story.vue')`
- `storyMatch: ['src/**/*.story.vue']` 已经支持子目录，无需修改即可匹配 `src/stories/*/index.story.vue`
- 迁移后必须同步修改 `tree.include`，否则分组将全部落入 "Uncategorized"

</code_context>

<specifics>
## Specific Ideas

- Key-based `useStoryLocale` 应保持返回 `ComputedRef<string>` 的签名，使模板层无需改动
- `i18n/zh.ts` 和 `i18n/en.ts` 的结构建议采用嵌套命名空间（如 `variant`, `desc`, `props`, `data`），避免几百个 key 平铺
- 若 computed 解包在 props 数组中存在 TS 问题，可保留 `.value` 解包模式（沿用 Phase 2-3 经验）

</specifics>

<deferred>
## Deferred Ideas

- 将 _shared 中的通用 labels 下沉到各 story 目录（用户明确 defer）
- 将 `zh-CN` 重命名为更简洁的 `zh`（超出本 Phase 范围，涉及全局替换）
- Histoire 导航栏本身的英文标签翻译（属于框架层，非 story 数据层）

</deferred>

---

*Phase: 07-story-i18n*
*Context gathered: 2026-04-13*
