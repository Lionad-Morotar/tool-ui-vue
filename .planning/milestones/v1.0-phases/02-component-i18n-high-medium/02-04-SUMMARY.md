---
phase: 02-component-i18n-high-medium
plan: 04
subsystem: i18n
tags: [vue3, i18n, zh-CN, en, locale, provide-inject]

# Dependency graph
requires:
  - phase: 01-i18n-core
    provides: useI18n composable, LocaleProvider, i18n injection key
provides:
  - "5 medium-priority components i18n-ready (audio, video, geo-map, item-carousel, preferences-panel)"
  - "10 i18n JSON files (zh-CN + en) for all 5 components"
  - "Type-safe computed wrappers for aria-label bindings"
affects:
  - "Phase 3: Low-priority component i18n"
  - "Phase 3: i18n test coverage"

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Component-scoped i18n JSON files in i18n/ subdirectory"
    - "Computed wrappers for :aria-label bindings (type-safe unwrapping of ComputedRef)"
    - "Inline t() calls for text content (Vue auto-unwraps in {{ }})"

key-files:
  created:
    - packages/components/src/audio/i18n/zh-CN.json
    - packages/components/src/audio/i18n/en.json
    - packages/components/src/video/i18n/zh-CN.json
    - packages/components/src/video/i18n/en.json
    - packages/components/src/geo-map/i18n/zh-CN.json
    - packages/components/src/geo-map/i18n/en.json
    - packages/components/src/item-carousel/i18n/zh-CN.json
    - packages/components/src/item-carousel/i18n/en.json
    - packages/components/src/preferences-panel/i18n/zh-CN.json
    - packages/components/src/preferences-panel/i18n/en.json
  modified:
    - packages/components/src/audio/index.vue
    - packages/components/src/video/index.vue
    - packages/components/src/geo-map/index.vue
    - packages/components/src/item-carousel/index.vue
    - packages/components/src/preferences-panel/index.vue

key-decisions:
  - "Use computed wrappers with .value unwrapping for :aria-label bindings to satisfy TS type checking (t() returns ComputedRef, attributes need string)"
  - "Text content uses inline t() calls in {{ }} since Vue auto-unwraps ComputedRef"

patterns-established:
  - "Computed wrapper pattern for attribute bindings: const label = computed(() => t('key').value)"
  - "Computed getter pattern for dynamic aria-labels: const getLabel = (idx) => t('key', { param: idx }).value"

requirements-completed:
  - COMPS-02

# Metrics
duration: ~6min
completed: 2026-04-11
---

# Phase 02 Plan 04: i18n改造 5 个中优组件 Summary

**5 个中优组件（audio, video, geo-map, item-carousel, preferences-panel）消除硬编码英文文本，通过 t() 消费 i18n 系统**

## Performance

- **Duration:** ~6 min
- **Started:** 2026-04-11T14:23:00+08:00
- **Completed:** 2026-04-11T14:29:00+08:00
- **Tasks:** 4
- **Files modified:** 15

## Accomplishments

- Created 10 i18n JSON files (zh-CN + en) for all 5 components
- Wired useI18n() composable into all 5 component index.vue files
- Replaced all 17 hardcoded English UI strings with t() calls
- image-gallery confirmed zero hardcoded strings, skipped per plan
- TypeScript type-safe: computed wrappers for attribute bindings, inline for text content

## Task Commits

Each task was committed atomically:

1. **Task 1: Create i18n JSON files for audio, video, geo-map** - `3a4198e` (chore)
2. **Task 2: Create i18n JSON files for item-carousel, preferences-panel** - `3a1864a` (chore)
3. **Task 3: Wire useI18n into audio, video, geo-map components** - `7aa3d50` (feat)
4. **Task 4: Wire useI18n into item-carousel and preferences-panel** - `0fdfa4e` (feat)

**Plan metadata:** pending final commit

## Files Created/Modified

- `packages/components/src/audio/i18n/zh-CN.json` - Audio Chinese messages (play, pause)
- `packages/components/src/audio/i18n/en.json` - Audio English messages
- `packages/components/src/video/i18n/zh-CN.json` - Video Chinese messages (5 keys)
- `packages/components/src/video/i18n/en.json` - Video English messages
- `packages/components/src/geo-map/i18n/zh-CN.json` - Geo-map Chinese messages (loadingMap)
- `packages/components/src/geo-map/i18n/en.json` - Geo-map English messages
- `packages/components/src/item-carousel/i18n/zh-CN.json` - Carousel Chinese messages (7 keys)
- `packages/components/src/item-carousel/i18n/en.json` - Carousel English messages
- `packages/components/src/preferences-panel/i18n/zh-CN.json` - Preferences Chinese messages (4 keys)
- `packages/components/src/preferences-panel/i18n/en.json` - Preferences English messages
- `packages/components/src/audio/index.vue` - useI18n wired, play/pause aria-label replaced (2 instances)
- `packages/components/src/video/index.vue` - useI18n wired, 4 strings replaced (unsupportedBrowser, videoControls, open, pause/watch)
- `packages/components/src/geo-map/index.vue` - useI18n wired, loadingMap label replaced
- `packages/components/src/item-carousel/index.vue` - useI18n wired, 7 strings replaced, computed wrappers for aria-label bindings
- `packages/components/src/preferences-panel/index.vue` - useI18n wired, 3 strings replaced, computed wrapper for receipt aria-label

## Decisions Made

- Computed wrappers with `.value` unwrapping used for all `:aria-label` bindings since `t()` returns `ComputedRef<string>` and Vue attributes expect `string`. This matches the pattern established in terminal's `copyButtonAriaLabel` computed.
- Text content (`{{ }}`) uses direct `t()` calls since Vue's template compiler auto-unwraps ComputedRef.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing Critical] Added computed wrappers for type-safe attribute bindings**
- **Found during:** Task 4 (item-carousel and preferences-panel useI18n wiring)
- **Issue:** Direct `t()` calls in `:aria-label` attributes cause TS2322 errors: "Type 'ComputedRef' is not assignable to type 'string'". This affects all attribute bindings where t() result flows into HTML attributes.
- **Fix:** Created computed wrappers that unwrap `.value` from t() ComputedRef before binding. For static labels: `const label = computed(() => t('key').value)`. For dynamic labels with parameters: `const getLabel = (idx) => t('key', { param: idx }).value`. This is the same pattern used in the already-completed terminal component (`copyButtonAriaLabel`).
- **Files modified:** `packages/components/src/item-carousel/index.vue`, `packages/components/src/preferences-panel/index.vue`
- **Verification:** `vue-tsc --noEmit` shows zero new TS errors in modified files (pre-existing errors in audio/video unrelated to these changes)
- **Committed in:** `0fdfa4e` (Task 4 commit)

---

**Total deviations:** 1 auto-fixed (1 missing critical - type safety for attribute bindings)
**Impact on plan:** Essential for TypeScript correctness. Does not change behavior — only adds type-safe computed wrappers that unwrap the same t() values. Matches established terminal component pattern.

## Issues Encountered

- item-carousel and preferences-panel both had TS2322 errors when directly using `t()` in `:aria-label` bindings. Resolved by computing unwrapped values with `.value` access, matching terminal's established pattern.

## Known Stubs

None - all UI text strings in the 5 components now flow through t() with zh-CN default messages.

## Next Phase Readiness

- 02-05-PLAN.md remains (image-gallery confirmation + any remaining medium components)
- Phase 3: Low-priority 10 components i18n ready to proceed
- i18n test coverage (Phase 3) can begin

---

*Phase: 02-component-i18n-high-medium*
*Completed: 2026-04-11*
