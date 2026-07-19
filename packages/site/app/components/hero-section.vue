<script setup lang="ts">
const { t } = useSiteLocale()
const config = useRuntimeConfig()

const docsUrl = computed(() => {
  const base = config.app.baseURL
  return base === '/' ? '/docs/' : `${base}docs/`
})
</script>

<template>
  <section class="relative mx-auto grid max-w-7xl gap-12 px-6 py-16 lg:grid-cols-2 lg:py-24 lg:pt-4">
    <!-- Left: Copy -->
    <div class="mt-12 flex flex-col justify-center">
      <h1 class="flex flex-wrap items-center gap-2 text-4xl font-bold tracking-normal text-foreground sm:text-5xl lg:text-6xl lg:leading-18">
        <span class="inline-flex items-center gap-2">
          <span class="inline-flex items-center justify-center text-primary lg:hidden">
            <Icon name="lucide:nut" class="h-8 w-8" />
          </span>
          {{ t('hero.h1').value }}
        </span>
        <span>{{ t('hero.h1SubMain').value }}</span>
        <span class="align-middle text-sm font-medium text-muted-foreground sm:text-base lg:text-base">
          {{ t('hero.h1SubNote').value }}
        </span>
      </h1>
      <p class="mt-6 max-w-lg text-lg text-muted-foreground">
        {{ t('hero.description').value }}
      </p>
      <div class="mt-8 flex flex-wrap gap-4">
        <UButton
          :to="docsUrl"
          external
          size="lg"
          color="primary"
          trailing-icon="i-lucide-arrow-right"
        >
          {{ t('hero.ctaDocs').value }}
        </UButton>
        <UButton
          to="https://github.com/Lionad-Morotar/tool-ui-vue"
          target="_blank"
          size="lg"
          color="neutral"
          variant="outline"
          trailing-icon="i-simple-icons-github"
        >
          {{ t('hero.ctaGithub').value }}
        </UButton>
      </div>
    </div>

    <!-- Right: Hexnut -->
    <div class="relative hidden aspect-square w-full max-w-md items-center justify-center lg:flex lg:max-w-full">
      <!-- Subtle ambient glow behind hexnut -->
      <div
        class="animate-pulse-glow absolute inset-0 rounded-full opacity-40 dark:opacity-50"
        :style="{
          background: 'radial-gradient(circle, color-mix(in oklab, var(--ui-primary) 25%, transparent) 0%, transparent 70%)',
          filter: 'blur(48px)'
        }"
      />
      <ClientOnly>
        <HexnutScene class="relative h-full w-full" />
        <template #fallback>
          <div class="h-full w-full" />
        </template>
      </ClientOnly>
    </div>
  </section>
</template>

<style scoped>
@keyframes pulse-glow {
  0%, 100% {
    transform: scale(1);
    opacity: 0.15;
  }
  50% {
    transform: scale(1.08);
    opacity: 0.25;
  }
}
.animate-pulse-glow {
  animation: pulse-glow 6s ease-in-out infinite;
}
</style>
