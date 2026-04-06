/**
 * OptionList 组件的数据契约定义
 *
 * 定义了该组件的：
 * - Zod Schema：用于运行时数据验证
 * - TypeScript 类型：用于类型安全
 * - Props 接口：用于组件属性定义
 *
 * @module tool-ui-vue/vtu-components/option-list/schema
 */

import { defineToolUiContract, ActionSchema, SerializableActionSchema, SerializableActionsConfigSchema, ToolUIIdSchema, ToolUIReceiptSchema, ToolUIRoleSchema,  } from '@lionad/vtu-core';
import { z } from 'zod';
import type { Action, SerializableActionsConfig } from '@lionad/vtu-core';

/**
 * 选项列表中单个选项的 Schema 定义
 */
export const OptionListOptionSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  description: z.string().optional(),
  icon: z.string().optional(),
  disabled: z.boolean().optional(),
});

/**
 * 选项列表选择类型
 * 可以是多选（字符串数组）、单选（字符串）或空
 */
export type OptionListSelection = string[] | string | null;

const OptionListSelectionSchema = z
  .union([z.array(z.string()), z.string(), z.null()])
  .optional();

type OptionListSchemaInvariantInput = {
  options: Array<{ id: string }>;
  minSelections?: number;
  maxSelections?: number;
  value?: OptionListSelection;
  defaultValue?: OptionListSelection;
  choice?: OptionListSelection;
};

function selectionToIds(selection: OptionListSelection | undefined): string[] {
  if (selection == null) return [];
  if (typeof selection === 'string') return [selection];
  return Array.isArray(selection) ? selection : [];
}

function validateOptionListInvariants(
  data: OptionListSchemaInvariantInput,
  ctx: z.RefinementCtx,
) {
  if (
    data.minSelections !== undefined &&
    data.maxSelections !== undefined &&
    data.minSelections > data.maxSelections
  ) {
    ctx.addIssue({
      code: "custom",
      path: ['minSelections'],
      message: '`minSelections` cannot be greater than `maxSelections`.',
    });
  }

  const optionIds = new Set<string>();
  for (let index = 0; index < data.options.length; index++) {
    const optionId = data.options[index]?.id;
    if (!optionId) continue;

    if (optionIds.has(optionId)) {
      ctx.addIssue({
        code: "custom",
        path: ['options', index, 'id'],
        message: `Duplicate option id "${optionId}" is not allowed.`,
      });
    } else {
      optionIds.add(optionId);
    }
  }

  const selectionFields: Array<
    ['value' | 'defaultValue' | 'choice', OptionListSelection | undefined]
  > = [
      ['value', data.value],
      ['defaultValue', data.defaultValue],
      ['choice', data.choice],
    ];

  for (const [fieldName, selection] of selectionFields) {
    if (selection == null) continue;

    const ids = selectionToIds(selection);
    ids.forEach((selectionId, index) => {
      if (!optionIds.has(selectionId)) {
        ctx.addIssue({
          code: "custom",
          path:
            typeof selection === 'string' ? [fieldName] : [fieldName, index],
          message: `Selection id "${selectionId}" must exist in options.`,
        });
      }
    });
  }
}

/**
 * OptionListCssSchema Zod Schema
 */
export const OptionListCssSchema = z.object({
  root: z.string().optional(),
  item: z.string().optional(),
  actions: z.string().optional(),
});

const OptionListPropsSchemaBase = z.object({
  id: ToolUIIdSchema,
  role: ToolUIRoleSchema.optional(),
  receipt: ToolUIReceiptSchema.optional(),
  options: z.array(OptionListOptionSchema).min(1),
  selectionMode: z.enum(['multi', 'single']).optional(),
  value: OptionListSelectionSchema,
  defaultValue: OptionListSelectionSchema,
  choice: OptionListSelectionSchema,
  actions: z
    .union([z.array(ActionSchema), SerializableActionsConfigSchema])
    .optional(),
  minSelections: z.number().min(0).optional(),
  maxSelections: z.number().min(1).optional(),
  css: OptionListCssSchema.optional().default({}),
});

/**
 * OptionList 的可序列化数据 Schema
 * 用于验证从外部传入的数据结构
 */
export const OptionListPropsSchema = OptionListPropsSchemaBase.superRefine(
  validateOptionListInvariants,
);

/**
 * 选项列表中的选项类型
 */
export interface OptionListOption {
  id: string;
  label: string;
  description?: string;
  icon?: string;
  disabled?: boolean;
}

/**
 * OptionList 组件的 Props 接口
 * 包含所有可配置的属性
 */
export interface OptionListProps {
  id: string;
  role?: 'information' | 'decision' | 'control' | 'state' | 'composite';
  receipt?: {
    outcome: 'success' | 'partial' | 'failed' | 'cancelled';
    summary: string;
    identifiers?: Record<string, string>;
    at: string;
  };
  options: OptionListOption[];
  selectionMode?: 'multi' | 'single';
  value?: OptionListSelection;
  defaultValue?: OptionListSelection;
  choice?: OptionListSelection;
  actions?:
    | Action[]
    | SerializableActionsConfig;
  minSelections?: number;
  maxSelections?: number;
  onChange?: (value: OptionListSelection) => void;
  onAction?: (actionId: string, value: OptionListSelection) => void | Promise<void>;
  onBeforeAction?: (actionId: string, value: OptionListSelection) => void | Promise<void>;
  css?: { root?: string; item?: string; actions?: string };
}

/**
 * OptionList 的可序列化数据 Schema（排除 value 字段）
 */
export const SerializableOptionListSchema = z.strictObject(OptionListPropsSchemaBase.omit({
  value: true,
  css: true,
})
  .extend({
    options: z.array(OptionListOptionSchema.omit({ icon: true })),
    actions: z
      .union([
        z.array(SerializableActionSchema),
        SerializableActionsConfigSchema,
      ])
      .optional(),
  }).shape)
  .superRefine(validateOptionListInvariants);

/**
 * OptionList 的可序列化数据类型
 * 对应 SerializableOptionListSchema 的 TypeScript 类型
 */
export type SerializableOptionList = z.infer<
  typeof SerializableOptionListSchema
>;

const SerializableOptionListSchemaContract = defineToolUiContract(
  'OptionList',
  SerializableOptionListSchema,
);

export const parseSerializableOptionList: (
  input: unknown,
) => SerializableOptionList = SerializableOptionListSchemaContract.parse;

export const safeParseSerializableOptionList: (
  input: unknown,
) => SerializableOptionList | null =
  SerializableOptionListSchemaContract.safeParse;
