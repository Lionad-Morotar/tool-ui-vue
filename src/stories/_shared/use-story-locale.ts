// Lightweight locale utility for Histoire stories — zero dependency on @lionad/vtu-core/i18n
// Uses a shared module-level ref so all stories react to the same locale state

import { ref, computed, type Ref, type ComputedRef } from 'vue'

export interface StoryLocaleLabels { zh: string; en: string }

export interface StoryLocaleMessages {
  [key: string]: string | StoryLocaleMessages
}

export function getPath(obj: StoryLocaleMessages | undefined, path: string): string {
  const result = path.split('.').reduce<unknown>((o, key) => {
    if (o && typeof o === 'object') return (o as Record<string, unknown>)[key]
    return undefined
  }, obj)
  return typeof result === 'string' ? result : path
}

// Module-level reactive state (shared across all story imports)
export const currentLocale: Ref<string> = ref('zh-CN')

export function toggleLocale(): void {
  currentLocale.value = currentLocale.value === 'zh-CN' ? 'en' : 'zh-CN'
}

/**
 * Get a locale-aware computed string from bilingual labels or key-based messages.
 *
 * @example
 * const title = useStoryLocale({ zh: '终端组件', en: 'Terminal Component' })
 * const title = useStoryLocale('variant.default', { zh: { variant: { default: '默认' } }, en: { variant: { default: 'Default' } } })
 */
export function useStoryLocale(
  source: StoryLocaleLabels | string,
  messages?: { zh: StoryLocaleMessages; en: StoryLocaleMessages }
): ComputedRef<string> {
  return computed(() => {
    const isZh = currentLocale.value === 'zh-CN'
    if (typeof source === 'string' && messages) {
      return getPath(isZh ? messages.zh : messages.en, source)
    }
    const labels = source as StoryLocaleLabels
    return isZh ? labels.zh : labels.en
  })
}

/**
 * Raw access to locale state and toggle — for components that need direct control.
 * Returns the injected context if in Histoire, otherwise falls back to the module-level ref.
 */
export function useStoryLocaleRaw() {
  // Note: inject only works inside setup(); in stories this returns null
  // because we expose via window, not provide/inject
  return { locale: currentLocale, toggle: toggleLocale }
}
