<script setup lang="ts">
const colorMode = useColorMode()
</script>

<template>
  <header class="top-0 z-50 sticky bg-background/80 backdrop-blur-md border-border border-b w-full">
    <div class="flex justify-between items-center mx-auto px-6 max-w-7xl h-10">
      <NuxtLink to="/" class="flex items-center gap-2 font-semibold text-base">
        <span class="inline-flex justify-center items-center bg-primary rounded-lg w-6 h-6 text-primary-foreground">
          V
        </span>
        <span>Tool-UI（Vue）</span>
      </NuxtLink>

      <nav class="flex items-center gap-4">
        <NuxtLink to="/docs" class="font-medium text-muted-foreground hover:text-foreground text-sm transition-colors">
          文档
        </NuxtLink>
        <NuxtLink
          to="https://github.com/Lionad-Morotar/tool-ui-vue"
          target="_blank"
          rel="noopener noreferrer"
          class="font-medium text-muted-foreground hover:text-foreground text-sm transition-colors"
        >
          GitHub
        </NuxtLink>
        <UButton
          color="neutral"
          variant="ghost"
          :icon="colorMode.value === 'dark' ? 'i-lucide-sun' : 'i-lucide-moon'"
          :aria-label="colorMode.value === 'dark' ? '切换到浅色模式' : '切换到深色模式'"
          @click="colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'"
        />
      </nav>
    </div>
  </header>
</template>
