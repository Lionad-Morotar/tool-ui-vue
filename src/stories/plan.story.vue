<script setup lang="ts">
import { reactive } from 'vue';
import { Plan } from '@lionad/vtu-components';
import { useStoryLocale } from './_shared/use-story-locale';
import type { PlanTodoStatus } from '@lionad/vtu-components/plan/schema';

const subtitle = useStoryLocale({ zh: '任务计划列表组件，支持进度追踪、可展开描述和状态切换', en: 'Task plan list component with progress tracking, expandable descriptions, and status cycling.' });

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

const basicTodoList = useStoryLocale({ zh: '基础待办列表', en: 'Basic Todo List' })
const withDescriptions = useStoryLocale({ zh: '含描述', en: 'With Descriptions' })
const allStatuses = useStoryLocale({ zh: '全部状态', en: 'All Statuses' })
const allComplete = useStoryLocale({ zh: '全部完成', en: 'All Complete' })
const interactiveClickToCycleStatus = useStoryLocale({ zh: '交互 - 点击切换状态', en: 'Interactive - Click to Cycle Status' })
const withProgress = useStoryLocale({ zh: '含进度', en: 'With Progress' })
const minimal = useStoryLocale({ zh: '极简', en: 'Minimal' })

// Basic variant
const deploymentPlanTitle = useStoryLocale({ zh: '部署计划', en: 'Deployment Plan' })
const deploymentPlanDesc = useStoryLocale({ zh: '部署新功能的步骤', en: 'Steps to deploy the new feature' })
const runMigrations = useStoryLocale({ zh: '运行数据库迁移', en: 'Run database migrations' })
const updateEnvVars = useStoryLocale({ zh: '更新环境变量', en: 'Update environment variables' })
const deployStaging = useStoryLocale({ zh: '部署到预发布环境', en: 'Deploy to staging' })
const runSmokeTests = useStoryLocale({ zh: '运行冒烟测试', en: 'Run smoke tests' })
const deployProd = useStoryLocale({ zh: '部署到生产环境', en: 'Deploy to production' })

// Descriptions variant
const projectSetupTitle = useStoryLocale({ zh: '项目初始化', en: 'Project Setup' })
const projectSetupDesc = useStoryLocale({ zh: '初始配置任务', en: 'Initial configuration tasks' })
const initRepo = useStoryLocale({ zh: '初始化仓库', en: 'Initialize repository' })
const initRepoDesc = useStoryLocale({ zh: '创建 Git 仓库并推送到远程', en: 'Create Git repo and push to remote' })
const setupCI = useStoryLocale({ zh: '配置 CI/CD', en: 'Setup CI/CD' })
const setupCIDesc = useStoryLocale({ zh: '配置 GitHub Actions', en: 'Configure GitHub Actions' })
const configEnv = useStoryLocale({ zh: '配置环境', en: 'Configure environment' })
const configEnvDesc = useStoryLocale({ zh: '设置开发、预发布、生产环境', en: 'Setup dev, staging, prod environments' })
const addMonitoring = useStoryLocale({ zh: '添加监控', en: 'Add monitoring' })
const addMonitoringDesc = useStoryLocale({ zh: '设置错误追踪和分析', en: 'Setup error tracking and analytics' })

// All statuses variant
const taskOverviewTitle = useStoryLocale({ zh: '任务概览', en: 'Task Overview' })
const completedTask = useStoryLocale({ zh: '已完成任务', en: 'Completed task' })
const inProgressTask = useStoryLocale({ zh: '进行中任务', en: 'In progress task' })
const pendingTask = useStoryLocale({ zh: '待处理任务', en: 'Pending task' })
const cancelledTask = useStoryLocale({ zh: '已取消任务', en: 'Cancelled task' })

// All complete variant
const projectCompleteTitle = useStoryLocale({ zh: '项目完成', en: 'Project Complete' })
const projectCompleteDesc = useStoryLocale({ zh: '所有任务已成功完成', en: 'All tasks finished successfully' })
const researchTask = useStoryLocale({ zh: '调研', en: 'Research' })
const designTask = useStoryLocale({ zh: '设计', en: 'Design' })
const developmentTask = useStoryLocale({ zh: '开发', en: 'Development' })
const testingTask = useStoryLocale({ zh: '测试', en: 'Testing' })

// Interactive variant
const interactiveHint = useStoryLocale({ zh: '点击任意待办项以循环切换状态', en: 'Click on any todo item to cycle through statuses' })
const interactivePlanTitle = useStoryLocale({ zh: '交互式计划', en: 'Interactive Plan' })
const interactivePlanDesc = useStoryLocale({ zh: '点击项目更改状态', en: 'Click items to change status' })

// Progress variant
const projectMilestonesTitle = useStoryLocale({ zh: '项目里程碑', en: 'Project Milestones' })
const projectMilestonesDesc = useStoryLocale({ zh: '追踪项目整体完成情况', en: 'Track overall project completion' })
const requirementsGathering = useStoryLocale({ zh: '需求收集', en: 'Requirements gathering' })
const architectureDesign = useStoryLocale({ zh: '架构设计', en: 'Architecture design' })
const implementation = useStoryLocale({ zh: '实现', en: 'Implementation' })
const codeReview = useStoryLocale({ zh: '代码审查', en: 'Code review' })
const deploymentTask = useStoryLocale({ zh: '部署', en: 'Deployment' })

// Minimal variant
const simplePlanTitle = useStoryLocale({ zh: '简单计划', en: 'Simple Plan' })
const taskOne = useStoryLocale({ zh: '任务一', en: 'Task one' })
const taskTwo = useStoryLocale({ zh: '任务二', en: 'Task two' })
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
