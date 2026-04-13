# Roadmap: tool-ui-vue v1.0.0 多语言 i18n 系统

## Overview

为 tool-ui-vue 组件库添加轻量级多语言 i18n 系统。26 个组件消除硬编码英文文本，zh-CN 为默认语言，en 为 fallback。零外部依赖，copy-paste 兼容。

## Phases

- [x] **Phase 1: I18N Core** - LocaleProvider, useI18n(), 类型定义, zh-CN/en 消息文件, fallback 逻辑 (completed 2026-04-11)
- [x] **Phase 2: Component i18n (High + Medium)** - 13 个高/中优组件消除硬编码英文文本 (completed 2026-04-11)
- [x] **Phase 3: Component i18n (Low) + Tests** - 剩余 14 组件 + 核心 i18n 测试
- [x] **Phase 4: Quality + Compat** - CI 校验 + 向后兼容 + 零侵入
- [ ] **Phase 5: Documentation + Histoire** - README / Story 双语, Histoire 语言切换, API 文档

## Phase Details

### Phase 1: I18N Core
**Goal**: 轻量 i18n 基础设施，provide/inject 模式，zh-CN 默认，en fallback，零外部依赖
**Depends on**: 无（首个 Phase）
**Requirements**: CORE-01, CORE-02, CORE-03, CORE-04, CORE-05, CORE-06
**Success Criteria** (what must be TRUE):
  1. 开发者用 LocaleProvider 包裹应用后，子组件可通过 useI18n() 获取翻译
  2. useI18n() 返回 computed，切换语言实时更新（无需手动刷新）
  3. t('nested.key.path', { param: value }) 正确解析并插值
  4. TypeScript 自动补全 t() key，无效 key 路径报类型错误
  5. dev 环境缺失 key 时 console.warn 显示 key 路径，prod 环境 fallback 到 zh-CN
**Plans**: 1 plan

Plans:
- [x] 01-01-PLAN.md — i18n core: types, composable, LocaleProvider, locales, exports

### Phase 2: Component i18n (High + Medium)
**Goal**: 13 个高/中优组件无硬编码英文文本，响应语言切换
**Depends on**: Phase 1
**Requirements**: COMPS-01, COMPS-02
**Success Criteria** (what must be TRUE):
  1. 高优 7 组件（terminal, code-block, code-diff, order-summary, question-flow, message-draft, data-table）全部使用 t()
  2. 中优 6 组件（audio, video, image-gallery, geo-map, item-carousel, preferences-panel）全部使用 t()
  3. 切换 LocaleProvider 语言后，13 个组件 UI 文本实时更新，无需刷新
  4. 模板和渲染逻辑中无硬编码英文字符串
**UI hint**: yes
**Plans**: 5 plans

Plans:
- [x] 02-01-PLAN.md — terminal, code-block, code-diff i18n + JSON files
- [x] 02-02-PLAN.md — order-summary, question-flow i18n + JSON files
- [x] 02-03-PLAN.md — data-table, message-draft i18n + JSON files
- [x] 02-04-PLAN.md — audio, video, geo-map, item-carousel, preferences-panel i18n
- [ ] 02-05-PLAN.md — global default LocaleProvider auto-registration at core entry

### Phase 3: Component i18n (Low) + Tests
**Goal**: 剩余 14 个低优组件 i18n 改造完成（零硬编码英文遗留），核心 i18n 系统有测试覆盖
**Depends on**: Phase 2
**Requirements**: COMPS-03, TEST-01, TEST-02, TEST-03
**Success Criteria** (what must be TRUE):
  1. 低优 14 组件全部使用 t()（x-post, instagram-post, chart, stats-display, weather-widget, approval-card, citation, image, link-preview, linkedin-post, option-list, parameter-slider, plan, progress-tracker）
  2. LocaleProvider 测试通过：provide/inject 工作正常、messages 切换触发更新、缺失 key 正确 fallback
  3. useI18n() 测试通过：t() 解析 key、{param} 插值、缺失 key 处理
  4. 测试环境中切换 locale 后，全部组件显示对应语言文本
**UI hint**: yes
**Plans**: 5 plans

Plans:
- [x] 03-01-PLAN.md — 7 个简单组件 i18n + plan 命名空间 locale 条目
- [x] 03-02-PLAN.md — 3 个社交媒体组件 i18n（x-post, instagram-post, linkedin-post）
- [x] 03-03-PLAN.md — chart, stats-display, plan 组件 i18n
- [x] 03-04-PLAN.md — weather-widget accessibility 层 i18n
- [x] 03-05-PLAN.md — 核心 i18n 测试 + 14 组件集成测试

### Phase 4: Quality + Compat
**Goal**: i18n 系统 CI 门禁、向后兼容、非 i18n 用户零侵入
**Depends on**: Phase 3
**Requirements**: QUALITY-01, QUALITY-02, COMPAT-01, COMPAT-02
**Success Criteria** (what must be TRUE):
  1. CI 脚本在 en 和 zh-CN 消息文件 key 不一致时失败
  2. CI 或 lint 工具标记含硬编码英文的新组件
  3. 无 LocaleProvider 时组件以 zh-CN 默认消息正常渲染
  4. copy-paste 消费者（无 @lionad/core 依赖）使用组件与之前完全一致
**Plans**: 1 plan

Plans:
- [x] 04-01-PLAN.md — fallback fix + tests + validation script + ESLint plugin + CI + copy-paste verify

