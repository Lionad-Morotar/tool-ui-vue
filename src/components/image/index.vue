<script setup lang="ts">
import { computed } from 'vue';
import { cn } from './_adapter';
import type { ImageProps, AspectRatio, MediaFit } from './schema';

const props = defineProps<ImageProps>();

const emit = defineEmits<{
  navigate: [href: string];
}>();

const FALLBACK_LOCALE = 'en-US';

const ratioClassMap: Record<AspectRatio, string> = {
  auto: '',
  '1:1': 'aspect-square',
  '4:3': 'aspect-[4/3]',
  '16:9': 'aspect-video',
  '9:16': 'aspect-[9/16]',
};

const fitClassMap: Record<MediaFit, string> = {
  cover: 'object-cover',
  contain: 'object-contain',
};

const resolvedRatio = computed(() => props.ratio ?? 'auto');
const resolvedFit = computed(() => props.fit ?? 'cover');
const locale = computed(() => props.locale ?? FALLBACK_LOCALE);

const sourceLabel = computed(() => props.source?.label ?? props.domain);
const fallbackInitial = computed(() =>
  (sourceLabel.value ?? '').trim().charAt(0).toUpperCase()
);
const hasSource = computed(() => Boolean(sourceLabel.value || props.source?.iconUrl));
const hasMetadata = computed(() => props.title || hasSource.value);

function handleImageClick() {
  if (props.href) {
    emit('navigate', props.href);
  }
}

function handleSourceClick() {
  if (props.source?.url) {
    emit('navigate', props.source.url);
  }
}
</script>

<template>
  <article
    :class="cn('relative w-full max-w-md min-w-80', className)"
    :lang="locale"
    data-slot="image"
    :data-tool-ui-id="id"
  >
    <div
      :class="cn(
        'group @container relative isolate flex w-full min-w-0 flex-col overflow-hidden rounded-xl',
        'border border-border bg-card text-sm shadow-xs',
      )"
    >
      <!-- Image Container -->
      <div
        :class="cn(
          'group relative w-full overflow-hidden bg-muted',
          resolvedRatio !== 'auto' ? ratioClassMap[resolvedRatio] : 'min-h-[160px]',
          href && 'cursor-pointer',
        )"
        :role="href ? 'link' : undefined"
        :tabindex="href ? 0 : undefined"
        @click="handleImageClick"
        @keydown="(e: KeyboardEvent) => {
          if (href && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            handleImageClick();
          }
        }"
      >
        <img
          :src="src"
          :alt="alt"
          loading="lazy"
          decoding="async"
          :class="cn('absolute inset-0 h-full w-full', fitClassMap[resolvedFit])"
        />
      </div>

      <!-- Source Attribution -->
      <div v-if="hasMetadata" class="flex items-center gap-3 px-4 py-3">
        <button
          v-if="source?.url && hasSource"
          type="button"
          class="flex w-full items-center gap-3 text-left hover:opacity-80 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          @click="handleSourceClick"
        >
          <div class="flex min-w-0 flex-1 items-center gap-3">
            <img
              v-if="source?.iconUrl"
              :src="source.iconUrl"
              alt=""
              aria-hidden="true"
              width="32"
              height="32"
              class="size-8 shrink-0 rounded-full object-cover"
              loading="lazy"
              decoding="async"
            />
            <div
              v-else-if="fallbackInitial"
              class="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground uppercase"
            >
              {{ fallbackInitial }}
            </div>
            <div class="min-w-0 flex-1">
              <div v-if="title" class="line-clamp-1 text-sm font-medium text-foreground">
                {{ title }}
              </div>
              <div v-if="sourceLabel" class="line-clamp-1 text-xs text-muted-foreground">
                {{ sourceLabel }}
              </div>
            </div>
          </div>
        </button>
        <div v-else class="flex min-w-0 flex-1 items-center gap-3">
          <img
            v-if="source?.iconUrl"
            :src="source.iconUrl"
            alt=""
            aria-hidden="true"
            width="32"
            height="32"
            class="size-8 shrink-0 rounded-full object-cover"
            loading="lazy"
            decoding="async"
          />
          <div
            v-else-if="fallbackInitial"
            class="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground uppercase"
          >
            {{ fallbackInitial }}
          </div>
          <div class="min-w-0 flex-1">
            <div v-if="title" class="line-clamp-1 text-sm font-medium text-foreground">
              {{ title }}
            </div>
            <div v-if="sourceLabel" class="line-clamp-1 text-xs text-muted-foreground">
              {{ sourceLabel }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </article>
</template>
