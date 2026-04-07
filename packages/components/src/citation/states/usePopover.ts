import { ref, onUnmounted } from 'vue';
import type { Ref } from 'vue';

export interface UsePopoverOptions {
  placement: 'top' | 'bottom';
  id: string;
  delay?: number;
}

export interface UsePopoverReturn {
  isOpen: Ref<boolean>;
  supportsAnchor: Ref<boolean>;
  triggerRef: Ref<HTMLElement | null>;
  popoverRef: Ref<HTMLElement | null>;
  triggerAttrs: () => {
    'aria-expanded': boolean;
    'aria-haspopup': 'dialog';
    'aria-controls': string;
  };
  popoverAttrs: () => {
    id: string;
    popover: 'auto';
    autofocus: true;
  };
  handleMouseEnter: () => void;
  handleMouseLeave: () => void;
  handleTriggerKeyDown: (e: KeyboardEvent) => void;
  handlePopoverKeyDown: (e: KeyboardEvent) => void;
  show: () => void;
  hide: () => void;
}

export function usePopover(options: UsePopoverOptions): UsePopoverReturn {
  const { id, delay = 100 } = options;

  const isOpen = ref(false);
  const triggerRef = ref<HTMLElement | null>(null);
  const popoverRef = ref<HTMLElement | null>(null);
  const timeout = ref<ReturnType<typeof setTimeout> | null>(null);

  const supportsAnchor = ref(
    typeof window !== 'undefined' &&
      typeof CSS !== 'undefined' &&
      (CSS.supports('anchor-name', '--a') || CSS.supports('position-anchor', '--a'))
  );

  function show() {
    if (!popoverRef.value) return;
    isOpen.value = true;
    try {
      popoverRef.value.showPopover();
    } catch {
      // noop for environments without Popover API
    }
  }

  function hide() {
    if (!popoverRef.value) return;
    isOpen.value = false;
    try {
      popoverRef.value.hidePopover();
    } catch {
      // noop
    }
  }

  function handleMouseEnter() {
    if (timeout.value) clearTimeout(timeout.value);
    timeout.value = setTimeout(() => {
      show();
    }, delay);
  }

  function handleMouseLeave() {
    if (timeout.value) clearTimeout(timeout.value);
    timeout.value = setTimeout(() => {
      hide();
    }, delay);
  }

  function handleTriggerKeyDown(e: KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (isOpen.value) hide();
      else show();
    }
  }

  function handlePopoverKeyDown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      e.stopPropagation();
      hide();
      triggerRef.value?.focus();
    }
  }

  onUnmounted(() => {
    if (timeout.value) clearTimeout(timeout.value);
  });

  const triggerAttrs = () => ({
    'aria-expanded': isOpen.value,
    'aria-haspopup': 'dialog' as const,
    'aria-controls': id,
  });

  const popoverAttrs = () => ({
    id,
    popover: 'auto' as const,
    autofocus: true as const,
  });

  return {
    isOpen,
    supportsAnchor,
    triggerRef,
    popoverRef,
    triggerAttrs,
    popoverAttrs,
    handleMouseEnter,
    handleMouseLeave,
    handleTriggerKeyDown,
    handlePopoverKeyDown,
    show,
    hide,
  };
}
