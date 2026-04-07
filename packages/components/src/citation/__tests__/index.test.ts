import { mount } from '@vue/test-utils';
import { describe, expect, test, vi } from 'vitest';
import { nextTick } from 'vue';
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
});
