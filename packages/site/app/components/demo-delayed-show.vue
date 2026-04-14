<script setup lang="ts">
const props = withDefaults(defineProps<{ order?: number }>(), { order: 0 })

const visible = ref(false)
let timer: ReturnType<typeof setTimeout> | null = null

onMounted(() => {
  timer = setTimeout(() => {
    visible.value = true
  }, props.order * 500)
})

onUnmounted(() => {
  if (timer !== null) clearTimeout(timer)
})
</script>

<template>
  <Transition
    enter-active-class="transition-all duration-500 ease-out"
    enter-from-class="opacity-0 translate-y-3"
    enter-to-class="opacity-100 translate-y-0"
  >
    <div v-show="visible">
      <slot />
    </div>
  </Transition>
</template>
