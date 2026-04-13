<script setup lang="ts">
import { reactive, computed } from 'vue';
import { ImageGallery } from '@lionad/vtu-components';
import { useStoryLocale, currentLocale } from '../_shared/use-story-locale'
import messages from './i18n';

const subtitle = useStoryLocale('content.subtitle', messages);

const galleryState = reactive({
  clickCount: 0,
  lastClickedImage: null as string | null
});

function handleImageClick(imageId: string) {
  galleryState.clickCount++;
  galleryState.lastClickedImage = imageId;
}

// Landscape images
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

// Waterfall images
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

// Titled images
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

// Sourced images
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

// Single image
const singleImageZh = [
  { id: '1', src: 'https://picsum.photos/600/400?random=30', alt: '精选照片', width: 600, height: 400, caption: '精选摄影作品' },
];
const singleImageEn = [
  { id: '1', src: 'https://picsum.photos/600/400?random=30', alt: 'Featured photo', width: 600, height: 400, caption: 'Featured photograph' },
];
const singleImage = computed(() => currentLocale.value === 'zh-CN' ? singleImageZh : singleImageEn);

// Interactive images
const interactiveImagesZh = [
  { id: '1', src: 'https://picsum.photos/600/400?random=50', alt: '山景', width: 600, height: 400, title: '山景', caption: '美丽山景' },
  { id: '2', src: 'https://picsum.photos/600/400?random=51', alt: '海洋日落', width: 600, height: 400, title: '海洋日落', caption: '海滩黄金时刻' },
  { id: '3', src: 'https://picsum.photos/600/400?random=52', alt: '林间小径', width: 600, height: 400, title: '林间小径', caption: '雾中晨行' },
  { id: '4', src: 'https://picsum.photos/600/400?random=53', alt: '城市灯光', width: 600, height: 400, title: '城市灯光', caption: '城市夜景' },
];
const interactiveImagesEn = [
  { id: '1', src: 'https://picsum.photos/600/400?random=50', alt: 'Mountain View', width: 600, height: 400, title: 'Mountain View', caption: 'Beautiful mountain landscape' },
  { id: '2', src: 'https://picsum.photos/600/400?random=51', alt: 'Ocean Sunset', width: 600, height: 400, title: 'Ocean Sunset', caption: 'Golden hour at the beach' },
  { id: '3', src: 'https://picsum.photos/600/400?random=52', alt: 'Forest Path', width: 600, height: 400, title: 'Forest Path', caption: 'Misty morning walk' },
  { id: '4', src: 'https://picsum.photos/600/400?random=53', alt: 'City Lights', width: 600, height: 400, title: 'City Lights', caption: 'Urban nightscape' },
];
const interactiveImages = computed(() => currentLocale.value === 'zh-CN' ? interactiveImagesZh : interactiveImagesEn);

// Two images
const twoImagesZh = [
  { id: '1', src: 'https://picsum.photos/400/300?random=60', alt: '之前', width: 400, height: 300, title: '之前' },
  { id: '2', src: 'https://picsum.photos/400/300?random=61', alt: '之后', width: 400, height: 300, title: '之后' },
];
const twoImagesEn = [
  { id: '1', src: 'https://picsum.photos/400/300?random=60', alt: 'Before', width: 400, height: 300, title: 'Before' },
  { id: '2', src: 'https://picsum.photos/400/300?random=61', alt: 'After', width: 400, height: 300, title: 'After' },
];
const twoImages = computed(() => currentLocale.value === 'zh-CN' ? twoImagesZh : twoImagesEn);

// Nine images (dynamic, with template literal for alt)
const imageN = useStoryLocale('content.imageN', messages)
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

