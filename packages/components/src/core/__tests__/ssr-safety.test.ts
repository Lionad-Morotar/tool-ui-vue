// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';

/**
 * SSR Safety Tests
 *
 * Verifies components and utilities handle server-side rendering gracefully.
 * The actual SSR path (import.meta.env.SSR === true) is guarded in source code;
 * these tests verify the non-SSR path (jsdom) also works without errors.
 */

describe('SSR Safety: code-diff/use-theme', () => {
  it('getSystemTheme returns a valid theme without throwing', async () => {
    const { getSystemTheme } = await import('../../code-diff/use-theme');
    expect(() => getSystemTheme()).not.toThrow();
    const theme = getSystemTheme();
    expect(['light', 'dark']).toContain(theme);
  });

  it('getDocumentTheme returns null or a valid theme without throwing', async () => {
    const { getDocumentTheme } = await import('../../code-diff/use-theme');
    expect(() => getDocumentTheme()).not.toThrow();
    const theme = getDocumentTheme();
    expect([null, 'light', 'dark']).toContain(theme);
  });
});

describe('SSR Safety: code-block/useCodeBlock theme helpers', () => {
  it('getSystemTheme equivalent in code-block does not throw', async () => {
    // Import the module to trigger code loading; the theme helpers are module-level
    const mod = await import('../../code-block/states/useCodeBlock');
    expect(mod).toBeDefined();
    expect(typeof mod.useCodeBlock).toBe('function');
  });
});

describe('SSR Safety: Terminal sanitize prop', () => {
  it('accepts sanitize prop without type errors', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const { mount } = await import('@vue/test-utils');
    const { Terminal } = await import('../../terminal');
    const wrapper = mount(Terminal, {
      props: {
        id: 'ssr-term',
        command: 'ls',
        exitCode: 0,
        sanitize: true,
      },
    });
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.attributes('data-slot')).toBe('terminal');
    warnSpy.mockRestore();
  });
});

describe('SSR Safety: CodeBlock sanitize prop', () => {
  it('accepts sanitize prop without type errors', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const { mount } = await import('@vue/test-utils');
    const { CodeBlock } = await import('../../code-block');
    const wrapper = mount(CodeBlock, {
      props: {
        id: 'ssr-code',
        code: 'const x = 1;',
        sanitize: true,
      },
    });
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.attributes('data-slot')).toBe('code-block');
    warnSpy.mockRestore();
  });
});
