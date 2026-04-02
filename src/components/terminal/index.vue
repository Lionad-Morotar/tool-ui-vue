<script setup lang="ts">
import { ref, computed } from "vue";
import { cn } from "./_adapter";
import type { TerminalProps } from "./schema";
import { Copy, Check, ChevronDown, ChevronUp, Terminal as TerminalIcon } from "lucide-vue-next";
import AnsiToHtml from "ansi-to-html";

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
    return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
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
  const trimmedTrailingNewlines = output.replace(/\n+$/, "");
  if (!trimmedTrailingNewlines) return 0;
  return trimmedTrailingNewlines.split("\n").length;
}

const fullOutput = computed(() => [props.stdout, props.stderr].filter(Boolean).join("\n"));
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
    <div class="border-border bg-card overflow-hidden rounded-lg border shadow-xs">
      <!-- Header -->
      <div class="bg-card flex items-center justify-between border-b px-4 py-2">
        <div class="flex items-center gap-2 overflow-hidden">
          <TerminalIcon class="text-muted-foreground h-4 w-4 shrink-0" />
          <code class="text-foreground truncate font-mono text-xs">
            <span v-if="cwd" class="text-muted-foreground">{{ cwd }}$ </span>
            {{ command }}
          </code>
        </div>
        <div class="flex items-center gap-3">
          <span
            v-if="formattedDuration"
            class="text-muted-foreground font-mono text-sm tabular-nums"
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
              'inline-flex items-center justify-center rounded-md h-7 w-7 p-0 text-sm font-medium transition-colors',
              'hover:bg-accent hover:text-accent-foreground',
              'focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-2',
              !hasOutput && 'opacity-50 cursor-not-allowed',
            )"
            :aria-label="!hasOutput
              ? 'No output to copy'
              : isCopied
                ? 'Copied'
                : 'Copy output'"
            @click="copyOutput"
          >
            <Check
              v-if="hasOutput && isCopied"
              class="h-4 w-4 text-green-700 dark:text-green-400"
            />
            <Copy
              v-else
              class="text-muted-foreground h-4 w-4"
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
              class="text-foreground whitespace-pre"
              v-html="ansiToHtml(stdout)"
            />
            <div
              v-if="stderr"
              class="mt-2 whitespace-pre text-red-500 dark:text-red-400"
              v-html="ansiToHtml(stderr)"
            />
            <div
              v-if="truncated"
              class="text-muted-foreground mt-2 text-xs italic"
            >
              Output truncated...
            </div>
          </div>

          <!-- Gradient overlay when collapsed -->
          <div
            v-if="isCollapsed"
            class="from-card absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t to-transparent"
          />
        </div>

        <!-- Collapse Toggle -->
        <button
          v-if="shouldCollapse"
          type="button"
          :class="cn(
            'text-muted-foreground w-full rounded-none border-t font-normal',
            'inline-flex items-center justify-center px-4 py-2 text-sm transition-colors',
            'hover:bg-accent hover:text-accent-foreground',
            'focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-2',
          )"
          @click="toggleExpanded"
        >
          <template v-if="isCollapsed">
            <ChevronDown class="mr-1 size-4" />
            Show all {{ lineCount }} lines
          </template>
          <template v-else>
            <ChevronUp class="mr-1 size-4" />
            Collapse
          </template>
        </button>
      </template>

      <!-- Empty State -->
      <div
        v-else
        class="text-muted-foreground px-4 py-3 font-mono text-sm italic"
      >
        No output
      </div>
    </div>
  </div>
</template>
