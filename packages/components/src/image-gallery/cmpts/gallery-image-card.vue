<script setup lang="ts">
import { ImageOff } from 'lucide-vue-next';
import { ref, watch, onUnmounted } from 'vue';
import { cn } from '../../core';
import { useImageGallery } from '../states';
import type { ImageGalleryItem, GalleryImageCardCss } from '../schema';

interface Props {
  image: ImageGalleryItem;
  isPortrait?: boolean;
  css?: GalleryImageCardCss;
}

const props = withDefaults(defineProps<Props>(), {
  css: () => ({}),
});

const hasError = ref(false);
const wrapperRef = ref<HTMLDivElement | null>(null);

const { registerImage } = useImageGallery();

// Register the image element when mounted/updated
watch(
  () => wrapperRef.value,
  (wrapper) => {
    const img = wrapper?.querySelector('img');
    if (img) {
      registerImage(props.image.id, img as HTMLElement);
    }
  },
  { immediate: true }
);

onUnmounted(() => {
  registerImage(props.image.id, null);
});
</script>

<template>
  <div
    ref="wrapperRef"
    :class="cn(
      'relative size-full overflow-hidden rounded-lg bg-muted',
      'transition-transform duration-200 ease-[cubic-bezier(0.4,0,0.2,1)]',
      'group-hover/item:scale-[1.02] group-active/item:scale-[0.98]',
      css?.root
    )"
  >
    <div
      v-if="hasError"
      :class="cn(
        'absolute inset-0 flex flex-col items-center justify-center gap-2 p-4',
        css?.error
      )"
    >
      <image-off class="size-8 shrink-0 text-muted-foreground" />
      <span class="line-clamp-2 text-center text-xs text-muted-foreground">
        {{ image.alt }}
      </span>
    </div>
    <img
      v-else
      :src="image.src"
      :alt="image.alt"
      :width="image.width"
      :height="image.height"
      loading="lazy"
      decoding="async"
      draggable="false"
      :class="cn('size-full object-cover', css?.image)"
      @error="hasError = true"
    />
  </div>
</template>
