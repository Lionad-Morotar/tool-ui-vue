/**
 * CodeDiff 组件的数据契约定义
 *
 * 定义了该组件的：
 * - Zod Schema：用于运行时数据验证
 * - TypeScript 类型：用于类型安全
 * - Props 接口：用于组件属性定义
 *
 * @module tool-ui-vue/vtu-components/code-diff/schema
 */
import { defineToolUiContract, ToolUIIdSchema, ToolUIReceiptSchema, ToolUIRoleSchema, type ToolUIReceipt } from '@lionad/vtu-core';
import { z } from 'zod';

/**
 * CodeDiffCssSchema Zod Schema
 */
export const CodeDiffCssSchema = z.object({
  root: z.string().optional(),
  header: z.string().optional(),
  content: z.string().optional(),
});

/**
 * CodeDiff 基础 Props Schema
 */
const CodeDiffPropsSchemaBase = z.object({
  id: ToolUIIdSchema,
  role: ToolUIRoleSchema.optional(),
  receipt: ToolUIReceiptSchema.optional(),
  oldCode: z.string().optional(),
  newCode: z.string().optional(),
  patch: z.string().optional(),
  language: z.string().trim().min(1).default('text'),
  filename: z.string().optional(),
  lineNumbers: z.enum(['visible', 'hidden']).default('visible'),
  diffStyle: z.enum(['unified', 'split']).default('unified'),
  maxCollapsedLines: z.number().min(1).optional(),
  css: CodeDiffCssSchema.optional().default({}),
});

/**
 * 验证 CodeDiff 输入模式
 * 确保提供 patch 或 oldCode/newCode 之一，但不能同时提供
 */
function validateCodeDiffInputMode(
  data: { patch?: string; oldCode?: string; newCode?: string },
  ctx: z.RefinementCtx,
) {
  const hasPatch = !!data.patch;
  const hasFiles = !!data.oldCode || !!data.newCode;

  if (!hasPatch && !hasFiles) {
    ctx.addIssue({
      code: 'custom',
      message:
        'Provide either a patch string or at least one of oldCode/newCode',
    });
  }

  if (hasPatch && hasFiles) {
    ctx.addIssue({
      code: 'custom',
      message:
        'Cannot mix patch mode with oldCode/newCode — use one or the other',
    });
  }
}

/**
 * CodeDiff 的可序列化数据 Schema
 * 用于验证从外部传入的数据结构
 */
export const CodeDiffPropsSchema = CodeDiffPropsSchemaBase.superRefine(
  validateCodeDiffInputMode,
);

/**
 * CodeDiff 组件的 Props 接口
 * 包含所有可配置的属性
 */
export interface CodeDiffProps {
  id: string;
  role?: 'information' | 'decision' | 'control' | 'state' | 'composite';
  receipt?: ToolUIReceipt;
  oldCode?: string;
  newCode?: string;
  patch?: string;
  language?: string;
  filename?: string;
  lineNumbers?: 'visible' | 'hidden';
  diffStyle?: 'unified' | 'split';
  maxCollapsedLines?: number;
  css?: { root?: string; header?: string; content?: string };
}

/**
 * CodeDiff 的可序列化数据 Schema（排除 css）
 */
export const SerializableCodeDiffSchema = CodeDiffPropsSchemaBase.omit({
  css: true,
}).superRefine(validateCodeDiffInputMode);

/**
 * CodeDiff 的可序列化数据类型
 * 对应 SerializableCodeDiffSchema 的 TypeScript 类型
 */

export type SerializableCodeDiff = z.infer<typeof SerializableCodeDiffSchema>;

const SerializableCodeDiffSchemaContract = defineToolUiContract(
  'CodeDiff',
  SerializableCodeDiffSchema,
);

export const parseSerializableCodeDiff = SerializableCodeDiffSchemaContract.parse;

export const safeParseSerializableCodeDiff = SerializableCodeDiffSchemaContract.safeParse;
