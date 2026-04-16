<script setup lang="ts">
const pages = [
  { path: '/demo-restaurant', name: 'Demo Restaurant' },
  { path: '/vtu-renderer', name: 'Vtu Renderer' },
  { path: '/json-render', name: 'Demo JSON Render' },
]
</script>

<template>
  <main class="flex flex-col justify-center items-center bg-background px-6 py-12 min-h-screen text-foreground">
    <h1 class="-mt-80 mb-8 font-semibold text-2xl tracking-tight">Playground</h1>
    <nav class="w-full max-w-xs">
      <ul class="space-y-3">
        <li v-for="page in pages" :key="page.path">
          <a
            :href="page.path"
            class="block bg-card hover:bg-accent px-4 py-3 border border-border rounded-lg font-medium text-card-foreground text-sm transition-colors hover:text-accent-foreground"
          >
            {{ page.name }}
          </a>
        </li>
      </ul>
    </nav>
  </main>
</template>
