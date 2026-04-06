// Plan component state layer - Headless architecture
// All business logic lives here, index.vue is UI-only

import { ref, computed, watch, type ComputedRef, type Ref } from 'vue';
import type { PlanProps, PlanTodo } from '../schema';

export type PlanEmitFn = {
  (e: 'todoClick', todoId: string, index: number): void;
};

export interface PlanState {
  expandedTodos: Ref<Set<string>>;
  isCelebrating: Ref<boolean>;
  prevProgress: Ref<number>;
  showMoreExpanded: Ref<boolean>;
  visibleTodos: ComputedRef<PlanTodo[]>;
  hiddenTodos: ComputedRef<PlanTodo[]>;
  hiddenCount: ComputedRef<number>;
  progress: ComputedRef<{
    total: number;
    completed: number;
    percent: number;
    allComplete: boolean;
  }>;
  toggleExpand: (todoId: string) => void;
  handleTodoClick: (todo: PlanTodo, index: number) => void;
}

export function usePlan(props: PlanProps, emit: PlanEmitFn): PlanState {
  const todos = computed(() => props.todos);
  const maxVisibleTodos = computed(() => props.maxVisibleTodos ?? 4);

  const expandedTodos = ref<Set<string>>(new Set());
  const isCelebrating = ref(false);
  const prevProgress = ref(0);
  const showMoreExpanded = ref(false);

  const visibleTodos = computed(() => {
    return todos.value.slice(0, maxVisibleTodos.value);
  });

  const hiddenTodos = computed(() => {
    return todos.value.slice(maxVisibleTodos.value);
  });

  const hiddenCount = computed(() => hiddenTodos.value.length);

  const progress = computed(() => {
    const total = todos.value.length;
    const completed = todos.value.filter((t) => t.status === 'completed').length;
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

  return {
    expandedTodos,
    isCelebrating,
    prevProgress,
    showMoreExpanded,
    visibleTodos,
    hiddenTodos,
    hiddenCount,
    progress,
    toggleExpand,
    handleTodoClick,
  };
}
