---
phase: 07-story-i18n
plan: "01"
subsystem: story-i18n
tags: [i18n, story, useStoryLocale, histoire]
requires: []
provides: [key-based-useStoryLocale, directory-story-paths, link-preview-migration]
affects: [src/stories/_shared/use-story-locale.ts, histoire.config.ts, src/stories/link-preview]
tech-stack:
  added: []
patterns:
  - Key-based i18n lookup alongside legacy label objects
  - Directory-based story structure with extracted i18n files
key-files:
  created:
    - src/stories/link-preview/i18n/zh.ts
    - src/stories/link-preview/i18n/en.ts
    - src/stories/link-preview/i18n/index.ts
    - src/stories/link-preview/index.story.vue
  modified:
    - src/stories/_shared/use-story-locale.ts
    - src/stories/_shared/index.ts
    - histoire.config.ts
    - src/stories/_shared/histoire-setup.ts
key-decisions:
  - "Backward compatibility: useStoryLocale still accepts StoryLocaleLabels directly"
  - "Histoire config supports both index.story.vue and .story.vue during migration"
  - "link-preview serves as the canonical reference for all remaining migrations"
requirements-completed:
  - STORY-STRUCT-01
  - STORY-STRUCT-02
  - STORY-STRUCT-03
  - STORY-STRUCT-04
duration: "5 min"
completed: "2026-04-13"
---

# Phase 07 Plan 01: Foundation + Reference Migration Summary

Upgraded `useStoryLocale` to support key-based message lookup while preserving full backward compatibility with existing `StoryLocaleLabels`. Updated Histoire configuration to recognize directory-based story paths (`*/index.story.vue`) alongside the legacy flat pattern. Migrated `link-preview` as the canonical reference pattern for all remaining story migrations.

## What Changed

- **`src/stories/_shared/use-story-locale.ts`**: Added `StoryLocaleMessages` interface, `getPath` helper, and extended `useStoryLocale` signature to `(source: StoryLocaleLabels | string, messages?: { zh; en })`.
- **`src/stories/_shared/index.ts`**: Exported `StoryLocaleMessages` type.
- **`histoire.config.ts`**: Updated `tree.groups[].include` to match `/${story}/index.story.vue` in addition to `${story}.story.vue`.
- **`src/stories/_shared/histoire-setup.ts`**: Updated root redirect hash to `src-stories-landing-index-story-vue`.
- **`src/stories/link-preview/`**: Migrated to directory structure with extracted `i18n/zh.ts`, `i18n/en.ts`, `i18n/index.ts`, and `index.story.vue` using key-based lookups.

## Commits

1. `19bb7e1` feat(07-01): upgrade useStoryLocale to support key-based lookup
2. `2c5146e` feat(07-01): update Histoire config for directory-based story paths
3. `17d1711` feat(07-01): migrate link-preview to directory structure with extracted i18n

## Verification

- Key-based API compiles and coexists with legacy labels.
- Histoire tree matching covers both old and new paths.
- link-preview old flat file removed; new directory files present.

## Next

Ready for Wave 2: bulk migration of remaining 11 story files.
