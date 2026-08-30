<script setup lang="ts">
import { computed } from 'vue';
import { ImageGallery } from '@lionad/vtu-components';
import messages from './i18n';
import { useStoryLocale, currentLocale } from '../_shared/use-story-locale'

const waterfallLayoutMasonry = useStoryLocale('content.waterfallLayoutMasonry', messages)
const singleImageTitle = useStoryLocale('content.singleImageTitle', messages)
const differentImageCounts2Images = useStoryLocale('content.differentImageCounts2Images', messages)
const differentImageCounts9Images = useStoryLocale('content.differentImageCounts9Images', messages)
const imageN = useStoryLocale('content.imageN', messages)
const masonryHint = useStoryLocale('content.masonryHint', messages)
const waterfallGalleryTitle = useStoryLocale('content.waterfallGalleryTitle', messages)
const waterfallGalleryDesc = useStoryLocale('content.waterfallGalleryDesc', messages)
const photoGridTitle = useStoryLocale('content.photoGridTitle', messages)

const waterfallImagesZh = [
  { id: '1', src: 'https://picsum.photos/400/300?random=80', alt: '风景', width: 400, height: 300, caption: '风景' },
  { id: '2', src: 'https://picsum.photos/300/500?random=81', alt: '瀑布（竖屏）', width: 300, height: 500, caption: '瀑布（竖屏）' },
  { id: '3', src: 'https://picsum.photos/400/300?random=82', alt: '城市天际线', width: 400, height: 300, caption: '城市天际线' },
  { id: '4', src: 'https://picsum.photos/300/450?random=83', alt: '高楼', width: 300, height: 450, caption: '建筑（竖屏）' },
  { id: '5', src: 'https://picsum.photos/400/300?random=84', alt: '海滩日落', width: 400, height: 300, caption: '海滩日落' },
  { id: '6', src: 'https://picsum.photos/300/480?random=85', alt: '高树', width: 300, height: 480, caption: '森林（竖屏）' },
];
const waterfallImagesEn = [
  { id: '1', src: 'https://picsum.photos/400/300?random=80', alt: 'Landscape', width: 400, height: 300, caption: 'Landscape' },
  { id: '2', src: 'https://picsum.photos/300/500?random=81', alt: 'Waterfall (Portrait)', width: 300, height: 500, caption: 'Waterfall (Portrait)' },
  { id: '3', src: 'https://picsum.photos/400/300?random=82', alt: 'City skyline', width: 400, height: 300, caption: 'City Skyline' },
  { id: '4', src: 'https://picsum.photos/300/450?random=83', alt: 'Tall building', width: 300, height: 450, caption: 'Architecture (Portrait)' },
  { id: '5', src: 'https://picsum.photos/400/300?random=84', alt: 'Beach sunset', width: 400, height: 300, caption: 'Beach Sunset' },
  { id: '6', src: 'https://picsum.photos/300/480?random=85', alt: 'Tall trees', width: 300, height: 480, caption: 'Forest (Portrait)' },
];
const waterfallImages = computed(() => currentLocale.value === 'zh-CN' ? waterfallImagesZh : waterfallImagesEn);

const singleImageZh = [
  { id: '1', src: 'https://picsum.photos/600/400?random=30', alt: '精选照片', width: 600, height: 400, caption: '精选摄影作品' },
];
const singleImageEn = [
  { id: '1', src: 'https://picsum.photos/600/400?random=30', alt: 'Featured photo', width: 600, height: 400, caption: 'Featured photograph' },
];
const singleImage = computed(() => currentLocale.value === 'zh-CN' ? singleImageZh : singleImageEn);

const twoImagesZh = [
  { id: '1', src: 'https://picsum.photos/400/300?random=60', alt: '之前', width: 400, height: 300, title: '之前' },
  { id: '2', src: 'https://picsum.photos/400/300?random=61', alt: '之后', width: 400, height: 300, title: '之后' },
];
const twoImagesEn = [
  { id: '1', src: 'https://picsum.photos/400/300?random=60', alt: 'Before', width: 400, height: 300, title: 'Before' },
  { id: '2', src: 'https://picsum.photos/400/300?random=61', alt: 'After', width: 400, height: 300, title: 'After' },
];
const twoImages = computed(() => currentLocale.value === 'zh-CN' ? twoImagesZh : twoImagesEn);

const nineImagesZh = computed(() => Array.from({ length: 9 }, (_, i) => ({
  id: String(i + 1),
  src: `https://picsum.photos/300/300?random=${70 + i}`,
  alt: `${imageN.value} ${i + 1}`,
  width: 300,
  height: 300,
})));
const nineImagesEn = computed(() => Array.from({ length: 9 }, (_, i) => ({
  id: String(i + 1),
  src: `https://picsum.photos/300/300?random=${170 + i}`,
  alt: `Image ${i + 1}`,
  width: 300,
  height: 300,
})));
const nineImages = computed(() => currentLocale.value === 'zh-CN' ? nineImagesZh.value : nineImagesEn.value);

</script>

<template>
  <Story title="ImageGallery/Layouts">
    <Variant :title="waterfallLayoutMasonry">
      <div class="w-full max-w-2xl">
        <p class="mb-4 text-sm text-muted-foreground">
          {{ masonryHint }}
        </p>
        <image-gallery
          id="image-gallery-waterfall"
          :title="waterfallGalleryTitle"
          :description="waterfallGalleryDesc"
          :images="waterfallImages"
        />
      </div>
    </Variant>

    <Variant :title="singleImageTitle">
      <div class="w-full max-w-md">
        <image-gallery
          id="image-gallery-single"
          :images="singleImage"
        />
      </div>
    </Variant>

    <Variant :title="differentImageCounts2Images">
      <div class="w-full max-w-md">
        <image-gallery
          id="image-gallery-2"
          :images="twoImages"
        />
      </div>
    </Variant>

    <Variant :title="differentImageCounts9Images">
      <div class="w-full max-w-2xl">
        <image-gallery
          id="image-gallery-9"
          :title="photoGridTitle"
          :images="nineImages"
        />
      </div>
    </Variant>
  </Story>
</template>
