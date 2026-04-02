/**
 * StatsDisplay 组件的数据契约定义
 *
 * 定义了该组件的：
 * - Zod Schema：用于运行时数据验证
 * - TypeScript 类型：用于类型安全
 * - Props 接口：用于组件属性定义
 *
 * @module tool-ui-vue/components/stats-display/schema
 */
import { z } from 'zod';
import { defineToolUiContract } from '../../shared/contract';
import { ToolUIIdSchema, ToolUIRoleSchema } from '../../shared/schema';

const TextFormatSchema = z.object({
  kind: z.literal('text'),
});

const NumberFormatSchema = z.object({
  kind: z.literal('number'),
  decimals: z.number().int().min(0).optional(),
  compact: z.boolean().optional(),
});

const CurrencyFormatSchema = z.object({
  kind: z.literal('currency'),
  currency: z.string().min(1),
  decimals: z.number().int().min(0).optional(),
});

const PercentFormatSchema = z.object({
  kind: z.literal('percent'),
  decimals: z.number().int().min(0).optional(),
  basis: z.enum(['fraction', 'unit']).optional(),
});

/**
 * 统计格式 Schema 定义
 */
export const StatFormatSchema = z.discriminatedUnion('kind', [
  TextFormatSchema,
  NumberFormatSchema,
  CurrencyFormatSchema,
  PercentFormatSchema,
]);

/**
 * 统计格式类型
 * 对应 StatFormatSchema 的 TypeScript 类型
 */
export type StatFormat = z.infer<typeof StatFormatSchema>;

/**
 * 统计差异的 Schema 定义
 */
export const StatDiffSchema = z.object({
  value: z.number(),
  decimals: z.number().int().min(0).optional(),
  upIsPositive: z.boolean().optional(),
  label: z.string().optional(),
});

/**
 * 统计差异类型
 * 对应 StatDiffSchema 的 TypeScript 类型
 */
export type StatDiff = z.infer<typeof StatDiffSchema>;

/**
 * 统计迷你图的 Schema 定义
 */
export const StatSparklineSchema = z.object({
  data: z.array(z.number()).min(2),
  color: z.string().optional(),
});

/**
 * 统计迷你图类型
 * 对应 StatSparklineSchema 的 TypeScript 类型
 */
export type StatSparkline = z.infer<typeof StatSparklineSchema>;

/**
 * 统计项的 Schema 定义
 */
export const StatItemSchema = z.object({
  key: z.string().min(1),
  label: z.string().min(1),
  value: z.union([z.string(), z.number()]),
  format: StatFormatSchema.optional(),
  diff: StatDiffSchema.optional(),
  sparkline: StatSparklineSchema.optional(),
});

/**
 * 统计项类型
 * 对应 StatItemSchema 的 TypeScript 类型
 */
export type StatItem = z.infer<typeof StatItemSchema>;

/**
 * StatsDisplay 的可序列化数据 Schema
 * 用于验证从外部传入的数据结构
 */
export const SerializableStatsDisplaySchema = z.object({
  id: ToolUIIdSchema,
  role: ToolUIRoleSchema.optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  stats: z.array(StatItemSchema).min(1),
});

/**
 * StatsDisplay 的可序列化数据类型
 * 对应 SerializableStatsDisplaySchema 的 TypeScript 类型
 */
export type SerializableStatsDisplay = z.infer<
  typeof SerializableStatsDisplaySchema
>;

const SerializableStatsDisplaySchemaContract = defineToolUiContract(
  'StatsDisplay',
  SerializableStatsDisplaySchema,
);

export const parseSerializableStatsDisplay: (
  input: unknown,
) => SerializableStatsDisplay = SerializableStatsDisplaySchemaContract.parse;

export const safeParseSerializableStatsDisplay: (
  input: unknown,
) => SerializableStatsDisplay | null =
  SerializableStatsDisplaySchemaContract.safeParse;

/**
 * StatsDisplay 组件的 Props 接口
 * 包含所有可配置的属性
 */
export interface StatsDisplayProps {
  id: string;
  role?: 'information' | 'decision' | 'control' | 'state' | 'composite';
  title?: string;
  description?: string;
  stats: StatItem[];
  className?: string;
  locale?: string;
}
