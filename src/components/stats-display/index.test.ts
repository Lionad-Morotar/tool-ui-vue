import { mount } from '@vue/test-utils';
import { describe, expect, test } from 'vitest';
import StatsDisplay from './index.vue';

function createProps(overrides: Record<string, unknown> = {}) {
  return {
    id: 'test-stats',
    stats: [{ key: 'users', label: 'Users', value: 1000 }],
    ...overrides,
  };
}

describe('StatsDisplay', () => {
  describe('rendering', () => {
    test('renders stat label', () => {
      const wrapper = mount(StatsDisplay, {
        props: createProps(),
      });
      expect(wrapper.text()).toContain('Users');
    });

    test('renders stat value', () => {
      const wrapper = mount(StatsDisplay, {
        props: createProps(),
      });
      expect(wrapper.text()).toContain('1000');
    });

    test('renders formatted currency value with aria-label', () => {
      const wrapper = mount(StatsDisplay, {
        props: createProps({
          stats: [
            {
              key: 'revenue',
              label: 'Revenue',
              value: 1500.5,
              format: { kind: 'currency', currency: 'USD', decimals: 2 },
            },
          ],
        }),
      });
      const valueSpan = wrapper.find('span[aria-label]');
      expect(valueSpan.exists()).toBe(true);
      expect(valueSpan.text()).toContain('$1,500.50');
      expect(valueSpan.attributes('aria-label')).toMatch(/1,500.50 US dollars/i);
    });

    test('renders compact number format with aria-label and compact suffix', () => {
      const wrapper = mount(StatsDisplay, {
        props: createProps({
          stats: [
            {
              key: 'users',
              label: 'Users',
              value: 2420,
              format: { kind: 'number', compact: true },
            },
          ],
        }),
      });
      const outerSpan = wrapper.find("span[aria-label='2,420']");
      expect(outerSpan.exists()).toBe(true);
      const compactSuffix = outerSpan.find("span[aria-hidden='true']");
      expect(compactSuffix.exists()).toBe(true);
    });

    test('renders percent format with aria-label and % suffix', () => {
      const wrapper = mount(StatsDisplay, {
        props: createProps({
          stats: [
            {
              key: 'conversion',
              label: 'Conversion',
              value: 0.125,
              format: { kind: 'percent', decimals: 1 },
            },
          ],
        }),
      });
      const outerSpan = wrapper.find("span[aria-label='12.5 percent']");
      expect(outerSpan.exists()).toBe(true);
      const suffix = outerSpan.find("span[aria-hidden='true']");
      expect(suffix.exists()).toBe(true);
      expect(suffix.text()).toBe('%');
    });

    test('renders multiple stats', () => {
      const wrapper = mount(StatsDisplay, {
        props: createProps({
          stats: [
            { key: 'a', label: 'A', value: 1 },
            { key: 'b', label: 'B', value: 2 },
            { key: 'c', label: 'C', value: 3 },
          ],
        }),
      });
      expect(wrapper.text()).toContain('A');
      expect(wrapper.text()).toContain('B');
      expect(wrapper.text()).toContain('C');
      expect(wrapper.text()).toContain('1');
      expect(wrapper.text()).toContain('2');
      expect(wrapper.text()).toContain('3');
    });
  });

  describe('trends', () => {
    test('renders positive trend indicator', () => {
      const wrapper = mount(StatsDisplay, {
        props: createProps({
          stats: [
            {
              key: 'trend',
              label: 'Trend',
              value: 100,
              diff: { value: 10, decimals: 0 },
            },
          ],
        }),
      });
      expect(wrapper.text()).toContain('+10%');
    });

    test('renders negative trend indicator', () => {
      const wrapper = mount(StatsDisplay, {
        props: createProps({
          stats: [
            {
              key: 'trend',
              label: 'Trend',
              value: 100,
              diff: { value: -5, decimals: 0 },
            },
          ],
        }),
      });
      expect(wrapper.text()).toContain('−5%');
    });

    test('renders trend percentage', () => {
      const wrapper = mount(StatsDisplay, {
        props: createProps({
          stats: [
            {
              key: 'trend',
              label: 'Trend',
              value: 100,
              diff: { value: 12.5, decimals: 1 },
            },
          ],
        }),
      });
      expect(wrapper.text()).toContain('+12.5%');
    });

    test('applies good diff badge classes exactly', () => {
      const wrapper = mount(StatsDisplay, {
        props: createProps({
          stats: [
            {
              key: 'good',
              label: 'Good',
              value: 100,
              diff: { value: 5 },
            },
          ],
        }),
      });
      const badge = wrapper.find('span.inline-flex.items-center');
      expect(badge.classes()).toContain('text-green-600');
      expect(badge.classes()).toContain('dark:text-green-400');
      expect(badge.classes()).toContain('bg-green-500/10');
      expect(badge.classes()).toContain('dark:bg-green-600/15');
    });

    test('applies bad diff badge classes exactly', () => {
      const wrapper = mount(StatsDisplay, {
        props: createProps({
          stats: [
            {
              key: 'bad',
              label: 'Bad',
              value: 100,
              diff: { value: -3 },
            },
          ],
        }),
      });
      const badge = wrapper.find('span.inline-flex.items-center');
      expect(badge.classes()).toContain('text-red-600');
      expect(badge.classes()).toContain('dark:text-red-500');
      expect(badge.classes()).toContain('bg-red-500/10');
      expect(badge.classes()).toContain('dark:bg-red-500/15');
    });

    test('applies neutral diff badge classes exactly', () => {
      const wrapper = mount(StatsDisplay, {
        props: createProps({
          stats: [
            {
              key: 'neutral',
              label: 'Neutral',
              value: 100,
              diff: { value: 0 },
            },
          ],
        }),
      });
      const badge = wrapper.find('span.inline-flex.items-center');
      expect(badge.classes()).toContain('text-muted-foreground');
      expect(badge.classes()).toContain('bg-muted');
    });

    test('inverts trend indicator when upIsPositive is false', () => {
      const wrapper = mount(StatsDisplay, {
        props: createProps({
          stats: [
            {
              key: 'cost',
              label: 'Cost',
              value: 100,
              diff: { value: -5, upIsPositive: false },
            },
          ],
        }),
      });
      expect(wrapper.text()).toContain('−5.0%');
      expect(wrapper.text()).toContain('↓');
    });
  });

  describe('structure', () => {
    test('has data-slot attribute', () => {
      const wrapper = mount(StatsDisplay, {
        props: createProps(),
      });
      expect(wrapper.find('[data-slot="stats-display"]').exists()).toBe(true);
    });

    test('applies custom css.root', () => {
      const wrapper = mount(StatsDisplay, {
        props: createProps({ css: { root: 'my-stats' } }),
      });
      expect(wrapper.find("[data-slot='stats-display']").classes()).toContain('my-stats');
    });

    test("outer article has lang='en' and aria-busy='false'", () => {
      const wrapper = mount(StatsDisplay, {
        props: createProps(),
      });
      const article = wrapper.find("[data-slot='stats-display']");
      expect(article.attributes('lang')).toBe('en');
      expect(article.attributes('aria-busy')).toBe('false');
    });
  });
});
