<script setup lang="ts">
const pages = [
  { path: '/demo-restaurant', name: 'Demo Restaurant' },
  { path: '/vtu-renderer', name: 'Vtu Renderer' },
]
</script>

<template>
  <main class="flex flex-col justify-center items-center bg-background px-6 py-12 min-h-screen text-foreground">
    <h1 class="text-2xl font-semibold tracking-tight mb-8">Playground</h1>
    <nav class="w-full max-w-xs">
      <ul class="space-y-3">
        <li v-for="page in pages" :key="page.path">
          <a
            :href="page.path"
            class="block rounded-lg border border-border bg-card px-4 py-3 text-sm font-medium text-card-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            {{ page.name }}
          </a>
        </li>
      </ul>
    </nav>
  </main>
</template>
