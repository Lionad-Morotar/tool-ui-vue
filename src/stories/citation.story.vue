<script setup lang="ts">
import { reactive, computed, watch } from 'vue';
import { Citation, CitationList } from '@lionad/vtu-components';
import type { SerializableCitation } from '@lionad/vtu-components/citation/schema';
import { useStoryLocale, currentLocale } from './_shared/use-story-locale'

const interactiveStateZh = {
  href: 'https://example.com/article',
  title: '交互式引用示例',
  snippet: '这是一个可自定义的多引用组件，支持多种变体和类型。',
  domain: 'example.com',
  author: '张三',
  publishedAt: '2024-03-15T00:00:00Z',
  type: 'article' as const,
  variant: 'default' as const,
};

const interactiveStateEn = {
  href: 'https://example.com/article',
  title: 'Interactive Citation Example',
  snippet: 'This is a customizable citation component that supports multiple variants and types.',
  domain: 'example.com',
  author: 'John Doe',
  publishedAt: '2024-03-15T00:00:00Z',
  type: 'article' as const,
  variant: 'default' as const,
};

const interactiveState = reactive({ ...interactiveStateZh });

watch(currentLocale, () => { Object.assign(interactiveState, currentLocale.value === 'zh-CN' ? interactiveStateZh : interactiveStateEn); });
// Sample citations - zh/en pairs
const sampleCitationsZh: SerializableCitation[] = [
  {
    id: 'citation-1',
    href: 'https://example.com/article-1',
    title: '研究论文：高级 UI 模式',
    snippet: '本研究探讨了各种 UI 模式在提升用户参与度方面的有效性……',
    domain: 'example.com',
    author: 'Smith 博士',
    publishedAt: '2024-01-10T00:00:00Z',
    type: 'article',
  },
  {
    id: 'citation-2',
    href: 'https://developer.mozilla.org',
    title: 'MDN Web 文档',
    snippet: '开发者资源，由开发者创建。',
    domain: 'developer.mozilla.org',
    type: 'webpage',
  },
  {
    id: 'citation-3',
    href: 'https://github.com/example/lib',
    title: 'tool-ui 组件库',
    snippet: '一个用于构建 AI 助手界面的综合 Vue 组件库。',
    domain: 'github.com',
    type: 'code',
  },
  {
    id: 'citation-4',
    href: 'https://example.com/whitepaper.pdf',
    title: '技术白皮书',
    snippet: '对架构和设计决策的深入技术分析。',
    domain: 'example.com',
    author: '工程团队',
    publishedAt: '2024-01-01T00:00:00Z',
    type: 'document',
  },
  {
    id: 'citation-5',
    href: 'https://api.example.com/docs',
    title: 'API 文档',
    snippet: '开发者的完整 API 参考。',
    domain: 'api.example.com',
    type: 'api',
  },
];

const sampleCitationsEn: SerializableCitation[] = [
  {
    id: 'citation-1',
    href: 'https://example.com/article-1',
    title: 'Research Paper: Advanced UI Patterns',
    snippet: 'This study explores the effectiveness of various UI patterns in improving user engagement...',
    domain: 'example.com',
    author: 'Dr. Jane Smith',
    publishedAt: '2024-01-10T00:00:00Z',
    type: 'article',
  },
  {
    id: 'citation-2',
    href: 'https://developer.mozilla.org',
    title: 'MDN Web Docs',
    snippet: 'Resources for developers, by developers.',
    domain: 'developer.mozilla.org',
    type: 'webpage',
  },
  {
    id: 'citation-3',
    href: 'https://github.com/example/lib',
    title: 'tool-ui Library',
    snippet: 'A comprehensive Vue component library for building AI assistant interfaces.',
    domain: 'github.com',
    type: 'code',
  },
  {
    id: 'citation-4',
    href: 'https://example.com/whitepaper.pdf',
    title: 'Technical Whitepaper',
    snippet: 'An in-depth technical analysis of the architecture and design decisions.',
    domain: 'example.com',
    author: 'Engineering Team',
    publishedAt: '2024-01-01T00:00:00Z',
    type: 'document',
  },
  {
    id: 'citation-5',
    href: 'https://api.example.com/docs',
    title: 'API Documentation',
    snippet: 'Complete API reference for developers.',
    domain: 'api.example.com',
    type: 'api',
  },
];

const sampleCitations = computed(() => currentLocale.value === 'zh-CN' ? sampleCitationsZh : sampleCitationsEn);

