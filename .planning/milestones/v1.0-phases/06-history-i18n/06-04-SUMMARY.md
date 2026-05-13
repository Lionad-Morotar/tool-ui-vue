---
plan: 06-04
phase: 06-history-i18n
completed: 2026-04-13T00:10:00+08:00
status: complete
---

## Plan 06-04: Landing Page + Phase-wide Verification

### Objective
Bilingualize the Landing Page (src/stories/landing.story.vue) and perform phase-wide verification that all 28+ story files have zero hardcoded English user-facing text.

### Tasks Completed
1. **Landing Page hero section** — hero tagline, CTA button bilingualized
2. **Landing Page category cards** — 6 category titles → { zh, en } objects with useStoryLocale in template
3. **Landing Page footer** — "Built by"/"View on" bilingualized
4. **Phase-wide verification** — Zero static Variant titles across all 29 story files

### Key Files
- `src/stories/landing.story.vue` — hero, categories, footer
- `src/stories/image-gallery.story.vue` — 9 missed Variant titles fixed
- `src/stories/tailwind-test.story.vue` — 2 missed Variant titles + missing import

### Verification
- `rg '<Variant title="' src/stories/*.story.vue` → 0 matches
- `rg ':title="useStoryLocale' src/stories/*.story.vue` → 257 matches across 28+ files
- `rg '<h[23][^>]*>[A-Za-z]' src/stories/*.story.vue | grep -v useStoryLocale` → 0 (after tailwind-test fix)

### Self-Check: PASSED
