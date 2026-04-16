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

import { defineToolUiContract, SerializableActionSchema, SerializableActionsConfigSchema, ToolUIIdSchema, ToolUIReceiptSchema, ToolUIRoleSchema,  } from '../core';
import { z } from 'zod';
import type { Action, SerializableActionsConfig, ToolUIReceipt } from '../core';

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
  defaultValue: z.string().optional(),
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

const PreferenceItemSchema = z.discriminatedUnion('type', [
  PreferenceSwitchSchema,
  PreferenceToggleSchema,
  PreferenceSelectSchema,
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
        choice: z.record(z.string(), z.union([z.string(), z.boolean()])),
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
 */
export interface PreferencesValue {
  [itemId: string]: string | boolean;
}

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
  choice: Record<string, string | boolean>;
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
