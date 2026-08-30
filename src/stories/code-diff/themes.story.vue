<script setup lang="ts">
import { reactive } from 'vue';
import { CodeDiff } from '@lionad/vtu-components';
import messages from './i18n';
import { useStoryLocale } from '../_shared/use-story-locale'

const InteractiveToggleDiff = useStoryLocale('content.interactiveToggleDiff', messages)
const DarkThemeUnified = useStoryLocale('content.darkThemeUnified', messages)
const DarkThemeSplit = useStoryLocale('content.darkThemeSplit', messages)
const DiffStyle = useStoryLocale('content.diffStyle', messages)
const ShowLineNumbers = useStoryLocale('content.showLineNumbers', messages)

const oldFunction = `export async function fetchUser(id: string) {
  const res = await db.users.findUnique({ where: { id } });
  if (!res) throw new Error("User not found");
  return res;
}`;

const newFunction = `export async function fetchUser(id: string) {
  const res = await db.users.findUnique({ where: { id } });
  if (!res) return null;
  return res;
}`;

const diffState = reactive({
  style: 'unified' as 'unified' | 'split',
  showLines: true
});

const interactiveToggleDiffStyle = InteractiveToggleDiff
const darkThemeUnified = DarkThemeUnified
const darkThemeSplit = DarkThemeSplit
</script>

<template>
  <Story title="CodeDiff/Themes">
    <Variant :title="interactiveToggleDiffStyle">
      <div class="w-full max-w-4xl">
        <div class="mb-4 flex items-center gap-4 rounded-lg bg-muted p-4">
          <label class="flex items-center gap-2 text-sm">
            <select
              v-model="diffState.style"
              class="rounded border border-border px-2 py-1"
            >
              <option value="unified">Unified</option>
              <option value="split">Split</option>
            </select>
            {{ DiffStyle }}
          </label>
          <label class="flex items-center gap-2 text-sm">
            <input
              v-model="diffState.showLines"
              type="checkbox"
              class="rounded border border-border"
            />
            {{ ShowLineNumbers }}
          </label>
        </div>
        <code-diff
          id="diff-interactive-style"
          language="typescript"
          filename="api.ts"
          :old-code="oldFunction"
          :new-code="newFunction"
          :diff-style="diffState.style"
          :line-numbers="diffState.showLines ? 'visible' : 'hidden'"
        />
      </div>
    </Variant>

    <Variant :title="darkThemeUnified">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="dark w-full max-w-3xl">
        <code-diff
          id="diff-dark-unified"
          language="typescript"
          filename="api.ts"
          :old-code="oldFunction"
          :new-code="newFunction"
          diff-style="unified"
        />
      </div>
    </Variant>

    <Variant :title="darkThemeSplit">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="dark w-full max-w-4xl">
        <code-diff
          id="diff-dark-split"
          language="typescript"
          filename="api.ts"
          :old-code="oldFunction"
          :new-code="newFunction"
          diff-style="split"
        />
      </div>
    </Variant>
  </Story>
</template>
