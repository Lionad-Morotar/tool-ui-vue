<script setup lang="ts">
import { LinkPreview } from '@lionad/vtu-components';
import messages from './i18n'
import { useStoryLocale } from '../_shared/use-story-locale'

const withoutImage = useStoryLocale('variant.withoutImage', messages)
const compact = useStoryLocale('variant.compact', messages)
const longDescription = useStoryLocale('variant.longDescription', messages)
const newsArticle = useStoryLocale('variant.newsArticle', messages)
const withFavicon = useStoryLocale('variant.withFavicon', messages)
const apiDocsTitle = useStoryLocale('content.apiDocsTitle', messages)
const apiDocsDesc = useStoryLocale('content.apiDocsDesc', messages)
const githubRepoTitle = useStoryLocale('content.githubRepoTitle', messages)
const jsTitle = useStoryLocale('content.jsTitle', messages)
const jsDesc = useStoryLocale('content.jsDesc', messages)
const newsTitle = useStoryLocale('content.newsTitle', messages)
const newsDesc = useStoryLocale('content.newsDesc', messages)
const githubFeaturesTitle = useStoryLocale('content.githubFeaturesTitle', messages)
const githubFeaturesDesc = useStoryLocale('content.githubFeaturesDesc', messages)
</script>

<template>
  <Story title="LinkPreview/Variants">
    <Variant :title="withoutImage">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-md">
        <link-preview
          id="link-preview-no-image"
          href="https://example.com/docs"
          :title="apiDocsTitle"
          :description="apiDocsDesc"
          domain="example.com"
        />
      </div>
    </Variant>

    <Variant :title="compact">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-sm">
        <link-preview
          id="link-preview-compact"
          href="https://github.com/example/repo"
          :title="githubRepoTitle"
          domain="github.com"
        />
      </div>
    </Variant>

    <Variant :title="longDescription">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-md">
        <link-preview
          id="link-preview-long"
          href="https://example.com/blog"
          :title="jsTitle"
          :description="jsDesc"
          image="https://picsum.photos/400/200?random=131"
          domain="example.com"
        />
      </div>
    </Variant>

    <Variant :title="newsArticle">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-md">
        <link-preview
          id="link-preview-news"
          href="https://news.example.com/story"
          :title="newsTitle"
          :description="newsDesc"
          image="https://picsum.photos/400/200?random=132"
          domain="news.example.com"
        />
      </div>
    </Variant>

    <Variant :title="withFavicon">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-md">
        <link-preview
          id="link-preview-favicon"
          href="https://github.com/features"
          :title="githubFeaturesTitle"
          :description="githubFeaturesDesc"
          image="https://picsum.photos/400/200?random=133"
          domain="github.com"
          favicon="https://github.com/favicon.ico"
        />
      </div>
    </Variant>
  </Story>
</template>
