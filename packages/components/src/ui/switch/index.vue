<script setup lang="ts">
import { SwitchRoot, SwitchThumb } from 'reka-ui';
import { cn } from '../../core';

defineOptions({ name: 'VtuSwitch' });

const props = defineProps<{
  class?: string;
  disabled?: boolean;
  id?: string;
}>();

const model = defineModel<boolean>({ default: false });
</script>

<template>
  <SwitchRoot
    :id="props.id"
    v-model="model"
    :disabled="props.disabled"
    :class="
      cn(
        'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none',
        model ? 'bg-primary' : 'bg-muted-foreground/30',
        props.class
      )
    "
    data-slot="switch"
  >
    <SwitchThumb
      :class="
        cn(
          'pointer-events-none block size-5 rounded-full bg-background shadow-lg ring-0 transition-transform',
          model ? 'translate-x-5' : 'translate-x-0.5'
        )
      "
      :style="{ marginTop: '2px' }"
    />
  </SwitchRoot>
</template>
