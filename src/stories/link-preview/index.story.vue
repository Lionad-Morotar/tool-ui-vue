<script setup lang="ts">
import { reactive, watch } from 'vue';
import { LinkPreview } from '@lionad/vtu-components';
import { useStoryLocale, currentLocale } from '../_shared/use-story-locale'
import messages from './i18n'

const interactiveStateZh = {
  href: 'https://example.com/interactive',
  title: '交互式链接预览',
  description: '通过更改下方属性来自定义此预览。',
  image: 'https://picsum.photos/400/200?random=135',
  domain: 'example.com',
  ratio: 'auto' as const,
};

const interactiveStateEn = {
  href: 'https://example.com/interactive',
  title: 'Interactive Link Preview',
  description: 'Customize this preview by changing the properties below.',
  image: 'https://picsum.photos/400/200?random=135',
  domain: 'example.com',
  ratio: 'auto' as const,
};

const interactiveState = reactive({ ...interactiveStateZh });

watch(currentLocale, () => { Object.assign(interactiveState, currentLocale.value === 'zh-CN' ? interactiveStateZh : interactiveStateEn); });

/**
 * ## Props
 *
 * | Prop | Type | Default | Description |
 * |------|------|---------|-------------|
 * | id | string | required | Unique identifier for the component |
 * | href | string | required | URL to navigate to when clicked |
 * | title | string | undefined | Title text to display |
 * | description | string | undefined | Description text to display |
 * | image | string | undefined | URL of the preview image |
 * | domain | string | undefined | Domain to display (auto-extracted from href if not provided) |
 * | favicon | string | undefined | URL of the favicon to display |
 * | ratio | 'auto' \| '1:1' \| '4:3' \| '16:9' \| '9:16' | 'auto' | Aspect ratio of the preview image |
 * | fit | 'cover' \| 'contain' | 'cover' | Object-fit style for the image |
 * | css | { root?: string } | undefined | CSS classes for component elements |
 *
 * ## Emits
 *
 * | Event | Payload | Description |
 * |-------|---------|-------------|
 * | navigate | href: string | Emitted when the link preview is clicked |
 *
 * ## Slots
 *
 * This component does not use slots. All content is passed via props.
 *
 * ## Accessibility
 *
 * - Has `role="link"` when href is provided
 * - Has `tabindex="0"` for keyboard navigation
 * - Supports Enter and Space keys for activation
 * - Images have `loading="lazy"` and `decoding="async"`
 * - Favicon has `aria-hidden="true"`
 */

const withImage = useStoryLocale('variant.withImage', messages)
const withoutImage = useStoryLocale('variant.withoutImage', messages)
const compact = useStoryLocale('variant.compact', messages)
const longDescription = useStoryLocale('variant.longDescription', messages)
const newsArticle = useStoryLocale('variant.newsArticle', messages)
const withFavicon = useStoryLocale('variant.withFavicon', messages)
const squareRatio11 = useStoryLocale('variant.squareRatio11', messages)
const portraitRatio916 = useStoryLocale('variant.portraitRatio916', messages)
const interactive = useStoryLocale('variant.interactive', messages)

// Link preview texts
const betterUITitle = useStoryLocale('content.betterUITitle', messages)
const betterUIDesc = useStoryLocale('content.betterUIDesc', messages)
const apiDocsTitle = useStoryLocale('content.apiDocsTitle', messages)
const apiDocsDesc = useStoryLocale('content.apiDocsDesc', messages)
const githubRepoTitle = useStoryLocale('content.githubRepoTitle', messages)
const jsTitle = useStoryLocale('content.jsTitle', messages)
const jsDesc = useStoryLocale('content.jsDesc', messages)
const newsTitle = useStoryLocale('content.newsTitle', messages)
const newsDesc = useStoryLocale('content.newsDesc', messages)
const githubFeaturesTitle = useStoryLocale('content.githubFeaturesTitle', messages)
const githubFeaturesDesc = useStoryLocale('content.githubFeaturesDesc', messages)
const photoGalleryTitle = useStoryLocale('content.photoGalleryTitle', messages)
const photoGalleryDesc = useStoryLocale('content.photoGalleryDesc', messages)
const portraitTitle = useStoryLocale('content.portraitTitle', messages)
const portraitDesc = useStoryLocale('content.portraitDesc', messages)
</script>

<template>
  <Story title="LinkPreview/All Variants">
    <Variant :title="withImage">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-md">
        <link-preview
          id="link-preview-image"
          href="https://example.com/article"
          :title="betterUITitle"
          :description="betterUIDesc"
          image="https://picsum.photos/400/200?random=130"
          domain="example.com"
        />
      </div>
    </Variant>

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

    <Variant :title="squareRatio11">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-md">
        <link-preview
          id="link-preview-square"
          href="https://example.com/gallery"
          :title="photoGalleryTitle"
          :description="photoGalleryDesc"
          image="https://picsum.photos/400/400?random=134"
          domain="example.com"
          ratio="1:1"
        />
      </div>
    </Variant>

    <Variant :title="portraitRatio916">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-sm">
        <link-preview
          id="link-preview-portrait"
          href="https://example.com/portrait"
          :title="portraitTitle"
          :description="portraitDesc"
          image="https://picsum.photos/300/500?random=136"
          domain="example.com"
          ratio="9:16"
        />
      </div>
    </Variant>

    <Variant :title="interactive" auto-props-disabled>
      <div class="w-full max-w-md">
        <link-preview
          id="link-preview-interactive"
          v-bind="interactiveState"
        />
      </div>
    </Variant>
  </Story>
</template>
