<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useMediaControls } from "@vueuse/core";
import { cn } from "./_adapter";
import { useLocalAudio } from "./context";
import type { AudioProps, AudioVariant } from "./schema";
// formatDuration is available from shared/media if needed for future enhancements

const props = withDefaults(defineProps<AudioProps>(), {
  variant: "full" as AudioVariant,
});

const emit = defineEmits<{
  mediaEvent: [type: "play" | "pause" | "mute" | "unmute" | "error"];
}>();

const FALLBACK_LOCALE = "en-US";

const audioRef = ref<HTMLAudioElement | null>(null);
const isSeeking = ref(false);

// Use VueUse's useMediaControls for advanced media handling
const mediaControls = useMediaControls(audioRef, {
  src: props.src,
});

// Local audio context for state management
const { state, setState } = useLocalAudio({
  defaultState: {
    playing: false,
    muted: false,
    volume: 1,
  },
});

// Sync mediaControls playing state with our context
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

const locale = computed(() => props.locale ?? FALLBACK_LOCALE);
const isCompact = computed(() => props.variant === "compact");

// Use duration from props if available, otherwise from media controls
const displayDuration = computed(() => {
  if (props.durationMs && props.durationMs > 0) {
    return props.durationMs / 1000;
  }
  return mediaControls.duration.value;
});

const currentTimeDisplay = computed(() => {
  return formatTime(mediaControls.currentTime.value);
});

const durationDisplay = computed(() => {
  return formatTime(displayDuration.value);
});

const progress = computed(() => {
  const duration = displayDuration.value;
  if (duration <= 0) return 0;
  return (mediaControls.currentTime.value / duration) * 100;
});

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function handlePlayPause() {
  mediaControls.playing.value = !mediaControls.playing.value;
}

function handleSeek(event: Event) {
  const target = event.target as HTMLInputElement;
  const newTime = Number(target.value);
  mediaControls.currentTime.value = newTime;
}

function handleSeekStart() {
  isSeeking.value = true;
}

function handleSeekEnd() {
  isSeeking.value = false;
}

function handlePlayEvent() {
  emit("mediaEvent", "play");
}

function handlePauseEvent() {
  emit("mediaEvent", "pause");
}

function handleErrorEvent() {
  emit("mediaEvent", "error");
}

// Watch for media events from the controls
watch(
  () => mediaControls.playing.value,
  (newValue, oldValue) => {
    if (newValue && !oldValue) {
      emit("mediaEvent", "play");
    } else if (!newValue && oldValue) {
      emit("mediaEvent", "pause");
    }
  }
);

// Handle mute/unmute events
let previousMuted = state.muted;
watch(
  () => state.muted,
  (newValue) => {
    if (previousMuted !== newValue) {
      emit("mediaEvent", newValue ? "mute" : "unmute");
      previousMuted = newValue;
    }
  }
);
</script>

