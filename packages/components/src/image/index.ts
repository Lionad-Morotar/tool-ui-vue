import Image from './index.vue'
export { Image }
export default Image

export type {
  ImageProps,
  SerializableImage,
  Source,
  AspectRatio,
  MediaFit,
} from './schema'

export {
  SerializableImageSchema,
  SourceSchema,
  AspectRatioSchema,
  MediaFitSchema,
  parseSerializableImage,
  safeParseSerializableImage,
} from './schema'
