<script setup lang="ts">
import { computed } from 'vue';
import { CitationList } from '@lionad/vtu-components';
import messages from './i18n'
import { useStoryLocale, currentLocale } from '../_shared/use-story-locale'
import type { SerializableCitation } from '@lionad/vtu-components/citation/schema';

const citationListDefault = useStoryLocale('data.citationListDefault', messages)
const citationListStacked = useStoryLocale('data.citationListStacked', messages)
const citationListWithOverflow = useStoryLocale('data.citationListWithOverflow', messages)

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
</script>

<template>
  <Story title="Citation/List">
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
  </Story>
</template>
