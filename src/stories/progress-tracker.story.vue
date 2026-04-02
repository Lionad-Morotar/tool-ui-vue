<script setup lang="ts">
import { reactive } from 'vue';
import { ProgressTracker } from '../components';

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

const interactiveProgress = reactive({
  steps: [
    { id: '1', label: 'Upload', description: 'Select your files', status: 'completed' as const },
    { id: '2', label: 'Process', description: 'Analyzing data', status: 'completed' as const },
    { id: '3', label: 'Review', description: 'Check results', status: 'in-progress' as const },
    { id: '4', label: 'Export', description: 'Download output', status: 'pending' as const },
  ],
  currentStep: 2
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
</script>

<template>
  <Story title="ProgressTracker/All Variants">
    <Variant title="Horizontal Steps">
      <div class="w-full max-w-3xl">
        <progress-tracker
          id="progress-horizontal"
          :steps="[
            { id: '1', label: 'Account', status: 'completed' },
            { id: '2', label: 'Profile', status: 'completed' },
            { id: '3', label: 'Billing', status: 'in-progress' },
            { id: '4', label: 'Review', status: 'pending' },
          ]"
        />
      </div>
    </Variant>

    <Variant title="With Descriptions">
      <div class="w-full max-w-3xl">
        <progress-tracker
          id="progress-descriptions"
          :steps="[
            { id: '1', label: 'Upload', description: 'Add your files', status: 'completed' },
            { id: '2', label: 'Process', description: 'Analyzing data', status: 'completed' },
            { id: '3', label: 'Review', description: 'Check results', status: 'in-progress' },
            { id: '4', label: 'Export', description: 'Download output', status: 'pending' },
          ]"
        />
      </div>
    </Variant>

    <Variant title="With Failed Step">
      <div class="w-full max-w-3xl">
        <progress-tracker
          id="progress-failed"
          :steps="[
            { id: '1', label: 'Build', status: 'completed' },
            { id: '2', label: 'Test', status: 'completed' },
            { id: '3', label: 'Deploy', status: 'failed' },
            { id: '4', label: 'Verify', status: 'pending' },
          ]"
        />
      </div>
    </Variant>

    <Variant title="All Completed">
      <div class="w-full max-w-3xl">
        <progress-tracker
          id="progress-complete"
          :steps="[
            { id: '1', label: 'Design', status: 'completed' },
            { id: '2', label: 'Develop', status: 'completed' },
            { id: '3', label: 'Test', status: 'completed' },
            { id: '4', label: 'Launch', status: 'completed' },
          ]"
        />
      </div>
    </Variant>

    <Variant title="With Elapsed Time">
      <div class="w-full max-w-3xl">
        <progress-tracker
          id="progress-time"
          :steps="[
            { id: '1', label: 'Compile', status: 'completed' },
            { id: '2', label: 'Bundle', status: 'completed' },
            { id: '3', label: 'Optimize', status: 'in-progress' },
          ]"
          :elapsed-time="12500"
        />
      </div>
    </Variant>

    <Variant title="Receipt - Success">
      <div class="w-full max-w-3xl">
        <progress-tracker
          id="progress-receipt-success"
          :steps="[
            { id: '1', label: 'Upload', status: 'completed' },
            { id: '2', label: 'Process', status: 'completed' },
            { id: '3', label: 'Export', status: 'completed' },
          ]"
          :elapsed-time="8500"
          :choice="{ outcome: 'success', summary: 'Export complete', at: '2024-01-01T00:00:00Z' }"
        />
      </div>
    </Variant>

    <Variant title="Receipt - Failed">
      <div class="w-full max-w-3xl">
        <progress-tracker
          id="progress-receipt-failed"
          :steps="[
            { id: '1', label: 'Build', status: 'completed' },
            { id: '2', label: 'Test', status: 'failed' },
            { id: '3', label: 'Deploy', status: 'pending' },
          ]"
          :elapsed-time="32000"
          :choice="{ outcome: 'failed', summary: 'Tests failed', at: '2024-01-01T00:00:00Z' }"
        />
      </div>
    </Variant>

    <Variant title="Interactive - Click to Advance">
      <div class="w-full max-w-3xl">
        <button
          class="mb-4 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          @click="advanceStep"
        >
          Advance Step
        </button>
        <progress-tracker
          id="progress-interactive"
          :steps="interactiveProgress.steps"
        />
      </div>
    </Variant>

    <Variant title="Non-linear Progress">
      <div class="w-full max-w-3xl">
        <progress-tracker
          id="progress-nonlinear"
          :steps="[
            { id: '1', label: 'Step A', status: 'completed' },
            { id: '2', label: 'Step B', status: 'pending' },
            { id: '3', label: 'Step C', status: 'completed' },
            { id: '4', label: 'Step D', status: 'in-progress' },
            { id: '5', label: 'Step E', status: 'pending' },
          ]"
        />
      </div>
    </Variant>
  </Story>
</template>
