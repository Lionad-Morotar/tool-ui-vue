# Requirements: tool-ui-vue v1.0.0 多语言 i18n 系统

**Defined:** 2026-04-11
**Core Value:** 所有组件 UI 文本无硬编码英文，可通过 LocaleProvider 切换语言，zh-CN 为默认语言

## I18N-CORE — 核心基础设施

- [ ] **CORE-01**: LocaleProvider 组件（provide/inject 模式，接受 messages prop）
- [ ] **CORE-02**: useI18n() composable（返回 computed，支持 t() 函数和 {param} 插值）
- [ ] **CORE-03**: TypeScript 类型定义（LocaleKey, MessageSchema，t() key 有类型推导）
- [ ] **CORE-04**: zh-CN 消息文件（默认语言，覆盖所有组件文案）
- [ ] **CORE-05**: en 消息文件（英文翻译，key 与 zh-CN 一致）
- [ ] **CORE-06**: 缺失 key fallback 逻辑（dev: console.warn + 显示 key；prod: fallback 到 zh-CN）

## I18N-COMPS — 组件改造

- [x] **COMPS-01**: 高优 7 组件改造（terminal, code-block, code-diff, order-summary, question-flow, message-draft, data-table）
- [x] **COMPS-02**: 中优 6 组件改造（audio, video, image-gallery, geo-map, item-carousel, preferences-panel）
- [ ] **COMPS-03**: 低优 10 组件改造（x-post, instagram-post, chart, stats-display, weather-widget 等）

## I18N-DOCS — 文档

- [ ] **DOCS-01**: README.md 添加多语言说明章节（中文为主）
- [ ] **DOCS-02**: Story 文件描述提供 zh-CN + en 双语版本
- [ ] **DOCS-03**: Histoire 站点支持语言切换（导航、标题、描述）
- [ ] **DOCS-04**: API 文档（LocaleProvider props、useI18n 返回值、t() 签名、消息文件格式）
- [ ] **DOCS-05**: 消费者接入指南（如何引入、如何自定义语言包、如何扩展新语言）

## I18N-TEST — 测试

- [ ] **TEST-01**: LocaleProvider 组件测试（provide/inject、messages 切换、fallback 逻辑）
- [ ] **TEST-02**: useI18n() composable 测试（t() 函数、{param} 插值、缺失 key 处理）
- [ ] **TEST-03**: 组件 i18n 改造验证测试（切换语言后 UI 文本实时更新）

## I18N-QUALITY — 质量保障

- [ ] **QUALITY-01**: CI 校验脚本（en 和 zh-CN key 一致性检查）
- [ ] **QUALITY-02**: 新增组件 i18n 遗漏检查（lint 或 CI）

## I18N-COMPAT — 向后兼容

- [ ] **COMPAT-01**: 无 LocaleProvider 时组件使用 zh-CN 默认消息正常工作
- [ ] **COMPAT-02**: copy-paste 消费者不受影响（零侵入非 i18n 用户）

## Out of Scope

- vue-i18n 等第三方 i18n 库集成（本项目采用轻量自研方案）
- Histoire 站点本身的完整多语言翻译（仅基础导航/标题/描述）
- 组件业务逻辑的 i18n 改造（仅 UI 文本）
- 更多语言支持（ja, ko, fr, de 等）— 推迟到后续 milestone
- 复数形式支持（pluralization）— 推迟到后续 milestone
- 日期/数字格式化（Intl API 集成）— 推迟到后续 milestone
- RTL（Right-to-Left）语言布局支持 — 推迟到后续 milestone

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| CORE-01     | Phase 1 | Pending |
| CORE-02     | Phase 1 | Pending |
| CORE-03     | Phase 1 | Pending |
| CORE-04     | Phase 1 | Pending |
| CORE-05     | Phase 1 | Pending |
| CORE-06     | Phase 1 | Pending |
| COMPS-01    | Phase 2 | Pending |
| COMPS-02    | Phase 2 | Complete |
| COMPS-03    | Phase 3 | Pending |
| DOCS-01     | Phase 5 | Pending |
| DOCS-02     | Phase 5 | Pending |
| DOCS-03     | Phase 5 | Pending |
| DOCS-04     | Phase 5 | Pending |
| DOCS-05     | Phase 5 | Pending |
| TEST-01     | Phase 3 | Pending |
| TEST-02     | Phase 3 | Pending |
| TEST-03     | Phase 3 | Pending |
| QUALITY-01  | Phase 4 | Pending |
| QUALITY-02  | Phase 4 | Pending |
| COMPAT-01   | Phase 4 | Pending |
| COMPAT-02   | Phase 4 | Pending |

**Coverage:**
- v1.0.0 i18n requirements: 21 total
- Mapped to phases: 21
- Unmapped: 0

---
*Requirements defined: 2026-04-11*
*Last updated: 2026-04-11 after v1.0.0 roadmap creation*
