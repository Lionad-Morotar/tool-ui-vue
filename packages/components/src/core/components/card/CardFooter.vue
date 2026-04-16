<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '../../utils'

interface CardFooterProps {
  class?: string
}

const props = defineProps<CardFooterProps>()

defineOptions({
  name: 'CardFooter',
  inheritAttrs: false
})

const footerClasses = computed(() =>
  cn('flex items-center px-6 [.border-t]:pt-6', props.class)
)
</script>

<template>
  <div :class="footerClasses" data-slot="card-footer" v-bind="$attrs">
    <slot />
  </div>
</template>
