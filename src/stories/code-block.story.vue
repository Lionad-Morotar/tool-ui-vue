<script setup lang="ts">
import { reactive, ref } from "vue";
import { CodeBlock } from "../components";

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
  language: "typescript",
  filename: "interactive.ts",
  lineNumbers: "visible" as const,
  highlightLines: [2, 7] as number[] | undefined,
});

// Props documentation
const props = [
  { name: "id", type: "string", required: true, description: "Unique identifier for the code block" },
  { name: "code", type: "string", required: true, description: "The code content to display" },
  { name: "language", type: "string", default: "text", description: "Programming language for syntax highlighting" },
  { name: "filename", type: "string", description: "Optional filename to display in the header" },
  { name: "lineNumbers", type: "'visible' | 'hidden'", default: "visible", description: "Whether to show line numbers" },
  { name: "highlightLines", type: "number[]", description: "Array of line numbers to highlight" },
  { name: "maxCollapsedLines", type: "number", description: "Maximum lines to show before collapsing" },
  { name: "className", type: "string", description: "Additional CSS classes" },
];

const languages = [
  "typescript", "javascript", "python", "tsx", "jsx",
  "json", "bash", "shell", "css", "html",
  "markdown", "sql", "yaml", "go", "rust", "text"
];
</script>

<template>
  <Story title="CodeBlock/All">
    <Variant title="Props">
      <div class="w-full max-w-4xl p-6">
        <h2 class="text-2xl font-bold mb-4">CodeBlock Props</h2>
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b">
                <th class="text-left py-2 px-4 font-semibold">Name</th>
                <th class="text-left py-2 px-4 font-semibold">Type</th>
                <th class="text-left py-2 px-4 font-semibold">Default</th>
                <th class="text-left py-2 px-4 font-semibold">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="prop in props" :key="prop.name" class="border-b">
                <td class="py-2 px-4 font-mono text-emerald-600">{{ prop.name }}</td>
                <td class="py-2 px-4 font-mono text-blue-600">{{ prop.type }}</td>
                <td class="py-2 px-4 text-muted-foreground">{{ prop.default || '-' }}</td>
                <td class="py-2 px-4">{{ prop.description }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </Variant>

    <Variant title="Supported Languages">
      <div class="w-full max-w-4xl p-6">
        <h2 class="text-2xl font-bold mb-4">Supported Languages</h2>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="lang in languages"
            :key="lang"
            class="px-3 py-1 bg-muted rounded-full text-sm font-mono"
          >
            {{ lang }}
          </span>
        </div>
      </div>
    </Variant>

    <Variant title="TypeScript">
      <div class="w-full max-w-2xl">
        <CodeBlock
          id="code-typescript"
          language="typescript"
          filename="example.ts"
          :code="exampleCode"
        />
      </div>
    </Variant>

    <Variant title="JavaScript">
      <div class="w-full max-w-xl">
        <CodeBlock
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

    <Variant title="Python">
      <div class="w-full max-w-xl">
        <CodeBlock
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

    <Variant title="CSS">
      <div class="w-full max-w-xl">
        <CodeBlock
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

    <Variant title="With Highlighted Lines">
      <div class="w-full max-w-xl">
        <CodeBlock
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

    <Variant title="Without Line Numbers">
      <div class="w-full max-w-xl">
        <CodeBlock
          id="code-no-lines"
          language="json"
          line-numbers="hidden"
          code='{
  "name": "my-project",
  "version": "1.0.0",
  "dependencies": {
    "vue": "^3.5.0"
  }
}'
        />
      </div>
    </Variant>

    <Variant title="Collapsed (Long Code)">
      <div class="w-full max-w-2xl">
        <CodeBlock
          id="code-collapsed"
          language="typescript"
          filename="useCounter.ts"
          :max-collapsed-lines="10"
          :code="longCode"
        />
      </div>
    </Variant>

    <Variant title="No Filename">
      <div class="w-full max-w-xl">
        <CodeBlock
          id="code-no-filename"
          language="bash"
          code="npm install vue@latest
npm run dev"
        />
      </div>
    </Variant>

    <Variant title="Dark Theme">
      <div class="w-full max-w-xl dark">
        <CodeBlock
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

    <Variant title="Interactive" auto-props-disabled>
      <div class="w-full max-w-2xl space-y-4">
        <div class="flex items-center gap-4 p-4 bg-muted rounded-lg">
          <div class="flex items-center gap-2">
            <label class="text-sm font-medium">Language:</label>
            <select
              v-model="interactiveState.language"
              class="rounded-md border bg-background px-3 py-1 text-sm"
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
              class="rounded border"
            />
            Show Line Numbers
          </label>
        </div>
        <CodeBlock
          id="code-interactive"
          v-bind="interactiveState"
        />
      </div>
    </Variant>
  </Story>
</template>
