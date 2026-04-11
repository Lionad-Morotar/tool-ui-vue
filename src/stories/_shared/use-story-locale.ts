// Lightweight locale utility for Histoire stories — zero dependency on @lionad/vtu-core/i18n
// Uses a shared module-level ref so all stories react to the same locale state

import { ref, computed, type Ref, type ComputedRef } from 'vue'

export interface StoryLocaleLabels { zh: string; en: string }

// Module-level reactive state (shared across all story imports)
export const currentLocale: Ref<string> = ref('zh-CN')

export function toggleLocale(): void {
  currentLocale.value = currentLocale.value === 'zh-CN' ? 'en' : 'zh-CN'
}

/**
 * Get a locale-aware computed string from bilingual labels.
 *
 * @example
 * const title = useStoryLocale({ zh: '终端组件', en: 'Terminal Component' })
 */
export function useStoryLocale(labels: StoryLocaleLabels): ComputedRef<string> {
  return computed(() => (currentLocale.value === 'zh-CN' ? labels.zh : labels.en))
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
