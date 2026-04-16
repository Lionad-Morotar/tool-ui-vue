import Citation from './index.vue'
export { Citation }
export default Citation

export { default as CitationList } from './cmpts/citation-list.vue'

export type {
  CitationProps,
  CitationListProps,
  SerializableCitation,
  SerializableCitationList,
  CitationType,
  CitationVariant,
} from './schema'

export {
  SerializableCitationSchema,
  SerializableCitationListSchema,
  CitationTypeSchema,
  CitationVariantSchema,
  parseSerializableCitation,
  safeParseSerializableCitation,
  parseSerializableCitationList,
  safeParseSerializableCitationList,
} from './schema'
