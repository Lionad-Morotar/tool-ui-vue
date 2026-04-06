// Audio component state layer - Headless architecture
// All business logic lives here, index.vue is UI-only

export { usePlayback, type PlaybackProps, type PlaybackState, type PlaybackActions } from './usePlayback';
export { useEvents, createDomEventHandlers, type MediaEventType, type EventEmits } from './useEvents';
export { useAudio, useSharedAudio, type AudioReturns } from './useAudio';
