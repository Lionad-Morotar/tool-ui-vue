// Image component state layer - Headless architecture
// All business logic lives here, index.vue is UI-only

import { computed } from 'vue';
import type { ImageProps, AspectRatio, MediaFit } from '../schema';
import type { ComputedRef } from 'vue';

export type ImageEmit = {
  (e: 'navigate', href: string): void;
};

export interface ImageState {
  resolvedRatio: ComputedRef<AspectRatio>;
  resolvedFit: ComputedRef<MediaFit>;
  locale: ComputedRef<string>;
  sourceLabel: ComputedRef<string | undefined>;
  fallbackInitial: ComputedRef<string>;
  hasSource: ComputedRef<boolean>;
  hasMetadata: ComputedRef<string | boolean>;
  sanitizedSrc: ComputedRef<string | undefined>;
  sanitizedHref: ComputedRef<string | undefined>;
  sanitizedSourceUrl: ComputedRef<string | undefined>;
  sanitizedSourceIconUrl: ComputedRef<string | undefined>;
  ratioClassMap: Record<AspectRatio, string>;
  fitClassMap: Record<MediaFit, string>;
  handleImageClick: () => void;
  handleSourceClick: () => void;
}

/**
 * 安全的 URL 验证函数
 * 只允许 http: 和 https: 协议，防止 XSS 攻击
 */
function sanitizeHref(url?: string): string | undefined {
  if (!url) return undefined;
  const candidate = url.trim();
  if (!candidate) return undefined;

  try {
    const parsed = new URL(candidate);
    // 只允许 http: 和 https: 协议
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return undefined;
    }
    return candidate;
  } catch {
    // 如果不是绝对 URL，检查是否为相对路径（不允许）
    return undefined;
  }
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

export function useImage(
  props: ImageProps,
  emit: ImageEmit,
): ImageState {
  const resolvedRatio = computed(() => props.ratio ?? 'auto');
  const resolvedFit = computed(() => props.fit ?? 'cover');
  const locale = computed(() => props.locale ?? FALLBACK_LOCALE);

  const sourceLabel = computed(() => props.source?.label ?? props.domain);
  const fallbackInitial = computed(() =>
    (sourceLabel.value ?? '').trim().charAt(0).toUpperCase()
  );
  const hasSource = computed(() => Boolean(sourceLabel.value || props.source?.iconUrl));
  const hasMetadata = computed(() => props.title || hasSource.value);

  // 净化 URL，防止 XSS 攻击
  const sanitizedSrc = computed(() => sanitizeHref(props.src));
  const sanitizedHref = computed(() => sanitizeHref(props.href));
  const sanitizedSourceUrl = computed(() => sanitizeHref(props.source?.url));
  const sanitizedSourceIconUrl = computed(() => sanitizeHref(props.source?.iconUrl));

  function handleImageClick() {
    if (sanitizedHref.value) {
      emit('navigate', sanitizedHref.value);
    }
  }

  function handleSourceClick() {
    if (sanitizedSourceUrl.value) {
      emit('navigate', sanitizedSourceUrl.value);
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
    sanitizedSrc,
    sanitizedHref,
    sanitizedSourceUrl,
    sanitizedSourceIconUrl,
    ratioClassMap,
    fitClassMap,
    handleImageClick,
    handleSourceClick,
  };
}
