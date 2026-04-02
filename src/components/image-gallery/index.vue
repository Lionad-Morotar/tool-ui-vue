<script setup lang="ts">
import { reactive } from 'vue';
import GalleryGrid from './cmpts/gallery-grid.vue';
import GalleryLightbox from './cmpts/gallery-lightbox.vue';
import { useGallery } from './states';
import { cn } from '../../utils';
import type { ImageGalleryProps, ImageGalleryItem } from './schema';

defineOptions({ name: 'CmptImageGallery', inheritAttrs: false })

const props = withDefaults(defineProps<ImageGalleryProps & { css?: { root?: string } }>(), {
  css: () => ({ root: '' })
})

const emit = defineEmits<{
  imageClick: [imageId: string, image: ImageGalleryItem];
}>()

// All business logic delegated to states layer
const galleryState = reactive(useGallery({
  ...props,
  emit,
}));
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
        v-if="galleryState.hasHeader"
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
        <gallery-grid :on-image-click="galleryState.handleImageClick" />
      </div>
    </div>

    <!-- Lightbox -->
    <gallery-lightbox />
  </article>
</template>
