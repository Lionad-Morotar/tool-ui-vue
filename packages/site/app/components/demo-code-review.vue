<script setup lang="ts">
import { CodeDiff } from '@lionad/vtu-components'
import { ref } from 'vue'
import DemoDelayedShow from './demo-delayed-show.vue'

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

        <DemoDelayedShow :order="2">
          <CodeDiff
            id="demo-code-diff"
            filename="utils/formatDate.ts"
            language="typescript"
            old-code="export function formatDate(date: Date) {
  return date.toLocaleDateString();
}"
            new-code="export function formatDate(date: Date) {
  return date.toLocaleDateString('zh-cn', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}"
          />

          <div class="mt-2 flex items-center gap-2">
            <button
              class="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground"
              @click="step = 2"
            >
              {{ t('demoCode.actionApply').value }}
            </button>
          </div>
        </DemoDelayedShow>
      </div>
    </div>

    <!-- 用户确认应用 — 点击后 order 重置 -->
    <DemoChatMessage
      v-if="step >= 2"
      role="user"
      :content="t('demoCode.userApplied').value"
      :delay="0"
      :order="0"
    />

    <!-- Agent 确认 -->
    <div
      v-if="step >= 2"
      class="flex justify-start"
    >
      <div class="w-full max-w-[95%] space-y-3">
        <DemoChatMessage role="agent" :content="t('demoCode.agentConfirm').value" :delay="0" :order="1" />

        <DemoDelayedShow :order="2">
          <div class="flex items-center gap-2">
            <button
              class="rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted"
              @click="step = 3"
            >
              {{ t('demoCode.actionMerge').value }}
            </button>
          </div>
        </DemoDelayedShow>
      </div>
    </div>

    <!-- 合并成功 — 点击后 order 重置 -->
    <DemoChatMessage
      v-if="step >= 3"
      role="user"
      :content="t('demoCode.userMerged').value"
      :delay="0"
      :order="0"
    />

    <DemoChatMessage
      v-if="step >= 3"
      role="agent"
      :content="t('demoCode.agentDone').value"
      :delay="0"
      :order="1"
    />
  </div>
</template>
