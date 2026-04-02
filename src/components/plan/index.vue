<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { cn } from "./_adapter";
import type { PlanProps, PlanTodo } from "./schema";

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
  const completed = props.todos.filter((t) => t.status === "completed").length;
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
  emit("todoClick", todo.id, index);
}
</script>

<template>
  <div
    :class="cn(
      'isolate w-full max-w-xl min-w-80 gap-4 py-4 border-border rounded-2xl border bg-card shadow-sm',
      className
    )"
    data-slot="plan"
    :data-tool-ui-id="id"
  >
    <!-- Header -->
    <div class="flex flex-row items-start justify-between gap-4 px-6">
      <div class="space-y-1.5">
        <h2 class="leading-5 font-medium text-pretty">{{ title }}</h2>
        <p v-if="description" class="text-muted-foreground text-sm">{{ description }}</p>
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
        <path d="M20 6 9 17l-5-5"/>
      </svg>
    </div>

    <div class="min-w-0 px-4">
      <div class="min-w-0 bg-muted/70 rounded-lg px-6 py-4">
        <div class="text-muted-foreground mb-2 text-sm">
          {{ progress.completed }} of {{ progress.total }} complete
        </div>

        <!-- Progress Bar -->
        <div
          class="bg-muted relative mb-3 h-1.5 overflow-hidden rounded-full"
          role="progressbar"
          aria-valuemin="0"
          aria-valuemax="100"
          :aria-valuenow="progress.percent"
        >
          <div
            :class="cn(
              'h-full rounded-full transition-all duration-500',
              progress.percent === 100
                ? 'bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-400 motion-safe:animate-in motion-safe:fade-in motion-safe:duration-500 motion-safe:ease-out'
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
        <ul class="min-w-0 space-y-1 mt-4">
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
              class="bg-border absolute top-6 left-5 w-px"
              :style="{ height: 'calc(100% + 0.25rem)' }"
              aria-hidden="true"
            />
            <div class="relative z-10">
              <!-- Status Icon -->
              <span
                v-if="todo.status === 'pending'"
                class="border-border bg-card flex size-6 shrink-0 items-center justify-center rounded-full border motion-safe:transition-all motion-safe:duration-200"
                aria-hidden="true"
              />
              <span
                v-else-if="todo.status === 'in_progress'"
                class="border-border bg-card flex size-6 shrink-0 items-center justify-center rounded-full border shadow-[0_0_0_4px_hsl(var(--primary)/0.1)] motion-safe:transition-all motion-safe:duration-300"
                aria-hidden="true"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary size-5 motion-safe:animate-spin">
                  <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                </svg>
              </span>
              <span
                v-else-if="todo.status === 'completed'"
                class="border-primary bg-primary flex size-6 shrink-0 items-center justify-center rounded-full border shadow-sm motion-safe:animate-in motion-safe:fade-in motion-safe:zoom-in-75 motion-safe:duration-300 motion-safe:ease-out"
                aria-hidden="true"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="text-primary-foreground size-4 motion-safe:animate-in motion-safe:fade-in motion-safe:zoom-in-75 motion-safe:delay-75 motion-safe:duration-200 motion-safe:fill-mode-both">
                  <path d="M20 6 9 17l-5-5"/>
                </svg>
              </span>
              <span
                v-else-if="todo.status === 'cancelled'"
                class="border-destructive bg-destructive flex size-6 shrink-0 items-center justify-center rounded-full border shadow-sm motion-safe:animate-in motion-safe:fade-in motion-safe:zoom-in-75 motion-safe:duration-300 motion-safe:ease-out dark:border-red-600 dark:bg-red-600"
                aria-hidden="true"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="size-4 text-white motion-safe:animate-in motion-safe:fade-in motion-safe:zoom-in-75 motion-safe:delay-75 motion-safe:duration-200 motion-safe:fill-mode-both">
                  <path d="M18 6 6 18"/>
                  <path d="m6 6 12 12"/>
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
                class="text-muted-foreground min-w-0 pr-2 pb-1.5 text-sm text-pretty break-words"
              >
                {{ todo.description }}
              </p>
            </div>
            <button
              v-if="todo.description"
              type="button"
              class="text-muted-foreground/50 hover:text-muted-foreground mt-0.5 size-4 shrink-0 transition-colors"
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
                <path d="m9 18 6-6-6-6"/>
              </svg>
            </button>
          </li>

          <!-- Show More -->
          <li v-if="hiddenCount > 0" class="mt-1">
            <button
              type="button"
              class="text-muted-foreground hover:text-primary flex cursor-default items-start justify-start gap-2 py-1 text-sm font-normal"
              @click="showMoreExpanded = !showMoreExpanded"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-muted-foreground/70 mt-0.5 size-4 shrink-0">
                <circle cx="12" cy="12" r="1"/>
                <circle cx="19" cy="12" r="1"/>
                <circle cx="5" cy="12" r="1"/>
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
                  class="bg-border absolute top-6 left-5 w-px"
                  :style="{ height: 'calc(100% + 0.25rem)' }"
                  aria-hidden="true"
                />
                <div class="relative z-10">
                  <!-- Status Icon -->
                  <span
                    v-if="todo.status === 'pending'"
                    class="border-border bg-card flex size-6 shrink-0 items-center justify-center rounded-full border motion-safe:transition-all motion-safe:duration-200"
                    aria-hidden="true"
                  />
                  <span
                    v-else-if="todo.status === 'in_progress'"
                    class="border-border bg-card flex size-6 shrink-0 items-center justify-center rounded-full border shadow-[0_0_0_4px_hsl(var(--primary)/0.1)] motion-safe:transition-all motion-safe:duration-300"
                    aria-hidden="true"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary size-5 motion-safe:animate-spin">
                      <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                    </svg>
                  </span>
                  <span
                    v-else-if="todo.status === 'completed'"
                    class="border-primary bg-primary flex size-6 shrink-0 items-center justify-center rounded-full border shadow-sm motion-safe:animate-in motion-safe:fade-in motion-safe:zoom-in-75 motion-safe:duration-300 motion-safe:ease-out"
                    aria-hidden="true"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="text-primary-foreground size-4 motion-safe:animate-in motion-safe:fade-in motion-safe:zoom-in-75 motion-safe:delay-75 motion-safe:duration-200 motion-safe:fill-mode-both">
                      <path d="M20 6 9 17l-5-5"/>
                    </svg>
                  </span>
                  <span
                    v-else-if="todo.status === 'cancelled'"
                    class="border-destructive bg-destructive flex size-6 shrink-0 items-center justify-center rounded-full border shadow-sm motion-safe:animate-in motion-safe:fade-in motion-safe:zoom-in-75 motion-safe:duration-300 motion-safe:ease-out dark:border-red-600 dark:bg-red-600"
                    aria-hidden="true"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="size-4 text-white motion-safe:animate-in motion-safe:fade-in motion-safe:zoom-in-75 motion-safe:delay-75 motion-safe:duration-200 motion-safe:fill-mode-both">
                      <path d="M18 6 6 18"/>
                      <path d="m6 6 12 12"/>
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
                    class="text-muted-foreground min-w-0 pr-2 pb-1.5 text-sm text-pretty break-words"
                  >
                    {{ todo.description }}
                  </p>
                </div>
                <button
                  v-if="todo.description"
                  type="button"
                  class="text-muted-foreground/50 hover:text-muted-foreground mt-0.5 size-4 shrink-0 transition-colors"
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
                    <path d="m9 18 6-6-6-6"/>
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
