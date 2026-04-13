<script setup lang="ts">
import { ItemCarousel, PreferencesPanel } from '@lionad/vtu-components'
import { ref } from 'vue'

type Step = 'intro' | 'carousel' | 'panel' | 'done'
const step = ref<Step>('intro')
const selectedRestaurant = ref('星光圣诞餐厅')

const restaurants = [
  {
    id: 'r1',
    name: '星光圣诞餐厅',
    subtitle: '三里屯 · 创意西餐',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=80',
    actions: [{ id: 'select', label: '选择' }],
  },
  {
    id: 'r2',
    name: '雪松木屋',
    subtitle: '国贸 · 北欧料理',
    image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400&q=80',
    actions: [{ id: 'select', label: '选择' }],
  },
  {
    id: 'r3',
    name: '红丝绒剧场',
    subtitle: '王府井 · 法餐',
    image: 'https://images.unsplash.com/photo-1550966871-3ed3c47e2ce2?w=400&q=80',
    actions: [{ id: 'select', label: '选择' }],
  },
]

function handleItemAction(_itemId: string, actionId: string) {
  if (actionId === 'select') {
    selectedRestaurant.value = restaurants.find(r => r.id === _itemId)?.name || '星光圣诞餐厅'
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
  <div class="mx-auto max-w-2xl space-y-4">
    <!-- 用户首轮 -->
    <div class="flex justify-end">
      <div class="max-w-[80%] rounded-2xl rounded-tr-sm bg-primary px-4 py-2 text-sm text-primary-foreground">
        今晚想找个有氛围的地方吃饭，最好是有点节日气息的。
      </div>
    </div>

    <!-- Agent 推荐 -->
    <div class="flex justify-start">
      <div class="w-full max-w-[90%] space-y-3">
        <p class="text-sm text-muted-foreground">
          今天是平安夜呢，为您找到 3 家氛围感满满的圣诞主题餐厅，挑选一家喜欢的吧：
        </p>
        <ItemCarousel
          v-if="step === 'intro' || step === 'carousel'"
          id="demo-restaurant-carousel"
          title="圣诞餐厅推荐"
          :items="restaurants"
          @item-action="handleItemAction"
        />
      </div>
    </div>

    <!-- 用户选择 -->
    <div v-if="step === 'panel' || step === 'done'" class="flex justify-end">
      <div class="max-w-[80%] rounded-2xl rounded-tr-sm bg-primary px-4 py-2 text-sm text-primary-foreground">
        就选「{{ selectedRestaurant }}」吧，看起来氛围很不错。
      </div>
    </div>

    <!-- Agent 确认偏好 -->
    <div v-if="step === 'panel' || step === 'done'" class="flex justify-start">
      <div class="w-full max-w-[90%] space-y-3">
        <p class="text-sm text-muted-foreground">
          已为您锁定「{{ selectedRestaurant }}」，今晚 19:00 还有位置。请确认偏好，我帮您完成预订：
        </p>
        <PreferencesPanel
          v-if="step === 'panel'"
          id="demo-restaurant-panel"
          title="预订偏好"
          :sections="[
            {
              heading: '氛围与服务',
              items: [
                { id: 'music', type: 'switch', label: '现场爵士乐演奏', defaultChecked: true },
                { id: 'wine', type: 'switch', label: '配餐红酒', defaultChecked: false },
              ],
            },
            {
              heading: '套餐',
              items: [
                {
                  id: 'package',
                  type: 'toggle',
                  label: '套餐类型',
                  options: [
                    { value: 'standard', label: '标准套餐 ¥298/人' },
                    { value: 'premium', label: '尊享套餐 ¥498/人' },
                  ],
                  defaultValue: 'standard',
                },
              ],
            },
          ]"
          :actions="[
            { id: 'confirm', label: '确认预订', variant: 'default' },
            { id: 'cancel', label: '取消', variant: 'outline' },
          ]"
          @action="handlePanelAction"
        />
        <p v-else class="text-sm text-muted-foreground">
          预订成功！已为您预留 2 人位，今晚 19:00 见，祝您圣诞快乐。
        </p>
      </div>
    </div>

    <!-- 用户确认 -->
    <div v-if="step === 'done'" class="flex justify-end">
      <div class="max-w-[80%] rounded-2xl rounded-tr-sm bg-primary px-4 py-2 text-sm text-primary-foreground">
        好的，谢谢！
      </div>
    </div>
  </div>
</template>
