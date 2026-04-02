export { default as ImageGallery } from './index.vue';
export { default as GalleryGrid } from './cmpts/gallery-grid.vue';
export { default as GalleryLightbox } from './cmpts/gallery-lightbox.vue';
export {
  useImageGallery,
  provideImageGallery,
  createImageGalleryContext,
  ImageGalleryKey,
} from './context';
export type {
  ImageGalleryContextValue,
  ImageGalleryProviderOptions,
} from './context';
export type {
  ImageGalleryProps,
  SerializableImageGallery,
  ImageGalleryItem,
  ImageGallerySource,
} from './schema';
export {
  SerializableImageGallerySchema,
  ImageGalleryItemSchema,
  ImageGallerySourceSchema,
  parseSerializableImageGallery,
  safeParseSerializableImageGallery,
} from './schema';
