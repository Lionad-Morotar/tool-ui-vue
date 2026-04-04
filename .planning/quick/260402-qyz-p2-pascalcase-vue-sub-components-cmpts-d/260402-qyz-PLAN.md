# Quick Task 260402-qyz: P2 PascalCase Vue sub-components → cmpts/ dir + kebab-case naming

## Goal

Move 14 PascalCase Vue sub-components from component root directories into `cmpts/` subdirectories, rename them to kebab-case, and update all internal/external imports and barrel exports.

## Must Haves

- 14 `cmpts/` directories created (including existing `.example/cmpts`)
- 14 PascalCase `.vue` files moved to `cmpts/` and renamed to kebab-case
- No PascalCase `.vue` files remain in component root directories
- All `index.vue` import paths updated
- All `index.ts` export paths updated
- All `*.test.ts` import paths updated
- Internal cross-references within `cmpts/` use relative paths (no `cmpts/` prefix)
- `npx tsc --noEmit` passes
- `npx vitest run` passes

## Tasks

### Task 1: Agent A — image-gallery/

**Files touched:**
- `src/components/image-gallery/GalleryGrid.vue` → `src/components/image-gallery/cmpts/gallery-grid.vue`
- `src/components/image-gallery/GalleryImageCard.vue` → `src/components/image-gallery/cmpts/gallery-image-card.vue`
- `src/components/image-gallery/GalleryLightbox.vue` → `src/components/image-gallery/cmpts/gallery-lightbox.vue`
- `src/components/image-gallery/index.vue`
- `src/components/image-gallery/index.ts`
- `src/components/image-gallery/index.test.ts`

**Action:**
1. `mkdir src/components/image-gallery/cmpts`
2. `git mv` the three `.vue` files into `cmpts/` with kebab-case names
3. Update imports in `index.vue`
4. Update exports in `index.ts`
5. Update imports in `index.test.ts`
6. Update internal import in `cmpts/gallery-grid.vue` (`./GalleryImageCard.vue` → `./gallery-image-card.vue`)

**Verify:**
- `find src/components/image-gallery -name "*.vue" | grep -v index.vue | grep -v cmpts` returns empty
- `grep -r "GalleryGrid.vue\|GalleryImageCard.vue\|GalleryLightbox.vue" src/components/image-gallery/` returns empty (except git history)

### Task 2: Agent B — geo-map/ + citation/ + stats-display/

**Files touched:**
- `src/components/geo-map/GeoMapEngine.vue` → `cmpts/geo-map-engine.vue`
- `src/components/geo-map/GeoMapOverlays.vue` → `cmpts/geo-map-overlays.vue`
- `src/components/geo-map/index.vue`, `index.ts`, `index.test.ts`
- `src/components/citation/CitationList.vue` → `cmpts/citation-list.vue`
- `src/components/citation/index.vue`, `index.ts`, `CitationList.test.ts`
- `src/components/stats-display/Sparkline.vue` → `cmpts/sparkline.vue`
- `src/components/stats-display/index.vue`, `index.ts`, `SparkLine.test.ts`

**Action:**
1. Create `cmpts/` in each directory
2. `git mv` each PascalCase file into `cmpts/` with kebab-case name
3. Update `index.vue`, `index.ts`, and test file imports/exports in all three directories
4. Update internal import in `cmpts/geo-map-engine.vue` (`./GeoMapOverlays.vue` → `./geo-map-overlays.vue`)

**Verify:**
- Same pattern as Task 1 for all three directories

### Task 3: Agent C — item-carousel/ + linkedin-post/ + message-draft/

**Files touched:**
- `src/components/item-carousel/ItemCard.vue` → `cmpts/item-card.vue`
- `src/components/item-carousel/ItemCarousel.vue` → `cmpts/item-carousel.vue`
- `src/components/item-carousel/index.vue`, `index.test.ts`
- `src/components/linkedin-post/LinkedInPost.vue` → `cmpts/linkedin-post.vue`
- `src/components/linkedin-post/index.vue`, `index.ts`, `LinkedInPost.test.ts`
- `src/components/message-draft/MessageDraft.vue` → `cmpts/message-draft.vue`
- `src/components/message-draft/index.vue`, `index.ts`, `MessageDraft.test.ts`

**Action:**
1. Create `cmpts/` in each directory
2. `git mv` each PascalCase file into `cmpts/` with kebab-case name
3. Update `index.vue`, `index.ts`, and test file imports/exports
4. Check E2E test `src/test/e2e/component-mounts.test.ts` — it uses barrel imports (`@/components/xxx`) so path should not change, but verify

**Verify:**
- Same pattern as Task 1 for all three directories

### Task 4: Agent D — weather-widget/

**Files touched:**
- `src/components/weather-widget/EffectCompositor.vue` → `cmpts/effect-compositor.vue`
- `src/components/weather-widget/WeatherDataOverlay.vue` → `cmpts/weather-data-overlay.vue`
- `src/components/weather-widget/WeatherEffectsCanvas.vue` → `cmpts/weather-effects-canvas.vue`
- `src/components/weather-widget/index.vue`, `index.ts`, `index.test.ts`
- `src/components/weather-widget/EffectCompositor.test.ts`
- `src/components/weather-widget/WeatherDataOverlay.test.ts`
- `src/components/weather-widget/weather-widget.perf.test.ts`

**Action:**
1. Create `cmpts/`
2. `git mv` the three `.vue` files into `cmpts/` with kebab-case names
3. Update imports in `index.vue`
4. Update exports in `index.ts` (if any)
5. Update imports in all test files
6. Update internal references between the three sub-components if any

**Verify:**
- Same pattern as Task 1

## Cross-agent Notes

- **No file overlap** between agents — safe to run in parallel.
- **Use `git mv`** so git recognizes renames rather than delete+create.
- **Case sensitivity:** macOS is case-insensitive by default. `Sparkline.vue` → `sparkline.vue` may require a two-step rename if git mv complains.
- After all agents finish, run global verification:
  - `find src/components -type d -name "cmpts" | wc -l` should return 14
  - `find src/components -name "*.vue" | grep -E "[A-Z]" | grep -v index.vue` should return empty
  - `npx tsc --noEmit`
  - `npx vitest run`
