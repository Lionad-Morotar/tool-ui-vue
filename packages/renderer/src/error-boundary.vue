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
    class="rounded-lg border border-red-200 bg-red-100 p-4 text-red-800"
  >
    <strong>Rendering error</strong>
    <div class="mt-1 text-sm">
      {{ errorMessage || 'Something went wrong while rendering this UI.' }}
    </div>
  </div>
</template>
