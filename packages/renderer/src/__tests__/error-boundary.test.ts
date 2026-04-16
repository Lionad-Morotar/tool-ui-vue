import { mount } from '@vue/test-utils';
import { describe, expect, test } from 'vitest';
import { defineComponent, h } from 'vue';
import ErrorBoundary from '../error-boundary.vue';
import { withErrorBoundary } from '../with-error-boundary';

describe('error boundary', () => {
  describe('ErrorBoundary', () => {
    test('renders slot content when no error occurs', () => {
      const wrapper = mount(ErrorBoundary, {
        slots: {
          default: '<div class="safe-content">Hello</div>',
        },
      });
      expect(wrapper.find('.safe-content').exists()).toBe(true);
      expect(wrapper.text()).toContain('Hello');
    });

    test('renders fallback UI when child throws', async () => {
      const BadComponent = defineComponent({
        render() {
          throw new Error('Component exploded');
        },
      });

      const wrapper = mount(ErrorBoundary, {
        slots: {
          default: () => h(BadComponent),
        },
      });

      await wrapper.vm.$nextTick();
      expect(wrapper.find('.safe-content').exists()).toBe(false);
      expect(wrapper.text()).toContain('Component exploded');
    });
  });

  describe('withErrorBoundary', () => {
    test('wraps renderer and catches errors', () => {
      const badRenderer = (_ctx: unknown) => {
        throw new Error('Renderer failed');
      };

      const wrapped = withErrorBoundary(badRenderer);
      const vnode = wrapped({ props: {} } as never);
      expect(vnode).toBeDefined();
      expect(typeof (vnode as Record<string, unknown>).type).toBe('object');
    });
  });
});
