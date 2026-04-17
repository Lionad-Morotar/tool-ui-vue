<script setup lang="ts">
const colorMode = useColorMode()
const { locale, toggleLocale, t } = useSiteLocale()
const config = useRuntimeConfig()

const themeLabel = computed(() =>
  colorMode.value === 'dark' ? t('header.toggleLight').value : t('header.toggleDark').value
)
const docsUrl = computed(() => {
  const base = config.app.baseURL
  return base === '/' ? '/docs/' : `${base}docs/`
})

function toggleTheme() {
  const newPreference = colorMode.value === 'dark' ? 'light' : 'dark'

  if (!document.startViewTransition) {
    colorMode.preference = newPreference
    return
  }

  document.documentElement.dataset.themeTransition = ''
  const transition = document.startViewTransition(async () => {
    colorMode.preference = newPreference
    await nextTick()
  })
  transition.finished.then(() => {
    delete document.documentElement.dataset.themeTransition
  })
}
</script>

<template>
  <header class="top-0 z-50 sticky bg-background/80 backdrop-blur-md border-border border-b w-full">
    <div class="flex justify-between items-center mx-auto px-6 max-w-7xl h-10">
      <NuxtLink
        to="/"
        class="flex items-center gap-2 font-semibold text-base"
      >
        <span class="inline-flex justify-center items-center bg-primary rounded-lg w-6 h-6 text-primary-foreground">
          V
        </span>
        <span>Tool-UI（Vue）</span>
      </NuxtLink>

      <nav class="flex items-center gap-4">
        <a
          :href="docsUrl"
          class="font-medium text-muted-foreground hover:text-foreground text-sm transition-colors"
        >
          {{ t('header.docs') }}
        </a>
        <NuxtLink
          to="https://github.com/Lionad-Morotar/tool-ui-vue"
          target="_blank"
          rel="noopener noreferrer"
          class="font-medium text-muted-foreground hover:text-foreground text-sm transition-colors"
        >
          {{ t('header.github') }}
        </NuxtLink>
        <UButton
          color="neutral"
          variant="ghost"
          class="uppercase text-xs"
          :label="locale"
          @click="toggleLocale"
        />
        <UButton
          color="neutral"
          variant="ghost"
          :icon="colorMode.value === 'dark' ? 'i-lucide-sun' : 'i-lucide-moon'"
          :aria-label="themeLabel"
          @click="toggleTheme"
        />
      </nav>
    </div>
  </header>
</template>
