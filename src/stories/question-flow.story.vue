<script setup lang="ts">
import { ref, reactive } from 'vue';
import { QuestionFlow } from '@lionad/vtu-components';
import { useStoryLocale, type StoryLocaleLabels } from './_shared/use-story-locale';

const progressiveState = reactive({
  step: 1,
  selectedOptions: [] as string[],
});

const upfrontAnswers = ref<Record<string, string[]>>({});

function handleSelect(options: string[]) {
  progressiveState.selectedOptions = options;
  alert(`Selected: ${options.join(', ')}`);
}

function handleComplete(answers: Record<string, string[]>) {
  upfrontAnswers.value = answers;
  alert(`Completed! Answers: ${JSON.stringify(answers)}`);
}

/**
 * ## Props
 *
 * ### Progressive Mode (step + options)
 * | Prop | Type | Default | Description |
 * |------|------|---------|-------------|
 * | id | string | required | Unique identifier for the component |
 * | step | number | required | Current step number (1-based) |
 * | title | string | required | Question title |
 * | description | string | undefined | Question description |
 * | options | QuestionFlowOption[] | required | Array of options to select from |
 * | selectionMode | 'single' \| 'multi' | 'single' | Selection mode |
 * | defaultValue | string[] | undefined | Initially selected option IDs |
 * | onSelect | (optionIds: string[]) => void | undefined | Callback when selection is confirmed |
 * | onBack | () => void | undefined | Callback when back button is clicked |
 *
 * ### Upfront Mode (steps)
 * | Prop | Type | Default | Description |
 * |------|------|---------|-------------|
 * | id | string | required | Unique identifier |
 * | steps | QuestionFlowStepDefinition[] | required | Array of step definitions |
 * | onStepChange | (stepId: string) => void | undefined | Callback when step changes |
 * | onComplete | (answers: Record<string, string[]>) => void | undefined | Callback when flow completes |
 *
 * ### Receipt Mode (choice)
 * | Prop | Type | Default | Description |
 * |------|------|---------|-------------|
 * | id | string | required | Unique identifier |
 * | choice | QuestionFlowChoice | required | Completed choice data |
 *
 * ## Emits
 *
 * | Event | Payload | Description |
 * |-------|---------|-------------|
 * | select | optionIds: string[] | Emitted in progressive mode when selection is confirmed |
 * | back | - | Emitted when back button is clicked |
 * | stepChange | stepId: string | Emitted when step changes in upfront mode |
 * | complete | answers: Record<string, string[]> | Emitted when flow completes |
 *
 * ## Slots
 *
 * This component does not use slots. All content is passed via props.
 *
 * ## Accessibility
 *
 * - Has `role="form"` in interactive mode
 * - Has `role="status"` in receipt mode
 * - Has `aria-labelledby` pointing to title
 * - Has `aria-describedby` pointing to description
 * - Options have `role="option"` with `aria-selected`
 * - Progress bar has `role="progressbar"` with aria values
 * - Full keyboard navigation support (Arrow keys, Enter, Space, Home, End)
 *
 * ## Interaction Patterns
 *
 * ### Progressive Mode
 * - Shows a single question at a time
 * - User selects option(s) and clicks "Complete"
 * - Emits `select` event with selected option IDs
 *
 * ### Upfront Mode
 * - Shows multiple steps with navigation
 * - User progresses through questions with "Next"
 * - Can go back with "Back" button
 * - Emits `complete` event with all answers
 *
 * ### Receipt Mode
 * - Shows completed state with summary
 * - No interaction, display only
 */
</script>

