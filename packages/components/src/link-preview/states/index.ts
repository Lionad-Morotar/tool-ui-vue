// LinkPreview component state layer - Headless architecture
// All business logic lives here, index.vue is UI-only

import { computed, type Ref } from 'vue';
import type { LinkPreviewProps, AspectRatio, MediaFit } from '../schema';

export interface UseLinkPreviewOptions extends LinkPreviewProps {
  emit: {
    (e: 'navigate', href: string): void;
  };
}

export interface LinkPreviewState {
  resolvedRatio: Ref<AspectRatio>;
  resolvedFit: Ref<MediaFit>;
  displayDomain: Ref<string>;
  ratioClassMap: Record<AspectRatio, string>;
  fitClassMap: Record<MediaFit, string>;
  handleNavigate: () => void;
  handleKeyDown: (e: KeyboardEvent) => void;
}

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

export function useLinkPreview(options: UseLinkPreviewOptions): LinkPreviewState {
  const { ratio, fit, domain, href, emit } = options;

  const resolvedRatio = computed(() => ratio ?? 'auto');
  const resolvedFit = computed(() => fit ?? 'cover');

  const displayDomain = computed(() => {
    if (domain) return domain;
    try {
      const url = new URL(href);
      return url.hostname.replace(/^www\./, '');
    } catch {
      return '';
    }
  });

  function handleNavigate() {
    if (href) {
      emit('navigate', href);
    }
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (href && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      emit('navigate', href);
    }
  }

  return {
    resolvedRatio,
    resolvedFit,
    displayDomain,
    ratioClassMap,
    fitClassMap,
    handleNavigate,
    handleKeyDown,
  };
}
