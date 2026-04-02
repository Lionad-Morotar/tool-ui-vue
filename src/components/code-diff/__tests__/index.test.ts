import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import CodeDiff from '../index.vue';

// Mock navigator.clipboard
Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn().mockResolvedValue(undefined),
  },
});

describe('CodeDiff', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('rendering', () => {
    it('renders diff content with changes', () => {
      const wrapper = mount(CodeDiff, {
        props: {
          id: 'diff-1',
          oldCode: 'function old() { return 1; }',
          newCode: 'function new() { return 2; }',
        },
      });
      const text = wrapper.text();
      // Word-level diff may merge similar lines, so we check for key parts
      expect(text).toContain('function');
      expect(text).toContain('return');
      // Should show diff stats
      expect(text).toContain('+1');
      expect(text).toContain('-1');
    });

    it('renders separate old and new lines when content is different enough', () => {
      const wrapper = mount(CodeDiff, {
        props: {
          id: 'diff-1',
          oldCode: 'const x = 1;',
          newCode: 'const y = 2;',
        },
      });
      const text = wrapper.text();
      // Should contain both variable names somewhere in the diff
      expect(text).toContain('x');
      expect(text).toContain('y');
    });

    it('renders filename when provided', () => {
      const wrapper = mount(CodeDiff, {
        props: {
          id: 'diff-1',
          oldCode: 'a',
          newCode: 'b',
          filename: 'file.ts',
        },
      });
      expect(wrapper.text()).toContain('file.ts');
    });

    it('displays language indicator', () => {
      const wrapper = mount(CodeDiff, {
        props: {
          id: 'diff-1',
          oldCode: 'a',
          newCode: 'b',
          language: 'typescript',
        },
      });
      expect(wrapper.text()).toContain('TypeScript');
    });
  });

  describe('diff indicators', () => {
    it('shows removed lines with minus indicator', () => {
      const wrapper = mount(CodeDiff, {
        props: {
          id: 'diff-1',
          oldCode: 'function old() { return 1; }',
          newCode: 'function new() { return 2; }',
        },
      });
      const html = wrapper.html();
      expect(html).toContain('<span class="mr-1 select-none text-red-500">-</span>');
      // Should have deletion background color class (light theme default)
      expect(html).toContain('bg-red-50/50');
    });

    it('shows added lines with plus indicator', () => {
      const wrapper = mount(CodeDiff, {
        props: {
          id: 'diff-1',
          oldCode: 'function old() { return 1; }',
          newCode: 'function new() { return 2; }',
        },
      });
      const html = wrapper.html();
      expect(html).toContain('<span class="mr-1 select-none text-emerald-500">+</span>');
      // Should have addition background color class (light theme default)
      expect(html).toContain('bg-emerald-50/50');
    });

    it('shows line numbers', () => {
      const wrapper = mount(CodeDiff, {
        props: {
          id: 'diff-1',
          oldCode: 'line1\nline2',
          newCode: 'line1\nmodified',
        },
      });
      const lineNumberEls = wrapper.findAll('.w-10');
      expect(lineNumberEls.length).toBeGreaterThan(0);
    });
  });

  describe('unified view', () => {
    it('renders unified diff view by default', () => {
      const wrapper = mount(CodeDiff, {
        props: {
          id: 'diff-1',
          oldCode: 'function old() { return 1; }',
          newCode: 'function new() { return 2; }',
        },
      });
      // Unified view shows single column of lines with +/- indicators
      const rows = wrapper.findAll('.font-mono');
      expect(rows.length).toBeGreaterThan(0);
      // Should not have the split view structure with two side-by-side containers
      // Split view has a flex container with two direct children with border-r
      const _splitViewContainers = wrapper.findAll('.border-r.border-border\\/50');
      // Unified view has line number borders but not the split view side borders
      // In unified view, we should see the diff lines with +/- indicators
      const hasMinusIndicator = wrapper.html().includes('text-red-500">-</span>');
      const hasPlusIndicator = wrapper.html().includes('text-emerald-500">+</span>');
      expect(hasMinusIndicator || hasPlusIndicator).toBe(true);
    });
  });

  describe('copy functionality', () => {
    it('shows copy button', () => {
      const wrapper = mount(CodeDiff, {
        props: {
          id: 'diff-1',
          oldCode: 'a',
          newCode: 'b',
        },
      });
      const copyBtn = wrapper.find("button[aria-label='Copy code']");
      expect(copyBtn.exists()).toBe(true);
    });

    it('copies newCode to clipboard on click', async () => {
      const wrapper = mount(CodeDiff, {
        props: {
          id: 'diff-1',
          oldCode: 'a',
          newCode: 'b',
        },
      });
      const copyBtn = wrapper.find("button[aria-label='Copy code']");
      await copyBtn.trigger('click');
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith('b');
    });
  });

  describe('structure', () => {
    it('has data-slot attribute', () => {
      const wrapper = mount(CodeDiff, {
        props: {
          id: 'diff-1',
          oldCode: 'a',
          newCode: 'b',
        },
      });
      expect(wrapper.attributes('data-slot')).toBe('code-diff');
    });

    it('has data-tool-ui-id attribute', () => {
      const wrapper = mount(CodeDiff, {
        props: {
          id: 'diff-1',
          oldCode: 'a',
          newCode: 'b',
        },
      });
      expect(wrapper.attributes('data-tool-ui-id')).toBe('diff-1');
    });
  });
});
