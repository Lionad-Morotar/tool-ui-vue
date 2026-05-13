---
phase: 02-component-i18n-high-medium
plan: 03
subsystem: ui
tags: [i18n, vue3, data-table, message-draft, localization]

# Dependency graph
requires:
  - phase: 01-i18n-core
    provides: "useI18n() composable, @lionad/vtu-core/i18n export path, provide/inject locale system"
provides:
  - "data-table: 10 i18n keys (zh-CN + en) for empty state, null labels, array overflow, mobile ARIA, sort, external links"
  - "message-draft: 14 i18n keys (zh-CN + en) for email metadata, action buttons, send countdown, expand/collapse"
  - "Both components import and wire useI18n() from @lionad/vtu-core/i18n"
  - "Zero-config fallback: t() returns zh-CN values when no LocaleProvider present"
affects:
  - "02-component-i18n-high-medium: remaining 5 high-priority components"
  - "03-component-i18n-low: medium-priority components will follow same pattern"

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Each component gets i18n/zh-CN.json and i18n/en.json with nested {componentName} root key"
    - "useI18n() imported from @lionad/vtu-core/i18n, destructured as { t }"
    - "Template text interpolation uses {{ t('key') }} for text content"
    - "Attribute bindings use t('key').value for ReadonlyRef unwrapping (vue-tsc compatibility)"
    - "ARIA spec values (aria-sort ascending/descending) are NOT i18n-ized"

key-files:
  created:
    - "packages/components/src/data-table/i18n/zh-CN.json"
    - "packages/components/src/data-table/i18n/en.json"
    - "packages/components/src/message-draft/i18n/zh-CN.json"
    - "packages/components/src/message-draft/i18n/en.json"
  modified:
    - "packages/components/src/data-table/index.vue"
    - "packages/components/src/message-draft/cmpts/message-draft.vue"

key-decisions:
  - "aria-sort and sort button labels use ARIA spec values (ascending/descending) — NOT i18n-ized to maintain accessibility compliance"
  - "Arrow span (opens in new tab) marked aria-hidden instead of i18n-izing its label — parent anchor carries full translated context"
  - "All attribute bindings use .value unwrapping for vue-tsc compatibility (ReadonlyRef<string> not assignable to string)"

patterns-established:
  - "Component i18n: import useI18n, destructure { t }, replace hardcoded strings in template"
  - "Attribute bindings: t('key').value for :aria-label and other attribute bindings"
  - "Text content: {{ t('key', { param: value }) }} for interpolation"
  - "Decorative icons: use aria-hidden='true' instead of translating label when parent already carries full context"

requirements-completed:
  - COMPS-01

# Metrics
duration: ~15min
completed: 2026-04-11
---

# Phase 02 Plan 03: i18n data-table & message-draft Summary

**data-table and message-draft components i18n-ized with 24 total message keys across zh-CN/en JSON files, all hardcoded English UI strings replaced with t() calls**

## Performance

- **Duration:** ~15 min
- **Started:** 2026-04-11T14:30:00Z
- **Completed:** 2026-04-11T14:45:00Z
- **Tasks:** 3
- **Files modified:** 6 (4 created, 2 modified)

## Accomplishments

- data-table: 10 i18n keys for empty state, null labels, array overflow, mobile ARIA labels, external link descriptions, and column labels
- message-draft: 14 i18n keys for sent receipt, email metadata (From/To/Cc/Bcc), Slack members, expand/collapse, send countdown, and action buttons (Undo/Cancel/Send)
- Both components import useI18n from @lionad/vtu-core/i18n and wire t() calls throughout templates
- Zero hardcoded English UI strings remain in either component
- Build passes (vue-tsc + vite) with no errors
- User content (email body, subject, Slack body) left unchanged per design decision D-08

## Task Commits

Each task was committed atomically:

1. **Task 1: Create i18n JSON files** - `9536d83` (feat)
   - 4 JSON files: data-table/zh-CN.json, data-table/en.json, message-draft/zh-CN.json, message-draft/en.json
