<script setup lang="ts">
import {
  RATIO_CLASS_MAP,
  getFitClass,
  OVERLAY_GRADIENT,
  formatDuration, cn 
} from '@lionad/vtu-core';
import { reactive, toRef } from 'vue';
import { useVideo } from './states';
import type { VideoProps } from './schema';

defineOptions({ name: 'CmptVideo', inheritAttrs: false })

const props = withDefaults(defineProps<VideoProps & { css?: { root?: string } }>(), {
  css: () => ({ root: '' })
})

const emit = defineEmits<{
  navigate: [href: string];
  mediaEvent: [type: 'play' | 'pause' | 'mute' | 'unmute' | 'error'];
}>();

// All business logic delegated to states layer
const videoState = reactive(useVideo({
  ...props,
  emit,
}));

// videoRef is used in template via ref="videoRef"
const _videoRef = toRef(videoState, 'videoRef');
</script>

<template>
  <article
    v-bind="$attrs"
    :class="cn('relative w-full max-w-md min-w-80', css?.root)"
    :lang="videoState.locale"
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
            videoState.resolvedRatio !== 'auto'
              ? RATIO_CLASS_MAP[videoState.resolvedRatio]
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
              getFitClass(videoState.resolvedFit),
              videoState.resolvedRatio !== 'auto' ? 'absolute inset-0 h-full' : 'h-full'
            )
          "
          :src="src"
          playsinline
          :autoplay="videoState.autoPlay"
          preload="metadata"
          :muted="videoState.muted"
          controls
          @play="videoState.domHandlers.onPlay"
          @pause="videoState.domHandlers.onPause"
          @error="videoState.domHandlers.onError"
        >
          <p>Your browser does not support the video element.</p>
        </video>

        <!-- Overlay -->
        <template v-if="videoState.hasOverlay">
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
                v-if="videoState.primaryHref"
                type="button"
                class="inline-flex items-center justify-center rounded-md bg-black/55 px-3 py-1.5 text-sm font-medium text-white hover:bg-black/70"
                @click="videoState.handleOpen"
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
                @click="videoState.togglePlay"
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
                {{ videoState.playing ? "Pause" : "Watch" }}
              </button>
            </div>
          </div>
        </template>
      </div>

      <!-- Metadata -->
      <div v-if="videoState.hasMetadata" class="flex flex-col gap-1.5 px-4 py-3">
        <p v-if="description" class="line-clamp-2 text-sm leading-snug text-foreground">
          {{ description }}
        </p>
        <div
          class="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground"
        >
          <span v-if="videoState.sourceLabel">{{ videoState.sourceLabel }}</span>
          <span v-if="videoState.metadataDomain">{{ videoState.metadataDomain }}</span>
          <span v-if="durationMs">{{ formatDuration(durationMs) }}</span>
          <time v-if="createdAt" :datetime="createdAt">
            {{ videoState.formatCreatedAt(createdAt) }}
          </time>
        </div>
      </div>
    </div>
  </article>
</template>
