<script setup lang="ts">
import { reactive } from 'vue';
import { QuestionFlow } from '@lionad/vtu-components';
import messages from './i18n';
import { useStoryLocale } from '../_shared/use-story-locale'

const receiptMode = useStoryLocale('variant.receiptMode', messages)
const receiptModeMultipleItems = useStoryLocale('variant.receiptModeMultipleItems', messages)
const interactiveProgressive = useStoryLocale('content.interactiveProgressive', messages)
const configCompleteTitle = useStoryLocale('content.configCompleteTitle', messages)
const projectTypeLabel = useStoryLocale('variant.projectTypeLabel', messages)
const frameworkLabel = useStoryLocale('content.frameworkLabel', messages)
const featuresLabel = useStoryLocale('content.featuresLabel', messages)
const receiptFeaturesValue = useStoryLocale('data.receiptFeaturesValue', messages)
const webAppLabel = useStoryLocale('content.webAppLabel', messages)
const orderSummaryTitle = useStoryLocale('content.orderSummaryTitle', messages)
const planLabel = useStoryLocale('content.planLabel', messages)
const usersLabel = useStoryLocale('content.usersLabel', messages)
const storageLabel = useStoryLocale('content.storageLabel', messages)
const supportLabel = useStoryLocale('content.supportLabel', messages)
const totalLabel = useStoryLocale('content.totalLabel', messages)
const proAnnualLabel = useStoryLocale('content.proAnnualLabel', messages)
const teamMembersValue = useStoryLocale('content.teamMembersValue', messages)
const priorityLabel = useStoryLocale('content.priorityLabel', messages)
const interactiveDemoTitle = useStoryLocale('content.interactiveDemoTitle', messages)
const interactiveDemoDesc = useStoryLocale('variant.interactiveDemoDesc', messages)
const optionALabel = useStoryLocale('content.optionALabel', messages)
const optionADesc = useStoryLocale('content.optionADesc', messages)
const optionBLabel = useStoryLocale('content.optionBLabel', messages)
const optionBDesc = useStoryLocale('content.optionBDesc', messages)
const optionCLabel = useStoryLocale('content.optionCLabel', messages)
const optionCDesc = useStoryLocale('content.optionCDesc', messages)
const selectedText = useStoryLocale('content.selectedText', messages)

const progressiveState = reactive({
  step: 1,
  selectedOptions: [] as string[],
});

function handleSelect(options: string[]) {
  progressiveState.selectedOptions = options;
  alert(`Selected: ${options.join(', ')}`);
}
</script>

<template>
  <Story title="QuestionFlow/Receipt">
    <Variant :title="receiptMode">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-md">
        <question-flow
          id="question-flow-receipt"
          :choice="{
            title: configCompleteTitle,
            summary: [
              { label: projectTypeLabel, value: webAppLabel },
              { label: frameworkLabel, value: 'Vue' },
              { label: featuresLabel, value: receiptFeaturesValue },
            ],
          }"
        />
      </div>
    </Variant>

    <Variant :title="receiptModeMultipleItems">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-md">
        <question-flow
          id="question-flow-receipt-multi"
          :choice="{
            title: orderSummaryTitle,
            summary: [
              { label: planLabel, value: proAnnualLabel },
              { label: usersLabel, value: teamMembersValue },
              { label: storageLabel, value: '500 GB' },
              { label: supportLabel, value: priorityLabel },
              { label: totalLabel, value: '$299/year' },
            ],
          }"
        />
      </div>
    </Variant>

    <Variant :title="interactiveProgressive" auto-props-disabled>
      <div class="w-full max-w-md space-y-4">
        <div v-if="progressiveState.selectedOptions.length > 0" class="rounded-lg bg-muted p-3 text-sm">
          <strong>{{ selectedText }}</strong> {{ progressiveState.selectedOptions.join(", ") }}
        </div>
        <question-flow
          id="question-flow-interactive"
          :step="progressiveState.step"
          :title="interactiveDemoTitle"
          :description="interactiveDemoDesc"
          :options="[
            { id: 'option-a', label: optionALabel, description: optionADesc },
            { id: 'option-b', label: optionBLabel, description: optionBDesc },
            { id: 'option-c', label: optionCLabel, description: optionCDesc },
          ]"
          selection-mode="single"
          @select="handleSelect"
        />
      </div>
    </Variant>
  </Story>
</template>
