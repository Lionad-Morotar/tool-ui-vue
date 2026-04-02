/**
 * InstagramPost 组件的数据契约定义
 *
 * 定义了该组件的：
 * - Zod Schema：用于运行时数据验证
 * - TypeScript 类型：用于类型安全
 * - Props 接口：用于组件属性定义
 *
 * @module tool-ui-vue/components/instagram-post/schema
 */
import { z } from "zod";
import { defineToolUiContract } from "../../shared/contract";

/**
 * Instagram 帖子作者的 Schema 定义
 */
export const InstagramPostAuthorSchema = z.object({
  name: z.string(),
  handle: z.string(),
  avatarUrl: z.string(),
  verified: z.boolean().optional(),
});

/**
 * Instagram 帖子媒体的 Schema 定义
 */
export const InstagramPostMediaSchema = z.object({
  type: z.enum(["image", "video"]),
  url: z.string(),
  alt: z.string(),
});

/**
 * Instagram 帖子统计的 Schema 定义
 */
export const InstagramPostStatsSchema = z.object({
  likes: z.number().optional(),
  isLiked: z.boolean().optional(),
});

/**
 * Instagram 帖子作者类型
 */
export interface InstagramPostAuthor {
  name: string;
  handle: string;
  avatarUrl: string;
  verified?: boolean;
}

/**
 * Instagram 帖子媒体类型
 */
export interface InstagramPostMedia {
  type: "image" | "video";
  url: string;
  alt: string;
}

/**
 * Instagram 帖子统计类型
 */
export interface InstagramPostStats {
  likes?: number;
  isLiked?: boolean;
}

/**
 * Instagram 帖子数据类型
 */
export interface InstagramPostData {
  id: string;
  author: InstagramPostAuthor;
  text?: string;
  media?: InstagramPostMedia[];
  stats?: InstagramPostStats;
  createdAt?: string;
}

/**
 * InstagramPost 的可序列化数据 Schema
 * 用于验证从外部传入的数据结构
 */
export const SerializableInstagramPostSchema: z.ZodType<InstagramPostData> =
  z.object({
    id: z.string(),
    author: InstagramPostAuthorSchema,
    text: z.string().optional(),
    media: z.array(InstagramPostMediaSchema).optional(),
    stats: InstagramPostStatsSchema.optional(),
    createdAt: z.string().optional(),
  });

const SerializableInstagramPostSchemaContract = defineToolUiContract(
  "InstagramPost",
  SerializableInstagramPostSchema,
);

export const parseSerializableInstagramPost: (
  input: unknown,
) => InstagramPostData = SerializableInstagramPostSchemaContract.parse;

export const safeParseSerializableInstagramPost: (
  input: unknown,
) => InstagramPostData | null =
  SerializableInstagramPostSchemaContract.safeParse;

/**
 * InstagramPost 组件的 Props 接口
 * 包含所有可配置的属性
 */
export interface InstagramPostProps {
  post: InstagramPostData;
  className?: string;
  onAction?: (action: string, post: InstagramPostData) => void;
}
