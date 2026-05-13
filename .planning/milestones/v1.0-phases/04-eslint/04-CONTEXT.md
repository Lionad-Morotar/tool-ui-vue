# Phase 4: Quality + Compat - Context

**Gathered:** 2026-04-11
**Status:** Ready for planning

<domain>
## Phase Boundary

为 i18n 系统建立 CI 门禁和向后兼容保障。覆盖：消息 Key 一致性校验（QUALITY-01）、新增组件硬编码英文检测（QUALITY-02）、无 LocaleProvider 时组件默认行为（COMPAT-01）、copy-paste 消费者零侵入（COMPAT-02）。不引入新功能，只加固质量与兼容性。

</domain>

<decisions>
## Implementation Decisions

### ESLint 自定义规则架构
- **D-01:** ESLint 插件 `eslint-plugin-i18n` 包含 `key-consistency` 规则；`no-hardcoded-strings` 检查推迟到 `scripts/check-i18n.mjs` 脚本实现（误报率更低，可手动维护白名单）
- **D-02:** 插件放置在 `lib/eslint-plugin-i18n.mjs`，与现有自定义插件（`eslint-plugin-v-tw-merge.mjs`、`eslint-plugin-bem-order.mjs`）同级
- **D-03:** `key-consistency` 规则在 ESLint 中运行，对比 `packages/core/src/i18n/locales/zh-CN.ts` 和 `en.ts` 的 key 树，发现缺失或多余的 key 时报 error
- **D-04:** `no-hardcoded-strings` 规则扫描 Vue 组件模板和 `<script>` 中的英文字符串字面量（排除变量名、import 路径、CSS 类名等技术字符串），发现未使用 `t()` 包裹的英文时报 warn

### 兼容性：无 LocaleProvider 场景
- **D-05:** `useI18n()` 内部实现 fallback 机制 — 当 `inject` 未找到 LocaleProvider 提供的消息时，使用内建的默认 zh-CN messages 作为兜底
- **D-06:** fallback 消息包含所有组件所需的最基础文案，确保无配置时组件仍可正常渲染
- **D-07:** fallback 行为在 dev 模式下 console.warn 提示开发者建议配置 LocaleProvider，prod 模式静默 fallback

### 兼容性：Copy-paste 消费者
- **D-08:** 每个组件自带 `messages.ts`（或 `messages.json`）文件，包含该组件所需的全部 i18n 文案
- **D-09:** copy-paste 消费者复制组件目录时，messages 文件一起带走，组件内部自行 import 使用，不依赖 `@lionad/vtu-core/i18n`
- **D-10:** 组件内部优先使用 `useI18n()` 获取翻译（被 LocaleProvider 包裹时），fallback 到自身 messages 文件（copy-paste 模式下）

### Claude's Discretion
- ESLint 规则的具体实现细节（正则匹配策略、排除规则列表）
- `key-consistency` 规则是否支持嵌套 key 深度对比
- fallback messages 的组织形式（单个大文件 vs 按模块拆分）
- ESLint 规则的测试覆盖程度

</decisions>

<specifics>
## Specific Ideas

- ESLint 插件已有的项目结构：`lib/eslint-plugin-v-tw-merge.mjs` 和 `lib/eslint-plugin-bem-order.mjs` 可作为实现模板参考
- `no-hardcoded-strings` 需要排除：CSS 类名（`bg-red-500`）、import 路径、DOM API 调用、HTML 属性名、JSON 字符串、TypeScript 类型注解中的字符串
- 项目采用 trunk-based 开发，CI 在 push 到 main 时触发

</specifics>

<canonical_refs>
## Canonical References

### ESLint 架构
- `eslint.config.js` — 现有 ESLint 配置，自定义插件注册方式，需新增 eslint-plugin-i18n
- `lib/eslint-plugin-v-tw-merge.mjs` — 自定义 ESLint 插件实现范例
- `lib/eslint-plugin-bem-order.mjs` — 自定义 ESLint 插件实现范例

### i18n 需求定义
- `.planning/REQUIREMENTS.md` — QUALITY-01, QUALITY-02, COMPAT-01, COMPAT-02 需求定义
- `.planning/ROADMAP.md` — Phase 4 目标与成功标准

### 兼容性参考
- `packages/components/src/` — 23 个组件目录，每个需要自带 messages 文件
- `.github/workflows/deploy-histoire.yml` — 现有 CI workflow 结构参考

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `lib/eslint-plugin-v-tw-merge.mjs` — 自定义 ESLint 插件模板，可直接参考实现 eslint-plugin-i18n
- `lib/eslint-plugin-bem-order.mjs` — 同上，另一个 ESLint 自定义插件范例
- `packages/core/src/` — i18n 基础设施将放在这里，useI18n() 的 fallback 逻辑在此实现

### Established Patterns
- 项目已有自定义 ESLint 插件模式（lib/ 目录下 .mjs 文件），eslint-plugin-i18n 应遵循相同模式
- ESLint config 使用 flat config 模式（`eslint.config.js`），新插件需兼容

### Integration Points
- 新 ESLint 插件需注册到 `eslint.config.js` 的 plugins 中
- quality.yml CI workflow 需要在 push to main 时触发，包含 pnpm lint 步骤
- useI18n() 的 fallback 逻辑与 Phase 1 的 LocaleProvider 实现紧密相关

</code_context>

<deferred>
## Deferred Ideas

- 多语言 CI 在 PR 上的增量检查（只检查变更文件）— 可后续优化
- i18n 翻译质量检查（如翻译完整性评分）— 推迟到后续 milestone
- RTL 布局兼容性 — 推迟到后续 milestone
- 复数形式支持（pluralization）— 已在 Out of Scope 中

</deferred>

---

*Phase: 04-quality-compat*
*Context gathered: 2026-04-11*
