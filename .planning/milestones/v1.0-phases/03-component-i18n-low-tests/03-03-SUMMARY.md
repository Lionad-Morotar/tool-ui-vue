---
phase: 03-component-i18n-low-tests
plan: 03
type: execute
wave: 1
subsystem: components
tags:
  - i18n
  - low-priority
  - component
requires:
  - phase-01-i18n-core
  - phase-03-01-plan-locale-keys
provides:
  - i18n-ized plan, chart, stats-display components
  - statsDisplay.percent locale key added
affects:
  - packages/components/src/plan/index.vue
  - packages/components/src/chart/index.vue
  - packages/components/src/stats-display/index.vue
  - packages/components/src/plan/__tests__/index.test.ts
  - packages/components/src/stats-display/__tests__/index.test.ts
  - packages/core/src/i18n/locales/zh-CN.ts
  - packages/core/src/i18n/locales/en.ts
tech-stack:
  added: []
  patterns:
    - useI18n composable in component script setup
    - computed(() => t('key').value) for aria-label bindings
    - i18n-aware helper function for dynamic aria-labels
key-files:
  created: []
  modified:
    - path: packages/components/src/plan/index.vue
      change: Added useI18n, replaced 2 hardcoded English strings with t() calls
    - path: packages/components/src/chart/index.vue
      change: Added useI18n import and composable (data-driven component, no visible hardcoded text)
    - path: packages/components/src/stats-display/index.vue
      change: Added useI18n, replaced hardcoded 'percent' in aria-label with t('statsDisplay.percent'), removed hardcoded lang='en'
    - path: packages/core/src/i18n/locales/zh-CN.ts
      change: Added statsDisplay.percent: '百分比'
    - path: packages/core/src/i18n/locales/en.ts
      change: Added statsDisplay.percent: 'Percent'
    - path: packages/components/src/plan/__tests__/index.test.ts
      change: Added vi.mock for useI18n, structural verification tests for i18n
    - path: packages/components/src/stats-display/__tests__/index.test.ts
      change: Added vi.mock for useI18n, updated assertions for i18n changes
decisions:
  - plan 组件使用中文习惯的 "/" 分隔符而非 "of"（"1 / 5 已完成"）
  - stats-display 使用 helper function percentAriaLabel 而非 computed（因为 stat 在 v-for 作用域内）
  - 移除了 stats-display 根元素上的 lang="en" 硬编码，让其继承父级语言设置
  - 测试使用 vi.mock('@lionad/vtu-core/i18n') 而非 LocaleProvider 包裹（vitest 模块缓存导致 inject 不传递）
metrics:
  started_at: "2026-04-11T15:34:00Z"
  completed_at: "2026-04-11T15:56:00Z"
  tasks_completed: 3
  files_modified: 7
  tests_passing: 65
---

# Phase 03 Plan 03: i18n chart, stats-display, plan Summary

Eliminated all hardcoded English text in plan component ("X of Y complete", "X more"), added i18n integration to chart and stats-display components, and added the missing `statsDisplay.percent` locale key.

## One-liner

i18n改造 plan 组件（2处硬编码替换）、接入 chart/stats-display 的 i18n 基础设施、补充 statsDisplay.percent 翻译键。

## Tasks Completed

| #   | Task Name                                                | Commit   | Key Files                                      |
| --- | -------------------------------------------------------- | -------- | ---------------------------------------------- |
| 1   | Add missing locale keys (linkedinPost, xPost)           | n/a      | Already existed from previous plans            |
| 2   | i18n-ize plan component                                  | 89a03cc  | `packages/components/src/plan/index.vue`        |
| 3   | i18n-ize chart and stats-display components             | 65ace36  | `packages/components/src/{chart,stats-display}/index.vue`, locale files |
| —   | Update tests for i18n compatibility                     | 25a356a, a46c0aa | Test files for plan and stats-display |

## Deviations from Plan

### Rule 2 - Auto-fixed: Missing `statsDisplay.percent` locale key

- **Found during:** Task 3 — stats-display 的 aria-label 包含硬编码 "percent"
- **Issue:** statsDisplay 命名空间缺少 `percent` 键，但组件的百分数 aria-label 使用硬编码 `"X percent"` 格式
- **Fix:** 在 zh-CN.ts 中添加 `percent: '百分比'`，en.ts 中添加 `percent: 'Percent'`
- **Commit:** 65ace36

### Rule 1 - Bug: Test assertions broken by i18n changes

- **Found during:** Running tests after component changes
- **Issue:** plan 组件测试断言 `"1 of 5 complete"` 和 `"1 more"`，stats-display 测试断言 `lang="en"` 和 `"12.5 percent"`
- **Fix:** 使用 `vi.mock('@lionad/vtu-core/i18n')` 模拟 useI18n，更新断言以匹配 i18n 键路径而非硬编码文本
- **Commits:** 25a356a (plan tests), a46c0aa (stats-display tests)

## Known Stubs

None — all i18n calls wired to real locale keys.

## Verification

- [x] `pnpm vue-tsc --noEmit` — 类型检查通过
- [x] `pnpm vitest run` for plan/chart/stats-display — 65/65 测试通过
- [x] No hardcoded "complete" or "more" English text in plan component template
- [x] No hardcoded lang="en" in stats-display
- [x] All 3 components import `useI18n` from `@lionad/vtu-core/i18n`
- [x] `statsDisplay.percent` exists in both zh-CN and en locale files

## Self-Check: PASSED

- All 7 modified files exist on disk
- All 5 commits (89a03cc, 65ace36, 25a356a, a46c0aa, 782407a) present in git log
- Note: SUMMARY.md excluded from git by global .gitignore (`.planning`), but file exists and is complete
