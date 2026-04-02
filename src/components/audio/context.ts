import { inject, provide, ref, shallowRef, type InjectionKey } from "vue";

export interface AudioPlaybackState {
  playing: boolean;
  muted: boolean;
  volume: number;
}

export interface AudioContextValue {
  state: AudioPlaybackState;
  setState: (patch: Partial<AudioPlaybackState>) => void;
  audioElement: HTMLAudioElement | null;
  setAudioElement: (node: HTMLAudioElement | null) => void;
}

const AudioContextKey: InjectionKey<AudioContextValue> = Symbol("audio-context");

export function useAudio(): AudioContextValue {
  const ctx = inject(AudioContextKey);
  if (!ctx) {
    throw new Error("useAudio must be used within an <AudioProvider />");
  }
  return ctx;
}

export interface AudioProviderOptions {
  defaultState?: Partial<AudioPlaybackState>;
}

export function provideAudio(options: AudioProviderOptions = {}): AudioContextValue {
  const { defaultState = {} } = options;

  const state = ref<AudioPlaybackState>({
    playing: defaultState.playing ?? false,
    muted: defaultState.muted ?? false,
    volume: defaultState.volume ?? 1,
  });

  const audioElement = shallowRef<HTMLAudioElement | null>(null);

  const setState = (patch: Partial<AudioPlaybackState>) => {
    Object.assign(state.value, patch);
  };

  const setAudioElement = (node: HTMLAudioElement | null) => {
    audioElement.value = node;
  };

  const contextValue: AudioContextValue = {
    state: state.value,
    setState,
    audioElement: audioElement.value,
    setAudioElement,
  };

  // Provide the context
  provide(AudioContextKey, contextValue);

  // Return reactive version for internal use
  return {
    state: state.value,
    setState,
    get audioElement() {
      return audioElement.value;
    },
    setAudioElement,
  };
}

/**
 * Composable to create a local audio context for a component
 * Use this when you don't need to share state between components
 */
export function useLocalAudio(options: AudioProviderOptions = {}): AudioContextValue {
  const { defaultState = {} } = options;

  const state = ref<AudioPlaybackState>({
    playing: defaultState.playing ?? false,
    muted: defaultState.muted ?? false,
    volume: defaultState.volume ?? 1,
  });

  const audioElement = shallowRef<HTMLAudioElement | null>(null);

  const setState = (patch: Partial<AudioPlaybackState>) => {
    Object.assign(state.value, patch);
  };

  const setAudioElement = (node: HTMLAudioElement | null) => {
    audioElement.value = node;
  };

  return {
    state: state.value,
    setState,
    get audioElement() {
      return audioElement.value;
    },
    setAudioElement,
  };
}
