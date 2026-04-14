<script setup lang="ts">
import { ItemCarousel, PreferencesPanel, zhCNAll } from '@lionad/vtu-components'
import { LocaleProvider } from '@lionad/vtu-core'
import { computed, ref } from 'vue'

type Step = 'intro' | 'carousel' | 'panel' | 'done'
const step = ref<Step>('intro')
const selectedRestaurant = ref('星光圣诞餐厅')

const messages: Record<string, string> = {
  'demoRestaurant.userIntro': '帮我预订一家适合圣诞晚餐的餐厅， preferably 有现场音乐和红酒。',
  'demoRestaurant.agentIntro': '为您推荐以下 3 家符合圣诞氛围的餐厅：',
  'demoRestaurant.carouselTitle': '圣诞餐厅推荐',
  'demoRestaurant.userSelect': '我选择 {name}。',
  'demoRestaurant.agentPanel': '好的，已为您锁定 {name}。请选择您的偏好：',
  'demoRestaurant.panelTitle': '餐厅偏好',
  'demoRestaurant.sectionAmbience': '氛围',
  'demoRestaurant.labelMusic': '现场音乐',
  'demoRestaurant.labelWine': '配酒服务',
  'demoRestaurant.sectionPackage': '套餐',
  'demoRestaurant.packageStandard': '标准套餐',
  'demoRestaurant.packagePremium': '豪华套餐',
  'demoRestaurant.actionConfirm': '确认预订',
  'demoRestaurant.actionCancel': '返回',
  'demoRestaurant.agentDone': '预订已完成！祝您用餐愉快。',
  'demoRestaurant.userDone': '谢谢！',
}

function t(key: string, params?: Record<string, string | number>) {
  let text = messages[key] || key
  if (params) {
    text = text.replace(/\{(\w+)\}/g, (_match, k) => String(params[k] ?? _match))
  }
  return computed(() => text)
}

const restaurants = [
  {
    id: 'r1',
    name: '星光圣诞餐厅',
    subtitle: '三里屯 · 创意西餐',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=80',
    actions: [{ id: 'select', label: '选择' }]
  },
  {
    id: 'r2',
    name: '雪松木屋',
    subtitle: '国贸 · 北欧料理',
    image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400&q=80',
    actions: [{ id: 'select', label: '选择' }]
  },
  {
    id: 'r3',
    name: '红丝绒剧场',
    subtitle: '王府井 · 中餐',
    image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&q=80',
    actions: [{ id: 'select', label: '选择' }]
  }
]

function handleItemAction(_itemId: string, actionId: string) {
  if (actionId === 'select') {
    selectedRestaurant.value = restaurants.find(r => r.id === _itemId)?.name || restaurants[0].name
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
  <LocaleProvider :messages="zhCNAll" locale="zh-CN">
    <main class="flex min-h-screen flex-col items-center justify-center bg-background px-6 py-12 text-foreground">
      <div class="space-y-4 mx-auto w-full max-w-2xl">
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
    </main>
  </LocaleProvider>
</template>
