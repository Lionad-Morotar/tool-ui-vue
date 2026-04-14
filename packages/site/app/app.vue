<script setup>
import {
  LocaleProvider,
  zhCNAll,
  registerEnglish,
  setLocale,
  setMessages,
} from '@lionad/vtu-components'
import { watchEffect } from 'vue'

const { locale, t } = useSiteLocale()

useHead(() => ({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
  ],
  link: [
    { rel: 'icon', href: '/favicon.ico' }
  ],
  htmlAttrs: {
    lang: locale.value
  }
}))

const title = computed(() => t('site.title').value)
const description = computed(() => t('site.description').value)

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description
})

// Sync vtu-core i18n with site locale
watchEffect(() => {
  if (locale.value === 'en') {
    registerEnglish()
  } else {
    setMessages(zhCNAll)
    setLocale('zh-CN')
  }
})
</script>

<template>
  <LocaleProvider
    :messages="zhCNAll"
    :locale="locale"
  >
    <UApp>
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </UApp>
  </LocaleProvider>
</template>
