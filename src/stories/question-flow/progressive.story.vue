<script setup lang="ts">
import { QuestionFlow } from '@lionad/vtu-components';
import messages from './i18n';
import { useStoryLocale } from '../_shared/use-story-locale'

const progressiveModeStep2 = useStoryLocale('variant.progressiveModeStep2', messages)
const progressiveModeMultiSelect = useStoryLocale('variant.progressiveModeMultiSelect', messages)
const progressiveModeWithDefaultValue = useStoryLocale('variant.progressiveModeWithDefaultValue', messages)
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
</script>

<template>
  <Story title="QuestionFlow/Progressive">
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
  </Story>
</template>
