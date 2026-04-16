import {
/**
 * ProgressTracker 组件的数据契约定义
 *
 * 定义了该组件的：
 * - Zod Schema：用于运行时数据验证
 * - TypeScript 类型：用于类型安全
 * - Props 接口：用于组件属性定义
 *
 * @module tool-ui-vue/vtu-components/progress-tracker/schema
 */
  defineToolUiContract,
  ToolUISurfaceSchema,
  ToolUIReceiptSchema,
  type ToolUIReceipt,} from '../core';
import { z } from 'zod';

/**
 * ProgressTracker 选择类型
 */
export type ProgressTrackerChoice = ToolUIReceipt;

/**
 * 进度步骤的 Schema 定义
 */
export const ProgressStepSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  description: z.string().optional(),
  status: z.enum(['pending', 'in-progress', 'completed', 'failed']),
});

/**
 * 进度步骤类型
 * 对应 ProgressStepSchema 的 TypeScript 类型
 */
export type ProgressStep = z.infer<typeof ProgressStepSchema>;

const ProgressStepsSchema = z
  .array(ProgressStepSchema)
  .min(1)
  .superRefine((steps, ctx) => {
    const seenIds = new Set<string>();

    for (const [index, step] of steps.entries()) {
      if (seenIds.has(step.id)) {
        ctx.addIssue({
          code: 'custom',
          message: `Duplicate step id: "${step.id}"`,
          path: [index, 'id'],
        });
      }

      seenIds.add(step.id);
    }
  });

/**
 * ProgressTracker 的可序列化数据 Schema
 * 用于验证从外部传入的数据结构
 */
export const SerializableProgressTrackerSchema = ToolUISurfaceSchema.omit({
  receipt: true,
})
  .extend({
    steps: ProgressStepsSchema,
    elapsedTime: z.number().nonnegative().optional(),
    choice: ToolUIReceiptSchema.optional(),
  })
  .strict();

/**
 * ProgressTracker 的可序列化数据类型
 * 对应 SerializableProgressTrackerSchema 的 TypeScript 类型
 */
export type SerializableProgressTracker = z.infer<
  typeof SerializableProgressTrackerSchema
>;

const SerializableProgressTrackerSchemaContract = defineToolUiContract(
  'ProgressTracker',
  SerializableProgressTrackerSchema,
);

export const parseSerializableProgressTracker: (
  input: unknown,
) => SerializableProgressTracker =
  SerializableProgressTrackerSchemaContract.parse;

export const safeParseSerializableProgressTracker: (
  input: unknown,
) => SerializableProgressTracker | null =
  SerializableProgressTrackerSchemaContract.safeParse;

/**
 * ProgressTrackerCssSchema Zod Schema
 */
export const ProgressTrackerCssSchema = z.object({
  root: z.string().optional(),
  step: z.string().optional(),
});

export type ProgressTrackerCss = z.infer<typeof ProgressTrackerCssSchema>;

/**
 * ProgressTracker 组件的 Props 接口
 * 包含所有可配置的属性
 */
export interface ProgressTrackerProps {
  id: string;
  role?: 'information' | 'decision' | 'control' | 'state' | 'composite';
  steps: ProgressStep[];
  elapsedTime?: number;
  choice?: ProgressTrackerChoice;
  css?: ProgressTrackerCss;
}
