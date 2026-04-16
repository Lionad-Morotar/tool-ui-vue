import { describe, expect, test } from 'vitest';
import { components, registry } from '../registry';
import { catalog } from '../catalog';
import type { VNode } from 'vue';

const EXPECTED_COMPONENTS = catalog.componentNames;

describe('registry', () => {
  test('exports a registry object', () => {
    expect(registry).toBeDefined();
    expect(typeof registry).toBe('object');
  });

  test('components map has an entry for every catalog component', () => {
    const componentNames = Object.keys(components);
    expect(componentNames).toHaveLength(EXPECTED_COMPONENTS.length);
    for (const name of EXPECTED_COMPONENTS) {
      expect(componentNames).toContain(name);
    }
  });

  test('every component renderer is a function', () => {
    for (const [name, renderer] of Object.entries(components)) {
      expect(typeof renderer, `${name} should be a function`).toBe('function');
    }
  });

  test('each wrapped renderer returns a VNode when called', () => {
    for (const [name, renderer] of Object.entries(components)) {
      const result = renderer({ props: {} } as never);
      expect(result, `${name} should return a VNode`).toBeDefined();
      expect(typeof (result as VNode).type, `${name} should return a VNode`).toBe('object');
    }
  });
});
