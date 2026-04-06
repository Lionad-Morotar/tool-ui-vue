/**
 * ApprovalCard 组件的数据契约定义
 *
 * 定义了该组件的：
 * - Zod Schema：用于运行时数据验证
 * - TypeScript 类型：用于类型安全
 * - Props 接口：用于组件属性定义
 *
 * @module tool-ui-vue/vtu-components/approval-card/schema
 */
import { defineToolUiContract, ToolUIIdSchema, ToolUIRoleSchema } from '@lionad/vtu-core';
import { z } from 'zod';

/**
 * 元数据项的 Schema 定义
 * 用于存储键值对形式的元数据
 */
export const MetadataItemSchema = z.object({
  key: z.string().min(1),
  value: z.string(),
});

/**
 * 元数据项类型
 * 对应 MetadataItemSchema 的 TypeScript 类型
 */
export type MetadataItem = z.infer<typeof MetadataItemSchema>;

/**
 * 审批决策类型的 Schema 定义
 */
export const ApprovalDecisionSchema = z.enum(['approved', 'denied']);

/**
 * 审批决策类型
 * 对应 ApprovalDecisionSchema 的 TypeScript 类型
 */
export type ApprovalDecision = z.infer<typeof ApprovalDecisionSchema>;

/**
 * ApprovalCard 的可序列化数据 Schema
 * 用于验证从外部传入的数据结构
 */
export const SerializableApprovalCardSchema = z.object({
  id: ToolUIIdSchema,
  role: ToolUIRoleSchema.optional(),

  title: z.string().min(1),
  description: z.string().optional(),
  icon: z.string().optional(),
  metadata: z.array(MetadataItemSchema).optional(),

  variant: z.enum(['default', 'destructive']).optional(),

  confirmLabel: z.string().optional(),
  cancelLabel: z.string().optional(),

  choice: ApprovalDecisionSchema.optional(),
});

/**
 * ApprovalCard 的可序列化数据类型
 * 对应 SerializableApprovalCardSchema 的 TypeScript 类型
 */
export type SerializableApprovalCard = z.infer<
  typeof SerializableApprovalCardSchema
>;

const SerializableApprovalCardSchemaContract = defineToolUiContract(
  'ApprovalCard',
  SerializableApprovalCardSchema,
);

export const parseSerializableApprovalCard: (
  input: unknown,
) => SerializableApprovalCard = SerializableApprovalCardSchemaContract.parse;

export const safeParseSerializableApprovalCard: (
  input: unknown,
) => SerializableApprovalCard | null =
  SerializableApprovalCardSchemaContract.safeParse;

export const ApprovalCardCssSchema = z.object({
  root: z.string().optional(),
  header: z.string().optional(),
  content: z.string().optional(),
  actions: z.string().optional(),
});

/**
 * ApprovalCard 组件的基础 Props 接口（不含回调函数）
 * 包含所有可配置的属性
 */
export interface ApprovalCardBaseProps {
  id: string;
  role?: 'information' | 'decision' | 'control' | 'state' | 'composite';
  title: string;
  description?: string;
  icon?: string;
  metadata?: MetadataItem[];
  variant?: 'default' | 'destructive';
  confirmLabel?: string;
  cancelLabel?: string;
  choice?: ApprovalDecision;
  css?: { root?: string; header?: string; content?: string; actions?: string };
}

/**
 * ApprovalCard 组件的完整 Props 接口
 * 包含所有可配置的属性及回调函数
 */
export interface ApprovalCardProps extends ApprovalCardBaseProps {
  onConfirm?: () => void | Promise<void>;
  onCancel?: () => void | Promise<void>;
}
