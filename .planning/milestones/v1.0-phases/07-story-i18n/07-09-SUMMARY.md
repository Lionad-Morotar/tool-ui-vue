---
phase: 07-story-i18n
plan: "09"
subsystem: story-i18n
tags: [i18n, story, migration]
requires: []
provides: [directory-based-story, extracted-i18n]
affects: ["src/stories/parameter-slider.story.vue", "src/stories/parameter-slider/index.story.vue", "src/stories/parameter-slider/i18n/zh.ts", "src/stories/parameter-slider/i18n/en.ts", "src/stories/parameter-slider/i18n/index.ts", "src/stories/code-diff.story.vue", "src/stories/code-diff/index.story.vue", "src/stories/code-diff/i18n/zh.ts", "src/stories/code-diff/i18n/en.ts", "src/stories/code-diff/i18n/index.ts", "src/stories/approval-card.story.vue", "src/stories/approval-card/index.story.vue", "src/stories/approval-card/i18n/zh.ts", "src/stories/approval-card/i18n/en.ts", "src/stories/approval-card/i18n/index.ts"]
tech-stack:
  added: []
patterns:
  - Directory-based story structure with i18n extraction
  - Key-based useStoryLocale lookups
key-files:
  created:
    - src/stories/parameter-slider/i18n/zh.ts
    - src/stories/parameter-slider/i18n/en.ts
    - src/stories/parameter-slider/i18n/index.ts
    - src/stories/code-diff/i18n/zh.ts
    - src/stories/code-diff/i18n/en.ts
    - src/stories/code-diff/i18n/index.ts
    - src/stories/approval-card/i18n/zh.ts
    - src/stories/approval-card/i18n/en.ts
    - src/stories/approval-card/i18n/index.ts
  modified:
    - src/stories/parameter-slider.story.vue
    - src/stories/parameter-slider/index.story.vue
    - src/stories/code-diff.story.vue
    - src/stories/code-diff/index.story.vue
    - src/stories/approval-card.story.vue
    - src/stories/approval-card/index.story.vue
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

# Phase 07 Plan 09 Summary

Migrate parameter-slider, code-diff, and approval-card stories into directory-based structures with extracted i18n files.

## Files

- `src/stories/parameter-slider.story.vue`
- `src/stories/parameter-slider/index.story.vue`
- `src/stories/parameter-slider/i18n/zh.ts`
- `src/stories/parameter-slider/i18n/en.ts`
- `src/stories/parameter-slider/i18n/index.ts`
- `src/stories/code-diff.story.vue`
- `src/stories/code-diff/index.story.vue`
- `src/stories/code-diff/i18n/zh.ts`
- `src/stories/code-diff/i18n/en.ts`
- `src/stories/code-diff/i18n/index.ts`
- `src/stories/approval-card.story.vue`
- `src/stories/approval-card/index.story.vue`
- `src/stories/approval-card/i18n/zh.ts`
- `src/stories/approval-card/i18n/en.ts`
- `src/stories/approval-card/i18n/index.ts`

## Verification

- All inline `useStoryLocale` calls extracted to i18n files
- New `index.story.vue` uses key-based lookups
- Old flat `.story.vue` file removed
- No remaining inline locale labels
