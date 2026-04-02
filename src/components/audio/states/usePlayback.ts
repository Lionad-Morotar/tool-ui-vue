import { useMediaControls } from '@vueuse/core';
import { computed, ref, watch, type Ref } from 'vue';
import type { ComputedRef } from 'vue';

export interface PlaybackOptions {
  src: string;
  durationMs?: number;
  defaultPlaying?: boolean;
  defaultMuted?: boolean;
  defaultVolume?: number;
}

export interface PlaybackState {
  playing: boolean;
  muted: boolean;
  volume: number;
  currentTime: number;
  duration: number;
  progress: number;
  isSeeking: boolean;
}

export interface PlaybackActions {
  togglePlay: () => void;
  toggleMute: () => void;
  setVolume: (volume: number) => void;
  seek: (time: number) => void;
  startSeeking: () => void;
  endSeeking: () => void;
}

export interface PlaybackReturns {
  state: PlaybackState;
  actions: PlaybackActions;
  mediaElementRef: Ref<HTMLAudioElement | null>;
  formattedTime: {
    current: ComputedRef<string>;
    duration: ComputedRef<string>;
  };
}

export function usePlayback(options: PlaybackOptions): PlaybackReturns {
  const {
    src,
    durationMs,
    defaultPlaying = false,
    defaultMuted = false,
    defaultVolume = 1,
  } = options;

  const mediaElementRef = ref<HTMLAudioElement | null>(null);
  const isSeeking = ref(false);

  // Use VueUse's useMediaControls for advanced media handling
  const mediaControls = useMediaControls(mediaElementRef, { src });

  // Local playback state
  const state = ref<PlaybackState>({
    playing: defaultPlaying,
    muted: defaultMuted,
    volume: defaultVolume,
    currentTime: 0,
    duration: 0,
    progress: 0,
    isSeeking: false,
  });

  // Sync mediaControls state with our local state
  watch(
    () => mediaControls.playing.value,
    (playing) => { state.value.playing = playing; }
  );

  watch(
    () => mediaControls.muted.value,
    (muted) => { state.value.muted = muted; }
  );

  watch(
    () => mediaControls.volume.value,
    (volume) => { state.value.volume = volume; }
  );

  watch(
    () => mediaControls.currentTime.value,
    (currentTime) => { state.value.currentTime = currentTime; }
  );

  // Use duration from props if available, otherwise from media controls
  const displayDuration = computed(() => {
    if (durationMs && durationMs > 0) {
      return durationMs / 1000;
    }
    return mediaControls.duration.value;
  });

  watch(displayDuration, (duration) => {
    state.value.duration = duration;
  }, { immediate: true });

  // Calculate progress percentage
  const progress = computed(() => {
    const duration = displayDuration.value;
    if (duration <= 0) return 0;
    return (mediaControls.currentTime.value / duration) * 100;
  });

  watch(progress, (p) => { state.value.progress = p; });
  watch(isSeeking, (s) => { state.value.isSeeking = s; });

  // Format time as mm:ss
  function formatTime(seconds: number): string {
    if (!Number.isFinite(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  const formattedTime = {
    current: computed(() => formatTime(mediaControls.currentTime.value)),
    duration: computed(() => formatTime(displayDuration.value)),
  };

  // Actions
  const actions: PlaybackActions = {
    togglePlay: () => {
      mediaControls.playing.value = !mediaControls.playing.value;
    },
    toggleMute: () => {
      mediaControls.muted.value = !mediaControls.muted.value;
    },
    setVolume: (volume: number) => {
      mediaControls.volume.value = Math.max(0, Math.min(1, volume));
    },
    seek: (time: number) => {
      mediaControls.currentTime.value = Math.max(0, Math.min(displayDuration.value, time));
    },
    startSeeking: () => {
      isSeeking.value = true;
    },
    endSeeking: () => {
      isSeeking.value = false;
    },
  };

  return {
    state: state.value,
    actions,
    mediaElementRef,
    formattedTime,
  };
}
