# Roadmap: tool-ui-vue v1.0.0 多语言 i18n 系统

## Overview

为 tool-ui-vue 组件库添加轻量级多语言 i18n 系统。23 个组件消除硬编码英文文本，zh-CN 为默认语言，en 为 fallback。零外部依赖，copy-paste 兼容。

## Phases

- [ ] **Phase 1: I18N Core** - LocaleProvider, useI18n(), 类型定义, zh-CN/en 消息文件, fallback 逻辑
- [ ] **Phase 2: Component i18n (High + Medium)** - 13 个高/中优组件消除硬编码英文文本
- [ ] **Phase 3: Component i18n (Low) + Tests** - 剩余 10 组件 + 核心 i18n 测试
- [ ] **Phase 4: Quality + Compat** - CI 校验 + 向后兼容 + 零侵入
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
**Plans**: TBD

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

### Phase 3: Component i18n (Low) + Tests
**Goal**: 剩余 10 个低优组件 i18n 改造完成，核心 i18n 系统有测试覆盖
**Depends on**: Phase 2
**Requirements**: COMPS-03, TEST-01, TEST-02, TEST-03
**Success Criteria** (what must be TRUE):
  1. 低优 10 组件（x-post, instagram-post, chart, stats-display, weather-widget 等）全部使用 t()
  2. LocaleProvider 测试通过：provide/inject 工作正常、messages 切换触发更新、缺失 key 正确 fallback
  3. useI18n() 测试通过：t() 解析 key、{param} 插值、缺失 key 处理
  4. 测试环境中切换 locale 后，全部 23 个组件显示对应语言文本
**UI hint**: yes

### Phase 4: Quality + Compat
**Goal**: i18n 系统 CI 门禁、向后兼容、非 i18n 用户零侵入
**Depends on**: Phase 3
**Requirements**: QUALITY-01, QUALITY-02, COMPAT-01, COMPAT-02
**Success Criteria** (what must be TRUE):
  1. CI 脚本在 en 和 zh-CN 消息文件 key 不一致时失败
  2. CI 或 lint 工具标记含硬编码英文的新组件
  3. 无 LocaleProvider 时组件以 zh-CN 默认消息正常渲染
  4. copy-paste 消费者（无 @lionad/core 依赖）使用组件与之前完全一致
**Plans**: TBD

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

## Progress

**Execution Order:**
Phases execute in numeric order: 1 -> 2 -> 3 -> 4 -> 5

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. I18N Core | 0/TBD | Not started | - |
| 2. Component i18n (High + Med) | 0/TBD | Not started | - |
| 3. Component i18n (Low) + Tests | 0/TBD | Not started | - |
| 4. Quality + Compat | 0/TBD | Not started | - |
| 5. Documentation + Histoire | 0/TBD | Not started | - |
