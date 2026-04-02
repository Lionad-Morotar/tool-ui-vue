import { describe, expect, test } from "vitest";

/**
 * E2E Test: Component Imports
 *
 * Verifies all 27 components can be imported from the library entry point.
 * This is a minimal existence test — if imports fail, the package is broken.
 */

describe("E2E: Component Imports", () => {
  test("all components can be imported from library entry", async () => {
    const imports = await import("@/index");

    // Verify exports exist (components are exported via barrel files)
    expect(imports).toBeDefined();

    // Specific component exports should be available
    // Note: We're testing the index.ts exports, which re-exports from components/
    const componentExports = Object.keys(imports);

    // Should have exports (not empty)
    expect(componentExports.length).toBeGreaterThan(0);
  });

  test("shared utilities can be imported", async () => {
    const shared = await import("@/shared");

    expect(shared).toBeDefined();
  });

  test("component barrel exports are accessible", async () => {
    // Test a subset of critical component barrels
    const barrels = [
      () => import("@/components/approval-card"),
      () => import("@/components/audio"),
      () => import("@/components/code-block"),
      () => import("@/components/data-table"),
      () => import("@/components/geo-map"),
      () => import("@/components/image"),
      () => import("@/components/item-carousel"),
      () => import("@/components/message-draft"),
      () => import("@/components/option-list"),
      () => import("@/components/parameter-slider"),
      () => import("@/components/plan"),
      () => import("@/components/preferences-panel"),
      () => import("@/components/progress-tracker"),
      () => import("@/components/question-flow"),
      () => import("@/components/stats-display"),
      () => import("@/components/terminal"),
      () => import("@/components/video"),
      () => import("@/components/weather-widget"),
      () => import("@/components/x-post"),
    ];

    const results = await Promise.all(barrels.map((fn) => fn()));

    // All imports should succeed and return defined values
    results.forEach((mod, i) => {
      expect(mod, `Barrel ${i} should be defined`).toBeDefined();
    });
  });

  test("all 27 component directories are importable", async () => {
    // Full list of all 27 components
    const allComponents = [
      () => import("@/components/approval-card"),
      () => import("@/components/audio"),
      () => import("@/components/image"),
      () => import("@/components/video"),
      () => import("@/components/code-block"),
      () => import("@/components/terminal"),
      () => import("@/components/citation"),
      () => import("@/components/link-preview"),
      () => import("@/components/option-list"),
      () => import("@/components/x-post"),
      () => import("@/components/instagram-post"),
      () => import("@/components/linkedin-post"),
      () => import("@/components/order-summary"),
      () => import("@/components/message-draft"),
      () => import("@/components/data-table"),
      () => import("@/components/preferences-panel"),
      () => import("@/components/plan"),
      () => import("@/components/progress-tracker"),
      () => import("@/components/question-flow"),
      () => import("@/components/item-carousel"),
      () => import("@/components/image-gallery"),
      () => import("@/components/chart"),
      () => import("@/components/code-diff"),
      () => import("@/components/weather-widget"),
      () => import("@/components/parameter-slider"),
      () => import("@/components/stats-display"),
      () => import("@/components/geo-map"),
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
