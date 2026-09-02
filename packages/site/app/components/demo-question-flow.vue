<script setup lang="ts">
import { QuestionFlow } from '@lionad/vtu-components'
import type { QuestionFlowChoice, QuestionFlowStepDefinition } from '@lionad/vtu-components'
import { computed, ref } from 'vue'
import DemoChatMessage from './demo-chat-message.vue'
import DemoDelayedShow from './demo-delayed-show.vue'
import { useSiteLocale } from '../composables/use-site-locale'

const { t } = useSiteLocale()

type Step = 'flow' | 'done'
const step = ref<Step>('flow')
const choice = ref<QuestionFlowChoice | null>(null)

// 三步选项流:单选/单选/多选;选项 id 用 slug,label 随语言切换
const steps = computed<QuestionFlowStepDefinition[]>(() => [
  {
    id: 'genre',
    title: t('demoQuestionFlow.stepGenreTitle').value,
    description: t('demoQuestionFlow.stepGenreDesc').value,
    options: [
      { id: 'sci-fi', label: t('demoQuestionFlow.genreSciFi').value },
      { id: 'literature', label: t('demoQuestionFlow.genreLiterature').value },
      { id: 'history', label: t('demoQuestionFlow.genreHistory').value },
      { id: 'business', label: t('demoQuestionFlow.genreBusiness').value }
    ],
    selectionMode: 'single'
  },
  {
    id: 'length',
    title: t('demoQuestionFlow.stepLengthTitle').value,
    options: [
      { id: 'short', label: t('demoQuestionFlow.lengthShort').value },
      { id: 'novella', label: t('demoQuestionFlow.lengthNovella').value },
      { id: 'novel', label: t('demoQuestionFlow.lengthNovel').value }
    ],
    selectionMode: 'single'
  },
  {
    id: 'mood',
    title: t('demoQuestionFlow.stepMoodTitle').value,
    description: t('demoQuestionFlow.stepMoodDesc').value,
    options: [
      { id: 'healing', label: t('demoQuestionFlow.moodHealing').value },
      { id: 'twisty', label: t('demoQuestionFlow.moodTwisty').value },
      { id: 'humorous', label: t('demoQuestionFlow.moodHumorous').value },
      { id: 'epic', label: t('demoQuestionFlow.moodEpic').value }
    ],
    selectionMode: 'multi'
  }
])

const stepLabels = computed(() => ({
  genre: t('demoQuestionFlow.labelGenre').value,
  length: t('demoQuestionFlow.labelLength').value,
  mood: t('demoQuestionFlow.labelMood').value
}))

// 回执摘要需要可读文案:把 option id 经当前 steps 反查为 label
function handleComplete(answers: Record<string, string[]>) {
  const summary = Object.entries(answers).map(([stepId, optionIds]) => {
    const def = steps.value.find((s) => s.id === stepId)
    const labels = optionIds
      .map((oid) => def?.options.find((o) => o.id === oid)?.label ?? oid)
      .join('、')
    return {
      label: stepLabels.value[stepId as keyof typeof stepLabels.value] ?? stepId,
      value: labels
    }
  })
  choice.value = { title: t('demoQuestionFlow.receiptTitle').value, summary }
  step.value = 'done'
}

function handleRestart() {
  choice.value = null
  step.value = 'flow'
}
</script>

<template>
  <div class="mx-auto w-full max-w-3xl space-y-4" data-testid="demo-question-flow">
    <!-- Agent 引出选项流 -->
    <div class="flex justify-start">
      <div class="w-full max-w-[90%] space-y-3">
        <DemoChatMessage role="agent" :content="t('demoQuestionFlow.agentIntro').value" :delay="0" :order="0" />

        <!-- 选项流:前置三步 → 完成后回执 -->
        <DemoDelayedShow :order="1">
          <div data-testid="demo-question-flow-widget">
            <QuestionFlow
              v-if="step === 'flow'"
              id="demo-qf"
              :steps="steps"
              @complete="handleComplete"
            />
            <QuestionFlow
              v-else-if="choice"
              id="demo-qf"
              :choice="choice"
            />
          </div>
        </DemoDelayedShow>

        <DemoChatMessage
          v-if="step === 'done'"
          role="agent"
          :content="t('demoQuestionFlow.agentDone').value"
          :delay="0"
          :order="2"
        />

        <!-- 重开入口:回执态下可重新走一遍流程 -->
        <div v-if="step === 'done'" class="flex justify-start">
          <button
            type="button"
            class="text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground"
            data-testid="demo-question-flow-restart"
            @click="handleRestart"
          >
            {{ t('demoQuestionFlow.restart').value }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
