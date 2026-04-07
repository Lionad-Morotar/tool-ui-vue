// Citation component state layer - Headless architecture
// All business logic lives here, index.vue is UI-only

import { computed } from 'vue';
import type { CitationProps, CitationVariant } from '../schema';
import type { ComputedRef } from 'vue';
import { typeIcons } from '../icons';

export type CitationEmit = {
  (e: 'navigate', href: string, citation: CitationProps): void;
};

export interface CitationState {
  locale: ComputedRef<string>;
  displayDomain: ComputedRef<string | undefined>;
  sanitizedHref: ComputedRef<string | undefined>;
  typeIcon: ComputedRef<{ viewBox: string; path: string }>;
  resolvedVariant: ComputedRef<CitationVariant>;
  formatDate: (isoString: string, loc: string) => string;
  handleClick: () => void;
  handleKeyDown: (e: KeyboardEvent) => void;
}

const FALLBACK_LOCALE = 'en-US';

export function useCitation(
  props: CitationProps,
  emit: CitationEmit,
): CitationState {
  const locale = computed(() => props.locale ?? FALLBACK_LOCALE);

  const displayDomain = computed(() => {
    if (props.domain) return props.domain;
    try {
      const urlObj = new URL(props.href);
      return urlObj.hostname.replace(/^www\./, '');
    } catch {
      return undefined;
    }
  });

  const sanitizedHref = computed(() => {
    if (!props.href) return undefined;
    if (props.href.startsWith('javascript:')) return undefined;
    if (props.href.startsWith('data:')) return undefined;
    if (props.href.startsWith('vbscript:')) return undefined;
    return props.href;
  });

  const typeIcon = computed(() => {
    return typeIcons[props.type ?? 'webpage'] ?? typeIcons.webpage;
  });

  const resolvedVariant = computed(() => props.variant ?? 'default');

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
    if (props.onNavigate) {
      emit('navigate', sanitizedHref.value, props);
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

  return {
    locale,
    displayDomain,
    sanitizedHref,
    typeIcon,
    resolvedVariant,
    formatDate,
    handleClick,
    handleKeyDown,
  };
}
