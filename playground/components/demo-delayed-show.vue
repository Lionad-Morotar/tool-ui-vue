<script setup lang="ts">
withDefaults(defineProps<{ order?: number }>(), { order: 0 })
</script>

<template>
  <div>
    <slot />
  </div>
</template>
