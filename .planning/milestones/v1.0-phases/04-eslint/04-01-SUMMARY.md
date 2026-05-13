---
phase: 04
plan: 01
completed_at: "2026-04-11T10:02:00Z"
---

# Phase 4 Plan 01 Summary — Quality + Compat

## Changes

### Task 1: Fallback fix (COMPAT-01)
- `packages/core/src/i18n/use-i18n.ts`: No LocaleProvider + no global messages → `t()` resolves from `zhCN` built-in messages instead of raw key strings
- `src/test/console-guard.ts`: Added `/\[vtu:i18n\] No LocaleProvider configured/` to allowed patterns

### Task 2: Fallback tests
- `packages/core/src/i18n/__tests__/use-i18n.test.ts`: Replaced old `'t() returns key itself'` test with `'t() falls back to zh-CN built-in messages'` test
- 12/12 tests passing

### Task 3: i18n validation script
- `scripts/check-i18n.mjs`: New script with two checks:
  - QUALITY-01: Key consistency between zh-CN.ts and en.ts (28 namespaces match)
  - QUALITY-02: Component i18n coverage (20/20 components, 7 whitelisted)

### Task 4: ESLint plugin
- `lib/eslint-plugin-i18n.mjs`: New ESLint plugin with `key-consistency` rule
- `eslint.config.mjs`: Registered `i18n` plugin, added `'i18n/key-consistency': 'error'`

### Task 5: CI workflow
- `.github/workflows/quality.yml`: New GitHub Actions workflow running lint → typecheck → test → i18n check

### Task 6: Copy-paste consumer verification (COMPAT-02)
- `packages/core/src/i18n/__tests__/locale-provider.test.ts`: Added `COMPAT-02: copy-paste consumer compatibility` test suite verifying:
  - Components importing `useI18n` render zh-CN text without LocaleProvider
  - Parameter interpolation works in fallback mode

## Test Results
- `use-i18n.test.ts`: 12/12 ✅
- `locale-provider.test.ts`: 12/12 ✅
- `check-i18n.mjs`: ✅ All checks pass
- ESLint key-consistency: ✅ No errors
