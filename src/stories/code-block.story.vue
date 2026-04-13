<script setup lang="ts">
import { reactive } from 'vue';
import { CodeBlock } from '@lionad/vtu-components';
import { useStoryLocale } from './_shared/use-story-locale';

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

const headerName = useStoryLocale({ zh: '属性名', en: 'Name' })
const headerType = useStoryLocale({ zh: '类型', en: 'Type' })
const headerDefault = useStoryLocale({ zh: '默认值', en: 'Default' })
const headerDesc = useStoryLocale({ zh: '描述', en: 'Description' })

const languages = [
  'typescript', 'javascript', 'python', 'tsx', 'jsx',
  'json', 'bash', 'shell', 'css', 'html',
  'markdown', 'sql', 'yaml', 'go', 'rust', 'text'
];
const propsTitle = useStoryLocale({ zh: '属性', en: 'Props' })
const supportedLanguages = useStoryLocale({ zh: '支持的语言', en: 'Supported Languages' })
const typeScript = useStoryLocale({ zh: 'TypeScript', en: 'TypeScript' })
const javaScript = useStoryLocale({ zh: 'JavaScript', en: 'JavaScript' })
const python = useStoryLocale({ zh: 'Python', en: 'Python' })
const cSS = useStoryLocale({ zh: 'CSS', en: 'CSS' })
const withHighlightedLines = useStoryLocale({ zh: '高亮行', en: 'With Highlighted Lines' })
const withoutLineNumbers = useStoryLocale({ zh: '无行号', en: 'Without Line Numbers' })
const collapsedLongCode = useStoryLocale({ zh: '折叠（长代码）', en: 'Collapsed (Long Code)' })
const noFilename = useStoryLocale({ zh: '无文件名', en: 'No Filename' })
const darkTheme = useStoryLocale({ zh: '暗色主题', en: 'Dark Theme' })
const interactive = useStoryLocale({ zh: '交互模式', en: 'Interactive' })
</script>

<template>
  <Story title="CodeBlock/All">
    <Variant :title="propsTitle">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-4xl p-6">
        <h2 class="mb-4 text-2xl font-bold">{{ useStoryLocale({ zh: 'CodeBlock 属性', en: 'CodeBlock Props' }) }}</h2>
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
    </Variant>

    <Variant :title="supportedLanguages">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-4xl p-6">
        <h2 class="mb-4 text-2xl font-bold">{{ useStoryLocale({ zh: '支持的语言', en: 'Supported Languages' }) }}</h2>
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
            <label class="text-sm font-medium">{{ useStoryLocale({ zh: '语言:', en: 'Language:' }) }}</label>
            <select
              v-model="interactiveState.language"
              class="rounded-md border-border border bg-background px-3 py-1 text-sm"
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
              class="rounded border-border border"
            />
            {{ useStoryLocale({ zh: '显示行号', en: 'Show Line Numbers' }) }}
          </label>
        </div>
        <code-block
          id="code-interactive"
          v-bind="interactiveState"
        />
      </div>
    </Variant>
  </Story>
</template>
