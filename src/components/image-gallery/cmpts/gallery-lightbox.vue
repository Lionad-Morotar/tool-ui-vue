<script setup lang="ts">
import {
  useMagicKeys,
  useSwipe,
  usePreferredReducedMotion,
} from '@vueuse/core';
import { X } from 'lucide-vue-next';
import { ref, watch, computed } from 'vue';
import { cn } from '../_adapter';
import { useImageGallery } from '../context';

const dialogRef = ref<HTMLDialogElement | null>(null);
const contentRef = ref<HTMLDivElement | null>(null);

const {
  isOpen,
  activeIndex,
  currentImage,
  closeLightbox,
  nextImage,
  prevImage,
  images,
} = useImageGallery();

// Reduced motion preference
const prefersReducedMotion = usePreferredReducedMotion();

// Magic keys for keyboard navigation
const { Escape, ArrowRight, ArrowLeft } = useMagicKeys();

watch(Escape, (pressed) => {
  if (pressed && isOpen.value) {
    closeLightbox();
  }
});

watch(ArrowRight, (pressed) => {
  if (pressed && isOpen.value) {
    nextImage();
  }
});

watch(ArrowLeft, (pressed) => {
  if (pressed && isOpen.value) {
    prevImage();
  }
});

// Swipe gestures for touch navigation
const { direction } = useSwipe(contentRef, {
  threshold: 50,
  onSwipeEnd: () => {
    if (!isOpen.value) return;
    if (direction.value === 'left') {
      nextImage();
    } else if (direction.value === 'right') {
      prevImage();
    }
  },
});

// Handle dialog show/close
watch(isOpen, (open) => {
  if (open) {
    dialogRef.value?.showModal();
  } else {
    dialogRef.value?.close();
  }
});

function handleBackdropClick(e: MouseEvent) {
  if (e.target === dialogRef.value) {
    closeLightbox();
  }
}

function handleCancel(e: Event) {
  e.preventDefault();
  closeLightbox();
}

// Computed for navigation visibility
const hasMultipleImages = computed(() => images.value.length > 1);
const currentIndexDisplay = computed(() =>
  activeIndex.value !== null ? activeIndex.value + 1 : 0
);
</script>

<template>
  <Teleport to="body">
    <dialog
      ref="dialogRef"
      :class="cn(
        'm-0 h-full max-h-full w-full max-w-full',
        'overflow-hidden p-0',
        'bg-transparent backdrop:bg-black/95 dark:backdrop:bg-black/90',
        'focus-visible:outline-none'
      )"
      aria-label="Image lightbox"
      @click="handleBackdropClick"
      @cancel="handleCancel"
    >
      <div class="relative h-full w-full">
        <!-- Close Button -->
        <div class="absolute top-4 right-4 z-20">
          <button
            type="button"
            :class="cn(
              'inline-flex items-center justify-center rounded-md',
              'h-10 w-10',
              'text-white/80 hover:bg-white/10 hover:text-white',
              'transition-colors duration-200'
            )"
            aria-label="Close"
            @click="closeLightbox"
          >
            <x class="h-5 w-5" />
          </button>
        </div>

        <!-- Navigation Arrows -->
        <template v-if="hasMultipleImages">
          <button
            type="button"
            :class="cn(
              'absolute top-1/2 left-4 z-20 -translate-y-1/2',
              'inline-flex items-center justify-center rounded-md',
              'h-12 w-12',
              'text-white/80 hover:bg-white/10 hover:text-white',
              'transition-colors duration-200',
              'focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:outline-none'
            )"
            aria-label="Previous image"
            @click="prevImage"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
          <button
            type="button"
            :class="cn(
              'absolute top-1/2 right-4 z-20 -translate-y-1/2',
              'inline-flex items-center justify-center rounded-md',
              'h-12 w-12',
              'text-white/80 hover:bg-white/10 hover:text-white',
              'transition-colors duration-200',
              'focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:outline-none'
            )"
            aria-label="Next image"
            @click="nextImage"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        </template>

        <!-- Content -->
        <div
          ref="contentRef"
          class="relative z-10 flex h-full w-full flex-col items-center justify-center gap-4 p-8"
        >
          <div
            v-if="currentImage"
            :class="cn(
              'pointer-events-auto relative w-fit max-w-full overflow-hidden rounded-lg shadow-2xl',
              '[&>img]:block [&>img]:max-h-[80vh] [&>img]:max-w-full',
              '[&>img]:h-auto [&>img]:w-auto [&>img]:object-contain [&>img]:select-none'
            )"
          >
            <img
              :key="currentImage.id"
              :src="currentImage.src"
              :alt="currentImage.alt"
              :class="cn(
                prefersReducedMotion && 'transition-none'
              )"
            />
          </div>

          <!-- Metadata -->
          <div
            v-if="
              currentImage?.title ||
                currentImage?.caption ||
                currentImage?.source?.label
            "
            class="text-center"
          >
            <h3
              v-if="currentImage.title"
              class="text-base font-medium tracking-tight text-white"
            >
              {{ currentImage.title }}
            </h3>
            <p
              v-if="currentImage.caption || currentImage.source?.label"
              class="mt-1 text-sm text-white/60"
            >
              {{ currentImage.caption }}
              <template v-if="currentImage.caption && currentImage.source?.label">
                ·
              </template>
              <a
                v-if="currentImage.source?.url"
                :href="currentImage.source.url"
                target="_blank"
                rel="noopener noreferrer"
                class="hover:text-white/80 hover:underline"
                @click.stop
              >
                {{ currentImage.source.label }}
              </a>
              <span v-else-if="currentImage.source?.label">
                {{ currentImage.source.label }}
              </span>
            </p>
          </div>

          <!-- Image Counter -->
          <div
            v-if="hasMultipleImages"
            class="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm text-white/60"
          >
            {{ currentIndexDisplay }} / {{ images.length }}
          </div>
        </div>
      </div>
    </dialog>
  </Teleport>
</template>
