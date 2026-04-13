<script setup lang="ts">
import { reactive, ref, computed } from 'vue';
import { ItemCarousel, ItemCard } from '@lionad/vtu-components';
import messages from './i18n';
import { useStoryLocale, currentLocale } from '../_shared/use-story-locale'

const subtitle = useStoryLocale('content.key', messages);
const productCards = useStoryLocale('data.key', messages)
const withoutImages = useStoryLocale('variant.key', messages)
const minimal = useStoryLocale('variant.key', messages)
const interactiveClickItems = useStoryLocale('data.key', messages)
const withMultipleActionVariants = useStoryLocale('variant.key', messages)
const keyboardNavigationDemo = useStoryLocale('variant.key', messages)
const programmaticControl = useStoryLocale('variant.key', messages)
const emptyState = useStoryLocale('content.key', messages)
const itemCardStandalone = useStoryLocale('data.itemCard', messages)
const featuredProductsTitle = useStoryLocale('data.key', messages)
const featuredProductsDesc = useStoryLocale('content.key', messages)
const categoriesTitle = useStoryLocale('variant.key', messages)
const clickableProductsTitle = useStoryLocale('data.key', messages)
const clickableProductsDesc = useStoryLocale('content.key', messages)
const selectedText = useStoryLocale('content.key', messages)
const actionVariantsTitle = useStoryLocale('variant.key', messages)
const primaryAction = useStoryLocale('variant.key', messages)
const secondaryAction = useStoryLocale('variant.key', messages)
const outlineAction = useStoryLocale('variant.key', messages)
const deleteAction = useStoryLocale('variant.key', messages)
const ghostAction2 = useStoryLocale('variant.key', messages)
const disabledAction = useStoryLocale('variant.key', messages)
const primaryActionLabel = useStoryLocale('content.key', messages)
const secondaryActionLabel = useStoryLocale('content.key', messages)
const outlineActionLabel = useStoryLocale('content.key', messages)
const destructiveActionLabel = useStoryLocale('content.key', messages)
const ghostActionLabel = useStoryLocale('content.key', messages)
const disabledActionLabel = useStoryLocale('content.key', messages)
const defaultStyle = useStoryLocale('variant.key', messages)
const secondaryStyle = useStoryLocale('variant.key', messages)
const outlineStyle = useStoryLocale('variant.key', messages)
const destructiveStyle = useStoryLocale('variant.key', messages)
const ghostStyle = useStoryLocale('variant.key', messages)
const disabledState = useStoryLocale('variant.key', messages)
const keyboardNavTitle = useStoryLocale('variant.key', messages)
const keyboardNavDesc = useStoryLocale('content.key', messages)
const keyboardHeading = useStoryLocale('content.key', messages)
const navigateItems = useStoryLocale('data.key', messages)
const jumpFirst = useStoryLocale('variant.key', messages)
const jumpLast = useStoryLocale('variant.key', messages)
const programmaticTitle = useStoryLocale('variant.key', messages)
const programmaticDesc = useStoryLocale('content.key', messages)
const currentSlideLabel = useStoryLocale('content.key', messages)
const scrollLeft = useStoryLocale('variant.key', messages)
const scrollRight = useStoryLocale('variant.key', messages)
const noItemsTitle = useStoryLocale('data.key', messages)
const noItemsDesc = useStoryLocale('content.key', messages)
const standaloneCardName = useStoryLocale('variant.key', messages)
const standaloneCardSubtitle = useStoryLocale('content.key', messages)
const colorBgName = useStoryLocale('variant.key', messages)
const colorBgSubtitle = useStoryLocale('content.key', messages)
const interactiveCardName = useStoryLocale('variant.key', messages)
const interactiveCardSubtitle = useStoryLocale('content.key', messages)
const withActionsCardName = useStoryLocale('variant.key', messages)
const withActionsCardSubtitle = useStoryLocale('content.key', messages)
const viewAction = useStoryLocale('variant.key', messages)
const buyAction = useStoryLocale('variant.key', messages)
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

const optionAName = useStoryLocale('data.A', messages)
const optionBName = useStoryLocale('data.B', messages)
const optionCName = useStoryLocale('data.C', messages)

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

const productItems = computed(() => currentLocale.value === 'zh-CN' ? productItemsZh : productItemsEn);
const categoryItems = computed(() => currentLocale.value === 'zh-CN' ? categoryItemsZh : categoryItemsEn);

const carouselState = reactive({
  selectedItem: null as string | null,
  currentSlide: 0,
  actionLog: [] as string[],
});

const carouselRef = ref<InstanceType<typeof ItemCarousel> | null>(null);

function handleItemClick(itemId: string) {
  carouselState.selectedItem = itemId;
  carouselState.actionLog.push(`Clicked item: ${itemId}`);
  setTimeout(() => {
    carouselState.selectedItem = null;
  }, 2000);
}

function handleItemAction(itemId: string, actionId: string) {
  carouselState.actionLog.push(`Action "${actionId}" on item: ${itemId}`);
}

function handleSlideChange(index: number) {
  carouselState.currentSlide = index;
}

function scrollToSlide(index: number) {
  carouselRef.value?.scrollToIndex(index);
}

function scroll(direction: 'left' | 'right') {
  carouselRef.value?.scroll(direction);
}

// Variant titles

// Product carousel texts

// Standalone card texts

