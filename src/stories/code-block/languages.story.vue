<script setup lang="ts">
import { CodeBlock } from '@lionad/vtu-components';
import messages from './i18n';
import { useStoryLocale } from '../_shared/use-story-locale'

const JavaScript = useStoryLocale('content.javaScript', messages)
const Python = useStoryLocale('content.python', messages)
const CSS = useStoryLocale('content.cSS', messages)

const javaScript = JavaScript
const python = Python
const cSS = CSS
</script>

<template>
  <Story title="CodeBlock/Languages">
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
  </Story>
</template>
