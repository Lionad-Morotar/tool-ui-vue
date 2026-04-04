import ApprovalCard from './index.vue'
export { ApprovalCard }
export default ApprovalCard

export type {
  ApprovalCardProps,
  ApprovalCardBaseProps,
  SerializableApprovalCard,
  ApprovalDecision,
  MetadataItem,
} from './schema'

export {
  SerializableApprovalCardSchema,
  ApprovalDecisionSchema,
  MetadataItemSchema,
  parseSerializableApprovalCard,
  safeParseSerializableApprovalCard,
} from './schema'
