<script setup lang="ts">
import { computed } from 'vue';
import { ProgressTracker } from '@lionad/vtu-components';
import messages from './i18n';
import { useStoryLocale } from '../_shared/use-story-locale'

const subtitle = useStoryLocale('content.subtitle', messages);
const accountLabel = useStoryLocale('content.accountLabel', messages)
const profileLabel = useStoryLocale('content.profileLabel', messages)
const billingLabel = useStoryLocale('content.billingLabel', messages)
const reviewLabel = useStoryLocale('content.reviewLabel', messages)
const horizontalSteps = useStoryLocale('content.horizontalSteps', messages)
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

// Computed step arrays for static variants
const horizontalStepsArr = computed<any[]>(() => [
  { id: '1', label: accountLabel.value, status: 'completed' },
  { id: '2', label: profileLabel.value, status: 'completed' },
  { id: '3', label: billingLabel.value, status: 'in-progress' },
  { id: '4', label: reviewLabel.value, status: 'pending' },
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
