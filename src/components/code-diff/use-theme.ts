import { ref, computed, onMounted, onUnmounted, type ComputedRef } from 'vue';

/**
 * Detect system color scheme preference
 * @returns 'light' | 'dark' based on system preference
 */
export function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/**
 * Detect theme from document attributes
 * Checks data-theme attribute and classList for 'dark' or 'light'
 * @returns 'light' | 'dark' | null
 */
export function getDocumentTheme(): 'light' | 'dark' | null {
  if (typeof document === 'undefined') return null;

  const root = document.documentElement;
  const dataTheme = root.getAttribute('data-theme')?.toLowerCase();

  if (dataTheme === 'dark') return 'dark';
  if (dataTheme === 'light') return 'light';

  if (root.classList.contains('dark')) return 'dark';
  if (root.classList.contains('light')) return 'light';

  return null;
}

/**
 * Vue composable for resolved theme detection
 * Automatically detects and tracks theme changes from:
 * - data-theme attribute on documentElement
 * - classList on documentElement (dark/light classes)
 * - System color scheme preference
 *
 * Priority: data-theme > classList > system preference
 *
 * @returns ComputedRef<'light' | 'dark'> - The resolved theme
 */
export function useResolvedTheme(): ComputedRef<'light' | 'dark'> {
  const theme = ref<'light' | 'dark'>(getDocumentTheme() ?? getSystemTheme());

  onMounted(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return;
    }

    const updateTheme = () => {
      theme.value = getDocumentTheme() ?? getSystemTheme();
    };

    // Listen for system theme changes
    const mql = window.matchMedia?.('(prefers-color-scheme: dark)');
    mql?.addEventListener('change', updateTheme);

    // Listen for DOM attribute/class changes
    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class', 'data-theme'],
    });

    // Cleanup on unmount
    onUnmounted(() => {
      mql?.removeEventListener('change', updateTheme);
      observer.disconnect();
    });
  });

  return computed(() => theme.value);
}
