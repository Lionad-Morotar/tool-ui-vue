<script setup lang="ts">
import { cn } from '../../core';

defineOptions({ name: 'VtuOptionIndicator' });

// 纯展示选中指示器:radio 圆形单选点 / checkbox 方形勾选,选中态描边填充与
// motion-safe 动画类全套对齐 question-flow 原内联实现;选中语义由宿主
// (role=option 的 aria-selected)承载,本组件不挂交互
// animate 控制选中态入场动画:CSS 动画在全新挂载的节点上必然从头播放,静态快照
// 场景(如换步退场克隆)须传 false,否则快照会重播一次放大淡入
const props = withDefaults(
  defineProps<{
    selected: boolean;
    shape: 'radio' | 'checkbox';
    disabled?: boolean;
    animate?: boolean;
    class?: string;
  }>(),
  { animate: true }
);
</script>

<template>
  <span
    :class="
      cn(
        'flex size-4 shrink-0 items-center justify-center border-2',
        'motion-safe:transition-colors motion-safe:duration-200',
        props.shape === 'radio' ? 'rounded-full' : 'rounded',
        props.selected
          ? cn(
              'border-primary bg-primary text-primary-foreground',
              props.animate &&
                'motion-safe:animate-in motion-safe:fade-in motion-safe:zoom-in-75 motion-safe:duration-300 motion-safe:ease-out'
            )
          : 'border-muted-foreground/50',
        props.disabled ? 'opacity-50' : undefined,
        props.class
      )
    "
    data-slot="option-indicator"
    data-testid="option-indicator"
    :data-shape="props.shape"
    :data-state="props.selected ? 'selected' : 'unselected'"
  >
    <svg
      v-if="props.shape === 'checkbox' && props.selected"
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="3"
      stroke-linecap="round"
      stroke-linejoin="round"
      :class="
        props.animate
          ? 'motion-safe:animate-in motion-safe:fade-in motion-safe:zoom-in-75 motion-safe:fill-mode-both motion-safe:delay-75 motion-safe:duration-200'
          : undefined
      "
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
    <span
      v-else-if="props.shape === 'radio' && props.selected"
      :class="
        cn(
          'size-2 rounded-full bg-current',
          props.animate &&
            'motion-safe:animate-in motion-safe:fade-in motion-safe:zoom-in-75 motion-safe:duration-300 motion-safe:ease-out'
        )
      "
    />
  </span>
</template>
