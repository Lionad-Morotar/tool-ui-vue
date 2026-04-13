<script setup lang="ts">
import { reactive, computed, watch } from 'vue';
import { ProgressTracker } from '@lionad/vtu-components';
import { useStoryLocale, currentLocale } from './_shared/use-story-locale';

const subtitle = useStoryLocale({ zh: '多步骤进度组件，支持待处理、进行中、完成和失败状态', en: 'Multi-step progress component with pending, in-progress, completed, and failed states.' });

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
const accountLabel = useStoryLocale({ zh: '账户', en: 'Account' })
const profileLabel = useStoryLocale({ zh: '个人资料', en: 'Profile' })
const billingLabel = useStoryLocale({ zh: '账单', en: 'Billing' })
const reviewLabel = useStoryLocale({ zh: '审查', en: 'Review' })
const uploadLabel = useStoryLocale({ zh: '上传', en: 'Upload' })
const processLabel = useStoryLocale({ zh: '处理', en: 'Process' })
const exportLabel = useStoryLocale({ zh: '导出', en: 'Export' })
const buildLabel = useStoryLocale({ zh: '构建', en: 'Build' })
const testLabel = useStoryLocale({ zh: '测试', en: 'Test' })
const deployLabel = useStoryLocale({ zh: '部署', en: 'Deploy' })
const verifyLabel = useStoryLocale({ zh: '验证', en: 'Verify' })
const designLabel = useStoryLocale({ zh: '设计', en: 'Design' })
const developLabel = useStoryLocale({ zh: '开发', en: 'Develop' })
const launchLabel = useStoryLocale({ zh: '发布', en: 'Launch' })
const compileLabel = useStoryLocale({ zh: '编译', en: 'Compile' })
const bundleLabel = useStoryLocale({ zh: '打包', en: 'Bundle' })
const optimizeLabel = useStoryLocale({ zh: '优化', en: 'Optimize' })
const stepALabel = useStoryLocale({ zh: '步骤 A', en: 'Step A' })
const stepBLabel = useStoryLocale({ zh: '步骤 B', en: 'Step B' })
const stepCLabel = useStoryLocale({ zh: '步骤 C', en: 'Step C' })
const stepDLabel = useStoryLocale({ zh: '步骤 D', en: 'Step D' })
const stepELabel = useStoryLocale({ zh: '步骤 E', en: 'Step E' })

// Descriptions
const processDesc = useStoryLocale({ zh: '正在分析数据', en: 'Analyzing data' })
const reviewDesc = useStoryLocale({ zh: '检查结果', en: 'Check results' })
const exportDesc = useStoryLocale({ zh: '下载输出', en: 'Download output' })
const addFilesDesc = useStoryLocale({ zh: '添加你的文件', en: 'Add your files' })

// Receipt summaries
const exportComplete = useStoryLocale({ zh: '导出完成', en: 'Export complete' })
const testsFailed = useStoryLocale({ zh: '测试失败', en: 'Tests failed' })

// Button
const advanceBtn = useStoryLocale({ zh: '推进步骤', en: 'Advance Step' })

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

const horizontalSteps = useStoryLocale({ zh: '水平步骤', en: 'Horizontal Steps' })
const withDescriptions = useStoryLocale({ zh: '含描述', en: 'With Descriptions' })
const withFailedStep = useStoryLocale({ zh: '含失败步骤', en: 'With Failed Step' })
const allCompleted = useStoryLocale({ zh: '全部完成', en: 'All Completed' })
const withElapsedTime = useStoryLocale({ zh: '含耗时', en: 'With Elapsed Time' })
const receiptSuccess = useStoryLocale({ zh: '回执 - 成功', en: 'Receipt - Success' })
const receiptFailed = useStoryLocale({ zh: '回执 - 失败', en: 'Receipt - Failed' })
const interactiveClickToAdvance = useStoryLocale({ zh: '交互 - 点击推进', en: 'Interactive - Click to Advance' })
const nonLinearProgress = useStoryLocale({ zh: '非线性进度', en: 'Non-linear Progress' })

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
  </Story>
</template>
