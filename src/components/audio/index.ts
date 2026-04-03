export { default as Audio } from './index.vue';
export type { AudioProps, SerializableAudio, Source } from './schema';
export {
  SerializableAudioSchema,
  SourceSchema,
  parseSerializableAudio,
  safeParseSerializableAudio,
} from './schema';
export {
  useAudio,
} from './states';
