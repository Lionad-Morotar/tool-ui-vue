<script setup lang="ts">
import { reactive, watch } from 'vue';
import { LinkPreview } from '@lionad/vtu-components';
import messages from './i18n'
import { useStoryLocale, currentLocale } from '../_shared/use-story-locale'

const squareRatio11 = useStoryLocale('variant.squareRatio11', messages)
const portraitRatio916 = useStoryLocale('variant.portraitRatio916', messages)
const interactive = useStoryLocale('variant.interactive', messages)
const photoGalleryTitle = useStoryLocale('content.photoGalleryTitle', messages)
const photoGalleryDesc = useStoryLocale('content.photoGalleryDesc', messages)
const portraitTitle = useStoryLocale('content.portraitTitle', messages)
const portraitDesc = useStoryLocale('content.portraitDesc', messages)

const interactiveStateZh = {
  href: 'https://example.com/interactive',
  title: '交互式链接预览',
  description: '通过更改下方属性来自定义此预览。',
  image: 'https://picsum.photos/400/200?random=135',
  domain: 'example.com',
  ratio: 'auto' as const,
};

const interactiveStateEn = {
  href: 'https://example.com/interactive',
  title: 'Interactive Link Preview',
  description: 'Customize this preview by changing the properties below.',
  image: 'https://picsum.photos/400/200?random=135',
  domain: 'example.com',
  ratio: 'auto' as const,
};

const interactiveState = reactive({ ...interactiveStateZh });

watch(currentLocale, () => { Object.assign(interactiveState, currentLocale.value === 'zh-CN' ? interactiveStateZh : interactiveStateEn); });

</script>

<template>
  <Story title="LinkPreview/Ratios">
    <Variant :title="squareRatio11">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-md">
        <link-preview
          id="link-preview-square"
          href="https://example.com/gallery"
          :title="photoGalleryTitle"
          :description="photoGalleryDesc"
          image="https://picsum.photos/400/400?random=134"
          domain="example.com"
          ratio="1:1"
        />
      </div>
    </Variant>

    <Variant :title="portraitRatio916">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-sm">
        <link-preview
          id="link-preview-portrait"
          href="https://example.com/portrait"
          :title="portraitTitle"
          :description="portraitDesc"
          image="https://picsum.photos/300/500?random=136"
          domain="example.com"
          ratio="9:16"
        />
      </div>
    </Variant>

    <Variant :title="interactive" auto-props-disabled>
      <div class="w-full max-w-md">
        <link-preview
          id="link-preview-interactive"
          v-bind="interactiveState"
        />
      </div>
    </Variant>
  </Story>
</template>
