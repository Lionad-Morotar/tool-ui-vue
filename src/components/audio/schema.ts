/**
 * Audio 组件的数据契约定义
 *
 * 定义了该组件的：
 * - Zod Schema：用于运行时数据验证
 * - TypeScript 类型：用于类型安全
 * - Props 接口：用于组件属性定义
 *
 * @module tool-ui-vue/components/audio/schema
 */
import { z } from 'zod';
import { defineToolUiContract } from '../../shared/contract';
import {
  ToolUIIdSchema,
  ToolUIReceiptSchema,
  ToolUIRoleSchema,
} from '../../shared/schema';

/**
 * 音频来源的 Schema 定义
 */
export const SourceSchema = z.object({
  label: z.string(),
  iconUrl: z.string().url().optional(),
  url: z.string().url().optional(),
});

/**
 * 音频来源类型
 * 对应 SourceSchema 的 TypeScript 类型
 */
export type Source = z.infer<typeof SourceSchema>;

/**
 * Audio 的可序列化数据 Schema
 * 用于验证从外部传入的数据结构
 */
export const SerializableAudioSchema = z.object({
  id: ToolUIIdSchema,
  role: ToolUIRoleSchema.optional(),
  receipt: ToolUIReceiptSchema.optional(),
  assetId: z.string(),
  src: z.string().url(),
  title: z.string().optional(),
  description: z.string().optional(),
  artwork: z.string().url().optional(),
  durationMs: z.number().int().positive().optional(),
  fileSizeBytes: z.number().int().positive().optional(),
  createdAt: z.string().datetime().optional(),
  locale: z.string().optional(),
  source: SourceSchema.optional(),
});

/**
 * Audio 的可序列化数据类型
 * 对应 SerializableAudioSchema 的 TypeScript 类型
 */
export type SerializableAudio = z.infer<typeof SerializableAudioSchema>;

const SerializableAudioSchemaContract = defineToolUiContract(
  'Audio',
  SerializableAudioSchema,
);

export const parseSerializableAudio: (input: unknown) => SerializableAudio =
  SerializableAudioSchemaContract.parse;

export const safeParseSerializableAudio: (
  input: unknown,
) => SerializableAudio | null = SerializableAudioSchemaContract.safeParse;

/**
 * Audio 组件的变体类型
 */
export type AudioVariant = 'full' | 'compact';

export const AudioCssSchema = z.object({
  root: z.string().optional(),
  header: z.string().optional(),
  artwork: z.string().optional(),
  controls: z.string().optional(),
  source: z.string().optional(),
});

/**
 * Audio 组件的 Props 接口
 * 包含所有可配置的属性
 */
export interface AudioProps {
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
  title?: string;
  description?: string;
  artwork?: string;
  durationMs?: number;
  fileSizeBytes?: number;
  createdAt?: string;
  locale?: string;
  source?: Source;
  css?: { root?: string; header?: string; artwork?: string; controls?: string; source?: string };
  variant?: AudioVariant;
}
