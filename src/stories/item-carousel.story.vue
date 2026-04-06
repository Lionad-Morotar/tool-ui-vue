<script setup lang="ts">
import { reactive, ref } from 'vue';
import { ItemCarousel, ItemCard } from '@lionad/vtu-components';

const carouselState = reactive({
  items: [
    { id: '1', name: 'Wireless Headphones', subtitle: 'Premium Audio', image: 'https://picsum.photos/200/150?random=70', color: '#3b82f6' },
    { id: '2', name: 'Smart Watch', subtitle: 'Fitness Tracking', image: 'https://picsum.photos/200/150?random=71', color: '#10b981' },
    { id: '3', name: 'Portable Speaker', subtitle: '360° Sound', image: 'https://picsum.photos/200/150?random=72', color: '#f59e0b' },
    { id: '4', name: 'Laptop Stand', subtitle: 'Ergonomic Design', image: 'https://picsum.photos/200/150?random=73', color: '#ef4444' },
    { id: '5', name: 'Mechanical Keyboard', subtitle: 'RGB Backlight', image: 'https://picsum.photos/200/150?random=74', color: '#8b5cf6' },
    { id: '6', name: 'USB-C Hub', subtitle: '7-in-1 Adapter', image: 'https://picsum.photos/200/150?random=75', color: '#06b6d4' },
  ],
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
</script>

<template>
  <Story title="ItemCarousel/All Variants">
    <Variant title="Product Cards">
      <div class="w-full max-w-2xl">
        <item-carousel
          id="carousel-products"
          title="Featured Products"
          description="Swipe to explore our collection"
          :items="[
            { id: '1', name: 'Wireless Headphones', subtitle: 'Premium Audio', image: 'https://picsum.photos/200/150?random=70', color: '#3b82f6' },
            { id: '2', name: 'Smart Watch', subtitle: 'Fitness Tracking', image: 'https://picsum.photos/200/150?random=71', color: '#10b981' },
            { id: '3', name: 'Portable Speaker', subtitle: '360° Sound', image: 'https://picsum.photos/200/150?random=72', color: '#f59e0b' },
            { id: '4', name: 'Laptop Stand', subtitle: 'Ergonomic Design', image: 'https://picsum.photos/200/150?random=73', color: '#ef4444' },
            { id: '5', name: 'Mechanical Keyboard', subtitle: 'RGB Backlight', image: 'https://picsum.photos/200/150?random=74', color: '#8b5cf6' },
            { id: '6', name: 'USB-C Hub', subtitle: '7-in-1 Adapter', image: 'https://picsum.photos/200/150?random=75', color: '#06b6d4' },
          ]"
        />
      </div>
    </Variant>

    <Variant title="Without Images">
      <div class="w-full max-w-xl">
        <item-carousel
          id="carousel-no-images"
          title="Categories"
          :items="[
            { id: '1', name: 'Electronics', subtitle: '124 items', color: '#6366f1' },
            { id: '2', name: 'Clothing', subtitle: '89 items', color: '#ec4899' },
            { id: '3', name: 'Home', subtitle: '56 items', color: '#14b8a6' },
            { id: '4', name: 'Sports', subtitle: '43 items', color: '#f97316' },
          ]"
        />
      </div>
    </Variant>

    <Variant title="Minimal">
      <div class="w-full max-w-md">
        <item-carousel
          id="carousel-minimal"
          :items="[
            { id: '1', name: 'Option A' },
            { id: '2', name: 'Option B' },
            { id: '3', name: 'Option C' },
          ]"
        />
      </div>
    </Variant>

    <Variant title="Interactive - Click Items">
      <div class="w-full max-w-2xl space-y-4">
        <p v-if="carouselState.selectedItem" class="rounded-md bg-primary/10 px-4 py-2 text-sm text-primary">
          Selected: {{ carouselState.items.find(i => i.id === carouselState.selectedItem)?.name }}
        </p>
        <item-carousel
          id="carousel-interactive"
          title="Clickable Products"
          description="Click any item to select"
          :items="carouselState.items"
          interactive
          @item-click="handleItemClick"
        />
      </div>
    </Variant>

    <Variant title="With Actions">
      <div class="w-full max-w-2xl space-y-4">
        <div v-if="carouselState.actionLog.length > 0" class="rounded-md bg-muted p-3">
          <p class="mb-1 text-xs font-medium text-muted-foreground">Action Log:</p>
          <ul class="space-y-1 text-sm">
            <li v-for="(log, i) in carouselState.actionLog.slice(-5)" :key="i" class="text-foreground">
              {{ log }}
            </li>
          </ul>
        </div>
        <item-carousel
          id="carousel-actions"
          title="Products with Actions"
          :items="[
            { id: '1', name: 'Basic Plan', subtitle: '$9/month', color: '#6366f1', actions: [{ id: 'select', label: 'Select' }] },
            { id: '2', name: 'Pro Plan', subtitle: '$29/month', color: '#ec4899', actions: [{ id: 'select', label: 'Select' }] },
            { id: '3', name: 'Enterprise', subtitle: '$99/month', color: '#14b8a6', actions: [{ id: 'contact', label: 'Contact' }] },
          ]"
          @item-action="handleItemAction"
        />
      </div>
    </Variant>

    <Variant title="With Multiple Action Variants">
      <div class="w-full max-w-2xl">
        <item-carousel
          id="carousel-action-variants"
          title="Action Variants Demo"
          :items="[
            { id: '1', name: 'Primary Action', subtitle: 'Default style', color: '#3b82f6', actions: [{ id: 'action', label: 'Primary' }] },
            { id: '2', name: 'Secondary Action', subtitle: 'Secondary style', color: '#10b981', actions: [{ id: 'action', label: 'Secondary', variant: 'secondary' }] },
            { id: '3', name: 'Outline Action', subtitle: 'Outline style', color: '#f59e0b', actions: [{ id: 'action', label: 'Outline', variant: 'outline' }] },
            { id: '4', name: 'Destructive Action', subtitle: 'Destructive style', color: '#ef4444', actions: [{ id: 'action', label: 'Delete', variant: 'destructive' }] },
            { id: '5', name: 'Ghost Action', subtitle: 'Ghost style', color: '#6b7280', actions: [{ id: 'action', label: 'Ghost', variant: 'ghost' }] },
            { id: '6', name: 'Disabled Action', subtitle: 'Disabled state', color: '#9ca3af', actions: [{ id: 'action', label: 'Disabled', disabled: true }] },
          ]"
        />
      </div>
    </Variant>

    <Variant title="Keyboard Navigation Demo">
      <div class="w-full max-w-2xl space-y-4">
        <div class="rounded-md bg-blue-50 p-3 text-sm text-blue-800 dark:bg-blue-950 dark:text-blue-200">
          <p class="font-medium">Keyboard Navigation:</p>
          <ul class="mt-1 list-inside list-disc">
            <li><kbd class="rounded bg-blue-100 px-1.5 py-0.5 font-mono text-xs dark:bg-blue-900">←</kbd> <kbd class="rounded bg-blue-100 px-1.5 py-0.5 font-mono text-xs dark:bg-blue-900">→</kbd> Navigate between items</li>
            <li><kbd class="rounded bg-blue-100 px-1.5 py-0.5 font-mono text-xs dark:bg-blue-900">Home</kbd> Jump to first item</li>
            <li><kbd class="rounded bg-blue-100 px-1.5 py-0.5 font-mono text-xs dark:bg-blue-900">End</kbd> Jump to last item</li>
          </ul>
        </div>
        <item-carousel
          id="carousel-keyboard"
          title="Keyboard Accessible Carousel"
          description="Focus the carousel and use arrow keys to navigate"
          :items="carouselState.items.slice(0, 5)"
          interactive
          @item-click="handleItemClick"
        />
      </div>
    </Variant>

    <Variant title="Touch/Swipe Demo">
      <div class="w-full max-w-2xl space-y-4">
        <div class="rounded-md bg-green-50 p-3 text-sm text-green-800 dark:bg-green-950 dark:text-green-200">
          <p class="font-medium">Touch Gestures:</p>
          <ul class="mt-1 list-inside list-disc">
            <li>Swipe left/right to navigate</li>
            <li>Fast swipes trigger navigation</li>
            <li>Vertical scrolling is preserved</li>
          </ul>
        </div>
        <item-carousel
          id="carousel-touch"
          title="Touch-Friendly Carousel"
          description="Swipe to navigate on touch devices"
          :items="carouselState.items"
          interactive
          @item-click="handleItemClick"
        />
      </div>
    </Variant>

    <Variant title="Programmatic Control">
      <div class="w-full max-w-2xl space-y-4">
        <div class="flex items-center gap-2">
          <span class="text-sm font-medium">Current Slide: {{ carouselState.currentSlide + 1 }} / {{ carouselState.items.length }}</span>
        </div>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="(item, index) in carouselState.items"
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
            ← Scroll Left
          </button>
          <button
            class="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            @click="scroll('right')"
          >
            Scroll Right →
          </button>
        </div>
        <item-carousel
          id="carousel-programmatic"
          ref="carouselRef"
          title="Programmatic Control Demo"
          description="Use buttons above to control the carousel"
          :items="carouselState.items"
          interactive
          @slide-change="handleSlideChange"
          @item-click="handleItemClick"
        />
      </div>
    </Variant>

    <Variant title="Empty State">
      <div class="w-full max-w-2xl">
        <item-carousel
          id="carousel-empty"
          title="No Items"
          description="This carousel has no items to display"
          :items="[]"
        />
      </div>
    </Variant>

    <Variant title="ItemCard - Standalone">
      <div class="flex flex-wrap gap-4 p-4">
        <div class="w-52">
          <item-card
            :item="{ id: '1', name: 'Standalone Card', subtitle: 'With image', image: 'https://picsum.photos/200/150?random=80' }"
            :interactive="false"
          />
        </div>
        <div class="w-52">
          <item-card
            :item="{ id: '2', name: 'Color Background', subtitle: 'No image', color: '#8b5cf6' }"
            :interactive="false"
          />
        </div>
        <div class="w-52">
          <item-card
            :item="{ id: '3', name: 'Interactive Card', subtitle: 'Click me!', image: 'https://picsum.photos/200/150?random=81', color: '#10b981' }"
            :interactive="true"
            @item-click="handleItemClick"
          />
        </div>
        <div class="w-52">
          <item-card
            :item="{ id: '4', name: 'With Actions', subtitle: 'Two actions', color: '#f59e0b', actions: [{ id: 'view', label: 'View' }, { id: 'buy', label: 'Buy' }] }"
            :interactive="false"
            @item-action="handleItemAction"
          />
        </div>
      </div>
    </Variant>
  </Story>
</template>
