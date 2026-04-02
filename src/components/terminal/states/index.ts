// Terminal component state layer - Headless architecture
// All business logic lives here, index.vue is UI-only

import { ref, computed } from 'vue';
import AnsiToHtml from 'ansi-to-html';
import type { TerminalProps } from '../schema';

export interface UseTerminalOptions extends TerminalProps {}

export interface TerminalState {
  isCopied: boolean;
  isExpanded: boolean;
  formattedDuration: string | null;
  fullOutput: string;
  hasOutput: boolean;
  lineCount: number;
  shouldCollapse: boolean;
  isCollapsed: boolean;
  ansiToHtml: (text: string) => string;
  copyOutput: () => Promise<void>;
  toggleExpanded: () => void;
}

export function useTerminal(options: UseTerminalOptions): TerminalState {
  const { stdout, stderr, durationMs, maxCollapsedLines } = options;

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

  const formattedDuration = computed(() => formatDuration(durationMs));

  // Count output lines
  function countOutputLines(output: string): number {
    const trimmedTrailingNewlines = output.replace(/\n+$/, '');
    if (!trimmedTrailingNewlines) return 0;
    return trimmedTrailingNewlines.split('\n').length;
  }

  const fullOutput = computed(() => [stdout, stderr].filter(Boolean).join('\n'));
  const hasOutput = computed(() => Boolean(stdout || stderr));
  const lineCount = computed(() => countOutputLines(fullOutput.value));

  // Collapse logic
  const shouldCollapse = computed(() => {
    return maxCollapsedLines !== undefined && lineCount.value > maxCollapsedLines;
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

  return {
    isCopied: isCopied.value,
    isExpanded: isExpanded.value,
    formattedDuration: formattedDuration.value,
    fullOutput: fullOutput.value,
    hasOutput: hasOutput.value,
    lineCount: lineCount.value,
    shouldCollapse: shouldCollapse.value,
    isCollapsed: isCollapsed.value,
    ansiToHtml,
    copyOutput,
    toggleExpanded,
  };
}
