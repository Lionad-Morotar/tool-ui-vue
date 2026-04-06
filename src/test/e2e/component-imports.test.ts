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
      () => import('@lionad/components/approval-card'),
      () => import('@lionad/components/audio'),
      () => import('@lionad/components/code-block'),
      () => import('@lionad/components/data-table'),
      () => import('@lionad/components/geo-map'),
      () => import('@lionad/components/image'),
      () => import('@lionad/components/item-carousel'),
      () => import('@lionad/components/message-draft'),
      () => import('@lionad/components/option-list'),
      () => import('@lionad/components/parameter-slider'),
      () => import('@lionad/components/plan'),
      () => import('@lionad/components/preferences-panel'),
      () => import('@lionad/components/progress-tracker'),
      () => import('@lionad/components/question-flow'),
      () => import('@lionad/components/stats-display'),
      () => import('@lionad/components/terminal'),
      () => import('@lionad/components/video'),
      () => import('@lionad/components/weather-widget'),
      () => import('@lionad/components/x-post'),
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
      () => import('@lionad/components/approval-card'),
      () => import('@lionad/components/audio'),
      () => import('@lionad/components/image'),
      () => import('@lionad/components/video'),
      () => import('@lionad/components/code-block'),
      () => import('@lionad/components/terminal'),
      () => import('@lionad/components/citation'),
      () => import('@lionad/components/link-preview'),
      () => import('@lionad/components/option-list'),
      () => import('@lionad/components/x-post'),
      () => import('@lionad/components/instagram-post'),
      () => import('@lionad/components/linkedin-post'),
      () => import('@lionad/components/order-summary'),
      () => import('@lionad/components/message-draft'),
      () => import('@lionad/components/data-table'),
      () => import('@lionad/components/preferences-panel'),
      () => import('@lionad/components/plan'),
      () => import('@lionad/components/progress-tracker'),
      () => import('@lionad/components/question-flow'),
      () => import('@lionad/components/item-carousel'),
      () => import('@lionad/components/image-gallery'),
      () => import('@lionad/components/chart'),
      () => import('@lionad/components/code-diff'),
      () => import('@lionad/components/weather-widget'),
      () => import('@lionad/components/parameter-slider'),
      () => import('@lionad/components/stats-display'),
      () => import('@lionad/components/geo-map'),
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
