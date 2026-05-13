# Phase 2: Component i18n (High + Medium) - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-11
**Phase:** 02-component-i18n-high-medium
**Areas discussed:** 消息 key 组织方式, 组件消息文件存放位置, 非 i18n 用户 fallback, Schema 动态 label 处理

---

## 消息 key 组织方式

| Option | Description | Selected |
|--------|-------------|----------|
| 嵌套路径 | `t('terminal.copy.copied')` — 语义清晰，VS Code 补全好 | ✓ |
| 扁平 key | `t('terminal_copy_copied')` — 更短但可读性差 | |
| 组件级命名空间 | `useI18n('terminal')` 传组件名，自动拼接 | |

**User's choice:** 嵌套路径

**Notes:** key 命名以组件名为根命名空间，子路径按功能域分组。

---

## 组件消息文件存放位置

| Option | Description | Selected |
|--------|-------------|----------|
| 集中式 | `core/i18n/messages/{locale}/{component}.json` — 统一管理 | |
| 分布式 | 各组件自带 `i18n/` 目录 — copy-paste 友好 | ✓ |
| 集中 + 复制 | 开发集中，构建时分发 — 需额外构建脚本 | |

**User's choice:** 分布式

**Notes:** 每个组件 `packages/components/src/{component}/i18n/` 下包含 `zh-CN.json` 和 `en.json`。

---

## 非 i18n 用户 fallback

| Option | Description | Selected |
|--------|-------------|----------|
| 自包含 fallback | 各组件自带 fallback，inject 失败时用本地值 | |
| 全局默认 Provider | core 入口自动注册 zh-CN 默认 LocaleProvider | ✓ |
| 条件分支 | 模板中直接用 `messages.xxx` 替代 `t()` | |

**User's choice:** 全局默认 Provider

**Notes:** copy-paste 用户无需任何额外配置，`t()` 调用自动返回 zh-CN 默认值。

---

## Schema 动态 label 处理

| Option | Description | Selected |
|--------|-------------|----------|
| 不 i18n 化 schema 字段 | 原样使用，由调用方决定是否传翻译值 | ✓ |
| 双重 fallback | schema 未提供时用 `t()` 翻译 | |

**User's choice:** 不 i18n 化 schema 字段

**Notes:** schema 字段属于业务数据，组件不应替业务做语言决策。

---

## Claude's Discretion

- 每个组件具体消息 key 的命名（只要遵循嵌套路径格式即可）
- 消息 JSON 文件的缩进格式
- 组件内 `t()` 调用的具体代码组织（computed vs inline）

## Deferred Ideas

- 低优 10 组件 i18n 改造 — Phase 3
- i18n 测试覆盖 — Phase 3
- CI key 一致性校验 — Phase 4
