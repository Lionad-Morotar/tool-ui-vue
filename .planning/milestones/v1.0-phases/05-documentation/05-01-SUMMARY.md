---
phase: 05-documentation
plan: 01
completed_at: "2026-04-11T10:15:00Z"
---

# Phase 5 Plan 01 Summary — Histoire i18n Infrastructure

## Changes

### Task 1: Global locale state + useStoryLocale composable
- `src/stories/_shared/use-story-locale.ts`: New module with:
  - `currentLocale: Ref<string>` (defaults to 'zh-CN')
  - `toggleLocale()` — switches between zh-CN / en
  - `useStoryLocale(labels)` — returns `ComputedRef<string>` for story text
  - `useStoryLocaleRaw()` — raw access for components needing direct control

### Task 2: LocaleToggle component + nav bar mounting
- `src/stories/_shared/LocaleToggle.vue`: Minimal toggle button showing "EN" / "中文"
- `src/stories/_shared/histoire-setup.ts`: Added MutationObserver-based mounting into Histoire nav bar with fixed-position fallback
- `src/stories/vue-shim.d.ts`: Added Vue module shim for src/stories/ directory

## Verification
- TypeScript: no errors in new files
- `currentLocale` defaults to 'zh-CN'
- Zero dependency on `@lionad/vtu-core/i18n` in story infrastructure
