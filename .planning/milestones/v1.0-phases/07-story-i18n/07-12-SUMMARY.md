---
phase: 07-story-i18n
plan: "12"
subsystem: story-i18n
tags: [i18n, story, migration]
requires: []
provides: [directory-based-story, extracted-i18n]
affects: ["src/stories/option-list.story.vue", "src/stories/option-list/index.story.vue", "src/stories/option-list/i18n/zh.ts", "src/stories/option-list/i18n/en.ts", "src/stories/option-list/i18n/index.ts", "src/stories/x-post.story.vue", "src/stories/x-post/index.story.vue", "src/stories/x-post/i18n/zh.ts", "src/stories/x-post/i18n/en.ts", "src/stories/x-post/i18n/index.ts", "src/stories/linkedin-post.story.vue", "src/stories/linkedin-post/index.story.vue", "src/stories/linkedin-post/i18n/zh.ts", "src/stories/linkedin-post/i18n/en.ts", "src/stories/linkedin-post/i18n/index.ts", "src/stories/instagram-post.story.vue", "src/stories/instagram-post/index.story.vue", "src/stories/instagram-post/i18n/zh.ts", "src/stories/instagram-post/i18n/en.ts", "src/stories/instagram-post/i18n/index.ts", "src/stories/landing.story.vue", "src/stories/landing/index.story.vue", "src/stories/landing/i18n/zh.ts", "src/stories/landing/i18n/en.ts", "src/stories/landing/i18n/index.ts", "src/stories/_shared/histoire-setup.ts"]
tech-stack:
  added: []
patterns:
  - Directory-based story structure with i18n extraction
  - Key-based useStoryLocale lookups
key-files:
  created:
    - src/stories/option-list/i18n/zh.ts
    - src/stories/option-list/i18n/en.ts
    - src/stories/option-list/i18n/index.ts
    - src/stories/x-post/i18n/zh.ts
    - src/stories/x-post/i18n/en.ts
    - src/stories/x-post/i18n/index.ts
    - src/stories/linkedin-post/i18n/zh.ts
    - src/stories/linkedin-post/i18n/en.ts
    - src/stories/linkedin-post/i18n/index.ts
    - src/stories/instagram-post/i18n/zh.ts
    - src/stories/instagram-post/i18n/en.ts
    - src/stories/instagram-post/i18n/index.ts
    - src/stories/landing/i18n/zh.ts
    - src/stories/landing/i18n/en.ts
    - src/stories/landing/i18n/index.ts
    - src/stories/_shared/histoire-setup.ts
  modified:
    - src/stories/option-list.story.vue
    - src/stories/option-list/index.story.vue
    - src/stories/x-post.story.vue
    - src/stories/x-post/index.story.vue
    - src/stories/linkedin-post.story.vue
    - src/stories/linkedin-post/index.story.vue
    - src/stories/instagram-post.story.vue
    - src/stories/instagram-post/index.story.vue
    - src/stories/landing.story.vue
    - src/stories/landing/index.story.vue
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

# Phase 07 Plan 12 Summary

Migrate the remaining low-density stories (option-list, x-post, linkedin-post, instagram-post) and the landing page. Update landing hrefs to match the new directory-based Histoire story paths. Perform final phase-wide verification.

## Files

- `src/stories/option-list.story.vue`
- `src/stories/option-list/index.story.vue`
- `src/stories/option-list/i18n/zh.ts`
- `src/stories/option-list/i18n/en.ts`
- `src/stories/option-list/i18n/index.ts`
- `src/stories/x-post.story.vue`
- `src/stories/x-post/index.story.vue`
- `src/stories/x-post/i18n/zh.ts`
- `src/stories/x-post/i18n/en.ts`
- `src/stories/x-post/i18n/index.ts`
- `src/stories/linkedin-post.story.vue`
- `src/stories/linkedin-post/index.story.vue`
- `src/stories/linkedin-post/i18n/zh.ts`
- `src/stories/linkedin-post/i18n/en.ts`
- `src/stories/linkedin-post/i18n/index.ts`
- `src/stories/instagram-post.story.vue`
- `src/stories/instagram-post/index.story.vue`
- `src/stories/instagram-post/i18n/zh.ts`
- `src/stories/instagram-post/i18n/en.ts`
- `src/stories/instagram-post/i18n/index.ts`
- `src/stories/landing.story.vue`
- `src/stories/landing/index.story.vue`
- `src/stories/landing/i18n/zh.ts`
- `src/stories/landing/i18n/en.ts`
- `src/stories/landing/i18n/index.ts`
- `src/stories/_shared/histoire-setup.ts`

## Verification

- All inline `useStoryLocale` calls extracted to i18n files
- New `index.story.vue` uses key-based lookups
- Old flat `.story.vue` file removed
- No remaining inline locale labels
