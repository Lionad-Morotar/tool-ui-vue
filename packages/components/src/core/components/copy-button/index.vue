<script setup lang="ts">
import { ref, computed } from 'vue'
import { cn } from '../../utils'
import { buttonVariants } from '../button/variants'
import type { CopyButtonProps } from './index'

const props = withDefaults(defineProps<CopyButtonProps>(), {
  variant: 'ghost',
  size: 'icon-sm',
})

const emit = defineEmits<{
  copied: []
}>()

defineOptions({
  name: 'CopyButton',
  inheritAttrs: false,
})

const isCopied = ref(false)

async function handleCopy() {
  try {
    await navigator.clipboard.writeText(props.value)
    isCopied.value = true
    emit('copied')
    setTimeout(() => {
      isCopied.value = false
    }, 2000)
  } catch {
    // Ignore clipboard errors
  }
}

const classes = computed(() =>
  cn(buttonVariants({ variant: props.variant, size: props.size, class: props.class }))
)
</script>

<template>
  <button
    type="button"
    :class="classes"
    :aria-label="isCopied ? 'Copied' : 'Copy to clipboard'"
    data-slot="copy-button"
    @click="handleCopy"
  >
    <slot :is-copied="isCopied">
      <span v-if="!isCopied">Copy</span>
      <span v-else>Copied!</span>
    </slot>
  </button>
</template>
