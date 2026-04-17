import { describe, expect, test } from 'vitest';

/**
 * E2E Test: Component Imports
 *
 * Verifies all components can be imported from the library entry point.
 * This is a minimal existence test — if imports fail, the package is broken.
 */

describe('E2E: Component Imports', () => {
  test('all components can be imported from library entry', async () => {
    const imports = await import('@/index');

    // Verify exports exist (components are exported via barrel files)
    expect(imports).toBeDefined();

    // Specific component exports should be available
    // Note: We're testing the index.ts exports, which re-export from components/
    const componentExports = Object.keys(imports);

    // Should have exports (not empty)
    expect(componentExports.length).toBeGreaterThan(0);
  }, 15000);

  test('shared utilities can be imported', async () => {
    const shared = await import('@/shared');

    expect(shared).toBeDefined();
  });

  test('VERSION constant matches package version', async () => {
    const { VERSION } = await import('@/index');
    expect(VERSION).toBe('0.1.0');
  });
});
