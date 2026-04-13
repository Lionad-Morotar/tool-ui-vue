<script setup lang="ts">
import { reactive } from 'vue';
import { ImageGallery } from '@lionad/vtu-components';
import { useStoryLocale } from './_shared/use-story-locale';

const subtitle = useStoryLocale({ zh: '图片画廊组件，支持网格 / 瀑布流布局、Lightbox 全屏预览和来源标注', en: 'Image gallery with grid/masonry layout, fullscreen lightbox, and source attribution.' });

const galleryState = reactive({
  clickCount: 0,
  lastClickedImage: null as string | null
});

function handleImageClick(imageId: string) {
  galleryState.clickCount++;
  galleryState.lastClickedImage = imageId;
}

// Demo data for different variants
const landscapeImages = [
  { id: '1', src: 'https://picsum.photos/400/300?random=10', alt: 'Forest path', width: 400, height: 300, caption: 'Forest Path' },
  { id: '2', src: 'https://picsum.photos/400/300?random=11', alt: 'Ocean waves', width: 400, height: 300, caption: 'Ocean Waves' },
  { id: '3', src: 'https://picsum.photos/400/300?random=12', alt: 'Mountain peak', width: 400, height: 300, caption: 'Mountain Peak' },
  { id: '4', src: 'https://picsum.photos/400/300?random=13', alt: 'Desert dunes', width: 400, height: 300, caption: 'Desert Dunes' },
];

const waterfallImages = [
  { id: '1', src: 'https://picsum.photos/400/300?random=80', alt: 'Landscape view', width: 400, height: 300, caption: 'Landscape' },
  { id: '2', src: 'https://picsum.photos/300/500?random=81', alt: 'Portrait waterfall', width: 300, height: 500, caption: 'Waterfall (Portrait)' },
  { id: '3', src: 'https://picsum.photos/400/300?random=82', alt: 'City skyline', width: 400, height: 300, caption: 'City Skyline' },
  { id: '4', src: 'https://picsum.photos/300/450?random=83', alt: 'Tall building', width: 300, height: 450, caption: 'Architecture (Portrait)' },
  { id: '5', src: 'https://picsum.photos/400/300?random=84', alt: 'Beach sunset', width: 400, height: 300, caption: 'Beach Sunset' },
  { id: '6', src: 'https://picsum.photos/300/480?random=85', alt: 'Tall trees', width: 300, height: 480, caption: 'Forest (Portrait)' },
];

const titledImages = [
  { id: '1', src: 'https://picsum.photos/400/300?random=20', alt: 'City skyline', width: 400, height: 300, title: 'Urban Landscape', caption: 'Downtown at dusk' },
  { id: '2', src: 'https://picsum.photos/400/300?random=21', alt: 'Street scene', width: 400, height: 300, title: 'Street Life', caption: 'Busy intersection' },
  { id: '3', src: 'https://picsum.photos/400/300?random=22', alt: 'Architecture', width: 400, height: 300, title: 'Modern Design', caption: 'Contemporary building' },
];

const sourcedImages = [
  { id: '1', src: 'https://picsum.photos/400/300?random=90', alt: 'Nature photo', width: 400, height: 300, title: 'Morning Mist', caption: 'Early morning fog', source: { label: 'Unsplash', url: 'https://unsplash.com' } },
  { id: '2', src: 'https://picsum.photos/400/300?random=91', alt: 'Landscape', width: 400, height: 300, title: 'Golden Hour', caption: 'Sunset photography', source: { label: 'Pexels', url: 'https://pexels.com' } },
  { id: '3', src: 'https://picsum.photos/400/300?random=92', alt: 'Wildlife', width: 400, height: 300, title: 'Wildlife', caption: 'Nature reserve', source: { label: 'Pixabay' } },
];

const singleImage = [
  { id: '1', src: 'https://picsum.photos/600/400?random=30', alt: 'Featured photo', width: 600, height: 400, caption: 'Featured photograph' },
];

const interactiveImages = [
  { id: '1', src: 'https://picsum.photos/600/400?random=50', alt: 'Landscape', width: 600, height: 400, title: 'Mountain View', caption: 'Beautiful mountain landscape' },
  { id: '2', src: 'https://picsum.photos/600/400?random=51', alt: 'Ocean', width: 600, height: 400, title: 'Ocean Sunset', caption: 'Golden hour at the beach' },
  { id: '3', src: 'https://picsum.photos/600/400?random=52', alt: 'Forest', width: 600, height: 400, title: 'Forest Path', caption: 'Misty morning walk' },
  { id: '4', src: 'https://picsum.photos/600/400?random=53', alt: 'City', width: 600, height: 400, title: 'City Lights', caption: 'Urban nightscape' },
];

