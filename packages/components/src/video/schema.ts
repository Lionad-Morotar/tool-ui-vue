/**
 * Video — 视频播放
 *
 * 本文件定义了 Video 组件的数据契约（Contract）：
 * - Zod Schema：运行时数据校验
 * - TypeScript 类型推导
 * - Vue Props 接口
 *
 * @module tool-ui-vue/vtu-components/video/schema
 */

import { defineToolUiContract,
  ToolUIIdSchema,
  ToolUIReceiptSchema,
  ToolUIRoleSchema } from '../core';
import { z } from 'zod';

export const AspectRatioSchema = z
  .enum(['auto', '1:1', '4:3', '16:9', '9:16'])
  .default('auto');

export type AspectRatio = z.infer<typeof AspectRatioSchema>;

/** MediaFitSchema Zod Schema */
export const MediaFitSchema = z.enum(['cover', 'contain']).default('cover');

export type MediaFit = z.infer<typeof MediaFitSchema>;

/** SourceSchema Zod Schema */
export const SourceSchema = z.object({
  label: z.string(),
  iconUrl: z.url().optional(),
  url: z.url().optional(),
});

export type Source = z.infer<typeof SourceSchema>;

export const VideoCssSchema = z.object({
  root: z.string().optional(),
  player: z.string().optional(),
  controls: z.string().optional(),
  source: z.string().optional(),
});

export type VideoCss = z.infer<typeof VideoCssSchema>;

/** SerializableVideoSchema 的可序列化 Zod Schema */
export const SerializableVideoSchema = z.object({
  id: ToolUIIdSchema,
  role: ToolUIRoleSchema.optional(),
  receipt: ToolUIReceiptSchema.optional(),
  assetId: z.string(),
  src: z.url(),
  poster: z.url().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  href: z.url().optional(),
  domain: z.string().optional(),
  durationMs: z.int().positive().optional(),
  ratio: AspectRatioSchema.optional(),
  fit: MediaFitSchema.optional(),
  createdAt: z.iso.datetime().optional(),
  locale: z.string().optional(),
  source: SourceSchema.optional(),
});

/** SerializableVideo 类型，由 Zod Schema 推导 */
export type SerializableVideo = z.infer<typeof SerializableVideoSchema>;

const SerializableVideoSchemaContract = defineToolUiContract(
  'Video',
  SerializableVideoSchema,
);

export const parseSerializableVideo: (input: unknown) => SerializableVideo =
  SerializableVideoSchemaContract.parse;

export const safeParseSerializableVideo: (
  input: unknown,
) => SerializableVideo | null = SerializableVideoSchemaContract.safeParse;

/** VideoProps 组件属性接口 */
export interface VideoProps {
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
  poster?: string;
  title?: string;
  description?: string;
  href?: string;
  domain?: string;
  durationMs?: number;
  ratio?: AspectRatio;
  fit?: MediaFit;
  createdAt?: string;
  locale?: string;
  source?: Source;
  css?: VideoCss;
  autoPlay?: boolean;
}
