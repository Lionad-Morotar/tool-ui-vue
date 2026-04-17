import type { z } from 'zod'

export type ToolDefinition<T extends z.ZodTypeAny = z.ZodTypeAny, R = unknown> = {
  name: string
  description: string
  inputSchema: T
  handler: (input: z.infer<T>) => Promise<R> | R
}

export type ResourceDefinition = {
  uri: string
  description: string
  handler: () =>
    | Promise<{
        contents: Array<{ uri: string; mimeType?: string; text: string }>
      }>
    | { contents: Array<{ uri: string; mimeType?: string; text: string }> }
}

export type PromptDefinition<T extends z.ZodTypeAny = z.ZodTypeAny> = {
  name: string
  description: string
  argsSchema: T
  handler: (input: z.infer<T>) =>
    | Promise<{
        messages: Array<{
          role: 'user' | 'assistant'
          content: { type: 'text'; text: string }
        }>
      }>
    | {
        messages: Array<{
          role: 'user' | 'assistant'
          content: { type: 'text'; text: string }
        }>
      }
}
