# Phase 3: Component i18n (Low) + Tests - Context

**Gathered:** 2026-04-11
**Status:** Ready for planning

<domain>
## Phase Boundary

完成剩余 14 个低优组件的 i18n 改造（消除所有硬编码英文文本），并为核心 i18n 系统编写完整测试覆盖。

**依赖：** Phase 1（LocaleProvider + useI18n 基础设施）和 Phase 2（高/中优 13 组件改造）必须已完成。Phase 3 的决策假设 Phase 1 已提供：
- `LocaleProvider` 组件（provide/inject 模式）
- `useI18n()` composable（返回 computed，支持 t() 和 {param} 插值）
- zh-CN 默认 + en fallback 消息文件
- TypeScript 类型推导（LocaleKey, MessageSchema）
- dev console.warn + prod fallback 到 zh-CN

</domain>

<decisions>
## Implementation Decisions

### 组件范围
- **D-01:** 低优组件包含剩余全部 14 个：x-post, instagram-post, chart, stats-display, weather-widget, approval-card, citation, image, link-preview, linkedin-post, option-list, parameter-slider, plan, progress-tracker
- **D-02:** 不精确限定为 10 个——只要 Phase 2 没覆盖的组件，全部纳入 Phase 3 范围，确保零硬编码英文遗留

### 测试策略
- **D-03:** 全覆盖测试——LocaleProvider 专用测试文件、useI18n() 专用测试文件、14 个低优组件各自独立 i18n 测试
- **D-04:** 组件 i18n 测试模式：用 LocaleProvider 包裹组件挂载，验证切换语言后 UI 文本实时更新，不 mock i18n 核心
- **D-05:** 测试文件位置遵循现有模式：`packages/components/src/{name}/__tests__/i18n.test.ts`（新增）或集成到现有 `index.test.ts`

### weather-widget 特殊处理
- **D-06:** weather-widget 内容主要是数据驱动（props 传入 location、temperature 等），i18n 文案集中在 accessibility 层（sr-only 屏幕阅读文本如 "degrees Celsius"）和 spokenUnit 计算属性，不需要深入 WebGL 渲染管线或 effects 层
- **D-07:** weather-widget 测试只需验证 sr-only 文本随 locale 切换变化，不需要验证 WebGL 效果的语言行为

### console-guard 兼容
- **D-08:** 在 `src/test/console-guard.ts` 的 `ALLOWED_PATTERNS` 中添加 i18n 缺失 key 的警告匹配规则（如 `/\[i18n\]/`），确保现有测试不受 i18n warn 影响
- **D-09:** i18n 核心测试应显式 mock 或 spy 验证 console.warn 被正确调用（dev 缺失 key 时），与 ALLOWED_PATTERNS 白名单分离

### 消息文件组织
- **D-10:** 14 个低优组件共享 `locales/zh-CN/low.ts` 和 `locales/en/low.ts` 消息文件，命名空间按组件名分组（如 `low.xPost.title`）
- **D-11:** 如果 Phase 1 已按组件拆分消息文件，则遵循 Phase 1 的命名约定

### Claude's Discretion
- 各低优组件的具体模板改造方式（v-bind 替换 vs 插值表达式），由执行 agent 根据组件实际情况决定
- 测试用例的具体断言粒度（精确文本匹配 vs 包含匹配），由执行 agent 决定

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### 项目级规范
- `.planning/ROADMAP.md` §Phase 3 — Phase 目标、依赖关系、成功标准
- `.planning/REQUIREMENTS.md` §I18N-COMPS / I18N-TEST — COMPS-03, TEST-01, TEST-02, TEST-03 需求定义
- `.planning/PROJECT.md` — 项目愿景、技术栈约束、Key Decisions 表

### 代码库上下文
- `packages/components/src/weather-widget/` — weather-widget 组件实现（i18n 主要在 accessibility 层）
- `src/test/console-guard.ts` — console 守卫实现，需添加 i18n 白名单
- `vitest.config.ts` — 测试配置，测试文件 include 模式
- `.planning/codebase/TESTING.md` — 测试模式和结构约定

### 上游依赖（Phase 1 输出）
- Phase 1 CONTEXT.md（待创建）— i18n 基础设施的最终设计决策
- Phase 1 的 LocaleProvider、useI18n、消息文件实现

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- **console-guard + ALLOWED_PATTERNS**：已有白名单机制，只需添加 i18n 匹配规则即可兼容
- **vitest + jsdom + @vue/test-utils**：测试框架已就位，支持 mount、shallowMount、组件交互测试
- **14 个组件各自的 `__tests__/` 目录**：可复用现有测试结构和 props 工厂模式
- **weather-widget 的 4 个测试文件**：已有 EffectCompositor、WeatherDataOverlay、性能测试，可直接添加 i18n 用例

### Established Patterns
- **测试结构**：`describe('ComponentName')` → `describe('rendering')` / `describe('events')`，嵌套 describe 块按行为区域分组
- **Props 工厂**：`createProps(overrides)` 模式统一
- **组件命名**：`defineOptions({ name: 'CmptWeatherWidget' })` 前缀模式

### Integration Points
- 14 个组件都需要在模板中引入 `useI18n()` 并替换硬编码文本为 `t()` 调用
- 测试需要 import LocaleProvider 并包裹组件进行挂载
- console-guard 需要全局更新 ALLOWED_PATTERNS

</code_context>

<specifics>
## Specific Ideas

- weather-widget 的 `spokenUnit` computed（`celsius` → `"Celsius"`, `fahrenheit` → `"Fahrenheit"`）和 sr-only 文本 `"{{ roundedTemperature }} degrees {{ spokenUnit }}"` 是最需要 i18n 的地方
- forecast strip 中的 `{{ day.label }}`（如 "Mon", "Tue"）如果来自组件内部计算而非 props，也需要 i18n
- 其他 13 个低优组件大多只有 1 个 Vue 文件，i18n 改造工作量小，是典型的 `t('componentName.label')` 替换

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 03-component-i18n-low-tests*
*Context gathered: 2026-04-11*
