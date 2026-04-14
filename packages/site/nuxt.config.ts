import { resolve } from 'node:path'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/ui',
    '@tresjs/nuxt',
    '@vueuse/nuxt'
  ],

  devtools: { enabled: true },

  app: {
    baseURL: process.env.NODE_ENV === 'production' ? '/tool-ui-vue/' : '/'
  },

  css: [
    '~/assets/css/main.css',
    'markstream-vue/index.css',
    'overlayscrollbars/styles/overlayscrollbars.css'
  ],

  vite: {
    optimizeDeps: {
      include: ['overlayscrollbars']
    }
  },

  colorMode: {
    preference: 'system',
    fallback: 'light',
    classSuffix: '',
    storageKey: 'vtu-color-mode'
  },

  alias: {
    '@lionad/vtu-components': resolve(__dirname, '../components/src'),
    '@lionad/vtu-core': resolve(__dirname, '../core/src')
  },

  routeRules: {
    '/': { prerender: true },
    '/docs/**': { prerender: false }
  },

  compatibilityDate: '2026-04-14',

  nitro: {
    prerender: {
      crawlLinks: false,
      routes: ['/']
    }
  }
})
