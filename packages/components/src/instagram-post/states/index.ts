// InstagramPost component state layer - Headless architecture
// All business logic lives here, index.vue is UI-only

import type { InstagramPostProps, InstagramPostData } from '../schema';

export interface UseInstagramPostOptions extends InstagramPostProps {
  emit: {
    (e: 'action', action: string, post: InstagramPostData): void;
  };
}

export interface InstagramPostState {
  formatRelativeTime: (dateStr: string) => string;
  handleAction: (action: string) => void;
}

export function useInstagramPost(options: UseInstagramPostOptions): InstagramPostState {
  const { post, emit } = options;

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

  function handleAction(action: string) {
    emit('action', action, post);
  }

  return {
    formatRelativeTime,
    handleAction,
  };
}
