import { mount } from '@vue/test-utils';
import { describe, expect, test } from 'vitest';
import Citation from './index.vue';

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
});
