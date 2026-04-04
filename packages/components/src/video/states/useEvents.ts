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

  let previousMuted = muted.value;

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

export function createDomEventHandlers(emit: EventEmits) {
  return {
    onPlay: () => emit('mediaEvent', 'play'),
    onPause: () => emit('mediaEvent', 'pause'),
    onError: () => emit('mediaEvent', 'error'),
  };
}
