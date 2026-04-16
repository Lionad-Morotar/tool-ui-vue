<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '../../utils'

interface CardTitleProps {
  class?: string
}

const props = defineProps<CardTitleProps>()

defineOptions({
  name: 'CardTitle',
  inheritAttrs: false
})

const titleClasses = computed(() =>
  cn('leading-none font-semibold', props.class)
)
</script>

<template>
  <div :class="titleClasses" data-slot="card-title" v-bind="$attrs">
    <slot />
  </div>
</template>
