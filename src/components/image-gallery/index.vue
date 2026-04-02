<script setup lang="ts">
import { computed } from 'vue';
import { cn } from './_adapter';
import { provideImageGallery } from './context';
import GalleryGrid from './GalleryGrid.vue';
import GalleryLightbox from './GalleryLightbox.vue';
import type { ImageGalleryProps, ImageGalleryItem } from './schema';

defineOptions({ name: 'cmpt-image-gallery', inheritAttrs: false })

const props = withDefaults(defineProps<ImageGalleryProps & { css?: { root?: string } }>(), {
  css: () => ({ root: '' })
})

const emit = defineEmits<{
  imageClick: [imageId: string, image: ImageGalleryItem];
}>();

// Provide the gallery context
provideImageGallery({
  images: props.images,
});

const hasHeader = computed(() => props.title || props.description);

function handleImageClick(imageId: string) {
  const image = props.images.find((img) => img.id === imageId);
  if (image) {
    emit('imageClick', imageId, image);
  }
}
</script>

<template>
  <article
    v-bind="$attrs"
    :class="cn('relative w-full max-w-lg min-w-80', css?.root)"
    data-slot="image-gallery"
    :data-tool-ui-id="id"
    lang="en"
    :aria-busy="false"
  >
    <div
      :class="
        cn(
          '@container relative isolate flex w-full min-w-0 flex-col rounded-xl',
          'border border-border bg-card text-sm shadow-xs'
        )
      "
    >
      <!-- Header -->
      <div
        v-if="hasHeader"
        class="border-b border-border/60 px-4 pt-4 pb-3"
      >
        <h3
          v-if="title"
          class="text-[15px] leading-tight font-semibold tracking-tight"
        >
          {{ title }}
        </h3>
        <p
          v-if="description"
          class="mt-1 text-sm leading-snug text-muted-foreground"
        >
          {{ description }}
        </p>
      </div>

      <!-- Grid -->
      <div class="p-3">
        <gallery-grid :on-image-click="handleImageClick" />
      </div>
    </div>

    <!-- Lightbox -->
    <gallery-lightbox />
  </article>
</template>
