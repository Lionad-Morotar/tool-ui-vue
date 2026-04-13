<script setup lang="ts">
import { reactive, watch } from 'vue';
import { LinkPreview } from '@lionad/vtu-components';
import { useStoryLocale, currentLocale } from './_shared/use-story-locale'

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

const withImage = useStoryLocale({ zh: '含图片', en: 'With Image' })
const withoutImage = useStoryLocale({ zh: '无图片', en: 'Without Image' })
const compact = useStoryLocale({ zh: '紧凑模式', en: 'Compact' })
const longDescription = useStoryLocale({ zh: '长描述', en: 'Long Description' })
const newsArticle = useStoryLocale({ zh: '新闻文章', en: 'News Article' })
const withFavicon = useStoryLocale({ zh: '含网站图标', en: 'With Favicon' })
const squareRatio11 = useStoryLocale({ zh: '方形比例 (1:1)', en: 'Square Ratio (1:1)' })
const portraitRatio916 = useStoryLocale({ zh: '竖屏比例 (9:16)', en: 'Portrait Ratio (9:16)' })
const interactive = useStoryLocale({ zh: '交互模式', en: 'Interactive' })

// Link preview texts
const betterUITitle = useStoryLocale({ zh: '构建更优秀的 UI 组件', en: 'Building Better UI Components' })
const betterUIDesc = useStoryLocale({ zh: '为现代 Web 应用创建可复用、可访问 UI 组件的综合指南。', en: 'A comprehensive guide to creating reusable, accessible UI components for modern web applications.' })
const apiDocsTitle = useStoryLocale({ zh: 'API 文档', en: 'API Documentation' })
const apiDocsDesc = useStoryLocale({ zh: 'REST API 端点、认证和示例的完整参考。', en: 'Complete reference for our REST API endpoints, authentication, and examples.' })
const githubRepoTitle = useStoryLocale({ zh: 'example/repo', en: 'example/repo' })
const jsTitle = useStoryLocale({ zh: '理解现代 JavaScript', en: 'Understanding Modern JavaScript' })
const jsDesc = useStoryLocale({ zh: 'JavaScript 多年来发展显著。在这份综合指南中，我们探索每位开发者在 2024 年都应了解的最新功能、最佳实践和模式。从 async/await 到模块，我们全面覆盖。', en: 'JavaScript has evolved significantly over the years. In this comprehensive guide, we explore the latest features, best practices, and patterns that every developer should know in 2024. From async/await to modules, we cover it all.' })
const newsTitle = useStoryLocale({ zh: '科技行业第四季度创纪录增长', en: 'Tech Industry Sees Record Growth in Q4' })
const newsDesc = useStoryLocale({ zh: '最新季度报告显示多个行业前所未有的扩张。', en: 'Latest quarterly reports show unprecedented expansion across multiple sectors.' })
const githubFeaturesTitle = useStoryLocale({ zh: 'GitHub 功能', en: 'GitHub Features' })
const githubFeaturesDesc = useStoryLocale({ zh: '探索使 GitHub 成为全球领先开发平台的强大功能。', en: 'Explore the powerful features that make GitHub the world\'s leading development platform.' })
const photoGalleryTitle = useStoryLocale({ zh: '照片画廊', en: 'Photo Gallery' })
const photoGalleryDesc = useStoryLocale({ zh: '精选精美摄影作品集。', en: 'A collection of stunning photography.' })
const portraitTitle = useStoryLocale({ zh: '竖屏模式', en: 'Portrait Mode' })
const portraitDesc = useStoryLocale({ zh: '为移动端查看优化。', en: 'Optimized for mobile viewing.' })
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
