# Phase 5: Documentation + Histoire - Context

**Gathered:** 2026-04-11 (assumptions mode)
**Status:** Ready for planning

<domain>
## Phase Boundary

Phase 5 负责为 i18n 系统编写双语文档和 Histoire 站点集成。涵盖 5 个 DOCS 需求：
README 多语言说明（中文为主）、Story 双语描述、Histoire 语言切换、API 文档、消费者接入指南。

**前提依赖**: Phase 1-4 已完成，i18n API 表面（LocaleProvider、useI18n、t()、消息文件格式）已稳定。
</domain>

<decisions>
## Implementation Decisions

### README 文档
- **D-01:** README.md 全部使用中文编写，包括项目介绍、安装指南、快速开始、i18n 章节等。安装命令保持 `pnpm add @lionad/vtu-components`（代码无需翻译）
- **D-02:** README 需包含 i18n 专用章节，覆盖：LocaleProvider 使用示例、t() 函数用法及 {param} 插值、自定义语言包示例
- **D-03:** 消费者接入指南作为 README 的内置子章节，包含：引入方式、自定义语言包步骤、扩展新语言方法

### API 文档
- **D-04:** API 文档采用混合方案 — Histoire Story 中使用 JSDoc 风格注释 + 独立 Markdown 文件（放在 `docs/` 目录）
- **D-05:** API 文档覆盖范围：LocaleProvider props 表、useI18n 返回类型、t() 签名及参数、消息文件格式说明（JSON 结构示例）

### Histoire 语言切换
- **D-06:** Histoire 通过 `src/stories/_shared/histoire-setup.ts` 注入全局语言切换状态（Vue ref + provide）
- **D-07:** Histoire 导航栏添加语言切换按钮（zh-CN / en 切换），按钮实现为 Histoire 的自定义顶部栏组件或通过 setupFile 注入
- **D-08:** Histoire 的 `theme.title` 和导航标签根据当前 locale 动态切换

### Story 双语描述
- **D-09:** 每个 `.story.vue` 文件中使用 computed 属性 + locale 映射表实现标题和描述的双语切换
- **D-10:** 映射模式为 `{ zh: '中文描述', en: 'English description' }`，根据当前全局 locale ref 动态返回

### Claude's Discretion
- 具体文案内容（中英文具体措辞）
- Story 按钮/控件的语言切换实现细节
- Histoire 语言切换器的精确 UI 样式（在 Histoire 顶部栏 vs 侧边栏）
- Markdown API 文档的具体排版格式

### Folded Todos
无
</decisions>

<canonical_refs>
## Canonical References

**下游 agent 在规划或实现前必须阅读以下文件。**

### Histoire 配置
- `histoire.config.ts` — 当前 Histoire 配置：插件、Story 匹配、路由模式、主题、Vite 配置
- `src/stories/_shared/histoire-setup.ts` — Histoire 全局 setup 文件，语言切换状态将在此注入

### 现有 Story 参考
- `src/stories/landing.story.vue` — Landing 页模板，可作为 Story 双语改造的参考实现
- `src/stories/*.story.vue` — 现有 ~30 个 Story 文件，需逐个添加双语描述

### 项目文档
- `.impeccable.md` — 品牌风格与设计原则，影响文档页的视觉调性
- `README.md` — 当前项目 README，将被重写为中文版
- `.planning/codebase/CONVENTIONS.md` — 编码约定，包括 Story 文件的 ESLint 豁免

### i18n 设计
- `.gstack/projects/tool-ui-vue/lionad-main-design-20260411-120000.md` — i18n 系统设计文档（LocaleProvider API、useI18n 签名、消息文件格式）
- `.planning/REQUIREMENTS.md` — i18n 需求规格，DOCS-01 至 DOCS-05 在此定义
</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/stories/landing.story.vue` — 已有一个完整的 landing 页 Story，含分类导航、Hero 区、Footer。可在此页面添加语言切换入口
- `histoire.config.ts` — `storyGroups` 已定义 7 个分类组，语言切换后导航结构保持不变
- `src/stories/_shared/` — 已有共享目录，可放置 locale helper 或双语映射工具

### Established Patterns
- Histoire 使用 `routerMode: 'hash'`，GitHub Pages 部署在 `/tool-ui-vue/` 路径下
- Story 文件统一使用 `<script setup lang="ts">` + `HstVue` 插件
- Vite 配置使用 `@tailwindcss/vite` 插件，alias `@/` → `src/`

### Integration Points
- Phase 5 与 Phase 1-4 产出的连接点：
  - `@lionad/vtu-core` 包中的 `LocaleProvider` 和 `useI18n` 组件/组合式函数
  - `packages/core/src/i18n/` 目录中的消息文件和类型定义（Phase 1 创建）
  - `histoire.config.ts` 的 `setupFile` 字段指向 `_shared/histoire-setup.ts`
</code_context>

<specifics>
## Specific Ideas

- 用户要求 README 全中文，包括项目介绍和安装说明
- API 文档采用 "Histoire 内 Story 注释 + 独立 Markdown" 混合方案，避免引入新工具链
- Story 双语使用 computed + locale 映射表，每个 Story 文件内自行定义映射
</specifics>

<deferred>
## Deferred Ideas

- Histoire 站点本身的完整多语言翻译 — 已在 Out of Scope 中声明仅基础导航/标题/描述
- 文档站点独立部署（如 VitePress）— 推迟到后续 milestone，当前仅使用 Histoire
- 多语言搜索功能 — Histoire 不支持原生搜索，推迟

### Reviewed Todos (not folded)
无
</deferred>

---

*Phase: 05-documentation-histoire*
*Context gathered: 2026-04-11*
