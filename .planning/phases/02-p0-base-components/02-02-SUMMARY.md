---
phase: 02-p0-base-components
plan: 02-02
status: complete
wave: 1
---

## Summary: Card Component with Sub-components

### What was done

Implemented the Card component system with 6 sub-components following the reference React Card pattern from tool-ui.

### Files created

| File | Purpose |
|------|---------|
| `packages/core/src/components/card/index.vue` | Card root container component |
| `packages/core/src/components/card/CardHeader.vue` | CardHeader with grid layout |
| `packages/core/src/components/card/CardTitle.vue` | CardTitle text element |
| `packages/core/src/components/card/CardDescription.vue` | CardDescription muted text |
| `packages/core/src/components/card/CardContent.vue` | CardContent body area |
| `packages/core/src/components/card/CardFooter.vue` | CardFooter flex footer |
| `packages/core/src/components/card/index.ts` | Barrel exports for all 6 components |

### Component details

Each sub-component follows the same pattern:
- `<script setup lang="ts">` with typed `class?` prop
- `defineOptions({ name, inheritAttrs: false })` for proper component identification and attr forwarding
- `data-slot` attribute for identification
- `cn()` utility for class merging
- `v-bind="$attrs"` for forwarding remaining attributes

### Base classes per component

| Component | Base classes |
|-----------|-------------|
| Card | `bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm` |
| CardHeader | `grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6` |
| CardTitle | `leading-none font-semibold` |
| CardDescription | `text-muted-foreground text-sm` |
| CardContent | `px-6` |
| CardFooter | `flex items-center px-6 [.border-t]:pt-6` |

### Verification

- `pnpm typecheck` passes
- `pnpm build` succeeds across all packages
- All 6 components export from `card/index.ts`
- CSS variable references (bg-card, text-card-foreground, text-muted-foreground) ready for theme integration

### Notes

- Components are NOT yet exported from `packages/core/src/index.ts` -- that happens in wave 2 (02-03 barrel update)
- Decision: separate `.vue` files per component instead of virtual module queries, for build reliability
