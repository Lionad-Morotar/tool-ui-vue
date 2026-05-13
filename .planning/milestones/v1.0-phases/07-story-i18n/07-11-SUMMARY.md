---
phase: 07-story-i18n
plan: "11"
subsystem: story-i18n
tags: [i18n, story, migration]
requires: []
provides: [directory-based-story, extracted-i18n]
affects: ["src/stories/order-summary.story.vue", "src/stories/order-summary/index.story.vue", "src/stories/order-summary/i18n/zh.ts", "src/stories/order-summary/i18n/en.ts", "src/stories/order-summary/i18n/index.ts", "src/stories/citation.story.vue", "src/stories/citation/index.story.vue", "src/stories/citation/i18n/zh.ts", "src/stories/citation/i18n/en.ts", "src/stories/citation/i18n/index.ts", "src/stories/audio.story.vue", "src/stories/audio/index.story.vue", "src/stories/audio/i18n/zh.ts", "src/stories/audio/i18n/en.ts", "src/stories/audio/i18n/index.ts", "src/stories/message-draft.story.vue", "src/stories/message-draft/index.story.vue", "src/stories/message-draft/i18n/zh.ts", "src/stories/message-draft/i18n/en.ts", "src/stories/message-draft/i18n/index.ts", "src/stories/code-block.story.vue", "src/stories/code-block/index.story.vue", "src/stories/code-block/i18n/zh.ts", "src/stories/code-block/i18n/en.ts", "src/stories/code-block/i18n/index.ts", "src/stories/image.story.vue", "src/stories/image/index.story.vue", "src/stories/image/i18n/zh.ts", "src/stories/image/i18n/en.ts", "src/stories/image/i18n/index.ts"]
tech-stack:
  added: []
patterns:
  - Directory-based story structure with i18n extraction
  - Key-based useStoryLocale lookups
key-files:
  created:
    - src/stories/order-summary/i18n/zh.ts
    - src/stories/order-summary/i18n/en.ts
    - src/stories/order-summary/i18n/index.ts
    - src/stories/citation/i18n/zh.ts
    - src/stories/citation/i18n/en.ts
    - src/stories/citation/i18n/index.ts
    - src/stories/audio/i18n/zh.ts
    - src/stories/audio/i18n/en.ts
    - src/stories/audio/i18n/index.ts
    - src/stories/message-draft/i18n/zh.ts
    - src/stories/message-draft/i18n/en.ts
    - src/stories/message-draft/i18n/index.ts
    - src/stories/code-block/i18n/zh.ts
    - src/stories/code-block/i18n/en.ts
    - src/stories/code-block/i18n/index.ts
    - src/stories/image/i18n/zh.ts
    - src/stories/image/i18n/en.ts
    - src/stories/image/i18n/index.ts
  modified:
    - src/stories/order-summary.story.vue
    - src/stories/order-summary/index.story.vue
    - src/stories/citation.story.vue
    - src/stories/citation/index.story.vue
    - src/stories/audio.story.vue
    - src/stories/audio/index.story.vue
    - src/stories/message-draft.story.vue
    - src/stories/message-draft/index.story.vue
    - src/stories/code-block.story.vue
    - src/stories/code-block/index.story.vue
    - src/stories/image.story.vue
    - src/stories/image/index.story.vue
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

# Phase 07 Plan 11 Summary

Migrate order-summary, citation, audio, message-draft, code-block, and image stories into directory-based structures with extracted i18n files.

## Files

- `src/stories/order-summary.story.vue`
- `src/stories/order-summary/index.story.vue`
- `src/stories/order-summary/i18n/zh.ts`
- `src/stories/order-summary/i18n/en.ts`
- `src/stories/order-summary/i18n/index.ts`
- `src/stories/citation.story.vue`
- `src/stories/citation/index.story.vue`
- `src/stories/citation/i18n/zh.ts`
- `src/stories/citation/i18n/en.ts`
- `src/stories/citation/i18n/index.ts`
- `src/stories/audio.story.vue`
- `src/stories/audio/index.story.vue`
- `src/stories/audio/i18n/zh.ts`
- `src/stories/audio/i18n/en.ts`
- `src/stories/audio/i18n/index.ts`
- `src/stories/message-draft.story.vue`
- `src/stories/message-draft/index.story.vue`
- `src/stories/message-draft/i18n/zh.ts`
- `src/stories/message-draft/i18n/en.ts`
- `src/stories/message-draft/i18n/index.ts`
- `src/stories/code-block.story.vue`
- `src/stories/code-block/index.story.vue`
- `src/stories/code-block/i18n/zh.ts`
- `src/stories/code-block/i18n/en.ts`
- `src/stories/code-block/i18n/index.ts`
- `src/stories/image.story.vue`
- `src/stories/image/index.story.vue`
- `src/stories/image/i18n/zh.ts`
- `src/stories/image/i18n/en.ts`
- `src/stories/image/i18n/index.ts`

## Verification

- All inline `useStoryLocale` calls extracted to i18n files
- New `index.story.vue` uses key-based lookups
- Old flat `.story.vue` file removed
- No remaining inline locale labels
