import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Terminal from './index.vue';

// Mock navigator.clipboard
Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn().mockResolvedValue(undefined),
  },
});

describe('Terminal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('rendering', () => {
    it('renders command when provided', () => {
      const wrapper = mount(Terminal, {
        props: {
          id: 'term-1',
          command: 'ls -la',
          exitCode: 0,
        },
      });
      expect(wrapper.text()).toContain('ls -la');
    });

    it('renders output text', () => {
      const wrapper = mount(Terminal, {
        props: {
          id: 'term-1',
          command: 'ls',
          stdout: 'file1.txt file2.txt',
          exitCode: 0,
        },
      });
      expect(wrapper.text()).toContain('file1.txt file2.txt');
    });

    it('renders prompt character with cwd', () => {
      const wrapper = mount(Terminal, {
        props: {
          id: 'term-1',
          command: 'ls',
          cwd: '/home/user',
          exitCode: 0,
        },
      });
      expect(wrapper.text()).toContain('/home/user$');
    });

    it('applies custom css.root', () => {
      const wrapper = mount(Terminal, {
        props: {
          id: 'term-1',
          command: 'ls',
          css: { root: 'my-terminal' },
          exitCode: 0,
        },
      });
      expect(wrapper.attributes('class')).toContain('my-terminal');
    });
  });

  describe('ANSI support', () => {
    it('renders ANSI color codes as styled HTML', () => {
      const wrapper = mount(Terminal, {
        props: {
          id: 'term-1',
          command: 'test',
          stdout: '\x1b[32mgreen text\x1b[0m',
          exitCode: 0,
        },
      });
      const html = wrapper.html();
      // ansi-to-html converts ANSI codes to styled spans
      expect(html).toContain('green text');
      expect(html).toContain('style=');
    });

    it('handles multiple ANSI sequences', () => {
      const wrapper = mount(Terminal, {
        props: {
          id: 'term-1',
          command: 'test',
          stdout: '\x1b[31mred\x1b[0m and \x1b[34mblue\x1b[0m',
          exitCode: 0,
        },
      });
      const html = wrapper.html();
      expect(html).toContain('red');
      expect(html).toContain('blue');
    });
  });

  describe('structure', () => {
    it('has data-slot attribute', () => {
      const wrapper = mount(Terminal, {
        props: {
          id: 'term-1',
          command: 'ls',
          exitCode: 0,
        },
      });
      expect(wrapper.attributes('data-slot')).toBe('terminal');
    });

    it('has data-tool-ui-id attribute', () => {
      const wrapper = mount(Terminal, {
        props: {
          id: 'term-1',
          command: 'ls',
          exitCode: 0,
        },
      });
      expect(wrapper.attributes('data-tool-ui-id')).toBe('term-1');
    });
  });

  describe('exit code display', () => {
    it('shows exit code 0 in muted color', () => {
      const wrapper = mount(Terminal, {
        props: {
          id: 'term-1',
          command: 'ls',
          exitCode: 0,
        },
      });
      expect(wrapper.text()).toContain('0');
      const html = wrapper.html();
      expect(html).toContain('text-muted-foreground');
    });

    it('shows non-zero exit code in red', () => {
      const wrapper = mount(Terminal, {
        props: {
          id: 'term-1',
          command: 'ls',
          exitCode: 1,
        },
      });
      expect(wrapper.text()).toContain('1');
      const html = wrapper.html();
      expect(html).toContain('text-red-600');
    });
  });

  describe('copy functionality', () => {
    it('copies output to clipboard on click', async () => {
      const wrapper = mount(Terminal, {
        props: {
          id: 'term-1',
          command: 'ls',
          stdout: 'output here',
          exitCode: 0,
        },
      });
      const copyBtn = wrapper.find("button[aria-label='Copy output']");
      expect(copyBtn.exists()).toBe(true);
      await copyBtn.trigger('click');
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith('output here');
    });

    it('disables copy button when there is no output', () => {
      const wrapper = mount(Terminal, {
        props: {
          id: 'term-1',
          command: 'ls',
          exitCode: 0,
        },
      });
      const copyBtn = wrapper.find("button[aria-label='No output to copy']");
      expect(copyBtn.exists()).toBe(true);
      expect(copyBtn.attributes('disabled')).toBeDefined();
    });
  });

  describe('duration display', () => {
    it('shows formatted duration in ms', () => {
      const wrapper = mount(Terminal, {
        props: {
          id: 'term-1',
          command: 'ls',
          exitCode: 0,
          durationMs: 500,
        },
      });
      expect(wrapper.text()).toContain('500ms');
    });

    it('shows formatted duration in seconds', () => {
      const wrapper = mount(Terminal, {
        props: {
          id: 'term-1',
          command: 'ls',
          exitCode: 0,
          durationMs: 1500,
        },
      });
      expect(wrapper.text()).toContain('1.5s');
    });
  });
});
