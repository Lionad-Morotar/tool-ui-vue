import linkpreview from './index.vue'
export { linkpreview }
export default linkpreview

export type {
  LinkPreviewProps,
  SerializableLinkPreview,
  AspectRatio,
  MediaFit,
} from './schema';
export {
  SerializableLinkPreviewSchema,
  AspectRatioSchema,
  MediaFitSchema,
  parseSerializableLinkPreview,
  safeParseSerializableLinkPreview,
} from './schema';
