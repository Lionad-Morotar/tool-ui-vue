import { openSafeNavigationHref } from '../../core';
import { computed, type ComputedRef } from 'vue';
import { useEvents, createDomEventHandlers } from './useEvents';
import { usePlayback } from './usePlayback';
import { resolveVideoNavigation } from '../video-helpers';
import type { VideoProps, AspectRatio, MediaFit } from '../schema';
import type { EventEmits } from './useEvents';

export interface VideoReturns {
  // Refs
  videoRef: ReturnType<typeof usePlayback>['mediaElementRef'];

  // State
  playing: ComputedRef<boolean>;
  muted: ComputedRef<boolean>;
  volume: ComputedRef<number>;

  // Display
  locale: ComputedRef<string>;
  resolvedRatio: ComputedRef<AspectRatio>;
  resolvedFit: ComputedRef<MediaFit>;
  autoPlay: ComputedRef<boolean>;
  hasOverlay: ComputedRef<boolean>;
  hasMetadata: ComputedRef<boolean>;
  sourceLabel: ComputedRef<string | undefined>;
  metadataDomain: ComputedRef<string | undefined>;
  primaryHref: ComputedRef<string | undefined>;

  // Actions
  togglePlay: () => void;
  handleOpen: () => void;

  // DOM handlers
  domHandlers: {
    onPlay: () => void;
    onPause: () => void;
    onError: () => void;
  };

  // Helpers
  formatCreatedAt: (createdAt: string) => string;
}

export function useVideo(
  props: VideoProps,
  emit: EventEmits & {
    (e: 'navigate', href: string): void;
  },
): VideoReturns {
  const FALLBACK_LOCALE = 'en-US';

  const {
    stateRef,
    actions,
    mediaElementRef: videoRef,
  } = usePlayback(props);

  useEvents({
    muted: computed(() => stateRef.value.muted),
    emit,
  });

  const locale = computed(() => props.locale ?? FALLBACK_LOCALE);
  const resolvedRatio = computed(() => props.ratio ?? 'auto');
  const resolvedFit = computed(() => props.fit ?? 'cover');
  const autoPlay = computed(() => props.autoPlay ?? true);
  const sourceLabel = computed(() => props.source?.label);
  const metadataDomain = computed(() =>
    props.domain && props.domain !== sourceLabel.value ? props.domain : undefined
  );
  const hasMetadata = computed(() =>
    Boolean(
      props.description || sourceLabel.value || metadataDomain.value || props.durationMs || props.createdAt
    )
  );

  const primaryHref = computed(() =>
    resolveVideoNavigation(props.href, props.source?.url).primaryHref
  );

  const hasOverlay = computed(() => Boolean(props.title || primaryHref.value));

  function handleOpen() {
    const href = primaryHref.value;
    if (!href) return;
    emit('navigate', href);
    openSafeNavigationHref(href);
  }

  function formatCreatedAt(createdAtStr: string): string {
    const date = new Date(createdAtStr);
    if (Number.isNaN(date.getTime())) {
      return createdAtStr;
    }
    return new Intl.DateTimeFormat(locale.value, { dateStyle: 'medium' }).format(
      date
    );
  }

  const domHandlers = createDomEventHandlers(emit);

  return {
    videoRef,
    playing: computed(() => stateRef.value.playing),
    muted: computed(() => stateRef.value.muted),
    volume: computed(() => stateRef.value.volume),
    locale,
    resolvedRatio,
    resolvedFit,
    autoPlay,
    hasOverlay,
    hasMetadata,
    sourceLabel,
    metadataDomain,
    primaryHref,
    togglePlay: actions.togglePlay,
    handleOpen,
    domHandlers,
    formatCreatedAt,
  };
}
