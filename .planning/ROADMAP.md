# Roadmap: tool-ui-vue Monorepo Refactor

## Overview

Transform tool-ui-vue from a copy-paste component collection into a proper npm package library. Start with monorepo infrastructure, then build the base component layer (Button, Card, Badge, CopyButton) with cva variant system, migrate all 26 tool components to consume those base components, establish the theme system, and finally verify distribution readiness with TypeScript declarations and tree-shaking.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Infrastructure** - pnpm workspace, package scaffolding, build configs
- [ ] **Phase 2: P0 Base Components** - Button (cva + asChild) and Card (sub-components)
- [ ] **Phase 3: P1 Components + Theme System** - Badge, CopyButton, theme tokens and CSS variables
- [ ] **Phase 4: Component Migration** - Migrate 26 tool components to packages/components
- [ ] **Phase 5: Distribution Readiness** - TypeScript declarations, tree-shaking, ESM+CJS, install verification

## Phase Details

### Phase 1: Infrastructure
**Goal**: A working monorepo where packages/core, packages/components, and packages/theme are buildable with pure pnpm scripts
**Depends on**: Nothing (first phase)
**Requirements**: INFRA-01, INFRA-02, INFRA-03, INFRA-04, INFRA-05, INFRA-06
**Success Criteria** (what must be TRUE):
  1. `pnpm install` resolves all workspace packages without errors
  2. `pnpm -r build` successfully builds all three packages (core, components, theme) in dependency order
  3. `pnpm -r typecheck` passes for all packages
  4. Each package has a valid package.json with correct workspace dependencies (e.g., components depends on core via `workspace:*`)
**Plans**: 2 plans

Plans:
- [x] 01-01 — Workspace config + theme package + core package scaffolding
- [x] 01-02 — Components package with workspace:* dependency on core + end-to-end build verification

### Phase 2: P0 Base Components
**Goal**: Button and Card base components are available in @lionad/core and usable by downstream packages
**Depends on**: Phase 1
**Requirements**: BASE-01, BASE-02, BASE-03, BASE-04
**Success Criteria** (what must be TRUE):
  1. Button renders with cva variants (default/destructive/outline/ghost) and sizes (default/sm/lg)
  2. Button asChild mode works -- a child element inherits Button styles without rendering a `<button>` tag
  3. Card renders with Card/CardHeader/CardContent/CardFooter sub-components as a cohesive container
  4. Button and Card are exported from @lionad/core and consumable by other workspace packages
**Plans**: 3 plans

Plans:
- [ ] 02-01 — Button component with cva variants + asChild slot pattern
- [ ] 02-02 — Card component with Card/CardHeader/CardTitle/CardDescription/CardContent/CardFooter sub-components
- [ ] 02-03 — Export Button and Card from @lionad/core barrel file + end-to-end verification

### Phase 3: P1 Components + Theme System
**Goal**: Badge and CopyButton base components complete the core layer, and the theme system provides CSS-variable-driven design tokens with light/dark switching
**Depends on**: Phase 2
**Requirements**: BASE-05, BASE-06, THEME-01, THEME-02, THEME-03
**Success Criteria** (what must be TRUE):
  1. Badge renders with cva variants (default/secondary/destructive/outline)
  2. CopyButton copies text to clipboard and shows icon state transition (copy -> check)
  3. @lionad/theme exposes CSS variables for colors/spacing/radius/shadows via Tailwind v4 @theme directive
  4. Setting `data-theme="dark"` on the document root switches all theme variables to dark values
  5. A consumer can override CSS variables without modifying any package source code
**Plans**: 2 plans

Plans:
- [ ] 03-01 — Badge + CopyButton components in @lionad/core
- [ ] 03-02 — Theme system with CSS variables, data-theme switching, and consumer overridability

### Phase 4: Component Migration
**Goal**: All 26 tool components live in packages/components, consume core base components, and their Zod schemas remain unchanged
**Depends on**: Phase 3
**Requirements**: MIGR-01, MIGR-02, MIGR-03, MIGR-04
**Success Criteria** (what must be TRUE):
  1. All 26 tool components are importable from @lionad/components via named exports
  2. Tool components use core Button/Card/Badge instead of inline Tailwind button/container/badge patterns
  3. All existing Vitest tests pass without modification to test assertions (schemas unchanged)
  4. Each component supports tree-shaking -- importing one component does not bundle others
**Plans**: 5 plans

Plans:
- [x] 04-01 — Add shared infrastructure (contract/schema/parse) to @lionad/core
- [x] 04-02 — Batch migrate 15 simple components (approval-card, audio, citation, code-diff, image, instagram-post, link-preview, linkedin-post, message-draft, order-summary, plan, preferences-panel, progress-tracker, terminal, x-post)
- [ ] 04-03 — Batch migrate 7 medium components (chart, code-block, data-table, option-list, question-flow, stats-display, video) + media utilities
- [ ] 04-04 — Migrate 5 complex components (parameter-slider, image-gallery, item-carousel, geo-map, weather-widget)
- [ ] 04-05 — Final barrel exports, build verification, test suite, tree-shaking check

### Phase 5: Distribution Readiness
**Goal**: @lionad/components is installable via pnpm add and produces correct build output
**Depends on**: Phase 4
**Requirements**: DIST-01, DIST-02, DIST-03
**Success Criteria** (what must be TRUE):
  1. `pnpm add @lionad/components` works in a fresh project (verified via local workspace)
  2. TypeScript consumers get full IntelliSense -- .d.ts files ship for all exported components and types
  3. Build output includes both ESM (.mjs) and CJS (.cjs) entry points
**Plans**: TBD

Plans:
- [ ] 05-01: TBD
- [ ] 05-02: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 -> 2 -> 3 -> 4 -> 5

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Infrastructure | 2/2 | Complete | 2026-04-03 |
| 2. P0 Base Components | 0/3 | Planned | - |
| 3. P1 Components + Theme | 0/2 | Planned | - |
| 4. Component Migration | 0/5 | Planned | - |
| 5. Distribution Readiness | 0/2 | Not started | - |
