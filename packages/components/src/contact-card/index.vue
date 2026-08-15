<script setup lang="ts">
import { reactive } from 'vue';
import { cn } from '../core';
import { useContactCard } from './states';
import { useI18n } from '../core/i18n';
import type { ContactCardProps } from './schema';

defineOptions({ name: 'CmptContactCard', inheritAttrs: false })

const props = withDefaults(defineProps<ContactCardProps>(), {
  css: () => ({}),
})

// i18n
const { t } = useI18n();

// All business logic delegated to states layer
const state = reactive(useContactCard(props));

// Default label key per kind
const kindLabelKey = (kind: string): string => `contactCard.${kind}`;
</script>

<template>
  <article
    v-bind="$attrs"
    :class="cn('relative w-full max-w-md min-w-72', css?.root)"
    :lang="state.locale"
    :data-tool-ui-id="id"
    data-slot="contact-card"
  >
    <div
      :class="cn(
        'group/contact @container relative isolate flex w-full min-w-0 overflow-hidden rounded-xl',
        'border border-border bg-card text-sm shadow-xs',
        'transition-colors duration-150',
        (state.sanitizedHref || state.isCopyable) && 'cursor-pointer hover:border-foreground/25 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none',
      )"
      :role="state.sanitizedHref ? 'link' : undefined"
      :tabindex="state.sanitizedHref || state.isCopyable ? 0 : undefined"
      :data-copyable="state.isCopyable"
      @click="state.handleClick"
      @keydown="state.handleKeyDown"
    >
      <!-- Left: Icon -->
      <div :class="cn('flex shrink-0 items-start justify-center p-4', css?.icon)">
        <svg
          :viewBox="state.icon.viewBox"
          class="size-5 shrink-0 text-muted-foreground"
          aria-hidden="true"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path :d="state.icon.path" />
        </svg>
      </div>

      <!-- Right: Content -->
      <div class="flex min-w-0 flex-1 flex-col justify-center py-4 pr-4">
        <!-- Label -->
        <span
          :class="cn('text-xs text-muted-foreground', css?.label)"
        >
          {{ state.displayLabel ?? t(kindLabelKey(kind)).value }}
        </span>

        <!-- Value -->
        <span
          :class="cn(
            'text-sm font-medium text-foreground',
            kind === 'address' && 'whitespace-pre-line',
            css?.value,
          )"
        >
          {{ value }}
        </span>

        <!-- Description -->
        <span
          v-if="description"
          :class="cn('text-xs text-muted-foreground/80', css?.description)"
        >
          {{ description }}
        </span>

        <!-- Copy feedback -->
        <span
          v-if="state.copied"
          class="mt-0.5 text-xs text-emerald-600"
        >
          {{ t('shared.copied').value }}
        </span>
      </div>

      <!-- Action indicator -->
      <div
        v-if="state.sanitizedHref || state.isCopyable"
        class="flex shrink-0 items-center pr-4 opacity-0 transition-opacity group-hover/contact:opacity-100"
      >
        <!-- External link icon -->
        <svg
          v-if="state.sanitizedHref && !state.isCopyable"
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="size-3.5 text-muted-foreground"
        >
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
          <polyline points="15 3 21 3 21 9" />
          <line
            x1="10"
            x2="21"
            y1="14"
            y2="3"
          />
        </svg>

        <!-- Copy icon -->
        <svg
          v-if="state.isCopyable"
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="size-3.5 text-muted-foreground"
        >
          <rect
            x="9"
            y="9"
            width="13"
            height="13"
            rx="2"
            ry="2"
          />
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
      </div>
    </div>
  </article>
</template>
