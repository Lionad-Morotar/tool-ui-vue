import type { z } from 'zod'
import { formatZodError } from './parse'

/**
 * 开发模式下对组件 props 进行运行时 Zod schema 验证。
 *
 * 仅在 `import.meta.env.DEV` 为 true 时执行验证，生产构建中完全跳过，
 * 不增加生产包体积和运行时开销。
 *
 * @param schema - Zod Schema（如 SerializableCodeBlockSchema）
 * @param props - 待验证的 props 对象
 * @param componentName - 组件名称，用于警告信息前缀
 */
export function usePropsValidator<T>(
  schema: z.ZodSchema<T>,
  props: object,
  componentName: string,
): void {
  if (typeof import.meta.env === 'undefined' || !import.meta.env.DEV) {
    return
  }

  const result = schema.safeParse(props)

  if (!result.success) {
    const formattedError = formatZodError(result.error)
    console.warn(
      `[${componentName}] Props validation failed: ${formattedError}`,
    )
  }
}
