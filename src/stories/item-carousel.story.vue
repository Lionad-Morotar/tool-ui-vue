<script setup lang="ts">
import { reactive, ref, computed } from 'vue';
import { ItemCarousel, ItemCard } from '@lionad/vtu-components';
import { useStoryLocale, currentLocale } from './_shared/use-story-locale';

const subtitle = useStoryLocale({ zh: '轮播组件，支持手势滑动、键盘导航、可交互点击和多种操作按钮样式', en: 'Carousel with swipe gestures, keyboard navigation, interactive clicks, and action button variants.' });

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
const productCards = useStoryLocale({ zh: '商品卡片', en: 'Product Cards' })
const withoutImages = useStoryLocale({ zh: '无图片', en: 'Without Images' })
const minimal = useStoryLocale({ zh: '极简', en: 'Minimal' })
const interactiveClickItems = useStoryLocale({ zh: '交互 - 点击项目', en: 'Interactive - Click Items' })
const withActions = useStoryLocale({ zh: '含操作', en: 'With Actions' })
const withMultipleActionVariants = useStoryLocale({ zh: '含多种操作变体', en: 'With Multiple Action Variants' })
const keyboardNavigationDemo = useStoryLocale({ zh: '键盘导航演示', en: 'Keyboard Navigation Demo' })
const touchSwipeDemo = useStoryLocale({ zh: '触摸/滑动演示', en: 'Touch/Swipe Demo' })
const programmaticControl = useStoryLocale({ zh: '编程控制', en: 'Programmatic Control' })
const emptyState = useStoryLocale({ zh: '空状态', en: 'Empty State' })
const itemCardStandalone = useStoryLocale({ zh: 'ItemCard - 独立', en: 'ItemCard - Standalone' })

// Product carousel texts
const featuredProductsTitle = useStoryLocale({ zh: '精选商品', en: 'Featured Products' })
const featuredProductsDesc = useStoryLocale({ zh: '滑动探索我们的精选', en: 'Swipe to explore our collection' })
const categoriesTitle = useStoryLocale({ zh: '分类', en: 'Categories' })
const clickableProductsTitle = useStoryLocale({ zh: '可点击商品', en: 'Clickable Products' })
const clickableProductsDesc = useStoryLocale({ zh: '点击任意商品选中', en: 'Click any item to select' })
const selectedText = useStoryLocale({ zh: '已选中:', en: 'Selected:' })
const productsWithActionsTitle = useStoryLocale({ zh: '含操作的商品', en: 'Products with Actions' })
const actionLogText = useStoryLocale({ zh: '操作日志:', en: 'Action Log:' })
const actionVariantsTitle = useStoryLocale({ zh: '操作变体演示', en: 'Action Variants Demo' })
const basicPlan = useStoryLocale({ zh: '基础方案', en: 'Basic Plan' })
const proPlan = useStoryLocale({ zh: '专业方案', en: 'Pro Plan' })
const enterprise = useStoryLocale({ zh: '企业方案', en: 'Enterprise' })
const selectAction = useStoryLocale({ zh: '选择', en: 'Select' })
const contactAction = useStoryLocale({ zh: '联系', en: 'Contact' })
const primaryAction = useStoryLocale({ zh: '主要', en: 'Primary' })
const secondaryAction = useStoryLocale({ zh: '次要', en: 'Secondary' })
const outlineAction = useStoryLocale({ zh: '轮廓', en: 'Outline' })
const deleteAction = useStoryLocale({ zh: '删除', en: 'Delete' })
const ghostAction2 = useStoryLocale({ zh: '幽灵', en: 'Ghost' })
const disabledAction = useStoryLocale({ zh: '禁用', en: 'Disabled' })
const primaryActionLabel = useStoryLocale({ zh: '主要操作', en: 'Primary Action' })
const secondaryActionLabel = useStoryLocale({ zh: '次要操作', en: 'Secondary Action' })
const outlineActionLabel = useStoryLocale({ zh: '轮廓操作', en: 'Outline Action' })
const destructiveActionLabel = useStoryLocale({ zh: '危险操作', en: 'Destructive Action' })
const ghostActionLabel = useStoryLocale({ zh: '幽灵操作', en: 'Ghost Action' })
const disabledActionLabel = useStoryLocale({ zh: '禁用操作', en: 'Disabled Action' })
const defaultStyle = useStoryLocale({ zh: '默认样式', en: 'Default style' })
const secondaryStyle = useStoryLocale({ zh: '次要样式', en: 'Secondary style' })
const outlineStyle = useStoryLocale({ zh: '轮廓样式', en: 'Outline style' })
const destructiveStyle = useStoryLocale({ zh: '危险样式', en: 'Destructive style' })
const ghostStyle = useStoryLocale({ zh: '幽灵样式', en: 'Ghost style' })
const disabledState = useStoryLocale({ zh: '禁用状态', en: 'Disabled state' })
const keyboardNavTitle = useStoryLocale({ zh: '键盘无障碍轮播', en: 'Keyboard Accessible Carousel' })
const keyboardNavDesc = useStoryLocale({ zh: '聚焦轮播后使用方向键导航', en: 'Focus the carousel and use arrow keys to navigate' })
const keyboardHeading = useStoryLocale({ zh: '键盘导航:', en: 'Keyboard Navigation:' })
const navigateItems = useStoryLocale({ zh: '在项目间导航', en: 'Navigate between items' })
const jumpFirst = useStoryLocale({ zh: '跳到第一个项目', en: 'Jump to first item' })
const jumpLast = useStoryLocale({ zh: '跳到最后一个项目', en: 'Jump to last item' })
const touchSwipeTitle = useStoryLocale({ zh: '触控友好轮播', en: 'Touch-Friendly Carousel' })
const touchSwipeDesc = useStoryLocale({ zh: '在触控设备上滑动导航', en: 'Swipe to navigate on touch devices' })
const touchHeading = useStoryLocale({ zh: '触控手势:', en: 'Touch Gestures:' })
const swipeNavigate = useStoryLocale({ zh: '向左/向右滑动导航', en: 'Swipe left/right to navigate' })
const fastSwipes = useStoryLocale({ zh: '快速滑动触发导航', en: 'Fast swipes trigger navigation' })
const verticalScrolling = useStoryLocale({ zh: '保留垂直滚动', en: 'Vertical scrolling is preserved' })
const programmaticTitle = useStoryLocale({ zh: '编程控制演示', en: 'Programmatic Control Demo' })
const programmaticDesc = useStoryLocale({ zh: '使用上方按钮控制轮播', en: 'Use buttons above to control the carousel' })
const currentSlideLabel = useStoryLocale({ zh: '当前幻灯片:', en: 'Current Slide:' })
const scrollLeft = useStoryLocale({ zh: '← 向左滚动', en: '← Scroll Left' })
const scrollRight = useStoryLocale({ zh: '向右滚动 →', en: 'Scroll Right →' })
const noItemsTitle = useStoryLocale({ zh: '无项目', en: 'No Items' })
const noItemsDesc = useStoryLocale({ zh: '此轮播没有项目可显示', en: 'This carousel has no items to display' })

