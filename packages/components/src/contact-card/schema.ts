/**
 * ContactCard 组件的数据契约定义
 *
 * 定义了该组件的：
 * - Zod Schema：用于运行时数据验证
 * - TypeScript 类型：用于类型安全
 * - Props 接口：用于组件属性定义
 *
 * @module tool-ui-vue/vtu-components/contact-card/schema
 */

import { defineToolUiContract, ToolUIIdSchema, ToolUIRoleSchema } from '../core';
import { z } from 'zod';

/**
 * 联系方式类型的 Schema 定义
 */
export const ContactKindSchema = z.enum([
  'phone',
  'email',
  'address',
  'whatsapp',
  'wechat',
  'website',
  'other',
]);

/**
 * 联系方式类型
 * 对应 ContactKindSchema 的 TypeScript 类型
 */
export type ContactKind = z.infer<typeof ContactKindSchema>;

/**
 * ContactCard 的可序列化数据 Schema
 * 用于验证从外部传入的数据结构
 */
export const SerializableContactCardSchema = z.object({
  id: ToolUIIdSchema,
  role: ToolUIRoleSchema.optional(),
  kind: ContactKindSchema,
  value: z.string().min(1),
  label: z.string().optional(),
  description: z.string().optional(),
  href: z.string().optional(),
  copyable: z.boolean().optional(),
  locale: z.string().optional(),
});

/**
 * ContactCard 的可序列化数据类型
 * 对应 SerializableContactCardSchema 的 TypeScript 类型
 */
export type SerializableContactCard = z.infer<typeof SerializableContactCardSchema>;

const SerializableContactCardSchemaContract = defineToolUiContract(
  'ContactCard',
  SerializableContactCardSchema as z.ZodType<SerializableContactCard>,
);

export const parseSerializableContactCard = SerializableContactCardSchemaContract.parse as (
  input: unknown,
) => SerializableContactCard;

export const safeParseSerializableContactCard = SerializableContactCardSchemaContract.safeParse as (
  input: unknown,
) => SerializableContactCard | null;

/**
 * ContactCard CSS 覆盖 Schema
 */
export const ContactCardCssSchema = z.object({
  root: z.string().optional(),
  icon: z.string().optional(),
  label: z.string().optional(),
  value: z.string().optional(),
  description: z.string().optional(),
});

/**
 * ContactCard CSS 覆盖类型
 */
export type ContactCardCss = z.infer<typeof ContactCardCssSchema>;

/**
 * ContactCard 组件的 Props 接口
 * 包含所有可配置的属性
 */
export interface ContactCardProps {
  id: string;
  role?: 'information' | 'decision' | 'control' | 'state' | 'composite';
  kind: ContactKind;
  value: string;
  label?: string;
  description?: string;
  href?: string;
  copyable?: boolean;
  locale?: string;
  css?: ContactCardCss;
}
