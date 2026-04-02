<script setup lang="ts">
import { Copy, Check, ChevronDown, ChevronUp } from 'lucide-vue-next';
import { computed, ref } from 'vue';
import { cn } from './_adapter';
import {
  computeUnifiedDiff,
  computeSplitDiff,
  parsePatchToUnifiedDiff,
  parsePatchToSplitDiff,
} from './diff';
import { useResolvedTheme } from './use-theme';
import type { CodeDiffProps } from './schema';

const props = defineProps<CodeDiffProps>();

// Theme detection
const resolvedTheme = useResolvedTheme();

// State
const isCopied = ref(false);
const isExpanded = ref(false);

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
  return (
    LANGUAGE_DISPLAY_NAMES[props.language?.toLowerCase() ?? 'text'] ||
    (props.language?.toUpperCase() ?? 'Text')
  );
});

// Mode detection
const isPatchMode = computed(() => !!props.patch);

// Compute diff using the diff library
const fileDiff = computed(() => {
  if (isPatchMode.value) {
    return parsePatchToUnifiedDiff(props.patch ?? '');
  }
  return computeUnifiedDiff(
    props.oldCode ?? '',
    props.newCode ?? '',
    props.filename ?? 'file',
  );
});

const splitDiff = computed(() => {
  if (isPatchMode.value) {
    return parsePatchToSplitDiff(props.patch ?? '');
  }
  return computeSplitDiff(
    props.oldCode ?? '',
    props.newCode ?? '',
    props.filename ?? 'file',
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
    props.maxCollapsedLines !== undefined &&
    lineCount.value > props.maxCollapsedLines
  );
});

const isCollapsed = computed(
  () => shouldCollapse.value && !isExpanded.value,
);

// Copy functionality
const copyableCode = computed(() => {
  return isPatchMode.value
    ? (props.patch ?? '')
    : (props.newCode ?? props.oldCode ?? '');
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
  return unifiedLines.value.slice(0, props.maxCollapsedLines ?? 12);
});

const displaySplitLines = computed(() => {
  if (!shouldCollapse.value || isExpanded.value) {
    return splitDiff.value.lines;
  }
  return splitDiff.value.lines.slice(0, props.maxCollapsedLines ?? 12);
});

// Check if diff style is split
const isSplitMode = computed(() => props.diffStyle === 'split');

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
</script>

