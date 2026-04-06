<script setup lang="ts">
import { cn } from '@lionad/vtu-core';
import { Check, X } from 'lucide-vue-next';
import { reactive, toRef } from 'vue';
import { useApprovalCard } from './states';
import type { ApprovalCardBaseProps } from './schema';

defineOptions({ name: 'CmptApprovalCard', inheritAttrs: false })

const props = withDefaults(defineProps<ApprovalCardBaseProps & { css?: { root?: string; header?: string; content?: string; actions?: string } }>(), {
  css: () => ({ root: '', header: '', content: '', actions: '' })
})

const emit = defineEmits<{
  confirm: [];
  cancel: [];
}>();

// All business logic delegated to states layer
const state = reactive(useApprovalCard({
  ...props,
  emit,
}));

// Keep computed refs reactive
const IconComponent = toRef(state, 'IconComponent');
</script>

<template>
  <!-- Receipt view when choice is made -->
  <div
    v-if="choice"
    v-bind="$attrs"
    :class="
      cn(
        'flex w-full max-w-md min-w-64 flex-col',
        'text-foreground',
        'motion-safe:animate-in motion-safe:fade-in motion-safe:blur-in-sm motion-safe:zoom-in-95 motion-safe:fill-mode-both motion-safe:duration-300 motion-safe:ease-[cubic-bezier(0.16,1,0.3,1)]',
        css?.root,
      )
    "
    data-slot="approval-card"
    :data-tool-ui-id="id"
    data-receipt="true"
    role="status"
    :aria-label="state.receiptLabel"
  >
    <div
      :class="
        cn(
          'flex w-full items-center gap-3 rounded-2xl border border-border bg-card/60 px-4 py-3 shadow-xs',
        )
      "
    >
      <span
        :class="
          cn(
            'flex size-8 shrink-0 items-center justify-center rounded-full bg-muted',
            choice === 'approved' ? 'text-primary' : 'text-muted-foreground',
          )
        "
      >
        <component
          :is="choice === 'approved' ? Check : X"
          class="size-4"
        />
      </span>
      <div class="flex flex-col">
        <span class="text-sm font-medium">{{ state.receiptLabel }}</span>
        <span class="text-sm text-muted-foreground">{{ title }}</span>
      </div>
    </div>
  </div>

  <!-- Interactive view -->
  <article
    v-else
    v-bind="$attrs"
    :class="
      cn(
        'flex w-full max-w-md min-w-64 flex-col gap-3',
        'text-foreground',
        css?.root,
      )
    "
    data-slot="approval-card"
    :data-tool-ui-id="id"
    role="dialog"
    :aria-labelledby="`${id}-title`"
    :aria-describedby="description ? `${id}-description` : undefined"
    tabindex="-1"
    @keydown="state.handleKeyDown"
  >
    <div
      class="flex w-full flex-col gap-4 rounded-2xl border border-border bg-card p-5 shadow-xs"
    >
      <div class="flex items-start gap-3">
        <span
          v-if="IconComponent"
          :class="
            cn(
              'flex size-10 shrink-0 items-center justify-center rounded-xl',
              state.isDestructive
                ? 'bg-destructive/10 text-destructive'
                : 'bg-primary/10 text-primary',
            )
          "
        >
          <component :is="IconComponent" class="size-5" />
        </span>
        <div class="flex flex-1 flex-col gap-1">
          <h2
            :id="`${id}-title`"
            class="text-base leading-tight font-semibold"
          >
            {{ title }}
          </h2>
          <p
            v-if="description"
            :id="`${id}-description`"
            class="text-sm text-muted-foreground"
          >
            {{ description }}
          </p>
        </div>
      </div>

      <template v-if="metadata && metadata.length > 0">
        <hr class="shrink-0 border-t border-border" />
        <dl class="flex flex-col gap-2 text-sm">
          <div
            v-for="(item, index) in metadata"
            :key="index"
            class="flex justify-between gap-4"
          >
            <dt class="shrink-0 text-muted-foreground">{{ item.key }}</dt>
            <dd class="min-w-0 truncate">{{ item.value }}</dd>
          </div>
        </dl>
      </template>
    </div>

    <!-- Action buttons -->
    <div class="@container/actions">
      <div
        :class="
          cn(
            'flex w-full flex-col gap-3',
            '@[240px]/actions:flex-row @[240px]/actions:flex-wrap @[240px]/actions:items-center @[240px]/actions:justify-end @[240px]/actions:gap-2',
          )
        "
      >
        <button
          type="button"
          :class="
            cn(
              'inline-flex items-center justify-center rounded-full px-4 text-base font-medium transition-colors',
              'hover:bg-accent hover:text-accent-foreground',
              'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none',
              'disabled:pointer-events-none disabled:opacity-50',
              'min-h-11 w-full text-base',
              '@[240px]/actions:min-h-0 @[240px]/actions:w-auto @[240px]/actions:px-3 @[240px]/actions:py-2 @[240px]/actions:text-sm',
            )
          "
          @click="state.handleCancel"
        >
          {{ state.resolvedCancelLabel }}
        </button>
        <button
          type="button"
          :class="
            cn(
              'inline-flex items-center justify-center rounded-full px-4 text-base font-medium transition-colors',
              'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none',
              'disabled:pointer-events-none disabled:opacity-50',
              'min-h-11 w-full text-base',
              '@[240px]/actions:min-h-0 @[240px]/actions:w-auto @[240px]/actions:px-3 @[240px]/actions:py-2 @[240px]/actions:text-sm',
              state.isDestructive
                ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
                : 'bg-primary text-primary-foreground hover:bg-primary/90',
            )
          "
          @click="state.handleConfirm"
        >
          {{ state.resolvedConfirmLabel }}
        </button>
      </div>
    </div>
  </article>
</template>
