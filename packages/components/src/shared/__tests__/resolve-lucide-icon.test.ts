import { describe, expect, test, vi } from 'vitest';
import type { MockInstance } from 'vitest';
import { mount } from '@vue/test-utils';
import { defineComponent, h } from 'vue';

import { resolveLucideIcon } from '../resolve-lucide-icon';

/**
 * Icon name resolution contract (lucide renamed a batch of icons in v1.0, old
 * names survive only as named-export aliases, absent from the `icons` map):
 * - legacy alias names ("lucide:file-edit") must still render a real icon svg
 * - canonical names ("lucide:file-pen") keep rendering a real icon svg
 * - truly unknown names fall back to a first-letter placeholder AND emit a
 *   console.warn exactly once per name (module cache dedupes repeat lookups)
 */
// async components resolve to a comment placeholder until the loader settles;
// the first dynamic import('lucide-vue-next') loads through vite-node as a
// macrotask, so poll instead of a single flushPromises (microtask-only)
async function renderIcon(name: string | undefined) {
  const Icon = resolveLucideIcon(name)!;
  const Host = defineComponent({ render: () => h('div', [h(Icon)]) });
  const wrapper = mount(Host);
  await vi.waitFor(() => {
    if (!wrapper.find('svg').exists() && wrapper.text() === '') {
      throw new Error('async icon still loading');
    }
  });
  return wrapper;
}

describe('resolveLucideIcon', () => {
  test('renders a real svg for a legacy alias name (file-edit)', async () => {
    const wrapper = await renderIcon('lucide:file-edit');
    expect(wrapper.find('svg').exists()).toBe(true);
  });

  test('renders a real svg for a plain alias name without prefix', async () => {
    const wrapper = await renderIcon('bar-chart-3');
    expect(wrapper.find('svg').exists()).toBe(true);
  });

  test('renders a real svg for a canonical name (file-pen)', async () => {
    const wrapper = await renderIcon('lucide:file-pen');
    expect(wrapper.find('svg').exists()).toBe(true);
  });

  test('falls back to first-letter placeholder and warns once for an unknown name', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {}) as MockInstance;
    const name = 'lucide:zz-unknown-icon-probe';

    const wrapper = await renderIcon(name);
    expect(wrapper.find('svg').exists()).toBe(false);
    expect(wrapper.text()).toBe('Z');

    // cached resolution: a second lookup of the same name must not warn again
    await renderIcon(name);
    expect(warn).toHaveBeenCalledTimes(1);
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('zz-unknown-icon-probe'));

    warn.mockRestore();
  });
});
