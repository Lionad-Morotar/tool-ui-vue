<script setup lang="ts">
import { reactive, computed, watch } from 'vue';
import { ProgressTracker } from '@lionad/vtu-components';
import messages from './i18n';
import { useStoryLocale, currentLocale } from '../_shared/use-story-locale'

const subtitle = useStoryLocale('content.subtitle', messages);
const accountLabel = useStoryLocale('content.accountLabel', messages)
const profileLabel = useStoryLocale('content.profileLabel', messages)
const billingLabel = useStoryLocale('content.billingLabel', messages)
const reviewLabel = useStoryLocale('content.reviewLabel', messages)
const uploadLabel = useStoryLocale('content.uploadLabel', messages)
const processLabel = useStoryLocale('content.processLabel', messages)
const exportLabel = useStoryLocale('content.exportLabel', messages)
const buildLabel = useStoryLocale('content.buildLabel', messages)
const testLabel = useStoryLocale('content.testLabel', messages)
const deployLabel = useStoryLocale('content.deployLabel', messages)
const verifyLabel = useStoryLocale('content.verifyLabel', messages)
const designLabel = useStoryLocale('content.designLabel', messages)
const developLabel = useStoryLocale('content.developLabel', messages)
const launchLabel = useStoryLocale('content.launchLabel', messages)
const compileLabel = useStoryLocale('content.compileLabel', messages)
const bundleLabel = useStoryLocale('content.bundleLabel', messages)
const optimizeLabel = useStoryLocale('content.optimizeLabel', messages)
const stepALabel = useStoryLocale('content.stepALabel', messages)
const stepBLabel = useStoryLocale('content.stepBLabel', messages)
const stepCLabel = useStoryLocale('content.stepCLabel', messages)
const stepDLabel = useStoryLocale('content.stepDLabel', messages)
const stepELabel = useStoryLocale('content.stepELabel', messages)
const processDesc = useStoryLocale('content.processDesc', messages)
const reviewDesc = useStoryLocale('content.reviewDesc', messages)
const exportDesc = useStoryLocale('content.exportDesc', messages)
const addFilesDesc = useStoryLocale('content.addFilesDesc', messages)
const exportComplete = useStoryLocale('content.exportComplete', messages)
const testsFailed = useStoryLocale('content.testsFailed', messages)
const advanceBtn = useStoryLocale('content.advanceBtn', messages)
const horizontalSteps = useStoryLocale('content.horizontalSteps', messages)
const withDescriptions = useStoryLocale('content.withDescriptions', messages)
const withFailedStep = useStoryLocale('content.withFailedStep', messages)
const allCompleted = useStoryLocale('content.allCompleted', messages)
const withElapsedTime = useStoryLocale('content.withElapsedTime', messages)
const receiptSuccess = useStoryLocale('content.receiptSuccess', messages)
const receiptFailed = useStoryLocale('content.receiptFailed', messages)
const interactiveClickToAdvance = useStoryLocale('content.interactiveClickToAdvance', messages)
const nonLinearProgress = useStoryLocale('content.nonLinearProgress', messages)
const Name = useStoryLocale('content.name', messages)
const Type = useStoryLocale('content.type', messages)
const Default = useStoryLocale('content.default', messages)
const Description = useStoryLocale('content.description', messages)
const Props = useStoryLocale('content.props', messages)
const ProgressTrackerProps = useStoryLocale('content.progressTrackerProps', messages)

const headerName = Name
const headerType = Type
const headerDefault = Default
const headerDesc = Description
const propsTitle = Props
const componentPropsTitle = ProgressTrackerProps

const props = [
  { name: 'id', type: 'string', required: true, description: { zh: '组件的唯一标识符', en: 'Unique identifier for the component' } },
  { name: 'steps', type: 'ProgressStep[]', required: true, description: { zh: '要显示的步骤数组', en: 'Array of steps to display' } },
  { name: 'elapsedTime', type: 'number', description: { zh: '经过的时间（毫秒）', en: 'Elapsed time in milliseconds' } },
  { name: 'choice', type: 'ProgressTrackerChoice', description: { zh: '回执状态与结果摘要', en: 'Receipt state with outcome summary' } },
  { name: 'css', type: '{ root?: string; step?: string; actions?: string }', description: { zh: '组件元素的 CSS 类', en: 'CSS classes for component elements' } },
]



