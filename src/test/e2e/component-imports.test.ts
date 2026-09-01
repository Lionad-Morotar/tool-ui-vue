import { describe, expect, test } from 'vitest';

/**
 * E2E Test: Component Imports
 *
 * Verifies all components can be imported from the library entry point.
 * This is a minimal existence test — if imports fail, the package is broken.
 */

describe('E2E: Component Imports', () => {
  // 动态 import 的耗时随模块图重量增长(reka-ui 经根入口进入依赖图后,
  // vite-node 冷缓存下转换+加载整图远超 15s);阈值按实测收敛到 60s,
  // 仅放宽等待窗口,不断言性能本身
  test('all components can be imported from library entry', async () => {
    const imports = await import('@/index');

    // Verify exports exist (components are exported via barrel files)
    expect(imports).toBeDefined();

    // Specific component exports should be available
    // Note: We're testing the index.ts exports, which re-export from components/
    const componentExports = Object.keys(imports);

    // Should have exports (not empty)
    expect(componentExports.length).toBeGreaterThan(0);
  }, 60000);

  test('shared utilities can be imported', async () => {
    const shared = await import('@/shared');

    expect(shared).toBeDefined();
  });

  test('VERSION constant matches package version', async () => {
    const { VERSION } = await import('@/index');
    expect(VERSION).toBe('0.1.0');
  }, 60000);
});
