<script setup lang="ts">
import { computed } from 'vue';
import { ItemCarousel } from '@lionad/vtu-components';
import messages from './i18n';
import { useStoryLocale, currentLocale } from '../_shared/use-story-locale'

const withoutImages = useStoryLocale('variant.key2', messages)
const minimal = useStoryLocale('variant.key3', messages)
const emptyState = useStoryLocale('content.key10', messages)
const categoriesTitle = useStoryLocale('variant.key13', messages)
const noItemsTitle = useStoryLocale('data.key60', messages)
const noItemsDesc = useStoryLocale('content.key61', messages)
const optionAName = useStoryLocale('data.A', messages)
const optionBName = useStoryLocale('data.B', messages)
const optionCName = useStoryLocale('data.C', messages)

const categoryItemsZh = [
  { id: '1', name: '电子产品', subtitle: '124 件商品', color: '#6366f1' },
  { id: '2', name: '服饰', subtitle: '89 件商品', color: '#ec4899' },
  { id: '3', name: '家居', subtitle: '56 件商品', color: '#14b8a6' },
  { id: '4', name: '运动', subtitle: '43 件商品', color: '#f97316' },
];

const categoryItemsEn = [
  { id: '1', name: 'Electronics', subtitle: '124 items', color: '#6366f1' },
  { id: '2', name: 'Clothing', subtitle: '89 items', color: '#ec4899' },
  { id: '3', name: 'Home', subtitle: '56 items', color: '#14b8a6' },
  { id: '4', name: 'Sports', subtitle: '43 items', color: '#f97316' },
];

const categoryItems = computed(() => currentLocale.value === 'zh-CN' ? categoryItemsZh : categoryItemsEn);
</script>

<template>
  <Story title="ItemCarousel/States">
    <Variant :title="withoutImages">
      <div class="w-full max-w-xl">
        <item-carousel
          id="carousel-no-images"
          :title="categoriesTitle"
          :items="categoryItems"
        />
      </div>
    </Variant>

    <Variant :title="minimal">
      <div class="w-full max-w-md">
        <item-carousel
          id="carousel-minimal"
          :items="[
            { id: '1', name: optionAName },
            { id: '2', name: optionBName },
            { id: '3', name: optionCName },
          ]"
        />
      </div>
    </Variant>

    <Variant :title="emptyState">
      <div class="w-full max-w-2xl">
        <item-carousel
          id="carousel-empty"
          :title="noItemsTitle"
          :description="noItemsDesc"
          :items="[]"
        />
      </div>
    </Variant>
  </Story>
</template>
