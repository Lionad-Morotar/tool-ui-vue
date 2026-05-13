# Phase 5: Documentation + Histoire — Context

**Gathered:** 2026-04-11
**Status:** Ready for planning

<domain>
## Phase Boundary

为 i18n 系统创建双语文档和 Histoire Story 集成。覆盖：README 接入指南（DOCS-01）、Story 描述多语言感知（DOCS-02）、Histoire 语言切换器（DOCS-03）、API 文档双语（DOCS-04）、消费者指南（DOCS-05）。Phase 4 完成后 API 表面已稳定，可以输出面向用户的文档。

</domain>

<requirements>
## Requirements

### DOCS-01: README 多语言章节
- README.md 包含中文优先的 i18n 使用章节
- 必须包含：LocaleProvider 使用示例、t() 用法、自定义语言包示例
- 示例代码可直接复制使用（copy-paste style）

### DOCS-02: Story 描述多语言
- Story 描述文本（Variant title、story text）根据当前 locale 显示 zh-CN/en
- 切换 Histoire 语言后，Story 内描述文本实时更新

### DOCS-03: Histoire 语言切换器
- Histoire 站点侧边栏或顶部提供语言切换控件
- 切换后所有 Story 文本同步更新

### DOCS-04: API 文档
- LocaleProvider props 文档（messages、locale、defaultLocale）
- useI18n 返回类型（t、locale、setLocale）
- t() 签名（key path、params 插值）
- 消息文件格式示例（zh-CN.ts / en.ts 结构）

### DOCS-05: 消费者接入指南
- 逐步说明如何添加 i18n 到项目
- 如何扩展语言包（添加新语言、自定义消息）
- copy-paste 模式下的使用方式
- 不启用 i18n 时（零侵入）组件的行为

</requirements>

<current_state>
## 当前状态

### README
- 仅 3 行：标题、简短描述、预览链接
- 无任何使用示例或 i18n 章节

### Histoire Story
- Story 文件使用英文描述（如 "Props"、"ANSI Color Support"、"Exit Code Display"）
- Story 表格表头为英文（"Name"、"Type"、"Description"）
- 所有文本硬编码英文，未接入 i18n

### Histoire 配置
- `histoire.config.ts`: 无语言切换插件配置
- `setupFile: 'src/stories/_shared/histoire-setup.ts'` 存在

### 技术栈
- Histoire Vue 3 plugin: `@histoire/plugin-vue`
- 无官方多语言插件，需自行实现 locale toggle

</current_state>

<decisions>
## Implementation Decisions

### D-01: 文档语言策略
- README 以中文为主，关键 API 名称保持英文
- Histoire story 描述文本同时显示 zh-CN 和 en，或通过语言切换器切换

### D-02: Histoire 语言切换器实现
- Histoire 无内置 i18n 插件，使用自定义 Vue setup + provide/inject 实现
- 在 `histoire-setup.ts` 中添加全局 locale state，通过 provide 传递给所有 story
- 在 Histoire 自定义导航栏（top bar）添加语言切换按钮

### D-03: Story 表格表头多语言
- 表格表头（"Name"、"Type"、"Description"）使用 `useI18n` 接入
- 但 story 文件本身不使用 @lionad/vtu-core/i18n（避免依赖），使用简单 computed 对象

### D-04: README 章节结构
- 在现有 README 后追加章节：快速开始 → i18n 多语言 → API 参考 → 自定义语言
- 每个章节含可复制的代码示例

### D-05: API 文档策略
- 使用 Histoire 自带的 story 作为 API 文档载体
- 额外创建 `.planning/docs/API-i18n.md` 作为完整 API 参考
- README 中包含精简版 API 速查 + 链接到完整文档

</decisions>

</decisions>

</doc>
