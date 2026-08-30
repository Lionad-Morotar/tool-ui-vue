<script setup lang="ts">
import { computed } from 'vue';
import { ItemCarousel } from '@lionad/vtu-components';
import messages from './i18n';
import { useStoryLocale, currentLocale } from '../_shared/use-story-locale'

const subtitle = useStoryLocale('content.key', messages);
const productCards = useStoryLocale('data.key1', messages)
const featuredProductsTitle = useStoryLocale('data.key11', messages)
const featuredProductsDesc = useStoryLocale('content.key12', messages)

const Name = useStoryLocale('content.name', messages)
const Type = useStoryLocale('content.type', messages)
const Default = useStoryLocale('content.default', messages)
const Description = useStoryLocale('content.description', messages)
const Props = useStoryLocale('content.props', messages)
const ItemCarouselProps = useStoryLocale('content.itemCarouselProps', messages)

const headerName = Name
const headerType = Type
const headerDefault = Default
const headerDesc = Description
const propsTitle = Props
const componentPropsTitle = ItemCarouselProps

const props = [
  { name: 'id', type: 'string', required: true, description: { zh: '组件的唯一标识符', en: 'Unique identifier for the component' } },
  { name: 'title', type: 'string', description: { zh: '轮播的标题', en: 'Title of the carousel' } },
  { name: 'description', type: 'string', description: { zh: '轮播的描述', en: 'Description of the carousel' } },
  { name: 'items', type: 'Item[]', required: true, description: { zh: '要展示的轮播项数组', en: 'Array of items to display in the carousel' } },
  { name: 'css', type: '{ root?: string; title?: string; card?: string; actions?: string }', description: { zh: '组件元素的 CSS 类', en: 'CSS classes for component elements' } },
]

// Localized item data
const productItemsZh = [
  { id: '1', name: '无线耳机', subtitle: '高品质音频', image: 'https://picsum.photos/200/150?random=70', color: '#3b82f6' },
  { id: '2', name: '智能手表', subtitle: '健身追踪', image: 'https://picsum.photos/200/150?random=71', color: '#10b981' },
  { id: '3', name: '便携音箱', subtitle: '360° 环绕声', image: 'https://picsum.photos/200/150?random=72', color: '#f59e0b' },
  { id: '4', name: '笔记本支架', subtitle: '人体工学设计', image: 'https://picsum.photos/200/150?random=73', color: '#ef4444' },
  { id: '5', name: '机械键盘', subtitle: 'RGB 背光', image: 'https://picsum.photos/200/150?random=74', color: '#8b5cf6' },
  { id: '6', name: 'USB-C 扩展坞', subtitle: '7 合 1 适配器', image: 'https://picsum.photos/200/150?random=75', color: '#06b6d4' },
];

const productItemsEn = [
  { id: '1', name: 'Wireless Headphones', subtitle: 'Premium Audio', image: 'https://picsum.photos/200/150?random=70', color: '#3b82f6' },
  { id: '2', name: 'Smart Watch', subtitle: 'Fitness Tracking', image: 'https://picsum.photos/200/150?random=71', color: '#10b981' },
  { id: '3', name: 'Portable Speaker', subtitle: '360° Sound', image: 'https://picsum.photos/200/150?random=72', color: '#f59e0b' },
  { id: '4', name: 'Laptop Stand', subtitle: 'Ergonomic Design', image: 'https://picsum.photos/200/150?random=73', color: '#ef4444' },
  { id: '5', name: 'Mechanical Keyboard', subtitle: 'RGB Backlight', image: 'https://picsum.photos/200/150?random=74', color: '#8b5cf6' },
  { id: '6', name: 'USB-C Hub', subtitle: '7-in-1 Adapter', image: 'https://picsum.photos/200/150?random=75', color: '#06b6d4' },
];

const productItems = computed(() => currentLocale.value === 'zh-CN' ? productItemsZh : productItemsEn);
</script>

<template>
  <Story title="ItemCarousel/All Variants">
    <Variant :title="productCards">
      <p class="mb-3 text-xs text-muted-foreground">{{ subtitle }}</p>
      <div class="w-full max-w-2xl">
        <item-carousel
          id="carousel-products"
          :title="featuredProductsTitle"
          :description="featuredProductsDesc"
          :items="productItems"
        />
      </div>
    </Variant>

    <Variant :title="propsTitle">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-4xl p-6">
        <h2 class="mb-4 text-2xl font-bold">{{ componentPropsTitle }}</h2>
        <div class="overflow-x-auto">
          <table class="story-table">
            <thead>
              <tr>
                <th>{{ headerName }}</th>
                <th>{{ headerType }}</th>
                <th>{{ headerDefault }}</th>
                <th>{{ headerDesc }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="prop in props" :key="prop.name">
                <td class="font-mono text-emerald-600">{{ prop.name }}</td>
                <td class="font-mono text-blue-600">{{ prop.type }}</td>
                <td class="text-muted-foreground">{{ 'default' in prop ? prop.default : '-' }}</td>
                <td>{{ useStoryLocale(prop.description) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </Variant>
  </Story>
</template>
