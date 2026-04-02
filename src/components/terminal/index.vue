<script setup lang="ts">
import AnsiToHtml from 'ansi-to-html';
import { Copy, Check, ChevronDown, ChevronUp, Terminal as TerminalIcon } from 'lucide-vue-next';
import { ref, computed } from 'vue';
import { cn } from './_adapter';
import type { TerminalProps } from './schema';

const props = defineProps<TerminalProps>();

// State
const isCopied = ref(false);
const isExpanded = ref(false);

// ANSI converter
const ansiConverter = new AnsiToHtml({
  newline: true,
  escapeXML: true,
  stream: false,
});

// Convert ANSI to HTML
function ansiToHtml(text: string): string {
  try {
    return ansiConverter.toHtml(text);
  } catch {
    return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
}

// Format duration
function formatDuration(durationMs?: number): string | null {
  if (durationMs == null) return null;
  if (durationMs < 1000) return `${Math.round(durationMs)}ms`;
  return `${(durationMs / 1000).toFixed(1)}s`;
}

const formattedDuration = computed(() => formatDuration(props.durationMs));

// Count output lines
function countOutputLines(output: string): number {
  const trimmedTrailingNewlines = output.replace(/\n+$/, '');
  if (!trimmedTrailingNewlines) return 0;
  return trimmedTrailingNewlines.split('\n').length;
}

const fullOutput = computed(() => [props.stdout, props.stderr].filter(Boolean).join('\n'));
const hasOutput = computed(() => Boolean(props.stdout || props.stderr));
const lineCount = computed(() => countOutputLines(fullOutput.value));

// Collapse logic
const shouldCollapse = computed(() => {
  return props.maxCollapsedLines !== undefined && lineCount.value > props.maxCollapsedLines;
});
const isCollapsed = computed(() => shouldCollapse.value && !isExpanded.value);

// Copy functionality
async function copyOutput() {
  if (!hasOutput.value) return;
  try {
    await navigator.clipboard.writeText(fullOutput.value);
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
</script>

<template>
  <div
    :class="cn(
      '@container flex w-full min-w-80 flex-col gap-3',
      className,
    )"
    :data-tool-ui-id="id"
    data-slot="terminal"
  >
    <div class="overflow-hidden rounded-lg border border-border bg-card shadow-xs">
      <!-- Header -->
      <div class="flex items-center justify-between border-b bg-card px-4 py-2">
        <div class="flex items-center gap-2 overflow-hidden">
          <terminal-icon class="h-4 w-4 shrink-0 text-muted-foreground" />
          <code class="truncate font-mono text-xs text-foreground">
            <span v-if="cwd" class="text-muted-foreground">{{ cwd }}$ </span>
            {{ command }}
          </code>
        </div>
        <div class="flex items-center gap-3">
          <span
            v-if="formattedDuration"
            class="font-mono text-sm text-muted-foreground tabular-nums"
          >
            {{ formattedDuration }}
          </span>
          <span
            :class="cn(
              'font-mono text-sm tabular-nums',
              exitCode === 0
                ? 'text-muted-foreground'
                : 'text-red-600 dark:text-red-400',
            )"
          >
            {{ exitCode }}
          </span>
          <button
            type="button"
            :disabled="!hasOutput"
            :class="cn(
              'inline-flex h-7 w-7 items-center justify-center rounded-md p-0 text-sm font-medium transition-colors',
              'hover:bg-accent hover:text-accent-foreground',
              'focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
              !hasOutput && 'cursor-not-allowed opacity-50',
            )"
            :aria-label="!hasOutput
              ? 'No output to copy'
              : isCopied
                ? 'Copied'
                : 'Copy output'"
            @click="copyOutput"
          >
            <check
              v-if="hasOutput && isCopied"
              class="h-4 w-4 text-green-700 dark:text-green-400"
            />
            <copy
              v-else
              class="h-4 w-4 text-muted-foreground"
            />
          </button>
        </div>
      </div>

      <!-- Output -->
      <template v-if="hasOutput">
        <div
          :class="cn(
            'relative font-mono text-sm',
            isCollapsed && 'max-h-[200px] overflow-hidden',
          )"
        >
          <div class="overflow-x-auto p-4">
            <div
              v-if="stdout"
              class="whitespace-pre text-foreground"
              v-html="ansiToHtml(stdout)"
            />
            <div
              v-if="stderr"
              class="mt-2 whitespace-pre text-red-500 dark:text-red-400"
              v-html="ansiToHtml(stderr)"
            />
            <div
              v-if="truncated"
              class="mt-2 text-xs text-muted-foreground italic"
            >
              Output truncated...
            </div>
          </div>

          <!-- Gradient overlay when collapsed -->
          <div
            v-if="isCollapsed"
            class="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-card to-transparent"
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
      </template>

      <!-- Empty State -->
      <div
        v-else
        class="px-4 py-3 font-mono text-sm text-muted-foreground italic"
      >
        No output
      </div>
    </div>
  </div>
</template>