const twoImages = [
  { id: '1', src: 'https://picsum.photos/400/300?random=60', alt: 'Before', width: 400, height: 300, title: 'Before' },
  { id: '2', src: 'https://picsum.photos/400/300?random=61', alt: 'After', width: 400, height: 300, title: 'After' },
];

const nineImages = Array.from({ length: 9 }, (_, i) => ({
  id: String(i + 1),
  src: `https://picsum.photos/300/300?random=${70 + i}`,
  alt: `Image ${i + 1}`,
  width: 300,
  height: 300,
}));
const gridLayout = useStoryLocale({ zh: '网格布局', en: 'Grid Layout' })
const waterfallLayoutMasonry = useStoryLocale({ zh: '瀑布流布局（Masonry）', en: 'Waterfall Layout (Masonry)' })
const withTitles = useStoryLocale({ zh: '含标题', en: 'With Titles' })
const withSourceAttribution = useStoryLocale({ zh: '含来源标注', en: 'With Source Attribution' })
const singleImageTitle = useStoryLocale({ zh: '单图', en: 'Single Image' })
const interactiveLightboxDemo = useStoryLocale({ zh: '交互 - 灯箱演示', en: 'Interactive - Lightbox Demo' })
const differentImageCounts2Images = useStoryLocale({ zh: '不同图片数量 - 2 张', en: 'Different Image Counts - 2 Images' })
const differentImageCounts9Images = useStoryLocale({ zh: '不同图片数量 - 9 张', en: 'Different Image Counts - 9 Images' })
const lightboxFeatures = useStoryLocale({ zh: '灯箱功能', en: 'Lightbox Features' })
</script>

<template>
  <Story title="ImageGallery/All Variants">
    <Variant :title="gridLayout">
      <p class="mb-3 text-xs text-muted-foreground">{{ subtitle }}</p>
      <div class="w-full max-w-2xl">
        <image-gallery
          id="image-gallery-grid"
          title="Photo Collection"
          description="A selection of nature photography"
          :images="landscapeImages"
        />
      </div>
    </Variant>

    <Variant :title="waterfallLayoutMasonry">
      <div class="w-full max-w-2xl">
        <p class="mb-4 text-sm text-muted-foreground">
          Portrait images (height > width) automatically span 2 rows
        </p>
        <image-gallery
          id="image-gallery-waterfall"
          title="Waterfall Gallery"
          description="Mixed orientation images demonstrating masonry layout"
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
          Images can include source information with optional links
        </p>
        <image-gallery
          id="image-gallery-sourced"
          title="Curated Collection"
          description="Images with source attribution"
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
          Click count: {{ galleryState.clickCount }}
          <span v-if="galleryState.lastClickedImage" class="ml-2 text-primary">
            (Last: Image {{ galleryState.lastClickedImage }})
          </span>
        </p>
        <image-gallery
          id="image-gallery-interactive"
          title="Click to Open Lightbox"
          description="Images open in fullscreen lightbox with keyboard navigation (Arrow keys, Escape)"
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
          title="Photo Grid"
          :images="nineImages"
        />
      </div>
    </Variant>

    <Variant :title="lightboxFeatures">
      <div class="w-full max-w-2xl space-y-4">
        <div class="space-y-2 text-sm text-muted-foreground">
          <p>The lightbox supports:</p>
          <ul class="list-inside list-disc space-y-1">
            <li><strong>Keyboard navigation:</strong> Arrow keys to navigate, Escape to close</li>
            <li><strong>Touch gestures:</strong> Swipe left/right to navigate (on touch devices)</li>
            <li><strong>Image counter:</strong> Shows current position (e.g., "2 / 4")</li>
            <li><strong>Metadata display:</strong> Title, caption, and source information</li>
            <li><strong>Reduced motion:</strong> Respects user's motion preferences</li>
          </ul>
        </div>
        <image-gallery
          id="image-gallery-features"
          title="Feature Demo"
          description="Try the keyboard navigation and explore the lightbox"
          :images="interactiveImages"
        />
      </div>
    </Variant>
  </Story>
</template>
