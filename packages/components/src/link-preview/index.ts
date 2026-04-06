import LinkPreview from './index.vue'
export { LinkPreview }
export default LinkPreview

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
