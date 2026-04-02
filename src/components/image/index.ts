export { default as Image } from "./index.vue";
export type {
  ImageProps,
  SerializableImage,
  Source,
  AspectRatio,
  MediaFit,
} from "./schema";
export {
  SerializableImageSchema,
  SourceSchema,
  AspectRatioSchema,
  MediaFitSchema,
  parseSerializableImage,
  safeParseSerializableImage,
} from "./schema";
