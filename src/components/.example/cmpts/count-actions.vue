<template>
  <div class="cmpt-count-actions" :class="[css?.root]">
    <button @click="increment" :class="[css?.button]">Increment</button>
  </div>
</template>

<script lang="ts" setup>
import { useExampleStates } from '../states'

const cmptName = 'cmpt-count-actions'
defineOptions({
  name: cmptName,
  inheritAttrs: false,
})

const props = withDefaults(defineProps<{
  css?: {
    root?: string
    button?: string
  }
}>(), {
  css: {
    root: '',
    button: '',
  },
})

const { increment } = useExampleStates()
</script>

<style lang="css">
.cmpt-count-actions {
  /* ... */
}
</style>