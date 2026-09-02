<script setup lang="ts">
import { PreferencesPanel, Upload } from '@lionad/vtu-components'
import type { PreferencesValue, UploadedFile } from '@lionad/vtu-components'
import { computed, ref } from 'vue'
import DemoChatMessage from './demo-chat-message.vue'
import DemoDelayedShow from './demo-delayed-show.vue'
import { useSiteLocale } from '../composables/use-site-locale'

const { t, locale } = useSiteLocale()
const isEn = computed(() => locale.value === 'en')

type Step = 'editing' | 'done'
const step = ref<Step>('editing')
const panelChoice = ref<PreferencesValue | null>(null)

// 全字段覆盖:switch/toggle(单/多)/select/input/textarea 六旧型 + rating/number/tags/date(三模式) 五新型
const sections = computed(() => [
  {
    heading: t('demoFields.sectionBasic').value,
    items: [
      { id: 'name', type: 'input' as const, label: t('demoFields.labelName').value, placeholder: t('demoFields.placeholderName').value },
      {
        id: 'gather',
        type: 'select' as const,
        label: t('demoFields.labelGather').value,
        selectOptions: [
          { value: 'people-square', label: t('demoFields.gatherA').value },
          { value: 'century-ave', label: t('demoFields.gatherB').value },
          { value: 'zhongshan-park', label: t('demoFields.gatherC').value },
          { value: 'wujiaochang', label: t('demoFields.gatherD').value },
          { value: 'self-drive', label: t('demoFields.gatherE').value }
        ],
        defaultSelected: 'people-square'
      },
      { id: 'note', type: 'textarea' as const, label: t('demoFields.labelNote').value, placeholder: t('demoFields.placeholderNote').value, rows: 2 }
    ]
  },
  {
    heading: t('demoFields.sectionPref').value,
    items: [
      { id: 'shuttle', type: 'switch' as const, label: t('demoFields.labelShuttle').value, defaultChecked: true },
      {
        id: 'meal',
        type: 'toggle' as const,
        label: t('demoFields.labelMeal').value,
        options: [
          { value: 'standard', label: t('demoFields.mealStandard').value },
          { value: 'vegetarian', label: t('demoFields.mealVeg').value },
          { value: 'halal', label: t('demoFields.mealHalal').value }
        ],
        defaultValue: 'standard'
      },
      {
        id: 'activities',
        type: 'toggle' as const,
        label: t('demoFields.labelActivities').value,
        multiple: true,
        options: [
          { value: 'frisbee', label: t('demoFields.actFrisbee').value },
          { value: 'board-games', label: t('demoFields.actBoard').value },
          { value: 'hiking', label: t('demoFields.actHike').value },
          { value: 'bbq', label: t('demoFields.actBbq').value }
        ],
        defaultValue: ['frisbee']
      }
    ]
  },
  {
    heading: t('demoFields.sectionDetail').value,
    items: [
      { id: 'guests', type: 'number' as const, label: t('demoFields.labelGuests').value, min: 0, max: 4, step: 1, defaultValue: 0 },
      { id: 'rating', type: 'rating' as const, label: t('demoFields.labelRating').value, max: 5, defaultValue: 4 },
      { id: 'tags', type: 'tags' as const, label: t('demoFields.labelTags').value, placeholder: t('demoFields.placeholderTags').value, defaultValue: isEn.value ? ['no cilantro'] : ['不吃香菜'] },
      { id: 'date', type: 'date' as const, label: t('demoFields.labelDate').value, mode: 'date' as const },
      { id: 'datetime', type: 'date' as const, label: t('demoFields.labelDatetime').value, mode: 'datetime' as const },
      { id: 'range', type: 'date' as const, label: t('demoFields.labelRange').value, mode: 'range' as const }
    ]
  }
])

// save/cancel 是面板内建语义:save 随脏态自动解禁,cancel 触发内部重置
function handlePanelAction(actionId: string, value: PreferencesValue) {
  if (actionId === 'save') {
    panelChoice.value = value
    step.value = 'done'
  }
}

// 演示用传输:延迟模拟网络;文件名带 fail 固定拒绝,便于点出错误与重试路径
async function mockUpload(file: File): Promise<UploadedFile> {
  await new Promise((resolve) => setTimeout(resolve, 900))
  if (/fail/i.test(file.name)) {
    throw new Error(t('demoFields.uploadFail').value)
  }
  return { name: file.name, size: file.size, url: URL.createObjectURL(file) }
}
</script>

<template>
  <div class="mx-auto w-full max-w-3xl space-y-4" data-testid="demo-fields">
    <!-- Agent 引出全字段面板 -->
    <div class="flex justify-start">
      <div class="w-full max-w-[90%] space-y-3">
        <DemoChatMessage role="agent" :content="t('demoFields.agentIntro').value" :delay="0" :order="0" />

        <!-- 全字段表单:编辑态 → 提交后回执态 -->
        <DemoDelayedShow :order="1">
          <div data-testid="demo-fields-panel">
            <PreferencesPanel
              id="demo-fields-panel"
              :title="t('demoFields.panelTitle').value"
              :sections="sections"
              :actions="step === 'editing' ? [
                { id: 'save', label: t('demoFields.actionSave').value, variant: 'default' },
                { id: 'cancel', label: t('demoFields.actionCancel').value, variant: 'outline' }
              ] : undefined"
              :choice="step === 'done' && panelChoice ? panelChoice : undefined"
              @action="handlePanelAction"
            />
          </div>
        </DemoDelayedShow>

        <DemoChatMessage
          v-if="step === 'done'"
          role="agent"
          :content="t('demoFields.agentDone').value"
          :delay="0"
          :order="2"
        />
      </div>
    </div>

    <!-- Agent 引出上传组件双形态 -->
    <div class="flex justify-start">
      <div class="w-full max-w-[90%] space-y-3">
        <DemoChatMessage role="agent" :content="t('demoFields.agentUpload').value" :delay="200" :order="3" />

        <DemoDelayedShow :order="4">
          <div class="grid gap-4 sm:grid-cols-2" data-testid="demo-fields-upload">
            <!-- 文本形态 -->
            <Upload
              id="demo-fields-upload-text"
              :title="t('demoFields.uploadTextTitle').value"
              :upload="mockUpload"
              :accept="['.pdf', '.doc', '.docx', '.png', '.jpg']"
              :max-size="5"
              :limit="3"
              multiple
            />
            <!-- 卡片形态 -->
            <Upload
              id="demo-fields-upload-card"
              :title="t('demoFields.uploadCardTitle').value"
              variant="picture-card"
              :upload="mockUpload"
              :accept="['.png', '.jpg', '.jpeg', '.webp']"
              :max-size="5"
              :limit="4"
              multiple
            />
          </div>
        </DemoDelayedShow>
      </div>
    </div>
  </div>
</template>
