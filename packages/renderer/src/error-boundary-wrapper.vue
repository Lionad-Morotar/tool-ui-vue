<script setup lang="ts">
import { onErrorCaptured, ref } from 'vue';

const hasError = ref(false);
const errorMessage = ref('');

onErrorCaptured((err) => {
  hasError.value = true;
  errorMessage.value = err instanceof Error ? err.message : String(err);
  return false;
});
</script>

<template>
  <slot v-if="!hasError" />
  <div
    v-else
    class="rounded-md border border-red-200 bg-red-100 px-3 py-2.5 text-sm text-red-800"
  >
    {{ errorMessage || 'Component error' }}
  </div>
</template>
