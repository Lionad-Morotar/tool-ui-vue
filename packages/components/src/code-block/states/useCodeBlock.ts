import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useSanitize } from '../../core/sanitize';
import { usePropsValidator } from '../../core';
import { SerializableCodeBlockSchema } from '../schema';
import type { CodeBlockProps, CodeBlockLineNumbersMode } from '../schema';
import type { Highlighter, ShikiTransformer } from 'shiki';
import type { ComputedRef, Ref } from 'vue';

export type UseCodeBlockOptions = CodeBlockProps;

export interface CodeBlockReturns {
  // State refs (for v-model binding)
  highlightedHtml: Ref<string | null>;
  isCopied: Ref<boolean>;
  isExpanded: Ref<boolean>;
  isLoading: Ref<boolean>;

  // Computed
  languageDisplayName: ComputedRef<string>;
  lineCount: ComputedRef<number>;
  shouldCollapse: ComputedRef<boolean>;
  isCollapsed: ComputedRef<boolean>;

  // Actions
  copyCode: () => Promise<void>;
  toggleExpanded: () => void;
}

const LANGUAGE_DISPLAY_NAMES: Record<string, string> = {
  typescript: 'TypeScript',
  javascript: 'JavaScript',
  python: 'Python',
  tsx: 'TSX',
  jsx: 'JSX',
  json: 'JSON',
  bash: 'Bash',
  shell: 'Shell',
  css: 'CSS',
  html: 'HTML',
  markdown: 'Markdown',
  sql: 'SQL',
  yaml: 'YAML',
  go: 'Go',
  rust: 'Rust',
  text: 'Plain Text',
};

const MAX_HTML_CACHE_ENTRIES = 64;

// Dynamic import for Shiki (client-side only)
async function loadShiki() {
  return import('shiki');
}

