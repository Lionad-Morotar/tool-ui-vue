/**
 * MessageDraft 组件的数据契约定义
 *
 * 定义了该组件的：
 * - Zod Schema：用于运行时数据验证
 * - TypeScript 类型：用于类型安全
 * - Props 接口：用于组件属性定义
 *
 * @module tool-ui-vue/vtu-components/message-draft/schema
 */
import { defineToolUiContract, ToolUIIdSchema, ToolUIRoleSchema } from '@lionad/vtu-core';
import { z } from 'zod';

/**
 * 消息草稿渠道的 Schema 定义
 */
export const MessageDraftChannelSchema = z.enum(['email', 'slack']);

/**
 * 消息草稿渠道类型
 * 对应 MessageDraftChannelSchema 的 TypeScript 类型
 */
export type MessageDraftChannel = z.infer<typeof MessageDraftChannelSchema>;

/**
 * 消息草稿结果的 Schema 定义
 */
export const MessageDraftOutcomeSchema = z.enum(['sent', 'cancelled']);

/**
 * 消息草稿结果类型
 * 对应 MessageDraftOutcomeSchema 的 TypeScript 类型
 */
export type MessageDraftOutcome = z.infer<typeof MessageDraftOutcomeSchema>;

const SlackTargetSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('channel'),
    name: z.string().min(1),
    memberCount: z.number().optional(),
  }),
  z.object({ type: z.literal('dm'), name: z.string().min(1) }),
]);

/**
 * Slack 目标类型
 * 对应 SlackTargetSchema 的 TypeScript 类型
 */
export type SlackTarget = z.infer<typeof SlackTargetSchema>;

/**
 * 可序列化邮件草稿的 Schema 定义
 */
export const SerializableEmailDraftSchema = z.object({
  id: ToolUIIdSchema,
  role: ToolUIRoleSchema.optional(),
  body: z.string().min(1),
  outcome: MessageDraftOutcomeSchema.optional(),
  channel: z.literal('email'),
  subject: z.string().min(1),
  from: z.string().optional(),
  to: z.array(z.string()).min(1),
  cc: z.array(z.string()).optional(),
  bcc: z.array(z.string()).optional(),
});

/**
 * 可序列化 Slack 草稿的 Schema 定义
 */
export const SerializableSlackDraftSchema = z.object({
  id: ToolUIIdSchema,
  role: ToolUIRoleSchema.optional(),
  body: z.string().min(1),
  outcome: MessageDraftOutcomeSchema.optional(),
  channel: z.literal('slack'),
  target: SlackTargetSchema,
});

/**
 * MessageDraft 的可序列化数据 Schema
 * 用于验证从外部传入的数据结构
 */
export const SerializableMessageDraftSchema = z.discriminatedUnion('channel', [
  SerializableEmailDraftSchema,
  SerializableSlackDraftSchema,
]);

/**
 * MessageDraft 的可序列化数据类型
 * 对应 SerializableMessageDraftSchema 的 TypeScript 类型
 */
export type SerializableMessageDraft = z.infer<
  typeof SerializableMessageDraftSchema
>;

/**
 * 可序列化邮件草稿类型
 * 对应 SerializableEmailDraftSchema 的 TypeScript 类型
 */
export type SerializableEmailDraft = z.infer<
  typeof SerializableEmailDraftSchema
>;

/**
 * 可序列化 Slack 草稿类型
 * 对应 SerializableSlackDraftSchema 的 TypeScript 类型
 */
export type SerializableSlackDraft = z.infer<
  typeof SerializableSlackDraftSchema
>;

const SerializableMessageDraftSchemaContract = defineToolUiContract(
  'MessageDraft',
  SerializableMessageDraftSchema,
);

export const parseSerializableMessageDraft: (
  input: unknown,
) => SerializableMessageDraft = SerializableMessageDraftSchemaContract.parse;

export const safeParseSerializableMessageDraft: (
  input: unknown,
) => SerializableMessageDraft | null =
  SerializableMessageDraftSchemaContract.safeParse;

export const MessageDraftCssSchema = z.object({
  root: z.string().optional(),
  header: z.string().optional(),
  body: z.string().optional(),
  actions: z.string().optional(),
});

/**
 * MessageDraft 组件的基础 Props 接口
 * 包含所有可配置的属性
 */
export interface MessageDraftProps {
  id: string;
  role?: 'information' | 'decision' | 'control' | 'state' | 'composite';
  body: string;
  outcome?: 'sent' | 'cancelled';
  channel: 'email' | 'slack';
  css?: { root?: string; header?: string; body?: string; actions?: string };
  undoGracePeriod?: number;
  onSend?: () => void | Promise<void>;
  onUndo?: () => void;
  onCancel?: () => void;
}

/**
 * 邮件草稿 Props 接口
 * 继承自 MessageDraftProps
 */
export interface EmailDraftProps extends MessageDraftProps {
  channel: 'email';
  subject: string;
  from?: string;
  to: string[];
  cc?: string[];
  bcc?: string[];
}

/**
 * Slack 草稿 Props 接口
 * 继承自 MessageDraftProps
 */
export interface SlackDraftProps extends MessageDraftProps {
  channel: 'slack';
  target: SlackTarget;
}

/**
 * 运行时消息草稿 Props 接口
 */
export interface RuntimeMessageDraftProps extends MessageDraftProps {
  subject?: string;
  from?: string;
  to?: string[];
  cc?: string[];
  bcc?: string[];
  target?: SlackTarget;
}

/**
 * 消息草稿 Props 联合类型
 */
export type MessageDraftPropsUnion = EmailDraftProps | SlackDraftProps;
