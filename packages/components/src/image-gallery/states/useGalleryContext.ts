import { ref, computed, toValue, provide, inject, type InjectionKey, type Ref, type ComputedRef, type MaybeRefOrGetter } from 'vue';
import type { ImageGalleryItem } from '../schema';

export interface ImageGalleryContextValue {
  images: ComputedRef<ImageGalleryItem[]>;
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
  'ImageGalleryContext'
);

export function useImageGallery(): ImageGalleryContextValue {
  const context = inject(ImageGalleryKey);
  if (!context) {
    throw new Error(
      'useImageGallery must be used within ImageGalleryProvider'
    );
  }
  return context;
}

export interface ImageGalleryProviderOptions {
  images: MaybeRefOrGetter<ImageGalleryItem[]>;
}

export function createImageGalleryContext(
  options: ImageGalleryProviderOptions
): ImageGalleryContextValue {
  // images 以 MaybeRefOrGetter 接收：setup 同步作用域里 ref(值) 会把数组固化在
  // 挂载首帧；computed + toValue 让读取发生在消费方的活跃 effect 内，跟随 props
  const images = computed(() => toValue(options.images));
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
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    isOpen.value = false;
    activeIndex.value = null;
    document.body.style.overflow = '';
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
