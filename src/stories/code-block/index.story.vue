<script setup lang="ts">
import { CodeBlock } from '@lionad/vtu-components';
import messages from './i18n';
import { useStoryLocale } from '../_shared/use-story-locale'

const Name = useStoryLocale('content.name', messages)
const Type = useStoryLocale('content.type', messages)
const Default = useStoryLocale('content.default', messages)
const Description = useStoryLocale('content.description', messages)
const Props = useStoryLocale('content.props', messages)
const TypeScript = useStoryLocale('content.typeScript', messages)
const CodeBlockProps = useStoryLocale('content.codeBlockProps', messages)
const SupportedLanguages1 = useStoryLocale('content.supportedLanguages1', messages)

const exampleCode = `interface User {
  id: string;
  name: string;
  email: string;
}

function greet(user: User): string {
  return \`Hello, \${user.name}!\`;
}

const user: User = {
  id: "1",
  name: "Alice",
  email: "alice@example.com",
};

console.log(greet(user));`;

// Props documentation
const props = [
  { name: 'id', type: 'string', required: true, description: { zh: '代码块的唯一标识符', en: 'Unique identifier for the code block' } },
  { name: 'code', type: 'string', required: true, description: { zh: '要显示的代码内容', en: 'The code content to display' } },
  { name: 'language', type: 'string', default: 'text', description: { zh: '语法高亮的编程语言', en: 'Programming language for syntax highlighting' } },
  { name: 'filename', type: 'string', description: { zh: '可选的显示文件名', en: 'Optional filename to display in the header' } },
  { name: 'lineNumbers', type: "'visible' | 'hidden'", default: 'visible', description: { zh: '是否显示行号', en: 'Whether to show line numbers' } },
  { name: 'highlightLines', type: 'number[]', description: { zh: '要高亮的行号数组', en: 'Array of line numbers to highlight' } },
  { name: 'maxCollapsedLines', type: 'number', description: { zh: '折叠前的最大行数', en: 'Maximum lines to show before collapsing' } },
  { name: 'css', type: '{ root?: string }', description: { zh: '组件元素的 CSS 类', en: 'CSS classes for component elements' } },
];

const headerName = Name
const headerType = Type
const headerDefault = Default
const headerDesc = Description

const languages = [
  'typescript', 'javascript', 'python', 'tsx', 'jsx',
  'json', 'bash', 'shell', 'css', 'html',
  'markdown', 'sql', 'yaml', 'go', 'rust', 'text'
];
const propsTitle = Props
const typeScript = TypeScript

</script>

<template>
  <Story title="CodeBlock/All">
    <Variant :title="typeScript">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-2xl">
        <code-block
          id="code-typescript"
          language="typescript"
          filename="example.ts"
          :code="exampleCode"
        />
      </div>
    </Variant>

    <Variant :title="propsTitle">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-4xl p-6">
        <h2 class="mb-4 text-2xl font-bold">{{ CodeBlockProps }}</h2>
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
                <td class="text-muted-foreground">{{ prop.default || '-' }}</td>
                <td>{{ useStoryLocale(prop.description) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-4xl p-6">
        <h2 class="mb-4 text-2xl font-bold">{{ SupportedLanguages1 }}</h2>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="lang in languages"
            :key="lang"
            class="rounded-full bg-muted px-3 py-1 font-mono text-sm"
          >
            {{ lang }}
          </span>
        </div>
      </div>
    </Variant>
  </Story>
</template>
