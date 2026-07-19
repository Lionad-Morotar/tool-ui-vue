<script setup lang="ts">
interface Props {
  role: 'user' | 'agent'
  content?: string
  delay?: number
  order?: number
}

withDefaults(defineProps<Props>(), {
  content: '',
  delay: 0,
  order: 0,
})
</script>

<template>
  <div :class="role === 'user' ? 'flex justify-end' : 'flex justify-start'">
    <div
      :class="[
        role === 'user'
          ? 'rounded-2xl rounded-tr-sm bg-primary text-primary-foreground'
          : 'rounded-2xl rounded-tl-sm bg-muted text-muted-foreground',
        'max-w-[85%] px-4 py-2.5 text-sm',
      ]"
    >
      {{ content }}
      <slot />
    </div>
  </div>
</template>
