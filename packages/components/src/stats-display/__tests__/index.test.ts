import { mount } from '@vue/test-utils';
import { describe, expect, test, vi } from 'vitest';

// Mock useI18n to provide predictable aria-label values
vi.mock('../../core/i18n', async (importOriginal) => {
  const { computed } = await import('vue');
  const actual = await importOriginal<Record<string, unknown>>();
  return {
    ...actual,
    useI18n: () => ({
      t: (key: string, params?: Record<string, unknown>) => computed(() => key),
      locale: computed(() => 'en'),
      setLocale: () => {},
    }),
  };
});

import StatsDisplay from '../index.vue';

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
      const outerSpan = wrapper.find("span[aria-label*='12.5']");
      expect(outerSpan.exists()).toBe(true);
      // aria-label should contain the formatted value and the i18n percent key
      expect(outerSpan.attributes('aria-label')).toContain('12.5');
      const suffix = outerSpan.find("span[aria-hidden='true']");
      expect(suffix.exists()).toBe(true);
      expect(suffix.text()).toBe('%');
    });

    test('renders number format with unit suffix', () => {
      const wrapper = mount(StatsDisplay, {
        props: createProps({
          stats: [
            {
              key: 'items',
              label: 'Items',
              value: 42,
              format: { kind: 'number', decimals: 0, unit: '个' },
            },
          ],
        }),
      });
      expect(wrapper.text()).toContain('42');
      expect(wrapper.text()).toContain('个');
    });

    test('renders compact number format with unit suffix', () => {
      const wrapper = mount(StatsDisplay, {
        props: createProps({
          stats: [
            {
              key: 'users',
              label: 'Users',
              value: 2420,
              format: { kind: 'number', compact: true, unit: '人' },
            },
          ],
        }),
      });
      expect(wrapper.text()).toContain('人');
    });

    test('renders boolean format with true label', () => {
      const wrapper = mount(StatsDisplay, {
        props: createProps({
          stats: [
            {
              key: 'active',
              label: 'Active',
              value: true,
              format: { kind: 'boolean', labels: { true: '是', false: '否' } },
            },
          ],
        }),
      });
      expect(wrapper.text()).toContain('是');
    });

    test('renders boolean format with false label', () => {
      const wrapper = mount(StatsDisplay, {
        props: createProps({
          stats: [
            {
              key: 'active',
              label: 'Active',
              value: false,
              format: { kind: 'boolean', labels: { true: '是', false: '否' } },
            },
          ],
        }),
      });
      expect(wrapper.text()).toContain('否');
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

    test('applies good diff color classes', () => {
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
      const diff = wrapper.find('span.inline-flex.items-center');
      expect(diff.classes()).toContain('text-green-600');
      expect(diff.classes()).toContain('dark:text-green-400');
    });

    test('applies bad diff color classes', () => {
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
      const diff = wrapper.find('span.inline-flex.items-center');
      expect(diff.classes()).toContain('text-red-600');
      expect(diff.classes()).toContain('dark:text-red-500');
    });

    test('applies neutral diff color classes', () => {
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
      const diff = wrapper.find('span.inline-flex.items-center');
      expect(diff.classes()).toContain('text-muted-foreground');
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

    test("outer article has aria-busy='false'", () => {
      const wrapper = mount(StatsDisplay, {
        props: createProps(),
      });
      const article = wrapper.find("[data-slot='stats-display']");
      expect(article.attributes('aria-busy')).toBe('false');
    });

    test('grid columns collapse to item count so rows always fill evenly', () => {
      const cases: Array<[number, string]> = [
        [1, '@[440px]:grid-cols-1'],
        [2, '@[440px]:grid-cols-2'],
        [3, '@[440px]:grid-cols-3'],
        [4, '@[440px]:grid-cols-2'],
        [5, '@[440px]:grid-cols-3'],
        [6, '@[440px]:grid-cols-3'],
      ];
      for (const [count, expected] of cases) {
        const wrapper = mount(StatsDisplay, {
          props: createProps({
            stats: Array.from({ length: count }, (_, i) => ({
              key: `s${i}`,
              label: `S${i}`,
              value: i,
            })),
          }),
        });
        expect(wrapper.find('.grid').classes()).toContain(expected);
      }
    });

    test('shrinks value type to text-2xl only when three columns render', () => {
      const three = mount(StatsDisplay, {
        props: createProps({
          stats: [1, 2, 3].map((i) => ({ key: `s${i}`, label: `S${i}`, value: i })),
        }),
      });
      expect(three.find('.grid .text-2xl').exists()).toBe(true);

      const four = mount(StatsDisplay, {
        props: createProps({
          stats: [1, 2, 3, 4].map((i) => ({ key: `s${i}`, label: `S${i}`, value: i })),
        }),
      });
      expect(four.find('.grid .text-3xl').exists()).toBe(true);
    });
  });
});
