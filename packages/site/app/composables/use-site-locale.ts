import { ref, computed, type ComputedRef } from 'vue'
import { siteZhCN, siteEn } from '../i18n/messages'

export type SiteLocale = 'zh-CN' | 'en'

const locale = ref<SiteLocale>('zh-CN')

const messagesMap = {
  'zh-CN': siteZhCN,
  'en': siteEn
} as const

function getPath(obj: Record<string, unknown>, path: string): string {
  const result = path.split('.').reduce<unknown>((o, key) => {
    if (o && typeof o === 'object') return (o as Record<string, unknown>)[key]
    return undefined
  }, obj)
  return typeof result === 'string' ? result : path
}

export function useSiteLocale() {
  const t = (key: string, params?: Record<string, string | number>): ComputedRef<string> => {
    return computed(() => {
      const msgs = messagesMap[locale.value]
      let text = getPath(msgs as unknown as Record<string, unknown>, key)
      if (params) {
        text = text.replace(/\{(\w+)\}/g, (_match, k) => {
          const v = params[k]
          return v !== undefined ? String(v) : _match
        })
      }
      return text
    })
  }

  const toggleLocale = () => {
    locale.value = locale.value === 'zh-CN' ? 'en' : 'zh-CN'
  }

  const setLocale = (l: SiteLocale) => {
    locale.value = l
  }

  return {
    locale: computed(() => locale.value),
    t,
    toggleLocale,
    setLocale
  }
}
