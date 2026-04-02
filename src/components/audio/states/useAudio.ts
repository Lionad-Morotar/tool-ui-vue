import { createSharedComposable } from '@vueuse/core';
import { computed, ref } from 'vue';
import type { ComputedRef } from 'vue';
import type { AudioProps, AudioVariant } from '../schema';
import type { EventEmits } from './useEvents';
import { usePlayback } from './usePlayback';
import { useEvents, createDomEventHandlers } from './useEvents';

export interface UseAudioOptions extends AudioProps {
  emit: EventEmits;
}

export interface AudioReturns {
  // Refs
  audioRef: ReturnType<typeof usePlayback>['mediaElementRef'];
  isSeeking: boolean;

  // State
  playing: boolean;
  muted: boolean;
  volume: number;
  currentTime: number;
  progress: number;
  duration: number;

  // Display
  currentTimeDisplay: ComputedRef<string>;
  durationDisplay: ComputedRef<string>;
  locale: ComputedRef<string>;
  isCompact: ComputedRef<boolean>;

  // Actions
  togglePlay: () => void;
  handleSeek: (event: Event) => void;
  handleSeekStart: () => void;
  handleSeekEnd: () => void;

  // DOM handlers
  domHandlers: {
    onPlay: () => void;
    onPause: () => void;
    onError: () => void;
  };
}

export function useAudio(options: UseAudioOptions): AudioReturns {
  const {
    src,
    durationMs,
    variant = 'full' as AudioVariant,
    locale: localeProp,
    emit,
  } = options;

  const FALLBACK_LOCALE = 'en-US';

  // Playback logic
  const {
    state,
    actions,
    mediaElementRef: audioRef,
    formattedTime,
  } = usePlayback({
    src,
    durationMs,
    defaultPlaying: false,
    defaultMuted: false,
    defaultVolume: 1,
  });

  // Event emission
  useEvents({
    playing: computed(() => state.playing),
    muted: computed(() => state.muted),
    emit,
  });

  // Handle seek from range input
  function handleSeek(event: Event) {
    const target = event.target as HTMLInputElement;
    const newTime = Number(target.value);
    actions.seek(newTime);
  }

  // Computed display values
  const locale = computed(() => localeProp ?? FALLBACK_LOCALE);
  const isCompact = computed(() => variant === 'compact');

  // DOM event handlers
  const domHandlers = createDomEventHandlers(emit);

  return {
    // Refs
    audioRef,
    isSeeking: state.isSeeking,

    // State (exposed for template binding)
    playing: state.playing,
    muted: state.muted,
    volume: state.volume,
    currentTime: state.currentTime,
    progress: state.progress,
    duration: state.duration,

    // Display
    currentTimeDisplay: formattedTime.current,
    durationDisplay: formattedTime.duration,
    locale: computed(() => locale.value),
    isCompact: computed(() => isCompact.value),

    // Actions
    togglePlay: actions.togglePlay,
    handleSeek,
    handleSeekStart: actions.startSeeking,
    handleSeekEnd: actions.endSeeking,

    // DOM handlers
    domHandlers,
  };
}

// Shared composable for cross-component state sharing
export const useSharedAudio = createSharedComposable(() => {
  const state = ref({
    playing: false,
    muted: false,
    volume: 1,
  });

  function setState(patch: Partial<typeof state.value>) {
    Object.assign(state.value, patch);
  }

  return {
    state: state.value,
    setState,
  };
});
