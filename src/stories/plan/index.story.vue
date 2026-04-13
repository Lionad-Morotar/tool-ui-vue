<script setup lang="ts">
import { reactive, watch } from 'vue';
import { Plan } from '@lionad/vtu-components';
import { useStoryLocale, currentLocale } from '../_shared/use-story-locale'
import messages from './i18n';
import type { PlanTodoStatus } from '@lionad/vtu-components/plan/schema';

const subtitle = useStoryLocale('content.subtitle', messages);

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
 * | css | { root?: string } | undefined | CSS classes for component elements |
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

const interactivePlanZh = {
  todos: [
    { id: '1', label: '设计系统搭建', description: '配置 Tailwind 和颜色', status: 'completed' as PlanTodoStatus },
    { id: '2', label: '组件库构建', description: '构建核心 UI 组件', status: 'in_progress' as PlanTodoStatus },
    { id: '3', label: '文档编写', description: '编写使用指南', status: 'pending' as PlanTodoStatus },
    { id: '4', label: '测试', description: '单元和集成测试', status: 'pending' as PlanTodoStatus },
  ]
}

const interactivePlanEn = {
  todos: [
    { id: '1', label: 'Design system setup', description: 'Configure Tailwind and colors', status: 'completed' as PlanTodoStatus },
    { id: '2', label: 'Component library', description: 'Build core UI components', status: 'in_progress' as PlanTodoStatus },
    { id: '3', label: 'Documentation', description: 'Write usage guides', status: 'pending' as PlanTodoStatus },
    { id: '4', label: 'Testing', description: 'Unit and integration tests', status: 'pending' as PlanTodoStatus },
  ]
}

const interactivePlan = reactive({
  todos: interactivePlanEn.todos,
})

watch(currentLocale, () => {
  const next = currentLocale.value === 'zh-CN' ? interactivePlanZh : interactivePlanEn;
  interactivePlan.todos = interactivePlan.todos.map((todo, i) => ({
    ...todo,
    label: next.todos[i].label,
    description: next.todos[i].description,
  }));
});

function cycleStatus(index: number) {
  const statusOrder: PlanTodoStatus[] = ['pending', 'in_progress', 'completed', 'cancelled'];
  const currentStatus = interactivePlan.todos[index].status;
  const nextIndex = (statusOrder.indexOf(currentStatus) + 1) % statusOrder.length;
  interactivePlan.todos[index].status = statusOrder[nextIndex];
}

const basicTodoList = useStoryLocale('data.basicTodoList', messages)
const withDescriptions = useStoryLocale('content.withDescriptions', messages)
const allStatuses = useStoryLocale('content.allStatuses', messages)
const allComplete = useStoryLocale('content.allComplete', messages)
const interactiveClickToCycleStatus = useStoryLocale('content.interactiveClickToCycleStatus', messages)
const withProgress = useStoryLocale('content.withProgress', messages)
const minimal = useStoryLocale('content.minimal', messages)

// Basic variant
const deploymentPlanTitle = useStoryLocale('content.deploymentPlanTitle', messages)
const deploymentPlanDesc = useStoryLocale('content.deploymentPlanDesc', messages)
const runMigrations = useStoryLocale('content.runMigrations', messages)
const updateEnvVars = useStoryLocale('content.updateEnvVars', messages)
const deployStaging = useStoryLocale('content.deployStaging', messages)
const runSmokeTests = useStoryLocale('content.runSmokeTests', messages)
const deployProd = useStoryLocale('content.deployProd', messages)

// Descriptions variant
const projectSetupTitle = useStoryLocale('content.projectSetupTitle', messages)
const projectSetupDesc = useStoryLocale('content.projectSetupDesc', messages)
const initRepo = useStoryLocale('content.initRepo', messages)
const initRepoDesc = useStoryLocale('content.initRepoDesc', messages)
const setupCI = useStoryLocale('content.setupCI', messages)
const setupCIDesc = useStoryLocale('content.setupCIDesc', messages)
const configEnv = useStoryLocale('content.configEnv', messages)
const configEnvDesc = useStoryLocale('content.configEnvDesc', messages)
const addMonitoring = useStoryLocale('content.addMonitoring', messages)
const addMonitoringDesc = useStoryLocale('content.addMonitoringDesc', messages)

// All statuses variant
const taskOverviewTitle = useStoryLocale('content.taskOverviewTitle', messages)
const completedTask = useStoryLocale('content.completedTask', messages)
const inProgressTask = useStoryLocale('content.inProgressTask', messages)
const pendingTask = useStoryLocale('content.pendingTask', messages)
const cancelledTask = useStoryLocale('content.cancelledTask', messages)

// All complete variant
const projectCompleteTitle = useStoryLocale('content.projectCompleteTitle', messages)
const projectCompleteDesc = useStoryLocale('content.projectCompleteDesc', messages)
const researchTask = useStoryLocale('content.researchTask', messages)
const designTask = useStoryLocale('content.designTask', messages)
const developmentTask = useStoryLocale('content.developmentTask', messages)
const testingTask = useStoryLocale('content.testingTask', messages)

