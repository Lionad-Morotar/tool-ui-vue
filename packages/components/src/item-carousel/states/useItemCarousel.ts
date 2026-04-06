import { prefersReducedMotion } from '@lionad/vtu-core';
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
import type { ItemCarouselProps } from '../schema';
import type { ComputedRef, Ref } from 'vue';

export interface UseItemCarouselOptions extends ItemCarouselProps {
  interactive?: boolean;
}

export interface ItemCarouselEmits {
  itemClick: (itemId: string) => void;
  itemAction: (itemId: string, actionId: string) => void;
  slideChange: (index: number) => void;
}

export interface ItemCarouselReturns {
  // Refs
  scrollRef: Ref<HTMLDivElement | null>;
  containerRef: Ref<HTMLDivElement | null>;
  canScrollLeft: Ref<boolean>;
  canScrollRight: Ref<boolean>;
  currentIndex: Ref<number>;
  isAnimating: Ref<boolean>;

  // Touch state refs (for internal tracking)
  touchStartX: Ref<number>;
  touchStartY: Ref<number>;
  isSwiping: Ref<boolean>;

  // Computed
  hasItems: ComputedRef<boolean>;
  isInteractive: ComputedRef<boolean>;

  // Actions
  updateScrollState: () => void;
  scroll: (direction: 'left' | 'right') => Promise<void>;
  scrollToIndex: (index: number) => void;
  handleScroll: () => void;
  handleItemClick: (itemId: string) => void;
  handleItemAction: (itemId: string, actionId: string) => void;
  handleTouchStart: (event: TouchEvent) => void;
  handleTouchMove: (event: TouchEvent) => void;
  handleTouchEnd: (event: TouchEvent) => void;
  handleKeyDown: (event: KeyboardEvent) => void;
}

// Constants
const SNAP_EPSILON_PX = 5;
const SCROLL_ANIMATION_DURATION_MS = 300;
const PAGE_SCROLL_RATIO = 0.8;
const PAGE_SCROLL_BREAKPOINT_PX = 640;
const SCROLL_EDGE_THRESHOLD_PX = 8;
const SWIPE_THRESHOLD = 50;
const SWIPE_TIME_THRESHOLD = 300;
const TOUCH_ANGLE_THRESHOLD = 45; // degrees

