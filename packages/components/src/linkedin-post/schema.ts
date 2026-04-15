/**
 * LinkedInPost 组件的数据契约定义
 *
 * 定义了该组件的：
 * - Zod Schema：用于运行时数据验证
 * - TypeScript 类型：用于类型安全
 * - Props 接口：用于组件属性定义
 *
 * @module tool-ui-vue/vtu-components/linkedin-post/schema
 */
import { defineToolUiContract } from '@lionad/vtu-core';
import { z } from 'zod';

/**
 * LinkedIn 帖子作者的 Schema 定义
 */
export const LinkedInPostAuthorSchema = z.object({
  name: z.string(),
  handle: z.string().optional(),
  avatarUrl: z.string(),
  headline: z.string().optional(),
});

/**
 * LinkedIn 帖子媒体的 Schema 定义
 */
export const LinkedInPostMediaSchema = z.object({
  type: z.enum(['image', 'video']),
  url: z.string(),
  alt: z.string(),
});

/**
 * LinkedIn 帖子链接预览的 Schema 定义
 */
export const LinkedInPostLinkPreviewSchema = z.object({
  url: z.string(),
  title: z.string().optional(),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
  domain: z.string().optional(),
});

/**
 * LinkedIn 帖子统计的 Schema 定义
 */
export const LinkedInPostStatsSchema = z.object({
  likes: z.number().optional(),
  isLiked: z.boolean().optional(),
});

/**
 * LinkedInPost 的可序列化数据 Schema
 * 用于验证从外部传入的数据结构
 */
export const SerializableLinkedInPostSchema = z.object({
  id: z.string(),
  author: LinkedInPostAuthorSchema,
  text: z.string().optional(),
  media: LinkedInPostMediaSchema.optional(),
  linkPreview: LinkedInPostLinkPreviewSchema.optional(),
  stats: LinkedInPostStatsSchema.optional(),
  createdAt: z.string().optional(),
});

/**
 * LinkedIn 帖子数据类型
 * 对应 SerializableLinkedInPostSchema 的 TypeScript 类型
 */
export type LinkedInPostData = z.infer<typeof SerializableLinkedInPostSchema>;

/**
 * LinkedIn 帖子作者类型
 * 对应 LinkedInPostAuthorSchema 的 TypeScript 类型
 */
export type LinkedInPostAuthor = z.infer<typeof LinkedInPostAuthorSchema>;

/**
 * LinkedIn 帖子媒体类型
 * 对应 LinkedInPostMediaSchema 的 TypeScript 类型
 */
export type LinkedInPostMedia = z.infer<typeof LinkedInPostMediaSchema>;

/**
 * LinkedIn 帖子链接预览类型
 * 对应 LinkedInPostLinkPreviewSchema 的 TypeScript 类型
 */
export type LinkedInPostLinkPreview = z.infer<
  typeof LinkedInPostLinkPreviewSchema
>;

/**
 * LinkedIn 帖子统计类型
 * 对应 LinkedInPostStatsSchema 的 TypeScript 类型
 */
export type LinkedInPostStats = z.infer<typeof LinkedInPostStatsSchema>;

const SerializableLinkedInPostSchemaContract = defineToolUiContract(
  'LinkedInPost',
  SerializableLinkedInPostSchema,
);

export const parseSerializableLinkedInPost: (
  input: unknown,
) => LinkedInPostData = SerializableLinkedInPostSchemaContract.parse;

export const safeParseSerializableLinkedInPost: (
  input: unknown,
) => LinkedInPostData | null = SerializableLinkedInPostSchemaContract.safeParse;

export const LinkedInPostCssSchema = z.object({
  root: z.string().optional(),
  header: z.string().optional(),
  content: z.string().optional(),
  actions: z.string().optional(),
});

export type LinkedInPostCss = z.infer<typeof LinkedInPostCssSchema>;

/**
 * LinkedInPost 组件的 Props 接口
 * 包含所有可配置的属性
 */
export interface LinkedInPostProps {
  post: LinkedInPostData;
  css?: LinkedInPostCss;
  onAction?: (action: string, post: LinkedInPostData) => void;
}
