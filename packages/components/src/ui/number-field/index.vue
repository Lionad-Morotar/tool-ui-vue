<script setup lang="ts">
import { Minus, Plus } from 'lucide-vue-next';
import {
  NumberFieldDecrement,
  NumberFieldIncrement,
  NumberFieldInput,
  NumberFieldRoot,
} from 'reka-ui';
import { computed } from 'vue';
import { cn } from '../../core';

defineOptions({ name: 'VtuNumberField' });

const props = withDefaults(
  defineProps<{
    min?: number;
    max?: number;
    step?: number;
    disabled?: boolean;
    placeholder?: string;
    class?: string;
  }>(),
  // 缺省兜底放原子层:步进 1,边界缺省交给 reka(无钳制)
  { step: 1, disabled: false, placeholder: '' }
);

// null 表示空输入态(reka 原生契约),与 string 系原子的 '' 区分;
// reka 清空时实际 emit undefined(number|null 类型的运行时越界),桥接层归一为 null
const model = defineModel<number | null>({ default: null });

const bridgedModel = computed<number | null>({
  get: () => model.value,
  set: (v) => {
    model.value = v ?? null;
  },
});
</script>

<template>
  <NumberFieldRoot
    v-model="bridgedModel"
    :min="props.min"
    :max="props.max"
    :step="props.step"
    :disabled="props.disabled"
    :class="cn('inline-flex items-center', props.class)"
    data-testid="number-field-root"
  >
    <NumberFieldDecrement
      :class="
        cn(
          'flex h-9 w-9 items-center justify-center rounded-l-md border border-input bg-background transition-colors',
          'hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50'
        )
      "
      data-testid="number-field-decrement"
    >
      <Minus class="size-4" />
    </NumberFieldDecrement>
    <NumberFieldInput
      :placeholder="props.placeholder"
      :class="
        cn(
          'h-9 w-20 border-y border-input bg-background text-center text-sm shadow-sm',
          'focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none'
        )
      "
      data-testid="number-field-input"
    />
    <NumberFieldIncrement
      :class="
        cn(
          'flex h-9 w-9 items-center justify-center rounded-r-md border border-input bg-background transition-colors',
          'hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50'
        )
      "
      data-testid="number-field-increment"
    >
      <Plus class="size-4" />
    </NumberFieldIncrement>
  </NumberFieldRoot>
</template>