const gridLayout = useStoryLocale('content.gridLayout', messages)
const waterfallLayoutMasonry = useStoryLocale('content.waterfallLayoutMasonry', messages)
const withTitles = useStoryLocale('content.withTitles', messages)
const withSourceAttribution = useStoryLocale('content.withSourceAttribution', messages)
const singleImageTitle = useStoryLocale('content.singleImageTitle', messages)
const interactiveLightboxDemo = useStoryLocale('content.interactiveLightboxDemo', messages)
const differentImageCounts2Images = useStoryLocale('content.differentImageCounts2Images', messages)
const differentImageCounts9Images = useStoryLocale('content.differentImageCounts9Images', messages)
const lightboxFeatures = useStoryLocale('data.lightboxFeatures', messages)

// Gallery texts
const photoCollectionTitle = useStoryLocale('content.photoCollectionTitle', messages)
const photoCollectionDesc = useStoryLocale('content.photoCollectionDesc', messages)
const masonryHint = useStoryLocale('content.masonryHint', messages)
const waterfallGalleryTitle = useStoryLocale('content.waterfallGalleryTitle', messages)
const waterfallGalleryDesc = useStoryLocale('content.waterfallGalleryDesc', messages)
const sourceHint = useStoryLocale('content.sourceHint', messages)
const curatedCollectionTitle = useStoryLocale('content.curatedCollectionTitle', messages)
const curatedCollectionDesc = useStoryLocale('content.curatedCollectionDesc', messages)
const clickCountText = useStoryLocale('content.clickCountText', messages)
const lastClickedText = useStoryLocale('content.lastClickedText', messages)
const lightboxTitle = useStoryLocale('content.lightboxTitle', messages)
const lightboxDesc = useStoryLocale('content.lightboxDesc', messages)
const photoGridTitle = useStoryLocale('content.photoGridTitle', messages)
const lightboxFeaturesDesc = useStoryLocale('content.lightboxFeaturesDesc', messages)
const keyboardNav = useStoryLocale('content.keyboardNav', messages)
const touchGestures = useStoryLocale('content.touchGestures', messages)
const imageCounter = useStoryLocale('content.imageCounter', messages)
const metadataDisplay = useStoryLocale('data.metaDisplay', messages)
const reducedMotion = useStoryLocale('content.reducedMotion', messages)
const featureDemoTitle = useStoryLocale('data.featureDemoTitle', messages)
const featureDemoDesc = useStoryLocale('variant.featureDemoDesc', messages)
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

    <Variant :title="singleImageTitle">
      <div class="w-full max-w-md">
        <image-gallery
          id="image-gallery-single"
          :images="singleImage"
        />
      </div>
    </Variant>

    <Variant :title="interactiveLightboxDemo">
      <div class="w-full max-w-2xl">
        <p class="mb-4 text-sm text-muted-foreground">
          {{ clickCountText }} {{ galleryState.clickCount }}
          <span v-if="galleryState.lastClickedImage" class="ml-2 text-primary">
            ({{ lastClickedText }} {{ galleryState.lastClickedImage }})
          </span>
        </p>
        <image-gallery
          id="image-gallery-interactive"
          :title="lightboxTitle"
          :description="lightboxDesc"
          :images="interactiveImages"
          @image-click="handleImageClick"
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

    <Variant :title="lightboxFeatures">
      <div class="w-full max-w-2xl space-y-4">
        <div class="space-y-2 text-sm text-muted-foreground">
          <p>{{ lightboxFeaturesDesc }}</p>
          <ul class="list-inside list-disc space-y-1">
            <li><strong>{{ keyboardNav }}</strong></li>
            <li><strong>{{ touchGestures }}</strong></li>
            <li><strong>{{ imageCounter }}</strong></li>
            <li><strong>{{ metadataDisplay }}</strong></li>
            <li><strong>{{ reducedMotion }}</strong></li>
          </ul>
        </div>
        <image-gallery
          id="image-gallery-features"
          :title="featureDemoTitle"
          :description="featureDemoDesc"
          :images="interactiveImages"
        />
      </div>
    </Variant>
  </Story>
</template>
