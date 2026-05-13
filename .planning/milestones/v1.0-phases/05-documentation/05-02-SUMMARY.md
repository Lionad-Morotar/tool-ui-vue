---
phase: 05-documentation
plan: 02
completed_at: "2026-04-11T10:55:00Z"
---

# Phase 5 Plan 02 Summary — README + API Docs + Story Bilingual Update

## Changes

### Task 1: README expansion
- `README.md`: Expanded from 3 lines to full documentation with 5 sections:
  - 快速开始 (Quick Start) — install + basic usage
  - 多语言 i18n — LocaleProvider wrapping, t() usage, locale switching
  - API 参考 — condensed tables for LocaleProvider props, useI18n return, t() signature
  - 自定义语言 (Custom Languages) — custom language file example
  - 消费者指南 — zero-intrusion and copy-paste mode notes

### Task 2: Full API docs + consumer guide
- `.planning/docs/API-i18n.md`: Complete API reference covering LocaleProvider props, useI18n return type, t() signature/deep dive, message format, type definitions, fallback mechanism
- `.planning/docs/CONSUMER-ONBOARDING.md`: 8-step integration guide including zero-intrusion mode and copy-paste usage

### Task 3: Story file updates (28 files)
- All 28 non-test `.story.vue` files updated:
  - Added `useStoryLocale` import
  - 3 files with props tables (terminal, code-block, code-diff, chart): replaced hardcoded English headers with computed bilingual labels
  - All non-Interactive variants received bilingual subtitle: `组件说明 / Component description`

## Verification
- All 28 story files import `useStoryLocale`
- No `@lionad/vtu-core/i18n` imports in any story file
- TypeScript: no new errors introduced