const defaultVariant = useStoryLocale({ zh: '默认', en: 'Default' })
const inline = useStoryLocale({ zh: '行内', en: 'Inline' })
const stacked = useStoryLocale({ zh: '堆叠', en: 'Stacked' })
const webpage = useStoryLocale({ zh: '网页', en: 'Webpage' })
const codeRepository = useStoryLocale({ zh: '代码仓库', en: 'Code Repository' })
const document = useStoryLocale({ zh: '文档', en: 'Document' })
const interactive = useStoryLocale({ zh: '交互模式', en: 'Interactive' })
const citationListDefault = useStoryLocale({ zh: '引用列表 - 默认', en: 'CitationList - Default' })
const citationListInline = useStoryLocale({ zh: '引用列表 - 行内', en: 'CitationList - Inline' })
const citationListStacked = useStoryLocale({ zh: '引用列表 - 堆叠', en: 'CitationList - Stacked' })
const citationListWithOverflow = useStoryLocale({ zh: '引用列表 - 溢出', en: 'CitationList - With Overflow' })
const citationListInlineWithOverflow = useStoryLocale({ zh: '引用列表 - 行内溢出', en: 'CitationList - Inline with Overflow' })

// Individual citation texts for single variants
const researchPaperTitle = useStoryLocale({ zh: '研究论文：高级 UI 模式', en: 'Research Paper: Advanced UI Patterns' })
const researchPaperSnippet = useStoryLocale({ zh: '本研究探讨了各种 UI 模式在提升用户参与度和任务完成率方面的有效性……', en: 'This study explores the effectiveness of various UI patterns in improving user engagement and task completion rates...' })
const sourceDocTitle = useStoryLocale({ zh: '来源文档', en: 'Source Document' })
const docRefTitle = useStoryLocale({ zh: '文档参考', en: 'Documentation Reference' })
const docRefSnippet = useStoryLocale({ zh: '该 API 支持批量操作以提升处理多项数据时的性能。', en: 'The API supports batch operations for improved performance when processing multiple items.' })
</script>

<template>
  <Story title="Citation/All Variants">
    <Variant :title="defaultVariant">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-2xl">
        <citation
          id="citation-default"
          href="https://example.com/research"
          :title="researchPaperTitle"
          :snippet="researchPaperSnippet"
          domain="example.com"
          author="Dr. Jane Smith"
          published-at="2024-01-10T00:00:00Z"
          type="article"
        />
      </div>
    </Variant>

    <Variant :title="inline">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-2xl">
        <citation
          id="citation-inline"
          variant="inline"
          href="https://example.com/source"
          :title="sourceDocTitle"
          domain="example.com"
        />
      </div>
    </Variant>

    <Variant :title="stacked">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-2xl">
        <citation
          id="citation-stacked"
          variant="stacked"
          href="https://example.com/doc"
          :title="docRefTitle"
          :snippet="docRefSnippet"
          domain="docs.example.com"
          type="api"
        />
      </div>
    </Variant>

    <Variant :title="webpage">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-2xl">
        <citation
          id="citation-webpage"
          href="https://developer.mozilla.org"
          title="MDN Web Docs"
          snippet="Resources for developers, by developers."
          domain="developer.mozilla.org"
          type="webpage"
        />
      </div>
    </Variant>

    <Variant :title="codeRepository">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-2xl">
        <citation
          id="citation-code"
          href="https://github.com/example/lib"
          title="tool-ui Library"
          snippet="A comprehensive Vue component library for building AI assistant interfaces."
          domain="github.com"
          type="code"
        />
      </div>
    </Variant>

    <Variant :title="document">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-2xl">
        <citation
          id="citation-document"
          href="https://example.com/whitepaper.pdf"
          title="Technical Whitepaper"
          snippet="An in-depth technical analysis of the architecture and design decisions."
          domain="example.com"
          author="Engineering Team"
          published-at="2024-01-01T00:00:00Z"
          type="document"
        />
      </div>
    </Variant>

    <Variant :title="interactive" auto-props-disabled>
      <div class="w-full max-w-2xl">
        <citation
          id="citation-interactive"
          v-bind="interactiveState"
        />
      </div>
    </Variant>

    <Variant :title="citationListDefault">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-2xl">
        <citation-list
          id="citation-list-default"
          :citations="sampleCitations"
          variant="default"
        />
      </div>
    </Variant>

    <Variant :title="citationListInline">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-2xl">
        <citation-list
          id="citation-list-inline"
          :citations="sampleCitations"
          variant="inline"
        />
      </div>
    </Variant>

    <Variant :title="citationListStacked">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-2xl">
        <citation-list
          id="citation-list-stacked"
          :citations="sampleCitations"
          variant="stacked"
        />
      </div>
    </Variant>

    <Variant :title="citationListWithOverflow">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-2xl">
        <citation-list
          id="citation-list-overflow"
          :citations="sampleCitations"
          variant="default"
          :max-visible="2"
        />
      </div>
    </Variant>

    <Variant :title="citationListInlineWithOverflow">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-2xl">
        <citation-list
          id="citation-list-inline-overflow"
          :citations="sampleCitations"
          variant="inline"
          :max-visible="2"
        />
      </div>
    </Variant>
  </Story>
</template>
