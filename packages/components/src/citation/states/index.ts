// Citation component state layer - Headless architecture
// All business logic lives here, index.vue is UI-only

import { ref, computed, onUnmounted } from 'vue';
import type { CitationProps, CitationType, CitationVariant } from '../schema';
import type { Ref, ComputedRef } from 'vue';

export interface UseCitationOptions extends CitationProps {
  emit: {
    (e: 'navigate', href: string, citation: CitationProps): void;
  };
}

export interface CitationState {
  FALLBACK_LOCALE: string;
  isPopoverOpen: Ref<boolean>;
  locale: ComputedRef<string>;
  displayDomain: ComputedRef<string | undefined>;
  sanitizedHref: ComputedRef<string | undefined>;
  typeIcon: ComputedRef<{ viewBox: string; path: string }>;
  resolvedVariant: ComputedRef<CitationVariant>;
  formatDate: (isoString: string, loc: string) => string;
  handleClick: () => void;
  handleKeyDown: (e: KeyboardEvent) => void;
  handleMouseEnter: () => void;
  handleMouseLeave: () => void;
}

const FALLBACK_LOCALE = 'en-US';

// Type icons as SVG components
const typeIcons: Record<CitationType, { viewBox: string; path: string }> = {
  webpage: {
    viewBox: '0 0 24 24',
    path: 'M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z',
  },
  document: {
    viewBox: '0 0 24 24',
    path: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8M16 17H8M10 9H8',
  },
  article: {
    viewBox: '0 0 24 24',
    path: 'M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2 M18 14h-8 M15 18h-5',
  },
  api: {
    viewBox: '0 0 24 24',
    path: 'M12 2v4 M12 18v4 M4.93 4.93l2.83 2.83 M16.24 16.24l2.83 2.83 M2 12h4 M18 12h4 M4.93 19.07l2.83-2.83 M16.24 7.76l2.83-2.83',
  },
  code: {
    viewBox: '0 0 24 24',
    path: 'm16 18 6-6-6-6 M8 6l-6 6 6 6',
  },
  other: {
    viewBox: '0 0 24 24',
    path: 'M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z M14 2v6h6',
  },
};

export function useCitation(options: UseCitationOptions): CitationState {
  const { locale: localeProp, domain, href, type, variant, onNavigate, emit } = options;

  const isPopoverOpen = ref(false);
  const popoverTimeout = ref<ReturnType<typeof setTimeout> | null>(null);

  const locale = computed(() => localeProp ?? FALLBACK_LOCALE);

  const displayDomain = computed(() => {
    if (domain) return domain;
    try {
      const urlObj = new URL(href);
      return urlObj.hostname.replace(/^www\./, '');
    } catch {
      return undefined;
    }
  });

  const sanitizedHref = computed(() => {
    if (!href) return undefined;
    if (href.startsWith('javascript:')) return undefined;
    if (href.startsWith('data:')) return undefined;
    if (href.startsWith('vbscript:')) return undefined;
    return href;
  });

  const typeIcon = computed(() => {
    return typeIcons[type ?? 'webpage'] ?? typeIcons.webpage;
  });

  const resolvedVariant = computed(() => variant ?? 'default');

  function formatDate(isoString: string, loc: string): string {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString(loc, {
        year: 'numeric',
        month: 'short',
      });
    } catch {
      return isoString;
    }
  }

  function handleClick() {
    if (!sanitizedHref.value) return;
    if (onNavigate) {
      emit('navigate', sanitizedHref.value, options);
    } else {
      window.open(sanitizedHref.value, '_blank', 'noopener,noreferrer');
    }
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (sanitizedHref.value && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      handleClick();
    }
  }

  function handleMouseEnter() {
    if (popoverTimeout.value) clearTimeout(popoverTimeout.value);
    popoverTimeout.value = setTimeout(() => {
      isPopoverOpen.value = true;
    }, 100);
  }

  function handleMouseLeave() {
    if (popoverTimeout.value) clearTimeout(popoverTimeout.value);
    popoverTimeout.value = setTimeout(() => {
      isPopoverOpen.value = false;
    }, 100);
  }

  onUnmounted(() => {
    if (popoverTimeout.value) clearTimeout(popoverTimeout.value);
  });

  return {
    FALLBACK_LOCALE,
    isPopoverOpen,
    locale,
    displayDomain,
    sanitizedHref,
    typeIcon,
    resolvedVariant,
    formatDate,
    handleClick,
    handleKeyDown,
    handleMouseEnter,
    handleMouseLeave,
  };
}
