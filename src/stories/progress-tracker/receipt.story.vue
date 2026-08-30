<script setup lang="ts">
import { reactive, watch, computed } from 'vue';
import { ProgressTracker } from '@lionad/vtu-components';
import messages from './i18n';
import { useStoryLocale, currentLocale } from '../_shared/use-story-locale'

const uploadLabel = useStoryLocale('content.uploadLabel', messages)
const processLabel = useStoryLocale('content.processLabel', messages)
const exportLabel = useStoryLocale('content.exportLabel', messages)
const buildLabel = useStoryLocale('content.buildLabel', messages)
const testLabel = useStoryLocale('content.testLabel', messages)
const deployLabel = useStoryLocale('content.deployLabel', messages)
const exportComplete = useStoryLocale('content.exportComplete', messages)
const testsFailed = useStoryLocale('content.testsFailed', messages)
const advanceBtn = useStoryLocale('content.advanceBtn', messages)
const receiptSuccess = useStoryLocale('content.receiptSuccess', messages)
const receiptFailed = useStoryLocale('content.receiptFailed', messages)
const interactiveClickToAdvance = useStoryLocale('content.interactiveClickToAdvance', messages)

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
</script>

<template>
  <Story title="ProgressTracker/Receipt">
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
  </Story>
</template>
