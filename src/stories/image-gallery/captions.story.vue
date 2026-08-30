<script setup lang="ts">
import { computed } from 'vue';
import { ImageGallery } from '@lionad/vtu-components';
import messages from './i18n';
import { useStoryLocale, currentLocale } from '../_shared/use-story-locale'

const withTitles = useStoryLocale('content.withTitles', messages)
const withSourceAttribution = useStoryLocale('content.withSourceAttribution', messages)
const sourceHint = useStoryLocale('content.sourceHint', messages)
const curatedCollectionTitle = useStoryLocale('content.curatedCollectionTitle', messages)
const curatedCollectionDesc = useStoryLocale('content.curatedCollectionDesc', messages)

const titledImagesZh = [
  { id: '1', src: 'https://picsum.photos/400/300?random=20', alt: '城市风景', width: 400, height: 300, title: '城市风景', caption: '黄昏市中心' },
  { id: '2', src: 'https://picsum.photos/400/300?random=21', alt: '街头生活', width: 400, height: 300, title: '街头生活', caption: '繁忙十字路口' },
  { id: '3', src: 'https://picsum.photos/400/300?random=22', alt: '现代设计', width: 400, height: 300, title: '现代设计', caption: '当代建筑' },
];
const titledImagesEn = [
  { id: '1', src: 'https://picsum.photos/400/300?random=20', alt: 'Urban Landscape', width: 400, height: 300, title: 'Urban Landscape', caption: 'Downtown at dusk' },
  { id: '2', src: 'https://picsum.photos/400/300?random=21', alt: 'Street Life', width: 400, height: 300, title: 'Street Life', caption: 'Busy intersection' },
  { id: '3', src: 'https://picsum.photos/400/300?random=22', alt: 'Modern Design', width: 400, height: 300, title: 'Modern Design', caption: 'Contemporary building' },
];
const titledImages = computed(() => currentLocale.value === 'zh-CN' ? titledImagesZh : titledImagesEn);

const sourcedImagesZh = [
  { id: '1', src: 'https://picsum.photos/400/300?random=90', alt: '晨雾', width: 400, height: 300, title: '晨雾', caption: '清晨薄雾', source: { label: 'Unsplash', url: 'https://unsplash.com' } },
  { id: '2', src: 'https://picsum.photos/400/300?random=91', alt: '黄金时刻', width: 400, height: 300, title: '黄金时刻', caption: '日落摄影', source: { label: 'Pexels', url: 'https://pexels.com' } },
  { id: '3', src: 'https://picsum.photos/400/300?random=92', alt: '野生动物', width: 400, height: 300, title: '野生动物', caption: '自然保护区', source: { label: 'Pixabay' } },
];
const sourcedImagesEn = [
  { id: '1', src: 'https://picsum.photos/400/300?random=90', alt: 'Morning Mist', width: 400, height: 300, title: 'Morning Mist', caption: 'Early morning fog', source: { label: 'Unsplash', url: 'https://unsplash.com' } },
  { id: '2', src: 'https://picsum.photos/400/300?random=91', alt: 'Golden Hour', width: 400, height: 300, title: 'Golden Hour', caption: 'Sunset photography', source: { label: 'Pexels', url: 'https://pexels.com' } },
  { id: '3', src: 'https://picsum.photos/400/300?random=92', alt: 'Wildlife', width: 400, height: 300, title: 'Wildlife', caption: 'Nature reserve', source: { label: 'Pixabay' } },
];
const sourcedImages = computed(() => currentLocale.value === 'zh-CN' ? sourcedImagesZh : sourcedImagesEn);

</script>

<template>
  <Story title="ImageGallery/Captions">
    <Variant :title="withTitles">
      <div class="w-full max-w-2xl">
        <image-gallery
          id="image-gallery-titles"
          :images="titledImages"
        />
      </div>
    </Variant>

    <Variant :title="withSourceAttribution">
      <div class="w-full max-w-2xl">
        <p class="mb-4 text-sm text-muted-foreground">
          {{ sourceHint }}
        </p>
        <image-gallery
          id="image-gallery-sourced"
          :title="curatedCollectionTitle"
          :description="curatedCollectionDesc"
          :images="sourcedImages"
        />
      </div>
    </Variant>
  </Story>
</template>
