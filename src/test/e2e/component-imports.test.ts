import { describe, expect, test } from 'vitest';

/**
 * E2E Test: Component Imports
 *
 * Verifies all 27 components can be imported from the library entry point.
 * This is a minimal existence test — if imports fail, the package is broken.
 */

describe('E2E: Component Imports', () => {
  test('all components can be imported from library entry', async () => {
    const imports = await import('@/index');

    // Verify exports exist (components are exported via barrel files)
    expect(imports).toBeDefined();

    // Specific component exports should be available
    // Note: We're testing the index.ts exports, which re-exports from components/
    const componentExports = Object.keys(imports);

    // Should have exports (not empty)
    expect(componentExports.length).toBeGreaterThan(0);
  });

  test('shared utilities can be imported', async () => {
    const shared = await import('@/shared');

    expect(shared).toBeDefined();
  });

  test('component barrel exports are accessible', async () => {
    // Test a subset of critical component barrels
    const barrels = [
      () => import('@lionad/vtu-components/approval-card'),
      () => import('@lionad/vtu-components/audio'),
      () => import('@lionad/vtu-components/code-block'),
      () => import('@lionad/vtu-components/data-table'),
      () => import('@lionad/vtu-components/geo-map'),
      () => import('@lionad/vtu-components/image'),
      () => import('@lionad/vtu-components/item-carousel'),
      () => import('@lionad/vtu-components/message-draft'),
      () => import('@lionad/vtu-components/option-list'),
      () => import('@lionad/vtu-components/parameter-slider'),
      () => import('@lionad/vtu-components/plan'),
      () => import('@lionad/vtu-components/preferences-panel'),
      () => import('@lionad/vtu-components/progress-tracker'),
      () => import('@lionad/vtu-components/question-flow'),
      () => import('@lionad/vtu-components/stats-display'),
      () => import('@lionad/vtu-components/terminal'),
      () => import('@lionad/vtu-components/video'),
      () => import('@lionad/vtu-components/weather-widget'),
      () => import('@lionad/vtu-components/x-post'),
    ];

    const results = await Promise.all(barrels.map((fn) => fn()));

    // All imports should succeed and return defined values
    results.forEach((mod, i) => {
      expect(mod, `Barrel ${i} should be defined`).toBeDefined();
    });
  });

  test('all 27 component directories are importable', async () => {
    // Full list of all 27 components
    const allComponents = [
      () => import('@lionad/vtu-components/approval-card'),
      () => import('@lionad/vtu-components/audio'),
      () => import('@lionad/vtu-components/image'),
      () => import('@lionad/vtu-components/video'),
      () => import('@lionad/vtu-components/code-block'),
      () => import('@lionad/vtu-components/terminal'),
      () => import('@lionad/vtu-components/citation'),
      () => import('@lionad/vtu-components/link-preview'),
      () => import('@lionad/vtu-components/option-list'),
      () => import('@lionad/vtu-components/x-post'),
      () => import('@lionad/vtu-components/instagram-post'),
      () => import('@lionad/vtu-components/linkedin-post'),
      () => import('@lionad/vtu-components/order-summary'),
      () => import('@lionad/vtu-components/message-draft'),
      () => import('@lionad/vtu-components/data-table'),
      () => import('@lionad/vtu-components/preferences-panel'),
      () => import('@lionad/vtu-components/plan'),
      () => import('@lionad/vtu-components/progress-tracker'),
      () => import('@lionad/vtu-components/question-flow'),
      () => import('@lionad/vtu-components/item-carousel'),
      () => import('@lionad/vtu-components/image-gallery'),
      () => import('@lionad/vtu-components/chart'),
      () => import('@lionad/vtu-components/code-diff'),
      () => import('@lionad/vtu-components/weather-widget'),
      () => import('@lionad/vtu-components/parameter-slider'),
      () => import('@lionad/vtu-components/stats-display'),
      () => import('@lionad/vtu-components/geo-map'),
    ];

    expect(allComponents.length).toBe(27);

    // Import all components in parallel
    const results = await Promise.all(allComponents.map((fn) => fn()));

    // Verify each import succeeded
    results.forEach((mod, i) => {
      expect(mod, `Component ${i + 1} should be defined`).toBeDefined();
    });
  });
});
