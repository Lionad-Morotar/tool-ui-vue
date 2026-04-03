// Image component state layer - Headless architecture
// All business logic lives here, index.vue is UI-only

import { computed, type ComputedRef } from 'vue';
import type { ImageProps, AspectRatio, MediaFit } from '../schema';

export interface UseImageOptions extends ImageProps {
  emit: {
    (e: 'navigate', href: string): void;
  };
}

export interface ImageState {
  resolvedRatio: ComputedRef<AspectRatio>;
  resolvedFit: ComputedRef<MediaFit>;
  locale: ComputedRef<string>;
  sourceLabel: ComputedRef<string | undefined>;
  fallbackInitial: ComputedRef<string>;
  hasSource: ComputedRef<boolean>;
  hasMetadata: ComputedRef<string | boolean>;
  ratioClassMap: Record<AspectRatio, string>;
  fitClassMap: Record<MediaFit, string>;
  handleImageClick: () => void;
  handleSourceClick: () => void;
}

const FALLBACK_LOCALE = 'en-US';

const ratioClassMap: Record<AspectRatio, string> = {
  auto: '',
  '1:1': 'aspect-square',
  '4:3': 'aspect-[4/3]',
  '16:9': 'aspect-video',
  '9:16': 'aspect-[9/16]',
};

const fitClassMap: Record<MediaFit, string> = {
  cover: 'object-cover',
  contain: 'object-contain',
};

export function useImage(options: UseImageOptions): ImageState {
  const { ratio, fit, locale: localeProp, source, domain, title, href, emit } = options;

  const resolvedRatio = computed(() => ratio ?? 'auto');
  const resolvedFit = computed(() => fit ?? 'cover');
  const locale = computed(() => localeProp ?? FALLBACK_LOCALE);

  const sourceLabel = computed(() => source?.label ?? domain);
  const fallbackInitial = computed(() =>
    (sourceLabel.value ?? '').trim().charAt(0).toUpperCase()
  );
  const hasSource = computed(() => Boolean(sourceLabel.value || source?.iconUrl));
  const hasMetadata = computed(() => title || hasSource.value);

  function handleImageClick() {
    if (href) {
      emit('navigate', href);
    }
  }

  function handleSourceClick() {
    if (source?.url) {
      emit('navigate', source.url);
    }
  }

  return {
    resolvedRatio,
    resolvedFit,
    locale,
    sourceLabel,
    fallbackInitial,
    hasSource,
    hasMetadata,
    ratioClassMap,
    fitClassMap,
    handleImageClick,
    handleSourceClick,
  };
}
