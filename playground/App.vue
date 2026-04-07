<script setup lang="ts">
// Playground dev-only welcome page
// This page is stripped of the component gallery; use Histoire for component docs
</script>

<template>
  <main class="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-foreground">
    <div class="max-w-md text-center">
      <h1 class="text-3xl font-bold tracking-tight">Playground</h1>
      <p class="mt-4 text-muted-foreground">
        此页面仅用于本地开发和调试。正式组件文档请访问 Histoire 站点。
      </p>

      <div class="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <a
          href="http://localhost:5741"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
        >
          打开 Histoire 开发服务器
        </a>
        <a
          href="https://github.com/Lionad-Morotar/tool-ui-vue"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center justify-center rounded-lg border border-border bg-card px-5 py-2.5 text-sm font-semibold text-card-foreground shadow-sm transition-colors hover:bg-muted"
        >
          打开 GitHub 仓库
        </a>
      </div>
    </div>
  </main>
</template>
