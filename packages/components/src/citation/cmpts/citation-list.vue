<script setup lang="ts">
import { computed } from 'vue';
import { cn } from '../../core';
import { typeIcons } from '../icons';
import Citation from '../index.vue';
import CitationOverflowPopover from './citation-overflow-popover.vue';
import { usePopover } from '../states/usePopover';
import type { CitationType, SerializableCitation, CitationListProps } from '../schema';

defineOptions({ name: 'CmptCitationList', inheritAttrs: false })

const props = withDefaults(defineProps<CitationListProps>(), {
  variant: 'default',
  maxVisible: undefined,
  css: () => ({}),
  onNavigate: undefined,
});

const emit = defineEmits<{
  navigate: [href: string, citation: SerializableCitation];
}>();

const shouldTruncate = computed(() => {
  if (props.maxVisible === undefined) return false;
  return props.citations.length > props.maxVisible;
});

const visibleCitations = computed(() => {
  if (!shouldTruncate.value) return props.citations;
  return props.citations.slice(0, props.maxVisible);
});

const overflowCitations = computed(() => {
  if (!shouldTruncate.value) return [];
  return props.citations.slice(props.maxVisible!);
});

const overflowCount = computed(() => overflowCitations.value.length);

// Stacked variant helpers
const maxStackedIcons = 4;
const stackedVisibleCitations = computed(() =>
  props.citations.slice(0, maxStackedIcons)
);
const stackedRemainingCount = computed(() =>
  Math.max(0, props.citations.length - maxStackedIcons)
);

// Popover composables
const popoverBottom = usePopover({ placement: 'bottom', id: `${props.id}-popover-bottom` });

function handleStackedClick(citation: SerializableCitation) {
  const href = citation.href;
  if (!href) return;
  if (props.onNavigate) {
    props.onNavigate(href, citation);
  } else {
    window.open(href, '_blank', 'noopener,noreferrer');
  }
}

function getTypeIcon(type: CitationType | undefined) {
  return typeIcons[type ?? 'webpage'] ?? typeIcons.webpage;
}
</script>