### Phase 5: Documentation + Histoire
**Goal**: 用户可通过双语文档和 Histoire stories 学习集成 i18n
**Depends on**: Phase 3（API 表面需稳定）
**Requirements**: DOCS-01, DOCS-02, DOCS-03, DOCS-04, DOCS-05
**Success Criteria** (what must be TRUE):
  1. README.md 包含中文优先的 i18n 章节，含 LocaleProvider 使用示例、t() 用法、自定义语言包示例
  2. Story 描述根据当前 locale 显示 zh-CN/en 文本
  3. Histoire 站点渲染语言切换器，切换后导航和标签同步更新
  4. API 文档覆盖 LocaleProvider props、useI18n 返回类型、t() 签名、消息文件格式
  5. 消费者接入指南逐步说明如何添加 i18n、扩展语言、自定义消息文件
**UI hint**: yes
**Plans**: 2 plans

Plans:
- [x] 05-01-PLAN.md — Histoire i18n infrastructure: locale state, nav toggle, useStoryLocale
- [x] 05-02-PLAN.md — README i18n sections, API docs, consumer guide, story file bilingual update

## Progress

**Execution Order:**
Phases execute in numeric order: 1 -> 2 -> 3 -> 4 -> 5

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. I18N Core | 1/1 | Complete    | 2026-04-11 |
| 2. Component i18n (High + Med) | 5/5 | Complete    | 2026-04-11 |
| 3. Component i18n (Low) + Tests | 5/5 | Complete    | 2026-04-11 |
| 4. Quality + Compat | 1/1 | Complete    | 2026-04-11 |
| 5. Documentation + Histoire | 2/2 | Complete    | 2026-04-11 |

### Phase 6: Histoire 站点数据 i18n

**Goal:** Histoire 站点中所有用户可见文本（Variant titles、页面标题、描述、示例数据、Landing Page）接入 i18n 系统，跟随 LocaleToggle 语言切换实时更新
**Requirements**: HIST-01, HIST-02, HIST-03, HIST-04, HIST-05
**Depends on:** Phase 5
**Success Criteria** (what must be TRUE):
  1. 全部 28+ story 文件中无硬编码英文 Variant title，使用 `:title` 动态绑定 + `useStoryLocale`
  2. `<h2>`/`<h3>` 标题、`<p>` 描述文本双语化
  3. 示例数据（props 数组 description 等字段）双语化
  4. Landing Page 用户可见文本全部双语化
  5. Histoire 站点切换语言后，全部用户可见文本实时更新
**UI hint**: yes
**Plans:** 4 plans

Plans:
- [ ] 06-01-PLAN.md — Complex stories (terminal, code-block, code-diff, chart): Variant titles + h2/h3 + props + descriptions
- [ ] 06-02-PLAN.md — Data-heavy stories (data-table, preferences-panel, geo-map, weather + 5 social): Variant titles + inline data
- [ ] 06-03-PLAN.md — Remaining 13 stories (citation, carousel, order-summary, etc.): Variant titles + inline data
- [ ] 06-04-PLAN.md — Landing Page bilingual + phase-wide verification (Wave 2, depends on 01/02/03)

### Phase 7: Story 结构重构与 i18n 解耦
**Goal:** 将 `src/stories/*.story.vue` 的平铺结构重构为 `src/stories/{component-name}/` 目录结构，并将 story 级别的 `useStoryLocale` 内联文案抽取到独立的 `i18n/*.ts` 文件中，提升可维护性和复用性
**Depends on:** Phase 6
**Requirements:** STORY-STRUCT-01, STORY-STRUCT-02, STORY-STRUCT-03, STORY-STRUCT-04
**Success Criteria** (what must be TRUE):
  1. 全部 story 文件从 `src/stories/*.story.vue` 迁移到 `src/stories/{component-name}/index.story.vue`
  2. 每个 story 目录包含独立的 `i18n/zh.ts` 和 `i18n/en.ts`（或统一入口）
  3. Story 内不再直接内联 `useStoryLocale({ zh: '...', en: '...' })` 调用数十次，而改为导入翻译对象
  4. Histoire 站点能正确识别迁移后的 story 路径，语言切换正常工作
**UI hint**: no
**Plans**: 12 plans

Plans:
- [x] 07-01-PLAN.md — Foundation: useStoryLocale key-based API + histoire.config.ts + link-preview reference migration
- [ ] 07-02-PLAN.md — item-carousel migration
- [ ] 07-03-PLAN.md — geo-map migration
- [ ] 07-04-PLAN.md — question-flow migration
- [ ] 07-05-PLAN.md — preferences-panel migration
- [ ] 07-06-PLAN.md — chart migration
- [ ] 07-07-PLAN.md — weather-widget + plan migration
- [ ] 07-08-PLAN.md — data-table + stats-display + progress-tracker migration
- [ ] 07-09-PLAN.md — parameter-slider + code-diff + approval-card migration
- [ ] 07-10-PLAN.md — terminal + image-gallery + video migration
- [ ] 07-11-PLAN.md — order-summary + citation + audio + message-draft + code-block + image migration
- [ ] 07-12-PLAN.md — option-list + social posts + landing + final verification

## Progress

**Execution Order:**
Phases execute in numeric order: 1 -> 2 -> 3 -> 4 -> 5 -> 6 -> 7

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. I18N Core | 1/1 | Complete    | 2026-04-11 |
| 2. Component i18n (High + Med) | 5/5 | Complete    | 2026-04-11 |
| 3. Component i18n (Low) + Tests | 5/5 | Complete    | 2026-04-11 |
| 4. Quality + Compat | 1/1 | Complete    | 2026-04-11 |
| 5. Documentation + Histoire | 2/2 | Complete    | 2026-04-11 |
| 6. Histoire 站点数据 i18n | 4/4 | Complete    | 2026-04-11 |
| 7. Story 结构重构与 i18n 解耦 | 0/0 | Not started | — |
