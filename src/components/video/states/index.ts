// Video component state layer - Headless architecture
// All business logic lives here, index.vue is UI-only

export {
  usePlayback,
  type VideoPlaybackOptions,
  type VideoPlaybackState,
  type VideoPlaybackActions,
  type VideoPlaybackReturns,
} from './usePlayback';
export {
  useEvents,
  createDomEventHandlers,
  type MediaEventType,
  type EventEmits,
} from './useEvents';
export {
  useVideo,
  type UseVideoOptions,
  type VideoReturns,
} from './useVideo';
