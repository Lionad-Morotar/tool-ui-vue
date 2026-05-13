---
phase: 07-story-i18n
plan: "10"
subsystem: story-i18n
tags: [i18n, story, migration]
requires: []
provides: [directory-based-story, extracted-i18n]
affects: ["src/stories/terminal.story.vue", "src/stories/terminal/index.story.vue", "src/stories/terminal/i18n/zh.ts", "src/stories/terminal/i18n/en.ts", "src/stories/terminal/i18n/index.ts", "src/stories/image-gallery.story.vue", "src/stories/image-gallery/index.story.vue", "src/stories/image-gallery/i18n/zh.ts", "src/stories/image-gallery/i18n/en.ts", "src/stories/image-gallery/i18n/index.ts", "src/stories/video.story.vue", "src/stories/video/index.story.vue", "src/stories/video/i18n/zh.ts", "src/stories/video/i18n/en.ts", "src/stories/video/i18n/index.ts"]
tech-stack:
  added: []
patterns:
  - Directory-based story structure with i18n extraction
  - Key-based useStoryLocale lookups
key-files:
  created:
    - src/stories/terminal/i18n/zh.ts
    - src/stories/terminal/i18n/en.ts
    - src/stories/terminal/i18n/index.ts
    - src/stories/image-gallery/i18n/zh.ts
    - src/stories/image-gallery/i18n/en.ts
    - src/stories/image-gallery/i18n/index.ts
    - src/stories/video/i18n/zh.ts
    - src/stories/video/i18n/en.ts
    - src/stories/video/i18n/index.ts
  modified:
    - src/stories/terminal.story.vue
    - src/stories/terminal/index.story.vue
    - src/stories/image-gallery.story.vue
    - src/stories/image-gallery/index.story.vue
    - src/stories/video.story.vue
    - src/stories/video/index.story.vue
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

# Phase 07 Plan 10 Summary

Migrate terminal, image-gallery, and video stories into directory-based structures with extracted i18n files.

## Files

- `src/stories/terminal.story.vue`
- `src/stories/terminal/index.story.vue`
- `src/stories/terminal/i18n/zh.ts`
- `src/stories/terminal/i18n/en.ts`
- `src/stories/terminal/i18n/index.ts`
- `src/stories/image-gallery.story.vue`
- `src/stories/image-gallery/index.story.vue`
- `src/stories/image-gallery/i18n/zh.ts`
- `src/stories/image-gallery/i18n/en.ts`
- `src/stories/image-gallery/i18n/index.ts`
- `src/stories/video.story.vue`
- `src/stories/video/index.story.vue`
- `src/stories/video/i18n/zh.ts`
- `src/stories/video/i18n/en.ts`
- `src/stories/video/i18n/index.ts`

## Verification

- All inline `useStoryLocale` calls extracted to i18n files
- New `index.story.vue` uses key-based lookups
- Old flat `.story.vue` file removed
- No remaining inline locale labels
