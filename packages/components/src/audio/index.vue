<script setup lang="ts">
import { computed } from 'vue';
import { cn } from '../core';
import { useAudio } from './states';
import { useI18n } from '../core/i18n';
import type { AudioProps } from './schema';

defineOptions({ name: 'CmptAudio', inheritAttrs: false })

const props = withDefaults(defineProps<AudioProps>(), {
  variant: 'full',
  css: () => ({}),
});

const emit = defineEmits<{
  mediaEvent: [type: 'play' | 'pause' | 'mute' | 'unmute' | 'error'];
}>();

// Layout variant is computed from reactive props directly
const isCompact = computed(() => props.variant === 'compact');

// All business logic delegated to states layer
const {
  audioRef,
  locale,
  playing,
  currentTime,
  progress,
  duration,
  currentTimeDisplay,
  durationDisplay,
  togglePlay,
  handleSeek,
  handleSeekStart,
  handleSeekEnd,
  domHandlers,
} = useAudio(props, emit);
void audioRef;

// i18n
const { t } = useI18n();

// Derived i18n values for attribute bindings (type-safe unwrapping)
const playPauseAriaLabel = computed(() => playing.value ? t('audio.pause').value : t('audio.play').value);
const progressAriaLabel = computed(() => t('audio.progress').value);
</script>

