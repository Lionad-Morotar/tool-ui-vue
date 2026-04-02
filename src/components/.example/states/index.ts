import { createSharedComposable } from '@vueuse/core';
import { ref } from 'vue';

export const useExampleStates = createSharedComposable(() => {
  const count = ref(0);

  function increment() {
    count.value++;
  }

  return {
    count,
    increment,
  }
});