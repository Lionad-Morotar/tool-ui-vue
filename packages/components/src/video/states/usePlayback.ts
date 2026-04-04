import { useMediaControls } from '@vueuse/core';
import { ref, watch } from 'vue';
import type { Ref } from 'vue';

export interface VideoPlaybackOptions {
  src: string;
  defaultPlaying?: boolean;
  defaultMuted?: boolean;
  defaultVolume?: number;
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
  actions: VideoPlaybackActions;
  mediaElementRef: Ref<HTMLVideoElement | null>;
}

export function usePlayback(options: VideoPlaybackOptions): VideoPlaybackReturns {
  const {
    src,
    defaultPlaying = false,
    defaultMuted = false,
    defaultVolume = 1,
  } = options;

  const mediaElementRef = ref<HTMLVideoElement | null>(null);

  const mediaControls = useMediaControls(mediaElementRef, { src });

  const state = ref<VideoPlaybackState>({
    playing: defaultPlaying,
    muted: defaultMuted,
    volume: defaultVolume,
  });

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
    state: state.value,
    actions,
    mediaElementRef,
  };
}
