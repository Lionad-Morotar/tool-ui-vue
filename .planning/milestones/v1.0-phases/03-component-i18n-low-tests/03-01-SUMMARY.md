---
phase: 03-component-i18n-low-tests
plan: 01
type: execute
wave: 1
subsystem: components
tags:
  - i18n
  - low-priority
  - component
requires:
  - phase-01-i18n-core
provides:
  - plan namespace in locale files
  - i18n-ized approval-card, citation, image, option-list, parameter-slider
affects:
  - packages/core/src/i18n/locales/zh-CN.ts
  - packages/core/src/i18n/locales/en.ts
  - packages/components/src/approval-card/states/index.ts
  - packages/components/src/citation/index.vue
  - packages/components/src/image/index.vue
  - packages/components/src/option-list/index.vue
  - packages/components/src/parameter-slider/index.vue
  - packages/components/src/parameter-slider/states/useSlider.ts
tech-stack:
  added: []
  patterns:
    - useI18n composable in state layer
    - useI18n composable in component script setup
    - computed(() => t('key').value) for aria-label bindings
key-files:
  created: []
  modified:
    - packages/core/src/i18n/locales/zh-CN.ts
    - packages/core/src/i18n/locales/en.ts
    - packages/components/src/approval-card/states/index.ts
    - packages/components/src/citation/index.vue
    - packages/components/src/image/index.vue
    - packages/components/src/option-list/index.vue
    - packages/components/src/parameter-slider/index.vue
    - packages/components/src/parameter-slider/states/useSlider.ts
decisions:
  - "approval-card i18n in states layer: labels computed in state layer, not template"
  - "parameter-slider getAriaValueText: replaced 'plus'/'minus' with '+/-' to avoid i18n dependency in pure function"
  - "link-preview: no i18n needed, all visible text is data-driven from props"
  - "progress-tracker: no i18n needed, all visible text is data-driven from step props"
metrics:
  duration: unknown
  completed: 2026-04-11
---

# Phase 03 Plan 01: i18n Low-Priority Components Summary

**One-liner:** Added plan namespace to core locale files and replaced hardcoded English in 5 of 7 target components (approval-card, citation, image, option-list, parameter-slider) with t() calls.

## Tasks Completed

### Task 1: Add plan namespace to core locale files
- Added `plan.complete` and `plan.more` to both zh-CN.ts and en.ts
- zh-CN: '已完成' / '还有 {count} 项'
- en: 'complete' / '{count} more'
- Commit: `e066a02`

### Task 2 & 3: i18n-ize components

#### approval-card
- Added `useI18n` import to states layer (`states/index.ts`)
- Default confirm label: `t('approvalCard.approve').value` (was 'Approve')
- Default cancel label: `t('approvalCard.reject').value` (was 'Deny')
- Commit: `bfbfb2e`

#### citation
- Added `useI18n` import to component script setup
- aria-label uses `t('citation.viewSource').value` for type-safe computed binding
- Commit: `fcdc657`

#### image
- Added `useI18n` import to component script setup
- Created `imageAlt` computed: uses `t('image.alt').value` as default when no alt prop provided
- Template binds `:alt="imageAlt"`
- Commit: `fcdc657`

#### option-list
- Added `useI18n` import to component script setup
- Receipt view aria-label uses `t('optionList.selected').value`
- Commit: `fcdc657`

#### parameter-slider
- Added `useI18n` import to component script setup
- Default action labels use i18n: `t('parameterSlider.reset').value` for Reset, `t('shared.confirm').value` for Apply
- Fixed `getAriaValueText`: replaced hardcoded 'plus X unit'/'minus X unit' with '+X unit'/'-X unit' format
- Commit: `fcdc657`

#### link-preview (no changes)
- **Decision:** No i18n needed. All visible text (title, description, domain) is data-driven from props. No hardcoded English text in the template.

#### progress-tracker (no changes)
- **Decision:** No i18n needed. All visible text (step.label, step.description, choice.summary) is data-driven from props. No hardcoded English text in the template.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed hardcoded 'plus'/'minus' in getAriaValueText**
- **Found during:** Task 3 (parameter-slider)
- **Issue:** `getAriaValueText` in `useSlider.ts` had hardcoded English 'plus X unit' / 'minus X unit' for accessibility text
- **Fix:** Replaced with '+X unit' / '-X unit' format which is language-neutral and avoids needing i18n in a pure utility function
- **Files modified:** `packages/components/src/parameter-slider/states/useSlider.ts`
- **Commit:** `fcdc657`

**2. [Rule 3 - Blocking] i18n not needed for link-preview and progress-tracker**
- **Found during:** Task 3
- **Issue:** Plan expected 7 components to need i18n, but 2 have no hardcoded English text
- **Resolution:** Documented as decisions, removed unnecessary imports to avoid TS6133 errors

### None needed for link-preview and progress-tracker

## Known Stubs

None - all locale values are properly wired.

## Self-Check: PASSED

Verified:
- All 5 modified component files exist and contain `useI18n` import
- `vue-tsc --noEmit` passes for all modified components (0 errors)
- Both locale files contain `plan` namespace
- 3 commits created for this plan
