<script setup lang="ts">
import { LocaleProvider, zhCNAll } from '@lionad/vtu-components'
import DemoRestaurant from '../components/demo-restaurant.vue'
</script>

<template>
  <locale-provider :messages="zhCNAll" locale="zh-CN">
    <main class="flex min-h-screen flex-col items-center justify-center bg-background px-6 py-12 text-foreground">
      <demo-restaurant />
    </main>
  </locale-provider>
</template>
