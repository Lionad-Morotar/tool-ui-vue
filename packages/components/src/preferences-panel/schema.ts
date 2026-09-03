/**
 * PreferencesPanel 组件的数据契约定义
 *
 * 定义了该组件的：
 * - Zod Schema：用于运行时数据验证
 * - TypeScript 类型：用于类型安全
 * - Props 接口：用于组件属性定义
 *
 * @module tool-ui-vue/vtu-components/preferences-panel/schema
 */

import { z } from 'zod';
import { defineToolUiContract, SerializableActionSchema, SerializableActionsConfigSchema, ToolUIIdSchema, ToolUIReceiptSchema, ToolUIRoleSchema,  } from '../core';
import { UploadedFileSchema } from '../upload/schema';
import type { Action, SerializableActionsConfig, ToolUIReceipt } from '../core';
import type { UploadedFile } from '../upload/schema';

const PreferenceItemBaseSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  description: z.string().optional(),
});

const PreferenceSwitchSchema = PreferenceItemBaseSchema.extend({
  type: z.literal('switch'),
  defaultChecked: z.boolean().optional(),
});

const PreferenceToggleSchema = PreferenceItemBaseSchema.extend({
  type: z.literal('toggle'),
  options: z
    .array(
      z.object({
        value: z.string().min(1),
        label: z.string().min(1),
      }),
    )
    .min(2),
  defaultValue: z.union([z.string(), z.array(z.string())]).optional(),
  multiple: z.boolean().optional(),
});

const PreferenceSelectSchema = PreferenceItemBaseSchema.extend({
  type: z.literal('select'),
  selectOptions: z
    .array(
      z.object({
        value: z.string().min(1),
        label: z.string().min(1),
      }),
    )
    .min(5),
  defaultSelected: z.string().optional(),
});

const PreferenceInputSchema = PreferenceItemBaseSchema.extend({
  type: z.literal('input'),
  inputType: z.enum(['text', 'tel', 'email', 'url', 'number']).optional(),
  required: z.boolean().optional(),
  placeholder: z.string().optional(),
  defaultValue: z.string().optional(),
});

const PreferenceTextareaSchema = PreferenceItemBaseSchema.extend({
  type: z.literal('textarea'),
  required: z.boolean().optional(),
  placeholder: z.string().optional(),
  defaultValue: z.string().optional(),
  rows: z.number().min(1).optional(),
});

// 新增表单项的默认值字段统一收敛 defaultValue(既有 defaultChecked/defaultSelected 保留不破坏兼容)
const PreferenceRatingSchema = PreferenceItemBaseSchema.extend({
  type: z.literal('rating'),
  max: z.number().min(1).optional(),
  defaultValue: z.number().optional(),
});

const PreferenceNumberSchema = PreferenceItemBaseSchema.extend({
  type: z.literal('number'),
  min: z.number().optional(),
  max: z.number().optional(),
  step: z.number().optional(),
  placeholder: z.string().optional(),
  defaultValue: z.number().optional(),
});

const PreferenceTagsSchema = PreferenceItemBaseSchema.extend({
  type: z.literal('tags'),
  max: z.number().min(1).optional(),
  placeholder: z.string().optional(),
  defaultValue: z.array(z.string()).optional(),
});

const PreferenceDateSchema = PreferenceItemBaseSchema.extend({
  type: z.literal('date'),
  mode: z.enum(['date', 'datetime', 'range']).optional(),
  placeholder: z.string().optional(),
  defaultValue: z.union([z.string(), z.array(z.string())]).optional(),
}).check((ctx) => {
  // mode 与默认值形态交叉校验:range ↔ 数组、单值 ↔ string,错位即非法
  // (受控 value 与 receipt choice 不过此 schema,那条入口由 field 层 dateModel 收窄兜底)
  const v = ctx.value;
  if (v.defaultValue === undefined) return;
  const ok = v.mode === 'range' ? Array.isArray(v.defaultValue) : typeof v.defaultValue === 'string';
  if (!ok) {
    ctx.issues.push({
      code: 'custom',
      input: v.defaultValue,
      message: "date item defaultValue must be a string pair array when mode is 'range', otherwise a string",
      path: ['defaultValue'],
    });
  }
});

// upload 字段复用 Upload 组件的声明性配置;上传通道(handler)是函数据,
// 不进 serializable schema,由 PreferencesPanelProps 注入透传
const PreferenceUploadSchema = PreferenceItemBaseSchema.extend({
  type: z.literal('upload'),
  accept: z.array(z.string().min(1)).optional(),
  maxSize: z.number().positive().optional(),
  limit: z.number().min(1).optional(),
  multiple: z.boolean().optional(),
  variant: z.enum(['text', 'picture-card']).optional(),
  defaultValue: z.array(UploadedFileSchema).optional(),
});

// 导出供 question-flow 字段步骤复用同一字段契约
export const PreferenceItemSchema = z.discriminatedUnion('type', [
  PreferenceSwitchSchema,
  PreferenceToggleSchema,
  PreferenceSelectSchema,
  PreferenceInputSchema,
  PreferenceTextareaSchema,
  PreferenceRatingSchema,
  PreferenceNumberSchema,
  PreferenceTagsSchema,
  PreferenceDateSchema,
  PreferenceUploadSchema,
]);

const PreferenceSectionSchema = z.object({
  heading: z.string().min(1).optional(),
  items: z.array(PreferenceItemSchema).min(1),
});

