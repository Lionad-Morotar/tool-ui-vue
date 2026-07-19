import { z } from 'zod';
import {
/**
 * Citation 组件的数据契约定义
 *
 * 定义了该组件的：
 * - Zod Schema：用于运行时数据验证
 * - TypeScript 类型：用于类型安全
 * - Props 接口：用于组件属性定义
 *
 * @module tool-ui-vue/vtu-components/citation/schema
 */
  defineToolUiContract,
  ToolUIIdSchema,
  ToolUIReceiptSchema,
  ToolUIRoleSchema,} from '../core';

/**
 * 引用类型的 Schema 定义
 */
export const CitationTypeSchema = z.enum([
  'webpage',
  'document',
  'article',
  'api',
  'code',
  'other',
]);

/**
 * 引用类型
 * 对应 CitationTypeSchema 的 TypeScript 类型
 */
export type CitationType = z.infer<typeof CitationTypeSchema>;

/**
 * 引用变体的 Schema 定义
 */
export const CitationVariantSchema = z.enum(['default', 'inline', 'stacked']);

/**
 * 引用变体类型
 */
export type CitationVariant = 'default' | 'inline' | 'stacked';

/**
 * Citation 的可序列化数据 Schema
 * 用于验证从外部传入的数据结构
 */
export const SerializableCitationSchema = z.object({
  id: ToolUIIdSchema,
  role: ToolUIRoleSchema.optional(),
  receipt: ToolUIReceiptSchema.optional(),
  href: z.url(),
  title: z.string(),
  snippet: z.string().optional(),
  domain: z.string().optional(),
  favicon: z.url().optional(),
  author: z.string().optional(),
  publishedAt: z.iso.datetime().optional(),
  type: CitationTypeSchema.optional(),
  locale: z.string().optional(),
});

/**
 * Citation 的可序列化数据类型
 * 对应 SerializableCitationSchema 的 TypeScript 类型
 */
export interface SerializableCitation {
  id: string;
  role?: 'information' | 'decision' | 'control' | 'state' | 'composite';
  receipt?: {
    outcome: 'success' | 'partial' | 'failed' | 'cancelled';
    summary: string;
    identifiers?: Record<string, string>;
    at: string;
  };
  href: string;
  title: string;
  snippet?: string;
  domain?: string;
  favicon?: string;
  author?: string;
  publishedAt?: string;
  type?: CitationType;
  locale?: string;
}

const SerializableCitationSchemaContract = defineToolUiContract(
  'Citation',
  SerializableCitationSchema as z.ZodType<SerializableCitation>,
);

export const parseSerializableCitation = SerializableCitationSchemaContract.parse as (
  input: unknown,
) => SerializableCitation;

export const safeParseSerializableCitation = SerializableCitationSchemaContract.safeParse as (
  input: unknown,
) => SerializableCitation | null;

export const CitationCssSchema = z.object({
  root: z.string().optional(),
  header: z.string().optional(),
  body: z.string().optional(),
});

export type CitationCss = z.infer<typeof CitationCssSchema>;

export const CitationListCssSchema = z.object({
  root: z.string().optional(),
  item: z.string().optional(),
});

export type CitationListCss = z.infer<typeof CitationListCssSchema>;

/**
 * CitationList 的可序列化数据 Schema
 */
export const SerializableCitationListSchema = z.object({
  id: ToolUIIdSchema,
  citations: z.array(SerializableCitationSchema),
  variant: CitationVariantSchema.optional(),
  maxVisible: z.number().optional(),
  css: CitationListCssSchema.optional(),
});

/**
 * CitationList 的可序列化数据类型
 */
export interface SerializableCitationList {
  id: string;
  citations: SerializableCitation[];
  variant?: CitationVariant;
  maxVisible?: number;
  css?: CitationListCss;
}

const SerializableCitationListSchemaContract = defineToolUiContract(
  'CitationList',
  SerializableCitationListSchema as z.ZodType<SerializableCitationList>,
);

export const parseSerializableCitationList = SerializableCitationListSchemaContract.parse as (
  input: unknown,
) => SerializableCitationList;

export const safeParseSerializableCitationList = SerializableCitationListSchemaContract.safeParse as (
  input: unknown,
) => SerializableCitationList | null;

/**
 * Citation 组件的 Props 接口
 * 包含所有可配置的属性
 */
export interface CitationProps {
  id: string;
  role?: 'information' | 'decision' | 'control' | 'state' | 'composite';
  receipt?: {
    outcome: 'success' | 'partial' | 'failed' | 'cancelled';
    summary: string;
    identifiers?: Record<string, string>;
    at: string;
  };
  href: string;
  title: string;
  snippet?: string;
  domain?: string;
  favicon?: string;
  author?: string;
  publishedAt?: string;
  type?: CitationType;
  locale?: string;
  variant?: CitationVariant;
  css?: CitationCss;
  onNavigate?: (href: string, citation: CitationProps) => void;
}

/**
 * CitationList 组件的 Props 接口
 * 包含所有可配置的属性
 */
export interface CitationListProps {
  id: string;
  citations: SerializableCitation[];
  variant?: CitationVariant;
  maxVisible?: number;
  css?: CitationListCss;
  onNavigate?: (href: string, citation: SerializableCitation) => void;
}
