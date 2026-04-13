<script setup lang="ts">
import { reactive } from 'vue';
import { CodeDiff } from '@lionad/vtu-components';
import { useStoryLocale } from '../_shared/use-story-locale'
import messages from './i18n';

const Name = useStoryLocale('content.name', messages)
const Type = useStoryLocale('content.type', messages)
const Default = useStoryLocale('content.default', messages)
const Description = useStoryLocale('content.description', messages)
const Props = useStoryLocale('content.props', messages)
const WordLevelDiff = useStoryLocale('content.wordLevelDiff', messages)
const SplitDiff = useStoryLocale('content.splitDiff', messages)
const InteractiveToggleDiff = useStoryLocale('content.interactiveToggleDiff', messages)
const UnifiedDiff = useStoryLocale('content.unifiedDiff', messages)
const PatchMode = useStoryLocale('content.patchMode', messages)
const Modifications = useStoryLocale('content.modifications', messages)
const DarkThemeUnified = useStoryLocale('content.darkThemeUnified', messages)
const DarkThemeSplit = useStoryLocale('content.darkThemeSplit', messages)
const CodeDiffProps = useStoryLocale('content.codeDiffProps', messages)
const UsageModes1 = useStoryLocale('content.usageModes1', messages)
const FileDiffMode = useStoryLocale('content.fileDiffMode', messages)
const PatchMode1 = useStoryLocale('content.patchMode1', messages)
const Note = useStoryLocale('content.note', messages)
const CodeDiffFeatures = useStoryLocale('content.codeDiffFeatures', messages)
const UnifiedView = useStoryLocale('content.unifiedView', messages)
const ShowsChangesInline = useStoryLocale('content.showsChangesInline', messages)
const SplitView = useStoryLocale('content.splitView', messages)
const SideBySide = useStoryLocale('content.sideBySide', messages)
const WordLevelDiff1 = useStoryLocale('content.wordLevelDiff1', messages)
const HighlightsSpecificWords = useStoryLocale('content.highlightsSpecificWords', messages)
const Statistics = useStoryLocale('content.statistics', messages)
const ShowsNumberOf = useStoryLocale('content.showsNumberOf', messages)
const DiffStyle = useStoryLocale('content.diffStyle', messages)
const ShowLineNumbers = useStoryLocale('content.showLineNumbers', messages)

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

const headerName = Name
const headerType = Type
const headerDefault = Default
const headerDesc = Description
const propsTitle = Props
const wordLevelDiff = WordLevelDiff
const splitDiff = SplitDiff
const interactiveToggleDiffStyle = InteractiveToggleDiff
const unifiedDiff = UnifiedDiff
const patchMode = PatchMode
const modifications = Modifications
const darkThemeUnified = DarkThemeUnified
const darkThemeSplit = DarkThemeSplit

</script>

<template>
  <Story title="CodeDiff/All">
    <Variant :title="wordLevelDiff">
      <p class="mb-3 text-muted-foreground text-xs">组件说明 / Component description</p>
      <div class="w-full max-w-3xl">
        <p class="mb-4 text-muted-foreground text-sm">
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

    <Variant :title="splitDiff">
      <p class="mb-3 text-muted-foreground text-xs">组件说明 / Component description</p>
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

    <Variant :title="interactiveToggleDiffStyle">
      <div class="w-full max-w-4xl">
        <div class="flex items-center gap-4 bg-muted mb-4 p-4 rounded-lg">
          <label class="flex items-center gap-2 text-sm">
            <select
              v-model="diffState.style"
              class="px-2 py-1 border border-border rounded"
            >
              <option value="unified">Unified</option>
              <option value="split">Split</option>
            </select>
            {{ DiffStyle }}
          </label>
          <label class="flex items-center gap-2 text-sm">
            <input
              v-model="diffState.showLines"
              type="checkbox"
              class="border border-border rounded"
            />
            {{ ShowLineNumbers }}
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

    <Variant :title="unifiedDiff">
      <p class="mb-3 text-muted-foreground text-xs">组件说明 / Component description</p>
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

    <Variant :title="patchMode">
      <p class="mb-3 text-muted-foreground text-xs">组件说明 / Component description</p>
      <div class="w-full max-w-3xl">
        <code-diff
          id="diff-patch"
          language="typescript"
          filename="src/utils.ts"
          :patch="patchExample"
        />
      </div>
    </Variant>

    <Variant :title="modifications">
      <p class="mb-3 text-muted-foreground text-xs">组件说明 / Component description</p>
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

    <Variant :title="darkThemeUnified">
      <p class="mb-3 text-muted-foreground text-xs">组件说明 / Component description</p>
      <div class="w-full max-w-3xl dark">
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

    <Variant :title="darkThemeSplit">
      <p class="mb-3 text-muted-foreground text-xs">组件说明 / Component description</p>
      <div class="w-full max-w-4xl dark">
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

    <Variant :title="propsTitle">
      <p class="mb-3 text-muted-foreground text-xs">组件说明 / Component description</p>
      <div class="p-6 w-full max-w-4xl">
        <h2 class="mb-4 font-bold text-2xl">{{ CodeDiffProps }}</h2>
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
        <div class="bg-muted mt-6 p-4 rounded-lg">
          <h3 class="mb-2 font-semibold">{{ UsageModes1 }}</h3>
          <ul class="space-y-1 text-sm list-disc list-inside">
            <li><strong>{{ FileDiffMode }}</strong> 提供 <code>oldCode</code> 和/或 <code>newCode</code> 来比较两个版本</li>
            <li><strong>{{ PatchMode1 }}</strong> 提供 <code>patch</code> 与 git diff 字符串</li>
            <li><strong>{{ Note }}</strong> 不能混用补丁模式和 oldCode/newCode — 选择一种</li>
          </ul>
        </div>
      </div>
      <p class="mb-3 text-muted-foreground text-xs">组件说明 / Component description</p>
      <div class="p-6 w-full max-w-4xl">
        <h2 class="mb-4 font-bold text-2xl">{{ CodeDiffFeatures }}</h2>
        <div class="gap-4 grid grid-cols-2">
          <div class="p-4 border border-border rounded-lg">
            <h3 class="mb-2 font-semibold">{{ UnifiedView }}</h3>
            <p class="text-muted-foreground text-sm">{{ ShowsChangesInline }}</p>
          </div>
          <div class="p-4 border border-border rounded-lg">
            <h3 class="mb-2 font-semibold">{{ SplitView }}</h3>
            <p class="text-muted-foreground text-sm">{{ SideBySide }}</p>
          </div>
          <div class="p-4 border border-border rounded-lg">
            <h3 class="mb-2 font-semibold">{{ WordLevelDiff1 }}</h3>
            <p class="text-muted-foreground text-sm">{{ HighlightsSpecificWords }}</p>
          </div>
          <div class="p-4 border border-border rounded-lg">
            <h3 class="mb-2 font-semibold">{{ Statistics }}</h3>
            <p class="text-muted-foreground text-sm">{{ ShowsNumberOf }}</p>
          </div>
        </div>
      </div>
    </Variant>
  </Story>
</template>
