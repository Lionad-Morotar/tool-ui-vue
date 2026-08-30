<script setup lang="ts">
import { CodeDiff } from '@lionad/vtu-components';
import messages from './i18n';
import { useStoryLocale } from '../_shared/use-story-locale'

const Name = useStoryLocale('content.name', messages)
const Type = useStoryLocale('content.type', messages)
const Default = useStoryLocale('content.default', messages)
const Description = useStoryLocale('content.description', messages)
const Props = useStoryLocale('content.props', messages)
const WordLevelDiff = useStoryLocale('content.wordLevelDiff', messages)
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

const wordDiffExample = {
  old: 'if (!res) throw new Error("User not found");',
  new: 'if (!res) return null;'
};

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

</script>

<template>
  <Story title="CodeDiff/All">
    <Variant :title="wordLevelDiff">
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

    <Variant :title="propsTitle">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-4xl p-6">
        <h2 class="mb-4 text-2xl font-bold">{{ CodeDiffProps }}</h2>
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
          <h3 class="mb-2 font-semibold">{{ UsageModes1 }}</h3>
          <ul class="list-inside list-disc space-y-1 text-sm">
            <li><strong>{{ FileDiffMode }}</strong> 提供 <code>oldCode</code> 和/或 <code>newCode</code> 来比较两个版本</li>
            <li><strong>{{ PatchMode1 }}</strong> 提供 <code>patch</code> 与 git diff 字符串</li>
            <li><strong>{{ Note }}</strong> 不能混用补丁模式和 oldCode/newCode — 选择一种</li>
          </ul>
        </div>
      </div>
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-4xl p-6">
        <h2 class="mb-4 text-2xl font-bold">{{ CodeDiffFeatures }}</h2>
        <div class="grid grid-cols-2 gap-4">
          <div class="rounded-lg border border-border p-4">
            <h3 class="mb-2 font-semibold">{{ UnifiedView }}</h3>
            <p class="text-sm text-muted-foreground">{{ ShowsChangesInline }}</p>
          </div>
          <div class="rounded-lg border border-border p-4">
            <h3 class="mb-2 font-semibold">{{ SplitView }}</h3>
            <p class="text-sm text-muted-foreground">{{ SideBySide }}</p>
          </div>
          <div class="rounded-lg border border-border p-4">
            <h3 class="mb-2 font-semibold">{{ WordLevelDiff1 }}</h3>
            <p class="text-sm text-muted-foreground">{{ HighlightsSpecificWords }}</p>
          </div>
          <div class="rounded-lg border border-border p-4">
            <h3 class="mb-2 font-semibold">{{ Statistics }}</h3>
            <p class="text-sm text-muted-foreground">{{ ShowsNumberOf }}</p>
          </div>
        </div>
      </div>
    </Variant>
  </Story>
</template>
