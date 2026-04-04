import Audio from './index.vue'
export { Audio }
export default Audio

export type { AudioProps, SerializableAudio, Source } from './schema'

export {
  SerializableAudioSchema,
  SourceSchema,
  parseSerializableAudio,
  safeParseSerializableAudio,
} from './schema'

export { useAudio } from './states'
