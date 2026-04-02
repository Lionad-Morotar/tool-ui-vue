/**
 * Citation 组件的数据契约定义
 *
 * 定义了该组件的：
 * - Zod Schema：用于运行时数据验证
 * - TypeScript 类型：用于类型安全
 * - Props 接口：用于组件属性定义
 *
 * @module tool-ui-vue/components/citation/schema
 */
import { z } from 'zod';
import { defineToolUiContract } from '../../shared/contract';
import {
  ToolUIIdSchema,
  ToolUIReceiptSchema,
  ToolUIRoleSchema,
} from '../../shared/schema';

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
  href: z.string().url(),
  title: z.string(),
  snippet: z.string().optional(),
  domain: z.string().optional(),
  favicon: z.string().url().optional(),
  author: z.string().optional(),
  publishedAt: z.string().datetime().optional(),
  type: CitationTypeSchema.optional(),
  locale: z.string().optional(),
});

/**
 * Citation 的可序列化数据类型
 * 对应 SerializableCitationSchema 的 TypeScript 类型
 */
export type SerializableCitation = z.infer<typeof SerializableCitationSchema>;

const SerializableCitationSchemaContract = defineToolUiContract(
  'Citation',
  SerializableCitationSchema,
);

export const parseSerializableCitation: (
  input: unknown,
) => SerializableCitation = SerializableCitationSchemaContract.parse;

export const safeParseSerializableCitation: (
  input: unknown,
) => SerializableCitation | null = SerializableCitationSchemaContract.safeParse;

export const CitationCssSchema = z.object({
  root: z.string().optional(),
  header: z.string().optional(),
  body: z.string().optional(),
  footer: z.string().optional(),
});

export const CitationListCssSchema = z.object({
  root: z.string().optional(),
  item: z.string().optional(),
});

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
  css?: { root?: string; header?: string; body?: string; footer?: string };
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
  css?: { root?: string; item?: string };
  onNavigate?: (href: string, citation: SerializableCitation) => void;
}
