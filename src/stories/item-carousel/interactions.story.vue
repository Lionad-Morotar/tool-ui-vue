<script setup lang="ts">
import { reactive, ref, computed } from 'vue';
import { ItemCarousel } from '@lionad/vtu-components';
import messages from './i18n';
import { useStoryLocale, currentLocale } from '../_shared/use-story-locale'

const interactiveClickItems = useStoryLocale('data.key4', messages)
const keyboardNavigationDemo = useStoryLocale('variant.key7', messages)
const programmaticControl = useStoryLocale('variant.key9', messages)
const selectedText = useStoryLocale('content.key16', messages)
const clickableProductsTitle = useStoryLocale('data.key14', messages)
const clickableProductsDesc = useStoryLocale('content.key15', messages)
const keyboardHeading = useStoryLocale('content.key45', messages)
const navigateItems = useStoryLocale('data.key46', messages)
const jumpFirst = useStoryLocale('variant.key47', messages)
const jumpLast = useStoryLocale('variant.key48', messages)
const keyboardNavTitle = useStoryLocale('variant.key43', messages)
const keyboardNavDesc = useStoryLocale('content.key44', messages)
const currentSlideLabel = useStoryLocale('content.key57', messages)
const programmaticTitle = useStoryLocale('variant.key55', messages)
const programmaticDesc = useStoryLocale('content.key56', messages)
const scrollLeft = useStoryLocale('variant.key58', messages)
const scrollRight = useStoryLocale('variant.key59', messages)

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

function handleSlideChange(index: number) {
  carouselState.currentSlide = index;
}

function scrollToSlide(index: number) {
  carouselRef.value?.scrollToIndex(index);
}

function scroll(direction: 'left' | 'right') {
  carouselRef.value?.scroll(direction);
}
</script>

<template>
  <Story title="ItemCarousel/Interactions">
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
  </Story>
</template>
