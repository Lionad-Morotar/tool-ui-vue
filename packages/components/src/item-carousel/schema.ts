/**
 * ItemCarousel 组件的数据契约定义
 *
 * 定义了该组件的：
 * - Zod Schema：用于运行时数据验证
 * - TypeScript 类型：用于类型安全
 * - Props 接口：用于组件属性定义
 *
 * @module tool-ui-vue/components/item-carousel/schema
 */
import { defineToolUiContract, ActionSchema, SerializableActionSchema, ToolUIIdSchema, type Action } from '@lionad/core';
import { z } from 'zod';

/**
 * 轮播项的 Schema 定义
 */
export const ItemSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  subtitle: z.string().optional(),
  image: z.url().optional(),
  color: z.string().optional(),
  actions: z.array(ActionSchema).optional(),
});

/**
 * ItemCarouselCssSchema Zod Schema
 */
export const ItemCarouselCssSchema = z.object({
  root: z.string().optional(),
  title: z.string().optional(),
  card: z.string().optional(),
  actions: z.string().optional(),
});

/**
 * 轮播组件 Props 的 Schema 定义
 */
export const ItemCarouselPropsSchema = z.object({
  id: ToolUIIdSchema,
  title: z.string().optional(),
  description: z.string().optional(),
  items: z.array(ItemSchema),
  css: ItemCarouselCssSchema.optional().default({}),
});

/**
 * 轮播项类型
 */
export interface Item {
  id: string;
  name: string;
  subtitle?: string;
  image?: string;
  color?: string;
  actions?: Action[];
}

/**
 * ItemCarousel 组件的 Props 接口
 * 包含所有可配置的属性
 */
export interface ItemCarouselProps {
  id: string;
  title?: string;
  description?: string;
  items: Item[];
  css?: { root?: string; title?: string; card?: string; actions?: string };
  onItemClick?: (itemId: string) => void;
  onItemAction?: (itemId: string, actionId: string) => void;
}

/**
 * 可序列化轮播项的 Schema 定义
 */
export const SerializableItemSchema = ItemSchema.extend({
  actions: z.array(SerializableActionSchema).optional(),
});

/**
 * ItemCarousel 的可序列化数据 Schema
 * 用于验证从外部传入的数据结构
 */
export const SerializableItemCarouselSchema = ItemCarouselPropsSchema.omit({
  css: true,
})
  .extend({
    items: z.array(SerializableItemSchema),
  })
  .superRefine((payload, ctx) => {
    const seenItemIds = new Map<string, number>();

    payload.items.forEach((item, index) => {
      const firstSeenAt = seenItemIds.get(item.id);
      if (firstSeenAt !== undefined) {
        ctx.addIssue({
          code: "custom",
          path: ['items', index, 'id'],
          message: `duplicate item id '${item.id}' (first seen at index ${firstSeenAt})`,
        });
        return;
      }
      seenItemIds.set(item.id, index);
    });
  });

/**
 * 可序列化轮播项类型
 * 对应 SerializableItemSchema 的 TypeScript 类型
 */
export type SerializableItem = z.infer<typeof SerializableItemSchema>;

/**
 * ItemCarousel 的可序列化数据类型
 * 对应 SerializableItemCarouselSchema 的 TypeScript 类型
 */

export type SerializableItemCarousel = z.infer<
  typeof SerializableItemCarouselSchema
>;

const SerializableItemCarouselSchemaContract = defineToolUiContract(
  'ItemCarousel',
  SerializableItemCarouselSchema,
);

export const parseSerializableItemCarousel: (
  input: unknown,
) => SerializableItemCarousel = SerializableItemCarouselSchemaContract.parse;

export const safeParseSerializableItemCarousel: (
  input: unknown,
) => SerializableItemCarousel | null =
  SerializableItemCarouselSchemaContract.safeParse;
