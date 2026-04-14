<script setup lang="ts">
import { CodeDiff } from '@lionad/vtu-components'
import { ref } from 'vue'

const step = ref(1)
const { t } = useSiteLocale()
</script>

<template>
  <div class="mx-auto max-w-3xl space-y-4">
    <!-- 用户首轮 -->
    <DemoChatMessage role="user" :content="t('demoCode.userIntro').value" :delay="0" :order="0" />

    <!-- Agent 回复审查结果 -->
    <div class="flex justify-start">
      <div class="w-full max-w-[95%] space-y-3">
        <DemoChatMessage
          role="agent"
          :content="t('demoCode.agentReview', { file: 'utils/formatDate.ts', fn: 'toLocaleDateString()' }).value"
          :delay="120"
          :order="1"
        />

        <Transition
          enter-active-class="transition-all duration-500 ease-out"
          enter-from-class="opacity-0 translate-y-3"
          enter-to-class="opacity-100 translate-y-0"
        >
          <div>
            <CodeDiff
              id="demo-code-diff"
              filename="utils/formatDate.ts"
              language="typescript"
              old-code="export function formatDate(date: Date) {
  return date.toLocaleDateString();
}"
              new-code="export function formatDate(date: Date) {
  return date.toLocaleDateString('zh-CN', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}"
            />

            <div class="flex items-center gap-2">
              <button
                class="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground"
                @click="step = 2"
              >
                {{ t('demoCode.actionApply').value }}
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </div>

    <!-- 用户确认应用 -->
    <DemoChatMessage
      v-if="step >= 2"
      role="user"
      :content="t('demoCode.userApplied').value"
      :delay="0"
      :order="2"
    />

    <!-- Agent 最终确认 -->
    <div
      v-if="step >= 2"
      class="flex justify-start"
    >
      <div class="w-full max-w-[95%] space-y-3">
        <DemoChatMessage role="agent" :content="t('demoCode.agentConfirm').value" :delay="120" :order="3" />

        <Transition
          enter-active-class="transition-all duration-500 ease-out"
          enter-from-class="opacity-0 translate-y-3"
          enter-to-class="opacity-100 translate-y-0"
        >
          <div class="flex items-center gap-2">
            <button
              class="rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted"
              @click="step = 3"
            >
              {{ t('demoCode.actionMerge').value }}
            </button>
          </div>
        </Transition>
      </div>
    </div>

    <!-- 合并成功 -->
    <DemoChatMessage
      v-if="step >= 3"
      role="user"
      :content="t('demoCode.userMerged').value"
      :delay="0"
      :order="4"
    />

    <DemoChatMessage
      v-if="step >= 3"
      role="agent"
      :content="t('demoCode.agentDone').value"
      :delay="120"
      :order="5"
    />
  </div>
</template>
