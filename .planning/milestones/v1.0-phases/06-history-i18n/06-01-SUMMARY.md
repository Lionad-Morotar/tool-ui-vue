---
plan: 06-01
phase: 06-history-i18n
completed: 2026-04-12T23:45:00+08:00
status: complete
---

## Plan 06-01: Bilingualize 4 core story files

### Objective
Convert terminal, code-block, code-diff, chart from hardcoded English to bilingual useStoryLocale format.

### Tasks Completed
1. **Task 1: Variant titles** — All 51 `title="..."` → `:title="useStoryLocale({ zh, en })"` (15+12+15+9)
2. **Task 2: Headings** — 20 h2/h3 headings → `{{ useStoryLocale({ zh, en }) }}` interpolation, plus chart #docs `<p>` descriptions
3. **Task 3: Props arrays & remaining text** — 38 props descriptions → `{ zh, en }` objects with `useStoryLocale(prop.description)` in template; interactive form labels bilingualized

### Key Files
- `src/stories/terminal.story.vue`
- `src/stories/code-block.story.vue`
- `src/stories/code-diff.story.vue`
- `src/stories/chart.story.vue`

### Verification
- `rg '<Variant title="' src/stories/{terminal,code-block,code-diff,chart}.story.vue` → 0 matches
- `rg ':title="useStoryLocale' src/stories/{terminal,code-block,code-diff,chart}.story.vue` → 51 matches
- `rg "description: '" ... | grep -v 'zh:'` → 0 plain English descriptions
- `rg '<h[23][^>]*>[A-Za-z]' ... | grep -v useStoryLocale` → 0 plain English headings

### Self-Check: PASSED
