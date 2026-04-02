<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue';
import { cn } from '../_adapter';
import Citation from '../index.vue';
import type { CitationType, SerializableCitation } from '../schema';

export interface CitationListProps {
  id: string;
  citations: SerializableCitation[];
  variant?: 'default' | 'inline' | 'stacked';
  maxVisible?: number;
  css?: { root?: string };
  onNavigate?: (href: string, citation: SerializableCitation) => void;
}

defineOptions({ name: 'cmpt-citation-list', inheritAttrs: false })

const props = withDefaults(defineProps<CitationListProps & { css?: { root?: string } }>(), {
  variant: 'default',
  maxVisible: undefined,
  css: () => ({ root: '' }),
  onNavigate: undefined,
});

const emit = defineEmits<{
  navigate: [href: string, citation: SerializableCitation];
}>();

// Popover state for overflow
const isOverflowOpen = ref(false);
const overflowTimeout = ref<ReturnType<typeof setTimeout> | null>(null);

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

// Type icons for stacked and overflow
const typeIcons: Record<CitationType, { viewBox: string; path: string }> = {
  webpage: {
    viewBox: '0 0 24 24',
    path: 'M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z',
  },
  document: {
    viewBox: '0 0 24 24',
    path: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8M16 17H8M10 9H8',
  },
  article: {
    viewBox: '0 0 24 24',
    path: 'M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2 M18 14h-8 M15 18h-5',
  },
  api: {
    viewBox: '0 0 24 24',
    path: 'M12 2v4 M12 18v4 M4.93 4.93l2.83 2.83 M16.24 16.24l2.83 2.83 M2 12h4 M18 12h4 M4.93 19.07l2.83-2.83 M16.24 7.76l2.83-2.83',
  },
  code: {
    viewBox: '0 0 24 24',
    path: 'm16 18 6-6-6-6 M8 6l-6 6 6 6',
  },
  other: {
    viewBox: '0 0 24 24',
    path: 'M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z M14 2v6h6',
  },
};

// Popover handlers for stacked/overflow
function handleMouseEnter() {
  if (overflowTimeout.value) clearTimeout(overflowTimeout.value);
  overflowTimeout.value = setTimeout(() => {
    isOverflowOpen.value = true;
  }, 100);
}

function handleMouseLeave() {
  if (overflowTimeout.value) clearTimeout(overflowTimeout.value);
  overflowTimeout.value = setTimeout(() => {
    isOverflowOpen.value = false;
  }, 100);
}

function handleKeyDown(e: KeyboardEvent) {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    isOverflowOpen.value = true;
  }
}

function handleOverflowClick(citation: SerializableCitation) {
  const href = citation.href;
  if (!href) return;
  if (props.onNavigate) {
    props.onNavigate(href, citation);
  } else {
    emit('navigate', href, citation);
  }
}

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

// Cleanup on unmount
onUnmounted(() => {
  if (overflowTimeout.value) clearTimeout(overflowTimeout.value);
});
</script>

<template>
  <!-- Stacked variant: overlapping favicons with popover -->
  <div
    v-if="variant === 'stacked'"
    v-bind="$attrs"
    class="relative inline-flex"
    data-testid="citation-list-container"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <button
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
      @keydown="handleKeyDown"
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
      v-if="isOverflowOpen"
      data-testid="popover"
      :class="cn(
        'absolute top-full left-0 z-50 mt-2',
        'w-80 rounded-md border border-border bg-popover p-1 shadow-md'
      )"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
    >
      <div class="flex max-h-72 flex-col overflow-y-auto">
        <button
          v-for="citation in citations"
          :key="citation.id"
          type="button"
          class="group flex w-full cursor-pointer items-center gap-2.5 rounded-md px-2 py-2 text-left transition-colors hover:bg-muted focus-visible:bg-muted focus-visible:outline-none"
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
            <p class="truncate text-sm font-medium group-hover:underline group-hover:decoration-foreground/30 group-hover:underline-offset-2">
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
            class="mt-0.5 size-3.5 shrink-0 self-start text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
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
      @navigate="(href, cit) => emit('navigate', href, cit)"
    />
    <!-- Overflow for default variant -->
    <div
      v-if="shouldTruncate"
      class="relative"
      data-testid="overflow-container"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
    >
      <button
        type="button"
        :class="cn(
          'flex items-center justify-center rounded-xl px-4 py-3',
          'border border-dashed border-border bg-card',
          'transition-colors duration-150',
          'hover:border-foreground/25 hover:bg-muted/50',
          'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none'
        )"
      >
        <span class="text-sm text-muted-foreground tabular-nums">
          +{{ overflowCount }} more sources
        </span>
      </button>
      <!-- Overflow popover -->
      <div
        v-if="isOverflowOpen"
        data-testid="popover"
        :class="cn(
          'absolute top-full left-0 z-50 mt-2',
          'w-80 rounded-md border border-border bg-popover p-1 shadow-md'
        )"
        @mouseenter="handleMouseEnter"
        @mouseleave="handleMouseLeave"
      >
        <div class="flex max-h-72 flex-col overflow-y-auto">
          <button
            v-for="citation in overflowCitations"
            :key="citation.id"
            type="button"
            class="group flex w-full cursor-pointer items-center gap-2.5 rounded-md px-2 py-2 text-left transition-colors hover:bg-muted focus-visible:bg-muted focus-visible:outline-none"
            @click="handleOverflowClick(citation)"
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
              <p class="truncate text-sm font-medium group-hover:underline group-hover:decoration-foreground/30 group-hover:underline-offset-2">
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
              class="mt-0.5 size-3.5 shrink-0 self-start text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
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
      @navigate="(href, cit) => emit('navigate', href, cit)"
    />
    <!-- Overflow for inline variant -->
    <div
      v-if="shouldTruncate"
      class="relative"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
    >
      <button
        type="button"
        :class="cn(
          'inline-flex items-center gap-1 rounded-md px-2 py-1',
          'bg-muted/60 text-sm tabular-nums',
          'transition-colors duration-150',
          'hover:bg-muted',
          'focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none'
        )"
      >
        <span class="text-muted-foreground">+{{ overflowCount }} more</span>
      </button>
      <!-- Overflow popover -->
      <div
        v-if="isOverflowOpen"
        :class="cn(
          'absolute bottom-full left-0 z-50 mb-2',
          'w-80 rounded-md border border-border bg-popover p-1 shadow-md'
        )"
        @mouseenter="handleMouseEnter"
        @mouseleave="handleMouseLeave"
      >
        <div class="flex max-h-72 flex-col overflow-y-auto">
          <button
            v-for="citation in overflowCitations"
            :key="citation.id"
            type="button"
            class="group flex w-full cursor-pointer items-center gap-2.5 rounded-md px-2 py-2 text-left transition-colors hover:bg-muted focus-visible:bg-muted focus-visible:outline-none"
            @click="handleOverflowClick(citation)"
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
              <p class="truncate text-sm font-medium group-hover:underline group-hover:decoration-foreground/30 group-hover:underline-offset-2">
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
              class="mt-0.5 size-3.5 shrink-0 self-start text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
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
  </div>
</template>
