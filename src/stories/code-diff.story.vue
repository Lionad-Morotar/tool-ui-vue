<script setup lang="ts">
import { reactive } from 'vue';
import { CodeDiff } from '@lionad/vtu-components';
import { useStoryLocale, type StoryLocaleLabels } from './_shared/use-story-locale';

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
  { name: 'id', type: 'string', required: true, description: { zh: '差异的唯一标识符', en: 'Unique identifier for the diff' } },
  { name: 'oldCode', type: 'string', description: { zh: '原始代码（文件差异模式）', en: 'Original code (for file diff mode)' } },
  { name: 'newCode', type: 'string', description: { zh: '修改后的代码（文件差异模式）', en: 'Modified code (for file diff mode)' } },
  { name: 'patch', type: 'string', description: { zh: 'Git 补丁字符串（补丁模式）', en: 'Git patch string (for patch mode)' } },
  { name: 'language', type: 'string', default: 'text', description: { zh: '显示语言', en: 'Language for display' } },
  { name: 'filename', type: 'string', description: { zh: '可选的显示文件名', en: 'Optional filename to display' } },
  { name: 'lineNumbers', type: "'visible' | 'hidden'", default: 'visible', description: { zh: '是否显示行号', en: 'Whether to show line numbers' } },
  { name: 'diffStyle', type: "'unified' | 'split'", default: 'unified', description: { zh: '差异显示样式', en: 'Diff display style' } },
  { name: 'maxCollapsedLines', type: 'number', description: { zh: '折叠前的最大行数', en: 'Maximum lines before collapsing' } },
  { name: 'css', type: '{ root?: string }', description: { zh: '组件元素的 CSS 类', en: 'CSS classes for component elements' } },
];
const headerName = useStoryLocale({ zh: '属性名', en: 'Name' })
const headerType = useStoryLocale({ zh: '类型', en: 'Type' })
const headerDefault = useStoryLocale({ zh: '默认值', en: 'Default' })
const headerDesc = useStoryLocale({ zh: '描述', en: 'Description' })
</script>

<template>
  <Story title="CodeDiff/All">
    <Variant :title="useStoryLocale({ zh: '属性', en: 'Props' })">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-4xl p-6">
        <h2 class="mb-4 text-2xl font-bold">{{ useStoryLocale({ zh: 'CodeDiff 属性', en: 'CodeDiff Props' }) }}</h2>
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
        <div class="mt-6 rounded-lg bg-muted p-4">
          <h3 class="mb-2 font-semibold">{{ useStoryLocale({ zh: '使用模式', en: 'Usage Modes' }) }}</h3>
          <ul class="list-inside list-disc space-y-1 text-sm">
            <li><strong>{{ useStoryLocale({ zh: '文件差异模式:', en: 'File Diff Mode:' }) }}</strong> 提供 <code>oldCode</code> 和/或 <code>newCode</code> 来比较两个版本</li>
            <li><strong>{{ useStoryLocale({ zh: '补丁模式:', en: 'Patch Mode:' }) }}</strong> 提供 <code>patch</code> 与 git diff 字符串</li>
            <li><strong>{{ useStoryLocale({ zh: '注意:', en: 'Note:' }) }}</strong> 不能混用补丁模式和 oldCode/newCode — 选择一种</li>
          </ul>
        </div>
      </div>
    </Variant>

    <Variant :title="useStoryLocale({ zh: '使用模式', en: 'Usage Modes' })">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-4xl p-6">
        <h2 class="mb-4 text-2xl font-bold">{{ useStoryLocale({ zh: 'CodeDiff 功能', en: 'CodeDiff Features' }) }}</h2>
        <div class="grid grid-cols-2 gap-4">
          <div class="rounded-lg border-border border p-4">
            <h3 class="mb-2 font-semibold">{{ useStoryLocale({ zh: '统一视图', en: 'Unified View' }) }}</h3>
            <p class="text-sm text-muted-foreground">{{ useStoryLocale({ zh: '在单行内使用 +/- 标记显示变更', en: 'Shows changes inline with +/- indicators' }) }}</p>
          </div>
          <div class="rounded-lg border-border border p-4">
            <h3 class="mb-2 font-semibold">{{ useStoryLocale({ zh: '分栏视图', en: 'Split View' }) }}</h3>
            <p class="text-sm text-muted-foreground">{{ useStoryLocale({ zh: '新旧代码并排比较', en: 'Side-by-side comparison of old and new' }) }}</p>
          </div>
          <div class="rounded-lg border-border border p-4">
            <h3 class="mb-2 font-semibold">{{ useStoryLocale({ zh: '单词级差异', en: 'Word-Level Diff' }) }}</h3>
            <p class="text-sm text-muted-foreground">{{ useStoryLocale({ zh: '高亮行内已更改的特定单词', en: 'Highlights specific words that changed within lines' }) }}</p>
          </div>
          <div class="rounded-lg border-border border p-4">
            <h3 class="mb-2 font-semibold">{{ useStoryLocale({ zh: '统计信息', en: 'Statistics' }) }}</h3>
            <p class="text-sm text-muted-foreground">{{ useStoryLocale({ zh: '显示新增和删除的行数', en: 'Shows number of additions and deletions' }) }}</p>
          </div>
        </div>
      </div>
    </Variant>

    <Variant :title="useStoryLocale({ zh: '单词级差异', en: 'Word-Level Diff' })">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
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

    <Variant :title="useStoryLocale({ zh: '分栏视图', en: 'Split Diff' })">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
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

    <Variant :title="useStoryLocale({ zh: '分栏视图（无行号）', en: 'Split Diff (No Line Numbers)' })">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
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

    <Variant :title="useStoryLocale({ zh: '交互 - 切换分栏样式', en: 'Interactive - Toggle Diff Style' })">
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
            {{ useStoryLocale({ zh: '差异样式', en: 'Diff Style' }) }}
          </label>
          <label class="flex items-center gap-2 text-sm">
            <input
              v-model="diffState.showLines"
              type="checkbox"
              class="rounded border-border border"
            />
            {{ useStoryLocale({ zh: '显示行号', en: 'Show Line Numbers' }) }}
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

    <Variant :title="useStoryLocale({ zh: '统一视图', en: 'Unified Diff' })">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
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

    <Variant :title="useStoryLocale({ zh: '补丁模式', en: 'Patch Mode' })">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-3xl">
        <code-diff
          id="diff-patch"
          language="typescript"
          filename="src/utils.ts"
          :patch="patchExample"
        />
      </div>
    </Variant>

    <Variant :title="useStoryLocale({ zh: '无行号', en: 'Without Line Numbers' })">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
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

    <Variant :title="useStoryLocale({ zh: '无文件名', en: 'No Filename' })">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-2xl">
        <code-diff
          id="diff-no-filename"
          language="javascript"
          :old-code="'const x = 1;'"
          :new-code="'const x = 2;'"
        />
      </div>
    </Variant>

    <Variant :title="useStoryLocale({ zh: '仅新增', en: 'Additions Only' })">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
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

    <Variant :title="useStoryLocale({ zh: '仅删除', en: 'Deletions Only' })">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
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

    <Variant :title="useStoryLocale({ zh: '修改', en: 'Modifications' })">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
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

    <Variant :title="useStoryLocale({ zh: '暗色主题 - 统一', en: 'Dark Theme - Unified' })">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
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

    <Variant :title="useStoryLocale({ zh: '暗色主题 - 分栏', en: 'Dark Theme - Split' })">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
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
