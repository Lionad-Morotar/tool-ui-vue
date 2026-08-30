<script setup lang="ts">
import { Terminal } from '@lionad/vtu-components';
import messages from './i18n';
import { useStoryLocale } from '../_shared/use-story-locale'

const WithError = useStoryLocale('content.withError', messages)
const WithWorkingDirectory = useStoryLocale('content.withWorkingDirectory', messages)
const LongOutputCollapsed = useStoryLocale('content.longOutputCollapsed', messages)
const Truncated = useStoryLocale('content.truncated', messages)
const SimpleCommand = useStoryLocale('content.simpleCommand', messages)

const withError = WithError
const withWorkingDirectory = WithWorkingDirectory
const longOutputCollapsed = LongOutputCollapsed
const truncated = Truncated
const simpleCommand = SimpleCommand
</script>

<template>
  <Story title="Terminal/Outputs">
    <Variant :title="withError">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-2xl">
        <terminal
          id="terminal-error"
          command="npm test"
          stdout="> tool-ui@1.0.0 test
> vitest

 FAIL  src/vtu-components/__tests__/Button.test.ts > Button > renders correctly
AssertionError: expected true to be false
 ❯ src/vtu-components/__tests__/Button.test.ts:15:23"
          stderr="Test failed: 1 test failed"
          :exit-code="1"
          :duration-ms="2450"
        />
      </div>
    </Variant>

    <Variant :title="withWorkingDirectory">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-2xl">
        <terminal
          id="terminal-cwd"
          command="git status"
          stdout="On branch main
Your branch is up to date with 'origin/main'.

Changes not staged for commit:
  (use 'git add [file]...' to update what will be committed)
  (use 'git restore [file]...' to discard changes in working directory)
	modified:   src/vtu-components/Button.tsx

no changes added to commit"
          :exit-code="0"
          cwd="~/projects/my-app"
        />
      </div>
    </Variant>

    <Variant :title="longOutputCollapsed">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-2xl">
        <terminal
          id="terminal-long"
          command="ls -la"
          stdout="total 128
drwxr-xr-x  12 user staff   384 Jan 15 10:30 .
drwxr-xr-x   5 user staff   160 Jan 15 10:00 ..
-rw-r--r--   1 user staff  6148 Jan 15 10:30 .DS_Store
-rw-r--r--   1 user staff   220 Jan 15 09:00 .gitignore
-rw-r--r--   1 user staff  1082 Jan 15 09:00 LICENSE
-rw-r--r--   1 user staff  2845 Jan 15 10:15 README.md
drwxr-xr-x   3 user staff    96 Jan 15 09:00 dist
drwxr-xr-x   3 user staff    96 Jan 15 09:00 node_modules
-rw-r--r--   1 user staff  1523 Jan 15 09:00 package.json
drwxr-xr-x   4 user staff   128 Jan 15 09:00 src
drwxr-xr-x   3 user staff    96 Jan 15 09:00 tests
-rw-r--r--   1 user staff  8932 Jan 15 10:30 tsconfig.json
-rw-r--r--   1 user staff  1245 Jan 15 09:00 vite.config.ts"
          :exit-code="0"
          :max-collapsed-lines="8"
        />
      </div>
    </Variant>

    <Variant :title="truncated">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-2xl">
        <terminal
          id="terminal-truncated"
          command="cat large-file.log"
          stdout="[2024-01-15 10:00:00] INFO: Starting application...
[2024-01-15 10:00:01] INFO: Loading configuration...
[2024-01-15 10:00:02] INFO: Connecting to database...
[2024-01-15 10:00:03] INFO: Database connected successfully
..."
          :exit-code="0"
          :truncated="true"
        />
      </div>
    </Variant>

    <Variant :title="simpleCommand">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-md">
        <terminal
          id="terminal-simple"
          command="echo 'Hello World'"
          stdout="Hello World"
          :exit-code="0"
          :duration-ms="50"
        />
      </div>
    </Variant>
  </Story>
</template>
