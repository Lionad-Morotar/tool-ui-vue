<script setup lang="ts">
import { cn } from '@lionad/vtu-core';
import { useI18n } from '@lionad/vtu-core/i18n';
import { computed, ref, watchEffect } from 'vue';
import ItemCard from './cmpts/item-card.vue';
import { useItemCarousel } from './states';
import type { ItemCarouselProps } from './schema';

const props = defineProps<ItemCarouselProps & { interactive?: boolean }>();

const emit = defineEmits<{
  itemClick: [itemId: string];
  itemAction: [itemId: string, actionId: string];
  slideChange: [index: number];
}>();

// DOM refs - bound directly in template
const scrollContainerRef = ref<HTMLDivElement | null>(null);
const outerContainerRef = ref<HTMLDivElement | null>(null);

// All business logic delegated to states layer
const carouselState = useItemCarousel(props, {
  itemClick: (itemId) => emit('itemClick', itemId),
  itemAction: (itemId, actionId) => emit('itemAction', itemId, actionId),
  slideChange: (index) => emit('slideChange', index),
});

// Sync DOM refs to composable refs when they change
watchEffect(() => {
  if (scrollContainerRef.value) {
    carouselState.scrollRef.value = scrollContainerRef.value;
  }
  if (outerContainerRef.value) {
    carouselState.containerRef.value = outerContainerRef.value;
  }
});

// Wrapper that ensures refs are synced before calling scroll
function handleScroll(direction: 'left' | 'right') {
  if (scrollContainerRef.value) {
    carouselState.scrollRef.value = scrollContainerRef.value;
  }
  if (outerContainerRef.value) {
    carouselState.containerRef.value = outerContainerRef.value;
  }
  carouselState.scroll(direction);
}

// i18n
const { t } = useI18n();

// Derived i18n values for attribute bindings (type-safe unwrapping)
const ariaLabel = computed(() => props.title || t('itemCarousel.itemCarouselLabel').value);
const scrollLeftLabel = computed(() => t('itemCarousel.scrollLeft').value);
const scrollRightLabel = computed(() => t('itemCarousel.scrollRight').value);
const getItemAriaLabel = (index: number) => t('itemCarousel.itemOf', { current: index + 1, total: props.items.length }).value;

// Expose methods for programmatic control
defineExpose({
  scrollToIndex: carouselState.scrollToIndex,
  scroll: carouselState.scroll,
  currentIndex: computed(() => carouselState.currentIndex.value),
});
</script>

<template>
  <!-- Empty State -->
  <div
    v-if="!carouselState.hasItems.value"
    :class="cn(
      'flex h-48 items-center justify-center rounded-2xl border border-border bg-card',
      $attrs.class as string
    )"
    data-slot="item-carousel"
    :data-tool-ui-id="id"
  >
    <p class="text-sm text-muted-foreground">{{ t('itemCarousel.noItems') }}</p>
  </div>

  <!-- Carousel -->
  <div
    v-else
    ref="outerContainerRef"
    :class="cn(
      '@container relative isolate w-full gap-0 overflow-hidden rounded-2xl border border-border bg-background p-0',
      $attrs.class as string
    )"
    :data-tool-ui-id="id"
    data-slot="item-carousel"
    tabindex="0"
    role="region"
    aria-roledescription="carousel"
    :aria-label="ariaLabel"
    @keydown="carouselState.handleKeyDown"
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
          'absolute inset-y-0 z-20 my-auto flex h-[6cqh] min-h-[50px] w-6 rounded-2xl bg-background/60 backdrop-blur-lg hover:bg-background/50',
          'transition-[opacity,transform] duration-250 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none',
          'items-center justify-center',
          'left-1.5',
          carouselState.canScrollLeft && 'pointer-events-auto scale-100 opacity-100'
        )"
        :tabindex="carouselState.canScrollLeft ? 0 : -1"
        :aria-hidden="!carouselState.canScrollLeft"
        :aria-label="scrollLeftLabel"
        :disabled="!carouselState.canScrollLeft"
        @click="handleScroll('left')"
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
          'absolute inset-y-0 z-20 my-auto flex h-[6cqh] min-h-[50px] w-6 rounded-2xl bg-background/60 backdrop-blur-lg hover:bg-background/50',
          'transition-[opacity,transform] duration-250 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none',
          'items-center justify-center',
          'right-1.5',
          carouselState.canScrollRight && 'pointer-events-auto scale-100 opacity-100'
        )"
        :tabindex="carouselState.canScrollRight ? 0 : -1"
        :aria-hidden="!carouselState.canScrollRight"
        :aria-label="scrollRightLabel"
        :disabled="!carouselState.canScrollRight"
        @click="handleScroll('right')"
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
        ref="scrollContainerRef"
        :class="cn(
          'grid auto-cols-max grid-flow-col gap-4 overflow-x-auto overscroll-x-contain p-4',
          'snap-x snap-mandatory',
          '[scrollbar-width:none] [&::-webkit-scrollbar]:hidden'
        )"
        role="list"
        style="scroll-padding-inline: 1rem;"
        data-scroll-ref="true"
        @scroll="carouselState.handleScroll"
        @touchstart.passive="carouselState.handleTouchStart"
        @touchmove="carouselState.handleTouchMove"
        @touchend="carouselState.handleTouchEnd"
      >
        <div
          v-for="(item, index) in items"
          :key="item.id"
          data-carousel-item
          :data-item-id="item.id"
          :data-index="index"
          role="listitem"
          class="flex snap-start snap-always"
          :style="{ viewTransitionName: `item-card-${item.id}` }"
          :aria-label="getItemAriaLabel(index)"
        >
          <item-card
            :item="item"
            :interactive="carouselState.isInteractive.value"
            @item-click="carouselState.handleItemClick"
            @item-action="carouselState.handleItemAction"
          />
        </div>
      </div>
    </div>
  </div>
</template>
