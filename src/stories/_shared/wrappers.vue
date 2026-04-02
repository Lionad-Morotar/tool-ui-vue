<script setup lang="ts">
import { ref, provide, h } from 'vue';

/**
 * Toast notification system for story interactions
 */
export interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error';
}

const toasts = ref<Toast[]>([]);

export function useStoryToasts() {
  function showToast(message: string, type: 'success' | 'error') {
    const id = Date.now();
    toasts.value.push({ id, message, type });
    setTimeout(() => {
      toasts.value = toasts.value.filter((t) => t.id !== id);
    }, 2000);
  }

  return { toasts, showToast };
}

/**
 * Toast container component for stories
 */
export const ToastContainer = {
  setup() {
    const { toasts } = useStoryToasts();
    provide('story-toasts', toasts);

    return () =>
      h(
        'div',
        {
          class: 'fixed bottom-4 right-4 z-50 flex flex-col gap-2',
        },
        toasts.value.map((toast) =>
          h(
            'div',
            {
              key: toast.id,
              class: [
                'flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium shadow-lg ring-1 transition-all',
                toast.type === 'success'
                  ? 'bg-green-50 text-green-800 ring-green-200'
                  : 'bg-red-50 text-red-800 ring-red-200',
              ],
            },
            [h('span', null, toast.type === 'success' ? '✓' : '✗'), toast.message],
          ),
        ),
      );
  },
};

/**
 * Story wrapper with consistent padding and background
 */
export const StoryWrapper = {
  props: {
    padded: {
      type: Boolean,
      default: true,
    },
    centered: {
      type: Boolean,
      default: true,
    },
  },
  setup(props: { padded?: boolean; centered?: boolean }, { slots }: { slots: Record<string, () => unknown> }) {
    return () =>
      h(
        'div',
        {
          class: [
            'min-h-[200px]',
            props.padded && 'p-6',
            props.centered && 'flex items-center justify-center',
            'bg-gray-50/50',
          ],
        },
        slots.default?.(),
      );
  },
};
</script>

<template>
  <!-- This file is script-only, template is empty -->
</template>
