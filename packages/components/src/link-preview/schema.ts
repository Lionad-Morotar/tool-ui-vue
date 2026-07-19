import { z } from 'zod';
import {
/**
 * LinkPreview 组件的数据契约定义
 *
 * 定义了该组件的：
 * - Zod Schema：用于运行时数据验证
 * - TypeScript 类型：用于类型安全
 * - Props 接口：用于组件属性定义
 *
 * @module tool-ui-vue/vtu-components/link-preview/schema
 */
  defineToolUiContract,
  ToolUIIdSchema,
  ToolUIReceiptSchema,
  ToolUIRoleSchema,} from '../core';

/**
 * 宽高比的 Schema 定义
 */
export const AspectRatioSchema = z
  .enum(['auto', '1:1', '4:3', '16:9', '9:16'])
  .default('auto');

/**
 * 宽高比类型
 * 对应 AspectRatioSchema 的 TypeScript 类型
 */
export type AspectRatio = z.infer<typeof AspectRatioSchema>;

/**
 * 媒体适配模式的 Schema 定义
 */
export const MediaFitSchema = z.enum(['cover', 'contain']).default('cover');

/**
 * 媒体适配模式类型
 * 对应 MediaFitSchema 的 TypeScript 类型
 */
export type MediaFit = z.infer<typeof MediaFitSchema>;

/**
 * LinkPreview 的可序列化数据 Schema
 * 用于验证从外部传入的数据结构
 */
export const SerializableLinkPreviewSchema = z.object({
  id: ToolUIIdSchema,
  role: ToolUIRoleSchema.optional(),
  receipt: ToolUIReceiptSchema.optional(),
  href: z.url(),
  title: z.string().optional(),
  description: z.string().optional(),
  image: z.url().optional(),
  domain: z.string().optional(),
  favicon: z.url().optional(),
  ratio: AspectRatioSchema.optional(),
  fit: MediaFitSchema.optional(),
  createdAt: z.iso.datetime().optional(),
  locale: z.string().optional(),
});

/**
 * LinkPreview 的可序列化数据类型
 * 对应 SerializableLinkPreviewSchema 的 TypeScript 类型
 */
export type SerializableLinkPreview = z.infer<
  typeof SerializableLinkPreviewSchema
>;

const SerializableLinkPreviewSchemaContract = defineToolUiContract(
  'LinkPreview',
  SerializableLinkPreviewSchema,
);

export const parseSerializableLinkPreview: (
  input: unknown,
) => SerializableLinkPreview = SerializableLinkPreviewSchemaContract.parse;

export const safeParseSerializableLinkPreview: (
  input: unknown,
) => SerializableLinkPreview | null =
  SerializableLinkPreviewSchemaContract.safeParse;

export const LinkPreviewCssSchema = z.object({
  root: z.string().optional(),
  image: z.string().optional(),
  content: z.string().optional(),
  footer: z.string().optional(),
});

/**
 * LinkPreview Css 类型
 * 对应 LinkPreviewCssSchema 的 TypeScript 类型
 */
export type LinkPreviewCss = z.infer<typeof LinkPreviewCssSchema>;

/**
 * LinkPreview 组件的 Props 接口
 * 包含所有可配置的属性
 */
export interface LinkPreviewProps {
  id: string;
  role?: 'information' | 'decision' | 'control' | 'state' | 'composite';
  receipt?: {
    outcome: 'success' | 'partial' | 'failed' | 'cancelled';
    summary: string;
    identifiers?: Record<string, string>;
    at: string;
  };
  href: string;
  title?: string;
  description?: string;
  image?: string;
  domain?: string;
  favicon?: string;
  ratio?: AspectRatio;
  fit?: MediaFit;
  createdAt?: string;
  locale?: string;
  css?: LinkPreviewCss;
}
