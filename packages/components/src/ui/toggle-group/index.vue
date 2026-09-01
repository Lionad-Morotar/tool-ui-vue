<script setup lang="ts">
import { computed } from 'vue';
import { ToggleGroupRoot, ToggleGroupItem } from 'reka-ui';
import { cn } from '../../core';

defineOptions({ name: 'VtuToggleGroup' });

const props = defineProps<{
  options: { value: string; label: string }[];
  multiple?: boolean;
  class?: string;
}>();

const model = defineModel<string | string[]>();

// reka 单选模式下点击已选项会回吐 undefined(取消选中),而偏好语义是替换,
// 拦截这次回退,保证单选永远不会把值清空
const forwardedModel = computed<string | string[] | undefined>({
  get: () => model.value,
  set: (v) => {
    if (v === undefined) return;
    model.value = v;
  },
});
</script>

<template>
  <ToggleGroupRoot
    v-model="forwardedModel"
    :type="props.multiple ? 'multiple' : 'single'"
    :class="cn('flex flex-wrap items-center justify-end gap-1', props.class)"
    data-testid="toggle-group"
  >
    <ToggleGroupItem
      v-for="option in props.options"
      :key="option.value"
      :value="option.value"
      :class="
        cn(
          'rounded-full px-3 py-1.5 text-sm transition-colors',
          'data-[state=on]:bg-primary data-[state=on]:text-primary-foreground data-[state=off]:hover:bg-accent'
        )
      "
      data-testid="toggle-group-item"
    >
      {{ option.label }}
    </ToggleGroupItem>
  </ToggleGroupRoot>
</template>
