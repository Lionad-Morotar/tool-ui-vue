import { resolve } from 'node:path'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/ui',
    '@tresjs/nuxt',
    '@vueuse/nuxt',
  ],

  devtools: { enabled: true },

  css: [
    '~/assets/css/main.css',
    '@lionad/vtu-theme/tokens.css',
  ],

  colorMode: {
    preference: 'system',
    fallback: 'light',
    classSuffix: '',
    storageKey: 'vtu-color-mode',
  },

  compatibilityDate: '2026-04-14',

  routeRules: {
    '/': { prerender: true }
  },

  vite: {
    resolve: {
      alias: {
        '@lionad/vtu-components': resolve(__dirname, '../components/src'),
        '@lionad/vtu-core': resolve(__dirname, '../core/src'),
      },
    },
  },
})
