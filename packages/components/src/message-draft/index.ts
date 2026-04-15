import MessageDraft from './cmpts/message-draft.vue'
export { MessageDraft }
export default MessageDraft

export type { MessageDraftProps, MessageDraftCss, SerializableMessageDraft, SerializableEmailDraft, SerializableSlackDraft, MessageDraftChannel, MessageDraftOutcome, SlackTarget } from './schema';
export { SerializableMessageDraftSchema, SerializableEmailDraftSchema, SerializableSlackDraftSchema, MessageDraftChannelSchema, MessageDraftOutcomeSchema, parseSerializableMessageDraft, safeParseSerializableMessageDraft } from './schema';
