<script setup lang="ts">
import { cn } from '../core';
import { useI18n } from '../core/i18n';
import { Copy, Check, ChevronDown, ChevronUp } from 'lucide-vue-next';
import { computed, reactive, toRefs } from 'vue';
import { useCodeBlock } from './states';
import type { CodeBlockProps } from './schema';

defineOptions({ name: 'CmptCodeBlock', inheritAttrs: false })

const props = withDefaults(defineProps<CodeBlockProps>(), {
  language: 'text',
  lineNumbers: 'visible',
  css: () => ({}),
});

// All business logic delegated to states layer
const codeBlockState = reactive(useCodeBlock(props));

// Destructure state refs for v-model binding
const { highlightedHtml, isCopied, isLoading } = toRefs(codeBlockState);

// i18n
const { t } = useI18n()

// Derived i18n values for attribute bindings (type-safe unwrapping)
const copyButtonAriaLabel = computed(() =>
  isCopied.value ? t('codeBlock.copied').value : t('codeBlock.copyCode').value
)
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
        :class="cn(
          'flex items-center justify-between border-b border-border bg-card px-4 py-2',
          css?.header,
        )"
      >
        <div class="flex items-center gap-1">
          <span class="text-sm text-muted-foreground">
            {{ codeBlockState.languageDisplayName }}
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
            css?.copyButton,
          )"
          :aria-label="copyButtonAriaLabel"
          @click="codeBlockState.copyCode"
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
          'overflow-x-auto overflow-y-clip text-[13px] leading-[1.4] [&_code]:block [&_code]:w-full [&_pre]:bg-transparent [&_pre]:px-4 [&_pre]:py-4',
          codeBlockState.isCollapsed && 'max-h-[200px]',
          css?.content,
        )"
      >
        <div
          v-if="highlightedHtml"
          v-html="highlightedHtml"
        />
      </div>

      <!-- Collapse Toggle -->
      <button
        v-if="codeBlockState.shouldCollapse"
        type="button"
        :class="cn(
          'w-full rounded-none border-t border-border font-normal text-muted-foreground',
          'inline-flex items-center justify-center px-4 py-2 text-sm transition-colors',
          'hover:bg-accent hover:text-accent-foreground',
          'focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
        )"
        @click="codeBlockState.toggleExpanded"
      >
        <template v-if="codeBlockState.isCollapsed">
          <chevron-down class="mr-1 size-4" />
          {{ t('codeBlock.showAllLines', { count: codeBlockState.lineCount }) }}
        </template>
        <template v-else>
          <chevron-up class="mr-1 size-4" />
          {{ t('codeBlock.collapse') }}
        </template>
      </button>
    </div>
  </article>
</template>
