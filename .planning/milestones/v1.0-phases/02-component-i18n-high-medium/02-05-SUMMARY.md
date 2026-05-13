---
phase: 02-component-i18n-high-medium
plan: 05
type: execute
wave: 2
dependency_graph:
  requires:
    - "02-01 (i18n core setMessages API)"
    - "02-02 (7 high-priority component i18n)"
    - "02-03 (6 medium-priority component i18n)"
    - "02-04 (image-gallery + remaining)"
  provides:
    - "Zero-config zh-CN defaults for all 12 high+medium components"
    - "Auto-registration of component messages at core module load time"
  affects:
    - "packages/core/src/index.ts"
    - "packages/components/src/*/i18n/zh-CN.json -> .ts migration"
tech_stack:
  added:
    - "mergeMessages helper for shallow+deep message merging"
  patterns:
    - "Module-level side effect (setMessages called on import)"
    - "Cross-package TS imports (.ts format instead of JSON)"
key_files:
  created:
    - packages/components/src/*/i18n/zh-CN.ts (12 files)
  modified:
    - packages/core/src/index.ts (added setMessages auto-registration)
decisions:
  - "D-DEV: Converted 12 component zh-CN JSON to .ts exports to avoid cross-package JSON import resolution issues"
  - "D-DEV: Used as unknown as Record<string, unknown> cast for const-asserted message objects to satisfy mergeMessages signature"
metrics:
  duration: ~5min
  completed: 2026-04-11
---

# Phase 02 Plan 05: 全局默认 LocaleProvider 自动注册 Summary

## Objective

使 copy-paste 用户无需任何额外配置即可获得 zh-CN 默认中文文本。core 入口在模块加载时自动调用 `setMessages()` 注册合并后的 zh-CN 消息（core 内置 + 12 个高优/中优组件消息）。

## One-liner

Core 入口自动注册 zh-CN + 12 个组件消息合并，实现零配置中文默认体验；JSON 迁移为 .ts 解决跨包导入类型问题。

## Tasks Completed

| # | Task | Commit | Key Files |
|---|------|--------|-----------|
| 1 | Add mergeMessages helper and auto-registration | `38b130b` | `packages/core/src/index.ts`, 12x `zh-CN.ts` |
| 2 | Verify end-to-end i18n (typecheck + grep) | (in same commit) | N/A |

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Cross-package JSON imports fail TypeScript resolution**
- **Found during:** Task 1
- **Issue:** `import ... from '../../components/src/terminal/i18n/zh-CN.json'` causes TS errors because core's `tsconfig.json` includes only `src/**/*.ts` and `src/**/*.vue`, not sibling package files. Even with `resolveJsonModule: true`, cross-monorepo JSON imports are fragile.
- **Fix:** Converted all 12 component `zh-CN.json` files to `zh-CN.ts` with `export const zhCN = { ... } as const` format. This uses standard TS imports that work cleanly across packages.
- **Files modified:** 12x `packages/components/src/*/i18n/zh-CN.{json,ts}` (JSON deleted, .ts created)
- **Commit:** `38b130b`

**2. [Rule 1 - Bug] Const-asserted message objects incompatible with mergeMessages signature**
- **Found during:** Task 1
- **Issue:** `zh-CN.ts` uses `as const`, making all values `readonly`. `mergeMessages(...messages: Record<string, unknown>[])` does not accept readonly objects.
- **Fix:** Used `as unknown as Record<string, unknown>` casts at call sites (not in the message files, preserving const-ness for downstream consumers).
- **Commit:** `38b130b`

## Key Decisions

1. **JSON -> .ts migration:** Chose to convert component locale files from JSON to TS exports. This is a permanent fix — future component i18n setup should use `.ts` files for consistency.
2. **No `image-gallery` component:** `packages/components/src/image-gallery/i18n/` does not exist (no i18n files at all). Skipped from the 12-component merge. The plan mentioned 13 but only 12 had i18n files.
3. **Import location in index.ts:** Placed setMessages call at the bottom of the file (after all exports) to ensure exports are available before side effect runs, though ESM hoisting would work either way.

## Verification

- `pnpm -F @lionad/vtu-core typecheck` passes with no errors
- `grep "setMessages|mergeMessages|coreZhCN"` confirms all three patterns present in `packages/core/src/index.ts`
- All 12 component `zh-CN.ts` files created and JSON files removed

## Deviations from Plan

### Deviations from Plan

**None beyond the documented auto-fixes above.** Plan executed exactly as written, with JSON->TS conversion as a necessary blocking fix.

## Self-Check: PASSED

- [x] `packages/core/src/index.ts` contains setMessages call with all 12 component imports
- [x] `mergeMessages` helper defined and called with coreZhCN + 12 component messages
- [x] Core package type-checks without errors
- [x] Module-level setMessages call is present and syntactically correct
- [x] All existing exports preserved (verified no change to export lines)
- [x] 12 component zh-CN.ts files exist
- [x] 12 component zh-CN.json files removed
