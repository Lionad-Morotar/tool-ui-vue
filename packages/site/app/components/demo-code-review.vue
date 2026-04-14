<script setup lang="ts">
import { CodeDiff } from '@lionad/vtu-components'
import { ref } from 'vue'

const step = ref(1)
const { t } = useSiteLocale()
</script>

<template>
  <div class="mx-auto max-w-3xl space-y-4">
    <!-- 用户首轮 -->
    <div class="flex justify-end">
      <div class="max-w-[80%] rounded-2xl rounded-tr-sm bg-primary px-4 py-2 text-sm text-primary-foreground">
        {{ t('demoCode.userIntro') }}
      </div>
    </div>

    <!-- Agent 回复审查结果 -->
    <div class="flex justify-start">
      <div class="w-full max-w-[95%] space-y-3">
        <p class="text-sm text-muted-foreground">
          {{ t('demoCode.agentReview', { file: 'utils/formatDate.ts', fn: 'toLocaleDateString()' }) }}
        </p>

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
            {{ t('demoCode.actionApply') }}
          </button>
        </div>
      </div>
    </div>

    <!-- 用户确认应用 -->
    <div
      v-if="step >= 2"
      class="flex justify-end"
    >
      <div class="max-w-[80%] rounded-2xl rounded-tr-sm bg-primary px-4 py-2 text-sm text-primary-foreground">
        {{ t('demoCode.userApplied') }}
      </div>
    </div>

    <!-- Agent 最终确认 -->
    <div
      v-if="step >= 2"
      class="flex justify-start"
    >
      <div class="max-w-[95%] space-y-3">
        <p class="text-sm text-muted-foreground">
          {{ t('demoCode.agentConfirm') }}
        </p>

        <div class="flex items-center gap-2">
          <button
            class="rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted"
            @click="step = 3"
          >
            {{ t('demoCode.actionMerge') }}
          </button>
        </div>
      </div>
    </div>

    <!-- 合并成功 -->
    <div
      v-if="step >= 3"
      class="flex justify-end"
    >
      <div class="max-w-[80%] rounded-2xl rounded-tr-sm bg-primary px-4 py-2 text-sm text-primary-foreground">
        {{ t('demoCode.userMerged') }}
      </div>
    </div>

    <div
      v-if="step >= 3"
      class="flex justify-start"
    >
      <div class="max-w-[90%] rounded-2xl rounded-tl-sm bg-muted px-4 py-2 text-sm text-muted-foreground">
        {{ t('demoCode.agentDone') }}
      </div>
    </div>
  </div>
</template>
