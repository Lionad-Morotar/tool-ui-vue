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
  cn('bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm', props.class)
)
</script>

<template>
  <div :class="cardClasses" data-slot="card" v-bind="$attrs">
    <slot />
  </div>
</template>
