export { default as LinkPreview } from "./index.vue";
export type {
  LinkPreviewProps,
  SerializableLinkPreview,
  AspectRatio,
  MediaFit,
} from "./schema";
export {
  SerializableLinkPreviewSchema,
  AspectRatioSchema,
  MediaFitSchema,
  parseSerializableLinkPreview,
  safeParseSerializableLinkPreview,
} from "./schema";
