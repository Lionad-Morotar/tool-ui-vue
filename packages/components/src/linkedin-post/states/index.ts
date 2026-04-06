// LinkedinPost component state layer - Headless architecture
// All business logic lives here, cmpts/linkedin-post.vue is UI-only

import { ref, computed } from 'vue';
import type { LinkedInPostProps, LinkedInPostData } from '../schema';
import type { ComputedRef, Ref } from 'vue';

const TEXT_PREVIEW_LENGTH = 280;

export interface LinkedinPostState {
  isExpanded: Ref<boolean>;
  shouldTruncate: ComputedRef<boolean>;
  displayText: ComputedRef<string>;
  formatCount: (count: number) => string;
  formatRelativeTime: (dateStr: string) => string;
  getDomain: (url: string) => string;
  sanitizeHref: (href?: string) => string | undefined;
  resolveSafeNavigationHref: (...candidates: Array<string | null | undefined>) => string | undefined;
  handleAction: (action: string) => void;
  handleLinkClick: (url: string) => void;
}

type EmitFn = {
  (e: 'action', action: string, post: LinkedInPostData): void;
};

export function useLinkedinPost(props: LinkedInPostProps, emit: EmitFn): LinkedinPostState {

  const isExpanded = ref(false);

  function formatCount(count: number): string {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  }

  function formatRelativeTime(dateStr: string): string {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSecs < 60) return `${diffSecs}s`;
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;
    return `${Math.round(diffDays / 7)}w`;
  }

  function getDomain(url: string): string {
    try {
      return new URL(url).hostname.replace(/^www\./, '');
    } catch {
      return '';
    }
  }

  function sanitizeHref(href?: string): string | undefined {
    if (!href) return undefined;
    const candidate = href.trim();
    if (!candidate) return undefined;

    if (
      candidate.startsWith('/') ||
      candidate.startsWith('./') ||
      candidate.startsWith('../') ||
      candidate.startsWith('?') ||
      candidate.startsWith('#')
    ) {
      if (candidate.startsWith('//')) return undefined;
      if (/[\u0000-\u001F\u007F]/.test(candidate)) return undefined;
      return candidate;
    }

    try {
      const url = new URL(candidate);
      if (url.protocol === 'http:' || url.protocol === 'https:') {
        return url.toString();
      }
    } catch {
      return undefined;
    }
    return undefined;
  }

  function resolveSafeNavigationHref(
    ...candidates: Array<string | null | undefined>
  ): string | undefined {
    for (const candidate of candidates) {
      const safeHref = sanitizeHref(candidate ?? undefined);
      if (safeHref) {
        return safeHref;
      }
    }
    return undefined;
  }

  function handleAction(action: string) {
    emit('action', action, props.post);
  }

  function handleLinkClick(url: string) {
    const safeUrl = resolveSafeNavigationHref(url);
    if (safeUrl && typeof window !== 'undefined') {
      window.open(safeUrl, '_blank', 'noopener,noreferrer');
    }
  }

  const shouldTruncate = computed(() => {
    return Boolean(props.post.text && props.post.text.length > TEXT_PREVIEW_LENGTH);
  });

  const displayText = computed(() => {
    if (!props.post.text) return '';
    if (shouldTruncate.value && !isExpanded.value) {
      return props.post.text.slice(0, TEXT_PREVIEW_LENGTH);
    }
    return props.post.text;
  });

  return {
    isExpanded,
    shouldTruncate,
    displayText,
    formatCount,
    formatRelativeTime,
    getDomain,
    sanitizeHref,
    resolveSafeNavigationHref,
    handleAction,
    handleLinkClick,
  };
}
