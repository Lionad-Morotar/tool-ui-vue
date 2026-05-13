---
phase: 03-component-i18n-low-tests
plan: 02
subsystem: components
tags: [i18n, social-media, aria-labels]
requires:
  - Phase 1 (LocaleProvider + useI18n infrastructure)
provides:
  - x-post, instagram-post, linkedin-post with i18n bindings
affects:
  - packages/core/src/i18n/locales/zh-CN.ts
  - packages/core/src/i18n/locales/en.ts
  - packages/components/src/x-post/index.vue
  - packages/components/src/instagram-post/index.vue
  - packages/components/src/linkedin-post/cmpts/linkedin-post.vue
tech-stack:
  added: []
  patterns:
    - "useI18n() composable with computed return"
    - "computed(() => t('key').value) for attribute bindings"
key-files:
  created: []
  modified:
    - packages/core/src/i18n/locales/zh-CN.ts
    - packages/core/src/i18n/locales/en.ts
    - packages/components/src/x-post/index.vue
    - packages/components/src/instagram-post/index.vue
    - packages/components/src/linkedin-post/cmpts/linkedin-post.vue
decisions:
  - D-01: Extended existing xPost/instagramPost/linkedinPost namespaces instead of creating new low.ts files
  - D-02: Also i18n-ized logo and verified badge aria-labels beyond plan scope (Rule 2 - missing accessibility i18n)
  - D-03: Used computed(() => t('key').value) pattern for all aria-label bindings, matching terminal component pattern
metrics:
  duration: ~5min
  completed: 2026-04-11
---

# Phase 3 Plan 02: Social Media Components i18n Summary

**One-liner:** Eliminated hardcoded English text in x-post, instagram-post, and linkedin-post components by adding locale namespace keys and wiring aria-labels/button text to the i18n system.

## Tasks Completed

| Task | Name | Commit | Files Modified |
|------|------|--------|----------------|
| 1 | i18n-ize instagram-post | `62efec1` | `instagram-post/index.vue`, `locales/*.ts` |
| 2 | i18n-ize linkedin-post | `dd77ffa` | `linkedin-post/cmpts/linkedin-post.vue`, `locales/*.ts` |
| 3 | i18n-ize x-post | `619ee54` | `x-post/index.vue`, `locales/*.ts` |

## Locale Keys Added

### xPost namespace (en/zh-CN)
- `verified`: "Verified account" / "认证账号"
- `logo`: "X (formerly Twitter) logo" / "X（原 Twitter）标志"

### instagramPost namespace (en/zh-CN)
- `logo`: "Instagram logo" / "Instagram 标志"

### linkedinPost namespace (en/zh-CN)
- `edited`: "Edited" / "已编辑"
- `seeMore`: "See more" / "查看更多"
- `logo`: "LinkedIn logo" / "LinkedIn 标志"
- `verified`: "Verified account" / "认证账号"

## Deviations from Plan

### Auto-fixed Issues (Rule 2 - Missing Critical Accessibility i18n)

**1. Additional aria-labels i18n-ized beyond plan scope**
- **Found during:** Task 1, 2, 3
- **Issue:** Plan only specified Like/Share aria-labels for instagram-post and linkedin-post, but "Verified", "Instagram logo", "LinkedIn logo" aria-labels were also hardcoded English, breaking accessibility for non-English users
- **Fix:** Added logo/verified keys to corresponding namespaces and replaced all hardcoded aria-labels with t() bindings
- **Files modified:** `instagram-post/index.vue`, `linkedin-post/cmpts/linkedin-post.vue`, `locales/zh-CN.ts`, `locales/en.ts`
- **Commits:** `7eb0756`, `62efec1`, `dd77ffa`

**2. x-post duplicated verified aria-label in quoted post**
- **Found during:** Task 3
- **Issue:** x-post has two instances of `aria-label="Verified account"` (main post + quoted post), both needed i18n
- **Fix:** Used `replace_all` to replace both instances
- **Files modified:** `x-post/index.vue`

## Verification

- `pnpm typecheck` passes (all 3 packages)
- No hardcoded English text in aria-labels or visible text for all 3 components
- All components import `useI18n` and use `t()` calls
- All aria-label bindings use `computed(() => t('key').value)` pattern

## Known Stubs

None.

## Self-Check: PASSED
