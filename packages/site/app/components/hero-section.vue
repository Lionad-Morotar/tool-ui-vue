<script setup lang="ts">
const { t } = useSiteLocale()
const heroRef = ref<HTMLElement | null>(null)

function updateHeroHeight() {
  if (heroRef.value) {
    document.documentElement.style.setProperty('--hero-height', `${heroRef.value.offsetHeight}px`)
  }
}

onMounted(() => {
  updateHeroHeight()
  window.addEventListener('resize', updateHeroHeight)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateHeroHeight)
})
</script>

<template>
  <section ref="heroRef" class="relative gap-12 grid lg:grid-cols-2 mx-auto px-6 py-16 lg:py-24 lg:pt-0 max-w-7xl">
    <!-- Left: Copy -->
    <div class="flex flex-col justify-center">
      <h1 class="font-bold text-foreground text-4xl sm:text-5xl lg:text-6xl lg:leading-18 tracking-normal">
        {{ t('hero.h1').value }}<br>
        {{ t('hero.h1SubMain').value }}
        <span class="ml-1 sm:ml-2 font-medium text-muted-foreground text-sm sm:text-sm lg:text-base align-middle">
          {{ t('hero.h1SubNote').value }}
        </span>
      </h1>
      <p class="mt-6 max-w-lg text-muted-foreground text-lg">
        {{ t('hero.description').value }}
      </p>
      <div class="flex flex-wrap gap-4 mt-8">
        <UButton
          to="/docs/"
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
    <div class="relative flex justify-center items-center w-full lg:max-w-full max-w-md aspect-square">
      <!-- Subtle ambient glow behind hexnut -->
      <div
        class="absolute inset-0 opacity-40 dark:opacity-50 rounded-full animate-pulse-glow"
        :style="{
          background: 'radial-gradient(circle, color-mix(in oklab, var(--ui-primary) 25%, transparent) 0%, transparent 70%)',
          filter: 'blur(48px)'
        }"
      />
      <ClientOnly>
        <HexnutScene class="relative w-full h-full" />
        <template #fallback>
          <div class="w-full h-full" />
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
