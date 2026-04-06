// ImageGallery component state layer - Headless architecture
// All business logic lives here, index.vue is UI-only

export {
  useImageGallery,
  createImageGalleryContext,
  provideImageGallery,
  ImageGalleryKey,
  type ImageGalleryContextValue,
  type ImageGalleryProviderOptions,
} from './useGalleryContext';

export {
  useGallery,
  
  type GalleryReturns,
} from './useGallery';