/**
 * # ProgressTracker
 *
 * A component for displaying multi-step progress with visual indicators
 * for pending, in-progress, completed, and failed states.
 *
 * ## Props
 *
 * | Prop | Type | Default | Description |
 * |------|------|---------|-------------|
 * | id | string | required | Unique identifier for the component |
 * | steps | ProgressStep[] | required | Array of steps to display |
 * | elapsedTime | number | undefined | Elapsed time in milliseconds |
 * | choice | ProgressTrackerChoice | undefined | Receipt state with outcome |
 * | css | { root?: string } | undefined | CSS classes for component elements |
 *
 * ## Step Status
 *
 * - `pending` - Step not yet started (empty circle)
 * - `in-progress` - Step currently active (spinner)
 * - `completed` - Step finished successfully (checkmark)
 * - `failed` - Step failed (X mark)
 *
 * ## Receipt Outcomes
 *
 * - `success` - All steps completed (green)
 * - `partial` - Some steps completed (amber)
 * - `failed` - Process failed (red)
 * - `cancelled` - Process cancelled (gray)
 *
 * ## Usage
 *
 * ```vue
 * <ProgressTracker
 *   id="onboarding"
 *   :steps="[
 *     { id: 'account', label: 'Account', status: 'completed' },
 *     { id: 'profile', label: 'Profile', status: 'in-progress' },
 *     { id: 'billing', label: 'Billing', status: 'pending' },
 *   ]"
 *   :elapsed-time="5000"
 * />
 * ```
 */

// Step labels

// Descriptions

// Receipt summaries

// Button

const interactiveProgressZh = {
  steps: [
    { id: '1', label: '上传', description: '选择你的文件', status: 'completed' as const },
    { id: '2', label: '处理', description: '正在分析数据', status: 'completed' as const },
    { id: '3', label: '审查', description: '检查结果', status: 'in-progress' as const },
    { id: '4', label: '导出', description: '下载输出', status: 'pending' as const },
  ],
  currentStep: 2
}

const interactiveProgressEn = {
  steps: [
    { id: '1', label: 'Upload', description: 'Select your files', status: 'completed' as const },
    { id: '2', label: 'Process', description: 'Analyzing data', status: 'completed' as const },
    { id: '3', label: 'Review', description: 'Check results', status: 'in-progress' as const },
    { id: '4', label: 'Export', description: 'Download output', status: 'pending' as const },
  ],
  currentStep: 2
}

const interactiveProgress = reactive({ ...interactiveProgressEn })

watch(currentLocale, () => {
  const source = currentLocale.value === 'zh-CN' ? interactiveProgressZh : interactiveProgressEn;
  interactiveProgress.steps = source.steps.map(s => ({ ...s }));
});

function advanceStep() {
  if (interactiveProgress.currentStep < interactiveProgress.steps.length) {
    interactiveProgress.steps[interactiveProgress.currentStep - 1].status = 'completed';
    if (interactiveProgress.currentStep < interactiveProgress.steps.length) {
      interactiveProgress.steps[interactiveProgress.currentStep].status = 'in-progress';
      interactiveProgress.currentStep++;
    }
  } else {
    // Reset
    interactiveProgress.steps.forEach((s, i) => {
      s.status = i === 0 ? 'in-progress' : 'pending';
    });
    interactiveProgress.currentStep = 1;
  }
}

// Computed step arrays for static variants
const horizontalStepsArr = computed<any[]>(() => [
  { id: '1', label: accountLabel.value, status: 'completed' },
  { id: '2', label: profileLabel.value, status: 'completed' },
  { id: '3', label: billingLabel.value, status: 'in-progress' },
  { id: '4', label: reviewLabel.value, status: 'pending' },
])

const descriptionStepsArr = computed<any[]>(() => [
  { id: '1', label: uploadLabel.value, description: addFilesDesc.value, status: 'completed' },
  { id: '2', label: processLabel.value, description: processDesc.value, status: 'completed' },
  { id: '3', label: reviewLabel.value, description: reviewDesc.value, status: 'in-progress' },
  { id: '4', label: exportLabel.value, description: exportDesc.value, status: 'pending' },
])

const failedStepsArr = computed<any[]>(() => [
  { id: '1', label: buildLabel.value, status: 'completed' },
  { id: '2', label: testLabel.value, status: 'completed' },
  { id: '3', label: deployLabel.value, status: 'failed' },
  { id: '4', label: verifyLabel.value, status: 'pending' },
])

const completedStepsArr = computed<any[]>(() => [
  { id: '1', label: designLabel.value, status: 'completed' },
  { id: '2', label: developLabel.value, status: 'completed' },
  { id: '3', label: testLabel.value, status: 'completed' },
  { id: '4', label: launchLabel.value, status: 'completed' },
])

