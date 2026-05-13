# Phase 1: I18N Core - Context

**Gathered:** 2026-04-11
**Status:** Ready for planning

<domain>
## Phase Boundary

实现轻量级 i18n 基础设施：LocaleProvider 组件 + useI18n() composable + 类型定义 + zh-CN/en 消息文件 + 缺失 key fallback 逻辑。零外部依赖，provide/inject 模式，zh-CN 为默认语言。

**Requirements:** CORE-01, CORE-02, CORE-03, CORE-04, CORE-05, CORE-06
</domain>

<decisions>
## Implementation Decisions

### LocaleProvider API
- **D-01:** 使用简单 messages 对象 prop：`:messages="zhCN"`，不分离 locale + messages
- **D-02:** 消费者只需传入单一语言包对象（如 `zhCN`），不需要传入多语言字典
- **D-03:** Locale 切换由消费者重新包裹不同 messages 实现（LocaleProvider 内部不维护 locale 状态机）

### useI18n() 返回值
- **D-04:** 返回 `{ t, locale, setLocale }`
  - `t(key, params?)` → computed string
  - `locale` → computed 当前 locale key
  - `setLocale(key)` → 切换语言的函数
- **D-05:** t() 返回 computed ref，模板中直接使用无需 .value

### TypeScript 类型推导
- **D-06:** 使用 `as const` 自动推导嵌套 key 路径，不手动维护扁平联合类型
- **D-07:** t() 的 key 参数有完整类型推导，非法 key 路径在编译时报类型错误
- **D-08:** MessageSchema 类型从消息文件推导，不需要手写类型声明

### Shared 命名空间策略
- **D-09:** 组件优先读取自己的 namespace key（如 `terminal.copied`），fallback 到 `shared` namespace（如 `shared.copied`）
- **D-10:** `shared` namespace 用于跨组件复用文案（copy, copied, free, discount, tax, subtotal, shipping, total 等）
- **D-11:** 组件内如需特定场景的自定义文案，定义在自己的 namespace 即可覆盖 shared

### Claude's Discretion
- LocaleProvider 组件的具体 props 命名（`messages` vs `localeMessages` 等）
- useI18n() 的内部 provide key 命名
- 消息文件的目录组织细节（locales/zh-CN.ts vs locales/zhCN.ts）
- {param} 插值的正则实现方式
- dev/prod 环境判断方式（import.meta.env.DEV vs 其他）

</decisions>

<specifics>
## Specific Ideas

- "消息文件用嵌套对象而非扁平 key：`{ terminal: { copy: '复制' } }`，调用时 `t('terminal.copy')`"
- "参数插值用 `{param}` 语法：`t('terminal.showAll', { lineCount: 50 })` → `显示全部 50 行`"
- "dev 环境缺失 key 时 console.warn 并显示 key 路径，prod 环境 fallback 到 zh-CN"
- "消息文件作为独立 entry point 导出，消费者可按需 import"
</specifics>

<canonical_refs>
## Canonical References

### i18n 架构
- `~/.gstack/projects/tool-ui-vue/lionad-main-design-20260411-120000.md` — i18n 系统设计文档，包含架构方案、消费者 API、消息文件格式、关键决策
- `.planning/REQUIREMENTS.md` — Phase 1 需求（CORE-01 到 CORE-06）
- `.planning/ROADMAP.md` — Phase 1 目标、依赖关系、成功标准

### 现有代码模式
- `packages/core/src/index.ts` — core 包 barrel 导出模式，i18n 需遵循相同模式
- `packages/core/src/components/copy-button/index.vue` — 组件使用 `<script setup>` + `withDefaults` 的标准模式

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `packages/core/src/index.ts` — barrel 导出模式，i18n 模块需添加导出条目
- `packages/core/src/utils.ts` — `cn()` 工具函数，i18n 组件可能需要
- `packages/core/src/components/` — 现有组件目录，LocaleProvider 可作为新组件加入

### Established Patterns
- `<script setup lang="ts">` + `withDefaults` — 所有组件使用此模式
- core 包按功能分目录（components/、schema.ts、contract.ts 等），i18n 也按此模式
- `packages/core/src/index.ts` 使用 named exports + type re-exports 模式

### Integration Points
- i18n 模块放在 `packages/core/src/i18n/`，从 `@lionad/vtu-core/i18n` 导出
- 组件改造时使用 `import { useI18n } from '@lionad/vtu-core/i18n'`
- 消息文件从 `@lionad/vtu-core/i18n` 导出语言包（zhCN, en）

</code_context>

<deferred>
## Deferred Ideas

None — 讨论始终在 Phase 1 范围内
</deferred>

---

*Phase: 01-i18n-core*
*Context gathered: 2026-04-11*
