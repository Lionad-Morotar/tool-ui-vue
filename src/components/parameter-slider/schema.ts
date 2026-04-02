/**
 * ParameterSlider 组件的数据契约定义
 *
 * 定义了该组件的：
 * - Zod Schema：用于运行时数据验证
 * - TypeScript 类型：用于类型安全
 * - Props 接口：用于组件属性定义
 *
 * @module tool-ui-vue/components/parameter-slider/schema
 */
import { z } from 'zod';
import { defineToolUiContract } from '../../shared/contract';
import {
  SerializableActionSchema,
  SerializableActionsConfigSchema,
  ToolUIIdSchema,
  ToolUIRoleSchema,
} from '../../shared/schema';
import type { Action, SerializableActionsConfig } from '../../shared/schema';

/**
 * 滑块配置的 Schema 定义
 */
export const SliderConfigSchema = z
  .object({
    id: z.string().min(1),
    label: z.string().min(1),
    min: z.number().finite(),
    max: z.number().finite(),
    step: z.number().finite().positive().optional(),
    value: z.number().finite(),
    unit: z.string().optional(),
    precision: z.number().int().min(0).optional(),
    disabled: z.boolean().optional(),
    trackClassName: z.string().optional(),
    fillClassName: z.string().optional(),
    handleClassName: z.string().optional(),
  })
  .superRefine((slider, ctx) => {
    if (slider.max <= slider.min) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['max'],
        message: 'max must be greater than min',
      });
    }

    if (slider.value < slider.min || slider.value > slider.max) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['value'],
        message: 'value must be between min and max',
      });
    }
  });

/**
 * 滑块配置类型
 * 对应 SliderConfigSchema 的 TypeScript 类型
 */
export interface SliderConfig {
  id: string;
  label: string;
  min: number;
  max: number;
  step?: number;
  value: number;
  unit?: string;
  precision?: number;
  disabled?: boolean;
  trackClassName?: string;
  fillClassName?: string;
  handleClassName?: string;
}

/**
 * ParameterSlider 的可序列化数据 Schema
 * 用于验证从外部传入的数据结构
 */
export const SerializableParameterSliderSchema = z
  .object({
    id: ToolUIIdSchema,
    role: ToolUIRoleSchema.optional(),
    sliders: z.array(SliderConfigSchema).min(1),
    actions: z
      .union([
        z.array(SerializableActionSchema),
        SerializableActionsConfigSchema,
      ])
      .optional(),
  })
  .strict()
  .superRefine((payload, ctx) => {
    const seenIds = new Map<string, number>();

    payload.sliders.forEach((slider, index) => {
      const firstSeenAt = seenIds.get(slider.id);
      if (firstSeenAt !== undefined) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['sliders', index, 'id'],
          message: `duplicate slider id '${slider.id}' (first seen at index ${firstSeenAt})`,
        });
        return;
      }
      seenIds.set(slider.id, index);
    });
  });

/**
 * ParameterSlider 的可序列化数据类型
 * 对应 SerializableParameterSliderSchema 的 TypeScript 类型
 */
export type SerializableParameterSlider = z.infer<
  typeof SerializableParameterSliderSchema
>;

const SerializableParameterSliderSchemaContract = defineToolUiContract(
  'ParameterSlider',
  SerializableParameterSliderSchema,
);

export const parseSerializableParameterSlider: (
  input: unknown,
) => SerializableParameterSlider =
  SerializableParameterSliderSchemaContract.parse;

export const safeParseSerializableParameterSlider: (
  input: unknown,
) => SerializableParameterSlider | null =
  SerializableParameterSliderSchemaContract.safeParse;

/**
 * 滑块值类型
 */
export interface SliderValue {
  id: string;
  value: number;
}

/**
 * ParameterSlider 组件的 Props 接口
 * 包含所有可配置的属性
 */
export interface ParameterSliderProps {
  id: string;
  role?: 'information' | 'decision' | 'control' | 'state' | 'composite';
  sliders: SliderConfig[];
  className?: string;
  values?: SliderValue[];
  actions?:
    | Action[]
    | SerializableActionsConfig;
  onChange?: (values: SliderValue[]) => void;
  onAction?: (actionId: string, values: SliderValue[]) => void | Promise<void>;
}
