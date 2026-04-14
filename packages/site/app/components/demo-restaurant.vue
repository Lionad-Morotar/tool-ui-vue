<script setup lang="ts">
import { ItemCarousel, PreferencesPanel } from '@lionad/vtu-components'
import { ref } from 'vue'

type Step = 'intro' | 'carousel' | 'panel' | 'done'
const step = ref<Step>('intro')
const selectedRestaurant = ref('星光圣诞餐厅')
const { t, locale } = useSiteLocale()

const isEn = computed(() => locale.value === 'en')

const restaurants = computed(() => [
  {
    id: 'r1',
    name: isEn.value ? 'Starlight Christmas' : '星光圣诞餐厅',
    subtitle: isEn.value ? 'Sanlitun · Creative Western' : '三里屯 · 创意西餐',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=80',
    actions: [{ id: 'select', label: isEn.value ? 'Select' : '选择' }]
  },
  {
    id: 'r2',
    name: isEn.value ? 'Cedar Cabin' : '雪松木屋',
    subtitle: isEn.value ? 'Guomao · Nordic Cuisine' : '国贸 · 北欧料理',
    image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400&q=80',
    actions: [{ id: 'select', label: isEn.value ? 'Select' : '选择' }]
  },
  {
    id: 'r3',
    name: isEn.value ? 'Red Velvet Theatre' : '红丝绒剧场',
    subtitle: isEn.value ? 'Wangfujing · French' : '王府井 · 中餐',
    image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&q=80',
    actions: [{ id: 'select', label: isEn.value ? 'Select' : '选择' }]
  }
])

function handleItemAction(_itemId: string, actionId: string) {
  if (actionId === 'select') {
    selectedRestaurant.value = restaurants.value.find(r => r.id === _itemId)?.name || restaurants.value[0].name
    step.value = 'panel'
  }
}

function handlePanelAction(actionId: string) {
  if (actionId === 'confirm') {
    step.value = 'done'
  } else if (actionId === 'cancel') {
    step.value = 'carousel'
  }
}
</script>

<template>
  <div class="space-y-4 mx-auto w-[70%] max-w-3xl">
    <!-- 用户首轮 -->
    <div class="flex justify-end">
      <div class="bg-primary px-4 py-2 rounded-2xl rounded-tr-sm max-w-[80%] text-primary-foreground text-sm">
        {{ t('demoRestaurant.userIntro') }}
      </div>
    </div>

    <!-- Agent 推荐 -->
    <div class="flex justify-start">
      <div class="space-y-3 w-full max-w-[90%]">
        <p class="text-muted-foreground text-sm">
          {{ t('demoRestaurant.agentIntro') }}
        </p>
        <ItemCarousel
          v-if="step === 'intro' || step === 'carousel'"
          id="demo-restaurant-carousel"
          :title="t('demoRestaurant.carouselTitle').value"
          :items="restaurants"
          @item-action="handleItemAction"
        />
      </div>
    </div>

    <!-- 用户选择 -->
    <div
      v-if="step === 'panel' || step === 'done'"
      class="flex justify-end"
    >
      <div class="bg-primary px-4 py-2 rounded-2xl rounded-tr-sm max-w-[80%] text-primary-foreground text-sm">
        {{ t('demoRestaurant.userSelect', { name: selectedRestaurant }) }}
      </div>
    </div>

    <!-- Agent 确认偏好 -->
    <div
      v-if="step === 'panel' || step === 'done'"
      class="flex justify-start"
    >
      <div class="space-y-3 w-full max-w-[90%]">
        <p class="text-muted-foreground text-sm">
          {{ t('demoRestaurant.agentPanel', { name: selectedRestaurant }) }}
        </p>
        <PreferencesPanel
          v-if="step === 'panel'"
          id="demo-restaurant-panel"
          :title="t('demoRestaurant.panelTitle').value"
          :sections="[
            {
              heading: t('demoRestaurant.sectionAmbience').value,
              items: [
                { id: 'music', type: 'switch', label: t('demoRestaurant.labelMusic').value, defaultChecked: true },
                { id: 'wine', type: 'switch', label: t('demoRestaurant.labelWine').value, defaultChecked: false }
              ]
            },
            {
              heading: t('demoRestaurant.sectionPackage').value,
              items: [
                {
                  id: 'package',
                  type: 'toggle',
                  label: t('demoRestaurant.sectionPackage').value,
                  options: [
                    { value: 'standard', label: t('demoRestaurant.packageStandard').value },
                    { value: 'premium', label: t('demoRestaurant.packagePremium').value }
                  ],
                  defaultValue: 'standard'
                }
              ]
            }
          ]"
          :actions="[
            { id: 'confirm', label: t('demoRestaurant.actionConfirm').value, variant: 'default' },
            { id: 'cancel', label: t('demoRestaurant.actionCancel').value, variant: 'outline' }
          ]"
          @action="handlePanelAction"
        />
        <p
          v-else
          class="text-muted-foreground text-sm"
        >
          {{ t('demoRestaurant.agentDone') }}
        </p>
      </div>
    </div>

    <!-- 用户确认 -->
    <div
      v-if="step === 'done'"
      class="flex justify-end"
    >
      <div class="bg-primary px-4 py-2 rounded-2xl rounded-tr-sm max-w-[80%] text-primary-foreground text-sm">
        {{ t('demoRestaurant.userDone') }}
      </div>
    </div>
  </div>
</template>
