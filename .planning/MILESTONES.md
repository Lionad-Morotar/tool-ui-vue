# Milestones

## v1.0 — 多语言 i18n 系统

**Shipped:** 2026-04-14
**Phases:** 1-7 (31 plans)
**Commits:** 145
**Files changed:** 416 (+33,896 / -10,997 LOC)

### Key Accomplishments

1. **自研轻量 i18n 核心基础设施** — 零外部依赖，Vue 3 provide/inject + computed 模式，280 键 zh-CN/en 消息文件，DeepKeyPath TypeScript 完整类型推导
2. **23+ 组件全面 i18n 改造** — 高/中/低优先级分批完成，所有硬编码英文替换为 t() 调用， aria-label 等属性绑定类型安全
3. **质量保障体系** — i18n 校验脚本（key 一致性）+ ESLint key-consistency 规则 + GitHub Actions CI 工作流
4. **向后兼容保证** — 无 LocaleProvider 时自动 fallback 到 zh-CN 内置消息，copy-paste 消费者零侵入
5. **文档与 Story 双语化** — README 完整 i18n 章节，28 个 story 文件双语更新，API 文档和消费者接入指南
6. **Story 结构重构与 i18n 解耦** — 全部 story 迁移为目录结构，提取 i18n 文件，key-based useStoryLocale 消息查找

### Stats

| Metric | Value |
|--------|-------|
| Phases | 7 |
| Plans | 31 |
| Timeline | 2026-04-11 → 2026-04-14 (3 days) |
| Test Coverage | 353/353 passing |
| Packages LOC | ~134,537 |

### Known Gaps

- REQUIREMENTS.md traceability 表未同步更新（文档债务，实际功能已完整交付）
- lightningcss @theme warnings（cosmetic，无功能影响）

---

*For milestone details, see:*
- [v1.0 ROADMAP Archive](milestones/v1.0-ROADMAP.md)
- [v1.0 REQUIREMENTS Archive](milestones/v1.0-REQUIREMENTS.md)
