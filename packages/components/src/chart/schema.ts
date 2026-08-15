/**
 * Chart 组件的数据契约定义
 *
 * 定义了该组件的：
 * - Zod Schema：用于运行时数据验证
 * - TypeScript 类型：用于类型安全
 * - Props 接口：用于组件属性定义
 *
 * @module tool-ui-vue/vtu-components/chart/schema
 */
import { z } from 'zod';
import { defineToolUiContract,
  ToolUIIdSchema,
  ToolUIReceiptSchema,
  ToolUIRoleSchema } from '../core';
import type { ToolUIReceipt } from '../core';

/**
 * 图表系列的 Schema 定义
 */
export const ChartSeriesSchema = z.object({
  key: z.string().min(1),
  label: z.string().min(1),
  color: z.string().optional(),
});

/**
 * 图表系列类型
 * 对应 ChartSeriesSchema 的 TypeScript 类型
 */
export type ChartSeries = z.infer<typeof ChartSeriesSchema>;

/**
 * ChartCssSchema Zod Schema
 */
export const ChartCssSchema = z.object({
  root: z.string().optional(),
  title: z.string().optional(),
  legend: z.string().optional(),
  canvas: z.string().optional(),
});

/**
 * Chart 的 CSS 覆盖类型
 * 对应 ChartCssSchema 的 TypeScript 类型
 */
export type ChartCss = z.infer<typeof ChartCssSchema>;

/**
 * Chart 的可序列化数据 Schema
 * 用于验证从外部传入的数据结构
 */
export const ChartPropsSchema = z
  .object({
    id: ToolUIIdSchema,
    role: ToolUIRoleSchema.optional(),
    receipt: ToolUIReceiptSchema.optional(),
    type: z.enum(['bar', 'line']),
    title: z.string().optional(),
    description: z.string().optional(),
    data: z.array(z.record(z.string(), z.unknown())).min(1),
    xKey: z.string().min(1),
    series: z.array(ChartSeriesSchema).min(1),
    colors: z.array(z.string().min(1)).min(1).optional(),
    showLegend: z.boolean().optional(),
    showGrid: z.boolean().optional(),
    css: ChartCssSchema.optional().default({}),
  })
  .superRefine((value, ctx) => {
    const seenSeriesKeys = new Set<string>();
    value.series.forEach((series, index) => {
      if (seenSeriesKeys.has(series.key)) {
        ctx.addIssue({
          code: 'custom',
          path: ['series', index, 'key'],
          message: `Duplicate series key "${series.key}".`,
        });
        return;
      }
      seenSeriesKeys.add(series.key);
    });

    value.data.forEach((row, rowIndex) => {
      if (!(value.xKey in row)) {
        ctx.addIssue({
          code: 'custom',
          path: ['data', rowIndex, value.xKey],
          message: `Missing xKey "${value.xKey}" in data row.`,
        });
      } else {
        const xVal = row[value.xKey];
        const isValidX = typeof xVal === 'string' || typeof xVal === 'number';
        if (!isValidX) {
          ctx.addIssue({
            code: 'custom',
            path: ['data', rowIndex, value.xKey],
            message: `Expected "${value.xKey}" to be a string or number.`,
          });
        }
      }

      value.series.forEach((series) => {
        if (!(series.key in row)) {
          ctx.addIssue({
            code: 'custom',
            path: ['data', rowIndex, series.key],
            message: `Missing series key "${series.key}" in data row.`,
          });
          return;
        }

        const yVal = row[series.key];
        if (yVal === null) {
          return;
        }
        if (typeof yVal !== 'number' || !Number.isFinite(yVal)) {
          ctx.addIssue({
            code: 'custom',
            path: ['data', rowIndex, series.key],
            message: `Expected "${series.key}" to be a finite number (or null).`,
          });
        }
      });
    });
  });

/**
 * 图表数据点类型
 */
export type ChartDataPoint = {
  seriesKey: string;
  seriesLabel: string;
  xValue: unknown;
  yValue: unknown;
  index: number;
  payload: Record<string, unknown>;
};

/**
 * 图表客户端 Props 类型
 */
export type ChartClientProps = {
  css?: ChartCss;
  onDataPointClick?: (point: ChartDataPoint) => void;
};

/**
 * Chart 组件的 Props 接口
 * 包含所有可配置的属性
 */
export interface ChartProps {
  id: string;
  role?: 'information' | 'decision' | 'control' | 'state' | 'composite';
  receipt?: ToolUIReceipt;
  type: 'bar' | 'line';
  title?: string;
  description?: string;
  // 渲染层宽容:可序列化契约(zod)保持必填,组件 props 可选、缺省渲染空图
  data?: Record<string, unknown>[];
  xKey: string;
  series?: ChartSeries[];
  colors?: string[];
  showLegend?: boolean;
  showGrid?: boolean;
  css?: ChartCss;
  onDataPointClick?: (point: ChartDataPoint) => void;
}

/**
 * Chart 的可序列化数据 Schema（排除 css）
 */
export const SerializableChartSchema = z
  .object({
    id: ToolUIIdSchema,
    role: ToolUIRoleSchema.optional(),
    receipt: ToolUIReceiptSchema.optional(),
    type: z.enum(['bar', 'line']),
    title: z.string().optional(),
    description: z.string().optional(),
    data: z.array(z.record(z.string(), z.unknown())).min(1),
    xKey: z.string().min(1),
    series: z.array(ChartSeriesSchema).min(1),
    colors: z.array(z.string().min(1)).min(1).optional(),
    showLegend: z.boolean().optional(),
    showGrid: z.boolean().optional(),
  })
  .superRefine((value, ctx) => {
    const seenSeriesKeys = new Set<string>();
    value.series.forEach((series, index) => {
      if (seenSeriesKeys.has(series.key)) {
        ctx.addIssue({
          code: 'custom',
          path: ['series', index, 'key'],
          message: `Duplicate series key "${series.key}".`,
        });
        return;
      }
      seenSeriesKeys.add(series.key);
    });

    value.data.forEach((row, rowIndex) => {
      if (!(value.xKey in row)) {
        ctx.addIssue({
          code: 'custom',
          path: ['data', rowIndex, value.xKey],
          message: `Missing xKey "${value.xKey}" in data row.`,
        });
      } else {
        const xVal = row[value.xKey];
        const isValidX = typeof xVal === 'string' || typeof xVal === 'number';
        if (!isValidX) {
          ctx.addIssue({
            code: 'custom',
            path: ['data', rowIndex, value.xKey],
            message: `Expected "${value.xKey}" to be a string or number.`,
          });
        }
      }

      value.series.forEach((series) => {
        if (!(series.key in row)) {
          ctx.addIssue({
            code: 'custom',
            path: ['data', rowIndex, series.key],
            message: `Missing series key "${series.key}" in data row.`,
          });
          return;
        }

        const yVal = row[series.key];
        if (yVal === null) {
          return;
        }
        if (typeof yVal !== 'number' || !Number.isFinite(yVal)) {
          ctx.addIssue({
            code: 'custom',
            path: ['data', rowIndex, series.key],
            message: `Expected "${series.key}" to be a finite number (or null).`,
          });
        }
      });
    });
  });

/**
 * Chart 的可序列化数据类型
 * 对应 SerializableChartSchema 的 TypeScript 类型
 */
export type SerializableChart = z.infer<typeof SerializableChartSchema>;

const SerializableChartSchemaContract = defineToolUiContract(
  'Chart',
  SerializableChartSchema,
);

export const parseSerializableChart =
  SerializableChartSchemaContract.parse;

export const safeParseSerializableChart =
  SerializableChartSchemaContract.safeParse;