// Minimal carousel

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

    <Variant :title="interactiveClickItems">
      <div class="w-full max-w-2xl space-y-4">
        <p v-if="carouselState.selectedItem" class="rounded-md bg-primary/10 px-4 py-2 text-sm text-primary">
          {{ selectedText }} {{ productItems.find(i => i.id === carouselState.selectedItem)?.name }}
        </p>
        <item-carousel
          id="carousel-interactive"
          :title="clickableProductsTitle"
          :description="clickableProductsDesc"
          :items="productItems"
          interactive
          @item-click="handleItemClick"
        />
      </div>
    </Variant>


    <Variant :title="withMultipleActionVariants">
      <div class="w-full max-w-2xl">
        <item-carousel
          id="carousel-action-variants"
          :title="actionVariantsTitle"
          :items="[
            { id: '1', name: primaryActionLabel, subtitle: defaultStyle, color: '#3b82f6', actions: [{ id: 'action', label: primaryAction }] },
            { id: '2', name: secondaryActionLabel, subtitle: secondaryStyle, color: '#10b981', actions: [{ id: 'action', label: secondaryAction, variant: 'secondary' }] },
            { id: '3', name: outlineActionLabel, subtitle: outlineStyle, color: '#f59e0b', actions: [{ id: 'action', label: outlineAction, variant: 'outline' }] },
            { id: '4', name: destructiveActionLabel, subtitle: destructiveStyle, color: '#ef4444', actions: [{ id: 'action', label: deleteAction, variant: 'destructive' }] },
            { id: '5', name: ghostActionLabel, subtitle: ghostStyle, color: '#6b7280', actions: [{ id: 'action', label: ghostAction2, variant: 'ghost' }] },
            { id: '6', name: disabledActionLabel, subtitle: disabledState, color: '#9ca3af', actions: [{ id: 'action', label: disabledAction, disabled: true }] },
          ]"
        />
      </div>
    </Variant>

    <Variant :title="keyboardNavigationDemo">
      <div class="w-full max-w-2xl space-y-4">
        <div class="rounded-md bg-blue-50 p-3 text-sm text-blue-800 dark:bg-blue-950 dark:text-blue-200">
          <p class="font-medium">{{ keyboardHeading }}</p>
          <ul class="mt-1 list-inside list-disc">
            <li><kbd class="rounded bg-blue-100 px-1.5 py-0.5 font-mono text-xs dark:bg-blue-900">←</kbd> <kbd class="rounded bg-blue-100 px-1.5 py-0.5 font-mono text-xs dark:bg-blue-900">→</kbd> {{ navigateItems }}</li>
            <li><kbd class="rounded bg-blue-100 px-1.5 py-0.5 font-mono text-xs dark:bg-blue-900">Home</kbd> {{ jumpFirst }}</li>
            <li><kbd class="rounded bg-blue-100 px-1.5 py-0.5 font-mono text-xs dark:bg-blue-900">End</kbd> {{ jumpLast }}</li>
          </ul>
        </div>
        <item-carousel
          id="carousel-keyboard"
          :title="keyboardNavTitle"
          :description="keyboardNavDesc"
          :items="productItems.slice(0, 5)"
          interactive
          @item-click="handleItemClick"
        />
      </div>
    </Variant>

    <Variant :title="programmaticControl">
      <div class="w-full max-w-2xl space-y-4">
        <div class="flex items-center gap-2">
          <span class="text-sm font-medium">{{ currentSlideLabel }} {{ carouselState.currentSlide + 1 }} / {{ productItems.length }}</span>
        </div>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="(item, index) in productItems"
            :key="item.id"
            class="rounded-md bg-secondary px-3 py-1.5 text-sm font-medium transition-colors hover:bg-secondary/80"
            :class="{ 'ring-2 ring-primary': carouselState.currentSlide === index }"
            @click="scrollToSlide(index)"
          >
            {{ item.name }}
          </button>
        </div>
        <div class="flex gap-2">
          <button
            class="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            @click="scroll('left')"
          >
            {{ scrollLeft }}
          </button>
          <button
            class="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            @click="scroll('right')"
          >
            {{ scrollRight }}
          </button>
        </div>
        <item-carousel
          id="carousel-programmatic"
          ref="carouselRef"
          :title="programmaticTitle"
          :description="programmaticDesc"
          :items="productItems"
          interactive
          @slide-change="handleSlideChange"
          @item-click="handleItemClick"
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

    <Variant :title="itemCardStandalone">
      <div class="flex flex-wrap gap-4 p-4">
        <div class="w-52">
          <item-card
            :item="{ id: '1', name: standaloneCardName, subtitle: standaloneCardSubtitle, image: 'https://picsum.photos/200/150?random=80' }"
            :interactive="false"
          />
        </div>
        <div class="w-52">
          <item-card
            :item="{ id: '2', name: colorBgName, subtitle: colorBgSubtitle, color: '#8b5cf6' }"
            :interactive="false"
          />
        </div>
        <div class="w-52">
          <item-card
            :item="{ id: '3', name: interactiveCardName, subtitle: interactiveCardSubtitle, image: 'https://picsum.photos/200/150?random=81', color: '#10b981' }"
            :interactive="true"
            @item-click="handleItemClick"
          />
        </div>
        <div class="w-52">
          <item-card
            :item="{ id: '4', name: withActionsCardName, subtitle: withActionsCardSubtitle, color: '#f59e0b', actions: [{ id: 'view', label: viewAction }, { id: 'buy', label: buyAction }] }"
            :interactive="false"
            @item-action="handleItemAction"
          />
        </div>
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
                <td class="text-muted-foreground">{{ prop.default || '-' }}</td>
                <td>{{ useStoryLocale(prop.description) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </Variant>
  </Story>
</template>
