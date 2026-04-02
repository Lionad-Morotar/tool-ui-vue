<script setup lang="ts">
import { ref, computed, onMounted, nextTick, watch } from 'vue';
import ItemCard from './item-card.vue';
import { cn, prefersReducedMotion } from '../../../shared/utils';
import type { ItemCarouselProps } from '../schema';

const props = defineProps<ItemCarouselProps & { interactive?: boolean }>();

const emit = defineEmits<{
  itemClick: [itemId: string];
  itemAction: [itemId: string, actionId: string];
  slideChange: [index: number];
}>();

const scrollRef = ref<HTMLDivElement | null>(null);
const containerRef = ref<HTMLDivElement | null>(null);
const canScrollLeft = ref(false);
const canScrollRight = ref(false);
const targetIndexRef = ref<number | null>(null);
const isAnimating = ref(false);
const currentIndex = ref(0);

const SNAP_EPSILON_PX = 5;
const SCROLL_ANIMATION_DURATION_MS = 300;
const PAGE_SCROLL_RATIO = 0.8;
const PAGE_SCROLL_BREAKPOINT_PX = 640;
const SCROLL_EDGE_THRESHOLD_PX = 8;

const hasItems = computed(() => props.items.length > 0);
const isInteractive = computed(() => props.interactive || false);

// Touch swipe state
const touchStartX = ref(0);
const touchStartY = ref(0);
const touchStartTime = ref(0);
const isSwiping = ref(false);
const SWIPE_THRESHOLD = 50;
const SWIPE_TIME_THRESHOLD = 300;
const TOUCH_ANGLE_THRESHOLD = 45; // degrees

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
    emit('slideChange', newIndex);
  }
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
  emit('itemClick', itemId);
}

function handleItemAction(itemId: string, actionId: string) {
  emit('itemAction', itemId, actionId);
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

  // Prevent default only for horizontal swipes
  if (angle < TOUCH_ANGLE_THRESHOLD || angle > 180 - TOUCH_ANGLE_THRESHOLD) {
    // Allow native scroll to handle horizontal movement
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
    scrollToIndex(props.items.length - 1);
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

// Watch for items changes
watch(() => props.items, () => {
  nextTick(() => {
    updateScrollState();
  });
}, { deep: true });

// Expose methods for programmatic control
defineExpose({
  scrollToIndex,
  scroll,
  currentIndex: computed(() => currentIndex.value),
});
</script>

<template>
  <!-- Empty State -->
  <div
    v-if="!hasItems"
    :class="cn(
      'flex h-48 items-center justify-center rounded-2xl border border-border bg-card',
      $attrs.class as string
    )"
    data-slot="item-carousel"
    :data-tool-ui-id="id"
  >
    <p class="text-sm text-muted-foreground">No items to display</p>
  </div>

  <!-- Carousel -->
  <div
    v-else
    ref="containerRef"
    :class="cn(
      '@container relative isolate w-full gap-0 overflow-hidden rounded-2xl border border-border bg-background p-0',
      $attrs.class as string
    )"
    :data-tool-ui-id="id"
    data-slot="item-carousel"
    tabindex="0"
    role="region"
    aria-roledescription="carousel"
    :aria-label="title || 'Item carousel'"
    @keydown="handleKeyDown"
  >
    <!-- Header -->
    <div v-if="title || description" class="px-4 pt-4 pb-1">
      <h3 v-if="title" class="text-[15px] leading-tight font-semibold tracking-tight">
        {{ title }}
      </h3>
      <p v-if="description" class="mt-1 text-sm leading-snug text-muted-foreground">
        {{ description }}
      </p>
    </div>

    <div class="group relative">
      <!-- Navigation Buttons -->
      <button
        type="button"
        :class="cn(
          'pointer-events-none scale-90 border-none opacity-0',
          'absolute inset-y-0 z-20 my-auto hidden h-[6cqh] min-h-[50px] rounded-2xl bg-background/60 backdrop-blur-lg',
          'transition-[opacity,transform] duration-250 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none',
          '@md:flex',
          'left-1.5',
          canScrollLeft && 'pointer-events-auto scale-100 opacity-100 @md:group-focus-within:pointer-events-auto @md:group-focus-within:scale-100 @md:group-focus-within:opacity-100 @md:group-hover:pointer-events-auto @md:group-hover:scale-100 @md:group-hover:opacity-100'
        )"
        :tabindex="canScrollLeft ? 0 : -1"
        :aria-hidden="!canScrollLeft"
        :aria-label="'Scroll left'"
        :disabled="!canScrollLeft"
        @click="scroll('left')"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="h-4 w-4"
        >
          <path d="m15 18-6-6 6-6" />
        </svg>
      </button>

      <button
        type="button"
        :class="cn(
          'pointer-events-none scale-90 border-none opacity-0',
          'absolute inset-y-0 z-20 my-auto hidden h-[6cqh] min-h-[50px] rounded-2xl bg-background/60 backdrop-blur-lg',
          'transition-[opacity,transform] duration-250 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none',
          '@md:flex',
          'right-1.5',
          canScrollRight && 'pointer-events-auto scale-100 opacity-100 @md:group-focus-within:pointer-events-auto @md:group-focus-within:scale-100 @md:group-focus-within:opacity-100 @md:group-hover:pointer-events-auto @md:group-hover:scale-100 @md:group-hover:opacity-100'
        )"
        :tabindex="canScrollRight ? 0 : -1"
        :aria-hidden="!canScrollRight"
        :aria-label="'Scroll right'"
        :disabled="!canScrollRight"
        @click="scroll('right')"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="h-4 w-4"
        >
          <path d="m9 18 6-6-6-6" />
        </svg>
      </button>

      <!-- Scroll Container -->
      <div
        ref="scrollRef"
        :class="cn(
          'grid auto-cols-max grid-flow-col gap-4 overflow-x-auto overscroll-x-contain p-4',
          'snap-x snap-mandatory'
        )"
        role="list"
        style="scroll-padding-inline: 1rem;"
        @scroll="handleScroll"
        @touchstart.passive="handleTouchStart"
        @touchmove="handleTouchMove"
        @touchend="handleTouchEnd"
      >
        <div
          v-for="(item, index) in items"
          :key="item.id"
          data-carousel-item
          :data-item-id="item.id"
          :data-index="index"
          role="listitem"
          class="flex snap-start snap-always"
          :aria-label="`Item ${index + 1} of ${items.length}`"
        >
          <item-card
            :item="item"
            :interactive="isInteractive"
            @item-click="handleItemClick"
            @item-action="handleItemAction"
          />
        </div>
      </div>
    </div>

    <!-- Pagination Dots (optional visual indicator) -->
    <div
      v-if="items.length > 1"
      class="flex justify-center gap-1.5 pb-3"
      role="tablist"
      aria-label="Carousel pagination"
    >
      <button
        v-for="(item, index) in items"
        :key="item.id"
        type="button"
        role="tab"
        :aria-label="`Go to slide ${index + 1}`"
        :aria-selected="currentIndex === index"
        :class="cn(
          'h-1.5 rounded-full transition-all duration-200',
          currentIndex === index
            ? 'w-4 bg-primary'
            : 'w-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/50'
        )"
        @click="scrollToIndex(index)"
      />
    </div>
  </div>
</template>
