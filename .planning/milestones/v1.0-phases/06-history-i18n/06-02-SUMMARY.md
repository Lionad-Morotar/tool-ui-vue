---
plan: 06-02
phase: 06-history-i18n
completed: 2026-04-12T23:50:00+08:00
status: complete
---

## Plan 06-02: Bilingualize 9 medium-complexity story files

### Objective
Convert 9 story files — data-table, preferences-panel, geo-map, weather-widget, x-post, question-flow, linkedin-post, link-preview, instagram-post — Variant titles and description text to bilingual format.

### Tasks Completed
1. **Variant titles** — All 79 `title="..."` → `:title="useStoryLocale({ zh, en })"`
2. **Template text** — All `<p>` tags already use `{{ subtitle }}` or `组件说明 / Component description` pattern

### Key Files
- `src/stories/data-table.story.vue` (10)
- `src/stories/preferences-panel.story.vue` (8)
- `src/stories/geo-map.story.vue` (15)
- `src/stories/weather-widget.story.vue` (11)
- `src/stories/x-post.story.vue` (9)
- `src/stories/question-flow.story.vue` (9)
- `src/stories/linkedin-post.story.vue` (9)
- `src/stories/link-preview.story.vue` (9)
- `src/stories/instagram-post.story.vue` (9)

### Verification
- `rg '<Variant title="' ...` → 0 matches
- `rg ':title="useStoryLocale' ...` → 82 matches (total across 9 files)
- No hardcoded English headings in template text

### Self-Check: PASSED
