<script setup lang="ts">
import { reactive, watch } from 'vue';
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- Image is used in template as <Image> (kebab-case)
import { Image } from '@lionad/vtu-components';
import { useStoryLocale, currentLocale } from '../_shared/use-story-locale'
import messages from './i18n';

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

// Image alts and titles

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
