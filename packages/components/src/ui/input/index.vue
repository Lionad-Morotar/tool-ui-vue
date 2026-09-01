<script setup lang="ts">
import { cn } from '../../core';

defineOptions({ name: 'VtuInput' });

const props = withDefaults(
  defineProps<{
    type?: string;
    placeholder?: string;
    class?: string;
  }>(),
  // 缺省值兜底放在原子层:消费方传入 undefined 时行为与缺省一致
  { type: 'text', placeholder: '' }
);

const model = defineModel<string>();
</script>

<template>
  <input
    v-model="model"
    :type="props.type"
    :placeholder="props.placeholder"
    :class="
      cn(
        'h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors',
        'focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none',
        props.class
      )
    "
    data-slot="input"
  />
</template>
