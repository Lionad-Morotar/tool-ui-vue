import { computed } from 'vue';
import { provideImageGallery } from './useGalleryContext';
import type { ImageGalleryProps, ImageGalleryItem } from '../schema';
import type { ComputedRef } from 'vue';

export type EmitFn = (e: 'imageClick', imageId: string, image: ImageGalleryItem) => void;

export interface GalleryReturns {
  hasHeader: ComputedRef<boolean>;
  handleImageClick: (imageId: string) => void;
}

export function useGallery(props: ImageGalleryProps, emit: EmitFn): GalleryReturns {
  provideImageGallery({ images: computed(() => props.images) });

  const hasHeader = computed(() => Boolean(props.title || props.description));

  function handleImageClick(imageId: string) {
    const image = props.images.find((img) => img.id === imageId);
    if (image) {
      emit('imageClick', imageId, image);
    }
  }

  return {
    hasHeader,
    handleImageClick,
  };
}
