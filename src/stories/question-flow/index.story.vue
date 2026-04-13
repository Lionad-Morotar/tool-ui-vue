<script setup lang="ts">
import { reactive } from 'vue';
import { QuestionFlow } from '@lionad/vtu-components';
import { useStoryLocale } from '../_shared/use-story-locale'
import messages from './i18n';

const progressiveModeStep1 = useStoryLocale('variant.progressiveModeStep1', messages)
const progressiveModeStep2 = useStoryLocale('variant.progressiveModeStep2', messages)
const progressiveModeMultiSelect = useStoryLocale('variant.progressiveModeMultiSelect', messages)
const progressiveModeWithDefaultValue = useStoryLocale('variant.progressiveModeWithDefaultValue', messages)
const upfrontModeMultiStep = useStoryLocale('variant.upfrontModeMultiStep', messages)
const upfrontModeWithDisabledOptions = useStoryLocale('variant.upfrontModeWithDisabledOptions', messages)
const receiptMode = useStoryLocale('variant.receiptMode', messages)
const receiptModeMultipleItems = useStoryLocale('variant.receiptModeMultipleItems', messages)
const interactiveProgressive = useStoryLocale('content.interactiveProgressive', messages)
const projectSetupTitle = useStoryLocale('content.projectSetupTitle', messages)
const projectSetupDesc = useStoryLocale('content.projectSetupDesc', messages)
const webAppLabel = useStoryLocale('content.webAppLabel', messages)
const apiServiceLabel = useStoryLocale('content.apiServiceLabel', messages)
const mobileAppLabel = useStoryLocale('content.mobileAppLabel', messages)
const chooseFrameworkTitle = useStoryLocale('content.chooseFrameworkTitle', messages)
const chooseFrameworkDesc = useStoryLocale('content.chooseFrameworkDesc', messages)
const reactDesc = useStoryLocale('content.reactDesc', messages)
const vueDesc = useStoryLocale('content.vueDesc', messages)
const svelteDesc = useStoryLocale('content.svelteDesc', messages)
const selectFeaturesTitle = useStoryLocale('data.selectFeaturesTitle', messages)
const selectFeaturesDesc = useStoryLocale('content.selectFeaturesDesc', messages)
const authLabel = useStoryLocale('content.authLabel', messages)
const authDesc = useStoryLocale('content.authDesc', messages)
const paymentsLabel = useStoryLocale('content.paymentsLabel', messages)
const paymentsDesc = useStoryLocale('content.paymentsDesc', messages)
const notificationsLabel = useStoryLocale('content.notificationsLabel', messages)
const notificationsDesc = useStoryLocale('content.notificationsDesc', messages)
const analyticsLabel = useStoryLocale('content.analyticsLabel', messages)
const analyticsDesc = useStoryLocale('content.analyticsDesc', messages)
const selectPlanTitle = useStoryLocale('content.selectPlanTitle', messages)
const selectPlanDesc = useStoryLocale('content.selectPlanDesc', messages)
const freeLabel = useStoryLocale('content.freeLabel', messages)
const freeDesc = useStoryLocale('content.freeDesc', messages)
const proLabel = useStoryLocale('content.proLabel', messages)
const proDesc = useStoryLocale('content.proDesc', messages)
const enterpriseLabel = useStoryLocale('content.enterpriseLabel', messages)
const enterpriseDesc = useStoryLocale('content.enterpriseDesc', messages)
const choosePlatformTitle = useStoryLocale('content.choosePlatformTitle', messages)
const platformDesc = useStoryLocale('content.platformDesc', messages)
const webLabel = useStoryLocale('content.webLabel', messages)
const mobileLabel = useStoryLocale('content.mobileLabel', messages)
const desktopLabel = useStoryLocale('content.desktopLabel', messages)
const chooseLanguageTitle = useStoryLocale('content.chooseLanguageTitle', messages)
const languageDesc = useStoryLocale('content.languageDesc', messages)
const tsLabel = useStoryLocale('content.tsLabel', messages)
const jsLabel = useStoryLocale('content.jsLabel', messages)
const pythonLabel = useStoryLocale('content.pythonLabel', messages)
const whatsNeededTitle = useStoryLocale('content.whatsNeededTitle', messages)
const databaseLabel = useStoryLocale('content.baseLabel', messages)
const apiLabel = useStoryLocale('content.apiLabel', messages)
const configCompleteTitle = useStoryLocale('content.configCompleteTitle', messages)
const projectTypeLabel = useStoryLocale('variant.projectTypeLabel', messages)
const frameworkLabel = useStoryLocale('content.frameworkLabel', messages)
const featuresLabel = useStoryLocale('content.featuresLabel', messages)
const receiptFeaturesValue = useStoryLocale('data.receiptFeaturesValue', messages)
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
const someOptionsUnavailable = useStoryLocale('data.someOptionsUnavailable', messages)
const basicLabel = useStoryLocale('content.basicLabel', messages)

