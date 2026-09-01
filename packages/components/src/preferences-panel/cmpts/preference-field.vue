<script setup lang="ts">
import { computed } from 'vue';
import { cn } from '../../core';
import { Switch } from '../../ui/switch';
import type { PreferenceItem } from '../schema';

defineOptions({ name: 'PreferenceField' });

const props = defineProps<{
  item: PreferenceItem;
  value: string | string[] | boolean;
  itemIndex: number;
  hasHeading: boolean;
  hasTitle: boolean;
  cssItem?: string;
}>();

const emit = defineEmits<{
  update: [value: string | string[] | boolean];
  toggle: [optionValue: string];
}>();

// 值可能来自序列化数据,字符串 'true' 视为开
const switchChecked = computed<boolean>({
  get: () => (typeof props.value === 'boolean' ? props.value : props.value === 'true'),
  set: (v) => emit('update', v),
});

// 宽控件独占一行,其余与文案同行排列
const isBlockControl = computed(
  () => props.item.type === 'input' || props.item.type === 'textarea' || props.item.type === 'toggle'
);

// 无标题卡片的首行去掉上 padding,与容器内边距互补避免顶部双倍留白
const rowPaddingClass = computed(() =>
  !props.hasHeading && props.itemIndex === 0 && !props.hasTitle ? 'pt-0 pb-3' : 'py-3'
);

const controlWrapperClass = computed(() =>
  props.hasHeading
    ? cn('flex', isBlockControl.value && 'w-full', !isBlockControl.value && 'shrink-0')
    : cn('flex', props.item.type !== 'input' && props.item.type !== 'textarea' && 'shrink-0')
);

function isToggleOptionSelected(optionValue: string): boolean {
  if (Array.isArray(props.value)) return props.value.includes(optionValue);
  return props.value === optionValue;
}
</script>

<template>
  <div
    :class="
      cn(
        'flex items-start justify-between gap-4',
        rowPaddingClass,
        isBlockControl
          ? 'flex-col gap-3'
          : props.item.type !== 'switch' &&
              'flex-col gap-3 @sm/preferences-panel:flex-row @sm/preferences-panel:gap-4',
        props.cssItem
      )
    "
    data-testid="preference-field"
  >
    <!-- 文案块:label 关联控件 id,description 辅助说明 -->
    <div :class="props.hasHeading ? 'flex shrink-0 flex-col gap-1' : 'flex flex-col gap-1'">
      <label
        :for="`preference-${item.id}`"
        class="leading-6 font-medium text-pretty"
      >
        {{ item.label }}
      </label>
      <p
        v-if="item.description"
        class="text-sm font-normal text-pretty text-muted-foreground"
      >
        {{ item.description }}
      </p>
    </div>

    <!-- 控件块:按 item.type 调度 -->
    <div :class="controlWrapperClass">
      <Switch
        v-if="item.type === 'switch'"
        :id="`preference-${item.id}`"
        v-model="switchChecked"
      />

      <div
        v-else-if="item.type === 'toggle' && item.options"
        :class="
          props.hasHeading
            ? 'flex w-full flex-wrap items-center justify-end gap-1'
            : 'flex flex-wrap items-center justify-end gap-1'
        "
      >
        <button
          v-for="option in item.options"
          :key="option.value"
          type="button"
          :class="
            cn(
              'rounded-full px-3 py-1.5 text-sm transition-colors',
              isToggleOptionSelected(option.value) ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
            )
          "
          @click="item.multiple ? emit('toggle', option.value) : emit('update', option.value)"
        >
          {{ option.label }}
        </button>
      </div>

      <select
        v-else-if="item.type === 'select' && item.selectOptions"
        :id="`preference-${item.id}`"
        :value="String(value)"
        :class="
          cn(
            'h-9 w-[180px] rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors',
            'focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none'
          )
        "
        @change="emit('update', ($event.target as HTMLSelectElement).value)"
      >
        <option
          v-for="option in item.selectOptions"
          :key="option.value"
          :value="option.value"
        >
          {{ option.label }}
        </option>
      </select>

      <input
        v-else-if="item.type === 'input'"
        :id="`preference-${item.id}`"
        :type="item.inputType ?? 'text'"
        :placeholder="item.placeholder ?? ''"
        :value="String(value)"
        :class="
          cn(
            'h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors',
            'focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none'
          )
        "
        @input="emit('update', ($event.target as HTMLInputElement).value)"
      />

      <textarea
        v-else-if="item.type === 'textarea'"
        :id="`preference-${item.id}`"
        :placeholder="item.placeholder ?? ''"
        :rows="item.rows ?? 3"
        :value="String(value)"
        :class="
          cn(
            'w-full resize-y rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors',
            'focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none'
          )
        "
        @input="emit('update', ($event.target as HTMLTextAreaElement).value)"
      />
    </div>
  </div>
</template>
