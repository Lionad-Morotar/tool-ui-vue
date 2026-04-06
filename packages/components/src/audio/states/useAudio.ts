import { createSharedComposable } from '@vueuse/core';
import { computed, ref } from 'vue';
import { useEvents, createDomEventHandlers } from './useEvents';
import { usePlayback } from './usePlayback';
import type { AudioProps } from '../schema';
import type { EventEmits } from './useEvents';
import type { ComputedRef } from 'vue';

export interface AudioReturns {
  // Refs
  audioRef: ReturnType<typeof usePlayback>['mediaElementRef'];
  isSeeking: ComputedRef<boolean>;

  // State
  playing: ComputedRef<boolean>;
  muted: ComputedRef<boolean>;
  volume: ComputedRef<number>;
  currentTime: ComputedRef<number>;
  progress: ComputedRef<number>;
  duration: ComputedRef<number>;

  // Display
  currentTimeDisplay: ComputedRef<string>;
  durationDisplay: ComputedRef<string>;
  locale: ComputedRef<string>;

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

export function useAudio(props: AudioProps, emit: EventEmits): AudioReturns {
  const FALLBACK_LOCALE = 'en-US';

  // Playback logic
  const {
    stateRef,
    actions,
    mediaElementRef: audioRef,
    formattedTime,
  } = usePlayback(props);

  // Event emission (muted only; play/pause come from DOM handlers)
  useEvents({
    muted: computed(() => stateRef.value.muted),
    emit,
  });

  // Handle seek from range input
  function handleSeek(event: Event) {
    const target = event.target as HTMLInputElement;
    const newTime = Number(target.value);
    actions.seek(newTime);
  }

  // Computed display values
  const locale = computed(() => props.locale ?? FALLBACK_LOCALE);

  // DOM event handlers
  const domHandlers = createDomEventHandlers(emit);

  return {
    // Refs
    audioRef,
    isSeeking: computed(() => stateRef.value.isSeeking),

    // State (exposed for template binding)
    playing: computed(() => stateRef.value.playing),
    muted: computed(() => stateRef.value.muted),
    volume: computed(() => stateRef.value.volume),
    currentTime: computed(() => stateRef.value.currentTime),
    progress: computed(() => stateRef.value.progress),
    duration: computed(() => stateRef.value.duration),

    // Display
    currentTimeDisplay: formattedTime.current,
    durationDisplay: formattedTime.duration,
    locale,

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
