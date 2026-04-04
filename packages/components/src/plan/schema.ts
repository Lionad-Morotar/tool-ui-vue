/**
 * Plan 组件的数据契约定义
 *
 * 定义了该组件的：
 * - Zod Schema：用于运行时数据验证
 * - TypeScript 类型：用于类型安全
 * - Props 接口：用于组件属性定义
 *
 * @module tool-ui-vue/components/plan/schema
 */
import { defineToolUiContract, ToolUIIdSchema, ToolUIReceiptSchema, ToolUIRoleSchema, type ToolUIReceipt } from '@lionad/core';
import { z } from 'zod';

/**
 * 计划待办事项状态的 Schema 定义
 */
export const PlanTodoStatusSchema = z.enum([
  'pending',
  'in_progress',
  'completed',
  'cancelled',
]);

/**
 * 计划待办事项的 Schema 定义
 */
export const PlanTodoSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  status: PlanTodoStatusSchema,
  description: z.string().optional(),
});

/**
 * 计划待办事项状态类型
 * 对应 PlanTodoStatusSchema 的 TypeScript 类型
 */
export type PlanTodoStatus = z.infer<typeof PlanTodoStatusSchema>;

/**
 * 计划待办事项类型
 * 对应 PlanTodoSchema 的 TypeScript 类型
 */
export type PlanTodo = z.infer<typeof PlanTodoSchema>;

/**
 * Plan 的可序列化数据 Schema
 * 用于验证从外部传入的数据结构
 */
export const PlanPropsSchema = z
  .object({
    id: ToolUIIdSchema,
    role: ToolUIRoleSchema.optional(),
    receipt: ToolUIReceiptSchema.optional(),
    title: z.string().min(1),
    description: z.string().optional(),
    todos: z.array(PlanTodoSchema).min(1),
    maxVisibleTodos: z.int().finite().min(1).optional(),
  })
  .superRefine((value, ctx) => {
    const seenTodoIds = new Set<string>();
    value.todos.forEach((todo, index) => {
      if (seenTodoIds.has(todo.id)) {
        ctx.addIssue({
          code: 'custom',
          path: ['todos', index, 'id'],
          message: `Duplicate todo id "${todo.id}".`,
        });
        return;
      }
      seenTodoIds.add(todo.id);
    });
  });

/**
 * PlanCssSchema Zod Schema
 */
export const PlanCssSchema = z.object({
  root: z.string().optional(),
  header: z.string().optional(),
  todo: z.string().optional(),
});

/**
 * Plan 组件的 Props 接口
 * 包含所有可配置的属性
 */
export interface PlanProps {
  id: string;
  role?: 'information' | 'decision' | 'control' | 'state' | 'composite';
  receipt?: ToolUIReceipt;
  title: string;
  description?: string;
  todos: PlanTodo[];
  maxVisibleTodos?: number;
  css?: { root?: string; header?: string; todo?: string };
}

/**
 * Plan 的可序列化数据 Schema（别名）
 */
export const SerializablePlanSchema = PlanPropsSchema;

/**
 * Plan 的可序列化数据类型
 * 对应 SerializablePlanSchema 的 TypeScript 类型
 */

export type SerializablePlan = z.infer<typeof SerializablePlanSchema>;

const SerializablePlanSchemaContract = defineToolUiContract(
  'Plan',
  SerializablePlanSchema,
);

export const parseSerializablePlan: (input: unknown) => SerializablePlan =
  SerializablePlanSchemaContract.parse;

export const safeParseSerializablePlan: (
  input: unknown,
) => SerializablePlan | null = SerializablePlanSchemaContract.safeParse;