export function useItemCarousel(
  options: UseItemCarouselOptions,
  emit: ItemCarouselEmits
): ItemCarouselReturns {
  const { items, interactive } = options;

  // Refs
  const scrollRef = ref<HTMLDivElement | null>(null);
  const containerRef = ref<HTMLDivElement | null>(null);
  const canScrollLeft = ref(false);
  const canScrollRight = ref(false);
  const targetIndexRef = ref<number | null>(null);
  const isAnimating = ref(false);
  const currentIndex = ref(0);

  // Touch swipe state
  const touchStartX = ref(0);
  const touchStartY = ref(0);
  const touchStartTime = ref(0);
  const isSwiping = ref(false);

  const hasItems = computed(() => items.length > 0);
  const isInteractive = computed(() => interactive || false);

  function updateCurrentIndex() {
    const container = scrollRef.value;
    if (!container) return;

    const itemElements = Array.from(
      container.querySelectorAll<HTMLElement>('[data-carousel-item]')
    );
    if (itemElements.length === 0) return;

    const paddingValue = window.getComputedStyle(container).scrollPaddingLeft;
    const scrollPaddingLeft = Number.isFinite(Number.parseFloat(paddingValue))
      ? Number.parseFloat(paddingValue)
      : 0;

    const scrollLeft = Math.round(container.scrollLeft);
    let newIndex = 0;

    for (let i = 0; i < itemElements.length; i++) {
      const itemLeft = Math.max(0, itemElements[i].offsetLeft - scrollPaddingLeft);
      if (Math.abs(itemLeft - scrollLeft) < SNAP_EPSILON_PX || itemLeft > scrollLeft) {
        newIndex = i;
        break;
      }
      newIndex = i;
    }

    if (currentIndex.value !== newIndex) {
      currentIndex.value = newIndex;
      emit.slideChange(newIndex);
    }
  }

  function updateScrollState() {
    const container = scrollRef.value;
    if (!container) return;

    const scrollLeft = Math.round(container.scrollLeft);
    const maxScroll = Math.max(
      0,
      Math.round(container.scrollWidth - container.clientWidth)
    );

    canScrollLeft.value = scrollLeft > SCROLL_EDGE_THRESHOLD_PX;
    canScrollRight.value = scrollLeft < maxScroll - SCROLL_EDGE_THRESHOLD_PX;

    // Update current index based on scroll position
    updateCurrentIndex();
  }

  function smoothScrollTo(element: HTMLElement, target: number, duration = SCROLL_ANIMATION_DURATION_MS) {
    if (prefersReducedMotion() || duration <= 0) {
      element.scrollLeft = target;
      return Promise.resolve();
    }

    if (isAnimating.value) {
      return Promise.resolve();
    }

    isAnimating.value = true;
    const start = element.scrollLeft;
    const startTime = performance.now();

    // Temporarily disable scroll snap during animation
    const originalSnapType = element.style.scrollSnapType;
    element.style.scrollSnapType = 'none';

    return new Promise<void>((resolve) => {
      const step = () => {
        const elapsed = performance.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);

        element.scrollLeft = start + (target - start) * eased;

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          element.scrollLeft = target;
          element.style.scrollSnapType = originalSnapType;
          isAnimating.value = false;
          updateCurrentIndex();
          resolve();
        }
      };
      requestAnimationFrame(step);
    });
  }

  async function scroll(direction: 'left' | 'right') {
    const container = scrollRef.value;
    if (!container || isAnimating.value) return;

    const paddingValue = window.getComputedStyle(container).scrollPaddingLeft;
    const scrollPaddingLeft = Number.isFinite(Number.parseFloat(paddingValue))
      ? Number.parseFloat(paddingValue)
      : 0;

    const itemElements = Array.from(
      container.querySelectorAll<HTMLElement>('[data-carousel-item]')
    );
    if (itemElements.length === 0) return;

    const snapPositions = itemElements.map((el) =>
      Math.max(0, el.offsetLeft - scrollPaddingLeft)
    );

    const scrollLeft = Math.round(container.scrollLeft);
    let currentIdx: number;

    if (isAnimating.value && targetIndexRef.value !== null) {
      currentIdx = Math.min(targetIndexRef.value, snapPositions.length - 1);
    } else {
      currentIdx = snapPositions.length - 1;
      for (let i = 0; i < snapPositions.length; i++) {
        const snap = snapPositions[i];
        if (Math.abs(snap - scrollLeft) < SNAP_EPSILON_PX) {
          currentIdx = i;
          break;
        }
        if (snap > scrollLeft) {
          currentIdx = Math.max(0, i - 1);
          break;
        }
      }
    }

    const itemStep =
      itemElements.length > 1
        ? itemElements[1].offsetLeft - itemElements[0].offsetLeft
        : 0;
    const safeStep =
      itemStep > 0 ? itemStep : itemElements[0].offsetWidth || 1;

    const pageIndexStep =
      container.clientWidth >= PAGE_SCROLL_BREAKPOINT_PX
        ? Math.max(
            1,
            Math.floor(
              (container.clientWidth * PAGE_SCROLL_RATIO) / safeStep
            )
          )
        : 1;

    const targetIndex =
      direction === 'right'
        ? Math.min(currentIdx + pageIndexStep, itemElements.length - 1)
        : Math.max(currentIdx - pageIndexStep, 0);

    targetIndexRef.value = targetIndex;
    const targetScrollLeft = snapPositions[targetIndex];

    if (Math.abs(targetScrollLeft - container.scrollLeft) > 1) {
      await smoothScrollTo(container, targetScrollLeft, SCROLL_ANIMATION_DURATION_MS);
      targetIndexRef.value = null;
    }
  }

  function scrollToIndex(index: number) {
    const container = scrollRef.value;
    if (!container || isAnimating.value) return;

    const itemElements = Array.from(
      container.querySelectorAll<HTMLElement>('[data-carousel-item]')
    );
    if (index < 0 || index >= itemElements.length) return;

    const paddingValue = window.getComputedStyle(container).scrollPaddingLeft;
    const scrollPaddingLeft = Number.isFinite(Number.parseFloat(paddingValue))
      ? Number.parseFloat(paddingValue)
      : 0;

    const targetScrollLeft = Math.max(0, itemElements[index].offsetLeft - scrollPaddingLeft);

    targetIndexRef.value = index;
    smoothScrollTo(container, targetScrollLeft, SCROLL_ANIMATION_DURATION_MS).then(() => {
      targetIndexRef.value = null;
    });
  }

  function handleScroll() {
    updateScrollState();
  }

  function handleItemClick(itemId: string) {
    emit.itemClick(itemId);
  }

  function handleItemAction(itemId: string, actionId: string) {
    emit.itemAction(itemId, actionId);
  }

  // Touch event handlers for swipe support
  function handleTouchStart(event: TouchEvent) {
    const touch = event.touches[0];
    touchStartX.value = touch.clientX;
    touchStartY.value = touch.clientY;
    touchStartTime.value = performance.now();
    isSwiping.value = true;
  }

  function handleTouchMove(event: TouchEvent) {
    if (!isSwiping.value) return;

    const touch = event.touches[0];
    const deltaX = touchStartX.value - touch.clientX;
    const deltaY = touchStartY.value - touch.clientY;

    // Determine if scrolling horizontally or vertically
    const angle = Math.abs(Math.atan2(deltaY, deltaX) * 180 / Math.PI);

    // If vertical scrolling, don't interfere
    if (angle > 90 - TOUCH_ANGLE_THRESHOLD && angle < 90 + TOUCH_ANGLE_THRESHOLD) {
      isSwiping.value = false;
      return;
    }
  }

  function handleTouchEnd(event: TouchEvent) {
    if (!isSwiping.value) return;
    isSwiping.value = false;

    const touch = event.changedTouches[0];
    const deltaX = touchStartX.value - touch.clientX;
    const deltaY = touchStartY.value - touch.clientY;
    const deltaTime = performance.now() - touchStartTime.value;

    // Check if it's a horizontal swipe
    const angle = Math.abs(Math.atan2(deltaY, deltaX) * 180 / Math.PI);
    if (angle > TOUCH_ANGLE_THRESHOLD && angle < 180 - TOUCH_ANGLE_THRESHOLD) {
      return; // Not a horizontal swipe
    }

    // Fast swipe or long distance swipe
    const isFastSwipe = deltaTime < SWIPE_TIME_THRESHOLD && Math.abs(deltaX) > 30;
    const isLongSwipe = Math.abs(deltaX) > SWIPE_THRESHOLD;

    if (isFastSwipe || isLongSwipe) {
      event.preventDefault();
      if (deltaX > 0 && canScrollRight.value) {
        scroll('right');
      } else if (deltaX < 0 && canScrollLeft.value) {
        scroll('left');
      }
    }
  }

  // Keyboard navigation
  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      if (canScrollLeft.value) {
        scroll('left');
      }
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      if (canScrollRight.value) {
        scroll('right');
      }
    } else if (event.key === 'Home') {
      event.preventDefault();
      scrollToIndex(0);
    } else if (event.key === 'End') {
      event.preventDefault();
      scrollToIndex(items.length - 1);
    }
  }

  // Resize observer for responsive updates
  let resizeObserver: ResizeObserver | null = null;

  onMounted(() => {
    nextTick(() => {
      updateScrollState();
    });

    // Set up resize observer
    const container = scrollRef.value;
    if (container && typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => {
        updateScrollState();
      });
      resizeObserver.observe(container);
    }
  });

  onUnmounted(() => {
    resizeObserver?.disconnect();
    resizeObserver = null;
  });

  // Watch for items changes
  watch(() => items, () => {
    nextTick(() => {
      updateScrollState();
    });
  }, { deep: true });

  return {
    // Refs
    scrollRef,
    containerRef,
    canScrollLeft,
    canScrollRight,
    currentIndex,
    isAnimating,

    // Touch state refs
    touchStartX,
    touchStartY,
    isSwiping,

    // Computed
    hasItems,
    isInteractive,

    // Actions
    updateScrollState,
    scroll,
    scrollToIndex,
    handleScroll,
    handleItemClick,
    handleItemAction,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleKeyDown,
  };
}
