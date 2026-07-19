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
  <header class="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
    <div class="mx-auto flex h-10 max-w-7xl items-center justify-between px-6">
      <NuxtLink
        to="/"
        class="flex items-center gap-2 text-base font-semibold"
      >
        <span class="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          V
        </span>
        <span>Tool-UI（Vue）</span>
      </NuxtLink>

      <nav class="flex items-center gap-4">
        <a
          :href="docsUrl"
          class="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          {{ t('header.docs') }}
        </a>
        <NuxtLink
          to="https://github.com/Lionad-Morotar/tool-ui-vue"
          target="_blank"
          rel="noopener noreferrer"
          class="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          {{ t('header.github') }}
        </NuxtLink>
        <UButton
          color="neutral"
          variant="ghost"
          class="text-xs uppercase"
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
