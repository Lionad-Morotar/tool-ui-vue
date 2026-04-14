<script setup lang="ts">
import { computed } from 'vue'
import { currentLocale, toggleLocale } from './use-story-locale'

const label = computed(() => currentLocale.value === 'zh-CN' ? 'EN' : '中文')
const title = computed(() => `Switch to ${currentLocale.value === 'zh-CN' ? 'English' : 'Chinese'}`)
</script>

<template>
  <button
    class="h-7 cursor-pointer rounded-md border border-gray-300 px-2 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-100"
    :title
    @click="toggleLocale"
  >
    {{ label }}
  </button>
</template>