<template>
  <div
    :class="cn('@container flex w-full min-w-80 flex-col gap-3', className)"
    :data-tool-ui-id="id"
    data-slot="code-diff"
  >
    <div class="overflow-hidden rounded-lg border border-border bg-card shadow-xs">
      <!-- Header -->
      <div class="flex items-center justify-between gap-2 border-b bg-card px-4 py-2">
        <div class="flex items-center gap-1">
          <span class="text-sm text-muted-foreground">
            {{ languageDisplayName }}
          </span>
          <template v-if="filename">
            <span class="text-muted-foreground/50">&bull;</span>
            <span class="text-sm font-medium text-foreground">{{ filename }}</span>
          </template>
        </div>
        <div class="flex items-center gap-3">
          <span v-if="hasChanges" class="font-mono text-xs tabular-nums">
            <span v-if="stats.additions > 0" class="text-[#00cab1] dark:text-[#2ee8c8]">+{{ stats.additions }}</span>
            <span v-if="stats.additions > 0 && stats.deletions > 0"> </span>
            <span v-if="stats.deletions > 0" class="text-[#ff2e3f] dark:text-[#ff5c6a]">-{{ stats.deletions }}</span>
          </span>
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
            <check v-if="isCopied" class="h-4 w-4 text-green-700 dark:text-green-400" />
            <copy v-else class="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
      </div>

      <!-- Content -->
      <div
        :class="cn('overflow-x-auto overflow-y-clip text-sm', isCollapsed && 'max-h-[200px]')"
      >
        <!-- Unified Diff Mode -->
        <template v-if="!isSplitMode">
          <div
            v-for="(line, index) in displayUnifiedLines"
            :key="index"
            class="flex font-mono"
            :class="[
              line.type === 'addition' && additionBgColor,
              line.type === 'deletion' && deletionBgColor,
            ]"
          >
            <template v-if="lineNumbers !== 'hidden'">
              <span
                class="w-10 shrink-0 border-r border-border/50 px-2 py-0.5 text-right text-xs text-muted-foreground/60 select-none"
              >
                {{ line.oldLineNum ?? '' }}
              </span>
              <span
                class="w-10 shrink-0 border-r border-border/50 px-2 py-0.5 text-right text-xs text-muted-foreground select-none"
              >
                {{ line.newLineNum ?? '' }}
              </span>
            </template>
            <span
              class="flex-1 px-3 py-0.5 whitespace-pre"
              :class="[
                line.type === 'addition' && additionTextColor,
                line.type === 'deletion' && deletionTextColor,
              ]"
            >
              <span
                class="mr-1 select-none"
                :class="[
                  line.type === 'addition' && 'text-emerald-500',
                  line.type === 'deletion' && 'text-red-500',
                ]"
              >
                {{ line.type === 'addition' ? '+' : line.type === 'deletion' ? '-' : ' ' }}
              </span>
              <!-- Word-level diff highlighting -->
              <template v-if="line.wordDiffs && line.wordDiffs.length > 0">
                <span
                  v-for="(part, partIndex) in line.wordDiffs"
                  :key="partIndex"
                  :class="[
                    part.added && wordAdditionBg,
                    part.removed && wordDeletionBg,
                    part.added && 'rounded px-0.5',
                    part.removed && 'rounded px-0.5',
                  ]"
                >{{ part.value }}</span>
              </template>
              <template v-else>
                {{ line.content || ' ' }}
              </template>
            </span>
          </div>
        </template>

        <!-- Split Diff Mode -->
        <template v-else>
          <div class="flex">
            <!-- Old side -->
            <div class="min-w-0 flex-1 border-r border-border/50">
              <div
                v-for="(line, index) in displaySplitLines"
                :key="`old-${index}`"
                class="flex font-mono"
                :class="[
                  line.oldLine?.type === 'deletion' && deletionBgColor,
                ]"
              >
                <template v-if="lineNumbers !== 'hidden'">
                  <span
                    class="w-10 shrink-0 border-r border-border/50 px-2 py-0.5 text-right text-xs text-muted-foreground/60 select-none"
                  >
                    {{ line.oldLine?.lineNum ?? '' }}
                  </span>
                </template>
                <span
                  class="min-w-0 flex-1 overflow-hidden px-3 py-0.5 whitespace-pre"
                  :class="[
                    line.oldLine?.type === 'deletion' && deletionTextColor,
                  ]"
                >
                  <span
                    v-if="line.oldLine"
                    class="mr-1 select-none"
                    :class="line.oldLine.type === 'deletion' && 'text-red-500'"
                  >
                    {{ line.oldLine.type === 'deletion' ? '-' : ' ' }}
                  </span>
                  <!-- Word-level diff highlighting for old side -->
                  <template v-if="line.oldLine?.wordDiffs && line.oldLine.wordDiffs.length > 0">
                    <span
                      v-for="(part, partIndex) in line.oldLine.wordDiffs"
                      :key="partIndex"
                      :class="[
                        part.removed && wordDeletionBg,
                        part.removed && 'rounded px-0.5',
                      ]"
                    >{{ part.value }}</span>
                  </template>
                  <template v-else>
                    {{ line.oldLine?.content || ' ' }}
                  </template>
                </span>
              </div>
            </div>

            <!-- New side -->
            <div class="min-w-0 flex-1">
              <div
                v-for="(line, index) in displaySplitLines"
                :key="`new-${index}`"
                class="flex font-mono"
                :class="[
                  line.newLine?.type === 'addition' && additionBgColor,
                ]"
              >
                <template v-if="lineNumbers !== 'hidden'">
                  <span
                    class="w-10 shrink-0 border-r border-border/50 px-2 py-0.5 text-right text-xs text-muted-foreground select-none"
                  >
                    {{ line.newLine?.lineNum ?? '' }}
                  </span>
                </template>
                <span
                  class="min-w-0 flex-1 overflow-hidden px-3 py-0.5 whitespace-pre"
                  :class="[
                    line.newLine?.type === 'addition' && additionTextColor,
                  ]"
                >
                  <span
                    v-if="line.newLine"
                    class="mr-1 select-none"
                    :class="line.newLine.type === 'addition' && 'text-emerald-500'"
                  >
                    {{ line.newLine.type === 'addition' ? '+' : ' ' }}
                  </span>
                  <!-- Word-level diff highlighting for new side -->
                  <template v-if="line.newLine?.wordDiffs && line.newLine.wordDiffs.length > 0">
                    <span
                      v-for="(part, partIndex) in line.newLine.wordDiffs"
                      :key="partIndex"
                      :class="[
                        part.added && wordAdditionBg,
                        part.added && 'rounded px-0.5',
                      ]"
                    >{{ part.value }}</span>
                  </template>
                  <template v-else>
                    {{ line.newLine?.content || ' ' }}
                  </template>
                </span>
              </div>
            </div>
          </div>
        </template>
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
          Show full diff
        </template>
        <template v-else>
          <chevron-up class="mr-1 size-4" />
          Collapse
        </template>
      </button>
    </div>
  </div>
</template>
