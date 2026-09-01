<script setup lang="ts">
import { X } from 'lucide-vue-next';
import {
  TagsInputInput,
  TagsInputItem,
  TagsInputItemDelete,
  TagsInputItemText,
  TagsInputRoot,
} from 'reka-ui';
import { cn } from '../../core';

defineOptions({ name: 'VtuTagsInput' });

const props = withDefaults(
  defineProps<{
    max?: number;
    disabled?: boolean;
    placeholder?: string;
    // 根容器是无 role 的 generic div,aria-labelledby 落在其上不参与可访问名称计算;
    // 声明为 prop 阻断 fallthrough,显式透传到真实输入框。
    // 须 camelCase 声明(外部写 aria-labelledby 时 Vue 模板编译自动 camelize 匹配),
    // kebab 键名的 prop 声明在 Vue 匹配机制下收不到值
    ariaLabelledby?: string;
    class?: string;
  }>(),
  // 缺省兜底放原子层;max 缺省不限制(reka 原生)
  { disabled: false, placeholder: '', ariaLabelledby: undefined }
);

const model = defineModel<string[]>({ default: () => [] });
</script>

<template>
  <TagsInputRoot
    v-model="model"
    :max="props.max"
    :disabled="props.disabled"
    :class="
      cn(
        'flex min-h-9 w-full flex-wrap items-center gap-1.5 rounded-md border border-input bg-background px-2 py-1 text-sm shadow-sm',
        'focus-within:ring-1 focus-within:ring-ring',
        props.class
      )
    "
    data-testid="tags-input-root"
  >
    <!-- 既有标签:删除位带 aria-label 供无障碍命名;tag 值经 ItemText 渲染;
         key 复合序号——reka 的 duplicate 去重只拦 addTag 输入路径,外部绑定的
         modelValue 若含重复值(如持久化恢复),裸值作 key 会触发 duplicate key
         警告并使 keyed diff 复用错位 -->
    <TagsInputItem
      v-for="(tag, index) in model"
      :key="`${tag}-${index}`"
      :value="tag"
      :class="
        cn(
          'inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground',
          'data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50'
        )
      "
      data-testid="tags-input-item"
    >
      <TagsInputItemText />
      <TagsInputItemDelete
        :aria-label="`Remove ${tag}`"
        class="inline-flex items-center justify-center rounded-sm opacity-60 transition-opacity hover:opacity-100 focus-visible:outline-none"
        data-testid="tags-input-item-delete"
      >
        <X class="size-3" />
      </TagsInputItemDelete>
    </TagsInputItem>

    <TagsInputInput
      :placeholder="props.placeholder"
      :aria-labelledby="props.ariaLabelledby"
      class="min-w-16 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
      data-testid="tags-input-field"
    />
  </TagsInputRoot>
</template>
