<script setup lang="ts">
import { useMediaControls } from '@vueuse/core';
import { computed, ref, watch } from 'vue';
import { cn } from './_adapter';
import { useLocalVideo } from './context';
import {
  getMuteMediaEvent,
  resolveVideoNavigation,
} from './video-helpers';
import {
  RATIO_CLASS_MAP,
  getFitClass,
  OVERLAY_GRADIENT,
  formatDuration,
  openSafeNavigationHref,
} from '../../shared/media';
import type { VideoProps } from './schema';

defineOptions({ name: 'cmpt-video', inheritAttrs: false })

const props = withDefaults(defineProps<VideoProps & { css?: { root?: string } }>(), {
  css: () => ({ root: '' })
})

const emit = defineEmits<{
  navigate: [href: string];
  mediaEvent: [type: 'play' | 'pause' | 'mute' | 'unmute' | 'error'];
}>();

const FALLBACK_LOCALE = 'en-US';

const videoRef = ref<HTMLVideoElement | null>(null);
const previousMuted = ref(true);

// Use VueUse's useMediaControls for advanced media handling
const mediaControls = useMediaControls(videoRef, {
  src: props.src,
});

// Local video context for state management
const { state, setState } = useLocalVideo({
  defaultState: {
    playing: false,
    muted: props.autoPlay !== false, // Default muted if autoplay
    volume: 1,
  },
});

// Sync mediaControls state with our context
watch(
  () => mediaControls.playing.value,
  (playing) => {
    setState({ playing });
  }
);

watch(
  () => mediaControls.muted.value,
  (muted) => {
    setState({ muted });
  }
);

watch(
  () => mediaControls.volume.value,
  (volume) => {
    setState({ volume });
  }
);

// Initialize previousMuted from state
previousMuted.value = state.muted;

const resolvedRatio = computed(() => props.ratio ?? 'auto');
const resolvedFit = computed(() => props.fit ?? 'cover');
const autoPlay = computed(() => props.autoPlay ?? true);
const locale = computed(() => props.locale ?? FALLBACK_LOCALE);

const { primaryHref } = computed(() =>
  resolveVideoNavigation(props.href, props.source?.url)
).value;

const sourceLabel = computed(() => props.source?.label);
const metadataDomain = computed(() =>
  props.domain && props.domain !== sourceLabel.value ? props.domain : undefined
);
const hasMetadata = computed(() =>
  Boolean(
    props.description ||
      sourceLabel.value ||
      metadataDomain.value ||
      props.durationMs ||
      props.createdAt
  )
);
const hasOverlay = computed(() => Boolean(props.title || primaryHref));

function formatCreatedAt(createdAt: string): string {
  const date = new Date(createdAt);
  if (Number.isNaN(date.getTime())) {
    return createdAt;
  }
  return new Intl.DateTimeFormat(locale.value, { dateStyle: 'medium' }).format(
    date
  );
}

function togglePlay() {
  mediaControls.playing.value = !mediaControls.playing.value;
}

function handleOpen() {
  if (!primaryHref) return;
  if (emit('navigate', primaryHref)) {
    // Event was handled by parent
  } else {
    openSafeNavigationHref(primaryHref);
  }
}

function handlePlayEvent() {
  emit('mediaEvent', 'play');
}

function handlePauseEvent() {
  emit('mediaEvent', 'pause');
}

function handleErrorEvent() {
  emit('mediaEvent', 'error');
}

// Watch for mute state changes and emit events
watch(
  () => state.muted,
  (newMuted) => {
    const mediaEvent = getMuteMediaEvent(previousMuted.value, newMuted);
    previousMuted.value = newMuted;
    if (mediaEvent) {
      emit('mediaEvent', mediaEvent);
    }
  }
);

// Watch for playing state changes
watch(
  () => state.playing,
  (newPlaying, oldPlaying) => {
    if (newPlaying && !oldPlaying) {
      emit('mediaEvent', 'play');
    } else if (!newPlaying && oldPlaying) {
      emit('mediaEvent', 'pause');
    }
  }
);
</script>

<template>
  <article
    v-bind="$attrs"
    :class="cn('relative w-full max-w-md min-w-80', css?.root)"
    :lang="locale"
    data-slot="video"
    :data-tool-ui-id="id"
  >
    <div
      :class="
        cn(
          'group @container relative isolate flex w-full min-w-0 flex-col overflow-hidden rounded-xl',
          'border border-border bg-card text-sm shadow-xs'
        )
      "
    >
      <!-- Video container -->
      <div
        :class="
          cn(
            'group relative w-full overflow-hidden bg-black',
            resolvedRatio !== 'auto'
              ? RATIO_CLASS_MAP[resolvedRatio]
              : 'aspect-video'
          )
        "
      >
        <video
          ref="videoRef"
          :poster="poster"
          :class="
            cn(
              'relative z-10 w-full transition-transform duration-200 group-hover:scale-[1.01]',
              getFitClass(resolvedFit),
              resolvedRatio !== 'auto' ? 'absolute inset-0 h-full' : 'h-full'
            )
          "
          :src="src"
          playsinline
          :autoplay="autoPlay"
          preload="metadata"
          :muted="state.muted"
          controls
          @play="handlePlayEvent"
          @pause="handlePauseEvent"
          @error="handleErrorEvent"
        >
          <p>Your browser does not support the video element.</p>
        </video>

        <!-- Overlay -->
        <template v-if="hasOverlay">
          <div
            class="pointer-events-none absolute inset-x-0 top-0 z-20 h-32 opacity-0 transition-opacity duration-200 group-focus-within:opacity-100 group-hover:opacity-100"
            :style="{ backgroundImage: OVERLAY_GRADIENT }"
          />
          <div
            class="absolute inset-x-0 top-0 z-30 flex items-start justify-between gap-2 px-5 pt-4 opacity-0 transition-opacity duration-200 group-focus-within:opacity-100 group-hover:opacity-100"
          >
            <div
              v-if="title"
              class="line-clamp-2 max-w-[70%] font-semibold text-white drop-shadow-sm"
            >
              {{ title }}
            </div>
            <span v-else class="sr-only">Video controls</span>
            <div class="flex items-center gap-2">
              <button
                v-if="primaryHref"
                type="button"
                class="inline-flex items-center justify-center rounded-md bg-black/55 px-3 py-1.5 text-sm font-medium text-white hover:bg-black/70"
                @click="handleOpen"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="mr-1 h-4 w-4"
                  aria-hidden="true"
                >
                  <path d="M15 3h6v6" />
                  <path d="M10 14 21 3" />
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                </svg>
                Open
              </button>
              <button
                type="button"
                class="inline-flex items-center justify-center rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90"
                @click="togglePlay"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="mr-1 h-4 w-4"
                  aria-hidden="true"
                >
                  <path
                    d="M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z"
                  />
                </svg>
                {{ state.playing ? "Pause" : "Watch" }}
              </button>
            </div>
          </div>
        </template>
      </div>

      <!-- Metadata -->
      <div v-if="hasMetadata" class="flex flex-col gap-1.5 px-4 py-3">
        <p v-if="description" class="line-clamp-2 text-sm leading-snug text-foreground">
          {{ description }}
        </p>
        <div
          class="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground"
        >
          <span v-if="sourceLabel">{{ sourceLabel }}</span>
          <span v-if="metadataDomain">{{ metadataDomain }}</span>
          <span v-if="durationMs">{{ formatDuration(durationMs) }}</span>
          <time v-if="createdAt" :datetime="createdAt">
            {{ formatCreatedAt(createdAt) }}
          </time>
        </div>
      </div>
    </div>
  </article>
</template>