<template>
  <article
    v-bind="$attrs"
    :class="cn('@container/actions relative w-full', isCompact ? 'max-w-md min-w-72' : 'max-w-sm min-w-52', css?.root)"
    :lang="locale"
    data-slot="audio"
    :data-tool-ui-id="id"
  >
    <div
      :class="cn(
        'group @container relative isolate flex w-full min-w-0 flex-col overflow-hidden',
        'border border-border bg-card text-sm shadow-xs',
        'rounded-xl'
      )"
    >
      <!-- Full Player -->
      <template v-if="!isCompact">
        <div class="flex w-full flex-col">
          <!-- Artwork -->
          <div v-if="artwork" data-slot="artwork" :class="cn('relative aspect-[4/3] w-full overflow-hidden bg-muted', css?.artwork)">
            <img
              :src="artwork"
              alt=""
              aria-hidden="true"
              loading="lazy"
              decoding="async"
              class="absolute inset-0 size-full object-cover"
            />
          </div>

          <!-- Controls -->
          <div data-slot="controls" :class="cn('flex flex-col gap-5 p-4', css?.controls)">
            <!-- Title/Description -->
            <div v-if="title || description" data-slot="header" :class="cn('space-y-0.5', css?.header)">
              <div v-if="title" class="line-clamp-2 leading-snug font-semibold text-foreground">
                {{ title }}
              </div>
              <div v-if="description" class="line-clamp-2 text-sm leading-snug text-muted-foreground">
                {{ description }}
              </div>
            </div>

            <!-- Player Controls -->
            <div class="flex items-center gap-3">
              <div class="flex flex-1 flex-col gap-2">
                <!-- Progress Slider -->
                <div class="relative flex w-full touch-none items-center py-2 select-none">
                  <div class="absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-foreground/20" />
                  <div
                    class="absolute top-1/2 left-0 h-1.5 -translate-y-1/2 rounded-full bg-foreground"
                    :style="{ width: `${progress}%` }"
                  />
                  <input
                    type="range"
                    :value="currentTime || 0"
                    :max="duration || 100"
                    step="0.1"
                    class="absolute inset-0 size-full cursor-pointer opacity-0"
                    :aria-label="progressAriaLabel"
                    @input="handleSeek"
                    @pointerdown="handleSeekStart"
                    @pointerup="handleSeekEnd"
                  />
                  <div
                    class="pointer-events-none absolute top-1/2 size-3 -translate-y-1/2 rounded-full border-2 border-background bg-foreground transition-transform"
                    :style="{ left: `calc(${progress}% - 6px)` }"
                  />
                </div>
                <!-- Time Display -->
                <div class="flex items-center justify-between text-xs text-muted-foreground tabular-nums">
                  <span>{{ currentTimeDisplay }}</span>
                  <span>{{ durationDisplay }}</span>
                </div>
              </div>

              <!-- Play/Pause Button -->
              <button
                type="button"
                class="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm hover:bg-primary/90"
                :aria-label="playPauseAriaLabel"
                @click="togglePlay"
              >
                <svg
                  v-if="playing"
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <rect
                    x="6"
                    y="4"
                    width="4"
                    height="16"
                  />
                  <rect
                    x="14"
                    y="4"
                    width="4"
                    height="16"
                  />
                </svg>
                <svg
                  v-else
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="ml-0.5"
                >
                  <path d="M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Source -->
          <div v-if="source" data-slot="source" :class="cn('flex items-center gap-1.5 px-4 pb-3 text-xs text-muted-foreground', css?.source)">
            <img
              v-if="source.iconUrl"
              :src="source.iconUrl"
              alt=""
              class="size-3 shrink-0 rounded-sm"
            />
            <a
              v-if="source.url"
              :href="source.url"
              target="_blank"
              rel="noopener noreferrer"
              class="underline underline-offset-2 hover:text-foreground"
            >{{ source.label }}</a>
            <span v-else>{{ source.label }}</span>
          </div>
        </div>
      </template>

      <!-- Compact Player -->
      <template v-else>
        <div data-slot="controls" :class="cn('relative flex w-full items-center gap-3 overflow-hidden p-3', css?.controls)">
          <template v-if="artwork">
            <img
              :src="artwork"
              alt=""
              aria-hidden="true"
              class="pointer-events-none absolute top-1/2 -left-1/4 h-[200%] w-auto -translate-y-1/2 object-cover opacity-40 blur-2xl saturate-150"
            />
            <div class="pointer-events-none absolute inset-0 bg-gradient-to-r from-card/60 to-card/90" />
          </template>

          <div v-if="artwork" data-slot="artwork" :class="cn('relative size-12 shrink-0 overflow-hidden rounded-lg shadow-lg ring-1 ring-background/20', css?.artwork)">
            <img
              :src="artwork"
              alt=""
              aria-hidden="true"
              loading="lazy"
              decoding="async"
              class="absolute inset-0 size-full object-cover"
            />
          </div>

          <div data-slot="header" :class="cn('relative flex min-w-0 flex-1 flex-col justify-center', css?.header)">
            <div v-if="title" class="truncate text-sm leading-tight font-semibold text-foreground">
              {{ title }}
            </div>
            <div v-if="description" class="mt-0.5 truncate text-xs leading-tight text-muted-foreground">
              {{ description }}
            </div>
            <div v-if="durationDisplay !== '0:00'" class="mt-1 flex items-center gap-2">
              <div class="relative h-1 flex-1 overflow-hidden rounded-full bg-foreground/20">
                <div
                  class="absolute inset-y-0 left-0 rounded-full bg-foreground transition-all duration-150"
                  :style="{ width: `${progress}%` }"
                />
              </div>
              <span class="text-xs text-muted-foreground tabular-nums">{{ currentTimeDisplay }}</span>
            </div>
          </div>

          <!-- Play/Pause Button -->
          <button
            type="button"
            class="relative inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md hover:bg-primary/90"
            :aria-label="playPauseAriaLabel"
            @click="togglePlay"
          >
            <svg
              v-if="playing"
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="currentColor"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <rect
                x="6"
                y="4"
                width="4"
                height="16"
              />
              <rect
                x="14"
                y="4"
                width="4"
                height="16"
              />
            </svg>
            <svg
              v-else
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="currentColor"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="ml-0.5"
            >
              <path d="M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z" />
            </svg>
          </button>

          <!-- Source -->
          <div v-if="source" data-slot="source" :class="cn('flex items-center gap-1.5 text-xs text-muted-foreground', css?.source)">
            <img
              v-if="source.iconUrl"
              :src="source.iconUrl"
              alt=""
              class="size-3 shrink-0 rounded-sm"
            />
            <a
              v-if="source.url"
              :href="source.url"
              target="_blank"
              rel="noopener noreferrer"
              class="underline underline-offset-2 hover:text-foreground"
            >{{ source.label }}</a>
            <span v-else>{{ source.label }}</span>
          </div>
        </div>
      </template>

      <!-- Hidden Audio Element -->
      <audio
        ref="audioRef"
        :src="src"
        preload="metadata"
        class="hidden"
        @play="domHandlers.onPlay"
        @pause="domHandlers.onPause"
        @error="domHandlers.onError"
      />
    </div>
  </article>
</template>
