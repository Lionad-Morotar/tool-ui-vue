import { computed, type ComputedRef } from 'vue';
import type { VideoProps, AspectRatio, MediaFit } from '../schema';
import type { EventEmits } from './useEvents';
import { usePlayback } from './usePlayback';
import { useEvents, createDomEventHandlers } from './useEvents';
import { resolveVideoNavigation } from '../video-helpers';
import { openSafeNavigationHref } from '../../../shared/media';

export interface UseVideoOptions extends VideoProps {
  emit: EventEmits & {
    (e: 'navigate', href: string): void;
  };
}

export interface VideoReturns {
  // Refs
  videoRef: ReturnType<typeof usePlayback>['mediaElementRef'];

  // State
  playing: boolean;
  muted: boolean;
  volume: number;

  // Display
  locale: ComputedRef<string>;
  resolvedRatio: ComputedRef<AspectRatio>;
  resolvedFit: ComputedRef<MediaFit>;
  autoPlay: ComputedRef<boolean>;
  hasOverlay: ComputedRef<boolean>;
  hasMetadata: ComputedRef<boolean>;
  sourceLabel: ComputedRef<string | undefined>;
  metadataDomain: ComputedRef<string | undefined>;
  primaryHref: string | undefined;

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

export function useVideo(options: UseVideoOptions): VideoReturns {
  const {
    src,
    autoPlay: autoPlayProp,
    durationMs,
    ratio,
    fit,
    createdAt,
    locale: localeProp,
    title,
    description,
    href,
    domain,
    source,
    emit,
  } = options;

  const FALLBACK_LOCALE = 'en-US';

  const {
    state,
    actions,
    mediaElementRef: videoRef,
  } = usePlayback({
    src,
    defaultPlaying: false,
    defaultMuted: autoPlayProp !== false,
    defaultVolume: 1,
  });

  useEvents({
    playing: computed(() => state.playing),
    muted: computed(() => state.muted),
    emit,
  });

  const locale = computed(() => localeProp ?? FALLBACK_LOCALE);
  const resolvedRatio = computed(() => ratio ?? 'auto');
  const resolvedFit = computed(() => fit ?? 'cover');
  const autoPlay = computed(() => autoPlayProp ?? true);
  const sourceLabel = computed(() => source?.label);
  const metadataDomain = computed(() =>
    domain && domain !== sourceLabel.value ? domain : undefined
  );
  const hasMetadata = computed(() =>
    Boolean(
      description || sourceLabel.value || metadataDomain.value || durationMs || createdAt
    )
  );

  const { primaryHref } = computed(() =>
    resolveVideoNavigation(href, source?.url)
  ).value;

  const hasOverlay = computed(() => Boolean(title || primaryHref));

  function handleOpen() {
    if (!primaryHref) return;
    emit('navigate', primaryHref);
    openSafeNavigationHref(primaryHref);
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
    playing: state.playing,
    muted: state.muted,
    volume: state.volume,
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
