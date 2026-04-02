<template>
  <div class="cmpt-example">
    count: {{ count }}
    <count-actions />
  </div>
</template>

<script lang="ts" setup>
import CountActions from './cmpts/count-actions.vue'
import { useExampleStates } from './states'

const cmptName = 'cmpt-example'
defineOptions({
  name: cmptName,
})

const { count } = useExampleStates()
</script>

<style lang="css">
.cmpt-example {
  /* ... */
}
</style>