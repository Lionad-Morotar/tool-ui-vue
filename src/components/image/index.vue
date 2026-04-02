<script setup lang="ts">
import { reactive } from 'vue';
import { useImage } from './states';
import { cn } from '../../utils';
import type { ImageProps } from './schema';

defineOptions({ name: 'CmptImage', inheritAttrs: false })

const props = withDefaults(defineProps<ImageProps & { css?: { root?: string } }>(), {
  css: () => ({ root: '' })
})

const emit = defineEmits<{
  navigate: [href: string];
}>();

// All business logic delegated to states layer
const state = reactive(useImage({
  ...props,
  emit,
}));
</script>

<template>
  <article
    v-bind="$attrs"
    :class="cn('relative w-full max-w-md min-w-80', css?.root)"
    :lang="state.locale"
    data-slot="image"
    :data-tool-ui-id="id"
  >
    <div
      :class="cn(
        'group @container relative isolate flex w-full min-w-0 flex-col overflow-hidden rounded-xl',
        'border border-border bg-card text-sm shadow-xs',
      )"
    >
      <!-- Image Container -->
      <div
        :class="cn(
          'group relative w-full overflow-hidden bg-muted',
          state.resolvedRatio !== 'auto' ? state.ratioClassMap[state.resolvedRatio] : 'min-h-[160px]',
          href && 'cursor-pointer',
        )"
        :role="href ? 'link' : undefined"
        :tabindex="href ? 0 : undefined"
        @click="state.handleImageClick"
        @keydown="(e: KeyboardEvent) => {
          if (href && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            state.handleImageClick();
          }
        }"
      >
        <img
          :src="src"
          :alt="alt"
          loading="lazy"
          decoding="async"
          :class="cn('absolute inset-0 h-full w-full', state.fitClassMap[state.resolvedFit])"
        />
      </div>

      <!-- Source Attribution -->
      <div v-if="state.hasMetadata" class="flex items-center gap-3 px-4 py-3">
        <button
          v-if="source?.url && state.hasSource"
          type="button"
          class="flex w-full items-center gap-3 text-left hover:opacity-80 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          @click="state.handleSourceClick"
        >
          <div class="flex min-w-0 flex-1 items-center gap-3">
            <img
              v-if="source?.iconUrl"
              :src="source.iconUrl"
              alt=""
              aria-hidden="true"
              width="32"
              height="32"
              class="size-8 shrink-0 rounded-full object-cover"
              loading="lazy"
              decoding="async"
            />
            <div
              v-else-if="state.fallbackInitial"
              class="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground uppercase"
            >
              {{ state.fallbackInitial }}
            </div>
            <div class="min-w-0 flex-1">
              <div v-if="title" class="line-clamp-1 text-sm font-medium text-foreground">
                {{ title }}
              </div>
              <div v-if="state.sourceLabel" class="line-clamp-1 text-xs text-muted-foreground">
                {{ state.sourceLabel }}
              </div>
            </div>
          </div>
        </button>
        <div v-else class="flex min-w-0 flex-1 items-center gap-3">
          <img
            v-if="source?.iconUrl"
            :src="source.iconUrl"
            alt=""
            aria-hidden="true"
            width="32"
            height="32"
            class="size-8 shrink-0 rounded-full object-cover"
            loading="lazy"
            decoding="async"
          />
          <div
            v-else-if="state.fallbackInitial"
            class="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground uppercase"
          >
            {{ state.fallbackInitial }}
          </div>
          <div class="min-w-0 flex-1">
            <div v-if="title" class="line-clamp-1 text-sm font-medium text-foreground">
              {{ title }}
            </div>
            <div v-if="state.sourceLabel" class="line-clamp-1 text-xs text-muted-foreground">
              {{ state.sourceLabel }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </article>
</template>
