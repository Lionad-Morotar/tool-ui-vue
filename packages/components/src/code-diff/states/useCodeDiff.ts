import { computed, ref } from 'vue';
import {
  computeUnifiedDiff,
  computeSplitDiff,
  parsePatchToUnifiedDiff,
  parsePatchToSplitDiff,
} from '../diff';
import { useResolvedTheme } from '../use-theme';
import type { FileDiff, SplitDiff, DiffLine, SplitLine } from '../diff';
import type { CodeDiffProps } from '../schema';
import type { ComputedRef, Ref } from 'vue';

export type UseCodeDiffOptions = CodeDiffProps;

export interface CodeDiffReturns {
  // State refs
  isCopied: Ref<boolean>;
  isExpanded: Ref<boolean>;

  // Computed state
  isPatchMode: ComputedRef<boolean>;
  fileDiff: ComputedRef<FileDiff>;
  splitDiff: ComputedRef<SplitDiff>;
  unifiedLines: ComputedRef<DiffLine[]>;
  stats: ComputedRef<{ additions: number; deletions: number }>;
  hasChanges: ComputedRef<boolean>;
  lineCount: ComputedRef<number>;
  shouldCollapse: ComputedRef<boolean>;
  isCollapsed: ComputedRef<boolean>;
  copyableCode: ComputedRef<string>;
  isSplitMode: ComputedRef<boolean>;
  displayUnifiedLines: ComputedRef<DiffLine[]>;
  displaySplitLines: ComputedRef<SplitLine[]>;
  languageDisplayName: ComputedRef<string>;

  // Theme-based colors
  additionBgColor: ComputedRef<string>;
  deletionBgColor: ComputedRef<string>;
  additionTextColor: ComputedRef<string>;
  deletionTextColor: ComputedRef<string>;
  wordAdditionBg: ComputedRef<string>;
  wordDeletionBg: ComputedRef<string>;

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

export function useCodeDiff(options: UseCodeDiffOptions): CodeDiffReturns {
  // 不解构 options：在 computed getter 内按需读取 options.xxx，
  // Vue 才能收集 props 依赖；setup 同步作用域解构会得到首帧快照，
  // 父层 setProps 新引用后组件不更新。

  // Theme detection
  const resolvedTheme = useResolvedTheme();

  // State
  const isCopied = ref(false);
  const isExpanded = ref(false);

  // Language display name
  const languageDisplayName = computed(() => {
    return (
      LANGUAGE_DISPLAY_NAMES[options.language?.toLowerCase() ?? 'text'] ||
      (options.language?.toUpperCase() ?? 'Text')
    );
  });

  // Mode detection
  const isPatchMode = computed(() => !!options.patch);

  // Compute diff using the diff library
  const fileDiff = computed(() => {
    if (isPatchMode.value) {
      return parsePatchToUnifiedDiff(options.patch ?? '');
    }
    return computeUnifiedDiff(
      options.oldCode ?? '',
      options.newCode ?? '',
      options.filename ?? 'file',
    );
  });

  const splitDiff = computed(() => {
    if (isPatchMode.value) {
      return parsePatchToSplitDiff(options.patch ?? '');
    }
    return computeSplitDiff(
      options.oldCode ?? '',
      options.newCode ?? '',
      options.filename ?? 'file',
    );
  });

  // Flattened unified diff lines for display
  const unifiedLines = computed(() => {
    return fileDiff.value.hunks.flatMap((h) => h.lines);
  });

  // Calculate additions and deletions count
  const stats = computed(() => {
    return {
      additions: fileDiff.value.additions,
      deletions: fileDiff.value.deletions,
    };
  });

  const hasChanges = computed(
    () => stats.value.additions > 0 || stats.value.deletions > 0,
  );

  // Line count and collapse logic
  const lineCount = computed(() => {
    return fileDiff.value.unifiedLineCount;
  });

  const shouldCollapse = computed(() => {
    return (
      options.maxCollapsedLines !== undefined &&
      lineCount.value > options.maxCollapsedLines
    );
  });

  const isCollapsed = computed(
    () => shouldCollapse.value && !isExpanded.value,
  );

  // Copy functionality
  const copyableCode = computed(() => {
    return isPatchMode.value
      ? (options.patch ?? '')
      : (options.newCode ?? options.oldCode ?? '');
  });

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(copyableCode.value);
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

  // Display lines (respecting collapse)
  const displayUnifiedLines = computed(() => {
    if (!shouldCollapse.value || isExpanded.value) {
      return unifiedLines.value;
    }
    return unifiedLines.value.slice(0, options.maxCollapsedLines ?? 12);
  });

  const displaySplitLines = computed(() => {
    if (!shouldCollapse.value || isExpanded.value) {
      return splitDiff.value.lines;
    }
    return splitDiff.value.lines.slice(0, options.maxCollapsedLines ?? 12);
  });

  // Check if diff style is split
  const isSplitMode = computed(() => options.diffStyle === 'split');

  // Theme-based colors
  const additionBgColor = computed(() =>
    resolvedTheme.value === 'dark' ? 'bg-emerald-950/30' : 'bg-emerald-50/50',
  );

  const deletionBgColor = computed(() =>
    resolvedTheme.value === 'dark' ? 'bg-red-950/30' : 'bg-red-50/50',
  );

  const additionTextColor = computed(() =>
    resolvedTheme.value === 'dark'
      ? 'text-emerald-300'
      : 'text-emerald-700',
  );

  const deletionTextColor = computed(() =>
    resolvedTheme.value === 'dark' ? 'text-red-300' : 'text-red-700',
  );

  // Word-level diff highlight colors
  const wordAdditionBg = computed(() =>
    resolvedTheme.value === 'dark' ? 'bg-emerald-500/40' : 'bg-emerald-400/40',
  );

  const wordDeletionBg = computed(() =>
    resolvedTheme.value === 'dark' ? 'bg-red-500/40' : 'bg-red-400/40',
  );

  return {
    // State refs
    isCopied,
    isExpanded,

    // Computed state
    isPatchMode,
    fileDiff,
    splitDiff,
    unifiedLines,
    stats,
    hasChanges,
    lineCount,
    shouldCollapse,
    isCollapsed,
    copyableCode,
    isSplitMode,
    displayUnifiedLines,
    displaySplitLines,
    languageDisplayName,

    // Theme-based colors
    additionBgColor,
    deletionBgColor,
    additionTextColor,
    deletionTextColor,
    wordAdditionBg,
    wordDeletionBg,

    // Actions
    copyCode,
    toggleExpanded,
  };
}
