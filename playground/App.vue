<script setup lang="ts">
import { LocaleProvider, zhCNAll } from '@lionad/vtu-components'
import DemoRestaurant from './components/demo-restaurant.vue'
</script>

<template>
  <LocaleProvider :messages="zhCNAll" locale="zh-CN">
    <main class="flex flex-col justify-center items-center bg-background px-6 py-12 min-h-screen text-foreground">
      <DemoRestaurant />
    </main>
  </LocaleProvider>
</template>
