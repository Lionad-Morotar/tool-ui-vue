import type { ComputedRef } from 'vue'

// DeepKeyPath: recursively extracts all dot-notation key paths from a nested message object
// Example: DeepKeyPath<{ terminal: { copy: string } }> = 'terminal' | 'terminal.copy'
export type DeepKeyPath<T> = T extends object
  ? {
      [K in keyof T]: T[K] extends object
        ? K extends string
          ? `${K}` | `${K}.${DeepKeyPath<T[K]>}`
          : never
        : K extends string
          ? `${K}`
          : never
    }[keyof T]
  : never

// DeepValueOf: extracts the leaf value type at a given dot-notation key path
// Example: DeepValueOf<{ terminal: { copy: string } }, 'terminal.copy'> = string
export type DeepValueOf<T, P extends string> = P extends `${infer K}.${infer Rest}`
  ? K extends keyof T
    ? T[K] extends object
      ? DeepValueOf<T[K], Rest>
      : never
    : never
  : P extends keyof T
    ? T[P]
    : never

// ParamValue: acceptable values for interpolation parameters
export type ParamValue = string | number | boolean | null | undefined

// I18nContext: shape of the injected context
export interface I18nContext<TMessages extends Record<string, unknown>> {
  messages: TMessages
  locale: string
}

// ReadonlyRef: a computed ref that cannot be written to directly
export type ReadonlyRef<T> = ComputedRef<T>

// I18nReturn: return type of useI18n()
export interface I18nReturn<TMessages extends Record<string, unknown>> {
  t: <TKey extends DeepKeyPath<TMessages>>(
    key: TKey,
    params?: Record<string, ParamValue>
  ) => ReadonlyRef<string>
  locale: ReadonlyRef<string>
  setLocale: (locale: string) => void
}

// KeysFor: extract only leaf keys (exclude intermediate namespace keys) for t()
// Example: KeysFor<{ terminal: { copy: string }, shared: { foo: string } }>
//   = 'terminal.copy' | 'shared.foo' (excludes 'terminal', 'shared')
export type KeysFor<T> = {
  [K in keyof T]: T[K] extends object
    ? T[K] extends Record<string, string | Record<string, unknown>>
      ? `${K & string}.${KeysFor<T[K]>}`
      : never
    : K extends string
      ? K
      : never
}[keyof T]

