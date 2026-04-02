export { default as Video } from "./index.vue";
export type {
  VideoProps,
  SerializableVideo,
  Source,
  AspectRatio,
  MediaFit,
} from "./schema";
export {
  SerializableVideoSchema,
  SourceSchema,
  AspectRatioSchema,
  MediaFitSchema,
  parseSerializableVideo,
  safeParseSerializableVideo,
} from "./schema";
export {
  useVideo,
  useLocalVideo,
  provideVideo,
  type VideoPlaybackState,
  type VideoContextValue,
} from "./context";
export {
  getMuteMediaEvent,
  resolveVideoNavigation,
  normalizeVideoDataForCallback,
  type VideoMediaEvent,
  type ResolvedVideoNavigation,
} from "./video-helpers";
