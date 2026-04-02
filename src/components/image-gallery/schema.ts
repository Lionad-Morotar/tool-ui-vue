/**
 * ImageGallery 组件的数据契约定义
 *
 * 定义了该组件的：
 * - Zod Schema：用于运行时数据验证
 * - TypeScript 类型：用于类型安全
 * - Props 接口：用于组件属性定义
 *
 * @module tool-ui-vue/components/image-gallery/schema
 */
import { z } from "zod";
import { defineToolUiContract } from "../../shared/contract";
import {
  ToolUIIdSchema,
  ToolUIReceiptSchema,
  ToolUIRoleSchema,
} from "../../shared/schema";

/**
 * 图片画廊来源的 Schema 定义
 */
export const ImageGallerySourceSchema = z.object({
  label: z.string(),
  url: z.string().url().optional(),
});

/**
 * 图片画廊来源类型
 * 对应 ImageGallerySourceSchema 的 TypeScript 类型
 */
export type ImageGallerySource = z.infer<typeof ImageGallerySourceSchema>;

/**
 * 图片画廊项的 Schema 定义
 */
export const ImageGalleryItemSchema = z.object({
  id: z.string().min(1),
  src: z.string().url(),
  alt: z.string().min(1, "Images require alt text for accessibility"),
  width: z.number().positive(),
  height: z.number().positive(),
  title: z.string().optional(),
  caption: z.string().optional(),
  source: ImageGallerySourceSchema.optional(),
});

/**
 * 图片画廊项类型
 * 对应 ImageGalleryItemSchema 的 TypeScript 类型
 */
export type ImageGalleryItem = z.infer<typeof ImageGalleryItemSchema>;

/**
 * ImageGallery 的可序列化数据 Schema
 * 用于验证从外部传入的数据结构
 */
export const SerializableImageGallerySchema = z.object({
  id: ToolUIIdSchema,
  role: ToolUIRoleSchema.optional(),
  receipt: ToolUIReceiptSchema.optional(),
  images: z.array(ImageGalleryItemSchema).min(1),
  title: z.string().optional(),
  description: z.string().optional(),
});

/**
 * ImageGallery 的可序列化数据类型
 * 对应 SerializableImageGallerySchema 的 TypeScript 类型
 */
export type SerializableImageGallery = z.infer<
  typeof SerializableImageGallerySchema
>;

/**
 * ImageGallery 组件的 Props 接口
 * 包含所有可配置的属性
 */
export interface ImageGalleryProps {
  id: string;
  role?: "information" | "decision" | "control" | "state" | "composite";
  receipt?: import("../../shared/schema").ToolUIReceipt;
  images: ImageGalleryItem[];
  title?: string;
  description?: string;
  className?: string;
  onImageClick?: (imageId: string, image: ImageGalleryItem) => void;
}

const SerializableImageGallerySchemaContract = defineToolUiContract(
  "ImageGallery",
  SerializableImageGallerySchema,
);

export const parseSerializableImageGallery: (
  input: unknown,
) => SerializableImageGallery = SerializableImageGallerySchemaContract.parse;

export const safeParseSerializableImageGallery: (
  input: unknown,
) => SerializableImageGallery | null =
  SerializableImageGallerySchemaContract.safeParse;
