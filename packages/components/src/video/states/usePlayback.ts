import { useMediaControls } from '@vueuse/core';
import { ref, toRef, watch } from 'vue';
import type { Ref } from 'vue';

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
  stateRef: Ref<VideoPlaybackState>;
  actions: VideoPlaybackActions;
  mediaElementRef: Ref<HTMLVideoElement | null>;
}

export function usePlayback(props: VideoPlaybackOptions): VideoPlaybackReturns {
  const mediaElementRef = ref<HTMLVideoElement | null>(null);

  const mediaControls = useMediaControls(mediaElementRef, { src: toRef(props, 'src') });

  const state = ref<VideoPlaybackState>({
    playing: props.autoPlay ?? false,
    muted: props.muted ?? (props.autoPlay === true),
    volume: props.volume ?? 1,
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
    stateRef: state,
    actions,
    mediaElementRef,
  };
}
