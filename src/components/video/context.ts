import { inject, provide, ref, shallowRef, type InjectionKey } from 'vue';

export interface VideoPlaybackState {
  playing: boolean;
  muted: boolean;
  volume: number;
}

export interface VideoContextValue {
  state: VideoPlaybackState;
  setState: (patch: Partial<VideoPlaybackState>) => void;
  videoElement: HTMLVideoElement | null;
  setVideoElement: (node: HTMLVideoElement | null) => void;
}

const VideoContextKey: InjectionKey<VideoContextValue> = Symbol('video-context');

export function useVideo(): VideoContextValue {
  const ctx = inject(VideoContextKey);
  if (!ctx) {
    throw new Error('useVideo must be used within a <VideoProvider />');
  }
  return ctx;
}

export interface VideoProviderOptions {
  defaultState?: Partial<VideoPlaybackState>;
}

export function provideVideo(options: VideoProviderOptions = {}): VideoContextValue {
  const { defaultState = {} } = options;

  const state = ref<VideoPlaybackState>({
    playing: defaultState.playing ?? false,
    muted: defaultState.muted ?? true,
    volume: defaultState.volume ?? 1,
  });

  const videoElement = shallowRef<HTMLVideoElement | null>(null);

  const setState = (patch: Partial<VideoPlaybackState>) => {
    Object.assign(state.value, patch);
  };

  const setVideoElement = (node: HTMLVideoElement | null) => {
    videoElement.value = node;
  };

  const contextValue: VideoContextValue = {
    state: state.value,
    setState,
    videoElement: videoElement.value,
    setVideoElement,
  };

  provide(VideoContextKey, contextValue);

  return {
    state: state.value,
    setState,
    get videoElement() {
      return videoElement.value;
    },
    setVideoElement,
  };
}

/**
 * Composable to create a local video context for a component
 * Use this when you don't need to share state between components
 */
export function useLocalVideo(options: VideoProviderOptions = {}): VideoContextValue {
  const { defaultState = {} } = options;

  const state = ref<VideoPlaybackState>({
    playing: defaultState.playing ?? false,
    muted: defaultState.muted ?? true,
    volume: defaultState.volume ?? 1,
  });

  const videoElement = shallowRef<HTMLVideoElement | null>(null);

  const setState = (patch: Partial<VideoPlaybackState>) => {
    Object.assign(state.value, patch);
  };

  const setVideoElement = (node: HTMLVideoElement | null) => {
    videoElement.value = node;
  };

  return {
    state: state.value,
    setState,
    get videoElement() {
      return videoElement.value;
    },
    setVideoElement,
  };
}
