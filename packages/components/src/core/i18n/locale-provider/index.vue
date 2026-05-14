<script setup lang="ts" generic="TMessages extends Record<string, unknown>">
import { provide, computed, watch } from 'vue'
import { i18nInjectionKey, setMessages, setLocale } from '../use-i18n'
import type { I18nContext } from '../types'

const props = withDefaults(defineProps<{
  /** Single locale messages object (e.g., zhCN imported from locales) */
  messages: TMessages
  /** Locale identifier, defaults to 'zh-CN' */
  locale?: string
}>(), {
  locale: 'zh-CN',
})

defineOptions({
  name: 'LocaleProvider',
  inheritAttrs: false,
})

const isSSR = typeof window === 'undefined'

// Sync messages and locale to module-level refs for copy-paste consumers.
// Skip in SSR to prevent cross-request state pollution (shared module-level refs).
if (!isSSR) {
  watch(
    [() => props.messages, () => props.locale],
    ([msgs, loc]) => {
      setMessages(msgs as Record<string, unknown>)
      setLocale(loc)
    },
    { immediate: true }
  )
}

const context = computed<I18nContext<TMessages>>(() => ({
  messages: props.messages,
  locale: props.locale,
}))

provide(i18nInjectionKey, context)
</script>

<template>
  <slot />
</template>
