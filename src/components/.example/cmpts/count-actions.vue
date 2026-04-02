<template>
  <div class="cmpt-count-actions">
    <button @click="increment">Increment</button>
  </div>
</template>

<script lang="ts" setup>
import { useExampleStates } from '../states'

const cmptName = 'cmpt-count-actions'
defineOptions({
  name: cmptName,
})

const { increment } = useExampleStates()
</script>

<style lang="css">
.cmpt-count-actions {
  /* ... */
}
</style>