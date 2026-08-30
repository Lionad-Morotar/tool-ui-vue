<script setup lang="ts">
import { LinkPreview } from '@lionad/vtu-components';
import messages from './i18n'
import { useStoryLocale } from '../_shared/use-story-locale'

const withImage = useStoryLocale('variant.withImage', messages)
const betterUITitle = useStoryLocale('content.betterUITitle', messages)
const betterUIDesc = useStoryLocale('content.betterUIDesc', messages)

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
