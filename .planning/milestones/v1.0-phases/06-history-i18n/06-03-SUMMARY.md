---
plan: 06-03
phase: 06-history-i18n
completed: 2026-04-13T00:05:00+08:00
status: complete
---

## Plan 06-03: Bilingualize 13 remaining story files

### Objective
Convert remaining 13 story files — citation, item-carousel, order-summary, progress-tracker, video, audio, stats-display, message-draft, image, approval-card, plan, parameter-slider, option-list — Variant titles to bilingual format.

### Tasks Completed
1. **Variant titles** — All 94 `title="..."` → `:title="useStoryLocale({ zh, en })"`
2. **Template text** — All files already use `组件说明 / Component description` or `{{ subtitle }}` pattern

### Key Files (13)
- citation (12), item-carousel (11), order-summary (8), progress-tracker (9)
- video (8), audio (6), stats-display (8), message-draft (7)
- image (8), approval-card (8), plan (7), parameter-slider (7), option-list (7)

### Verification
- `rg '<Variant title="' ...` → 0 matches across all 13 files

### Self-Check: PASSED
