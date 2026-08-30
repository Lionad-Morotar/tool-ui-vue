<script setup lang="ts">
import { reactive, computed } from 'vue';
import { ImageGallery } from '@lionad/vtu-components';
import messages from './i18n';
import { useStoryLocale, currentLocale } from '../_shared/use-story-locale'

const interactiveLightboxDemo = useStoryLocale('content.interactiveLightboxDemo', messages)
const lightboxFeatures = useStoryLocale('data.lightboxFeatures', messages)
const clickCountText = useStoryLocale('content.clickCountText', messages)
const lastClickedText = useStoryLocale('content.lastClickedText', messages)
const lightboxTitle = useStoryLocale('content.lightboxTitle', messages)
const lightboxDesc = useStoryLocale('content.lightboxDesc', messages)
const lightboxFeaturesDesc = useStoryLocale('content.lightboxFeaturesDesc', messages)
const keyboardNav = useStoryLocale('content.keyboardNav', messages)
const touchGestures = useStoryLocale('content.touchGestures', messages)
const imageCounter = useStoryLocale('content.imageCounter', messages)
const metadataDisplay = useStoryLocale('data.metaDisplay', messages)
const reducedMotion = useStoryLocale('content.reducedMotion', messages)
const featureDemoTitle = useStoryLocale('data.featureDemoTitle', messages)
const featureDemoDesc = useStoryLocale('variant.featureDemoDesc', messages)

const galleryState = reactive({
  clickCount: 0,
  lastClickedImage: null as string | null
});

function handleImageClick(imageId: string) {
  galleryState.clickCount++;
  galleryState.lastClickedImage = imageId;
}

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

</script>

<template>
  <Story title="ImageGallery/Lightbox">
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
