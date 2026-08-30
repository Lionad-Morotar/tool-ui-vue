<script setup lang="ts">
import { reactive, watch } from 'vue';
import { Citation } from '@lionad/vtu-components';
import messages from './i18n'
import { useStoryLocale, currentLocale } from '../_shared/use-story-locale'

const inline = useStoryLocale('content.inline', messages)
const stacked = useStoryLocale('content.stacked', messages)
const webpage = useStoryLocale('content.webpage', messages)
const document = useStoryLocale('content.document', messages)
const interactive = useStoryLocale('content.interactive', messages)
const sourceDocTitle = useStoryLocale('content.sourceDocTitle', messages)
const docRefTitle = useStoryLocale('content.docRefTitle', messages)
const docRefSnippet = useStoryLocale('content.docRefSnippet', messages)
const mdnTitle = useStoryLocale('content.mdnTitle', messages)
const mdnSnippet = useStoryLocale('content.mdnSnippet', messages)
const whitepaperTitle = useStoryLocale('content.whitepaperTitle', messages)
const whitepaperSnippet = useStoryLocale('content.whitepaperSnippet', messages)

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
</script>

<template>
  <Story title="Citation/Formats">
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
          :title="mdnTitle"
          :snippet="mdnSnippet"
          domain="developer.mozilla.org"
          type="webpage"
        />
      </div>
    </Variant>

    <Variant :title="document">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-2xl">
        <citation
          id="citation-document"
          href="https://example.com/whitepaper.pdf"
          :title="whitepaperTitle"
          :snippet="whitepaperSnippet"
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
  </Story>
</template>
