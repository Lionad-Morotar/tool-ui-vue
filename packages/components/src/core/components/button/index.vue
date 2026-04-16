<script setup lang="ts">
import { computed, useSlots, h, mergeProps, type VNode } from 'vue'
import { buttonVariants } from './variants'
import { cn } from '../../utils'
import type { ButtonProps } from './variants'

const props = withDefaults(defineProps<ButtonProps>(), {
  variant: 'default',
  size: 'default',
  asChild: false,
})

defineOptions({
  name: 'Button',
  inheritAttrs: false,
})

const slots = useSlots()

const classes = computed(() =>
  cn(buttonVariants({ variant: props.variant, size: props.size, class: props.class }))
)

const attrs = computed(() => ({
  'data-slot': 'button',
  'data-variant': props.variant,
  'data-size': props.size,
}))
</script>

<template>
  <button
    v-if="!asChild"
    :class="classes"
    v-bind="{ ...attrs, ...$attrs }"
  >
    <slot />
  </button>
  <component
    :is="() => {
      const children = slots.default?.({})
      if (!children || children.length !== 1) return children
      const child = children[0] as VNode
      return h(
        child,
        mergeProps(
          { class: classes, ...attrs },
          child.props || {},
        ),
      )
    }"
    v-else
  />
</template>
