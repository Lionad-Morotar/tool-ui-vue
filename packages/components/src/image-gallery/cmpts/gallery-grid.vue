<script setup lang="ts">
import { cn } from '../../core';
import { useImageGallery } from '../states';
import GalleryImageCard from './gallery-image-card.vue';
import type { ImageGalleryItem, GalleryGridCss } from '../schema';

const props = withDefaults(defineProps<{
  onImageClick?: (imageId: string) => void;
  css?: GalleryGridCss;
  cardCss?: import('../schema').GalleryImageCardCss;
}>(), {
  css: () => ({}),
  cardCss: () => ({}),
});

const { images, openLightbox } = useImageGallery();

function handleOpen(index: number) {
  const image = images.value[index];
  if (image && props.onImageClick) {
    props.onImageClick(image.id);
  }
  openLightbox(index);
}

function isPortraitImage(image: ImageGalleryItem): boolean {
  const aspectRatio = image.width / image.height;
  const isPortrait = aspectRatio < 1;
  const isSquarish = aspectRatio >= 0.9 && aspectRatio <= 1.1;
  return isPortrait && !isSquarish;
}
</script>

<template>
  <div
    :class="cn('grid grid-cols-2 gap-2 @md:grid-cols-3 @lg:grid-cols-4', css?.root)"
    role="list"
  >
    <div
      v-for="(image, index) in images"
      :key="image.id"
      role="listitem"
      :class="cn(
        'group/item relative cursor-pointer',
        isPortraitImage(image) && 'row-span-2',
        css?.item
      )"
      :style="{ aspectRatio: isPortraitImage(image) ? undefined : '1 / 1' }"
    >
      <button
        type="button"
        class="absolute inset-0 z-20 size-full rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        :aria-label="image.alt"
        @click="handleOpen(index)"
      />
      <gallery-image-card
        :image="image"
        :is-portrait="isPortraitImage(image)"
        :css="cardCss"
      />
    </div>
  </div>
</template>
