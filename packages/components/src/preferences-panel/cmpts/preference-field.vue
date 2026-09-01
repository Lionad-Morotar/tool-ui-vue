<script setup lang="ts">
import { computed } from 'vue';
import { cn } from '../../core';
import { Switch, ToggleGroup, Input, Textarea, Select } from '../../ui';
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
}>();

// 值可能来自序列化数据,字符串 'true' 视为开
const switchChecked = computed<boolean>({
  get: () => (typeof props.value === 'boolean' ? props.value : props.value === 'true'),
  set: (v) => emit('update', v),
});

// toggle 值桥接:field 联合类型收窄为 string | string[],写回统一走 update 上抛
const toggleModel = computed<string | string[]>({
  get: () => (typeof props.value === 'boolean' ? '' : props.value),
  set: (v) => emit('update', v),
});

// 字符串控件值桥接:select/input/textarea 均为 string 值,联合类型收窄后与原子 defineModel<string> 对齐
const textModel = computed<string>({
  get: () => String(props.value),
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
    <!-- 文案块:label 关联控件 id,description 辅助说明;label 自身带 id 供 button 形态控件接 aria-labelledby -->
    <div :class="props.hasHeading ? 'flex shrink-0 flex-col gap-1' : 'flex flex-col gap-1'">
      <label
        :id="`preference-${item.id}-label`"
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

      <ToggleGroup
        v-else-if="item.type === 'toggle' && item.options"
        v-model="toggleModel"
        :options="item.options"
        :multiple="item.multiple"
        :class="props.hasHeading ? 'w-full' : undefined"
      />

      <!-- Select trigger 渲染为 button,label[for] 无法提供无障碍命名,须补 aria-labelledby -->
      <Select
        v-else-if="item.type === 'select' && item.selectOptions"
        :id="`preference-${item.id}`"
        v-model="textModel"
        :options="item.selectOptions"
        :aria-labelledby="`preference-${item.id}-label`"
      />

      <Input
        v-else-if="item.type === 'input'"
        :id="`preference-${item.id}`"
        v-model="textModel"
        :type="item.inputType"
        :placeholder="item.placeholder"
      />

      <Textarea
        v-else-if="item.type === 'textarea'"
        :id="`preference-${item.id}`"
        v-model="textModel"
        :placeholder="item.placeholder"
        :rows="item.rows"
      />
    </div>
  </div>
</template>
