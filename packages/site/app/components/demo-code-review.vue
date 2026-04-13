<script setup lang="ts">
import { CodeDiff } from '@lionad/vtu-components'
import { ref } from 'vue'

const step = ref(1)
</script>

<template>
  <div class="mx-auto max-w-3xl space-y-4">
    <!-- 用户首轮 -->
    <div class="flex justify-end">
      <div class="max-w-[80%] rounded-2xl rounded-tr-sm bg-primary px-4 py-2 text-sm text-primary-foreground">
        帮我 review 一下这个 PR 里的日期格式化代码，总觉得时区处理有问题。
      </div>
    </div>

    <!-- Agent 回复审查结果 -->
    <div class="flex justify-start">
      <div class="w-full max-w-[95%] space-y-3">
        <p class="text-sm text-muted-foreground">
          我检查了 <code class="rounded bg-muted px-1 py-0.5 text-xs">utils/formatDate.ts</code> 的改动，发现一处潜在问题：
          <code class="rounded bg-muted px-1 py-0.5 text-xs">
            toLocaleDateString()
          </code> 在未指定时区的情况下会跟随用户本地环境，对于需要固定展示北京时间的业务场景可能导致不一致。建议如下修改：
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
            应用修改
          </button>
        </div>
      </div>
    </div>

    <!-- 用户确认应用 -->
    <div v-if="step >= 2" class="flex justify-end">
      <div class="max-w-[80%] rounded-2xl rounded-tr-sm bg-primary px-4 py-2 text-sm text-primary-foreground">
        已经按照建议修改并提交了，再看看还有没有其他问题？
      </div>
    </div>

    <!-- Agent 最终确认 -->
    <div v-if="step >= 2" class="flex justify-start">
      <div class="max-w-[95%] space-y-3">
        <p class="text-sm text-muted-foreground">
          修改后的代码看起来很好，时区问题已经解决。整体改动简洁，没有引入额外风险。PR 可以合并了。
        </p>

        <div class="flex items-center gap-2">
          <button
            class="rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted"
            @click="step = 3"
          >
            合并 PR
          </button>
        </div>
      </div>
    </div>

    <!-- 合并成功 -->
    <div v-if="step >= 3" class="flex justify-end">
      <div class="max-w-[80%] rounded-2xl rounded-tr-sm bg-primary px-4 py-2 text-sm text-primary-foreground">
        已合并，谢谢 review！
      </div>
    </div>

    <div v-if="step >= 3" class="flex justify-start">
      <div class="max-w-[90%] rounded-2xl rounded-tl-sm bg-muted px-4 py-2 text-sm text-muted-foreground">
        不客气，有问题随时找我。
      </div>
    </div>
  </div>
</template>
