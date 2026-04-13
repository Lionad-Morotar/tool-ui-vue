<script setup lang="ts">
import { reactive, watch } from 'vue';
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- Image is used in template as <Image> (kebab-case)
import { Image } from '@lionad/vtu-components';
import { useStoryLocale, currentLocale } from './_shared/use-story-locale';

const subtitle = useStoryLocale({ zh: '图片组件，支持比例、自适应、链接和来源 attribution', en: 'Image component with ratio support, object-fit, links, and source attribution.' });

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
const basic = useStoryLocale({ zh: '基础', en: 'Basic' })
const withTitle = useStoryLocale({ zh: '含标题', en: 'With Title' })
const squareRatio = useStoryLocale({ zh: '方形比例', en: 'Square Ratio' })
const videoRatio = useStoryLocale({ zh: '视频比例', en: 'Video Ratio' })
const withLink = useStoryLocale({ zh: '含链接', en: 'With Link' })
const withSource = useStoryLocale({ zh: '含来源', en: 'With Source' })
const objectFitContain = useStoryLocale({ zh: '缩放模式: 包含', en: 'Object Fit: Contain' })
const interactive = useStoryLocale({ zh: '交互模式', en: 'Interactive' })

// Image alts and titles
const landscapeAlt = useStoryLocale({ zh: '风景照片示例', en: 'Example landscape photo' })
const mountainAlt = useStoryLocale({ zh: '山脉风景', en: 'Mountain landscape' })
const mountainTitle = useStoryLocale({ zh: '山脉全景', en: 'Mountain Vista' })
const squareAlt = useStoryLocale({ zh: '方形格式图片', en: 'Square format image' })
const widescreenAlt = useStoryLocale({ zh: '宽屏图片', en: 'Widescreen image' })
const clickableAlt = useStoryLocale({ zh: '可点击的图片', en: 'Clickable image' })
const sourcedAlt = useStoryLocale({ zh: '带来源标注的图片', en: 'Sourced image' })
const featuredPhotoTitle = useStoryLocale({ zh: '精选照片', en: 'Featured Photo' })
const portraitAlt = useStoryLocale({ zh: '竖屏图片，包含模式', en: 'Portrait image with contain fit' })
const portraitTitle = useStoryLocale({ zh: '人像（包含模式）', en: 'Portrait (Contain)' })
</script>

<template>
  <Story title="Image/All Variants">
    <Variant :title="basic">
      <p class="mb-3 text-xs text-muted-foreground">{{ subtitle }}</p>
      <div class="w-full max-w-md">
        <Image
          id="image-basic"
          asset-id="image-basic-asset"
          src="https://picsum.photos/400/300?random=1"
          :alt="landscapeAlt"
        />
      </div>
    </Variant>

    <Variant :title="withTitle">
      <div class="w-full max-w-md">
        <Image
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
        <Image
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
        <Image
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
        <Image
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
        <Image
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
        <Image
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
        <Image
          v-bind="interactiveState"
        />
      </div>
    </Variant>
  </Story>
</template>
