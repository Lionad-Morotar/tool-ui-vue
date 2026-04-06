import { watch } from 'vue';
import type { Ref } from 'vue';

export type MediaEventType = 'play' | 'pause' | 'mute' | 'unmute' | 'error';

export interface EventEmits {
  (e: 'mediaEvent', type: MediaEventType): void;
}

export interface EventOptions {
  muted: Ref<boolean>;
  emit: EventEmits;
}

export function useEvents(options: EventOptions): void {
  const { muted, emit } = options;

  // Track previous muted state for change detection
  let previousMuted = muted.value;

  // Note: play/pause events are handled by DOM event handlers (createDomEventHandlers)
  // to avoid duplicate emissions from both state watch and DOM events.

  // Emit events when muted state changes
  watch(
    muted,
    (newMuted) => {
      if (previousMuted !== newMuted) {
        emit('mediaEvent', newMuted ? 'mute' : 'unmute');
        previousMuted = newMuted;
      }
    },
    { immediate: false }
  );
}

// Handler functions for DOM events
export function createDomEventHandlers(emit: EventEmits) {
  return {
    onPlay: () => emit('mediaEvent', 'play'),
    onPause: () => emit('mediaEvent', 'pause'),
    onError: () => emit('mediaEvent', 'error'),
  };
}