<template>
  <Story title="QuestionFlow/All Variants">
    <Variant :title="useStoryLocale({ zh: '渐进模式 - 步骤 1', en: 'Progressive Mode - Step 1' })">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-md">
        <question-flow
          id="question-flow-progressive-1"
          :step="1"
          title="Project Setup"
          description="Let's configure your new project"
          :options="[
            { id: 'web', label: 'Web Application' },
            { id: 'api', label: 'API Service' },
            { id: 'mobile', label: 'Mobile App' },
          ]"
          selection-mode="single"
        />
      </div>
    </Variant>

    <Variant :title="useStoryLocale({ zh: '渐进模式 - 步骤 2', en: 'Progressive Mode - Step 2' })">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-md">
        <question-flow
          id="question-flow-progressive-2"
          :step="2"
          title="Choose Framework"
          description="Select your preferred framework"
          :options="[
            { id: 'react', label: 'React', description: 'Popular and flexible' },
            { id: 'vue', label: 'Vue', description: 'Progressive and approachable' },
            { id: 'svelte', label: 'Svelte', description: 'Compiler-based, minimal runtime' },
          ]"
          selection-mode="single"
        />
      </div>
    </Variant>

    <Variant :title="useStoryLocale({ zh: '渐进模式 - 多选', en: 'Progressive Mode - Multi Select' })">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-md">
        <question-flow
          id="question-flow-multi"
          :step="1"
          title="Select Features"
          description="Choose the features you need"
          :options="[
            { id: 'auth', label: 'Authentication', description: 'User login and registration' },
            { id: 'payments', label: 'Payments', description: 'Stripe integration' },
            { id: 'notifications', label: 'Notifications', description: 'Email and push notifications' },
            { id: 'analytics', label: 'Analytics', description: 'Usage tracking and reporting' },
          ]"
          selection-mode="multi"
        />
      </div>
    </Variant>

    <Variant :title="useStoryLocale({ zh: '渐进模式 - 含默认值', en: 'Progressive Mode - With Default Value' })">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-md">
        <question-flow
          id="question-flow-default"
          :step="1"
          title="Select Plan"
          description="Choose your subscription plan"
          :options="[
            { id: 'free', label: 'Free', description: 'Basic features' },
            { id: 'pro', label: 'Pro', description: 'Advanced features' },
            { id: 'enterprise', label: 'Enterprise', description: 'Custom solutions' },
          ]"
          selection-mode="single"
          :default-value="['pro']"
        />
      </div>
    </Variant>

    <Variant :title="useStoryLocale({ zh: '前置模式 - 多步骤', en: 'Upfront Mode - Multi Step' })">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-md">
        <question-flow
          id="question-flow-upfront"
          :steps="[
            {
              id: 'platform',
              title: 'Choose Platform',
              description: 'Where will your app run?',
              options: [
                { id: 'web', label: 'Web' },
                { id: 'mobile', label: 'Mobile' },
                { id: 'desktop', label: 'Desktop' },
              ],
            },
            {
              id: 'language',
              title: 'Choose Language',
              description: 'What language do you prefer?',
              options: [
                { id: 'ts', label: 'TypeScript' },
                { id: 'js', label: 'JavaScript' },
                { id: 'python', label: 'Python' },
              ],
            },
            {
              id: 'features',
              title: 'Select Features',
              description: 'What do you need?',
              options: [
                { id: 'auth', label: 'Authentication' },
                { id: 'db', label: 'Database' },
                { id: 'api', label: 'API' },
              ],
              selectionMode: 'multi',
            },
          ]"
          @complete="handleComplete"
        />
      </div>
    </Variant>

    <Variant :title="useStoryLocale({ zh: '前置模式 - 含禁用选项', en: 'Upfront Mode - With Disabled Options' })">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-md">
        <question-flow
          id="question-flow-disabled"
          :steps="[
            {
              id: 'tier',
              title: 'Select Tier',
              description: 'Some options are unavailable',
              options: [
                { id: 'basic', label: 'Basic' },
                { id: 'pro', label: 'Pro', disabled: true },
                { id: 'enterprise', label: 'Enterprise', disabled: true },
              ],
            },
          ]"
        />
      </div>
    </Variant>

    <Variant :title="useStoryLocale({ zh: '回执模式', en: 'Receipt Mode' })">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-md">
        <question-flow
          id="question-flow-receipt"
          :choice="{
            title: 'Project Configuration Complete',
            summary: [
              { label: 'Project Type', value: 'Web Application' },
              { label: 'Framework', value: 'Vue' },
              { label: 'Features', value: 'Auth, Payments, Analytics' },
            ],
          }"
        />
      </div>
    </Variant>

    <Variant :title="useStoryLocale({ zh: '回执模式 - 多项', en: 'Receipt Mode - Multiple Items' })">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-md">
        <question-flow
          id="question-flow-receipt-multi"
          :choice="{
            title: 'Order Summary',
            summary: [
              { label: 'Plan', value: 'Pro Annual' },
              { label: 'Users', value: '25 team members' },
              { label: 'Storage', value: '500 GB' },
              { label: 'Support', value: 'Priority' },
              { label: 'Total', value: '$299/year' },
            ],
          }"
        />
      </div>
    </Variant>

    <Variant :title="useStoryLocale({ zh: '交互渐进模式', en: 'Interactive Progressive' })" auto-props-disabled>
      <div class="w-full max-w-md space-y-4">
        <div v-if="progressiveState.selectedOptions.length > 0" class="rounded-lg bg-muted p-3 text-sm">
          <strong>Selected:</strong> {{ progressiveState.selectedOptions.join(", ") }}
        </div>
        <question-flow
          id="question-flow-interactive"
          :step="progressiveState.step"
          title="Interactive Demo"
          description="Make a selection to see the event"
          :options="[
            { id: 'option-a', label: 'Option A', description: 'First option' },
            { id: 'option-b', label: 'Option B', description: 'Second option' },
            { id: 'option-c', label: 'Option C', description: 'Third option' },
          ]"
          selection-mode="single"
          @select="handleSelect"
        />
      </div>
    </Variant>
  </Story>
</template>
