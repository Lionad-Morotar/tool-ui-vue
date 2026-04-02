export { default as MessageDraft } from './cmpts/message-draft.vue';
export type { MessageDraftProps, SerializableMessageDraft, SerializableEmailDraft, SerializableSlackDraft, MessageDraftChannel, MessageDraftOutcome, SlackTarget } from './schema';
export { SerializableMessageDraftSchema, SerializableEmailDraftSchema, SerializableSlackDraftSchema, MessageDraftChannelSchema, MessageDraftOutcomeSchema, parseSerializableMessageDraft, safeParseSerializableMessageDraft } from './schema';
