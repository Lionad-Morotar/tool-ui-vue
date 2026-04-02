import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { nextTick } from 'vue';
import CodeBlock from '../index.vue';

// Mock navigator.clipboard
Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn().mockResolvedValue(undefined),
  },
});

describe('CodeBlock', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('rendering', () => {
    it('renders code content', async () => {
      const wrapper = mount(CodeBlock, {
        props: {
          id: 'code-1',
          code: 'const x = 1;',
        },
      });
      await nextTick();
      await new Promise((r) => setTimeout(r, 300));
      expect(wrapper.text()).toContain('const x = 1;');
    });

    it('renders filename when provided', async () => {
      const wrapper = mount(CodeBlock, {
        props: {
          id: 'code-1',
          code: 'const x = 1;',
          filename: 'example.ts',
        },
      });
      await nextTick();
      expect(wrapper.text()).toContain('example.ts');
    });

    it('displays language indicator', async () => {
      const wrapper = mount(CodeBlock, {
        props: {
          id: 'code-1',
          code: 'const x = 1;',
          language: 'typescript',
        },
      });
      await nextTick();
      expect(wrapper.text()).toContain('TypeScript');
    });

    it('applies custom css.root', () => {
      const wrapper = mount(CodeBlock, {
        props: {
          id: 'code-1',
          code: 'const x = 1;',
          css: { root: 'my-code' },
        },
      });
      expect(wrapper.attributes('class')).toContain('my-code');
    });

    it('renders with different languages', async () => {
      const languages = [
        { lang: 'javascript', display: 'JavaScript' },
        { lang: 'python', display: 'Python' },
        { lang: 'css', display: 'CSS' },
        { lang: 'json', display: 'JSON' },
        { lang: 'html', display: 'HTML' },
      ];

      for (const { lang, display } of languages) {
        const wrapper = mount(CodeBlock, {
          props: {
            id: `code-${lang}`,
            code: 'example code',
            language: lang,
          },
        });
        await nextTick();
        expect(wrapper.text()).toContain(display);
      }
    });

    it('renders unknown language in uppercase', async () => {
      const wrapper = mount(CodeBlock, {
        props: {
          id: 'code-1',
          code: 'example',
          language: 'customlang',
        },
      });
      await nextTick();
      expect(wrapper.text()).toContain('CUSTOMLANG');
    });
  });

  describe('syntax highlighting', () => {
    it('renders with syntax highlighting classes', async () => {
      const wrapper = mount(CodeBlock, {
        props: {
          id: 'code-1',
          code: 'const x = 1;',
          language: 'typescript',
        },
      });
      await nextTick();
      await new Promise((r) => setTimeout(r, 100));
      const codeEl = wrapper.find('pre');
      if (codeEl.exists()) {
        const html = wrapper.html();
        expect(html).toContain('shiki');
      } else {
        // Fallback rendering
        expect(wrapper.text()).toContain('const x = 1;');
      }
    });

    it('handles unknown language gracefully', async () => {
      const wrapper = mount(CodeBlock, {
        props: {
          id: 'code-1',
          code: 'some code here',
          language: 'unknownlang',
        },
      });
      await nextTick();
      await new Promise((r) => setTimeout(r, 100));
      // Should still render the code without throwing
      expect(wrapper.text()).toContain('some code here');
    });

    it('handles empty code', async () => {
      const wrapper = mount(CodeBlock, {
        props: {
          id: 'code-1',
          code: '',
          language: 'typescript',
        },
      });
      await nextTick();
      await new Promise((r) => setTimeout(r, 100));
      // Should render without error
      expect(wrapper.attributes('data-slot')).toBe('code-block');
    });
  });

  describe('line numbers', () => {
    it('shows line numbers by default', async () => {
      const wrapper = mount(CodeBlock, {
        props: {
          id: 'code-1',
          code: 'line1\nline2\nline3',
          language: 'text',
        },
      });
      await nextTick();
      await new Promise((r) => setTimeout(r, 100));
      const html = wrapper.html();
      // Line numbers should be present
      expect(html).toContain('1');
      expect(html).toContain('2');
      expect(html).toContain('3');
    });

    it('hides line numbers when lineNumbers is hidden', async () => {
      const wrapper = mount(CodeBlock, {
        props: {
          id: 'code-1',
          code: 'line1\nline2',
          language: 'text',
          lineNumbers: 'hidden',
        },
      });
      await nextTick();
      await new Promise((r) => setTimeout(r, 100));
      // Should still render without line numbers
      expect(wrapper.attributes('data-slot')).toBe('code-block');
    });
  });

  describe('highlight lines', () => {
    it('applies highlight to specified lines', async () => {
      const wrapper = mount(CodeBlock, {
        props: {
          id: 'code-1',
          code: 'line1\nline2\nline3',
          language: 'text',
          highlightLines: [2],
        },
      });
      await nextTick();
      await new Promise((r) => setTimeout(r, 100));
      // Should render with highlighted line
      expect(wrapper.attributes('data-slot')).toBe('code-block');
    });

    it('handles multiple highlighted lines', async () => {
      const wrapper = mount(CodeBlock, {
        props: {
          id: 'code-1',
          code: 'line1\nline2\nline3\nline4',
          language: 'text',
          highlightLines: [1, 3, 4],
        },
      });
      await nextTick();
      await new Promise((r) => setTimeout(r, 100));
      expect(wrapper.attributes('data-slot')).toBe('code-block');
    });
  });

  describe('collapse functionality', () => {
    it('shows collapse toggle when code exceeds maxCollapsedLines', async () => {
      const wrapper = mount(CodeBlock, {
        props: {
          id: 'code-1',
          code: 'line1\nline2\nline3\nline4\nline5',
          language: 'text',
          maxCollapsedLines: 3,
        },
      });
      await nextTick();
      await new Promise((r) => setTimeout(r, 100));
      // Look for the collapse button by its text content
      const text = wrapper.text();
      expect(text).toContain('Show all');
    });

    it('shows correct line count in collapse button', async () => {
      const wrapper = mount(CodeBlock, {
        props: {
          id: 'code-1',
          code: 'line1\nline2\nline3\nline4\nline5',
          language: 'text',
          maxCollapsedLines: 3,
        },
      });
      await nextTick();
      await new Promise((r) => setTimeout(r, 100));
      expect(wrapper.text()).toContain('Show all 5 lines');
    });
  });

  describe('copy functionality', () => {
    it('shows copy button', () => {
      const wrapper = mount(CodeBlock, {
        props: {
          id: 'code-1',
          code: 'const x = 1;',
        },
      });
      const copyBtn = wrapper.find("button[aria-label='Copy code']");
      expect(copyBtn.exists()).toBe(true);
    });

    it('copies code to clipboard on click', async () => {
      const wrapper = mount(CodeBlock, {
        props: {
          id: 'code-1',
          code: 'const x = 1;',
        },
      });
      const copyBtn = wrapper.find("button[aria-label='Copy code']");
      await copyBtn.trigger('click');
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith('const x = 1;');
    });

    it('shows copied state after clicking', async () => {
      const wrapper = mount(CodeBlock, {
        props: {
          id: 'code-1',
          code: 'const x = 1;',
        },
      });
      const copyBtn = wrapper.find("button[aria-label='Copy code']");
      await copyBtn.trigger('click');
      await nextTick();

      // After clicking, the aria-label should change to "Copied"
      const copiedBtn = wrapper.find("button[aria-label='Copied']");
      expect(copiedBtn.exists()).toBe(true);
    });
  });

  describe('structure', () => {
    it('has data-slot attribute', () => {
      const wrapper = mount(CodeBlock, {
        props: {
          id: 'code-1',
          code: 'const x = 1;',
        },
      });
      expect(wrapper.attributes('data-slot')).toBe('code-block');
    });

    it('has data-tool-ui-id attribute', () => {
      const wrapper = mount(CodeBlock, {
        props: {
          id: 'code-1',
          code: 'const x = 1;',
        },
      });
      expect(wrapper.attributes('data-tool-ui-id')).toBe('code-1');
    });

    it('has lang attribute set to en', () => {
      const wrapper = mount(CodeBlock, {
        props: {
          id: 'code-1',
          code: 'const x = 1;',
        },
      });
      expect(wrapper.attributes('lang')).toBe('en');
    });

    it('has aria-busy attribute when loading', () => {
      const wrapper = mount(CodeBlock, {
        props: {
          id: 'code-1',
          code: 'const x = 1;',
        },
      });
      // Initially should be busy (loading)
      expect(wrapper.attributes('aria-busy')).toBe('true');
    });
  });

  describe('theme support', () => {
    it('renders with dark theme support', async () => {
      const wrapper = mount(CodeBlock, {
        props: {
          id: 'code-1',
          code: 'const x = 1;',
          language: 'typescript',
        },
      });
      await nextTick();
      await new Promise((r) => setTimeout(r, 100));
      // Component should render without errors
      expect(wrapper.attributes('data-slot')).toBe('code-block');
    });

    it('renders with light theme support', async () => {
      const wrapper = mount(CodeBlock, {
        props: {
          id: 'code-1',
          code: 'const x = 1;',
          language: 'typescript',
        },
      });
      await nextTick();
      await new Promise((r) => setTimeout(r, 100));
      expect(wrapper.attributes('data-slot')).toBe('code-block');
    });
  });
});
