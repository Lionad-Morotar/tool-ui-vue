// XPost component state layer - Headless architecture
// All business logic lives here, index.vue is UI-only

import type { XPostProps, XPostData } from '../schema';

export interface UseXPostOptions extends XPostProps {
  emit: {
    (e: 'action', action: string, post: XPostData): void;
  };
}

export interface XPostState {
  formatCount: (count: number) => string;
  formatRelativeTime: (dateStr: string) => string;
  getDomain: (url: string) => string;
  getAspectRatio: (ratio?: string) => string;
  sanitizeHref: (href?: string) => string | undefined;
  resolveSafeNavigationHref: (...candidates: Array<string | null | undefined>) => string | undefined;
  handleAction: (action: string) => void;
  handleLinkClick: (url: string) => void;
}

export function useXPost(options: UseXPostOptions): XPostState {
  const { post, emit } = options;

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
    if (diffDays < 30) return `${diffDays}d`;
    return date.toLocaleDateString();
  }

  function getDomain(url: string): string {
    try {
      return new URL(url).hostname.replace(/^www\./, '');
    } catch {
      return '';
    }
  }

  function getAspectRatio(ratio?: string): string {
    if (ratio === '1:1') return '1';
    if (ratio === '4:3') return '4/3';
    if (ratio === '9:16') return '9/16';
    return '16/9';
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
    emit('action', action, post);
  }

  function handleLinkClick(url: string) {
    const safeUrl = resolveSafeNavigationHref(url);
    if (safeUrl) {
      window.open(safeUrl, '_blank', 'noopener,noreferrer');
    }
  }

  return {
    formatCount,
    formatRelativeTime,
    getDomain,
    getAspectRatio,
    sanitizeHref,
    resolveSafeNavigationHref,
    handleAction,
    handleLinkClick,
  };
}
