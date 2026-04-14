<script setup lang="ts">
import { reactive } from 'vue';
import { CodeBlock } from '@lionad/vtu-components';
import messages from './i18n';
import { useStoryLocale } from '../_shared/use-story-locale'

const Name = useStoryLocale('content.name', messages)
const Type = useStoryLocale('content.type', messages)
const Default = useStoryLocale('content.default', messages)
const Description = useStoryLocale('content.description', messages)
const Props = useStoryLocale('content.props', messages)
const TypeScript = useStoryLocale('content.typeScript', messages)
const JavaScript = useStoryLocale('content.javaScript', messages)
const Python = useStoryLocale('content.python', messages)
const CSS = useStoryLocale('content.cSS', messages)
const WithHighlightedLines = useStoryLocale('content.withHighlightedLines', messages)
const WithoutLineNumbers = useStoryLocale('content.withoutLineNumbers', messages)
const CollapsedLongCode = useStoryLocale('content.collapsedLongCode', messages)
const NoFilename = useStoryLocale('content.noFilename', messages)
const DarkTheme = useStoryLocale('content.darkTheme', messages)
const Interactive = useStoryLocale('content.interactive', messages)
const CodeBlockProps = useStoryLocale('content.codeBlockProps', messages)
const SupportedLanguages1 = useStoryLocale('content.supportedLanguages1', messages)
const Language = useStoryLocale('content.language', messages)
const ShowLineNumbers = useStoryLocale('content.showLineNumbers', messages)

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

const longCode = `// This is a longer code example to demonstrate
// the maxCollapsedLines feature
import { ref, computed } from "vue";

export function useCounter(initial = 0) {
  const count = ref(initial);

  const doubled = computed(() => count.value * 2);

  function increment() {
    count.value++;
  }

  function decrement() {
    count.value--;
  }

  function reset() {
    count.value = initial;
  }

  return {
    count,
    doubled,
    increment,
    decrement,
    reset,
  };
}`;

const interactiveCode = `// Interactive example
function greet(name: string, greeting = "Hello"): string {
  return \`\${greeting}, \${name}!\`;
}

// Try changing the parameters
console.log(greet("World"));
console.log(greet("Alice", "Hi"));`;

const interactiveState = reactive({
  code: interactiveCode,
  language: 'typescript',
  filename: 'interactive.ts',
  lineNumbers: 'visible' as const,
  highlightLines: [2, 7] as number[] | undefined,
});

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
const javaScript = JavaScript
const python = Python
const cSS = CSS
const withHighlightedLines = WithHighlightedLines
const withoutLineNumbers = WithoutLineNumbers
const collapsedLongCode = CollapsedLongCode
const noFilename = NoFilename
const darkTheme = DarkTheme
const interactive = Interactive

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

    <Variant :title="javaScript">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-xl">
        <code-block
          id="code-javascript"
          language="javascript"
          filename="utils.js"
          code="function sum(a, b) {
  return a + b;
}

const result = sum(5, 3);
console.log(result); // 8"
        />
      </div>
    </Variant>

    <Variant :title="python">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-xl">
        <code-block
          id="code-python"
          language="python"
          filename="script.py"
          code="def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

for i in range(10):
    print(fibonacci(i))"
        />
      </div>
    </Variant>

    <Variant :title="cSS">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-xl">
        <code-block
          id="code-css"
          language="css"
          filename="styles.css"
          code=".container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}"
        />
      </div>
    </Variant>

    <Variant :title="withHighlightedLines">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-xl">
        <code-block
          id="code-highlight"
          language="typescript"
          filename="api.ts"
          :highlight-lines="[5, 6, 7]"
          code="async function fetchUser(id: string) {
  try {
    const response = await fetch(\`/api/users/\${id}\`);
    if (!response.ok) {
      throw new Error('User not found');
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}"
        />
      </div>
    </Variant>

    <Variant :title="withoutLineNumbers">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-xl">
        <code-block
          id="code-no-lines"
          language="json"
          line-numbers="hidden"
          code="{
  &quot;name&quot;: &quot;my-project&quot;,
  &quot;version&quot;: &quot;1.0.0&quot;,
  &quot;dependencies&quot;: {
    &quot;vue&quot;: &quot;^3.5.0&quot;
  }
}"
        />
      </div>
    </Variant>

    <Variant :title="collapsedLongCode">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-2xl">
        <code-block
          id="code-collapsed"
          language="typescript"
          filename="useCounter.ts"
          :max-collapsed-lines="10"
          :code="longCode"
        />
      </div>
    </Variant>


    <Variant :title="noFilename">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-xl">
        <code-block
          id="code-no-filename"
          language="bash"
          code="npm install vue@latest
npm run dev"
        />
      </div>
    </Variant>

    <Variant :title="darkTheme">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="dark w-full max-w-xl">
        <code-block
          id="code-dark"
          language="typescript"
          filename="dark-mode.ts"
          code="const theme = 'dark';
const colors = {
  primary: '#009fff',
  background: '#070707',
  foreground: '#fbfbfb'
};"
        />
      </div>
    </Variant>

    <Variant :title="interactive" auto-props-disabled>
      <div class="w-full max-w-2xl space-y-4">
        <div class="flex items-center gap-4 rounded-lg bg-muted p-4">
          <div class="flex items-center gap-2">
            <label class="text-sm font-medium">{{ Language }}</label>
            <select
              v-model="interactiveState.language"
              class="rounded-md border border-border bg-background px-3 py-1 text-sm"
            >
              <option v-for="lang in languages" :key="lang" :value="lang">
                {{ lang }}
              </option>
            </select>
          </div>
          <label class="flex items-center gap-2 text-sm">
            <input
              v-model="interactiveState.lineNumbers"
              type="checkbox"
              true-value="visible"
              false-value="hidden"
              class="rounded border border-border"
            />
            {{ ShowLineNumbers }}
          </label>
        </div>
        <code-block
          id="code-interactive"
          v-bind="interactiveState"
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
