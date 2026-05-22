/**
 * Article 组件的数据契约定义
 *
 * @module tool-ui-vue/vtu-components/article/schema
 */

import { defineToolUiContract, ToolUIIdSchema, ToolUIRoleSchema, ToolUIReceiptSchema } from '../core';
import { z } from 'zod';

/**
 * 文章内容类型 Schema
 */
export const ArticleTypeSchema = z.enum(['md', 'html']);

/**
 * Header 背景花纹类型 Schema
 */
export const HeaderPatternSchema = z.enum(['none', 'dots', 'diagonal']);

/**
 * 文章内容类型
 */
export type ArticleType = z.infer<typeof ArticleTypeSchema>;

/**
 * Header 背景花纹类型
 */
export type HeaderPattern = z.infer<typeof HeaderPatternSchema>;

/**
 * Article 的可序列化数据 Schema
 */
export const SerializableArticleSchema = z.object({
  id: ToolUIIdSchema,
  role: ToolUIRoleSchema.optional(),
  receipt: ToolUIReceiptSchema.optional(),
  type: ArticleTypeSchema,
  content: z.string().min(1),
  title: z.string().optional(),
  description: z.string().optional(),
  author: z.object({
    name: z.string().min(1),
    avatarUrl: z.string().optional(),
  }).optional(),
  coverImage: z.string().optional(),
  tags: z.array(z.string()).optional(),
  rate: z.number().optional(),
  createdAt: z.iso.datetime().optional(),
  updatedAt: z.iso.datetime().optional(),
  source: z.string().optional(),
  readingTime: z.number().optional(),
  wordCount: z.number().optional(),
  maxHeight: z.string().optional(),
  locale: z.string().optional(),
  headerPattern: HeaderPatternSchema.optional(),
});

/**
 * Article 的可序列化数据类型
 */
export type SerializableArticle = z.infer<typeof SerializableArticleSchema>;

const SerializableArticleSchemaContract = defineToolUiContract(
  'Article',
  SerializableArticleSchema as z.ZodType<SerializableArticle>,
);

export const parseSerializableArticle = SerializableArticleSchemaContract.parse as (
  input: unknown,
) => SerializableArticle;

export const safeParseSerializableArticle = SerializableArticleSchemaContract.safeParse as (
  input: unknown,
) => SerializableArticle | null;

/**
 * Article CSS 覆盖 Schema
 */
export const ArticleCssSchema = z.object({
  root: z.string().optional(),
  cover: z.string().optional(),
  header: z.string().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  meta: z.string().optional(),
  tags: z.string().optional(),
  body: z.string().optional(),
  footer: z.string().optional(),
  expandButton: z.string().optional(),
});

/**
 * Article CSS 覆盖类型
 */
export type ArticleCss = z.infer<typeof ArticleCssSchema>;

/**
 * Article 组件的 Props 接口
 */
export interface ArticleProps {
  id: string;
  role?: 'information' | 'decision' | 'control' | 'state' | 'composite';
  receipt?: {
    outcome: 'success' | 'partial' | 'failed' | 'cancelled';
    summary: string;
    identifiers?: Record<string, string>;
    at: string;
  };
  type: ArticleType;
  content: string;
  title?: string;
  description?: string;
  author?: { name: string; avatarUrl?: string };
  coverImage?: string;
  tags?: string[];
  rate?: number;
  createdAt?: string;
  updatedAt?: string;
  source?: string;
  readingTime?: number;
  wordCount?: number;
  maxHeight?: string;
  locale?: string;
  headerPattern?: HeaderPattern;
  css?: ArticleCss;
  onLinkClick?: (href: string) => void;
}
