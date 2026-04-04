---
phase: 01-infrastructure
plan: 01
subsystem: infra
tags: [pnpm-workspace, monorepo, vite, design-tokens, css-variables]

requires: []
provides:
  - pnpm workspace configuration with packages/* discovery
  - "@lionad/theme package with design tokens CSS"
  - "@lionad/core package with cn utility (ESM+CJS+.d.ts)"
  - Workspace-aware root build/typecheck scripts
affects: [02-base-components, 03-tool-components]

tech-stack:
  added: [vite@8, vite-plugin-dts@4, clsx@2, tailwind-merge@2]
  patterns: [pnpm-workspace, vite-library-mode, css-design-tokens]

key-files:
  created:
    - packages/theme/package.json
    - packages/theme/tsconfig.json
    - packages/theme/vite.config.ts
    - packages/theme/src/index.ts
    - packages/theme/src/tokens.css
    - packages/core/package.json
    - packages/core/tsconfig.json
    - packages/core/tsconfig.node.json
    - packages/core/vite.config.ts
    - packages/core/src/index.ts
    - packages/core/src/utils.ts
  modified:
    - pnpm-workspace.yaml
    - package.json

key-decisions:
  - "Root package.json marked private to prevent accidental publish"
  - "Root build script uses --filter='./packages/*' to only build workspace packages"
  - "theme package copies tokens.css via cp in build script (lightningcss @theme warnings are cosmetic)"
  - "core package externalizes vue as peer dependency, bundles clsx and tailwind-merge"

patterns-established:
  - "Vite library mode: lib entry with es+cjs formats, vite-plugin-dts for .d.ts generation"
  - "Workspace package layout: package.json + tsconfig.json + vite.config.ts + src/"
  - "Design tokens source: packages/theme/src/tokens.css with @import tailwindcss + @theme + .dark"

requirements-completed: [INFRA-01, INFRA-02, INFRA-04, INFRA-06]

duration: 8min
completed: 2026-04-03
---

# Phase 01: Infrastructure Summary

**pnpm monorepo workspace with @lionad/theme (CSS design tokens) and @lionad/core (cn utility with ESM/CJS/.d.ts output)**

## Performance

- **Duration:** ~8 min
- **Started:** 2026-04-03T06:35:00Z
- **Completed:** 2026-04-03T06:43:00Z
- **Tasks:** 3
- **Files modified:** 13

## Accomplishments
- Configured pnpm workspace with `packages/*` discovery
- Scaffolded `@lionad/theme` with full design tokens (30+ CSS variables, light + dark mode)
- Scaffolded `@lionad/core` with Vite library mode build outputting ESM + CJS + .d.ts
- Root `pnpm build` successfully builds both workspace packages in dependency order

## Files Created/Modified
- `pnpm-workspace.yaml` - Added `packages: ['packages/*']` for workspace discovery
- `package.json` - Marked private, added workspace build/typecheck scripts, removed publish fields
- `packages/theme/package.json` - Theme package manifest with CSS export
- `packages/theme/tsconfig.json` - Minimal TS config for pure CSS+re-export package
- `packages/theme/vite.config.ts` - Vite lib mode config for theme
- `packages/theme/src/index.ts` - Re-exports tokens.css
- `packages/theme/src/tokens.css` - Canonical design tokens (migrated from src/stories/_shared/tailwind.css)
- `packages/core/package.json` - Core package manifest with peer vue, deps clsx+tailwind-merge
- `packages/core/tsconfig.json` - Full TS config with strict mode matching root
- `packages/core/tsconfig.node.json` - Node config for vite.config.ts
- `packages/core/vite.config.ts` - Vite lib mode with vue plugin, dts plugin, vue externalized
- `packages/core/src/index.ts` - Exports cn utility
- `packages/core/src/utils.ts` - cn function (clsx + tailwind-merge wrapper)

## Decisions Made
- Root marked `private: true` to prevent accidental npm publish during monorepo migration
- Root `build` script uses `--filter='./packages/*'` to skip root itself (root vite.config.ts stays for legacy build)
- Theme build uses `cp src/tokens.css dist/tokens.css` post-build step to provide raw CSS import path
- Core bundles clsx and tailwind-merge (small, stable deps); externalizes vue (peer dep)

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

- lightningcss (Vite 8 default minifier) emits warnings about unknown `@theme` and `@tailwind` at-rules. These are cosmetic only -- Tailwind CSS v4 processes these directives and lightningcss passes them through. No functional impact.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- Both workspace packages build independently and via `pnpm build`
- Ready for Plan 01-02: scaffold packages/components with tool component migrations
- Root `src/` still intact for legacy builds during migration period

---
*Phase: 01-infrastructure*
*Completed: 2026-04-03*
