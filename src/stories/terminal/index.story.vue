<script setup lang="ts">
import { Terminal } from '@lionad/vtu-components';
import messages from './i18n';
import { useStoryLocale } from '../_shared/use-story-locale'

const Name = useStoryLocale('content.name', messages)
const Type = useStoryLocale('content.type', messages)
const Default = useStoryLocale('content.default', messages)
const Description = useStoryLocale('content.description', messages)
const Props = useStoryLocale('content.props', messages)
const SuccessWithANSI = useStoryLocale('content.successWithANSI', messages)
const TerminalProps = useStoryLocale('content.terminalProps', messages)

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
