<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '../../utils'

interface CardProps {
  class?: string
}

const props = defineProps<CardProps>()

defineOptions({
  name: 'Card',
  inheritAttrs: false
})

const cardClasses = computed(() =>
  cn('flex flex-col gap-6 bg-card shadow-sm py-6 border border-border rounded-xl text-card-foreground', props.class)
)
</script>

<template>
  <div :class="cardClasses" data-slot="card" v-bind="$attrs">
    <slot />
  </div>
</template>
