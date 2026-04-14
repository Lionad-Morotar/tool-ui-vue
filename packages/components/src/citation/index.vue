<script setup lang="ts">
import { cn } from '@lionad/vtu-core';
import { useI18n } from '@lionad/vtu-core/i18n';
import { reactive } from 'vue';
import { useCitation } from './states';
import { usePopover } from './states/usePopover';
import type { CitationProps } from './schema';

defineOptions({ name: 'CmptCitation', inheritAttrs: false })

const props = withDefaults(defineProps<CitationProps & { css?: { root?: string } }>(), {
  css: () => ({ root: '' })
})

const emit = defineEmits<{
  navigate: [href: string, citation: CitationProps];
}>();

// i18n
const { t } = useI18n();

// All business logic delegated to states layer
const state = reactive(useCitation(props, emit));

// Popover for inline variant
const popover = usePopover({ placement: 'top', id: `${props.id}-popover` });
</script>

<template>
  <!-- Inline variant with popover -->
  <div
    v-if="state.resolvedVariant === 'inline'"
    class="relative inline-block"
  >
    <button
      :ref="(el: any) => { if (el) popover.triggerRef.value = el as HTMLElement }"
      type="button"
      :aria-label="t('citation.viewSource').value"
      v-bind="popover.triggerAttrs()"
      :data-tool-ui-id="id"
      data-slot="citation"
      :class="cn(
        'inline-flex cursor-pointer items-center gap-1.5 rounded-md px-2 py-1',
        'bg-muted/60 text-sm outline-none',
        'transition-colors duration-150',
        'hover:bg-muted',
        'focus-visible:ring-2 focus-visible:ring-ring',
        css?.root
      )"
      :style="popover.supportsAnchor ? { anchorName: '--citation-inline' } : undefined"
      @mouseenter="popover.handleMouseEnter"
      @mouseleave="popover.handleMouseLeave"
      @click="state.handleClick"
      @keydown="popover.handleTriggerKeyDown"
    >
      <!-- Icon -->
      <img
        v-if="favicon"
        :src="favicon"
        alt=""
        aria-hidden="true"
        width="14"
        height="14"
        class="size-3.5 shrink-0 rounded bg-muted object-cover"
      />
      <svg
        v-else
        :viewBox="state.typeIcon.viewBox"
        class="size-3.5 shrink-0 opacity-60"
        aria-hidden="true"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path :d="state.typeIcon.path" />
      </svg>
      <span class="text-muted-foreground">{{ state.displayDomain }}</span>
    </button>

    <!-- Popover -->
    <div
      :ref="(el: any) => { if (el) popover.popoverRef.value = el as HTMLElement }"
      v-bind="popover.popoverAttrs()"
      :class="cn(
        'absolute bottom-full left-0 z-50 mb-2',
        'w-72 rounded-md border border-border bg-popover p-0 shadow-md',
        'cursor-pointer',
        popover.supportsAnchor && 'citation-popover--top'
      )"
      @mouseenter="popover.handleMouseEnter"
      @mouseleave="popover.handleMouseLeave"
      @click="state.handleClick"
      @keydown="popover.handlePopoverKeyDown"
    >
      <div class="flex flex-col gap-2 p-3 transition-colors hover:bg-muted/50">
        <div class="flex items-start gap-2">
          <img
            v-if="favicon"
            :src="favicon"
            alt=""
            aria-hidden="true"
            width="14"
            height="14"
            class="size-3.5 shrink-0 rounded bg-muted object-cover"
          />
          <svg
            v-else
            :viewBox="state.typeIcon.viewBox"
            class="size-3.5 shrink-0 opacity-60"
            aria-hidden="true"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path :d="state.typeIcon.path" />
          </svg>
          <span class="text-xs text-muted-foreground">{{ state.displayDomain }}</span>
        </div>
        <p class="text-sm leading-snug font-medium">{{ title }}</p>
        <p v-if="snippet" class="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
          {{ snippet }}
        </p>
      </div>
    </div>
  </div>

  <!-- Default variant: full card -->
  <article
    v-else
    v-bind="$attrs"
    :class="cn('relative w-full max-w-md min-w-72', css?.root)"
    :lang="state.locale"
    :data-tool-ui-id="id"
    data-slot="citation"
  >
    <div
      :class="cn(
        'group @container relative isolate flex w-full min-w-0 flex-col overflow-hidden rounded-xl',
        'border border-border bg-card text-sm shadow-xs',
        'transition-colors duration-150',
        state.sanitizedHref && 'cursor-pointer hover:border-foreground/25 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none',
      )"
      :role="state.sanitizedHref ? 'link' : undefined"
      :tabindex="state.sanitizedHref ? 0 : undefined"
      @click="state.sanitizedHref ? state.handleClick() : undefined"
      @keydown="state.handleKeyDown"
    >
      <div class="flex flex-col gap-2 p-4">
        <div class="flex min-w-0 items-center justify-between gap-1.5 text-xs text-muted-foreground">
          <div class="flex min-w-0 items-center gap-1.5">
            <!-- Icon -->
            <img
              v-if="favicon"
              :src="favicon"
              alt=""
              aria-hidden="true"
              width="14"
              height="14"
              class="size-3.5 shrink-0 rounded bg-muted object-cover"
            />
            <svg
              v-else
              :viewBox="state.typeIcon.viewBox"
              class="size-3.5 shrink-0 opacity-60"
              aria-hidden="true"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path :d="state.typeIcon.path" />
            </svg>
            <span class="truncate font-medium">{{ state.displayDomain }}</span>
            <span v-if="author || publishedAt" class="opacity-70">
              <span class="opacity-60"> — </span>
              {{ author }}
              <span v-if="author && publishedAt">, </span>
              <time v-if="publishedAt" :datetime="publishedAt" class="tabular-nums">
                {{ state.formatDate(publishedAt, state.locale) }}
              </time>
            </span>
          </div>
          <!-- External link icon -->
          <svg
            v-if="state.sanitizedHref"
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="size-3.5 shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
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
        </div>

        <h3 class="text-[15px] leading-snug font-medium text-pretty text-foreground">
          <span class="line-clamp-2 group-hover:underline group-hover:decoration-foreground/30 group-hover:underline-offset-2">
            {{ title }}
          </span>
        </h3>

        <p v-if="snippet" class="text-[13px] leading-relaxed text-pretty text-muted-foreground">
          <span class="line-clamp-3">{{ snippet }}</span>
        </p>
      </div>
    </div>
  </article>
</template>

<style scoped>
.citation-popover--top {
  position-anchor: --citation-inline;
  position-area: top;
  inset: auto;
  margin: 0;
  position-try: --citation-top-flip;
}
@position-try --citation-top-flip {
  position-area: bottom;
}
</style>
