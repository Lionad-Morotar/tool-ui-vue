/**
 * Upload 组件的数据契约定义
 *
 * - Zod Schema：运行时数据验证（serializable 层不含函数，handler 等留在 runtime Props）
 * - TypeScript 类型：组件 props 与 v-model 契约
 *
 * @module tool-ui-vue/vtu-components/upload/schema
 */

import { z } from 'zod';
import { defineToolUiContract, ToolUIIdSchema, ToolUIReceiptSchema, ToolUIRoleSchema } from '../core';
import type { ToolUIReceipt } from '../core';

/**
 * 已上传文件项契约。
 * uid 由组件内部生成作列表 key,随 v-model 外泄供父级稳定引用;
 * id 是预留透传位(如业务侧的 versionId 场景);
 * loose 策略允许消费方回执里携带扩展字段透传,strict 只作用于组件顶层
 */
export const UploadedFileSchema = z.looseObject({
  name: z.string(),
  url: z.string(),
  size: z.number().optional(),
  id: z.string().optional(),
  uid: z.string().optional(),
});

export type UploadedFile = z.infer<typeof UploadedFileSchema>;

const UploadBaseSchema = z.object({
  id: ToolUIIdSchema,
  role: ToolUIRoleSchema.optional(),
  receipt: ToolUIReceiptSchema.optional(),
  title: z.string().min(1).optional(),
  // 无点后缀数组(对齐 86links ['png','jpg']),含 / 的项视为 MIME
  accept: z.array(z.string().min(1)).optional(),
  maxSize: z.number().positive().optional(),
  limit: z.number().min(1).optional(),
  multiple: z.boolean().optional(),
  variant: z.enum(['text', 'picture-card']).optional(),
  disabled: z.boolean().optional(),
  // 回显初始集:LLM 产出数据时可直接携带已上传文件
  files: z.array(UploadedFileSchema).optional(),
});

/**
 * Upload 的可序列化数据 Schema
 */
export const SerializableUploadSchema = z.strictObject(UploadBaseSchema.shape);

/**
 * Upload 回执的 Schema(choice 为已上传文件列表)。
 * 只携带展示相关字段——accept/limit/files 等交互专属字段在回执里无意义,
 * 放行会让 LLM 产出的脏数据无告警潜入序列化层
 */
export const SerializableUploadReceiptSchema = z.strictObject({
  id: ToolUIIdSchema,
  role: ToolUIRoleSchema.optional(),
  receipt: ToolUIReceiptSchema.optional(),
  title: z.string().min(1).optional(),
  variant: z.enum(['text', 'picture-card']).optional(),
  choice: z.array(UploadedFileSchema),
});

export type SerializableUpload = z.infer<typeof SerializableUploadSchema>;
export type SerializableUploadReceipt = z.infer<typeof SerializableUploadReceiptSchema>;

const SerializableUploadSchemaContract = defineToolUiContract(
  'Upload',
  SerializableUploadSchema,
);

const SerializableUploadReceiptSchemaContract = defineToolUiContract(
  'UploadReceipt',
  SerializableUploadReceiptSchema,
);

export const parseSerializableUpload: (input: unknown) => SerializableUpload =
  SerializableUploadSchemaContract.parse;

export const safeParseSerializableUpload: (input: unknown) => SerializableUpload | null =
  SerializableUploadSchemaContract.safeParse;

export const parseSerializableUploadReceipt: (input: unknown) => SerializableUploadReceipt =
  SerializableUploadReceiptSchemaContract.parse;

export const safeParseSerializableUploadReceipt: (
  input: unknown,
) => SerializableUploadReceipt | null = SerializableUploadReceiptSchemaContract.safeParse;

/**
 * Upload 组件的 Props 基座(交互与回执共享)。
 * upload handler 与 beforeRemove 为函数据,只存在于 runtime 层,不进 serializable schema
 */
export interface UploadBaseProps {
  id: string;
  role?: 'information' | 'decision' | 'control' | 'state' | 'composite';
  receipt?: ToolUIReceipt;
  title?: string;
  variant?: 'text' | 'picture-card';
}

/** 交互模式 Props */
export interface UploadInteractiveProps extends UploadBaseProps {
  accept?: string[];
  /** 单文件体积上限(MB) */
  maxSize?: number;
  /** 文件数量上限(含进行中与已完成) */
  limit?: number;
  multiple?: boolean;
  disabled?: boolean;
  /** 传输注入:组件不认识 HTTP,上传通道完全由消费方供给 */
  upload: (file: File) => Promise<UploadedFile>;
  /** 移除拦截:返回/resolve false 时该项保留(父表单二次确认场景) */
  beforeRemove?: (item: UploadedFile) => boolean | Promise<boolean>;
  /** 回显初始集(非受控场景的初始 done 列表) */
  files?: UploadedFile[];
  modelValue?: UploadedFile[];
}

/** 回执模式 Props:choice 为已上传文件列表,只读展示 */
export interface UploadReceiptProps extends UploadBaseProps {
  choice: UploadedFile[];
}

export type UploadProps = UploadInteractiveProps | UploadReceiptProps;
