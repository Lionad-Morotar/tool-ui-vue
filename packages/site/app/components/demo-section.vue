<script setup lang="ts">
import { OverlayScrollbarsComponent } from 'overlayscrollbars-vue'
import type { OverlayScrollbarsComponentRef } from 'overlayscrollbars-vue'

const { t } = useSiteLocale()

const tabs = computed(() => [
  { id: 'restaurant', label: t('demo.tabRestaurant').value },
  { id: 'travel', label: t('demo.tabTravel').value },
  { id: 'code', label: t('demo.tabCode').value },
  { id: 'contact', label: t('demo.tabContact').value },
  { id: 'article', label: t('demo.tabArticle').value }
])

const activeTab = ref('restaurant')
const osRef = ref<OverlayScrollbarsComponentRef | null>(null)

watch(activeTab, () => {
  nextTick(() => {
    const osInstance = osRef.value?.osInstance()
    osInstance?.elements().viewport.scrollTo({ top: 0 })
  })
})
</script>

<template>
  <section class="mx-auto px-6 py-16 w-full max-w-7xl h-screen">
    <!-- Browser Mockup -->
    <div
      class="flex flex-col bg-card shadow-xl border border-border rounded-xl h-[70vh] h-full min-h-120 lg:min-h-150 overflow-hidden"
    >
      <!-- Browser Chrome -->
      <div class="flex items-center gap-2 bg-muted/50 px-4 py-3 border-border border-b">
        <div class="flex gap-1.5">
          <span class="bg-red-400 rounded-full w-3 h-3" />
          <span class="bg-amber-400 rounded-full w-3 h-3" />
          <span class="bg-emerald-400 rounded-full w-3 h-3" />
        </div>
        <div class="flex-1 ml-4">
          <div class="bg-background mx-auto px-3 py-1 rounded-md max-w-md text-muted-foreground text-xs text-center">
            {{ t('demo.addressBar').value }}
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="bg-muted/30 px-2 pt-1 border-border border-b">
        <div class="flex gap-2">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            class="relative px-4 py-2 font-medium text-sm transition-colors"
            :class="activeTab === tab.id ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'"
            @click="activeTab = tab.id"
          >
            {{ tab.label }}
            <span
              v-if="activeTab === tab.id"
              class="bottom-0 absolute inset-x-0 bg-primary h-0.5"
            />
          </button>
        </div>
      </div>

      <!-- Content -->
      <ClientOnly>
        <OverlayScrollbarsComponent
          ref="osRef"
          :defer="true"
          class="flex-1 grid bg-background p-6"
          :options="{
            scrollbars: {
              autoHide: 'move',
              autoHideDelay: 500,
              autoHideSuspend: true
            },
            overflow: {
              x: 'hidden'
            }
          }"
        >
          <DemoRestaurant v-if="activeTab === 'restaurant'" />
          <DemoTravel v-else-if="activeTab === 'travel'" />
          <DemoCodeReview v-else-if="activeTab === 'code'" />
          <DemoContactCard v-else-if="activeTab === 'contact'" />
          <DemoArticle v-else />
          <div class="h-30 for-padding" />
        </OverlayScrollbarsComponent>
        <template #fallback>
          <div class="flex-1 grid bg-background p-6">
            <DemoRestaurant v-if="activeTab === 'restaurant'" />
            <DemoTravel v-else-if="activeTab === 'travel'" />
            <DemoCodeReview v-else-if="activeTab === 'code'" />
            <DemoContactCard v-else-if="activeTab === 'contact'" />
            <DemoArticle v-else />
          </div>
        </template>
      </ClientOnly>
    </div>
  </section>
</template>

<style>
/* OverlayScrollbars 主题：与设计系统配色对齐 */
.os-scrollbar-handle {
  background-color: color-mix(in srgb, var(--color-border) 60%, transparent);
  border-radius: 999px;
}

.os-scrollbar-handle:hover {
  background-color: var(--color-border);
}

.os-scrollbar-track {
  background: transparent;
}
</style>