const progressiveState = reactive({
  step: 1,
  selectedOptions: [] as string[],
});

function handleSelect(options: string[]) {
  progressiveState.selectedOptions = options;
  alert(`Selected: ${options.join(', ')}`);
}

function handleComplete(answers: Record<string, string[]>) {
  alert(`Completed! Answers: ${JSON.stringify(answers)}`);
}

// Progressive Step 1

// Progressive Step 2

// Multi-select

// Default value

// Upfront mode

// Receipt mode

// Interactive

</script>

<template>
  <Story title="QuestionFlow/All Variants">
    <Variant :title="progressiveModeStep1">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-md">
        <question-flow
          id="question-flow-progressive-1"
          :step="1"
          :title="projectSetupTitle"
          :description="projectSetupDesc"
          :options="[
            { id: 'web', label: webAppLabel },
            { id: 'api', label: apiServiceLabel },
            { id: 'mobile', label: mobileAppLabel },
          ]"
          selection-mode="single"
        />
      </div>
    </Variant>

    <Variant :title="progressiveModeStep2">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-md">
        <question-flow
          id="question-flow-progressive-2"
          :step="2"
          :title="chooseFrameworkTitle"
          :description="chooseFrameworkDesc"
          :options="[
            { id: 'react', label: 'React', description: reactDesc },
            { id: 'vue', label: 'Vue', description: vueDesc },
            { id: 'svelte', label: 'Svelte', description: svelteDesc },
          ]"
          selection-mode="single"
        />
      </div>
    </Variant>

    <Variant :title="progressiveModeMultiSelect">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-md">
        <question-flow
          id="question-flow-multi"
          :step="1"
          :title="selectFeaturesTitle"
          :description="selectFeaturesDesc"
          :options="[
            { id: 'auth', label: authLabel, description: authDesc },
            { id: 'payments', label: paymentsLabel, description: paymentsDesc },
            { id: 'notifications', label: notificationsLabel, description: notificationsDesc },
            { id: 'analytics', label: analyticsLabel, description: analyticsDesc },
          ]"
          selection-mode="multi"
        />
      </div>
    </Variant>

    <Variant :title="progressiveModeWithDefaultValue">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-md">
        <question-flow
          id="question-flow-default"
          :step="1"
          :title="selectPlanTitle"
          :description="selectPlanDesc"
          :options="[
            { id: 'free', label: freeLabel, description: freeDesc },
            { id: 'pro', label: proLabel, description: proDesc },
            { id: 'enterprise', label: enterpriseLabel, description: enterpriseDesc },
          ]"
          selection-mode="single"
          :default-value="['pro']"
        />
      </div>
    </Variant>

    <Variant :title="upfrontModeMultiStep">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-md">
        <question-flow
          id="question-flow-upfront"
          :steps="[
            {
              id: 'platform',
              title: choosePlatformTitle,
              description: platformDesc,
              options: [
                { id: 'web', label: webLabel },
                { id: 'mobile', label: mobileLabel },
                { id: 'desktop', label: desktopLabel },
              ],
            },
            {
              id: 'language',
              title: chooseLanguageTitle,
              description: languageDesc,
              options: [
                { id: 'ts', label: tsLabel },
                { id: 'js', label: jsLabel },
                { id: 'python', label: pythonLabel },
              ],
            },
            {
              id: 'features',
              title: whatsNeededTitle,
              options: [
                { id: 'auth', label: authLabel },
                { id: 'db', label: databaseLabel },
                { id: 'api', label: apiLabel },
              ],
              selectionMode: 'multi',
            },
          ]"
          @complete="handleComplete"
        />
      </div>
    </Variant>

    <Variant :title="upfrontModeWithDisabledOptions">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-md">
        <question-flow
          id="question-flow-disabled"
          :steps="[
            {
              id: 'tier',
              title: selectPlanTitle,
              description: someOptionsUnavailable,
              options: [
                { id: 'basic', label: basicLabel },
                { id: 'pro', label: proLabel, disabled: true },
                { id: 'enterprise', label: enterpriseLabel, disabled: true },
              ],
            },
          ]"
        />
      </div>
    </Variant>

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
