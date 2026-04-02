<script setup lang="ts">
import { ref, computed } from 'vue';
import { cn } from '../../utils';
import type { CitationProps, CitationType } from './schema';

defineOptions({ name: 'cmpt-citation', inheritAttrs: false })

const props = withDefaults(defineProps<CitationProps & { css?: { root?: string } }>(), {
  css: () => ({ root: '' })
})

const emit = defineEmits<{
  navigate: [href: string, citation: CitationProps];
}>();

const FALLBACK_LOCALE = 'en-US';

const isPopoverOpen = ref(false);
const popoverTimeout = ref<ReturnType<typeof setTimeout> | null>(null);

const locale = computed(() => props.locale ?? FALLBACK_LOCALE);

const displayDomain = computed(() => {
  if (props.domain) return props.domain;
  try {
    const urlObj = new URL(props.href);
    return urlObj.hostname.replace(/^www\./, '');
  } catch {
    return undefined;
  }
});

const sanitizedHref = computed(() => {
  // Simple sanitization - in real app would match React sanitizeHref
  if (!props.href) return undefined;
  if (props.href.startsWith('javascript:')) return undefined;
  if (props.href.startsWith('data:')) return undefined;
  if (props.href.startsWith('vbscript:')) return undefined;
  return props.href;
});

function formatDate(isoString: string, loc: string): string {
  try {
    const date = new Date(isoString);
    return date.toLocaleDateString(loc, {
      year: 'numeric',
      month: 'short',
    });
  } catch {
    return isoString;
  }
}

function handleClick() {
  if (!sanitizedHref.value) return;
  if (props.onNavigate) {
    emit('navigate', sanitizedHref.value, props);
  } else {
    window.open(sanitizedHref.value, '_blank', 'noopener,noreferrer');
  }
}

function handleKeyDown(e: KeyboardEvent) {
  if (sanitizedHref.value && (e.key === 'Enter' || e.key === ' ')) {
    e.preventDefault();
    handleClick();
  }
}

function handleMouseEnter() {
  if (popoverTimeout.value) clearTimeout(popoverTimeout.value);
  popoverTimeout.value = setTimeout(() => {
    isPopoverOpen.value = true;
  }, 100);
}

function handleMouseLeave() {
  if (popoverTimeout.value) clearTimeout(popoverTimeout.value);
  popoverTimeout.value = setTimeout(() => {
    isPopoverOpen.value = false;
  }, 100);
}

// Type icons as SVG components
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

const typeIcon = computed(() => {
  return typeIcons[props.type ?? 'webpage'] ?? typeIcons.webpage;
});

const resolvedVariant = computed(() => props.variant ?? 'default');
</script>

<template>
  <!-- Inline variant with popover -->
  <div
    v-if="resolvedVariant === 'inline'"
    class="relative inline-block"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <button
      type="button"
      :aria-label="title"
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
      @click="handleClick"
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
        :viewBox="typeIcon.viewBox"
        class="size-3.5 shrink-0 opacity-60"
        aria-hidden="true"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path :d="typeIcon.path" />
      </svg>
      <span class="text-muted-foreground">{{ displayDomain }}</span>
    </button>

    <!-- Popover -->
    <div
      v-if="isPopoverOpen"
      :class="cn(
        'absolute bottom-full left-0 z-50 mb-2',
        'w-72 rounded-md border border-border bg-popover p-0 shadow-md',
        'cursor-pointer'
      )"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
      @click="handleClick"
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
            :viewBox="typeIcon.viewBox"
            class="size-3.5 shrink-0 opacity-60"
            aria-hidden="true"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path :d="typeIcon.path" />
          </svg>
          <span class="text-xs text-muted-foreground">{{ displayDomain }}</span>
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
    :lang="locale"
    :data-tool-ui-id="id"
    data-slot="citation"
  >
    <div
      :class="cn(
        'group @container relative isolate flex w-full min-w-0 flex-col overflow-hidden rounded-xl',
        'border border-border bg-card text-sm shadow-xs',
        'transition-colors duration-150',
        sanitizedHref && 'cursor-pointer hover:border-foreground/25 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none',
      )"
      :role="sanitizedHref ? 'link' : undefined"
      :tabindex="sanitizedHref ? 0 : undefined"
      @click="sanitizedHref ? handleClick() : undefined"
      @keydown="handleKeyDown"
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
              :viewBox="typeIcon.viewBox"
              class="size-3.5 shrink-0 opacity-60"
              aria-hidden="true"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path :d="typeIcon.path" />
            </svg>
            <span class="truncate font-medium">{{ displayDomain }}</span>
            <span v-if="author || publishedAt" class="opacity-70">
              <span class="opacity-60"> — </span>
              {{ author }}
              <span v-if="author && publishedAt">, </span>
              <time v-if="publishedAt" :datetime="publishedAt" class="tabular-nums">
                {{ formatDate(publishedAt, locale) }}
              </time>
            </span>
          </div>
          <!-- External link icon -->
          <svg
            v-if="sanitizedHref"
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
