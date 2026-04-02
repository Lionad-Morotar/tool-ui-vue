<script setup lang="ts">
import { reactive } from 'vue';
import { Plan } from '../components';
import type { PlanTodoStatus } from '../components/plan/schema';

/**
 * # Plan
 *
 * A component for displaying a list of tasks/todos with progress tracking.
 * Shows completion status, supports expandable descriptions, and celebrates
 * progress milestones.
 *
 * ## Props
 *
 * | Prop | Type | Default | Description |
 * |------|------|---------|-------------|
 * | id | string | required | Unique identifier for the component |
 * | title | string | required | Plan title |
 * | description | string | undefined | Optional plan description |
 * | todos | PlanTodo[] | required | Array of todo items |
 * | maxVisibleTodos | number | 4 | Maximum todos to show before "show more" |
 * | className | string | undefined | Additional CSS classes |
 *
 * ## Todo Status
 *
 * - `pending` - Task not started
 * - `in_progress` - Task currently active (with shimmer animation)
 * - `completed` - Task finished
 * - `cancelled` - Task cancelled
 *
 * ## Emits
 *
 * | Event | Payload | Description |
 * |-------|---------|-------------|
 * | todoClick | todoId: string, index: number | Emitted when a todo is clicked |
 *
 * ## Usage
 *
 * ```vue
 * <Plan
 *   id="deployment-plan"
 *   title="Deployment Plan"
 *   description="Steps to deploy the feature"
 *   :todos="[
 *     { id: '1', label: 'Run migrations', status: 'completed' },
 *     { id: '2', label: 'Deploy app', status: 'in_progress' },
 *     { id: '3', label: 'Verify', status: 'pending' },
 *   ]"
 * />
 * ```
 */

const interactivePlan = reactive({
  todos: [
    { id: '1', label: 'Design system setup', description: 'Configure Tailwind and colors', status: 'completed' as PlanTodoStatus },
    { id: '2', label: 'Component library', description: 'Build core UI components', status: 'in_progress' as PlanTodoStatus },
    { id: '3', label: 'Documentation', description: 'Write usage guides', status: 'pending' as PlanTodoStatus },
    { id: '4', label: 'Testing', description: 'Unit and integration tests', status: 'pending' as PlanTodoStatus },
  ]
});

function cycleStatus(index: number) {
  const statusOrder: PlanTodoStatus[] = ['pending', 'in_progress', 'completed', 'cancelled'];
  const currentStatus = interactivePlan.todos[index].status;
  const nextIndex = (statusOrder.indexOf(currentStatus) + 1) % statusOrder.length;
  interactivePlan.todos[index].status = statusOrder[nextIndex];
}
</script>

<template>
  <Story title="Plan/All Variants">
    <Variant title="Basic Todo List">
      <div class="w-full max-w-md">
        <plan
          id="plan-basic"
          title="Deployment Plan"
          description="Steps to deploy the new feature"
          :todos="[
            { id: '1', label: 'Run database migrations', status: 'completed' },
            { id: '2', label: 'Update environment variables', status: 'in_progress' },
            { id: '3', label: 'Deploy to staging', status: 'pending' },
            { id: '4', label: 'Run smoke tests', status: 'pending' },
            { id: '5', label: 'Deploy to production', status: 'pending' },
          ]"
        />
      </div>
    </Variant>

    <Variant title="With Descriptions">
      <div class="w-full max-w-md">
        <plan
          id="plan-descriptions"
          title="Project Setup"
          description="Initial configuration tasks"
          :todos="[
            { id: '1', label: 'Initialize repository', description: 'Create Git repo and push to remote', status: 'completed' },
            { id: '2', label: 'Setup CI/CD', description: 'Configure GitHub Actions', status: 'completed' },
            { id: '3', label: 'Configure environment', description: 'Setup dev, staging, prod environments', status: 'in_progress' },
            { id: '4', label: 'Add monitoring', description: 'Setup error tracking and analytics', status: 'pending' },
          ]"
        />
      </div>
    </Variant>

    <Variant title="All Statuses">
      <div class="w-full max-w-md">
        <plan
          id="plan-all-statuses"
          title="Task Overview"
          :todos="[
            { id: '1', label: 'Completed task', status: 'completed' },
            { id: '2', label: 'In progress task', status: 'in_progress' },
            { id: '3', label: 'Pending task', status: 'pending' },
            { id: '4', label: 'Cancelled task', status: 'cancelled' },
          ]"
        />
      </div>
    </Variant>

    <Variant title="All Complete">
      <div class="w-full max-w-md">
        <plan
          id="plan-complete"
          title="Project Complete"
          description="All tasks finished successfully"
          :todos="[
            { id: '1', label: 'Research', status: 'completed' },
            { id: '2', label: 'Design', status: 'completed' },
            { id: '3', label: 'Development', status: 'completed' },
            { id: '4', label: 'Testing', status: 'completed' },
          ]"
        />
      </div>
    </Variant>

    <Variant title="Interactive - Click to Cycle Status">
      <div class="w-full max-w-md">
        <p class="mb-4 text-sm text-muted-foreground">Click on any todo item to cycle through statuses</p>
        <plan
          id="plan-interactive"
          title="Interactive Plan"
          description="Click items to change status"
          :todos="interactivePlan.todos"
          @todo-click="(_, index) => cycleStatus(index)"
        />
      </div>
    </Variant>

    <Variant title="With Progress">
      <div class="w-full max-w-md">
        <plan
          id="plan-progress"
          title="Project Milestones"
          description="Track overall project completion"
          :todos="[
            { id: '1', label: 'Requirements gathering', status: 'completed' },
            { id: '2', label: 'Architecture design', status: 'completed' },
            { id: '3', label: 'Implementation', status: 'in_progress' },
            { id: '4', label: 'Code review', status: 'pending' },
            { id: '5', label: 'Deployment', status: 'pending' },
          ]"
        />
      </div>
    </Variant>

    <Variant title="Minimal">
      <div class="w-full max-w-md">
        <plan
          id="plan-minimal"
          title="Simple Plan"
          :todos="[
            { id: '1', label: 'Task one', status: 'completed' },
            { id: '2', label: 'Task two', status: 'pending' },
          ]"
        />
      </div>
    </Variant>
  </Story>
</template>
