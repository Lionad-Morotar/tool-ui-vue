/**
 * XPost — X/Twitter 帖子展示
 *
 * 本文件定义了 XPost 组件的数据契约（Contract）：
 * - Zod Schema：运行时数据校验
 * - TypeScript 类型推导
 * - Vue Props 接口
 *
 * @module tool-ui-vue/components/x-post/schema
 */

import { z } from "zod";
import { defineToolUiContract } from "../../shared/contract";

/** XPostAuthorSchema Zod Schema */
export const XPostAuthorSchema = z.object({
  name: z.string(),
  handle: z.string(),
  avatarUrl: z.string().url(),
  verified: z.boolean().optional(),
});

/** XPostMediaSchema Zod Schema */
export const XPostMediaSchema = z.object({
  type: z.enum(["image", "video"]),
  url: z.string().url(),
  alt: z.string(),
  aspectRatio: z.enum(["1:1", "4:3", "16:9", "9:16"]).optional(),
});

/** XPostLinkPreviewSchema Zod Schema */
export const XPostLinkPreviewSchema = z.object({
  url: z.string().url(),
  title: z.string().optional(),
  description: z.string().optional(),
  imageUrl: z.string().url().optional(),
  domain: z.string().optional(),
});

/** XPostStatsSchema Zod Schema */
export const XPostStatsSchema = z.object({
  likes: z.number().optional(),
  isLiked: z.boolean().optional(),
  isReposted: z.boolean().optional(),
  isBookmarked: z.boolean().optional(),
});

export interface XPostAuthor {
  name: string;
  handle: string;
  avatarUrl: string;
  verified?: boolean;
}

export interface XPostMedia {
  type: "image" | "video";
  url: string;
  alt: string;
  aspectRatio?: "1:1" | "4:3" | "16:9" | "9:16";
}

export interface XPostLinkPreview {
  url: string;
  title?: string;
  description?: string;
  imageUrl?: string;
  domain?: string;
}

export interface XPostStats {
  likes?: number;
  isLiked?: boolean;
  isReposted?: boolean;
  isBookmarked?: boolean;
}

export interface XPostData {
  id: string;
  author: XPostAuthor;
  text?: string;
  media?: XPostMedia;
  linkPreview?: XPostLinkPreview;
  quotedPost?: XPostData;
  stats?: XPostStats;
  createdAt?: string;
}

export const SerializableXPostSchema: z.ZodType<XPostData> = z.object({
  id: z.string(),
  author: XPostAuthorSchema,
  text: z.string().optional(),
  media: XPostMediaSchema.optional(),
  linkPreview: XPostLinkPreviewSchema.optional(),
  quotedPost: z.lazy(() => SerializableXPostSchema).optional(),
  stats: XPostStatsSchema.optional(),
  createdAt: z.string().optional(),
});

const SerializableXPostSchemaContract = defineToolUiContract(
  "XPost",
  SerializableXPostSchema,
);

export const parseSerializableXPost: (input: unknown) => XPostData =
  SerializableXPostSchemaContract.parse;

export const safeParseSerializableXPost: (input: unknown) => XPostData | null =
  SerializableXPostSchemaContract.safeParse;

/** XPostProps 组件属性接口 */
export interface XPostProps {
  post: XPostData;
  className?: string;
  onAction?: (action: string, post: XPostData) => void;
}
