import { inject, computed, ref, type Ref, type ComputedRef } from 'vue'
import { en } from './locales/en'
import { zhCN } from './locales/zh-CN'
import type { DeepKeyPath, ParamValue, I18nContext, I18nReturn } from './types'

export const i18nInjectionKey = Symbol('vtu:i18n')

// Internal reactive messages reference (set by LocaleProvider via setMessages)
const _messages: Ref<Record<string, unknown> | null> = ref(null)
const _locale: Ref<string> = ref('zh-CN')
let _localeExplicitlySet = false

export function setMessages(messages: Record<string, unknown>): void {
  _messages.value = messages
}

export function setLocale(locale: string): void {
  _locale.value = locale
  _localeExplicitlySet = true
}

/** Check whether global messages have been explicitly set (or injected by LocaleProvider) */
export function hasMessages(): boolean {
  return _messages.value !== null
}

/** Check whether global locale has been explicitly set (or injected by LocaleProvider) */
export function isLocaleExplicitlySet(): boolean {
  return _localeExplicitlySet
}

// Resolve a dot-notation key path against a nested message object
function resolveMessage(messages: Record<string, unknown> | null, key: string): string | undefined {
  if (!messages) return undefined
  const parts = key.split('.')
  let current: unknown = messages
  for (const part of parts) {
    if (current && typeof current === 'object' && part in current) {
      current = (current as Record<string, unknown>)[part]
    } else {
      return undefined
    }
  }
  return typeof current === 'string' ? current : undefined
}

// Interpolate {param} placeholders with values from params object
function interpolate(template: string, params?: Record<string, ParamValue>): string {
  if (!params) return template
  return template.replace(/\{(\w+)\}/g, (match, key: string) => {
    const value = params[key]
    return value !== undefined && value !== null ? String(value) : match
  })
}

export function useI18n<TMessages extends Record<string, unknown>>(): I18nReturn<TMessages> {
  const context = inject<I18nContext<TMessages> | null>(i18nInjectionKey, null)

  if (!context && !_messages.value) {
    // No LocaleProvider and no global messages -- fallback to zh-CN built-in messages
    if ((import.meta as any).env?.DEV) {
      console.warn('[vtu:i18n] No LocaleProvider configured. Using built-in zh-CN messages as fallback.')
    }

    const t = <TKey extends string>(key: TKey, params?: Record<string, ParamValue>): ComputedRef<string> => {
      return computed(() => {
        const fallbackMessages = _locale.value === 'en' ? en : zhCN
        const resolved = resolveMessage(fallbackMessages, key) ?? key
        return interpolate(resolved, params)
      })
    }

    return {
      t: t as I18nReturn<TMessages>['t'],
      locale: computed(() => _locale.value),
      setLocale,
    }
  }

  const t = <TKey extends DeepKeyPath<TMessages>>(
    key: TKey,
    params?: Record<string, ParamValue>
  ): ComputedRef<string> => {
    return computed(() => {
      const keyStr = key as string
      const messages = context?.messages ?? _messages.value ?? {}

      // Try current locale first (messages are the current locale's messages from LocaleProvider)
      let resolved = resolveMessage(messages as Record<string, unknown>, keyStr)

      // Fallback: dev warns, prod tries zh-CN
      if (resolved === undefined) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if ((import.meta as any).env?.DEV) {
          console.warn(`[vtu:i18n] Missing key: "${keyStr}"`)
        }
        // In production, the messages from LocaleProvider ARE the current locale.
        // If key missing here, it truly doesn't exist -- return key as fallback
        resolved = keyStr
      }

      return interpolate(resolved, params)
    })
  }

  return {
    t: t as I18nReturn<TMessages>['t'],
    locale: computed(() => _locale.value),
    setLocale,
  }
}
