<script setup lang="ts">
import { OverlayScrollbarsComponent } from 'overlayscrollbars-vue'
import type { OverlayScrollbarsComponentRef } from 'overlayscrollbars-vue'

const { t } = useSiteLocale()

const tabs = computed(() => [
  { id: 'restaurant', label: t('demo.tabRestaurant').value },
  { id: 'travel', label: t('demo.tabTravel').value },
  { id: 'code', label: t('demo.tabCode').value }
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
  <section class="mx-auto h-screen w-full max-w-7xl px-6 py-16">
    <!-- Browser Mockup -->
    <div
      class="flex h-[70vh] h-full min-h-120 flex-col overflow-hidden rounded-xl border border-border bg-card shadow-xl lg:min-h-150"
    >
      <!-- Browser Chrome -->
      <div class="flex items-center gap-2 border-b border-border bg-muted/50 px-4 py-3">
        <div class="flex gap-1.5">
          <span class="h-3 w-3 rounded-full bg-red-400" />
          <span class="h-3 w-3 rounded-full bg-amber-400" />
          <span class="h-3 w-3 rounded-full bg-emerald-400" />
        </div>
        <div class="ml-4 flex-1">
          <div class="mx-auto max-w-md rounded-md bg-background px-3 py-1 text-center text-xs text-muted-foreground">
            {{ t('demo.addressBar').value }}
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="border-b border-border bg-muted/30 px-2 pt-1">
        <div class="flex gap-2 overflow-x-auto whitespace-nowrap [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            class="relative px-4 py-2 text-sm font-medium transition-colors"
            :class="activeTab === tab.id ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'"
            @click="activeTab = tab.id"
          >
            {{ tab.label }}
            <span
              v-if="activeTab === tab.id"
              class="absolute inset-x-0 bottom-0 h-0.5 bg-primary"
            />
          </button>
        </div>
      </div>

      <!-- Content -->
      <ClientOnly>
        <OverlayScrollbarsComponent
          ref="osRef"
          :defer="true"
          class="grid flex-1 bg-background p-6"
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
          <DemoCodeReview v-else />
          <div class="for-padding h-30" />
        </OverlayScrollbarsComponent>
        <template #fallback>
          <div class="grid flex-1 bg-background p-6">
            <DemoRestaurant v-if="activeTab === 'restaurant'" />
            <DemoTravel v-else-if="activeTab === 'travel'" />
            <DemoCodeReview v-else />
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
