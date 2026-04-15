/**
 * CodeBlock 组件的数据契约定义
 *
 * 定义了该组件的：
 * - Zod Schema：用于运行时数据验证
 * - TypeScript 类型：用于类型安全
 * - Props 接口：用于组件属性定义
 *
 * @module tool-ui-vue/vtu-components/code-block/schema
 */
import { defineToolUiContract, ToolUIIdSchema, ToolUIReceiptSchema, ToolUIRoleSchema, type ToolUIReceipt } from '@lionad/vtu-core';
import { z } from 'zod';

/**
 * CodeBlock 的可序列化数据 Schema
 * 用于验证从外部传入的数据结构
 */
export const CodeBlockCssSchema = z.object({
  root: z.string().optional(),
  header: z.string().optional(),
  content: z.string().optional(),
  copyButton: z.string().optional(),
});

export type CodeBlockCss = z.infer<typeof CodeBlockCssSchema>;

export const CodeBlockPropsSchema = z.object({
  id: ToolUIIdSchema,
  role: ToolUIRoleSchema.optional(),
  receipt: ToolUIReceiptSchema.optional(),
  code: z.string(),
  language: z.string().trim().min(1).default('text'),
  lineNumbers: z.enum(['visible', 'hidden']).default('visible'),
  filename: z.string().optional(),
  highlightLines: z.array(z.int().positive()).optional(),
  maxCollapsedLines: z.number().min(1).optional(),
  css: CodeBlockCssSchema.optional().default({}),
});

/**
 * CodeBlock 组件的 Props 接口
 * 包含所有可配置的属性
 */
export interface CodeBlockProps {
  id: string;
  role?: 'information' | 'decision' | 'control' | 'state' | 'composite';
  receipt?: ToolUIReceipt;
  code: string;
  language?: string;
  lineNumbers?: 'visible' | 'hidden';
  filename?: string;
  highlightLines?: number[];
  maxCollapsedLines?: number;
  css?: CodeBlockCss;
}

/**
 * 代码块行号显示模式类型
 */
export type CodeBlockLineNumbersMode = 'visible' | 'hidden';

/**
 * CodeBlock 的可序列化数据 Schema（排除 css）
 */
export const SerializableCodeBlockSchema = CodeBlockPropsSchema.omit({
  css: true,
});

/**
 * CodeBlock 的可序列化数据类型
 * 对应 SerializableCodeBlockSchema 的 TypeScript 类型
 */

export type SerializableCodeBlock = z.infer<typeof SerializableCodeBlockSchema>;

const SerializableCodeBlockSchemaContract = defineToolUiContract(
  'CodeBlock',
  SerializableCodeBlockSchema,
);

export const parseSerializableCodeBlock = SerializableCodeBlockSchemaContract.parse;

export const safeParseSerializableCodeBlock = SerializableCodeBlockSchemaContract.safeParse;
