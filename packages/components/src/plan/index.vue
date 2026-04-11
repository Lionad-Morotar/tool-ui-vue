<script setup lang="ts">
import { cn } from '@lionad/vtu-core';
import { useI18n } from '@lionad/vtu-core/i18n';
import { reactive } from 'vue';
import { usePlan } from './states';
import type { PlanProps } from './schema';

defineOptions({ name: 'CmptPlan', inheritAttrs: false })

const props = withDefaults(defineProps<PlanProps & { css?: { root?: string } }>(), {
  maxVisibleTodos: 4,
  css: () => ({ root: '' })
})

const emit = defineEmits<{
  todoClick: [todoId: string, index: number];
}>();

// All business logic delegated to states layer
const state = reactive(usePlan(props, emit));

// i18n
const { t } = useI18n()
</script>

<template>
  <div
    v-bind="$attrs"
    :class="cn(
      'isolate w-full max-w-xl min-w-80 gap-4 rounded-2xl border border-border bg-card py-4 shadow-sm',
      css?.root
    )"
    data-slot="plan"
    :data-tool-ui-id="id"
  >
    <!-- Header -->
    <div class="flex flex-row items-start justify-between gap-4 px-6">
      <div class="space-y-1.5">
        <h2 class="leading-5 font-medium text-pretty">{{ title }}</h2>
        <p v-if="description" class="text-sm text-muted-foreground">{{ description }}</p>
      </div>
      <svg
        v-if="state.progress.allComplete"
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="mt-0.5 size-5 shrink-0 text-emerald-500"
      >
        <path d="M20 6 9 17l-5-5" />
      </svg>
    </div>

    <div class="min-w-0 px-4">
      <div class="min-w-0 rounded-lg bg-muted/70 px-6 py-4">
        <div class="mb-2 text-sm text-muted-foreground">
          {{ state.progress.completed }} / {{ state.progress.total }} {{ t('plan.complete') }}
        </div>

        <!-- Progress Bar -->
        <div
          class="relative mb-3 h-1.5 overflow-hidden rounded-full bg-muted"
          role="progressbar"
          aria-valuemin="0"
          aria-valuemax="100"
          :aria-valuenow="state.progress.percent"
        >
          <div
            :class="cn(
              'h-full rounded-full transition-all duration-500',
              state.progress.percent === 100
                ? 'motion-safe:animate-in motion-safe:fade-in bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-400 motion-safe:duration-500 motion-safe:ease-out'
                : 'bg-primary',
            )"
            :style="{
              width: `${state.progress.percent}%`,
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.3), 0 1px 2px rgba(0,0,0,0.2)',
            }"
          />
          <div
            v-if="state.isCelebrating"
            class="pointer-events-none absolute inset-0 rounded-full motion-safe:animate-pulse"
            :style="{ boxShadow: '0 0 20px rgba(16, 185, 129, 0.6)' }"
          />
        </div>

        <!-- Todos -->
        <ul class="mt-4 min-w-0 space-y-1">
          <li
            v-for="(todo, index) in state.visibleTodos"
            :key="todo.id"
            :class="cn(
              'relative -mx-2 flex cursor-default items-start gap-3 rounded-md px-2 py-1.5',
            )"
            @click="state.handleTodoClick(todo, index)"
          >
            <div
              v-if="index < state.visibleTodos.length - 1 || state.hiddenCount > 0"
              class="absolute top-6 left-5 w-px bg-border"
              :style="{ height: 'calc(100% + 0.25rem)' }"
              aria-hidden="true"
            />
            <div class="relative z-10">
              <!-- Status Icon -->
              <span
                v-if="todo.status === 'pending'"
                class="flex size-6 shrink-0 items-center justify-center rounded-full border border-border bg-card motion-safe:transition-all motion-safe:duration-200"
                aria-hidden="true"
              />
              <span
                v-else-if="todo.status === 'in_progress'"
                class="flex size-6 shrink-0 items-center justify-center rounded-full border border-border bg-card shadow-[0_0_0_4px_hsl(var(--primary)/0.1)] motion-safe:transition-all motion-safe:duration-300"
                aria-hidden="true"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="size-5 text-primary motion-safe:animate-spin"
                >
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
              </span>
              <span
                v-else-if="todo.status === 'completed'"
                class="motion-safe:animate-in motion-safe:fade-in motion-safe:zoom-in-75 flex size-6 shrink-0 items-center justify-center rounded-full border border-primary bg-primary shadow-sm motion-safe:duration-300 motion-safe:ease-out"
                aria-hidden="true"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="3"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="motion-safe:animate-in motion-safe:fade-in motion-safe:zoom-in-75 motion-safe:fill-mode-both size-4 text-primary-foreground motion-safe:delay-75 motion-safe:duration-200"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </span>
              <span
                v-else-if="todo.status === 'cancelled'"
                class="motion-safe:animate-in motion-safe:fade-in motion-safe:zoom-in-75 flex size-6 shrink-0 items-center justify-center rounded-full border border-destructive bg-destructive shadow-sm motion-safe:duration-300 motion-safe:ease-out dark:border-red-600 dark:bg-red-600"
                aria-hidden="true"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="3"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="motion-safe:animate-in motion-safe:fade-in motion-safe:zoom-in-75 motion-safe:fill-mode-both size-4 text-white motion-safe:delay-75 motion-safe:duration-200"
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </span>
            </div>
            <div class="min-w-0 flex-1">
              <span
                :class="cn(
                  'text-sm leading-6 font-medium break-words',
                  todo.status === 'pending' && 'text-muted-foreground',
                  todo.status === 'in_progress' && 'motion-safe:shimmer shimmer-invert text-foreground',
                  (todo.status === 'completed' || todo.status === 'cancelled') && 'text-muted-foreground',
                )"
              >
                {{ todo.label }}
              </span>
              <p
                v-if="todo.description && state.expandedTodos.has(todo.id)"
                class="min-w-0 pr-2 pb-1.5 text-sm text-pretty break-words text-muted-foreground"
              >
                {{ todo.description }}
              </p>
            </div>
            <button
              v-if="todo.description"
              type="button"
              class="mt-0.5 size-4 shrink-0 text-muted-foreground/50 transition-colors hover:text-muted-foreground"
              @click.stop="state.toggleExpand(todo.id)"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                :class="state.expandedTodos.has(todo.id) ? 'rotate-90' : ''"
                class="motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-[cubic-bezier(0.34,1.56,0.64,1)]"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          </li>

          <!-- Show More -->
          <li v-if="state.hiddenCount > 0" class="mt-1">
            <button
              type="button"
              class="flex cursor-default items-start justify-start gap-2 py-1 text-sm font-normal text-muted-foreground hover:text-primary"
              @click="state.showMoreExpanded = !state.showMoreExpanded"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="mt-0.5 size-4 shrink-0 text-muted-foreground/70"
              >
                <circle cx="12" cy="12" r="1" />
                <circle cx="19" cy="12" r="1" />
                <circle cx="5" cy="12" r="1" />
              </svg>
              <span>{{ t('plan.more', { count: state.hiddenCount }) }}</span>
            </button>

            <!-- Hidden Todos -->
            <ul v-if="state.showMoreExpanded" class="-mx-2 space-y-2 px-2 pt-2">
              <li
                v-for="(todo, index) in state.hiddenTodos"
                :key="todo.id"
                :class="cn(
                  'relative -mx-2 flex cursor-default items-start gap-3 rounded-md px-2 py-1.5',
                )"
                @click="state.handleTodoClick(todo, state.visibleTodos.length + index)"
              >
                <div
                  v-if="index < state.hiddenTodos.length - 1"
                  class="absolute top-6 left-5 w-px bg-border"
                  :style="{ height: 'calc(100% + 0.25rem)' }"
                  aria-hidden="true"
                />
                <div class="relative z-10">
                  <!-- Status Icon -->
                  <span
                    v-if="todo.status === 'pending'"
                    class="flex size-6 shrink-0 items-center justify-center rounded-full border border-border bg-card motion-safe:transition-all motion-safe:duration-200"
                    aria-hidden="true"
                  />
                  <span
                    v-else-if="todo.status === 'in_progress'"
                    class="flex size-6 shrink-0 items-center justify-center rounded-full border border-border bg-card shadow-[0_0_0_4px_hsl(var(--primary)/0.1)] motion-safe:transition-all motion-safe:duration-300"
                    aria-hidden="true"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="size-5 text-primary motion-safe:animate-spin"
                    >
                      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                    </svg>
                  </span>
                  <span
                    v-else-if="todo.status === 'completed'"
                    class="motion-safe:animate-in motion-safe:fade-in motion-safe:zoom-in-75 flex size-6 shrink-0 items-center justify-center rounded-full border border-primary bg-primary shadow-sm motion-safe:duration-300 motion-safe:ease-out"
                    aria-hidden="true"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="3"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="motion-safe:animate-in motion-safe:fade-in motion-safe:zoom-in-75 motion-safe:fill-mode-both size-4 text-primary-foreground motion-safe:delay-75 motion-safe:duration-200"
                    >
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  </span>
                  <span
                    v-else-if="todo.status === 'cancelled'"
                    class="motion-safe:animate-in motion-safe:fade-in motion-safe:zoom-in-75 flex size-6 shrink-0 items-center justify-center rounded-full border border-destructive bg-destructive shadow-sm motion-safe:duration-300 motion-safe:ease-out dark:border-red-600 dark:bg-red-600"
                    aria-hidden="true"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="3"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="motion-safe:animate-in motion-safe:fade-in motion-safe:zoom-in-75 motion-safe:fill-mode-both size-4 text-white motion-safe:delay-75 motion-safe:duration-200"
                    >
                      <path d="M18 6 6 18" />
                      <path d="m6 6 12 12" />
                    </svg>
                  </span>
                </div>
                <div class="min-w-0 flex-1">
                  <span
                    :class="cn(
                      'text-sm leading-6 font-medium break-words',
                      todo.status === 'pending' && 'text-muted-foreground',
                      todo.status === 'in_progress' && 'motion-safe:shimmer shimmer-invert text-foreground',
                      (todo.status === 'completed' || todo.status === 'cancelled') && 'text-muted-foreground',
                    )"
                  >
                    {{ todo.label }}
                  </span>
                  <p
                    v-if="todo.description && state.expandedTodos.has(todo.id)"
                    class="min-w-0 pr-2 pb-1.5 text-sm text-pretty break-words text-muted-foreground"
                  >
                    {{ todo.description }}
                  </p>
                </div>
                <button
                  v-if="todo.description"
                  type="button"
                  class="mt-0.5 size-4 shrink-0 text-muted-foreground/50 transition-colors hover:text-muted-foreground"
                  @click.stop="state.toggleExpand(todo.id)"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    :class="state.expandedTodos.has(todo.id) ? 'rotate-90' : ''"
                    class="motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-[cubic-bezier(0.34,1.56,0.64,1)]"
                  >
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </button>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
