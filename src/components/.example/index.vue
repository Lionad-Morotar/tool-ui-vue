<template>
  <div v-bind="$attrs" class="cmpt-example" :class="[css?.root]">
    count: {{ count }}
    <count-actions :css="css?.actions" />
  </div>
</template>

<script lang="ts" setup>
import CountActions from './cmpts/count-actions.vue'
import { useExampleStates } from './states'

defineOptions({
  name: 'CmptExample',
  inheritAttrs: false,
})

const props = withDefaults(defineProps<{
  css?: {
    root?: string
    actions?: Record<string, string>
  }
}>(), {
  css: {
    root: '',
    actions: () => ({}),
  },
})

const { count } = useExampleStates()
</script>

<style lang="css">
.cmpt-example {
  /* ... */
}
</style>