# Retrospective

## Milestone: v1.0 — 多语言 i18n 系统

**Shipped:** 2026-04-14
**Phases:** 7 | **Plans:** 31 | **Commits:** 145

### What Was Built

- 自研轻量 i18n 核心（零外部依赖，provide/inject + computed）
- 23+ 组件全面 i18n 改造，280 键 zh-CN/en 消息文件
- 质量保障体系：CI 校验 + ESLint key-consistency 规则
- 向后兼容：无 LocaleProvider 自动 fallback，copy-paste 零侵入
- 文档与 Story 双语化，28 个 story 文件迁移为 key-based i18n 解耦结构

### What Worked

- 轻量自研方案比 vue-i18n 更适合组件库场景（零依赖、tree-shakeable）
- DeepKeyPath 递归类型推导让 t() 调用有完整 IDE 补全，开发体验好
- 按优先级（High/Medium/Low）分批改造组件，节奏清晰
- vi.mock + shared locale state 统一测试模式，353 测试全部通过

### What Was Inefficient

- REQUIREMENTS.md traceability 表未在开发过程中同步更新（归档时手动补全）
- Phase 5 存在两个目录（05-documentation-histoire 和 05-documentation），命名混乱
- 部分 Phase 间有微小重叠（Phase 5/6/7 都涉及 story 文件）

### Patterns Established

- **i18n 测试模式**: `vi.mock('@lionad/vtu-core/i18n')` + factory 返回 shared locale state
- **aria-label 绑定**: computed wrapper + `.value` 解包解决 vue-tsc ComputedRef 类型问题
- **Story 目录结构**: 每个组件 story 独立目录 + i18n.ts 文件，key-based useStoryLocale
- **CI 门禁**: i18n key 一致性校验作为独立 CI step

### Key Lessons

- 组件库 i18n 要考虑 copy-paste 消费者，fallback 机制比强制 provider 更重要
- TypeScript DeepKeyPath 递归类型在 280 键消息文件下性能良好，无编译瓶颈
- vue-tsc 对 ComputedRef 在属性绑定中的行为需要显式 `.value`，与模板表达式不同

### Cost Observations

- 开发周期：3 天（2026-04-11 → 2026-04-14）
- 7 个 phases，31 个 plans，145 commits
- 353/353 测试通过率 100%
- 416 文件变更（+33,896 / -10,997 LOC）

## Cross-Milestone Trends

| Milestone | Phases | Plans | Days | Tests | Commits | Files |
|-----------|--------|-------|------|-------|---------|-------|
| v1.0 i18n | 7 | 31 | 3 | 353/353 | 145 | 416 |

---

*Last updated: 2026-05-13*
