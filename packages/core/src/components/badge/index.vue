<script setup lang="ts">
import { computed, useSlots, h, mergeProps, type VNode } from 'vue'
import { badgeVariants } from './variants'
import { cn } from '../../utils'
import type { BadgeProps } from './variants'

const props = withDefaults(defineProps<BadgeProps>(), {
  variant: 'default',
  asChild: false,
})

defineOptions({
  name: 'Badge',
  inheritAttrs: false,
})

const slots = useSlots()

const classes = computed(() =>
  cn(badgeVariants({ variant: props.variant, class: props.class }))
)

const attrs = computed(() => ({
  'data-slot': 'badge',
  'data-variant': props.variant,
}))
</script>

<template>
  <span
    v-if="!asChild"
    :class="classes"
    v-bind="{ ...attrs, ...$attrs }"
  >
    <slot />
  </span>
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
