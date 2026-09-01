<script setup lang="ts">
import { cn } from '../../core';

defineOptions({ name: 'VtuTextarea' });

const props = withDefaults(
  defineProps<{
    placeholder?: string;
    rows?: number;
    class?: string;
  }>(),
  // 缺省值兜底放在原子层:消费方传入 undefined 时行为与缺省一致
  { placeholder: '', rows: 3 }
);

const model = defineModel<string>();
</script>

<template>
  <textarea
    v-model="model"
    :placeholder="props.placeholder"
    :rows="props.rows"
    :class="
      cn(
        'w-full resize-y rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors',
        'focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none',
        props.class
      )
    "
    data-slot="textarea"
  />
</template>
