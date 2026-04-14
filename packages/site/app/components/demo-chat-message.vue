<script setup lang="ts">
import { MarkdownRender } from 'markstream-vue'

interface Props {
  role: 'user' | 'agent'
  content?: string
  delay?: number
  order?: number
}

const props = withDefaults(defineProps<Props>(), {
  content: '',
  delay: 0,
  order: 0,
})

const visible = ref(false)
let timer: ReturnType<typeof setTimeout> | null = null

onMounted(() => {
  timer = setTimeout(() => {
    visible.value = true
  }, props.delay + props.order * 500)
})

onUnmounted(() => {
  if (timer !== null) clearTimeout(timer)
})
</script>

<template>
  <Transition
    enter-active-class="transition-all duration-500 ease-out"
    enter-from-class="opacity-0 translate-y-3 scale-[0.98]"
    enter-to-class="opacity-100 translate-y-0 scale-100"
    leave-active-class="transition-all duration-300 ease-in"
    leave-from-class="opacity-100 translate-y-0 scale-100"
    leave-to-class="opacity-0 -translate-y-2 scale-[0.98]"
  >
    <div
      v-show="visible"
      class="chat-message"
      :class="role === 'user' ? 'flex justify-end' : 'flex justify-start'"
    >
      <div
        :class="[
          role === 'user'
            ? 'bg-primary text-primary-foreground rounded-2xl rounded-tr-sm'
            : 'bg-muted text-muted-foreground rounded-2xl rounded-tl-sm',
          'max-w-[85%] px-4 py-2.5 text-sm',
        ]"
      >
        <MarkdownRender
          v-if="content"
          :content="content"
          :final="true"
          render-code-blocks-as-pre
          class="markstream-bubble"
        />
        <slot />
      </div>
    </div>
  </Transition>
</template>

<style lang="css">
.chat-message {
  .markstream-bubble p {
    margin: 0;
  }
  .markstream-bubble p + p {
    margin-top: 0.5em;
  }
  .markstream-bubble > div > *:first-child {
    margin-top: 0;
  }
  .markstream-bubble > div > *:last-child {
    margin-bottom: 0;
  }
}
</style>
