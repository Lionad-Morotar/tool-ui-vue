<script setup lang="ts">
import { reactive } from 'vue';
import { Terminal } from '@lionad/vtu-components';
import messages from './i18n';
import { useStoryLocale } from '../_shared/use-story-locale'

const DarkThemeSuccess = useStoryLocale('content.darkThemeSuccess', messages)
const DarkThemeError = useStoryLocale('content.darkThemeError', messages)
const Interactive = useStoryLocale('content.interactive', messages)
const Command = useStoryLocale('content.command', messages)
const ExitCode = useStoryLocale('content.exitCode', messages)
const DurationMs = useStoryLocale('content.durationMs', messages)
const CWD = useStoryLocale('content.cWD', messages)

const interactiveState = reactive({
  command: 'npm install',
  stdout: 'added 42 packages in 2s\n\n14 packages are looking for funding\nrun `npm fund` for details',
  stderr: '',
  exitCode: 0,
  durationMs: 2150,
  cwd: '~/projects/my-app',
});

const darkThemeSuccess = DarkThemeSuccess
const darkThemeError = DarkThemeError
const interactive = Interactive
</script>

<template>
  <Story title="Terminal/Dark">
    <Variant :title="darkThemeSuccess">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="dark w-full max-w-2xl">
        <terminal
          id="terminal-dark-success"
          command="pnpm build"
          :stdout="`\x1b[32m✓\x1b[0m 45 modules transformed.\n\x1b[32m✓\x1b[0m built in 2.34s\n\x1b[32m✓\x1b[0m Build completed successfully`"
          :exit-code="0"
          :duration-ms="2340"
          cwd="~/project"
        />
      </div>
    </Variant>

    <Variant :title="darkThemeError">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="dark w-full max-w-2xl">
        <terminal
          id="terminal-dark-error"
          command="npm test"
          stdout="FAIL src/utils.test.ts"
          stderr="Error: Expected 5 to be 10"
          :exit-code="1"
          :duration-ms="1200"
        />
      </div>
    </Variant>

    <Variant :title="interactive" auto-props-disabled>
      <div class="w-full max-w-2xl space-y-4">
        <div class="flex flex-wrap items-center gap-4 rounded-lg bg-muted p-4">
          <div class="flex items-center gap-2">
            <label class="text-sm font-medium">{{ Command }}</label>
            <input
              v-model="interactiveState.command"
              type="text"
              class="w-40 rounded-md border border-border bg-background px-3 py-1 text-sm"
            />
          </div>
          <div class="flex items-center gap-2">
            <label class="text-sm font-medium">{{ ExitCode }}</label>
            <input
              v-model.number="interactiveState.exitCode"
              type="number"
              min="0"
              class="w-20 rounded-md border border-border bg-background px-3 py-1 text-sm"
            />
          </div>
          <div class="flex items-center gap-2">
            <label class="text-sm font-medium">{{ DurationMs }}</label>
            <input
              v-model.number="interactiveState.durationMs"
              type="number"
              min="0"
              class="w-24 rounded-md border border-border bg-background px-3 py-1 text-sm"
            />
          </div>
          <div class="flex items-center gap-2">
            <label class="text-sm font-medium">{{ CWD }}</label>
            <input
              v-model="interactiveState.cwd"
              type="text"
              class="w-32 rounded-md border border-border bg-background px-3 py-1 text-sm"
            />
          </div>
        </div>
        <terminal
          id="terminal-interactive"
          v-bind="interactiveState"
        />
      </div>
    </Variant>
  </Story>
</template>
