<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '../../utils'

interface CardDescriptionProps {
  class?: string
}

const props = defineProps<CardDescriptionProps>()

defineOptions({
  name: 'CardDescription',
  inheritAttrs: false
})

const descriptionClasses = computed(() =>
  cn('text-sm text-muted-foreground', props.class)
)
</script>

<template>
  <div :class="descriptionClasses" data-slot="card-description" v-bind="$attrs">
    <slot />
  </div>
</template>
