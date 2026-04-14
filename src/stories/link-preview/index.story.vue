<script setup lang="ts">
import { reactive, watch } from 'vue';
import { LinkPreview } from '@lionad/vtu-components';
import messages from './i18n'
import { useStoryLocale, currentLocale } from '../_shared/use-story-locale'

const withImage = useStoryLocale('variant.withImage', messages)
const withoutImage = useStoryLocale('variant.withoutImage', messages)
const compact = useStoryLocale('variant.compact', messages)
const longDescription = useStoryLocale('variant.longDescription', messages)
const newsArticle = useStoryLocale('variant.newsArticle', messages)
const withFavicon = useStoryLocale('variant.withFavicon', messages)
const squareRatio11 = useStoryLocale('variant.squareRatio11', messages)
const portraitRatio916 = useStoryLocale('variant.portraitRatio916', messages)
const interactive = useStoryLocale('variant.interactive', messages)
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

const Name = useStoryLocale('content.name', messages)
const Type = useStoryLocale('content.type', messages)
const Default = useStoryLocale('content.default', messages)
const Description = useStoryLocale('content.description', messages)
const Props = useStoryLocale('content.props', messages)
const LinkPreviewProps = useStoryLocale('content.linkPreviewProps', messages)

const headerName = Name
const headerType = Type
const headerDefault = Default
const headerDesc = Description
const propsTitle = Props
const componentPropsTitle = LinkPreviewProps

const props = [
  { name: 'id', type: 'string', required: true, description: { zh: '组件唯一标识符', en: 'Unique identifier for the component' } },
  { name: 'href', type: 'string', required: true, description: { zh: '点击时跳转的 URL', en: 'URL to navigate to when clicked' } },
  { name: 'title', type: 'string', description: { zh: '显示的标题文本', en: 'Title text to display' } },
  { name: 'description', type: 'string', description: { zh: '显示的描述文本', en: 'Description text to display' } },
  { name: 'image', type: 'string', description: { zh: '预览图片的 URL', en: 'URL of the preview image' } },
  { name: 'domain', type: 'string', description: { zh: '显示的域名（未提供时自动从 href 提取）', en: 'Domain to display (auto-extracted from href if not provided)' } },
  { name: 'favicon', type: 'string', description: { zh: '网站图标的 URL', en: 'URL of the favicon to display' } },
  { name: 'ratio', type: "'auto' | '1:1' | '4:3' | '16:9' | '9:16'", default: 'auto', description: { zh: '预览图片的宽高比', en: 'Aspect ratio of the preview image' } },
  { name: 'fit', type: "'cover' | 'contain'", default: 'cover', description: { zh: '图片的 object-fit 样式', en: 'Object-fit style for the image' } },
  { name: 'css', type: '{ root?: string; image?: string; content?: string; footer?: string }', description: { zh: '组件元素的 CSS 类', en: 'CSS classes for component elements' } },
]

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

    <Variant :title="propsTitle">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-4xl p-6">
        <h2 class="mb-4 text-2xl font-bold">{{ componentPropsTitle }}</h2>
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
      </div>
    </Variant>
  </Story>
</template>
