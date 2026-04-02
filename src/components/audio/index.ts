export { default as Audio } from "./index.vue";
export type { AudioProps, SerializableAudio, Source } from "./schema";
export {
  SerializableAudioSchema,
  SourceSchema,
  parseSerializableAudio,
  safeParseSerializableAudio,
} from "./schema";
export {
  useAudio,
  useLocalAudio,
  provideAudio,
  type AudioPlaybackState,
  type AudioContextValue,
} from "./context";
