import { mount } from '@vue/test-utils';
import { describe, expect, test, vi, beforeEach } from 'vitest';
import { nextTick, ref, computed } from 'vue';

// Shared locale state for i18n switching
const currentLocale = ref('en');

const messagesByLocale: Record<string, Record<string, string>> = {
  en: { 'citation.viewSource': 'View source' },
  'zh-CN': { 'citation.viewSource': '查看来源' },
};

vi.mock('../../core/i18n', async (importOriginal) => {
  const actual = await importOriginal<Record<string, unknown>>();
  return {
    ...actual,
    useI18n: () => ({
      t: (key: string, params?: Record<string, unknown>) => computed(() => {
        const msgs = messagesByLocale[currentLocale.value] ?? {};
        let text = msgs[key] ?? key;
        if (params) {
          Object.entries(params).forEach(([k, v]) => {
            text = text.replace(`{${k}}`, String(v));
          });
        }
        return text;
      }),
      locale: computed(() => currentLocale.value),
      setLocale: (locale: string) => { currentLocale.value = locale; },
    }),
  };
});

import Citation from '../index.vue';

function createProps(overrides: Record<string, unknown> = {}) {
  return {
    id: 'test-citation',
    href: 'https://example.com',
    title: 'Citation Title',
    ...overrides,
  };
}

describe('Citation', () => {
  describe('rendering', () => {
    test('renders title', () => {
      const wrapper = mount(Citation, {
        props: createProps(),
      });
      expect(wrapper.text()).toContain('Citation Title');
    });

    test('renders content/snippet when provided', () => {
      const wrapper = mount(Citation, {
        props: createProps({ snippet: 'Citation text' }),
      });
      expect(wrapper.text()).toContain('Citation text');
    });

    test('renders author when provided', () => {
      const wrapper = mount(Citation, {
        props: createProps({ author: 'John Doe' }),
      });
      expect(wrapper.text()).toContain('John Doe');
    });

    test('renders source/domain when provided', () => {
      const wrapper = mount(Citation, {
        props: createProps({ domain: 'Nature' }),
      });
      expect(wrapper.text()).toContain('Nature');
    });

    test('renders URL link with href', () => {
      const wrapper = mount(Citation, {
        props: createProps(),
      });
      // Default variant: inner div has role="link"
      const link = wrapper.find('[role="link"]');
      expect(link.exists()).toBe(true);
    });
  });

  describe('variants', () => {
    test('applies inline variant styling', () => {
      const wrapper = mount(Citation, {
        props: createProps({ variant: 'inline' }),
      });
      expect(wrapper.find('button').exists()).toBe(true);
      expect(wrapper.find('button').classes()).toContain('inline-flex');
    });

    test('applies default variant as card', () => {
      const wrapper = mount(Citation, {
        props: createProps(),
      });
      expect(wrapper.find('article').exists()).toBe(true);
    });
  });

  describe('inline popover', () => {
    test('has correct ARIA attributes on trigger', () => {
      const wrapper = mount(Citation, {
        props: createProps({ variant: 'inline' }),
      });
      const button = wrapper.find('button');
      expect(button.attributes('aria-expanded')).toBe('false');
      expect(button.attributes('aria-haspopup')).toBe('dialog');
      expect(button.attributes('aria-controls')).toBe('test-citation-popover');
    });

    test('opens popover on hover after delay', async () => {
      vi.useFakeTimers();
      const wrapper = mount(Citation, {
        props: createProps({ variant: 'inline' }),
      });
      const button = wrapper.find('button');
      await button.trigger('mouseenter');
      vi.advanceTimersByTime(150);
      await nextTick();
      const popover = wrapper.find('#test-citation-popover');
      expect(popover.attributes('popover-open')).toBeDefined();
      expect(button.attributes('aria-expanded')).toBe('true');
      vi.useRealTimers();
    });

    test('opens/closes popover on Enter key', async () => {
      const wrapper = mount(Citation, {
        props: createProps({ variant: 'inline' }),
      });
      const button = wrapper.find('button');
      await button.trigger('keydown', { key: 'Enter' });
      const popover = wrapper.find('#test-citation-popover');
      expect(popover.attributes('popover-open')).toBeDefined();
      await button.trigger('keydown', { key: 'Enter' });
      expect(popover.attributes('popover-open')).toBeUndefined();
    });

    test('closes popover on Escape key', async () => {
      const wrapper = mount(Citation, {
        props: createProps({ variant: 'inline' }),
      });
      const button = wrapper.find('button');
      await button.trigger('keydown', { key: 'Enter' });
      const popover = wrapper.find('#test-citation-popover');
      expect(popover.attributes('popover-open')).toBeDefined();
      await popover.trigger('keydown', { key: 'Escape' });
      expect(popover.attributes('popover-open')).toBeUndefined();
    });
  });

  describe('i18n', () => {
    beforeEach(() => { currentLocale.value = 'en'; });

    test('uses zh-CN aria-label for inline variant', () => {
      currentLocale.value = 'zh-CN';
      const wrapper = mount(Citation, {
        props: createProps({ variant: 'inline' }),
      });
      const button = wrapper.find('button');
      expect(button.attributes('aria-label')).toBe('查看来源');
    });

    test('uses English aria-label for inline variant', () => {
      currentLocale.value = 'en';
      const wrapper = mount(Citation, {
        props: createProps({ variant: 'inline' }),
      });
      const button = wrapper.find('button');
      expect(button.attributes('aria-label')).toBe('View source');
    });
  });
});