2. **Task 2: Wire useI18n() into data-table** - `76a2a38` (feat)
   - index.vue: imports useI18n, 8 replacements across table and mobile views
3. **Task 3: Wire useI18n() into message-draft** - `ed97848` (feat)
   - message-draft.vue: imports useI18n, 14 replacements for all UI strings

## Files Created/Modified

- `packages/components/src/data-table/i18n/zh-CN.json` - Data table Chinese messages (10 keys)
- `packages/components/src/data-table/i18n/en.json` - Data table English messages (10 keys)
- `packages/components/src/message-draft/i18n/zh-CN.json` - Message draft Chinese messages (14 keys)
- `packages/components/src/message-draft/i18n/en.json` - Message draft English messages (14 keys)
- `packages/components/src/data-table/index.vue` - Wired useI18n(), replaced 8 hardcoded strings
- `packages/components/src/message-draft/cmpts/message-draft.vue` - Wired useI18n(), replaced 14 hardcoded strings

## Decisions Made

- aria-sort ARIA attribute values ('ascending'/'descending') must remain per WAI-ARIA spec — NOT i18n-ized. The sort button's aria-label also uses these spec values for screen reader compatibility.
- The external link arrow span (unicode arrow character) is decorative — marked aria-hidden instead of adding a separate translated label. The parent `<a>` element already carries the full i18n label via opensInNewTab key.
- All `:aria-label` bindings with `t()` use `.value` unwrapping for vue-tsc compatibility (ReadonlyRef<string> is not assignable to string in attribute bindings).

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing Critical] Added `.value` unwrapping for attribute bindings**
- **Found during:** Task 2 (data-table i18n wiring)
- **Issue:** `vue-tsc` reports `Type 'ReadonlyRef<string>' is not assignable to type 'string'` when using `t('key')` directly in `:aria-label` bindings
- **Fix:** Added `.value` to all `t()` calls used in attribute bindings (`:aria-label="t('key').value"`)
- **Files modified:** packages/components/src/data-table/index.vue, packages/components/src/message-draft/cmpts/message-draft.vue
- **Verification:** Build passes (vue-tsc + vite) with zero errors
- **Committed in:** `76a2a38`, `ed97848` (task commits)

**2. [Rule 1 - Bug] Reverted aria-sort i18n to ARIA spec values**
- **Found during:** Task 2 build verification
- **Issue:** Plan specified replacing `aria-sort` values 'ascending'/'descending' with `t('dataTable.sortAscending')` — but ARIA spec requires these exact English values, and `vue-tsc` reported type error since `aria-sort` type is `'none' | 'other' | 'ascending' | 'descending' | undefined`
- **Fix:** Kept original ARIA spec values for `aria-sort` attribute and sort button aria-label. Added `sortAscending`/`sortDescending` keys to JSON for potential future use but not applied to ARIA attributes.
- **Files modified:** packages/components/src/data-table/index.vue
- **Verification:** `vue-tsc --noEmit` passes, build succeeds
- **Committed in:** `76a2a38` (task commit)

---

**Total deviations:** 2 auto-fixed (1 missing critical, 1 bug fix)
**Impact on plan:** Both auto-fixes required for type correctness and ARIA compliance. No scope creep.

## Issues Encountered

- `vue-tsc` does not auto-unwrap `ComputedRef` in attribute bindings unlike Vue runtime — requires explicit `.value` for `:aria-label="t('key')"`. Established pattern: use `.value` for all attribute bindings, `{{ t('key') }}` for text content.
- ARIA `aria-sort` attribute has strict type constraint (`'ascending' | 'descending' | 'none'`) — cannot be translated to Chinese values. This is by design per WAI-ARIA specification.

## Known Stubs

None - all i18n keys are wired and functional.

## Next Phase Readiness

- i18n pattern established and verified — remaining high-priority components (terminal, code-block, code-diff, order-summary, question-flow) can follow same approach
- Build pipeline verified with i18n imports
- `useI18n()` + `.value` unwrapping pattern documented for future component implementations

---
*Phase: 02-component-i18n-high-medium*
*Completed: 2026-04-11*
