/**
 * QuestionFlow 组件的数据契约定义
 *
 * 定义了该组件的：
 * - Zod Schema：用于运行时数据验证
 * - TypeScript 类型：用于类型安全
 * - Props 接口：用于组件属性定义
 *
 * @module tool-ui-vue/vtu-components/question-flow/schema
 */
import { z } from 'zod';
import { defineToolUiContract, ToolUIIdSchema, ToolUIRoleSchema } from '../core';
import { PreferenceItemSchema } from '../preferences-panel/schema';
import type { PreferenceFieldValue } from '../preferences-panel/schema';
import type { UploadedFile } from '../upload/schema';

/**
 * 问题流程选项的 Schema 定义
 */
export const QuestionFlowOptionSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  description: z.string().optional(),
  disabled: z.boolean().optional(),
});

/**
 * 问题流程选项类型
 * 对应 QuestionFlowOptionSchema 的 TypeScript 类型
 */
export type QuestionFlowOption = z.infer<typeof QuestionFlowOptionSchema>;

/**
 * 问题流程步骤定义的 Schema 定义
 * options(选项步骤)与 fields(表单字段步骤)二选一,交叉校验在 check 中收敛
 */
export const QuestionFlowStepDefinitionSchema = z
  .object({
    id: z.string().min(1),
    title: z.string().min(1),
    description: z.string().optional(),
    options: z.array(QuestionFlowOptionSchema).min(1).optional(),
    selectionMode: z.enum(['single', 'multi']).optional(),
    // 表单字段步骤:复用 PreferencesPanel 的字段契约,字段值按 itemId 归集进答案
    fields: z.array(PreferenceItemSchema).min(1).optional(),
  })
  .check((ctx) => {
    const v = ctx.value;
    const hasOptions = v.options !== undefined && v.options.length > 0;
    const hasFields = v.fields !== undefined && v.fields.length > 0;
    if (!hasOptions && !hasFields) {
      ctx.issues.push({
        code: 'custom',
        input: v,
        message: 'question flow step requires either options or fields',
        path: ['options'],
      });
    }
    if (hasOptions && hasFields) {
      ctx.issues.push({
        code: 'custom',
        input: v,
        message: 'question flow step accepts options or fields, not both',
        path: ['fields'],
      });
    }
  });

/**
 * 字段步骤的答案值映射(itemId → 字段值)
 */
export type QuestionFlowFieldAnswers = Record<string, PreferenceFieldValue>;

/**
 * 问题流程步骤定义类型
 * 对应 QuestionFlowStepDefinitionSchema 的 TypeScript 类型
 */
export type QuestionFlowStepDefinition = z.infer<
  typeof QuestionFlowStepDefinitionSchema
>;

/**
 * 问题流程摘要项的 Schema 定义
 */
export const QuestionFlowSummaryItemSchema = z.object({
  label: z.string().min(1),
  value: z.string().min(1),
});

/**
 * 问题流程摘要项类型
 * 对应 QuestionFlowSummaryItemSchema 的 TypeScript 类型
 */
export type QuestionFlowSummaryItem = z.infer<
  typeof QuestionFlowSummaryItemSchema
>;

/**
 * 问题流程选择的 Schema 定义
 */
export const QuestionFlowChoiceSchema = z.object({
  title: z.string().min(1),
  summary: z.array(QuestionFlowSummaryItemSchema).min(1),
});

/**
 * 问题流程选择类型
 * 对应 QuestionFlowChoiceSchema 的 TypeScript 类型
 */
export type QuestionFlowChoice = z.infer<typeof QuestionFlowChoiceSchema>;

const BaseSchema = z.object({
  id: ToolUIIdSchema,
  role: ToolUIRoleSchema.optional(),
});

/**
 * 渐进模式的可序列化 Schema 定义
 */
export const SerializableProgressiveModeSchema = BaseSchema.extend({
  step: z.number().min(1),
  title: z.string().min(1),
  description: z.string().optional(),
  options: z.array(QuestionFlowOptionSchema).min(1),
  selectionMode: z.enum(['single', 'multi']).optional(),
});

/**
 * 渐进模式类型
 * 对应 SerializableProgressiveModeSchema 的 TypeScript 类型
 */
export type SerializableProgressiveMode = z.infer<
  typeof SerializableProgressiveModeSchema
>;

/**
 * 前置模式的可序列化 Schema 定义
 * 步骤 id 是 answers 的键:重复 id 会让选项/字段两类步骤互相覆盖答案值
 */
