import {
/**
 * Image 组件的数据契约定义
 *
 * 定义了该组件的：
 * - Zod Schema：用于运行时数据验证
 * - TypeScript 类型：用于类型安全
 * - Props 接口：用于组件属性定义
 *
 * @module tool-ui-vue/components/image/schema
 */
  defineToolUiContract,
  ToolUIIdSchema,
  ToolUIReceiptSchema,
  ToolUIRoleSchema,} from '@lionad/core';
import { z } from 'zod';

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
 * 图片来源的 Schema 定义
 */
export const SourceSchema = z.object({
  label: z.string(),
  iconUrl: z.string().url().optional(),
  url: z.string().url().optional(),
});

/**
 * 图片来源类型
 * 对应 SourceSchema 的 TypeScript 类型
 */
export type Source = z.infer<typeof SourceSchema>;

/**
 * Image 的可序列化数据 Schema
 * 用于验证从外部传入的数据结构
 */
export const SerializableImageSchema = z.object({
  id: ToolUIIdSchema,
  role: ToolUIRoleSchema.optional(),
  receipt: ToolUIReceiptSchema.optional(),
  assetId: z.string(),
  src: z.string().url(),
  alt: z.string().min(1, 'Images require alt text for accessibility'),
  title: z.string().optional(),
  description: z.string().optional(),
  href: z.string().url().optional(),
  domain: z.string().optional(),
  ratio: AspectRatioSchema.optional(),
  fit: MediaFitSchema.optional(),
  fileSizeBytes: z.number().int().positive().optional(),
  createdAt: z.string().datetime().optional(),
  locale: z.string().optional(),
  source: SourceSchema.optional(),
});

/**
 * Image 的可序列化数据类型
 * 对应 SerializableImageSchema 的 TypeScript 类型
 */
export type SerializableImage = z.infer<typeof SerializableImageSchema>;

const SerializableImageSchemaContract = defineToolUiContract(
  'Image',
  SerializableImageSchema,
);

export const parseSerializableImage: (input: unknown) => SerializableImage =
  SerializableImageSchemaContract.parse;

export const safeParseSerializableImage: (
  input: unknown,
) => SerializableImage | null = SerializableImageSchemaContract.safeParse;

export const ImageCssSchema = z.object({
  root: z.string().optional(),
  image: z.string().optional(),
  caption: z.string().optional(),
  source: z.string().optional(),
});

/**
 * Image 组件的 Props 接口
 * 包含所有可配置的属性
 */
export interface ImageProps {
  id: string;
  role?: 'information' | 'decision' | 'control' | 'state' | 'composite';
  receipt?: {
    outcome: 'success' | 'partial' | 'failed' | 'cancelled';
    summary: string;
    identifiers?: Record<string, string>;
    at: string;
  };
  assetId: string;
  src: string;
  alt: string;
  title?: string;
  description?: string;
  href?: string;
  domain?: string;
  ratio?: AspectRatio;
  fit?: MediaFit;
  fileSizeBytes?: number;
  createdAt?: string;
  locale?: string;
  source?: Source;
  css?: { root?: string; image?: string; caption?: string; source?: string };
}
