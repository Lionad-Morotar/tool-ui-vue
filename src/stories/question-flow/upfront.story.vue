<script setup lang="ts">
import { QuestionFlow } from '@lionad/vtu-components';
import messages from './i18n';
import { useStoryLocale } from '../_shared/use-story-locale'

const upfrontModeMultiStep = useStoryLocale('variant.upfrontModeMultiStep', messages)
const upfrontModeWithDisabledOptions = useStoryLocale('variant.upfrontModeWithDisabledOptions', messages)
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
const authLabel = useStoryLocale('content.authLabel', messages)
const selectPlanTitle = useStoryLocale('content.selectPlanTitle', messages)
const someOptionsUnavailable = useStoryLocale('data.someOptionsUnavailable', messages)
const basicLabel = useStoryLocale('content.basicLabel', messages)
const proLabel = useStoryLocale('content.proLabel', messages)
const enterpriseLabel = useStoryLocale('content.enterpriseLabel', messages)

function handleComplete(answers: Record<string, string[]>) {
  alert(`Completed! Answers: ${JSON.stringify(answers)}`);
}
</script>

<template>
  <Story title="QuestionFlow/Upfront">
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
  </Story>
</template>
