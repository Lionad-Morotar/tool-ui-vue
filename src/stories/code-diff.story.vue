<script setup lang="ts">
import { reactive } from 'vue';
import { CodeDiff } from '@lionad/vtu-components';

const oldFunction = `export async function fetchUser(id: string) {
  const res = await db.users.findUnique({ where: { id } });
  if (!res) throw new Error("User not found");
  return res;
}`;

const newFunction = `export async function fetchUser(id: string) {
  const res = await db.users.findUnique({ where: { id } });
  if (!res) return null;
  return res;
}`;

const addExample = {
  old: `// Initial setup
const config = {
  port: 3000,
};`,
  new: `// Initial setup
const config = {
  port: 3000,
  host: 'localhost',
  timeout: 5000,
}`
};

const removeExample = {
  old: `function processData(data: any, options: any, callback: any) {
  // Complex processing
  const result = transform(data, options);
  callback(result);
  return result;
}`,
  new: `function processData(data: any) {
  // Simplified processing
  return transform(data);
}`
};

const modifyExample = {
  old: `const API_URL = 'http://api.example.com/v1';
const TIMEOUT = 3000;`,
  new: `const API_URL = 'https://api.example.com/v2';
const TIMEOUT = 5000;`
};

const patchExample = `--- a/src/utils.ts
+++ b/src/utils.ts
@@ -1,7 +1,7 @@
 export function greet(name: string): string {
-  return "Hello, " + name;
+  return \`Hello, \${name}!\`;
 }

 export function farewell(name: string): string {
-  return "Goodbye, " + name;
+  return \`Goodbye, \${name}!\`;
 }`;

const wordDiffExample = {
  old: 'if (!res) throw new Error("User not found");',
  new: 'if (!res) return null;'
};

const diffState = reactive({
  style: 'unified' as 'unified' | 'split',
  showLines: true
});

// Props documentation
const props = [
  { name: 'id', type: 'string', required: true, description: 'Unique identifier for the diff' },
  { name: 'oldCode', type: 'string', description: 'Original code (for file diff mode)' },
  { name: 'newCode', type: 'string', description: 'Modified code (for file diff mode)' },
  { name: 'patch', type: 'string', description: 'Git patch string (for patch mode)' },
  { name: 'language', type: 'string', default: 'text', description: 'Language for display' },
  { name: 'filename', type: 'string', description: 'Optional filename to display' },
  { name: 'lineNumbers', type: "'visible' | 'hidden'", default: 'visible', description: 'Whether to show line numbers' },
  { name: 'diffStyle', type: "'unified' | 'split'", default: 'unified', description: 'Diff display style' },
  { name: 'maxCollapsedLines', type: 'number', description: 'Maximum lines before collapsing' },
  { name: 'css', type: '{ root?: string }', description: 'CSS classes for component elements' },
];
</script>

