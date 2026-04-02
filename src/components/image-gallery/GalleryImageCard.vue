<script setup lang="ts">
import { ref, watch, onUnmounted } from "vue";
import { ImageOff } from "lucide-vue-next";
import { cn } from "./_adapter";
import { useImageGallery } from "./context";
import type { ImageGalleryItem } from "./schema";

interface Props {
  image: ImageGalleryItem;
  isPortrait?: boolean;
}

const props = defineProps<Props>();

const hasError = ref(false);
const wrapperRef = ref<HTMLDivElement | null>(null);

const { registerImage } = useImageGallery();

// Register the image element when mounted/updated
watch(
  () => wrapperRef.value,
  (wrapper) => {
    const img = wrapper?.querySelector("img");
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
      'bg-muted relative h-full w-full overflow-hidden rounded-lg',
      'transition-transform duration-200 ease-[cubic-bezier(0.4,0,0.2,1)]',
      'group-hover:scale-[1.02] group-active:scale-[0.98]'
    )"
  >
    <div
      v-if="hasError"
      class="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4"
    >
      <ImageOff class="text-muted-foreground h-8 w-8" />
      <span class="text-muted-foreground line-clamp-2 text-center text-xs">
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
      class="h-full w-full object-cover"
      @error="hasError = true"
    />
  </div>
</template>
