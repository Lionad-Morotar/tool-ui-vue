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
  },
  {
    id: 'r4',
    name: isEn.value ? 'Jade Pavilion' : '翡翠轩',
    subtitle: isEn.value ? 'Chaoyang · Cantonese' : '朝阳 · 粤菜',
    image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=400&q=80',
    actions: [{ id: 'select', label: isEn.value ? 'Select' : '选择' }]
  }
])

function handleItemAction(_itemId: string, actionId: string) {
  if (actionId === 'select') {
    selectedRestaurant.value = restaurants.value.find(r => r.id === _itemId)?.name || restaurants.value[0]?.name || ''
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
    <DemoChatMessage role="user" :content="t('demoRestaurant.userIntro').value" :delay="0" :order="0" />

    <!-- Agent 推荐 -->
    <div class="flex justify-start">
      <div class="w-full max-w-[90%] space-y-3">
        <DemoChatMessage role="agent" :content="t('demoRestaurant.agentIntro').value" :delay="120" :order="1" />
        <DemoDelayedShow :order="2">
          <div v-show="step === 'intro' || step === 'carousel'">
            <ItemCarousel
              id="demo-restaurant-carousel"
              :title="t('demoRestaurant.carouselTitle').value"
              :items="restaurants"
              @item-action="handleItemAction"
            />
          </div>
        </DemoDelayedShow>
      </div>
    </div>

    <!-- 用户选择 -->
    <DemoChatMessage
      v-if="step === 'panel' || step === 'done'"
      role="user"
      :content="t('demoRestaurant.userSelect', { name: selectedRestaurant }).value"
      :delay="0"
      :order="2"
    />

    <!-- Agent 确认偏好 -->
    <div
      v-if="step === 'panel' || step === 'done'"
      class="flex justify-start"
    >
      <div class="w-full max-w-[90%] space-y-3">
        <DemoChatMessage role="agent" :content="t('demoRestaurant.agentPanel', { name: selectedRestaurant }).value" :delay="120" :order="3" />
        <DemoDelayedShow :order="4">
          <div v-show="step === 'panel'">
            <PreferencesPanel
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
          </div>
        </DemoDelayedShow>
        <DemoChatMessage
          v-if="step === 'done'"
          role="agent"
          :content="t('demoRestaurant.agentDone').value"
          :delay="120"
          :order="4"
        />
      </div>
    </div>

    <!-- 用户确认 -->
    <DemoChatMessage
      v-if="step === 'done'"
      role="user"
      :content="t('demoRestaurant.userDone').value"
      :delay="0"
      :order="5"
    />
  </div>
</template>
