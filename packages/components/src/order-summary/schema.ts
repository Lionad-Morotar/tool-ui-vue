/**
 * OrderSummary 组件的数据契约定义
 *
 * 定义了该组件的：
 * - Zod Schema：用于运行时数据验证
 * - TypeScript 类型：用于类型安全
 * - Props 接口：用于组件属性定义
 *
 * @module tool-ui-vue/vtu-components/order-summary/schema
 */
import { defineToolUiContract, ToolUIIdSchema, ToolUIRoleSchema } from '@lionad/vtu-core';
import { z } from 'zod';

/**
 * 订单项的 Schema 定义
 */
export const OrderItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  imageUrl: z.url().optional(),
  quantity: z.int().positive().optional(),
  unitPrice: z.number(),
});

/**
 * 订单项类型
 * 对应 OrderItemSchema 的 TypeScript 类型
 */
export type OrderItem = z.infer<typeof OrderItemSchema>;

const OrderItemsSchema = z
  .array(OrderItemSchema)
  .min(1)
  .superRefine((items, ctx) => {
    const seenIds = new Set<string>();

    for (const [index, item] of items.entries()) {
      if (seenIds.has(item.id)) {
        ctx.addIssue({
          code: "custom",
          message: `Duplicate item id: "${item.id}"`,
          path: [index, 'id'],
        });
      }

      seenIds.add(item.id);
    }
  });

/**
 * 价格计算的 Schema 定义
 */
export const PricingSchema = z.object({
  subtotal: z.number(),
  tax: z.number().optional(),
  taxLabel: z.string().optional(),
  shipping: z.number().optional(),
  discount: z.number().nonnegative().optional(),
  discountLabel: z.string().optional(),
  total: z.number(),
  currency: z.string().optional(),
});

/**
 * 价格计算类型
 * 对应 PricingSchema 的 TypeScript 类型
 */
export type Pricing = z.infer<typeof PricingSchema>;

/**
 * 订单摘要变体的 Schema 定义
 */
export const OrderSummaryVariantSchema = z.enum(['summary', 'receipt']);

/**
 * 订单摘要变体类型
 * 对应 OrderSummaryVariantSchema 的 TypeScript 类型
 */
export type OrderSummaryVariant = z.infer<typeof OrderSummaryVariantSchema>;

/**
 * 订单决策的 Schema 定义
 */
export const OrderDecisionSchema = z.object({
  action: z.literal('confirm'),
  orderId: z.string().optional(),
  confirmedAt: z.iso.datetime().optional(),
});

/**
 * 订单决策类型
 * 对应 OrderDecisionSchema 的 TypeScript 类型
 */
export type OrderDecision = z.infer<typeof OrderDecisionSchema>;

/**
 * OrderSummary 的可序列化数据 Schema
 * 用于验证从外部传入的数据结构
 */
export const SerializableOrderSummarySchema = z.strictObject({
    id: ToolUIIdSchema,
    role: ToolUIRoleSchema.optional(),
    title: z.string().optional(),
    variant: OrderSummaryVariantSchema.optional(),
    items: OrderItemsSchema,
    pricing: PricingSchema,
    choice: OrderDecisionSchema.optional(),
  })
  .superRefine((value, ctx) => {
    if (value.variant === 'receipt' && value.choice === undefined) {
      ctx.addIssue({
        code: "custom",
        message: 'Receipt variant requires "choice".',
        path: ['choice'],
      });
    }

    if (value.variant === 'summary' && value.choice !== undefined) {
      ctx.addIssue({
        code: "custom",
        message: 'Summary variant cannot include "choice".',
        path: ['choice'],
      });
    }
  });

/**
 * OrderSummary 的可序列化数据类型
 * 对应 SerializableOrderSummarySchema 的 TypeScript 类型
 */
export type SerializableOrderSummary = z.infer<
  typeof SerializableOrderSummarySchema
>;

const SerializableOrderSummarySchemaContract = defineToolUiContract(
  'OrderSummary',
  SerializableOrderSummarySchema,
);

export const parseSerializableOrderSummary: (
  input: unknown,
) => SerializableOrderSummary = SerializableOrderSummarySchemaContract.parse;

export const safeParseSerializableOrderSummary: (
  input: unknown,
) => SerializableOrderSummary | null =
  SerializableOrderSummarySchemaContract.safeParse;

/**
 * OrderSummaryCssSchema Zod Schema
 */
export const OrderSummaryCssSchema = z.object({
  root: z.string().optional(),
  header: z.string().optional(),
  items: z.string().optional(),
  pricing: z.string().optional(),
  actions: z.string().optional(),
});

/**
 * OrderSummary 组件的 Props 接口
 * 包含所有可配置的属性
 */
export interface OrderSummaryProps {
  id: string;
  role?: 'information' | 'decision' | 'control' | 'state' | 'composite';
  title?: string;
  variant?: OrderSummaryVariant;
  items: OrderItem[];
  pricing: Pricing;
  choice?: OrderDecision;
  css?: { root?: string; header?: string; items?: string; pricing?: string; actions?: string };
}