// Theme helpers
function getSystemTheme(): 'light' | 'dark' {
  if (import.meta.env.SSR) return 'light';
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function getDocumentTheme(): 'light' | 'dark' | null {
  if (import.meta.env.SSR) return null;
  const root = document.documentElement;
  const dataTheme = root.getAttribute('data-theme')?.toLowerCase();
  if (dataTheme === 'dark') return 'dark';
  if (dataTheme === 'light') return 'light';
  if (root.classList.contains('dark')) return 'dark';
  if (root.classList.contains('light')) return 'light';
  // Story environments: .dark on wrapper div instead of html
  if (document.querySelector('.dark')) return 'dark';
  return null;
}

export function useCodeBlock(options: UseCodeBlockOptions): CodeBlockReturns {
  usePropsValidator(SerializableCodeBlockSchema, options, 'CodeBlock');

  const {
    code,
    language,
    lineNumbers,
    highlightLines,
    maxCollapsedLines,
    sanitize,
  } = options;

  // State
  const highlightedHtml = ref<string | null>(null);

  // Sanitize
  const { sanitizeHtml } = useSanitize(sanitize ?? false);
  const isCopied = ref(false);
  const isExpanded = ref(false);
  const isLoading = ref(true);
  const resolvedTheme = ref<'light' | 'dark'>('light');

  // Cache
  const htmlCache = new Map<string, string>();

  // Race guard — prevents stale async highlights from overwriting newer ones
  let highlightVersion = 0;

  // Highlighter singleton
  let highlighterPromise: Promise<Highlighter> | null = null;

  async function getHighlighter(): Promise<Highlighter> {
    if (!highlighterPromise) {
      const shiki = await loadShiki();
      // Import themes dynamically
      const [pierreDarkTheme, pierreLightTheme] = await Promise.all([
        import('../pierre-dark-theme.js'),
        import('../pierre-light-theme.js'),
      ]);
      highlighterPromise = shiki.createHighlighter({
        themes: [pierreDarkTheme.default as never, pierreLightTheme.default as never],
        langs: [],
        engine: shiki.createJavaScriptRegexEngine(),
      });
    }
    return highlighterPromise;
  }

  function updateTheme() {
    resolvedTheme.value = getDocumentTheme() ?? getSystemTheme();
  }

  function getCacheKey(
    codeValue: string,
    lang: string,
    theme: string,
    lineNums: CodeBlockLineNumbersMode,
    highlightLinesValue?: number[],
  ): string {
    return JSON.stringify({
      code: codeValue,
      language: lang,
      theme,
      lineNumbers: lineNums,
      highlightLines: highlightLinesValue ?? null,
    });
  }

  function setCachedHtml(cacheKey: string, html: string): void {
    if (htmlCache.has(cacheKey)) {
      htmlCache.set(cacheKey, html);
      return;
    }
    if (htmlCache.size >= MAX_HTML_CACHE_ENTRIES) {
      const oldestKey = htmlCache.keys().next().value;
      if (typeof oldestKey === 'string') {
        htmlCache.delete(oldestKey);
      }
    }
    htmlCache.set(cacheKey, html);
  }

  async function highlightCode() {
    const version = ++highlightVersion;
    const theme = resolvedTheme.value === 'dark' ? 'pierre-dark' : 'pierre-light';
    const cacheKey = getCacheKey(
      code ?? '',
      language ?? 'text',
      theme,
      lineNumbers ?? 'visible',
      highlightLines,
    );

    const cached = htmlCache.get(cacheKey);
    if (cached) {
      highlightedHtml.value = cached;
      isLoading.value = false;
      return;
    }

    if (!code) {
      highlightedHtml.value = '';
      isLoading.value = false;
      return;
    }

    try {
      const highlighter = await getHighlighter();
      // Discard result if a newer highlight call started while we awaited
      if (version !== highlightVersion) return;
      const loadedLangs = highlighter.getLoadedLanguages();
      const lang = language ?? 'text';

      if (!loadedLangs.includes(lang)) {
        await highlighter.loadLanguage(lang as Parameters<typeof highlighter.loadLanguage>[0]);
      }

      const showLineNumbers = lineNumbers !== 'hidden';
      const lineNumberWidth = `${String(lineCount.value).length + 0.5}ch`;

      const html = highlighter.codeToHtml(code, {
        lang,
        theme,
        transformers: [
          {
            line(node: { properties: Record<string, unknown>; children: unknown[] }, line: number) {
              node.properties['data-line'] = line;
              if (highlightLines?.includes(line)) {
                const highlightBg = resolvedTheme.value === 'dark'
                  ? 'rgba(255,255,255,0.1)'
                  : 'rgba(0,0,0,0.05)';
                node.properties.style = `background:${highlightBg};`;
              }
              if (showLineNumbers) {
                node.children.unshift({
                  type: 'element',
                  tagName: 'span',
                  properties: {
                    style: `display:inline-block;width:${lineNumberWidth};text-align:right;margin-right:1.5em;user-select:none;opacity:0.5;`,
                    'aria-hidden': 'true',
                  },
                  children: [{ type: 'text', value: String(line) }],
                });
              }
            },
          } as ShikiTransformer,
        ],
      });

      const safeHtml = sanitizeHtml(html);
      setCachedHtml(cacheKey, safeHtml);
      highlightedHtml.value = safeHtml;
    } catch {
      // Fallback to escaped text
      const escaped = code
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
      highlightedHtml.value = `<pre><code>${escaped}</code></pre>`;
    } finally {
      isLoading.value = false;
    }
  }

  // Copy functionality
  async function copyCode() {
    try {
      await navigator.clipboard.writeText(code);
      isCopied.value = true;
      setTimeout(() => {
        isCopied.value = false;
      }, 2000);
    } catch {
      // Ignore copy errors
    }
  }

  function toggleExpanded() {
    isExpanded.value = !isExpanded.value;
  }

  // Computed values
  const languageDisplayName = computed(() => {
    return LANGUAGE_DISPLAY_NAMES[language?.toLowerCase() ?? 'text'] || (language?.toUpperCase() ?? 'Text');
  });

  const lineCount = computed(() => code.split('\n').length);
  const shouldCollapse = computed(() => !!maxCollapsedLines && lineCount.value > maxCollapsedLines);
  const isCollapsed = computed(() => shouldCollapse.value && !isExpanded.value);

  // Watch for changes
  watch(
    () => [code, language, lineNumbers, highlightLines, resolvedTheme.value],
    () => {
      isLoading.value = true;
      highlightCode();
    },
    { immediate: true },
  );

  // Theme detection
  let mql: MediaQueryList | undefined;
  let observer: MutationObserver | undefined;

  onMounted(() => {
    updateTheme();

    mql = window.matchMedia?.('(prefers-color-scheme: dark)');
    mql?.addEventListener('change', updateTheme);

    observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class', 'data-theme'],
    });
  });

  onBeforeUnmount(() => {
    mql?.removeEventListener('change', updateTheme);
    observer?.disconnect();
  });

  return {
    // State refs
    highlightedHtml,
    isCopied,
    isExpanded,
    isLoading,

    // Computed
    languageDisplayName,
    lineCount,
    shouldCollapse,
    isCollapsed,

    // Actions
    copyCode,
    toggleExpanded,
  };
}
