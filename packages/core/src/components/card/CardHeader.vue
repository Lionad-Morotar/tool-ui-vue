<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '../../utils'

interface CardHeaderProps {
  class?: string
}

const props = defineProps<CardHeaderProps>()

defineOptions({
  name: 'CardHeader',
  inheritAttrs: false
})

const headerClasses = computed(() =>
  cn(
    'grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6',
    props.class
  )
)
</script>

<template>
  <div :class="headerClasses" data-slot="card-header" v-bind="$attrs">
    <slot />
  </div>
</template>
