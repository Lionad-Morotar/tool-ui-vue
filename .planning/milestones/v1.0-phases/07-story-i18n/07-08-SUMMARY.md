---
phase: 07-story-i18n
plan: "08"
subsystem: story-i18n
tags: [i18n, story, migration]
requires: []
provides: [directory-based-story, extracted-i18n]
affects: ["src/stories/data-table.story.vue", "src/stories/data-table/index.story.vue", "src/stories/data-table/i18n/zh.ts", "src/stories/data-table/i18n/en.ts", "src/stories/data-table/i18n/index.ts", "src/stories/stats-display.story.vue", "src/stories/stats-display/index.story.vue", "src/stories/stats-display/i18n/zh.ts", "src/stories/stats-display/i18n/en.ts", "src/stories/stats-display/i18n/index.ts", "src/stories/progress-tracker.story.vue", "src/stories/progress-tracker/index.story.vue", "src/stories/progress-tracker/i18n/zh.ts", "src/stories/progress-tracker/i18n/en.ts", "src/stories/progress-tracker/i18n/index.ts"]
tech-stack:
  added: []
patterns:
  - Directory-based story structure with i18n extraction
  - Key-based useStoryLocale lookups
key-files:
  created:
    - src/stories/data-table/i18n/zh.ts
    - src/stories/data-table/i18n/en.ts
    - src/stories/data-table/i18n/index.ts
    - src/stories/stats-display/i18n/zh.ts
    - src/stories/stats-display/i18n/en.ts
    - src/stories/stats-display/i18n/index.ts
    - src/stories/progress-tracker/i18n/zh.ts
    - src/stories/progress-tracker/i18n/en.ts
    - src/stories/progress-tracker/i18n/index.ts
  modified:
    - src/stories/data-table.story.vue
    - src/stories/data-table/index.story.vue
    - src/stories/stats-display.story.vue
    - src/stories/stats-display/index.story.vue
    - src/stories/progress-tracker.story.vue
    - src/stories/progress-tracker/index.story.vue
key-decisions:
  - "Extracted all inline useStoryLocale calls to i18n/zh.ts and i18n/en.ts"
  - "Rewrote story to use key-based message lookups"
  - "Removed old flat .story.vue file"
requirements-completed:
  - STORY-STRUCT-01
  - STORY-STRUCT-02
  - STORY-STRUCT-03
duration: "10 min"
completed: "2026-04-13"
---

# Phase 07 Plan 08 Summary

Migrate data-table, stats-display, and progress-tracker stories into directory-based structures with extracted i18n files.

## Files

- `src/stories/data-table.story.vue`
- `src/stories/data-table/index.story.vue`
- `src/stories/data-table/i18n/zh.ts`
- `src/stories/data-table/i18n/en.ts`
- `src/stories/data-table/i18n/index.ts`
- `src/stories/stats-display.story.vue`
- `src/stories/stats-display/index.story.vue`
- `src/stories/stats-display/i18n/zh.ts`
- `src/stories/stats-display/i18n/en.ts`
- `src/stories/stats-display/i18n/index.ts`
- `src/stories/progress-tracker.story.vue`
- `src/stories/progress-tracker/index.story.vue`
- `src/stories/progress-tracker/i18n/zh.ts`
- `src/stories/progress-tracker/i18n/en.ts`
- `src/stories/progress-tracker/i18n/index.ts`

## Verification

- All inline `useStoryLocale` calls extracted to i18n files
- New `index.story.vue` uses key-based lookups
- Old flat `.story.vue` file removed
- No remaining inline locale labels
