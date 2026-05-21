import { computed, ref } from 'vue';
import type { ContactCardProps, ContactKind } from '../schema';
import type { ComputedRef, Ref } from 'vue';

export interface ContactCardState {
  locale: ComputedRef<string>;
  generatedHref: ComputedRef<string | undefined>;
  sanitizedHref: ComputedRef<string | undefined>;
  displayLabel: ComputedRef<string | undefined>;
  icon: ComputedRef<{ viewBox: string; path: string }>;
  isCopyable: ComputedRef<boolean>;
  copied: Ref<boolean>;
  handleClick: () => void;
  handleKeyDown: (e: KeyboardEvent) => void;
}

const FALLBACK_LOCALE = 'zh-CN';

const kindIcons: Record<ContactKind, { viewBox: string; path: string }> = {
  phone: {
    viewBox: '0 0 24 24',
    path: 'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z',
  },
  email: {
    viewBox: '0 0 24 24',
    path: 'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6',
  },
  address: {
    viewBox: '0 0 24 24',
    path: 'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z M12 7a3 3 0 0 1 3 3c0 1.66-1.34 3-3 3s-3-1.34-3-3a3 3 0 0 1 3-3z',
  },
  whatsapp: {
    viewBox: '0 0 24 24',
    path: 'M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z',
  },
  wechat: {
    viewBox: '0 0 24 24',
    path: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z M8 10a1 1 0 1 1 0 2 1 1 0 0 1 0-2z M14 10a1 1 0 1 1 0 2 1 1 0 0 1 0-2z',
  },
  website: {
    viewBox: '0 0 24 24',
    path: 'M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z M2 12h20 M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z',
  },
  other: {
    viewBox: '0 0 24 24',
    path: 'M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71 M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71',
  },
};

export function useContactCard(props: ContactCardProps): ContactCardState {
  const locale = computed(() => props.locale ?? FALLBACK_LOCALE);

  const generatedHref = computed(() => {
    if (props.href) return props.href;
    switch (props.kind) {
      case 'phone':
        return `tel:${props.value}`;
      case 'email':
        return `mailto:${props.value}`;
      case 'whatsapp':
        return `https://wa.me/${props.value}`;
      case 'website': {
        const v = props.value.trim();
        if (/^https?:\/\//i.test(v)) return v;
        return `https://${v}`;
      }
      default:
        return undefined;
    }
  });

  const sanitizedHref = computed(() => {
    const href = generatedHref.value;
    if (!href) return undefined;
    if (href.startsWith('javascript:')) return undefined;
    if (href.startsWith('data:')) return undefined;
    if (href.startsWith('vbscript:')) return undefined;
    return href;
  });

  const displayLabel = computed(() => props.label);

  const icon = computed(() => kindIcons[props.kind] ?? kindIcons.other);

  const isCopyable = computed(() => props.copyable ?? false);

  const copied = ref(false);

  function handleClick() {
    if (isCopyable.value) {
      copyToClipboard(props.value);
      return;
    }
    if (sanitizedHref.value) {
      window.open(sanitizedHref.value, '_blank', 'noopener,noreferrer');
    }
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (sanitizedHref.value && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      handleClick();
    }
  }

  async function copyToClipboard(text: string) {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(text);
        copied.value = true;
        setTimeout(() => { copied.value = false; }, 2000);
      }
    } catch {
      // Silently ignore clipboard errors
    }
  }

  return {
    locale,
    generatedHref,
    sanitizedHref,
    displayLabel,
    icon,
    isCopyable,
    copied,
    handleClick,
    handleKeyDown,
  };
}
