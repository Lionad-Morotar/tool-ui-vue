import { useMediaControls } from '@vueuse/core';
import { computed, ref, toRef } from 'vue';
import type { ComputedRef } from 'vue';

export interface VideoPlaybackOptions {
  src: string;
  durationMs?: number;
  autoPlay?: boolean;
  muted?: boolean;
  volume?: number;
}

export interface VideoPlaybackState {
  playing: boolean;
  muted: boolean;
  volume: number;
}

export interface VideoPlaybackActions {
  togglePlay: () => void;
  toggleMute: () => void;
  setVolume: (volume: number) => void;
}

export interface VideoPlaybackReturns {
  state: VideoPlaybackState;
  stateRef: ComputedRef<VideoPlaybackState>;
  actions: VideoPlaybackActions;
  mediaElementRef: ReturnType<typeof ref<HTMLVideoElement | null>>;
}

export function usePlayback(props: VideoPlaybackOptions): VideoPlaybackReturns {
  const mediaElementRef = ref<HTMLVideoElement | null>(null);

  const mediaControls = useMediaControls(mediaElementRef, { src: toRef(props, 'src') });

  const stateRef = computed<VideoPlaybackState>(() => ({
    playing: mediaControls.playing.value,
    muted: mediaControls.muted.value,
    volume: mediaControls.volume.value,
  }));

  const actions: VideoPlaybackActions = {
    togglePlay: () => {
      mediaControls.playing.value = !mediaControls.playing.value;
    },
    toggleMute: () => {
      mediaControls.muted.value = !mediaControls.muted.value;
    },
    setVolume: (volume: number) => {
      mediaControls.volume.value = Math.max(0, Math.min(1, volume));
    },
  };

  return {
    state: stateRef.value,
    stateRef,
    actions,
    mediaElementRef,
  };
}