const elapsedStepsArr = computed<any[]>(() => [
  { id: '1', label: compileLabel.value, status: 'completed' },
  { id: '2', label: bundleLabel.value, status: 'completed' },
  { id: '3', label: optimizeLabel.value, status: 'in-progress' },
])

const receiptSuccessStepsArr = computed<any[]>(() => [
  { id: '1', label: uploadLabel.value, status: 'completed' },
  { id: '2', label: processLabel.value, status: 'completed' },
  { id: '3', label: exportLabel.value, status: 'completed' },
])

const receiptFailedStepsArr = computed<any[]>(() => [
  { id: '1', label: buildLabel.value, status: 'completed' },
  { id: '2', label: testLabel.value, status: 'failed' },
  { id: '3', label: deployLabel.value, status: 'pending' },
])

const nonLinearStepsArr = computed<any[]>(() => [
  { id: '1', label: stepALabel.value, status: 'completed' },
  { id: '2', label: stepBLabel.value, status: 'pending' },
  { id: '3', label: stepCLabel.value, status: 'completed' },
  { id: '4', label: stepDLabel.value, status: 'in-progress' },
  { id: '5', label: stepELabel.value, status: 'pending' },
])
</script>

<template>
  <Story title="ProgressTracker/All Variants">
    <Variant :title="horizontalSteps">
      <p class="mb-3 text-xs text-muted-foreground">{{ subtitle }}</p>
      <div class="w-full max-w-3xl">
        <progress-tracker
          id="progress-horizontal"
          :steps="horizontalStepsArr"
        />
      </div>
    </Variant>

    <Variant :title="withDescriptions">
      <div class="w-full max-w-3xl">
        <progress-tracker
          id="progress-descriptions"
          :steps="descriptionStepsArr"
        />
      </div>
    </Variant>

    <Variant :title="withFailedStep">
      <div class="w-full max-w-3xl">
        <progress-tracker
          id="progress-failed"
          :steps="failedStepsArr"
        />
      </div>
    </Variant>

    <Variant :title="allCompleted">
      <div class="w-full max-w-3xl">
        <progress-tracker
          id="progress-complete"
          :steps="completedStepsArr"
        />
      </div>
    </Variant>

    <Variant :title="withElapsedTime">
      <div class="w-full max-w-3xl">
        <progress-tracker
          id="progress-time"
          :steps="elapsedStepsArr"
          :elapsed-time="12500"
        />
      </div>
    </Variant>

    <Variant :title="receiptSuccess">
      <div class="w-full max-w-3xl">
        <progress-tracker
          id="progress-receipt-success"
          :steps="receiptSuccessStepsArr"
          :elapsed-time="8500"
          :choice="{ outcome: 'success', summary: exportComplete, at: '2024-01-01T00:00:00Z' }"
        />
      </div>
    </Variant>

    <Variant :title="receiptFailed">
      <div class="w-full max-w-3xl">
        <progress-tracker
          id="progress-receipt-failed"
          :steps="receiptFailedStepsArr"
          :elapsed-time="32000"
          :choice="{ outcome: 'failed', summary: testsFailed, at: '2024-01-01T00:00:00Z' }"
        />
      </div>
    </Variant>

    <Variant :title="interactiveClickToAdvance">
      <div class="w-full max-w-3xl">
        <button
          class="mb-4 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          @click="advanceStep"
        >
          {{ advanceBtn }}
        </button>
        <progress-tracker
          id="progress-interactive"
          :steps="interactiveProgress.steps"
        />
      </div>
    </Variant>

    <Variant :title="nonLinearProgress">
      <div class="w-full max-w-3xl">
        <progress-tracker
          id="progress-nonlinear"
          :steps="nonLinearStepsArr"
        />
      </div>
    </Variant>
    <Variant :title="propsTitle">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-4xl p-6">
        <h2 class="mb-4 text-2xl font-bold">{{ componentPropsTitle }}</h2>
        <div class="overflow-x-auto">
          <table class="story-table">
            <thead>
              <tr>
                <th>{{ headerName }}</th>
                <th>{{ headerType }}</th>
                <th>{{ headerDefault }}</th>
                <th>{{ headerDesc }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="prop in props" :key="prop.name">
                <td class="font-mono text-emerald-600">{{ prop.name }}</td>
                <td class="font-mono text-blue-600">{{ prop.type }}</td>
                <td class="text-muted-foreground">{{ 'default' in prop ? prop.default : '-' }}</td>
                <td>{{ useStoryLocale(prop.description) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </Variant>
  </Story>
</template>
