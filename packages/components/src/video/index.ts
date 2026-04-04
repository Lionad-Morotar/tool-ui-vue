import Video from './index.vue'
export { Video }
export default Video

export type {
  VideoProps,
  SerializableVideo,
  Source,
  AspectRatio,
  MediaFit,
} from './schema';
export {
  SerializableVideoSchema,
  SourceSchema,
  AspectRatioSchema,
  MediaFitSchema,
  parseSerializableVideo,
  safeParseSerializableVideo,
} from './schema';
export {
  useVideo,
  usePlayback,
  useEvents,
  createDomEventHandlers,
  type VideoPlaybackState,
  type VideoPlaybackActions,
  type MediaEventType,
  type EventEmits,
} from './states';
export {
  getMuteMediaEvent,
  resolveVideoNavigation,
  normalizeVideoDataForCallback,
  type VideoMediaEvent,
  type ResolvedVideoNavigation,
} from './video-helpers';
