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

  watch(muted, (newValue) => {
    emit('mediaEvent', newValue ? 'mute' : 'unmute');
  });
}

// Handler functions for DOM events
export function createDomEventHandlers(emit: EventEmits) {
  return {
    onPlay: () => emit('mediaEvent', 'play'),
    onPause: () => emit('mediaEvent', 'pause'),
    onError: () => emit('mediaEvent', 'error'),
  };
}
