import { ref, computed, provide, inject, type InjectionKey, type Ref } from "vue";
import type { ImageGalleryItem } from "./schema";

export interface ImageGalleryContextValue {
  images: Ref<ImageGalleryItem[]>;
  activeIndex: Ref<number | null>;
  isOpen: Ref<boolean>;
  currentImage: Ref<ImageGalleryItem | null>;
  openLightbox: (index: number) => void;
  closeLightbox: () => void;
  nextImage: () => void;
  prevImage: () => void;
  registerImage: (id: string, element: HTMLElement | null) => void;
  getImageElement: (id: string) => HTMLElement | undefined;
}

export const ImageGalleryKey: InjectionKey<ImageGalleryContextValue> = Symbol(
  "ImageGalleryContext"
);

export function useImageGallery(): ImageGalleryContextValue {
  const context = inject(ImageGalleryKey);
  if (!context) {
    throw new Error(
      "useImageGallery must be used within ImageGalleryProvider"
    );
  }
  return context;
}

export interface ImageGalleryProviderOptions {
  images: ImageGalleryItem[];
}

export function createImageGalleryContext(
  options: ImageGalleryProviderOptions
): ImageGalleryContextValue {
  const images = ref(options.images);
  const activeIndex = ref<number | null>(null);
  const isOpen = ref(false);

  const currentImage = computed(() => {
    if (activeIndex.value === null) return null;
    return images.value[activeIndex.value] ?? null;
  });

  const imageElements = new Map<string, HTMLElement>();

  function openLightbox(index: number) {
    if (index < 0 || index >= images.value.length) return;
    activeIndex.value = index;
    isOpen.value = true;
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    isOpen.value = false;
    activeIndex.value = null;
    document.body.style.overflow = "";
  }

  function nextImage() {
    if (activeIndex.value === null) return;
    activeIndex.value = (activeIndex.value + 1) % images.value.length;
  }

  function prevImage() {
    if (activeIndex.value === null) return;
    activeIndex.value =
      (activeIndex.value - 1 + images.value.length) % images.value.length;
  }

  function registerImage(id: string, element: HTMLElement | null) {
    if (element) {
      imageElements.set(id, element);
    } else {
      imageElements.delete(id);
    }
  }

  function getImageElement(id: string): HTMLElement | undefined {
    return imageElements.get(id);
  }

  return {
    images,
    activeIndex,
    isOpen,
    currentImage,
    openLightbox,
    closeLightbox,
    nextImage,
    prevImage,
    registerImage,
    getImageElement,
  };
}

export function provideImageGallery(
  options: ImageGalleryProviderOptions
): ImageGalleryContextValue {
  const context = createImageGalleryContext(options);
  provide(ImageGalleryKey, context);
  return context;
}
