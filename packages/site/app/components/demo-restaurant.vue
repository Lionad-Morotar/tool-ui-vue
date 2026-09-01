<script setup lang="ts">
import { ItemCarousel, PreferencesPanel, ItemCard } from '@lionad/vtu-components'
import type { PreferencesValue } from '@lionad/vtu-components'
import { computed, ref, nextTick } from 'vue'
import DemoChatMessage from './demo-chat-message.vue'
import DemoDelayedShow from './demo-delayed-show.vue'
import { useSiteLocale } from '../composables/use-site-locale'

type Step = 'intro' | 'carousel' | 'panel' | 'done'
const step = ref<Step>('intro')
const selectedItemId = ref<string | null>(null)
const panelChoice = ref<PreferencesValue | null>(null)
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

const selectedRestaurant = computed(() => {
  return restaurants.value.find(r => r.id === selectedItemId.value)?.name || ''
})

const selectedItem = computed(() => {
  return restaurants.value.find(r => r.id === selectedItemId.value)
})

async function handleItemAction(_itemId: string, actionId: string) {
  if (actionId === 'select') {
    selectedItemId.value = _itemId
    if (document.startViewTransition) {
      await document.startViewTransition(async () => {
        step.value = 'panel'
        await nextTick()
      }).updateCallbackDone
    } else {
      step.value = 'panel'
    }
  }
}

async function handlePanelAction(actionId: string, value: PreferencesValue) {
  if (actionId === 'confirm') {
    panelChoice.value = value
    if (document.startViewTransition) {
      await document.startViewTransition(async () => {
        step.value = 'done'
        await nextTick()
      }).updateCallbackDone
    } else {
      step.value = 'done'
    }
  } else if (actionId === 'cancel') {
    if (document.startViewTransition) {
      await document.startViewTransition(async () => {
        step.value = 'carousel'
        selectedItemId.value = null
        await nextTick()
      }).updateCallbackDone
    } else {
      step.value = 'carousel'
      selectedItemId.value = null
    }
  }
}
</script>

<template>
  <div class="mx-auto w-full max-w-3xl space-y-4">
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
          <!-- 选中的卡片：carousel 原位保留 -->
          <div
            v-if="selectedItem && (step === 'panel' || step === 'done')"
            :style="{ viewTransitionName: `item-card-${selectedItem.id}` }"
            class="inline-flex"
          >
            <ItemCard :item="{ ...selectedItem, actions: [] }" :interactive="false" />
          </div>
        </DemoDelayedShow>
      </div>
    </div>

    <!-- 用户选择 — 点击后 order 重置 -->
    <DemoChatMessage
      v-if="step === 'panel' || step === 'done'"
      role="user"
      :content="t('demoRestaurant.userSelect', { name: selectedRestaurant }).value"
      :delay="0"
      :order="0"
    />

    <!-- Agent 确认偏好 -->
    <div
      v-if="step === 'panel' || step === 'done'"
      class="flex justify-start"
    >
      <div class="w-full max-w-[90%] space-y-3">
        <DemoChatMessage role="agent" :content="t('demoRestaurant.agentPanel', { name: selectedRestaurant }).value" :delay="0" :order="1" />

        <DemoDelayedShow :order="2">
          <PreferencesPanel
            v-if="step === 'panel' || step === 'done'"
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
            :actions="step === 'panel' ? [
              { id: 'confirm', label: t('demoRestaurant.actionConfirm').value, variant: 'default' },
              { id: 'cancel', label: t('demoRestaurant.actionCancel').value, variant: 'outline' }
            ] : undefined"
            :choice="step === 'done' && panelChoice ? panelChoice : undefined"
            @action="handlePanelAction"
          />
        </DemoDelayedShow>
        <DemoChatMessage
          v-if="step === 'done'"
          role="agent"
          :content="t('demoRestaurant.agentDone').value"
          :delay="0"
          :order="0"
        />
      </div>
    </div>

    <!-- 用户确认 — 点击后 order 重置 -->
    <DemoChatMessage
      v-if="step === 'done'"
      role="user"
      :content="t('demoRestaurant.userDone').value"
      :delay="0"
      :order="1"
    />
  </div>
</template>

<style>
/* View Transition 伪元素在 document overlay 层，必须用非 scoped 样式 */
::view-transition-old(item-card-r1),
::view-transition-old(item-card-r2),
::view-transition-old(item-card-r3),
::view-transition-old(item-card-r4) {
  animation-duration: 400ms;
  animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
}

::view-transition-new(item-card-r1),
::view-transition-new(item-card-r2),
::view-transition-new(item-card-r3),
::view-transition-new(item-card-r4) {
  animation-duration: 400ms;
  animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
}

::view-transition-group(item-card-r1),
::view-transition-group(item-card-r2),
::view-transition-group(item-card-r3),
::view-transition-group(item-card-r4) {
  animation-duration: 400ms;
  animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
}
</style>
