---
phase: 02-component-i18n-high-medium
plan: 01
type: execute
subsystem: I18N-COMPS
tags: [i18n, components, terminal, code-block, code-diff]
dependency_graph:
  requires: [01-i18n-core]
  provides: [COMPS-01-terminal, COMPS-01-code-block, COMPS-01-code-diff]
  affects: [packages/core/vite.config.ts, packages/core/scripts/fix-types.mjs]
tech_stack:
  added: []
  patterns: [useI18n composable, t() with {param} interpolation, computed for attribute bindings]
key_files:
  created:
    - packages/components/src/terminal/i18n/zh-CN.json
    - packages/components/src/terminal/i18n/en.json
    - packages/components/src/code-block/i18n/zh-CN.json
    - packages/components/src/code-block/i18n/en.json
    - packages/components/src/code-diff/i18n/zh-CN.json
    - packages/components/src/code-diff/i18n/en.json
  modified:
    - packages/components/src/terminal/index.vue
    - packages/components/src/code-block/index.vue
    - packages/components/src/code-diff/index.vue
    - packages/core/vite.config.ts
    - packages/core/scripts/fix-types.mjs
decisions:
  - "D-BUILD: Added i18n subpath entry to core vite.config.ts multi-entry build to enable @lionad/vtu-core/i18n type resolution"
  - "D-TYPE: Used computed wrappers for aria-label bindings because vue-tsc does not auto-unwrap ComputedRef in attribute expressions"
metrics:
  duration: "~15 min"
  completed: "2026-04-11T05:58:16Z"
  tasks_completed: 3
  files_modified: 9
  files_created: 6
---

# Phase 2 Plan 1: i18n High-Priority Components (terminal, code-block, code-diff) Summary

## One-liner

Added i18n JSON locale files to terminal (7 keys), code-block (4 keys), and code-diff (4 keys) in both zh-CN and en, wired `useI18n()` composable into all 3 components, replaced all hardcoded English UI text with type-safe `t()` calls.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Missing i18n subpath export in core build**
- **Found during:** Task 2 (terminal wiring)
- **Issue:** `@lionad/vtu-core/i18n` subpath import resolved at runtime but `vue-tsc` could not find type declarations -- core vite.config.ts only built single entry point, no `dist/i18n/` directory
- **Fix:** Converted core vite build to multi-entry (`index` + `i18n/index`), added `i18n` to `fix-types.mjs` subdirectory copy list
- **Files modified:** `packages/core/vite.config.ts`, `packages/core/scripts/fix-types.mjs`
- **Commit:** `33b977e`

**2. [Rule 1 - Bug] vue-tsc type mismatch on ComputedRef in attribute bindings**
- **Found during:** Task 2 (terminal wiring)
- **Issue:** `t()` returns `ComputedRef<string>`. In Vue template mustache `{{ t('key') }}`, Vue auto-unwraps, but in `:aria-label="t('key')"`, vue-tsc reports `Type 'ReadonlyRef<string>' is not assignable to type 'string'`
- **Fix:** Created `computed(() => t('key').value)` wrapper (`copyButtonAriaLabel`) for each component's copy button aria-label, providing a plain `string` return type that type-checks
- **Files modified:** All 3 component `index.vue` files
- **Commits:** `96dd78f`, `1097fb1`

## Known Stubs

None. All UI text in these 3 components is fully i18n-ized. Schema fields (e.g., `cwd`, `command`, `filename`, `languageDisplayName`) are not i18n-ized per D-08 -- they are user-provided data, not component-generated UI text.

## Verification Results

| Check | Result |
|-------|--------|
| 6 JSON files parse correctly | PASS |
| terminal: 7 keys in zh-CN + en | PASS |
| code-block: 4 keys in zh-CN + en | PASS |
| code-diff: 4 keys in zh-CN + en | PASS |
| All 3 components import `useI18n` | PASS |
| Zero hardcoded English strings in templates | PASS |
| `vue-tsc --noEmit` passes | PASS |

## Commits

- `684e55f`: feat(02-01): create i18n JSON files for terminal, code-block, code-diff
- `96dd78f`: feat(02-01): wire useI18n into terminal component
- `1097fb1`: feat(02-01): wire useI18n into code-block and code-diff components
- `33b977e`: fix(02-01): add i18n subpath export to core package

## Self-Check

- [x] All 6 JSON files exist and parse
- [x] terminal/index.vue has useI18n import, no hardcoded strings
- [x] code-block/index.vue has useI18n import, no hardcoded strings
- [x] code-diff/index.vue has useI18n import, no hardcoded strings
- [x] vue-tsc --noEmit passes with zero errors
- [x] All 4 commits exist

## Self-Check: PASSED
