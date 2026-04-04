<script setup lang="ts">
import { cn } from '@lionad/core';
import { computed } from 'vue';
import ItemCard from './cmpts/item-card.vue';
import { useItemCarousel } from './states';
import type { ItemCarouselProps } from './schema';

const props = defineProps<ItemCarouselProps & { interactive?: boolean }>();

const emit = defineEmits<{
  itemClick: [itemId: string];
  itemAction: [itemId: string, actionId: string];
  slideChange: [index: number];
}>();

// All business logic delegated to states layer
const carouselState = useItemCarousel(props, {
  itemClick: (itemId) => emit('itemClick', itemId),
  itemAction: (itemId, actionId) => emit('itemAction', itemId, actionId),
  slideChange: (index) => emit('slideChange', index),
});

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
    <p class="text-sm text-muted-foreground">No items to display</p>
  </div>

  <!-- Carousel -->
  <div
    v-else
    ref="carouselState.containerRef"
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
          'absolute inset-y-0 z-20 my-auto hidden h-[6cqh] min-h-[50px] rounded-2xl bg-background/60 backdrop-blur-lg',
          'transition-[opacity,transform] duration-250 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none',
          '@md:flex',
          'left-1.5',
          carouselState.canScrollLeft && 'pointer-events-auto scale-100 opacity-100 @md:group-focus-within:pointer-events-auto @md:group-focus-within:scale-100 @md:group-focus-within:opacity-100 @md:group-hover:pointer-events-auto @md:group-hover:scale-100 @md:group-hover:opacity-100'
        )"
        :tabindex="carouselState.canScrollLeft ? 0 : -1"
        :aria-hidden="!carouselState.canScrollLeft"
        :aria-label="'Scroll left'"
        :disabled="!carouselState.canScrollLeft"
        @click="carouselState.scroll('left')"
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
          carouselState.canScrollRight && 'pointer-events-auto scale-100 opacity-100 @md:group-focus-within:pointer-events-auto @md:group-focus-within:scale-100 @md:group-focus-within:opacity-100 @md:group-hover:pointer-events-auto @md:group-hover:scale-100 @md:group-hover:opacity-100'
        )"
        :tabindex="carouselState.canScrollRight ? 0 : -1"
        :aria-hidden="!carouselState.canScrollRight"
        :aria-label="'Scroll right'"
        :disabled="!carouselState.canScrollRight"
        @click="carouselState.scroll('right')"
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
        ref="carouselState.scrollRef"
        :class="cn(
          'grid auto-cols-max grid-flow-col gap-4 overflow-x-auto overscroll-x-contain p-4',
          'snap-x snap-mandatory'
        )"
        role="list"
        style="scroll-padding-inline: 1rem;"
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
          :aria-label="`Item ${index + 1} of ${items.length}`"
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
        :aria-selected="carouselState.currentIndex.value === index"
        :class="cn(
          'h-1.5 rounded-full transition-all duration-200',
          carouselState.currentIndex.value === index
            ? 'w-4 bg-primary'
            : 'w-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/50'
        )"
        @click="carouselState.scrollToIndex(index)"
      />
    </div>
  </div>
</template>
