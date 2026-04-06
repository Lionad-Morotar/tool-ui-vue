import { useMediaControls } from '@vueuse/core';
import { computed, ref, toRef, watch } from 'vue';
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

  // Use VueUse's useMediaControls for advanced media handling
  const mediaControls = useMediaControls(mediaElementRef, { src: toRef(props, 'src') });

  // Local playback state
  const state = ref<PlaybackState>({
    playing: props.autoPlay ?? false,
    muted: props.muted ?? (props.autoPlay === true),
    volume: props.volume ?? 1,
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
    const ms = props.durationMs;
    if (ms && ms > 0) {
      return ms / 1000;
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
    stateRef: state,
    actions,
    mediaElementRef,
    formattedTime,
  };
}
