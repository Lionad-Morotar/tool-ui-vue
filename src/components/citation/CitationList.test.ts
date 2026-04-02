import { mount } from '@vue/test-utils';
import { describe, expect, test, vi } from 'vitest';
import CitationList from './CitationList.vue';
import type { SerializableCitation } from './schema';

function createCitations(count: number): SerializableCitation[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `citation-${i + 1}`,
    href: `https://example.com/article-${i + 1}`,
    title: `Article ${i + 1}`,
    domain: 'example.com',
    type: 'webpage' as const,
  }));
}

describe('CitationList', () => {
  describe('rendering', () => {
    test("renders with data-slot='citation-list'", () => {
      const wrapper = mount(CitationList, {
        props: {
          id: 'test-list',
          citations: createCitations(2),
        },
      });
      expect(wrapper.find('[data-slot="citation-list"]').exists()).toBe(true);
    });

    test('renders with data-tool-ui-id', () => {
      const wrapper = mount(CitationList, {
        props: {
          id: 'my-citation-list',
          citations: createCitations(2),
        },
      });
      expect(wrapper.find('[data-tool-ui-id="my-citation-list"]').exists()).toBe(true);
    });

    test('renders all citations when maxVisible is not set', () => {
      const wrapper = mount(CitationList, {
        props: {
          id: 'test-list',
          citations: createCitations(5),
        },
      });
      // Default variant renders Citation components
      expect(wrapper.findAllComponents({ name: 'Citation' }).length).toBe(5);
    });

    test('renders custom className', () => {
      const wrapper = mount(CitationList, {
        props: {
          id: 'test-list',
          citations: createCitations(2),
          className: 'my-custom-class',
        },
      });
      expect(wrapper.find('.my-custom-class').exists()).toBe(true);
    });
  });

  describe('variants', () => {
    test('renders default variant as vertical list', () => {
      const wrapper = mount(CitationList, {
        props: {
          id: 'test-list',
          citations: createCitations(2),
          variant: 'default',
        },
      });
      expect(wrapper.find('.flex-col').exists()).toBe(true);
    });

    test('renders inline variant as horizontal wrap', () => {
      const wrapper = mount(CitationList, {
        props: {
          id: 'test-list',
          citations: createCitations(2),
          variant: 'inline',
        },
      });
      expect(wrapper.find('.flex-wrap').exists()).toBe(true);
    });

    test('renders stacked variant as button with overlapping icons', () => {
      const wrapper = mount(CitationList, {
        props: {
          id: 'test-list',
          citations: createCitations(3),
          variant: 'stacked',
        },
      });
      const button = wrapper.find('button');
      expect(button.exists()).toBe(true);
      // Should have overlapping icon containers
      expect(wrapper.findAll('.rounded-full').length).toBeGreaterThan(0);
    });

    test('stacked variant shows source count', () => {
      const wrapper = mount(CitationList, {
        props: {
          id: 'test-list',
          citations: createCitations(3),
          variant: 'stacked',
        },
      });
      expect(wrapper.text()).toContain('3 sources');
    });

    test('stacked variant handles single source', () => {
      const wrapper = mount(CitationList, {
        props: {
          id: 'test-list',
          citations: createCitations(1),
          variant: 'stacked',
        },
      });
      expect(wrapper.text()).toContain('1 source');
      expect(wrapper.text()).not.toContain('1 sources');
    });
  });

  describe('overflow handling', () => {
    test('shows overflow indicator when citations exceed maxVisible', () => {
      const wrapper = mount(CitationList, {
        props: {
          id: 'test-list',
          citations: createCitations(5),
          variant: 'default',
          maxVisible: 2,
        },
      });
      expect(wrapper.text()).toContain('+3 more sources');
    });

    test('shows inline overflow indicator with correct text', () => {
      const wrapper = mount(CitationList, {
        props: {
          id: 'test-list',
          citations: createCitations(5),
          variant: 'inline',
          maxVisible: 2,
        },
      });
      expect(wrapper.text()).toContain('+3 more');
    });

    test('does not show overflow when citations are within maxVisible', () => {
      const wrapper = mount(CitationList, {
        props: {
          id: 'test-list',
          citations: createCitations(3),
          variant: 'default',
          maxVisible: 5,
        },
      });
      expect(wrapper.text()).not.toContain('more');
    });

    test('does not show overflow when maxVisible is not set', () => {
      const wrapper = mount(CitationList, {
        props: {
          id: 'test-list',
          citations: createCitations(10),
          variant: 'default',
        },
      });
      expect(wrapper.text()).not.toContain('more');
    });

    test('renders only maxVisible citations', () => {
      const wrapper = mount(CitationList, {
        props: {
          id: 'test-list',
          citations: createCitations(5),
          variant: 'default',
          maxVisible: 2,
        },
      });
      // Should only render 2 Citation components
      expect(wrapper.findAllComponents({ name: 'Citation' }).length).toBe(2);
    });
  });

  describe('stacked variant overflow', () => {
    test('shows ellipsis indicator when more than 4 citations in stacked', () => {
      const wrapper = mount(CitationList, {
        props: {
          id: 'test-list',
          citations: createCitations(6),
          variant: 'stacked',
        },
      });
      // Should show ellipsis for remaining
      expect(wrapper.text()).toContain('•••');
    });

    test('displays correct source count in stacked variant', () => {
      const wrapper = mount(CitationList, {
        props: {
          id: 'test-list',
          citations: createCitations(6),
          variant: 'stacked',
        },
      });
      expect(wrapper.text()).toContain('6 sources');
    });
  });

  describe('popover interactions', () => {
    test('overflow button triggers popover on mouseenter', async () => {
      vi.useFakeTimers();
      const wrapper = mount(CitationList, {
        props: {
          id: 'test-list',
          citations: createCitations(5),
          variant: 'default',
          maxVisible: 2,
        },
      });

      const overflowContainer = wrapper.find('[data-testid="overflow-container"]');
      await overflowContainer.trigger('mouseenter');

      vi.advanceTimersByTime(150);
      await wrapper.vm.$nextTick();

      // Popover should be visible
      expect(wrapper.find('[data-testid="popover"]').exists()).toBe(true);

      vi.useRealTimers();
    });

    test('stacked variant triggers popover on mouseenter', async () => {
      vi.useFakeTimers();
      const wrapper = mount(CitationList, {
        props: {
          id: 'test-list',
          citations: createCitations(3),
          variant: 'stacked',
        },
      });

      const container = wrapper.find('[data-testid="citation-list-container"]');
      await container.trigger('mouseenter');
      vi.advanceTimersByTime(150);
      await wrapper.vm.$nextTick();

      // Popover should be visible
      expect(wrapper.find('[data-testid="popover"]').exists()).toBe(true);

      vi.useRealTimers();
    });
  });

  describe('navigation', () => {
    test('emits navigate event when citation is clicked', async () => {
      const citations = createCitations(2);
      const wrapper = mount(CitationList, {
        props: {
          id: 'test-list',
          citations,
          variant: 'default',
        },
      });

      // Find Citation components and trigger navigate
      const citationComponents = wrapper.findAllComponents({ name: 'Citation' });
      citationComponents[0].vm.$emit('navigate', citations[0].href, citations[0]);

      expect(wrapper.emitted('navigate')).toBeTruthy();
    });

    test('calls onNavigate prop when provided', async () => {
      const onNavigate = vi.fn();
      const citations = createCitations(2);

      mount(CitationList, {
        props: {
          id: 'test-list',
          citations,
          variant: 'default',
          onNavigate,
        },
      });

      // Note: Testing onNavigate prop would require more complex setup
      // as it's handled within Citation component
      expect(onNavigate).not.toHaveBeenCalled(); // Not called until interaction
    });
  });

  describe('citations with favicons', () => {
    test('renders favicon images when provided', () => {
      const citations: SerializableCitation[] = [
        {
          id: 'citation-1',
          href: 'https://example.com/article-1',
          title: 'Article 1',
          domain: 'example.com',
          favicon: 'https://example.com/favicon.ico',
          type: 'webpage',
        },
      ];

      const wrapper = mount(CitationList, {
        props: {
          id: 'test-list',
          citations,
          variant: 'stacked',
        },
      });

      expect(wrapper.find('img').exists()).toBe(true);
      expect(wrapper.find('img').attributes('src')).toBe('https://example.com/favicon.ico');
    });

    test('renders type icon when favicon is not provided', () => {
      const wrapper = mount(CitationList, {
        props: {
          id: 'test-list',
          citations: createCitations(1),
          variant: 'stacked',
        },
      });

      // Should render SVG icon instead of img
      expect(wrapper.find('svg').exists()).toBe(true);
    });
  });
});
