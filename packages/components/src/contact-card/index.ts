import ContactCard from './index.vue'
export { ContactCard }
export default ContactCard

export type {
  ContactCardProps,
  SerializableContactCard,
  ContactKind,
  ContactCardCss,
} from './schema'

export {
  ContactKindSchema,
  SerializableContactCardSchema,
  ContactCardCssSchema,
  parseSerializableContactCard,
  safeParseSerializableContactCard,
} from './schema'

export { useContactCard } from './states'
export type { ContactCardState } from './states'
