<template>
  <section class="relative gap-12 grid lg:grid-cols-2 mx-auto px-6 py-16 lg:py-24 lg:pt-6 max-w-7xl">
    <!-- Left: Copy -->
    <div class="flex flex-col justify-center">
      <h1 class="font-bold text-foreground text-4xl sm:text-5xl lg:text-6xl tracking-tight">
        使用交互组件<br />增强 AX（Agent Experience）
      </h1>
      <p class="mt-6 max-w-lg text-muted-foreground text-lg">
        让 Agent 的每一次回复都赏心悦目。专为工具调用场景打造的 Vue 组件，提升用户体验只需5分钟。你只需要在 Nuxt 项目告诉你的 Agent，“帮我接入 tool-ui-vue”
      </p>
      <div class="flex flex-wrap gap-4 mt-8">
        <UButton to="/docs" size="lg" color="primary" trailing-icon="i-lucide-arrow-right">
          查看文档
        </UButton>
        <UButton
          to="https://github.com/Lionad-Morotar/tool-ui-vue"
          target="_blank"
          size="lg"
          color="neutral"
          variant="outline"
          trailing-icon="i-simple-icons-github"
        >
          GitHub
        </UButton>
      </div>
    </div>

    <!-- Right: Hexnut -->
    <div class="relative flex justify-center items-center w-full lg:max-w-full max-w-md aspect-square">
      <ClientOnly>
        <HexnutScene class="w-full h-full" />
        <template #fallback>
          <div class="w-full h-full" />
        </template>
      </ClientOnly>
    </div>
  </section>
</template>