export const SerializableUpfrontModeSchema = BaseSchema.extend({
  steps: z.array(QuestionFlowStepDefinitionSchema).min(1),
}).check((ctx) => {
  const ids = ctx.value.steps.map((s) => s.id);
  const dup = ids.find((id, i) => ids.indexOf(id) !== i);
  if (dup) {
    ctx.issues.push({
      code: 'custom',
      input: dup,
      message: `question flow step ids must be unique, got duplicate: ${dup}`,
      path: ['steps'],
    });
  }
});

/**
 * 前置模式类型
 * 对应 SerializableUpfrontModeSchema 的 TypeScript 类型
 */
export type SerializableUpfrontMode = z.infer<
  typeof SerializableUpfrontModeSchema
>;

/**
 * 回执模式的可序列化 Schema 定义
 */
export const SerializableReceiptModeSchema = BaseSchema.extend({
  choice: QuestionFlowChoiceSchema,
});

/**
 * 回执模式类型
 * 对应 SerializableReceiptModeSchema 的 TypeScript 类型
 */
export type SerializableReceiptMode = z.infer<
  typeof SerializableReceiptModeSchema
>;

/**
 * QuestionFlow 的可序列化数据 Schema
 * 用于验证从外部传入的数据结构
 */
export const SerializableQuestionFlowSchema = z.union([
  SerializableProgressiveModeSchema,
  SerializableUpfrontModeSchema,
  SerializableReceiptModeSchema,
]);

/**
 * QuestionFlow 的可序列化数据类型
 * 对应 SerializableQuestionFlowSchema 的 TypeScript 类型
 */
export type SerializableQuestionFlow = z.infer<
  typeof SerializableQuestionFlowSchema
>;

const SerializableQuestionFlowSchemaContract = defineToolUiContract(
  'QuestionFlow',
  SerializableQuestionFlowSchema,
);

export const parseSerializableQuestionFlow: (
  input: unknown,
) => SerializableQuestionFlow = SerializableQuestionFlowSchemaContract.parse;

export const safeParseSerializableQuestionFlow: (
  input: unknown,
) => SerializableQuestionFlow | null =
  SerializableQuestionFlowSchemaContract.safeParse;

/**
 * QuestionFlowCssSchema Zod Schema
 */
export const QuestionFlowCssSchema = z.object({
  root: z.string().optional(),
  header: z.string().optional(),
  options: z.string().optional(),
  fields: z.string().optional(),
  actions: z.string().optional(),
});

/**
 * QuestionFlow CSS 类型
 * 对应 QuestionFlowCssSchema 的 TypeScript 类型
 */
export type QuestionFlowCss = z.infer<typeof QuestionFlowCssSchema>;

/**
 * QuestionFlow 渐进模式 Props 接口
 */
export interface QuestionFlowProgressiveProps {
  id: string;
  role?: 'information' | 'decision' | 'control' | 'state' | 'composite';
  step: number;
  title: string;
  description?: string;
  css?: QuestionFlowCss;
  options: QuestionFlowOption[];
  selectionMode?: 'single' | 'multi';
  defaultValue?: string[];
  onSelect?: (optionIds: string[]) => void | Promise<void>;
  onBack?: () => void;
}

/**
 * QuestionFlow 前置模式 Props 接口
 * onComplete answers:选项步骤为 optionId 数组,字段步骤为 itemId → 值映射
 */
export interface QuestionFlowUpfrontProps {
  id: string;
  role?: 'information' | 'decision' | 'control' | 'state' | 'composite';
  steps: QuestionFlowStepDefinition[];
  css?: QuestionFlowCss;
  // 字段步骤内 upload 字段的上传通道,语义同 PreferencesPanelProps.upload
  upload?: (file: File) => Promise<UploadedFile>;
  onStepChange?: (stepId: string) => void;
  onComplete?: (answers: Record<string, string[] | QuestionFlowFieldAnswers>) => void | Promise<void>;
}

/**
 * QuestionFlow 回执模式 Props 接口
 */
export interface QuestionFlowReceiptProps {
  id: string;
  role?: 'information' | 'decision' | 'control' | 'state' | 'composite';
  choice: QuestionFlowChoice;
  css?: QuestionFlowCss;
}

/**
 * QuestionFlow Props 联合类型
 */
export type QuestionFlowProps =
  | QuestionFlowProgressiveProps
  | QuestionFlowUpfrontProps
  | QuestionFlowReceiptProps;
