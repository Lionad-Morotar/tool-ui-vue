/**
 * Terminal — 终端输出展示
 *
 * 本文件定义了 Terminal 组件的数据契约（Contract）：
 * - Zod Schema：运行时数据校验
 * - TypeScript 类型推导
 * - Vue Props 接口
 *
 * @module tool-ui-vue/components/terminal/schema
 */

import { defineToolUiContract, ToolUIIdSchema, ToolUIReceiptSchema, ToolUIRoleSchema } from '@lionad/core';
import { z } from 'zod';
import type { ToolUIReceipt } from '@lionad/core';

/**
 * TerminalCssSchema Zod Schema
 */
export const TerminalCssSchema = z.object({
  root: z.string().optional(),
  header: z.string().optional(),
  content: z.string().optional(),
});

/** TerminalPropsSchema Zod Schema */
export const TerminalPropsSchema = z.object({
  id: ToolUIIdSchema,
  role: ToolUIRoleSchema.optional(),
  receipt: ToolUIReceiptSchema.optional(),
  command: z.string(),
  stdout: z.string().optional(),
  stderr: z.string().optional(),
  exitCode: z.int().min(0),
  durationMs: z.number().optional(),
  cwd: z.string().optional(),
  truncated: z.boolean().optional(),
  maxCollapsedLines: z.number().min(1).optional(),
  css: TerminalCssSchema.optional().default({}),
});

/** TerminalProps 组件属性接口 */
export interface TerminalProps {
  id: string;
  role?: 'information' | 'decision' | 'control' | 'state' | 'composite';
  receipt?: ToolUIReceipt;
  command: string;
  stdout?: string;
  stderr?: string;
  exitCode: number;
  durationMs?: number;
  cwd?: string;
  truncated?: boolean;
  maxCollapsedLines?: number;
  css?: { root?: string; header?: string; content?: string };
}

export const SerializableTerminalSchema = TerminalPropsSchema.omit({
  css: true,
});

/** SerializableTerminal 类型，由 Zod Schema 推导 */
export type SerializableTerminal = z.infer<typeof SerializableTerminalSchema>;

const SerializableTerminalSchemaContract = defineToolUiContract(
  'Terminal',
  SerializableTerminalSchema,
);

export const parseSerializableTerminal: (
  input: unknown,
) => SerializableTerminal = SerializableTerminalSchemaContract.parse;

export const safeParseSerializableTerminal: (
  input: unknown,
) => SerializableTerminal | null = SerializableTerminalSchemaContract.safeParse;
