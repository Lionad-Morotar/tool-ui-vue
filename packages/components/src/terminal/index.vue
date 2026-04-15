<script setup lang="ts">
import { cn } from '@lionad/vtu-core';
import { useI18n } from '@lionad/vtu-core/i18n';
import { Copy, Check, ChevronDown, ChevronUp, Terminal as TerminalIcon } from 'lucide-vue-next';
import { computed, reactive, toRef } from 'vue';
import { useTerminal } from './states';
import type { TerminalProps } from './schema';

defineOptions({ name: 'CmptTerminal', inheritAttrs: false })

const props = withDefaults(defineProps<TerminalProps>(), {
  css: () => ({}),
})

// All business logic delegated to states layer
const state = reactive(useTerminal(props));

// Keep refs reactive
const isCopied = toRef(state, 'isCopied');

// i18n
const { t } = useI18n()

// Derived i18n values for attribute bindings (type-safe unwrapping)
const copyButtonAriaLabel = computed(() =>
  !state.hasOutput
    ? t('terminal.noOutputToCopy').value
    : isCopied.value
      ? t('terminal.copied').value
      : t('terminal.copyOutput').value
)
</script>

<template>
  <div
    v-bind="$attrs"
    :class="cn(
      '@container flex w-full min-w-80 flex-col gap-3',
      css?.root,
    )"
    :data-tool-ui-id="id"
    data-slot="terminal"
  >
    <div class="overflow-hidden rounded-lg border border-border bg-card shadow-xs">
      <!-- Header -->
      <div :class="cn('flex items-center justify-between border-b border-border bg-card px-4 py-2', css?.header)">
        <div class="flex items-center gap-2 overflow-hidden">
          <terminal-icon class="h-4 w-4 shrink-0 text-muted-foreground" />
          <code class="truncate font-mono text-xs text-foreground">
            <span v-if="cwd" class="text-muted-foreground">{{ cwd }}$ </span>
            {{ command }}
          </code>
        </div>
        <div class="flex items-center gap-3">
          <span
            v-if="state.formattedDuration"
            class="font-mono text-sm text-muted-foreground tabular-nums"
          >
            {{ state.formattedDuration }}
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
            :disabled="!state.hasOutput"
            :class="cn(
              'inline-flex h-7 w-7 items-center justify-center rounded-md p-0 text-sm font-medium transition-colors',
              'hover:bg-accent hover:text-accent-foreground',
              'focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
              !state.hasOutput && 'cursor-not-allowed opacity-50',
            )"
            :aria-label="copyButtonAriaLabel"
            @click="state.copyOutput"
          >
            <check
              v-if="state.hasOutput && isCopied"
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
      <template v-if="state.hasOutput">
        <div
          :class="cn(
            'relative font-mono text-sm',
            state.isCollapsed && 'max-h-[200px] overflow-hidden',
            css?.content,
          )"
        >
          <div class="overflow-x-auto p-4">
            <div
              v-if="stdout"
              class="whitespace-pre text-foreground"
              v-html="state.ansiToHtml(stdout)"
            />
            <div
              v-if="stderr"
              class="mt-2 whitespace-pre text-red-500 dark:text-red-400"
              v-html="state.ansiToHtml(stderr)"
            />
            <div
              v-if="truncated"
              class="mt-2 text-xs text-muted-foreground italic"
            >
              {{ t('terminal.outputTruncated') }}
            </div>
          </div>

          <!-- Gradient overlay when collapsed -->
          <div
            v-if="state.isCollapsed"
            class="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-card to-transparent"
          />
        </div>

        <!-- Collapse Toggle -->
        <button
          v-if="state.shouldCollapse"
          type="button"
          :class="cn(
            'w-full rounded-none border-t border-border font-normal text-muted-foreground',
            'inline-flex items-center justify-center px-4 py-2 text-sm transition-colors',
            'hover:bg-accent hover:text-accent-foreground',
            'focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
          )"
          @click="state.toggleExpanded"
        >
          <template v-if="state.isCollapsed">
            <chevron-down class="mr-1 size-4" />
            {{ t('terminal.showAllLines', { count: state.lineCount }) }}
          </template>
          <template v-else>
            <chevron-up class="mr-1 size-4" />
            {{ t('terminal.collapse') }}
          </template>
        </button>
      </template>

      <!-- Empty State -->
      <div
        v-else
        class="px-4 py-3 font-mono text-sm text-muted-foreground italic"
      >
        {{ t('terminal.noOutput') }}
      </div>
    </div>
  </div>
</template>
