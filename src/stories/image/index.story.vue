<script setup lang="ts">
import { reactive, watch } from 'vue';
import { Image } from '@lionad/vtu-components';
import messages from './i18n';
import { useStoryLocale, currentLocale } from '../_shared/use-story-locale'

const subtitle = useStoryLocale('content.subtitle', messages);
const basic = useStoryLocale('content.basic', messages)
const withTitle = useStoryLocale('content.withTitle', messages)
const squareRatio = useStoryLocale('content.squareRatio', messages)
const videoRatio = useStoryLocale('content.videoRatio', messages)
const withLink = useStoryLocale('content.withLink', messages)
const withSource = useStoryLocale('content.withSource', messages)
const objectFitContain = useStoryLocale('content.objectFitContain', messages)
const interactive = useStoryLocale('content.interactive', messages)
const landscapeAlt = useStoryLocale('content.landscapeAlt', messages)
const mountainAlt = useStoryLocale('content.mountainAlt', messages)
const mountainTitle = useStoryLocale('content.mountainTitle', messages)
const squareAlt = useStoryLocale('content.squareAlt', messages)
const widescreenAlt = useStoryLocale('content.widescreenAlt', messages)
const clickableAlt = useStoryLocale('content.clickableAlt', messages)
const sourcedAlt = useStoryLocale('content.sourcedAlt', messages)
const featuredPhotoTitle = useStoryLocale('data.featuredPhotoTitle', messages)
const portraitAlt = useStoryLocale('content.portraitAlt', messages)
const portraitTitle = useStoryLocale('content.portraitTitle', messages)

const Name = useStoryLocale('content.name', messages)
const Type = useStoryLocale('content.type', messages)
const Default = useStoryLocale('content.default', messages)
const Description = useStoryLocale('content.description', messages)
const Props = useStoryLocale('content.props', messages)
const ImageProps = useStoryLocale('content.imageProps', messages)

const headerName = Name
const headerType = Type
const headerDefault = Default
const headerDesc = Description
const propsTitle = Props
const componentPropsTitle = ImageProps

const props = [
  { name: 'id', type: 'string', default: '-', description: { zh: '图片组件的唯一标识符', en: 'Unique identifier for the image component' } },
  { name: 'role', type: 'string', default: '-', description: { zh: '组件角色（information | decision | control | state | composite）', en: 'Component role' } },
  { name: 'receipt', type: 'object', default: '-', description: { zh: '操作回执信息', en: 'Operation receipt information' } },
  { name: 'assetId', type: 'string', default: '-', description: { zh: '图片资源 ID', en: 'Image asset ID' } },
  { name: 'src', type: 'string', default: '-', description: { zh: '图片文件 URL', en: 'Image file URL' } },
  { name: 'alt', type: 'string', default: '-', description: { zh: '替代文本（无障碍）', en: 'Alt text for accessibility' } },
  { name: 'title', type: 'string', default: '-', description: { zh: '图片标题', en: 'Image title' } },
  { name: 'description', type: 'string', default: '-', description: { zh: '图片描述', en: 'Image description' } },
  { name: 'href', type: 'string', default: '-', description: { zh: '外部链接 URL', en: 'External link URL' } },
  { name: 'domain', type: 'string', default: '-', description: { zh: '显示的来源域名', en: 'Displayed source domain' } },
  { name: 'ratio', type: "'auto' | '1:1' | '4:3' | '16:9' | '9:16'", default: 'auto', description: { zh: '宽高比', en: 'Aspect ratio' } },
  { name: 'fit', type: "'cover' | 'contain'", default: 'cover', description: { zh: '图片填充模式', en: 'Image fit mode' } },
  { name: 'fileSizeBytes', type: 'number', default: '-', description: { zh: '文件大小（字节）', en: 'File size in bytes' } },
  { name: 'createdAt', type: 'string', default: '-', description: { zh: '创建时间（ISO 日期时间）', en: 'Creation time (ISO datetime)' } },
  { name: 'locale', type: 'string', default: '-', description: { zh: '区域设置', en: 'Locale' } },
  { name: 'source', type: 'Source', default: '-', description: { zh: '图片来源信息', en: 'Image source information' } },
  { name: 'css', type: 'object', default: '-', description: { zh: '组件元素的 CSS 类', en: 'CSS classes for component elements' } },
]

const interactiveStateZh = {
  id: 'image-interactive',
  assetId: 'image-interactive-asset',
  src: 'https://picsum.photos/400/300?random=10',
  alt: '交互式图片示例',
  title: '交互式图片',
  ratio: 'auto' as const,
  fit: 'cover' as const,
};

const interactiveStateEn = {
  id: 'image-interactive',
  assetId: 'image-interactive-asset',
  src: 'https://picsum.photos/400/300?random=10',
  alt: 'Interactive image example',
  title: 'Interactive Image',
  ratio: 'auto' as const,
  fit: 'cover' as const,
};

const interactiveState = reactive({ ...interactiveStateZh });

watch(currentLocale, () => { Object.assign(interactiveState, currentLocale.value === 'zh-CN' ? interactiveStateZh : interactiveStateEn); });

</script>

<template>
  <Story title="Image/All Variants">
    <Variant :title="basic">
      <p class="mb-3 text-xs text-muted-foreground">{{ subtitle }}</p>
      <div class="w-full max-w-md">
        <image
          id="image-basic"
          asset-id="image-basic-asset"
          src="https://picsum.photos/400/300?random=1"
          :alt="landscapeAlt"
        />
      </div>
    </Variant>

    <Variant :title="withTitle">
      <div class="w-full max-w-md">
        <image
          id="image-title"
          asset-id="image-title-asset"
          src="https://picsum.photos/400/300?random=2"
          :alt="mountainAlt"
          :title="mountainTitle"
        />
      </div>
    </Variant>

    <Variant :title="squareRatio">
      <div class="w-full max-w-sm">
        <image
          id="image-square"
          asset-id="image-square-asset"
          src="https://picsum.photos/400/400?random=3"
          :alt="squareAlt"
          ratio="1:1"
        />
      </div>
    </Variant>

    <Variant :title="videoRatio">
      <div class="w-full max-w-lg">
        <image
          id="image-video"
          asset-id="image-video-asset"
          src="https://picsum.photos/640/360?random=4"
          :alt="widescreenAlt"
          ratio="16:9"
        />
      </div>
    </Variant>

    <Variant :title="withLink">
      <div class="w-full max-w-md">
        <image
          id="image-link"
          asset-id="image-link-asset"
          src="https://picsum.photos/400/300?random=5"
          :alt="clickableAlt"
          href="https://example.com"
          domain="example.com"
        />
      </div>
    </Variant>

    <Variant :title="withSource">
      <div class="w-full max-w-md">
        <image
          id="image-source"
          asset-id="image-source-asset"
          src="https://picsum.photos/400/300?random=6"
          :alt="sourcedAlt"
          :title="featuredPhotoTitle"
          :source="{ label: 'Unsplash', url: 'https://unsplash.com' }"
        />
      </div>
    </Variant>

    <Variant :title="objectFitContain">
      <div class="w-full max-w-md">
        <image
          id="image-contain"
          asset-id="image-contain-asset"
          src="https://picsum.photos/200/400?random=7"
          :alt="portraitAlt"
          :title="portraitTitle"
          ratio="16:9"
          fit="contain"
        />
      </div>
    </Variant>

    <Variant :title="interactive" auto-props-disabled>
      <div class="w-full max-w-md">
        <image
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
