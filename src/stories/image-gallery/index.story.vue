<script setup lang="ts">
import { computed } from 'vue';
import { ImageGallery } from '@lionad/vtu-components';
import messages from './i18n';
import { useStoryLocale, currentLocale } from '../_shared/use-story-locale'

const subtitle = useStoryLocale('content.subtitle', messages);
const gridLayout = useStoryLocale('content.gridLayout', messages)
const photoCollectionTitle = useStoryLocale('content.photoCollectionTitle', messages)
const photoCollectionDesc = useStoryLocale('content.photoCollectionDesc', messages)

const Name = useStoryLocale('content.name', messages)
const Type = useStoryLocale('content.type', messages)
const Default = useStoryLocale('content.default', messages)
const Description = useStoryLocale('content.description', messages)
const Props = useStoryLocale('content.props', messages)
const ImageGalleryProps = useStoryLocale('content.imageGalleryProps', messages)

const headerName = Name
const headerType = Type
const headerDefault = Default
const headerDesc = Description
const propsTitle = Props
const componentPropsTitle = ImageGalleryProps

const props = [
  { name: 'id', type: 'string', default: '-', description: { zh: '图片画廊组件的唯一标识符', en: 'Unique identifier for the image gallery component' } },
  { name: 'role', type: 'string', default: '-', description: { zh: '组件角色（information | decision | control | state | composite）', en: 'Component role' } },
  { name: 'receipt', type: 'object', default: '-', description: { zh: '操作回执信息', en: 'Operation receipt information' } },
  { name: 'images', type: 'ImageGalleryItem[]', default: '-', description: { zh: '图片数组', en: 'Array of gallery images' } },
  { name: 'title', type: 'string', default: '-', description: { zh: '画廊标题', en: 'Gallery title' } },
  { name: 'description', type: 'string', default: '-', description: { zh: '画廊描述', en: 'Gallery description' } },
  { name: 'css', type: 'object', default: '-', description: { zh: '组件元素的 CSS 类', en: 'CSS classes for component elements' } },
]

const landscapeImagesZh = [
  { id: '1', src: 'https://picsum.photos/400/300?random=10', alt: '林间小径', width: 400, height: 300, caption: '林间小径' },
  { id: '2', src: 'https://picsum.photos/400/300?random=11', alt: '海浪', width: 400, height: 300, caption: '海浪' },
  { id: '3', src: 'https://picsum.photos/400/300?random=12', alt: '山峰', width: 400, height: 300, caption: '山峰' },
  { id: '4', src: 'https://picsum.photos/400/300?random=13', alt: '沙漠沙丘', width: 400, height: 300, caption: '沙漠沙丘' },
];
const landscapeImagesEn = [
  { id: '1', src: 'https://picsum.photos/400/300?random=10', alt: 'Forest path', width: 400, height: 300, caption: 'Forest Path' },
  { id: '2', src: 'https://picsum.photos/400/300?random=11', alt: 'Ocean waves', width: 400, height: 300, caption: 'Ocean Waves' },
  { id: '3', src: 'https://picsum.photos/400/300?random=12', alt: 'Mountain peak', width: 400, height: 300, caption: 'Mountain Peak' },
  { id: '4', src: 'https://picsum.photos/400/300?random=13', alt: 'Desert dunes', width: 400, height: 300, caption: 'Desert Dunes' },
];
const landscapeImages = computed(() => currentLocale.value === 'zh-CN' ? landscapeImagesZh : landscapeImagesEn);

</script>

<template>
  <Story title="ImageGallery/All Variants">
    <Variant :title="gridLayout">
      <p class="mb-3 text-xs text-muted-foreground">{{ subtitle }}</p>
      <div class="w-full max-w-2xl">
        <image-gallery
          id="image-gallery-grid"
          :title="photoCollectionTitle"
          :description="photoCollectionDesc"
          :images="landscapeImages"
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
