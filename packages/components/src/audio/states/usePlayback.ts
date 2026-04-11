import { useMediaControls } from '@vueuse/core';
import { computed, ref, toRef } from 'vue';
import type { Ref, ComputedRef } from 'vue';

export interface PlaybackProps {
  src: string;
  durationMs?: number;
  autoPlay?: boolean;
  muted?: boolean;
  volume?: number;
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
  stateRef: Ref<PlaybackState>;
  actions: PlaybackActions;
  mediaElementRef: Ref<HTMLAudioElement | null>;
  formattedTime: {
    current: ComputedRef<string>;
    duration: ComputedRef<string>;
  };
}

export function usePlayback(props: PlaybackProps): PlaybackReturns {
  const mediaElementRef = ref<HTMLAudioElement | null>(null);
  const isSeeking = ref(false);

  const mediaControls = useMediaControls(mediaElementRef, { src: toRef(props, 'src') });

  const displayDuration = computed(() => {
    const ms = props.durationMs;
    if (ms && ms > 0) return ms / 1000;
    return mediaControls.duration.value;
  });

  const progress = computed(() => {
    const duration = displayDuration.value;
    if (duration <= 0) return 0;
    return (mediaControls.currentTime.value / duration) * 100;
  });

  const stateRef = computed<PlaybackState>(() => ({
    playing: mediaControls.playing.value,
    muted: mediaControls.muted.value,
    volume: mediaControls.volume.value,
    currentTime: mediaControls.currentTime.value,
    duration: displayDuration.value,
    progress: progress.value,
    isSeeking: isSeeking.value,
  }));

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
    state: stateRef.value,
    stateRef,
    actions,
    mediaElementRef,
    formattedTime,
  };
}
