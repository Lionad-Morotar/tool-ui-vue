<script setup lang="ts">
import { Check, ChevronDown } from 'lucide-vue-next';
import {
  SelectContent,
  SelectIcon,
  SelectItem,
  SelectItemIndicator,
  SelectItemText,
  SelectPortal,
  SelectRoot,
  SelectTrigger,
  SelectValue,
  SelectViewport,
} from 'reka-ui';
import { cn } from '../../core';

// SelectRoot 只渲染插槽不产生宿主元素,消费方传入的 id/aria-* 不能靠默认 fallthrough
// 落到 trigger 上,必须关闭继承并显式转发,否则 label 关联静默断裂
defineOptions({ name: 'VtuSelect', inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    options: { value: string; label: string }[];
    placeholder?: string;
    class?: string;
  }>(),
  // 缺省值兜底放在原子层:消费方传入 undefined 时行为与缺省一致
  { placeholder: '' }
);

const model = defineModel<string>();
</script>

<template>
  <SelectRoot v-model="model">
    <!-- Trigger:视觉对齐既有原生 select 规格;button 形态下 label[for] 只提供点击聚焦,
         无障碍命名依赖消费方透传 aria-labelledby -->
    <SelectTrigger
      v-bind="$attrs"
      :class="
        cn(
          'flex h-9 w-[180px] items-center justify-between gap-2 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors',
          'focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none',
          'data-[placeholder]:text-muted-foreground',
          props.class
        )
      "
      data-testid="select-trigger"
    >
      <SelectValue :placeholder="props.placeholder" />
      <SelectIcon class="opacity-50">
        <ChevronDown class="size-4" />
      </SelectIcon>
    </SelectTrigger>
    <SelectPortal>
      <!-- 浮层样式对齐 citation popover 先例;popper 定位下内容宽度至少与 trigger 持平 -->
      <SelectContent
        position="popper"
        :side-offset="4"
        :class="
          cn(
            'z-50 min-w-[var(--reka-select-trigger-width)] overflow-hidden rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md'
          )
        "
        data-testid="select-content"
      >
        <!-- Viewport:schema 的 selectOptions 无数量上限,须封顶高度并内部滚动,
             否则底部选项滚轮与键盘 End 均不可达;规格对齐 citation-overflow-popover 先例 -->
        <SelectViewport class="max-h-72 overflow-y-auto">
          <SelectItem
            v-for="option in props.options"
            :key="option.value"
            :value="option.value"
            :class="
              cn(
                'relative flex w-full cursor-pointer items-center rounded-sm py-1.5 pr-8 pl-2 text-sm outline-none select-none',
                'data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground',
                'data-[disabled]:pointer-events-none data-[disabled]:opacity-50'
              )
            "
            data-testid="select-item"
          >
            <SelectItemText>{{ option.label }}</SelectItemText>
            <SelectItemIndicator
              class="absolute right-2 flex size-4 items-center justify-center"
            >
              <Check class="size-4" />
            </SelectItemIndicator>
          </SelectItem>
        </SelectViewport>
      </SelectContent>
    </SelectPortal>
  </SelectRoot>
</template>
