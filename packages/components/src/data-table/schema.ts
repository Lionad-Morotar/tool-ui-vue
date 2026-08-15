/**
 * DataTable 组件的数据契约定义
 *
 * 定义了该组件的：
 * - Zod Schema：用于运行时数据验证
 * - TypeScript 类型：用于类型安全
 * - Props 接口：用于组件属性定义
 *
 * @module tool-ui-vue/vtu-components/data-table/schema
 */
import { z } from 'zod';
import { defineToolUiContract, ToolUIIdSchema, ToolUIReceiptSchema, ToolUIRoleSchema, type ToolUIReceipt } from '../core';

const AlignEnum = z.enum(['left', 'right', 'center']);
const PriorityEnum = z.enum(['primary', 'secondary', 'tertiary']);

const formatSchema = z.discriminatedUnion('kind', [
  z.object({ kind: z.literal('text') }),
  z.object({
    kind: z.literal('number'),
    decimals: z.number().optional(),
    unit: z.string().optional(),
    compact: z.boolean().optional(),
    showSign: z.boolean().optional(),
  }),
  z.object({
    kind: z.literal('currency'),
    currency: z.string(),
    decimals: z.number().optional(),
  }),
  z.object({
    kind: z.literal('percent'),
    decimals: z.number().optional(),
    showSign: z.boolean().optional(),
    basis: z.enum(['fraction', 'unit']).optional(),
  }),
  z.object({
    kind: z.literal('date'),
    dateFormat: z.enum(['short', 'long', 'relative']).optional(),
  }),
  z.object({
    kind: z.literal('delta'),
    decimals: z.number().optional(),
    upIsPositive: z.boolean().optional(),
    showSign: z.boolean().optional(),
  }),
  z.object({
    kind: z.literal('status'),
    statusMap: z.record(
      z.string(),
      z.object({
        tone: z.enum(['success', 'warning', 'danger', 'info', 'neutral']),
        label: z.string().optional(),
      }),
    ),
  }),
  z.object({
    kind: z.literal('boolean'),
    labels: z
      .object({
        true: z.string(),
        false: z.string(),
      })
      .optional(),
  }),
  z.object({
    kind: z.literal('link'),
    hrefKey: z.string().optional(),
    external: z.boolean().optional(),
  }),
  z.object({
    kind: z.literal('badge'),
    colorMap: z
      .record(
        z.string(),
        z.enum(['success', 'warning', 'danger', 'info', 'neutral']),
      )
      .optional(),
  }),
  z.object({
    kind: z.literal('array'),
    maxVisible: z.number().optional(),
  }),
]);

/**
 * 可序列化列定义的 Schema
 */
export const serializableColumnSchema = z.object({
  key: z.string(),
  label: z.string(),
  abbr: z.string().optional(),
  sortable: z.boolean().optional(),
  align: AlignEnum.optional(),
  width: z.string().optional(),
  truncate: z.boolean().optional(),
  priority: PriorityEnum.optional(),
  hideOnMobile: z.boolean().optional(),
  format: formatSchema.optional(),
});

/**
 * 列定义类型
 * 对应 serializableColumnSchema 的 TypeScript 类型
 */
export type Column = z.infer<typeof serializableColumnSchema>;

const JsonPrimitiveSchema = z.union([
  z.string(),
  z.number(),
  z.boolean(),
  z.null(),
]);

/**
 * 可序列化数据行的 Schema
 */
export const serializableDataSchema = z.record(
  z.string(),
  z.union([JsonPrimitiveSchema, z.array(JsonPrimitiveSchema)]),
);

/**
 * 行数据类型
 * 对应 serializableDataSchema 的 TypeScript 类型
 */
export type RowData = z.infer<typeof serializableDataSchema>;

/**
 * DataTable 的可序列化数据 Schema
 * 用于验证从外部传入的数据结构
 */
export const SerializableDataTableSchema = z.object({
  id: ToolUIIdSchema,
  role: ToolUIRoleSchema.optional(),
  receipt: ToolUIReceiptSchema.optional(),
  columns: z.array(serializableColumnSchema),
  data: z.array(serializableDataSchema),
  rowIdKey: z.string().optional(),
  defaultSort: z
    .object({
      by: z.string().optional(),
      direction: z.enum(['asc', 'desc']).optional(),
    })
    .optional(),
  sort: z
    .object({
      by: z.string().optional(),
      direction: z.enum(['asc', 'desc']).optional(),
    })
    .optional(),
  emptyMessage: z.string().optional(),
  maxHeight: z.string().optional(),
  locale: z.string().optional(),
  layout: z.enum(['auto', 'table', 'cards']).optional(),
});

const SerializableDataTableSchemaContract = defineToolUiContract(
  'DataTable',
  SerializableDataTableSchema,
);

/**
 * DataTable 的可序列化数据类型
 * 对应 SerializableDataTableSchema 的 TypeScript 类型
 */
export type SerializableDataTable = z.infer<typeof SerializableDataTableSchema>;

export function parseSerializableDataTable(
  input: unknown,
): SerializableDataTable {
  return SerializableDataTableSchemaContract.parse(input);
}

export function safeParseSerializableDataTable(
  input: unknown,
): SerializableDataTable | null {
  return SerializableDataTableSchemaContract.safeParse(input);
}

/**
 * DataTableCssSchema Zod Schema
 */
export const DataTableCssSchema = z.object({
  root: z.string().optional(),
  header: z.string().optional(),
  body: z.string().optional(),
  row: z.string().optional(),
});

/**
 * DataTable 的 CSS 覆盖类型
 */
export type DataTableCss = z.infer<typeof DataTableCssSchema>;

/**
 * DataTable 组件的 Props 接口
 * 包含所有可配置的属性
 */

export interface DataTableProps {
  id: string;
  role?: 'information' | 'decision' | 'control' | 'state' | 'composite';
  receipt?: ToolUIReceipt;
  // 渲染层宽容:可序列化契约(zod)保持必填,组件 props 可选、缺省渲染空表
  columns?: Column[];
  data?: RowData[];
  rowIdKey?: string;
  defaultSort?: { by?: string; direction?: 'asc' | 'desc' };
  sort?: { by?: string; direction?: 'asc' | 'desc' };
  emptyMessage?: string;
  maxHeight?: string;
  locale?: string;
  css?: DataTableCss;
  layout?: 'auto' | 'table' | 'cards';
  onSortChange?: (sort: { by?: string; direction?: 'asc' | 'desc' }) => void;
}
