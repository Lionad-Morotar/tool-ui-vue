<script setup lang="ts">
import { reactive } from 'vue';
import { CodeBlock } from '@lionad/vtu-components';
import messages from './i18n';
import { useStoryLocale } from '../_shared/use-story-locale'

const WithHighlightedLines = useStoryLocale('content.withHighlightedLines', messages)
const WithoutLineNumbers = useStoryLocale('content.withoutLineNumbers', messages)
const CollapsedLongCode = useStoryLocale('content.collapsedLongCode', messages)
const NoFilename = useStoryLocale('content.noFilename', messages)
const DarkTheme = useStoryLocale('content.darkTheme', messages)
const Interactive = useStoryLocale('content.interactive', messages)
const Language = useStoryLocale('content.language', messages)
const ShowLineNumbers = useStoryLocale('content.showLineNumbers', messages)

const longCode = `// This is a longer code example to demonstrate
// the maxCollapsedLines feature
import { ref, computed, watch, onMounted } from "vue";

export function useCounter(initial = 0) {
  const count = ref(initial);
  const history = ref<number[]>([]);

  const doubled = computed(() => count.value * 2);
  const tripled = computed(() => count.value * 3);

  watch(count, (newVal, oldVal) => {
    history.value.push(newVal);
    console.log(\`Count changed from \${oldVal} to \${newVal}\`);
  });

  function increment() {
    count.value++;
  }

  function decrement() {
    count.value--;
  }

  function reset() {
    count.value = initial;
    history.value = [];
  }

  function incrementBy(n: number) {
    count.value += n;
  }

  function decrementBy(n: number) {
    count.value -= n;
  }

  onMounted(() => {
    console.log("Counter initialized with value:", initial);
  });

  return {
    count,
    doubled,
    tripled,
    history,
    increment,
    decrement,
    reset,
    incrementBy,
    decrementBy,
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

const languages = [
  'typescript', 'javascript', 'python', 'tsx', 'jsx',
  'json', 'bash', 'shell', 'css', 'html',
  'markdown', 'sql', 'yaml', 'go', 'rust', 'text'
];

const withHighlightedLines = WithHighlightedLines
const withoutLineNumbers = WithoutLineNumbers
const collapsedLongCode = CollapsedLongCode
const noFilename = NoFilename
const darkTheme = DarkTheme
const interactive = Interactive
</script>

<template>
  <Story title="CodeBlock/Options">
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
    const response = await fetch(`/api/users/${id}`);
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
  </Story>
</template>
