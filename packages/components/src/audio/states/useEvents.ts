import { watch } from 'vue';
import type { Ref } from 'vue';

export type MediaEventType = 'play' | 'pause' | 'mute' | 'unmute' | 'error';

export interface EventEmits {
  (e: 'mediaEvent', type: MediaEventType): void;
}

export interface EventOptions {
  playing: Ref<boolean>;
  muted: Ref<boolean>;
  emit: EventEmits;
}

export function useEvents(options: EventOptions): void {
  const { playing, muted, emit } = options;

  // Track previous muted state for change detection
  let previousMuted = muted.value;

  // Emit events when playing state changes
  watch(
    playing,
    (newPlaying, oldPlaying) => {
      if (newPlaying && !oldPlaying) {
        emit('mediaEvent', 'play');
      } else if (!newPlaying && oldPlaying) {
        emit('mediaEvent', 'pause');
      }
    },
    { immediate: false }
  );

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