// Standalone card texts
const standaloneCardName = useStoryLocale({ zh: '独立卡片', en: 'Standalone Card' })
const standaloneCardSubtitle = useStoryLocale({ zh: '带图片', en: 'With image' })
const colorBgName = useStoryLocale({ zh: '彩色背景', en: 'Color Background' })
const colorBgSubtitle = useStoryLocale({ zh: '无图片', en: 'No image' })
const interactiveCardName = useStoryLocale({ zh: '可交互卡片', en: 'Interactive Card' })
const interactiveCardSubtitle = useStoryLocale({ zh: '点击我！', en: 'Click me!' })
const withActionsCardName = useStoryLocale({ zh: '含操作', en: 'With Actions' })
const withActionsCardSubtitle = useStoryLocale({ zh: '两个操作', en: 'Two actions' })
const viewAction = useStoryLocale({ zh: '查看', en: 'View' })
const buyAction = useStoryLocale({ zh: '购买', en: 'Buy' })

// Minimal carousel
const optionAName = useStoryLocale({ zh: '选项 A', en: 'Option A' })
const optionBName = useStoryLocale({ zh: '选项 B', en: 'Option B' })
const optionCName = useStoryLocale({ zh: '选项 C', en: 'Option C' })
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

    <Variant :title="withActions">
      <div class="w-full max-w-2xl space-y-4">
        <div v-if="carouselState.actionLog.length > 0" class="rounded-md bg-muted p-3">
          <p class="mb-1 text-xs font-medium text-muted-foreground">{{ actionLogText }}</p>
          <ul class="space-y-1 text-sm">
            <li v-for="(log, i) in carouselState.actionLog.slice(-5)" :key="i" class="text-foreground">
              {{ log }}
            </li>
          </ul>
        </div>
        <item-carousel
          id="carousel-actions"
          :title="productsWithActionsTitle"
          :items="[
            { id: '1', name: basicPlan, subtitle: '$9/月', color: '#6366f1', actions: [{ id: 'select', label: selectAction }] },
            { id: '2', name: proPlan, subtitle: '$29/月', color: '#ec4899', actions: [{ id: 'select', label: selectAction }] },
            { id: '3', name: enterprise, subtitle: '$99/月', color: '#14b8a6', actions: [{ id: 'contact', label: contactAction }] },
          ]"
          @item-action="handleItemAction"
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

    <Variant :title="touchSwipeDemo">
      <div class="w-full max-w-2xl space-y-4">
        <div class="rounded-md bg-green-50 p-3 text-sm text-green-800 dark:bg-green-950 dark:text-green-200">
          <p class="font-medium">{{ touchHeading }}</p>
          <ul class="mt-1 list-inside list-disc">
            <li>{{ swipeNavigate }}</li>
            <li>{{ fastSwipes }}</li>
            <li>{{ verticalScrolling }}</li>
          </ul>
        </div>
        <item-carousel
          id="carousel-touch"
          :title="touchSwipeTitle"
          :description="touchSwipeDesc"
          :items="productItems"
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
  </Story>
</template>
