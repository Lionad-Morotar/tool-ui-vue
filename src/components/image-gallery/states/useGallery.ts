import { computed, type ComputedRef } from 'vue';
import type { ImageGalleryProps, ImageGalleryItem } from '../schema';
import { provideImageGallery } from './useGalleryContext';

export interface UseGalleryOptions extends ImageGalleryProps {
  emit: (e: 'imageClick', imageId: string, image: ImageGalleryItem) => void;
}

export interface GalleryReturns {
  hasHeader: ComputedRef<boolean>;
  handleImageClick: (imageId: string) => void;
}

export function useGallery(options: UseGalleryOptions): GalleryReturns {
  const { images, title, description, emit } = options;

  provideImageGallery({ images });

  const hasHeader = computed(() => Boolean(title || description));

  function handleImageClick(imageId: string) {
    const image = images.find((img) => img.id === imageId);
    if (image) {
      emit('imageClick', imageId, image);
    }
  }

  return {
    hasHeader,
    handleImageClick,
  };
}
