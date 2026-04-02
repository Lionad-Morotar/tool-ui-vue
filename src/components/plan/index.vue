<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { cn } from './_adapter';
import type { PlanProps, PlanTodo } from './schema';

const props = withDefaults(defineProps<PlanProps>(), {
  maxVisibleTodos: 4,
});

const emit = defineEmits<{
  todoClick: [todoId: string, index: number];
}>();

const expandedTodos = ref<Set<string>>(new Set());
const isCelebrating = ref(false);
const prevProgress = ref(0);
const showMoreExpanded = ref(false);

const visibleTodos = computed(() => {
  return props.todos.slice(0, props.maxVisibleTodos);
});

const hiddenTodos = computed(() => {
  return props.todos.slice(props.maxVisibleTodos);
});

const hiddenCount = computed(() => hiddenTodos.value.length);

const progress = computed(() => {
  const total = props.todos.length;
  const completed = props.todos.filter((t) => t.status === 'completed').length;
  return {
    total,
    completed,
    percent: total > 0 ? Math.round((completed / total) * 100) : 0,
    allComplete: completed === total && total > 0,
  };
});

// Celebrate when reaching milestones
watch(
  () => progress.value.percent,
  (newPercent, oldPercent) => {
    if (oldPercent !== undefined) {
      prevProgress.value = oldPercent;
    }
    // Celebrate on 25%, 50%, 75%, 100% milestones
    const milestones = [25, 50, 75, 100];
    const crossedMilestone = milestones.some(
      (m) => prevProgress.value < m && newPercent >= m
    );
    if (crossedMilestone) {
      isCelebrating.value = true;
      setTimeout(() => {
        isCelebrating.value = false;
      }, 1000);
    }
  }
);

function toggleExpand(todoId: string) {
  const newSet = new Set(expandedTodos.value);
  if (newSet.has(todoId)) {
    newSet.delete(todoId);
  } else {
    newSet.add(todoId);
  }
  expandedTodos.value = newSet;
}

function handleTodoClick(todo: PlanTodo, index: number) {
  emit('todoClick', todo.id, index);
}
</script>

<template>
  <div
    :class="cn(
      'isolate w-full max-w-xl min-w-80 gap-4 rounded-2xl border border-border bg-card py-4 shadow-sm',
      className
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
        v-if="progress.allComplete"
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
          {{ progress.completed }} of {{ progress.total }} complete
        </div>

        <!-- Progress Bar -->
        <div
          class="relative mb-3 h-1.5 overflow-hidden rounded-full bg-muted"
          role="progressbar"
          aria-valuemin="0"
          aria-valuemax="100"
          :aria-valuenow="progress.percent"
        >
          <div
            :class="cn(
              'h-full rounded-full transition-all duration-500',
              progress.percent === 100
                ? 'motion-safe:animate-in motion-safe:fade-in bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-400 motion-safe:duration-500 motion-safe:ease-out'
                : 'bg-primary',
            )"
            :style="{
              width: `${progress.percent}%`,
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.3), 0 1px 2px rgba(0,0,0,0.2)',
            }"
          />
          <div
            v-if="isCelebrating"
            class="pointer-events-none absolute inset-0 rounded-full motion-safe:animate-pulse"
            :style="{ boxShadow: '0 0 20px rgba(16, 185, 129, 0.6)' }"
          />
        </div>

        <!-- Todos -->
        <ul class="mt-4 min-w-0 space-y-1">
          <li
            v-for="(todo, index) in visibleTodos"
            :key="todo.id"
            :class="cn(
              'relative -mx-2 flex cursor-default items-start gap-3 rounded-md px-2 py-1.5',
            )"
            @click="handleTodoClick(todo, index)"
          >
            <div
              v-if="index < visibleTodos.length - 1 || hiddenCount > 0"
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
                v-if="todo.description && expandedTodos.has(todo.id)"
                class="min-w-0 pr-2 pb-1.5 text-sm text-pretty break-words text-muted-foreground"
              >
                {{ todo.description }}
              </p>
            </div>
            <button
              v-if="todo.description"
              type="button"
              class="mt-0.5 size-4 shrink-0 text-muted-foreground/50 transition-colors hover:text-muted-foreground"
              @click.stop="toggleExpand(todo.id)"
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
                :class="expandedTodos.has(todo.id) ? 'rotate-90' : ''"
                class="motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-[cubic-bezier(0.34,1.56,0.64,1)]"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          </li>

          <!-- Show More -->
          <li v-if="hiddenCount > 0" class="mt-1">
            <button
              type="button"
              class="flex cursor-default items-start justify-start gap-2 py-1 text-sm font-normal text-muted-foreground hover:text-primary"
              @click="showMoreExpanded = !showMoreExpanded"
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
              <span>{{ hiddenCount }} more</span>
            </button>

            <!-- Hidden Todos -->
            <ul v-if="showMoreExpanded" class="-mx-2 space-y-2 px-2 pt-2">
              <li
                v-for="(todo, index) in hiddenTodos"
                :key="todo.id"
                :class="cn(
                  'relative -mx-2 flex cursor-default items-start gap-3 rounded-md px-2 py-1.5',
                )"
                @click="handleTodoClick(todo, visibleTodos.length + index)"
              >
                <div
                  v-if="index < hiddenTodos.length - 1"
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
                    v-if="todo.description && expandedTodos.has(todo.id)"
                    class="min-w-0 pr-2 pb-1.5 text-sm text-pretty break-words text-muted-foreground"
                  >
                    {{ todo.description }}
                  </p>
                </div>
                <button
                  v-if="todo.description"
                  type="button"
                  class="mt-0.5 size-4 shrink-0 text-muted-foreground/50 transition-colors hover:text-muted-foreground"
                  @click.stop="toggleExpand(todo.id)"
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
                    :class="expandedTodos.has(todo.id) ? 'rotate-90' : ''"
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
