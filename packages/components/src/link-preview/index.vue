<script setup lang="ts">
import { cn } from '@lionad/vtu-core';
import { reactive } from 'vue';
import { useLinkPreview } from './states';
import type { LinkPreviewProps } from './schema';

defineOptions({ name: 'CmptLinkPreview', inheritAttrs: false })

const props = withDefaults(defineProps<LinkPreviewProps>(), {
  css: () => ({}),
})

const emit = defineEmits<{
  navigate: [href: string];
}>()

// All business logic delegated to states layer
const state = reactive(useLinkPreview(props, emit));
</script>

<template>
  <article
    v-bind="$attrs"
    :class="cn('relative w-full max-w-md min-w-80', css?.root)"
    lang="en"
    :data-tool-ui-id="id"
    data-slot="link-preview"
  >
    <div
      :class="cn(
        'group @container relative isolate flex w-full min-w-0 flex-col overflow-hidden rounded-xl',
        'border border-border bg-card text-sm shadow-xs',
        href && 'cursor-pointer',
      )"
      :role="href ? 'link' : undefined"
      :tabindex="href ? 0 : undefined"
      @click="state.handleNavigate"
      @keydown="state.handleKeyDown"
    >
      <div class="flex flex-col">
        <!-- Image -->
        <div
          v-if="image"
          :class="cn(
            'relative w-full overflow-hidden bg-muted',
            state.resolvedRatio !== 'auto' ? state.ratioClassMap[state.resolvedRatio] : 'aspect-[5/3]',
            css?.image,
          )"
        >
          <img
            :src="image"
            alt=""
            loading="lazy"
            decoding="async"
            :class="cn(
              'absolute inset-0 h-full w-full',
              state.fitClassMap[state.resolvedFit],
              'object-center transition-transform duration-200 group-hover:scale-[1.01]',
            )"
          />
        </div>

        <!-- Content -->
        <div :class="cn('flex flex-col gap-2 px-5 py-4', css?.content)">
          <!-- Domain -->
          <div v-if="state.displayDomain" class="flex items-center gap-2 text-xs text-muted-foreground">
            <img
              v-if="favicon"
              :src="favicon"
              alt=""
              aria-hidden="true"
              width="16"
              height="16"
              class="size-4 rounded-full object-cover"
              loading="lazy"
              decoding="async"
            />
            <div
              v-else
              class="flex size-4 shrink-0 items-center justify-center rounded-full border border-border/60 bg-muted"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="10"
                height="10"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="h-2.5 w-2.5"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="10" />
                <line
                  x1="2"
                  x2="22"
                  y1="12"
                  y2="12"
                />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
            </div>
            <span>{{ state.displayDomain }}</span>
          </div>

          <!-- Title -->
          <h3
            v-if="title"
            class="text-base font-medium text-pretty text-foreground"
          >
            <span class="line-clamp-2">{{ title }}</span>
          </h3>

          <!-- Description -->
          <p v-if="description" class="leading-snug text-pretty text-muted-foreground">
            <span class="line-clamp-2">{{ description }}</span>
          </p>
        </div>
      </div>
    </div>
  </article>
</template>
