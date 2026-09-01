<script setup lang="ts">
import { Star } from 'lucide-vue-next';
import { RatingItem, RatingItemIndicator, RatingRoot } from 'reka-ui';
import { computed } from 'vue';
import { cn } from '../../core';

defineOptions({ name: 'VtuRating' });

const props = withDefaults(
  defineProps<{
    max?: number;
    clearable?: boolean;
    hoverable?: boolean;
    disabled?: boolean;
    class?: string;
  }>(),
  // 缺省兜底放原子层:5 星、可清空、悬停预览
  { max: 5, clearable: true, hoverable: true, disabled: false }
);

const model = defineModel<number>({ default: 0 });

// reka Rating 的星位数契约名是 length,原子对外暴露表单语义的 max
const items = computed(() => Array.from({ length: props.max }, (_, i) => i + 1));
</script>

<template>
  <RatingRoot
    v-model="model"
    :length="props.max"
    :clearable="props.clearable"
    :hoverable="props.hoverable"
    :disabled="props.disabled"
    :step="1"
    :class="cn('inline-flex items-center gap-1', props.class)"
    data-testid="rating-root"
  >
    <RatingItem
      v-for="i in items"
      :key="i"
      :item="i"
      :class="
        cn(
          'cursor-pointer transition-colors focus-visible:outline-none',
          props.disabled && 'cursor-not-allowed opacity-50'
        )
      "
      data-testid="rating-item"
    >
      <!-- Indicator 即 radio 项:填充态是 reka 覆写的 data-state=active(非 radio 原生 checked,
           只能选中一项);Star 在子级,须经 group-data 选择器吃 Indicator 上的状态 -->
      <RatingItemIndicator :step="i" class="group" data-testid="rating-indicator">
        <Star
          class="size-5 text-muted-foreground/40 transition-colors group-data-[state=active]:fill-primary group-data-[state=active]:text-primary"
        />
      </RatingItemIndicator>
    </RatingItem>
  </RatingRoot>
</template>
