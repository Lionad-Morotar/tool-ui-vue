<script setup lang="ts">
import { reactive } from 'vue';
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- Image is used in template as <image> (kebab-case)
import { Image } from '@lionad/components';

const interactiveState = reactive({
  id: 'image-interactive',
  assetId: 'image-interactive-asset',
  src: 'https://picsum.photos/400/300?random=10',
  alt: 'Interactive image example',
  title: 'Interactive Image',
  ratio: 'auto' as const,
  fit: 'cover' as const,
});
</script>

<template>
  <Story title="Image/All Variants">
    <Variant title="Basic">
      <div class="w-full max-w-md">
        <image
          id="image-basic"
          asset-id="image-basic-asset"
          src="https://picsum.photos/400/300?random=1"
          alt="Example landscape photo"
        />
      </div>
    </Variant>

    <Variant title="With Title">
      <div class="w-full max-w-md">
        <image
          id="image-title"
          asset-id="image-title-asset"
          src="https://picsum.photos/400/300?random=2"
          alt="Mountain landscape"
          title="Mountain Vista"
        />
      </div>
    </Variant>

    <Variant title="Square Ratio">
      <div class="w-full max-w-sm">
        <image
          id="image-square"
          asset-id="image-square-asset"
          src="https://picsum.photos/400/400?random=3"
          alt="Square format image"
          ratio="1:1"
        />
      </div>
    </Variant>

    <Variant title="Video Ratio">
      <div class="w-full max-w-lg">
        <image
          id="image-video"
          asset-id="image-video-asset"
          src="https://picsum.photos/640/360?random=4"
          alt="Widescreen image"
          ratio="16:9"
        />
      </div>
    </Variant>

    <Variant title="With Link">
      <div class="w-full max-w-md">
        <image
          id="image-link"
          asset-id="image-link-asset"
          src="https://picsum.photos/400/300?random=5"
          alt="Clickable image"
          href="https://example.com"
          domain="example.com"
        />
      </div>
    </Variant>

    <Variant title="With Source">
      <div class="w-full max-w-md">
        <image
          id="image-source"
          asset-id="image-source-asset"
          src="https://picsum.photos/400/300?random=6"
          alt="Sourced image"
          title="Featured Photo"
          :source="{ label: 'Unsplash', url: 'https://unsplash.com' }"
        />
      </div>
    </Variant>

    <Variant title="Object Fit: Contain">
      <div class="w-full max-w-md">
        <image
          id="image-contain"
          asset-id="image-contain-asset"
          src="https://picsum.photos/200/400?random=7"
          alt="Portrait image with contain fit"
          title="Portrait (Contain)"
          ratio="16:9"
          fit="contain"
        />
      </div>
    </Variant>

    <Variant title="Interactive" auto-props-disabled>
      <div class="w-full max-w-md">
        <image
          v-bind="interactiveState"
        />
      </div>
    </Variant>
  </Story>
</template>