<template>
  <Story title="CodeDiff/All">
    <Variant title="Props">
      <div class="w-full max-w-4xl p-6">
        <h2 class="mb-4 text-2xl font-bold">CodeDiff Props</h2>
        <div class="overflow-x-auto">
          <table class="story-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Default</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="prop in props" :key="prop.name">
                <td class="font-mono text-emerald-600">{{ prop.name }}</td>
                <td class="font-mono text-blue-600">{{ prop.type }}</td>
                <td class="text-muted-foreground">{{ prop.default || '-' }}</td>
                <td>{{ prop.description }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="mt-6 rounded-lg bg-muted p-4">
          <h3 class="mb-2 font-semibold">Usage Modes</h3>
          <ul class="list-inside list-disc space-y-1 text-sm">
            <li><strong>File Diff Mode:</strong> Provide <code>oldCode</code> and/or <code>newCode</code> to compare two versions</li>
            <li><strong>Patch Mode:</strong> Provide <code>patch</code> with a git diff string</li>
            <li><strong>Note:</strong> Cannot mix patch mode with oldCode/newCode - use one or the other</li>
          </ul>
        </div>
      </div>
    </Variant>

    <Variant title="Features">
      <div class="w-full max-w-4xl p-6">
        <h2 class="mb-4 text-2xl font-bold">CodeDiff Features</h2>
        <div class="grid grid-cols-2 gap-4">
          <div class="rounded-lg border-border border p-4">
            <h3 class="mb-2 font-semibold">Unified View</h3>
            <p class="text-sm text-muted-foreground">Shows changes inline with +/- indicators</p>
          </div>
          <div class="rounded-lg border-border border p-4">
            <h3 class="mb-2 font-semibold">Split View</h3>
            <p class="text-sm text-muted-foreground">Side-by-side comparison of old and new</p>
          </div>
          <div class="rounded-lg border-border border p-4">
            <h3 class="mb-2 font-semibold">Word-Level Diff</h3>
            <p class="text-sm text-muted-foreground">Highlights specific words that changed within lines</p>
          </div>
          <div class="rounded-lg border-border border p-4">
            <h3 class="mb-2 font-semibold">Statistics</h3>
            <p class="text-sm text-muted-foreground">Shows number of additions and deletions</p>
          </div>
        </div>
      </div>
    </Variant>

    <Variant title="Word-Level Diff">
      <div class="w-full max-w-3xl">
        <p class="mb-4 text-sm text-muted-foreground">
          Word-level diff highlights specific changes within modified lines:
        </p>
        <code-diff
          id="diff-word-level"
          language="typescript"
          filename="api.ts"
          :old-code="wordDiffExample.old"
          :new-code="wordDiffExample.new"
          diff-style="unified"
        />
      </div>
    </Variant>

    <Variant title="Split Diff">
      <div class="w-full max-w-4xl">
        <code-diff
          id="diff-split"
          language="typescript"
          filename="lib/auth.ts"
          :old-code="oldFunction"
          :new-code="newFunction"
          diff-style="split"
        />
      </div>
    </Variant>

    <Variant title="Split Diff (No Line Numbers)">
      <div class="w-full max-w-4xl">
        <code-diff
          id="diff-split-no-lines"
          language="typescript"
          filename="lib/auth.ts"
          :old-code="oldFunction"
          :new-code="newFunction"
          diff-style="split"
          line-numbers="hidden"
        />
      </div>
    </Variant>

    <Variant title="Interactive - Toggle Diff Style">
      <div class="w-full max-w-4xl">
        <div class="mb-4 flex items-center gap-4 rounded-lg bg-muted p-4">
          <label class="flex items-center gap-2 text-sm">
            <select
              v-model="diffState.style"
              class="rounded border-border border px-2 py-1"
            >
              <option value="unified">Unified</option>
              <option value="split">Split</option>
            </select>
            Diff Style
          </label>
          <label class="flex items-center gap-2 text-sm">
            <input
              v-model="diffState.showLines"
              type="checkbox"
              class="rounded border-border border"
            />
            Show Line Numbers
          </label>
        </div>
        <code-diff
          id="diff-interactive-style"
          language="typescript"
          filename="api.ts"
          :old-code="oldFunction"
          :new-code="newFunction"
          :diff-style="diffState.style"
          :line-numbers="diffState.showLines ? 'visible' : 'hidden'"
        />
      </div>
    </Variant>

    <Variant title="Unified Diff">
      <div class="w-full max-w-3xl">
        <code-diff
          id="diff-unified"
          language="typescript"
          filename="lib/auth.ts"
          :old-code="oldFunction"
          :new-code="newFunction"
          diff-style="unified"
        />
      </div>
    </Variant>

    <Variant title="Patch Mode">
      <div class="w-full max-w-3xl">
        <code-diff
          id="diff-patch"
          language="typescript"
          filename="src/utils.ts"
          :patch="patchExample"
        />
      </div>
    </Variant>

    <Variant title="Without Line Numbers">
      <div class="w-full max-w-3xl">
        <code-diff
          id="diff-no-lines"
          language="typescript"
          filename="utils.ts"
          :old-code="oldFunction"
          :new-code="newFunction"
          line-numbers="hidden"
        />
      </div>
    </Variant>

    <Variant title="No Filename">
      <div class="w-full max-w-2xl">
        <code-diff
          id="diff-no-filename"
          language="javascript"
          :old-code="'const x = 1;'"
          :new-code="'const x = 2;'"
        />
      </div>
    </Variant>

    <Variant title="Additions Only">
      <div class="w-full max-w-3xl">
        <code-diff
          id="diff-add"
          language="typescript"
          filename="config.ts"
          :old-code="addExample.old"
          :new-code="addExample.new"
          diff-style="unified"
        />
      </div>
    </Variant>

    <Variant title="Deletions Only">
      <div class="w-full max-w-3xl">
        <code-diff
          id="diff-remove"
          language="typescript"
          filename="utils.ts"
          :old-code="removeExample.old"
          :new-code="removeExample.new"
          diff-style="unified"
        />
      </div>
    </Variant>

    <Variant title="Modifications">
      <div class="w-full max-w-3xl">
        <code-diff
          id="diff-modify"
          language="typescript"
          filename="constants.ts"
          :old-code="modifyExample.old"
          :new-code="modifyExample.new"
          diff-style="unified"
        />
      </div>
    </Variant>

    <Variant title="Dark Theme - Unified">
      <div class="dark w-full max-w-3xl">
        <code-diff
          id="diff-dark-unified"
          language="typescript"
          filename="api.ts"
          :old-code="oldFunction"
          :new-code="newFunction"
          diff-style="unified"
        />
      </div>
    </Variant>

    <Variant title="Dark Theme - Split">
      <div class="dark w-full max-w-4xl">
        <code-diff
          id="diff-dark-split"
          language="typescript"
          filename="api.ts"
          :old-code="oldFunction"
          :new-code="newFunction"
          diff-style="split"
        />
      </div>
    </Variant>
  </Story>
</template>
