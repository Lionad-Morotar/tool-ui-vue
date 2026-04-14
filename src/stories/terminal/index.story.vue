<script setup lang="ts">
import { reactive } from 'vue';
import { Terminal } from '@lionad/vtu-components';
import messages from './i18n';
import { useStoryLocale } from '../_shared/use-story-locale'

const Name = useStoryLocale('content.name', messages)
const Type = useStoryLocale('content.type', messages)
const Default = useStoryLocale('content.default', messages)
const Description = useStoryLocale('content.description', messages)
const Props = useStoryLocale('content.props', messages)
const SuccessWithANSI = useStoryLocale('content.successWithANSI', messages)
const WithError = useStoryLocale('content.withError', messages)
const WithWorkingDirectory = useStoryLocale('content.withWorkingDirectory', messages)
const LongOutputCollapsed = useStoryLocale('content.longOutputCollapsed', messages)
const Truncated = useStoryLocale('content.truncated', messages)
const SimpleCommand = useStoryLocale('content.simpleCommand', messages)
const DarkThemeSuccess = useStoryLocale('content.darkThemeSuccess', messages)
const DarkThemeError = useStoryLocale('content.darkThemeError', messages)
const Interactive = useStoryLocale('content.interactive', messages)
const TerminalProps = useStoryLocale('content.terminalProps', messages)
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

// Props documentation
const props = [
  { name: 'id', type: 'string', required: true, description: { zh: '终端的唯一标识符', en: 'Unique identifier for the terminal' } },
  { name: 'command', type: 'string', required: true, description: { zh: '执行的命令', en: 'The command that was executed' } },
  { name: 'stdout', type: 'string', description: { zh: '标准输出', en: 'Standard output from the command' } },
  { name: 'stderr', type: 'string', description: { zh: '标准错误', en: 'Standard error from the command' } },
  { name: 'exitCode', type: 'number', required: true, description: { zh: '退出码（0=成功，>0=错误）', en: 'Exit code (0 = success, >0 = error)' } },
  { name: 'durationMs', type: 'number', description: { zh: '命令执行时长（毫秒）', en: 'Command execution duration in milliseconds' } },
  { name: 'cwd', type: 'string', description: { zh: '当前工作目录', en: 'Current working directory' } },
  { name: 'truncated', type: 'boolean', description: { zh: '输出是否被截断', en: 'Whether output was truncated' } },
  { name: 'maxCollapsedLines', type: 'number', description: { zh: '折叠前的最大行数', en: 'Maximum lines before collapsing' } },
  { name: 'css', type: '{ root?: string }', description: { zh: '组件元素的 CSS 类', en: 'CSS classes for component elements' } },
];

const headerName = Name
const headerType = Type
const headerDefault = Default
const headerDesc = Description


const propsTitle = Props
const successWithANSIColors = SuccessWithANSI
const withError = WithError
const withWorkingDirectory = WithWorkingDirectory
const longOutputCollapsed = LongOutputCollapsed
const truncated = Truncated
const simpleCommand = SimpleCommand
const darkThemeSuccess = DarkThemeSuccess
const darkThemeError = DarkThemeError
const interactive = Interactive

</script>

<template>
  <Story title="Terminal/All">
    <Variant :title="successWithANSIColors">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-2xl">
        <terminal
          id="terminal-ansi-colors"
          command="pnpm test"
          :stdout="`\x1b[32m✓\x1b[0m src/utils.test.ts \x1b[90m(5 tests)\x1b[0m \x1b[33m23ms\x1b[0m\n\x1b[32m✓\x1b[0m src/api.test.ts \x1b[90m(12 tests)\x1b[0m \x1b[33m156ms\x1b[0m\n\x1b[32m✓\x1b[0m src/vtu-components.test.ts \x1b[90m(8 tests)\x1b[0m \x1b[33m89ms\x1b[0m\n\n\x1b[1mTest Files\x1b[0m  \x1b[32m3 passed\x1b[0m (3)\n\x1b[1m     Tests\x1b[0m  \x1b[32m25 passed\x1b[0m (25)\n\x1b[1m  Start at\x1b[0m  10:23:45\n\x1b[1m  Duration\x1b[0m  312ms`"
          :exit-code="0"
          :duration-ms="312"
          cwd="~/project"
        />
      </div>
    </Variant>

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

    <Variant :title="propsTitle">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-4xl p-6">
        <h2 class="mb-4 text-2xl font-bold">{{ TerminalProps }}</h2>
        <div class="overflow-x-auto">
          <table class="story-table">
            <thead>
              <tr>
                <th>{{ headerName }}</th>
                <th>{{ headerType }}</th>
                <th>{{ headerDefault }}</th>
                <th>{{ headerDesc }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="prop in props" :key="prop.name">
                <td class="font-mono text-emerald-600">{{ prop.name }}</td>
                <td class="font-mono text-blue-600">{{ prop.type }}</td>
                <td class="text-muted-foreground">{{ 'default' in prop ? prop.default : '-' }}</td>
                <td>{{ useStoryLocale(prop.description) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </Variant>
  </Story>
</template>