const PreferencesPanelBaseSchema = z.object({
  id: ToolUIIdSchema,
  role: ToolUIRoleSchema.optional(),
  receipt: ToolUIReceiptSchema.optional(),
  title: z.string().min(1).optional(),
  sections: z.array(PreferenceSectionSchema).min(1),
});

/**
 * PreferencesPanel 的可序列化数据 Schema
 * 用于验证从外部传入的数据结构
 */
export const SerializablePreferencesPanelSchema =
  z.strictObject(PreferencesPanelBaseSchema.extend({
        actions: z
          .union([
            z.array(SerializableActionSchema),
            SerializableActionsConfigSchema,
          ])
          .optional(),
      }).shape);

/**
 * PreferencesPanel 回执的 Schema 定义
 */
export const SerializablePreferencesPanelReceiptSchema =
  z.strictObject(PreferencesPanelBaseSchema.extend({
        // number 承载 rating/number 项,null 承载 number 项的未填空态,
        // 文件数组承载 upload 项
        choice: z.record(
          z.string(),
          z.union([z.string(), z.boolean(), z.array(z.string()), z.number(), z.null(), z.array(UploadedFileSchema)])
        ),
        error: z.record(z.string(), z.string()).optional(),
      }).shape);

/**
 * PreferencesPanel 的可序列化数据类型
 * 对应 SerializablePreferencesPanelSchema 的 TypeScript 类型
 */
export type SerializablePreferencesPanel = z.infer<
  typeof SerializablePreferencesPanelSchema
>;

/**
 * PreferencesPanel 回执类型
 * 对应 SerializablePreferencesPanelReceiptSchema 的 TypeScript 类型
 */
export type SerializablePreferencesPanelReceipt = z.infer<
  typeof SerializablePreferencesPanelReceiptSchema
>;

const SerializablePreferencesPanelSchemaContract = defineToolUiContract(
  'PreferencesPanel',
  SerializablePreferencesPanelSchema,
);

const SerializablePreferencesPanelReceiptSchemaContract = defineToolUiContract(
  'PreferencesPanelReceipt',
  SerializablePreferencesPanelReceiptSchema,
);

export const parseSerializablePreferencesPanel: (
  input: unknown,
) => SerializablePreferencesPanel =
  SerializablePreferencesPanelSchemaContract.parse;

export const safeParseSerializablePreferencesPanel: (
  input: unknown,
) => SerializablePreferencesPanel | null =
  SerializablePreferencesPanelSchemaContract.safeParse;

export const parseSerializablePreferencesPanelReceipt: (
  input: unknown,
) => SerializablePreferencesPanelReceipt =
  SerializablePreferencesPanelReceiptSchemaContract.parse;

export const safeParseSerializablePreferencesPanelReceipt: (
  input: unknown,
) => SerializablePreferencesPanelReceipt | null =
  SerializablePreferencesPanelReceiptSchemaContract.safeParse;

/**
 * 偏好设置值类型
 * null 专供 number 项的未填空态(与 0 区分);rating 恒为 number;
 * 文件数组专供 upload 项
 */
export interface PreferencesValue {
  [itemId: string]: string | string[] | boolean | number | null | UploadedFile[];
}

/** 单个偏好项的值联合,供控件桥接与 states 层签名复用 */
export type PreferenceFieldValue = PreferencesValue[string];

/**
 * PreferencesPanelCssSchema Zod Schema
 */
export const PreferencesPanelCssSchema = z.object({
  root: z.string().optional(),
  section: z.string().optional(),
  item: z.string().optional(),
  actions: z.string().optional(),
});

export type PreferencesPanelCss = z.infer<typeof PreferencesPanelCssSchema>;

/**
 * PreferencesPanel 组件的 Props 接口
 * 包含所有可配置的属性
 */
export interface PreferencesPanelProps {
  id: string;
  role?: 'information' | 'decision' | 'control' | 'state' | 'composite';
  receipt?: ToolUIReceipt;
  title?: string;
  sections: PreferenceSection[];
  css?: PreferencesPanelCss;
  value?: PreferencesValue;
  actions?:
    | Action[]
    | SerializableActionsConfig;
  // upload 字段的上传通道:组件不认识 HTTP,经此注入透传到字段内 Upload 原子
  upload?: (file: File) => Promise<UploadedFile>;
  onChange?: (value: PreferencesValue) => void;
  onAction?: (actionId: string, value: PreferencesValue) => void | Promise<void>;
}

/**
 * PreferencesPanel 回执组件的 Props 接口
 */
export interface PreferencesPanelReceiptProps {
  id: string;
  role?: 'information' | 'decision' | 'control' | 'state' | 'composite';
  receipt?: ToolUIReceipt;
  title?: string;
  sections: PreferenceSection[];
  choice: Record<string, string | boolean | string[] | number | null | UploadedFile[]>;
  error?: Record<string, string>;
  css?: PreferencesPanelCss;
}

/**
 * 偏好设置项类型
 * 对应 PreferenceItemSchema 的 TypeScript 类型
 */
export type PreferenceItem = z.infer<typeof PreferenceItemSchema>;

/**
 * 偏好设置节类型
 * 对应 PreferenceSectionSchema 的 TypeScript 类型
 */
export type PreferenceSection = z.infer<typeof PreferenceSectionSchema>;