<template>
  <article
    :class="
      cn(
        '@container/actions relative w-full',
        isCompact ? 'min-w-72 max-w-md' : 'min-w-52 max-w-sm',
        className
      )
    "
    :lang="locale"
    data-slot="audio"
    :data-tool-ui-id="id"
  >
    <div
      :class="
        cn(
          'group @container relative isolate flex w-full min-w-0 flex-col overflow-hidden',
          'border-border bg-card border text-sm shadow-xs',
          'rounded-xl'
        )
      "
    >
      <!-- Full Player -->
      <template v-if="!isCompact">
        <div class="flex w-full flex-col">
          <!-- Artwork -->
          <div
            v-if="artwork"
            class="bg-muted relative aspect-[4/3] w-full overflow-hidden"
          >
            <img
              :src="artwork"
              alt=""
              aria-hidden="true"
              loading="lazy"
              decoding="async"
              class="absolute inset-0 h-full w-full object-cover"
            />
          </div>

          <!-- Controls -->
          <div class="flex flex-col gap-5 p-4">
            <!-- Title/Description -->
            <div v-if="title || description" class="space-y-0.5">
              <div
                v-if="title"
                class="text-foreground line-clamp-2 font-semibold leading-snug"
              >
                {{ title }}
              </div>
              <div
                v-if="description"
                class="text-muted-foreground line-clamp-2 text-sm leading-snug"
              >
                {{ description }}
              </div>
            </div>

            <!-- Player Controls -->
            <div class="flex items-start gap-3">
              <div class="flex flex-1 flex-col gap-2">
                <!-- Progress Slider -->
                <div
                  class="relative flex w-full touch-none select-none items-center py-2"
                >
                  <!-- Track Background -->
                  <div
                    class="bg-foreground/20 absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full"
                  />
                  <!-- Track Fill -->
                  <div
                    class="bg-foreground absolute left-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full"
                    :style="{ width: `${progress}%` }"
                  />
                  <!-- Range Input -->
                  <input
                    type="range"
                    :value="mediaControls.currentTime.value"
                    :max="displayDuration || 100"
                    step="0.1"
                    class="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                    aria-label="Audio progress"
                    @input="handleSeek"
                    @pointerdown="handleSeekStart"
                    @pointerup="handleSeekEnd"
                  />
                  <!-- Thumb (visual only) -->
                  <div
                    class="pointer-events-none absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full border-2 border-background bg-foreground transition-transform"
                    :style="{ left: `calc(${progress}% - 6px)` }"
                  />
                </div>
                <!-- Time Display -->
                <div
                  class="text-muted-foreground flex items-center justify-between text-xs tabular-nums"
                >
                  <span>{{ currentTimeDisplay }}</span>
                  <span>{{ durationDisplay }}</span>
                </div>
              </div>

              <!-- Play/Pause Button -->
              <button
                type="button"
                class="-mt-4 inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm hover:bg-primary/90"
                :aria-label="state.playing ? 'Pause' : 'Play'"
                @click="handlePlayPause"
              >
                <svg
                  v-if="state.playing"
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
                  <rect x="6" y="4" width="4" height="16" />
                  <rect x="14" y="4" width="4" height="16" />
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
                  <path
                    d="M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </template>

      <!-- Compact Player -->
      <template v-else>
        <div class="relative flex w-full items-center gap-3 overflow-hidden p-3">
          <!-- Background blur effect -->
          <template v-if="artwork">
            <img
              :src="artwork"
              alt=""
              aria-hidden="true"
              class="pointer-events-none absolute -left-1/4 top-1/2 h-[200%] w-auto -translate-y-1/2 object-cover opacity-40 blur-2xl saturate-150"
            />
            <div
              class="from-card/60 to-card/90 pointer-events-none absolute inset-0 bg-gradient-to-r"
            />
          </template>

          <!-- Artwork thumbnail -->
          <div
            v-if="artwork"
            class="ring-background/20 relative size-12 shrink-0 overflow-hidden rounded-lg shadow-lg ring-1"
          >
            <img
              :src="artwork"
              alt=""
              aria-hidden="true"
              loading="lazy"
              decoding="async"
              class="absolute inset-0 h-full w-full object-cover"
            />
          </div>

          <!-- Info -->
          <div class="relative flex min-w-0 flex-1 flex-col justify-center">
            <div
              v-if="title"
              class="text-foreground truncate text-sm font-semibold leading-tight"
            >
              {{ title }}
            </div>
            <div
              v-if="description"
              class="text-muted-foreground mt-0.5 truncate text-xs leading-tight"
            >
              {{ description }}
            </div>
            <!-- Progress bar -->
            <div v-if="displayDuration > 0" class="mt-1 flex items-center gap-2">
              <div
                class="bg-foreground/20 relative h-1 flex-1 overflow-hidden rounded-full"
              >
                <div
                  class="bg-foreground absolute inset-y-0 left-0 rounded-full transition-all duration-150"
                  :style="{ width: `${progress}%` }"
                />
              </div>
              <span class="text-muted-foreground text-xs tabular-nums">
                {{ currentTimeDisplay }}
              </span>
            </div>
          </div>

          <!-- Play/Pause Button -->
          <button
            type="button"
            class="relative inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md hover:bg-primary/90"
            :aria-label="state.playing ? 'Pause' : 'Play'"
            @click="handlePlayPause"
          >
            <svg
              v-if="state.playing"
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
              <rect x="6" y="4" width="4" height="16" />
              <rect x="14" y="4" width="4" height="16" />
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
              <path
                d="M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z"
              />
            </svg>
          </button>
        </div>
      </template>

      <!-- Hidden Audio Element -->
      <audio
        ref="audioRef"
        :src="src"
        preload="metadata"
        class="hidden"
        @play="handlePlayEvent"
        @pause="handlePauseEvent"
        @error="handleErrorEvent"
      />
    </div>
  </article>
</template>
