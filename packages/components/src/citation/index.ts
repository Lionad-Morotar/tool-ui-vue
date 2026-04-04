import Citation from './index.vue'
export { Citation }
export default Citation

export { default as CitationList } from './cmpts/citation-list.vue'

export type {
  CitationProps,
  CitationListProps,
  SerializableCitation,
  CitationType,
  CitationVariant,
} from './schema'

export {
  SerializableCitationSchema,
  CitationTypeSchema,
  CitationVariantSchema,
  parseSerializableCitation,
  safeParseSerializableCitation,
} from './schema'
