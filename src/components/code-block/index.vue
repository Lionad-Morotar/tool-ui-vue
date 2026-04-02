<script setup lang="ts">
import { Copy, Check, ChevronDown, ChevronUp } from 'lucide-vue-next';
import { ref, computed, watch, onMounted } from 'vue';
import { cn } from './_adapter';
import type { CodeBlockProps, CodeBlockLineNumbersMode } from './schema';
import type { Highlighter, ShikiTransformer } from 'shiki';

// Dynamic import for Shiki (client-side only)
async function loadShiki() {
  return import('shiki');
}

defineOptions({ name: 'cmpt-code-block', inheritAttrs: false })

const props = withDefaults(defineProps<CodeBlockProps & { css?: { root?: string } }>(), {
  language: 'text',
  lineNumbers: 'visible',
  css: () => ({ root: '' })
});

const MAX_HTML_CACHE_ENTRIES = 64;

// State
const highlightedHtml = ref<string | null>(null);
const isCopied = ref(false);
const isExpanded = ref(false);
const isLoading = ref(true);

// Theme detection
const resolvedTheme = ref<'light' | 'dark'>('light');

function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function getDocumentTheme(): 'light' | 'dark' | null {
  if (typeof document === 'undefined') return null;
  const root = document.documentElement;
  const dataTheme = root.getAttribute('data-theme')?.toLowerCase();
  if (dataTheme === 'dark') return 'dark';
  if (dataTheme === 'light') return 'light';
  if (root.classList.contains('dark')) return 'dark';
  if (root.classList.contains('light')) return 'light';
  return null;
}

function updateTheme() {
  resolvedTheme.value = getDocumentTheme() ?? getSystemTheme();
}

// Cache
const htmlCache = new Map<string, string>();

