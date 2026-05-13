# Phase 3: Component i18n (Low) + Tests - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-11
**Phase:** 03-component-i18n-low-tests
**Areas discussed:** 组件范围, 测试策略, weather-widget 处理, console-guard 兼容

---

## 低优组件清单

| Option | Description | Selected |
|--------|-------------|----------|
| 严格 10 个 | 精确 10 个：x-post, instagram-post, chart, stats-display, weather-widget + 再选 5 个 | |
| 剩余全部 14 个（推荐） | Phase 2 没覆盖的 14 个全部做掉，不留尾巴 | ✓ |
| 按实际硬编码文本数量决定 | 先扫描每个组件的硬编码英文数量，有英文文本的才纳入 | |

**User's choice:** 剩余全部 14 个（推荐）

**Notes:** 用户选择最彻底的方案——Phase 2 之外的所有 14 个组件全部纳入 Phase 3 范围，确保零硬编码英文遗留。

---

## 测试策略

| Option | Description | Selected |
|--------|-------------|----------|
| 核心单元测试 + 抽样集成 | LocaleProvider 和 useI18n 专用测试，组件 i18n 抽样验证 | |
| 全覆盖，每个组件独立测试（推荐） | LocaleProvider、useI18n、全部 14 个低优组件各自写完整测试 | ✓ |
| 仅集成测试 | 只写集成测试，不单独测核心 | |

**User's choice:** 全覆盖，每个组件独立测试

**Notes:** 用户选择最严谨的方案，每个组件都需要独立的 i18n 测试文件。

---

## weather-widget 处理

**Analysis:** weather-widget 是最复杂的组件（38 文件、6151 行、WebGL 渲染管线），但经检查发现其模板内容主要是数据驱动（props 传入 location、temperature 等），i18n 文案集中在 accessibility 层（sr-only 屏幕阅读文本、spokenUnit 计算属性）。不需要深入 WebGL 渲染管线。

**Decision:** 正常处理，与低优组件其他成员无本质差异。

---

## console-guard 兼容

| Option | Description | Selected |
|--------|-------------|----------|
| 自动添加白名单（推荐） | 在 ALLOWED_PATTERNS 中添加 i18n 匹配规则 | ✓ |
| 测试中 mock console.warn | 测试中 mock 覆盖 console.warn | |
| 用事件替代 console.warn | i18n 核心不 warn，改为发射事件 | |

**User's choice:** 你决定

**Notes:** 用户将决策权委托给 Claude。决定：在 ALLOWED_PATTERNS 中添加 i18n 警告白名单，同时 i18n 核心测试保留对 warn 行为的显式验证（使用 vi.spyOn 而非依赖 ALLOWED_PATTERNS）。

---

## Claude's Discretion

- console-guard 兼容策略（用户明确委托）

## Deferred Ideas

无——讨论始终保持在 Phase 3 范围内。