// Interactive variant
const interactiveHint = useStoryLocale('content.interactiveHint', messages)
const interactivePlanTitle = useStoryLocale('content.interactivePlanTitle', messages)
const interactivePlanDesc = useStoryLocale('content.interactivePlanDesc', messages)

// Progress variant
const projectMilestonesTitle = useStoryLocale('content.projectMilestonesTitle', messages)
const projectMilestonesDesc = useStoryLocale('content.projectMilestonesDesc', messages)
const requirementsGathering = useStoryLocale('content.requirementsGathering', messages)
const architectureDesign = useStoryLocale('content.architectureDesign', messages)
const implementation = useStoryLocale('content.implementation', messages)
const codeReview = useStoryLocale('content.codeReview', messages)
const deploymentTask = useStoryLocale('content.deploymentTask', messages)

// Minimal variant
const simplePlanTitle = useStoryLocale('content.simplePlanTitle', messages)
const taskOne = useStoryLocale('content.taskOne', messages)
const taskTwo = useStoryLocale('content.taskTwo', messages)
</script>

<template>
  <Story title="Plan/All Variants">
    <Variant :title="basicTodoList">
      <p class="mb-3 text-xs text-muted-foreground">{{ subtitle }}</p>
      <div class="w-full max-w-md">
        <plan
          id="plan-basic"
          :title="deploymentPlanTitle"
          :description="deploymentPlanDesc"
          :todos="[
            { id: '1', label: runMigrations, status: 'completed' },
            { id: '2', label: updateEnvVars, status: 'in_progress' },
            { id: '3', label: deployStaging, status: 'pending' },
            { id: '4', label: runSmokeTests, status: 'pending' },
            { id: '5', label: deployProd, status: 'pending' },
          ]"
        />
      </div>
    </Variant>

    <Variant :title="withDescriptions">
      <div class="w-full max-w-md">
        <plan
          id="plan-descriptions"
          :title="projectSetupTitle"
          :description="projectSetupDesc"
          :todos="[
            { id: '1', label: initRepo, description: initRepoDesc, status: 'completed' },
            { id: '2', label: setupCI, description: setupCIDesc, status: 'completed' },
            { id: '3', label: configEnv, description: configEnvDesc, status: 'in_progress' },
            { id: '4', label: addMonitoring, description: addMonitoringDesc, status: 'pending' },
          ]"
        />
      </div>
    </Variant>

    <Variant :title="allStatuses">
      <div class="w-full max-w-md">
        <plan
          id="plan-all-statuses"
          :title="taskOverviewTitle"
          :todos="[
            { id: '1', label: completedTask, status: 'completed' },
            { id: '2', label: inProgressTask, status: 'in_progress' },
            { id: '3', label: pendingTask, status: 'pending' },
            { id: '4', label: cancelledTask, status: 'cancelled' },
          ]"
        />
      </div>
    </Variant>

    <Variant :title="allComplete">
      <div class="w-full max-w-md">
        <plan
          id="plan-complete"
          :title="projectCompleteTitle"
          :description="projectCompleteDesc"
          :todos="[
            { id: '1', label: researchTask, status: 'completed' },
            { id: '2', label: designTask, status: 'completed' },
            { id: '3', label: developmentTask, status: 'completed' },
            { id: '4', label: testingTask, status: 'completed' },
          ]"
        />
      </div>
    </Variant>

    <Variant :title="interactiveClickToCycleStatus">
      <div class="w-full max-w-md">
        <p class="mb-4 text-sm text-muted-foreground">{{ interactiveHint }}</p>
        <plan
          id="plan-interactive"
          :title="interactivePlanTitle"
          :description="interactivePlanDesc"
          :todos="interactivePlan.todos"
          @todo-click="(_, index) => cycleStatus(index)"
        />
      </div>
    </Variant>

    <Variant :title="withProgress">
      <div class="w-full max-w-md">
        <plan
          id="plan-progress"
          :title="projectMilestonesTitle"
          :description="projectMilestonesDesc"
          :todos="[
            { id: '1', label: requirementsGathering, status: 'completed' },
            { id: '2', label: architectureDesign, status: 'completed' },
            { id: '3', label: implementation, status: 'in_progress' },
            { id: '4', label: codeReview, status: 'pending' },
            { id: '5', label: deploymentTask, status: 'pending' },
          ]"
        />
      </div>
    </Variant>

    <Variant :title="minimal">
      <div class="w-full max-w-md">
        <plan
          id="plan-minimal"
          :title="simplePlanTitle"
          :todos="[
            { id: '1', label: taskOne, status: 'completed' },
            { id: '2', label: taskTwo, status: 'pending' },
          ]"
        />
      </div>
    </Variant>
  </Story>
</template>