function getCacheKey(
  code: string,
  language: string,
  theme: string,
  lineNumbers: CodeBlockLineNumbersMode,
  highlightLines?: number[],
): string {
  return JSON.stringify({
    code,
    language,
    theme,
    lineNumbers,
    highlightLines: highlightLines ?? null,
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

// Language display names
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

const languageDisplayName = computed(() => {
  return LANGUAGE_DISPLAY_NAMES[props.language?.toLowerCase() ?? 'text'] || (props.language?.toUpperCase() ?? 'Text');
});

// Line count and collapse logic
const lineCount = computed(() => props.code.split('\n').length);
const shouldCollapse = computed(() => {
  return !!props.maxCollapsedLines && lineCount.value > props.maxCollapsedLines;
});
const isCollapsed = computed(() => shouldCollapse.value && !isExpanded.value);

// Highlight code
let highlighterPromise: Promise<Highlighter> | null = null;

async function getHighlighter(): Promise<Highlighter> {
  if (!highlighterPromise) {
    const shiki = await loadShiki();
    // Import themes dynamically
    const [pierreDarkTheme, pierreLightTheme] = await Promise.all([
      import('../../shared/pierre-dark-theme.js'),
      import('../../shared/pierre-light-theme.js'),
    ]);
    highlighterPromise = shiki.createHighlighter({
      themes: [pierreDarkTheme.default as never, pierreLightTheme.default as never],
      langs: [],
      engine: shiki.createJavaScriptRegexEngine(),
    });
  }
  return highlighterPromise;
}

async function highlightCode() {
  const theme = resolvedTheme.value === 'dark' ? 'pierre-dark' : 'pierre-light';
  const cacheKey = getCacheKey(
    props.code,
    props.language ?? 'text',
    theme,
    props.lineNumbers ?? 'visible',
    props.highlightLines,
  );

  const cached = htmlCache.get(cacheKey);
  if (cached) {
    highlightedHtml.value = cached;
    isLoading.value = false;
    return;
  }

  if (!props.code) {
    highlightedHtml.value = '';
    isLoading.value = false;
    return;
  }

  try {
    const highlighter = await getHighlighter();
    const loadedLangs = highlighter.getLoadedLanguages();
    const language = props.language ?? 'text';

    if (!loadedLangs.includes(language)) {
      await highlighter.loadLanguage(language as Parameters<typeof highlighter.loadLanguage>[0]);
    }

    const showLineNumbers = props.lineNumbers !== 'hidden';
    const lineNumberWidth = `${String(lineCount.value).length + 0.5}ch`;

    const html = highlighter.codeToHtml(props.code, {
      lang: language,
      theme,
      transformers: [
        {
          line(node: { properties: Record<string, unknown>; children: unknown[] }, line: number) {
            node.properties['data-line'] = line;
            if (props.highlightLines?.includes(line)) {
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

    setCachedHtml(cacheKey, html);
    highlightedHtml.value = html;
  } catch {
    // Fallback to escaped text
    const escaped = props.code
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
    await navigator.clipboard.writeText(props.code);
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

// Watch for changes
watch(
  () => [props.code, props.language, props.lineNumbers, props.highlightLines, resolvedTheme.value],
  () => {
    isLoading.value = true;
    highlightCode();
  },
  { immediate: true },
);

// Theme detection
onMounted(() => {
  updateTheme();

  const mql = window.matchMedia?.('(prefers-color-scheme: dark)');
  mql?.addEventListener('change', updateTheme);

  const observer = new MutationObserver(updateTheme);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class', 'data-theme'],
  });

  return () => {
    mql?.removeEventListener('change', updateTheme);
    observer.disconnect();
  };
});
</script>

<template>
  <article
    v-bind="$attrs"
    :class="cn(
      '@container flex w-full min-w-80 flex-col gap-3',
      css?.root,
    )"
    :data-tool-ui-id="id"
    data-slot="code-block"
    lang="en"
    :aria-busy="isLoading"
  >
    <div class="overflow-hidden rounded-lg border border-border bg-card shadow-xs">
      <!-- Header -->
      <div
        class="flex items-center justify-between border-b bg-card px-4 py-2"
      >
        <div class="flex items-center gap-1">
          <span class="text-sm text-muted-foreground">
            {{ languageDisplayName }}
          </span>
          <template v-if="filename">
            <span class="text-muted-foreground/50">•</span>
            <span class="text-sm font-medium text-foreground">
              {{ filename }}
            </span>
          </template>
        </div>
        <button
          type="button"
          :class="cn(
            'inline-flex h-7 w-7 items-center justify-center rounded-md p-0 text-sm font-medium transition-colors',
            'hover:bg-accent hover:text-accent-foreground',
            'focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
          )"
          :aria-label="isCopied ? 'Copied' : 'Copy code'"
          @click="copyCode"
        >
          <check
            v-if="isCopied"
            class="h-4 w-4 text-green-700 dark:text-green-400"
          />
          <copy
            v-else
            class="h-4 w-4 text-muted-foreground"
          />
        </button>
      </div>

      <!-- Content -->
      <div
        :class="cn(
          'overflow-x-auto overflow-y-clip text-[13px] leading-[1.4] [&_pre]:bg-transparent [&_pre]:py-4',
          isCollapsed && 'max-h-[200px]',
        )"
      >
        <div
          v-if="highlightedHtml"
          v-html="highlightedHtml"
        />
      </div>

      <!-- Collapse Toggle -->
      <button
        v-if="shouldCollapse"
        type="button"
        :class="cn(
          'w-full rounded-none border-t font-normal text-muted-foreground',
          'inline-flex items-center justify-center px-4 py-2 text-sm transition-colors',
          'hover:bg-accent hover:text-accent-foreground',
          'focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
        )"
        @click="toggleExpanded"
      >
        <template v-if="isCollapsed">
          <chevron-down class="mr-1 size-4" />
          Show all {{ lineCount }} lines
        </template>
        <template v-else>
          <chevron-up class="mr-1 size-4" />
          Collapse
        </template>
      </button>
    </div>
  </article>
</template>
