<script setup lang="ts">
const { t } = useSiteLocale()

const tabs = computed(() => [
  { id: 'restaurant', label: t('demo.tabRestaurant').value },
  { id: 'travel', label: t('demo.tabTravel').value },
  { id: 'code', label: t('demo.tabCode').value }
])

const activeTab = ref('restaurant')
</script>

<template>
  <section class="mx-auto -mt-58 px-6 py-16 max-w-7xl">
    <!-- Browser Mockup -->
    <div class="bg-card shadow-xl border border-border rounded-xl overflow-hidden">
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
      <div class="bg-muted/30 px-4 pt-3 border-border border-b">
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
      <div class="bg-background p-6 min-h-[420px]">
        <DemoRestaurant v-if="activeTab === 'restaurant'" />
        <DemoTravel v-else-if="activeTab === 'travel'" />
        <DemoCodeReview v-else />
      </div>
    </div>
  </section>
</template>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.2s ease;
}
.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
