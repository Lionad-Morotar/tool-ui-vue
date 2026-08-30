<script setup lang="ts">
import { computed } from 'vue';
import { ProgressTracker } from '@lionad/vtu-components';
import messages from './i18n';
import { useStoryLocale } from '../_shared/use-story-locale'

const uploadLabel = useStoryLocale('content.uploadLabel', messages)
const processLabel = useStoryLocale('content.processLabel', messages)
const reviewLabel = useStoryLocale('content.reviewLabel', messages)
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
const withDescriptions = useStoryLocale('content.withDescriptions', messages)
const withFailedStep = useStoryLocale('content.withFailedStep', messages)
const allCompleted = useStoryLocale('content.allCompleted', messages)
const withElapsedTime = useStoryLocale('content.withElapsedTime', messages)
const nonLinearProgress = useStoryLocale('content.nonLinearProgress', messages)

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

const nonLinearStepsArr = computed<any[]>(() => [
  { id: '1', label: stepALabel.value, status: 'completed' },
  { id: '2', label: stepBLabel.value, status: 'pending' },
  { id: '3', label: stepCLabel.value, status: 'completed' },
  { id: '4', label: stepDLabel.value, status: 'in-progress' },
  { id: '5', label: stepELabel.value, status: 'pending' },
])
</script>

<template>
  <Story title="ProgressTracker/States">
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