<template>
  <!-- Stacked variant: overlapping favicons with popover -->
  <div
    v-if="variant === 'stacked'"
    v-bind="$attrs"
    class="relative inline-flex"
    data-testid="citation-list-container"
  >
    <button
      :ref="(el: any) => { if (el) popoverBottom.triggerRef.value = el as HTMLElement }"
      type="button"
      :data-tool-ui-id="id"
      data-slot="citation-list"
      :class="cn(
        'isolate inline-flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2',
        'bg-muted/40 outline-none',
        'transition-colors duration-150',
        'hover:bg-muted/70',
        'focus-visible:ring-2 focus-visible:ring-ring',
        css?.root
      )"
      :style="popoverBottom.supportsAnchor ? { anchorName: '--citation-list-bottom' } : undefined"
      v-bind="popoverBottom.triggerAttrs()"
      @mouseenter="popoverBottom.handleMouseEnter"
      @mouseleave="popoverBottom.handleMouseLeave"
      @keydown="popoverBottom.handleTriggerKeyDown"
    >
      <div class="flex items-center">
        <div
          v-for="(citation, index) in stackedVisibleCitations"
          :key="citation.id"
          :class="cn(
            'relative flex size-6 items-center justify-center rounded-full border border-border bg-background shadow-xs dark:border-foreground/20',
            index > 0 && '-ml-2'
          )"
          :style="{ zIndex: maxStackedIcons - index }"
        >
          <img
            v-if="citation.favicon"
            :src="citation.favicon"
            alt=""
            aria-hidden="true"
            width="18"
            height="18"
            class="size-4.5 rounded-full object-cover"
          />
          <svg
            v-else
            :viewBox="getTypeIcon(citation.type).viewBox"
            class="size-3 text-muted-foreground"
            aria-hidden="true"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path :d="getTypeIcon(citation.type).path" />
          </svg>
        </div>
        <div
          v-if="stackedRemainingCount > 0"
          class="relative -ml-2 flex size-6 items-center justify-center rounded-full border border-border bg-background shadow-xs dark:border-foreground/20"
          style="z-index: 0"
        >
          <span class="text-[10px] font-medium tracking-tight text-muted-foreground">
            •••
          </span>
        </div>
      </div>
      <span class="text-sm text-muted-foreground tabular-nums">
        {{ citations.length }} source{{ citations.length !== 1 ? 's' : '' }}
      </span>
    </button>

    <!-- Stacked Popover -->
    <div
      :ref="(el: any) => { if (el) popoverBottom.popoverRef.value = el as HTMLElement }"
      data-testid="popover"
      :class="cn(
        'absolute top-full left-0 z-50 mt-2',
        'w-80 rounded-md border border-border bg-popover p-1 shadow-md',
        popoverBottom.supportsAnchor && 'citation-list-popover--bottom'
      )"
      v-bind="popoverBottom.popoverAttrs()"
      @mouseenter="popoverBottom.handleMouseEnter"
      @mouseleave="popoverBottom.handleMouseLeave"
      @keydown="popoverBottom.handlePopoverKeyDown"
    >
      <div class="flex max-h-72 flex-col overflow-y-auto">
        <button
          v-for="citation in citations"
          :key="citation.id"
          type="button"
          class="group/item flex w-full cursor-pointer items-center gap-2.5 rounded-md p-2 text-left transition-colors hover:bg-muted focus-visible:bg-muted focus-visible:outline-none"
          @click="handleStackedClick(citation)"
        >
          <img
            v-if="citation.favicon"
            :src="citation.favicon"
            alt=""
            aria-hidden="true"
            width="16"
            height="16"
            class="size-4 shrink-0 rounded bg-muted object-cover"
          />
          <svg
            v-else
            :viewBox="getTypeIcon(citation.type).viewBox"
            class="size-4 shrink-0 text-muted-foreground"
            aria-hidden="true"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path :d="getTypeIcon(citation.type).path" />
          </svg>
          <div class="min-w-0 flex-1">
            <p class="truncate text-sm font-medium group-hover/item:underline group-hover/item:decoration-foreground/30 group-hover/item:underline-offset-2">
              {{ citation.title }}
            </p>
            <p class="truncate text-xs text-muted-foreground">
              {{ citation.domain }}
            </p>
          </div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="mt-0.5 size-3.5 shrink-0 self-start text-muted-foreground opacity-0 transition-opacity group-hover/item:opacity-100"
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
        </button>
      </div>
    </div>
  </div>

  <!-- Default variant -->
  <div
    v-else-if="variant === 'default'"
    v-bind="$attrs"
    :class="cn('isolate flex flex-col gap-4', css?.root)"
    :data-tool-ui-id="id"
    data-slot="citation-list"
  >
    <citation
      v-for="citation in visibleCitations"
      :key="citation.id"
      v-bind="citation"
      variant="default"
      :css="{ root: css?.item }"
      @navigate="(href: string, cit: SerializableCitation) => emit('navigate', href, cit)"
    />
    <!-- Overflow for default variant -->
    <citation-overflow-popover
      v-if="shouldTruncate"
      :id="id"
      :citations="overflowCitations"
      placement="bottom"
      :on-navigate="props.onNavigate"
      :trigger-text="`+${overflowCount} more sources`"
      :trigger-class="cn(
        'flex items-center justify-center rounded-xl px-4 py-3',
        'border border-dashed border-border bg-card',
        'transition-colors duration-150',
        'hover:border-foreground/25 hover:bg-muted/50',
        'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none'
      )"
      testid="overflow-container"
      @navigate="(href: string, cit: SerializableCitation) => emit('navigate', href, cit)"
    />
  </div>

  <!-- Inline variant -->
  <div
    v-else
    v-bind="$attrs"
    :class="cn('isolate flex flex-wrap items-center gap-1.5', css?.root)"
    :data-tool-ui-id="id"
    data-slot="citation-list"
  >
    <citation
      v-for="citation in visibleCitations"
      :key="citation.id"
      v-bind="citation"
      variant="inline"
      :css="{ root: css?.item }"
      @navigate="(href: string, cit: SerializableCitation) => emit('navigate', href, cit)"
    />
    <!-- Overflow for inline variant -->
    <citation-overflow-popover
      v-if="shouldTruncate"
      :id="id"
      :citations="overflowCitations"
      placement="top"
      :on-navigate="props.onNavigate"
      :trigger-text="`+${overflowCount} more`"
      :trigger-class="cn(
        'inline-flex items-center gap-1 rounded-md px-2 py-1',
        'bg-muted/60 text-sm tabular-nums',
        'transition-colors duration-150',
        'hover:bg-muted',
        'focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none'
      )"
      @navigate="(href: string, cit: SerializableCitation) => emit('navigate', href, cit)"
    />
  </div>
</template>

<style scoped>
.citation-list-popover--bottom {
  position-anchor: --citation-list-bottom;
  position-area: bottom;
  inset: auto;
  margin: 0;
  position-try: --citation-list-bottom-flip;
}
@position-try --citation-list-bottom-flip {
  position-area: top;
}

.citation-list-popover--top {
  position-anchor: --citation-list-top;
  position-area: top;
  inset: auto;
  margin: 0;
  position-try: --citation-list-top-flip;
}
@position-try --citation-list-top-flip {
  position-area: bottom;
}
</style>
