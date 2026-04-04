<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '../../utils'

interface CardContentProps {
  class?: string
}

const props = defineProps<CardContentProps>()

defineOptions({
  name: 'CardContent',
  inheritAttrs: false
})

const contentClasses = computed(() =>
  cn('px-6', props.class)
)
</script>

<template>
  <div :class="contentClasses" data-slot="card-content" v-bind="$attrs">
    <slot />
  </div>
</template>
