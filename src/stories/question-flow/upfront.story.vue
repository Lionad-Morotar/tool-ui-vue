<script setup lang="ts">
import { computed } from 'vue';
import { QuestionFlow } from '@lionad/vtu-components';
import messages from './i18n';
import { useStoryLocale, currentLocale } from '../_shared/use-story-locale'
import type { QuestionFlowStepDefinition } from '@lionad/vtu-components';

const upfrontModeMultiStep = useStoryLocale('variant.upfrontModeMultiStep', messages)
const upfrontModeWithDisabledOptions = useStoryLocale('variant.upfrontModeWithDisabledOptions', messages)
const choosePlatformTitle = useStoryLocale('content.choosePlatformTitle', messages)
const platformDesc = useStoryLocale('content.platformDesc', messages)
const webLabel = useStoryLocale('content.webLabel', messages)
const mobileLabel = useStoryLocale('content.mobileLabel', messages)
const desktopLabel = useStoryLocale('content.desktopLabel', messages)
const chooseLanguageTitle = useStoryLocale('content.chooseLanguageTitle', messages)
const languageDesc = useStoryLocale('content.languageDesc', messages)
const tsLabel = useStoryLocale('content.tsLabel', messages)
const jsLabel = useStoryLocale('content.jsLabel', messages)
const pythonLabel = useStoryLocale('content.pythonLabel', messages)
const whatsNeededTitle = useStoryLocale('content.whatsNeededTitle', messages)
const databaseLabel = useStoryLocale('content.baseLabel', messages)
const apiLabel = useStoryLocale('content.apiLabel', messages)
const authLabel = useStoryLocale('content.authLabel', messages)
const selectPlanTitle = useStoryLocale('content.selectPlanTitle', messages)
const someOptionsUnavailable = useStoryLocale('data.someOptionsUnavailable', messages)
const basicLabel = useStoryLocale('content.basicLabel', messages)
const proLabel = useStoryLocale('content.proLabel', messages)
const enterpriseLabel = useStoryLocale('content.enterpriseLabel', messages)

// fields 步骤 variant:选项步骤与表单字段步骤混排
const fieldsFlowVariant = useStoryLocale('variant.upfrontModeWithFields', messages)
const contactTitle = useStoryLocale('content.contactTitle', messages)
const contactDesc = useStoryLocale('content.contactDesc', messages)
const nameLabel = useStoryLocale('content.yourNameLabel', messages)
const phoneLabel = useStoryLocale('content.phoneLabel', messages)
const noteLabel = useStoryLocale('content.noteLabel', messages)
const notePlaceholder = useStoryLocale('content.notePlaceholder', messages)
const attachLabel = useStoryLocale('content.attachmentLabel', messages)

function handleComplete(answers: Record<string, string[]>) {
  alert(`Completed! Answers: ${JSON.stringify(answers)}`);
}

// story 演示通道:无真实服务端,本地直接回填已上传文件
function fakeUpload(file: File) {
  return Promise.resolve({ name: file.name, url: URL.createObjectURL(file), size: file.size })
}

// Full Fields variant:单字段步骤覆盖全部 12 种字段形态,与 PreferencesPanel 全字段预览对齐
const fullFieldsVariant = useStoryLocale({ zh: '全字段步骤 / Full Fields Step', en: 'Full Fields Step' })
const fullFieldsDesc = useStoryLocale({
  zh: '单个字段步骤覆盖全部 12 种字段: input, textarea, select, switch, toggle (single/multi), number, rating, tags, date (date/datetime/range), upload',
  en: 'One step covering all 12 field types: input, textarea, select, switch, toggle (single/multi), number, rating, tags, date (date/datetime/range), upload',
})
const fullFieldsTitle = useStoryLocale({ zh: '服务商入驻信息', en: 'Provider Onboarding' })
const fullFieldsDesc2 = useStoryLocale({ zh: '请如实填写以下信息', en: 'Fill in the details truthfully' })
const prefHeading = useStoryLocale({ zh: '偏好', en: 'Preferences' })
const detailHeading = useStoryLocale({ zh: '详情', en: 'Details' })

const ffName = useStoryLocale({ zh: '服务商名称', en: 'Provider Name' })
const ffNamePlaceholder = useStoryLocale({ zh: '请输入名称', en: 'Enter name' })
const ffIntro = useStoryLocale({ zh: '服务简介', en: 'Introduction' })
const ffIntroPlaceholder = useStoryLocale({ zh: '两三句话介绍你的服务', en: 'A short introduction' })
const ffCategory = useStoryLocale({ zh: '服务分类', en: 'Category' })
const catA = useStoryLocale({ zh: '家政保洁', en: 'Housekeeping' })
const catB = useStoryLocale({ zh: '维修安装', en: 'Repair & Install' })
const catC = useStoryLocale({ zh: '搬运物流', en: 'Moving & Logistics' })
const catD = useStoryLocale({ zh: '美容保健', en: 'Beauty & Wellness' })
const catE = useStoryLocale({ zh: '培训教育', en: 'Training & Education' })
const ffEnabled = useStoryLocale({ zh: '立即上架', en: 'List Immediately' })
const ffScope = useStoryLocale({ zh: '服务范围', en: 'Service Scope' })
const scopeCity = useStoryLocale({ zh: '本市', en: 'City-wide' })
const scopeNation = useStoryLocale({ zh: '全国', en: 'Nationwide' })
const ffStaff = useStoryLocale({ zh: '服务人数', en: 'Staff Size' })
const ffRating = useStoryLocale({ zh: '自评星级', en: 'Self Rating' })
const ffTags = useStoryLocale({ zh: '服务标签', en: 'Service Tags' })
const ffTagsPlaceholder = useStoryLocale({ zh: '回车添加，如：上门服务', en: 'Enter to add, e.g. on-site' })
const ffDate = useStoryLocale({ zh: '开业日期', en: 'Opening Date' })
const ffDatetime = useStoryLocale({ zh: '日常营业时间', en: 'Business Hours' })
const ffRange = useStoryLocale({ zh: '可预约时段', en: 'Bookable Range' })
const ffLicense = useStoryLocale({ zh: '资质附件', en: 'License Attachment' })

// select 契约要求至少 5 项、toggle 至少 2 项,各凑足下限
const fullFieldsSteps = computed(() => [
  {
    id: 'onboarding',
    title: fullFieldsTitle.value,
    description: fullFieldsDesc2.value,
    fields: [
      { id: 'ff-name', type: 'input', label: ffName.value, placeholder: ffNamePlaceholder.value, required: true },
      { id: 'ff-intro', type: 'textarea', label: ffIntro.value, placeholder: ffIntroPlaceholder.value, rows: 2 },
      {
        id: 'ff-category',
        type: 'select',
        label: ffCategory.value,
        selectOptions: [
          { value: 'housekeeping', label: catA.value },
          { value: 'repair', label: catB.value },
          { value: 'moving', label: catC.value },
          { value: 'beauty', label: catD.value },
          { value: 'training', label: catE.value },
        ],
      },
      { id: 'ff-enabled', type: 'switch', label: ffEnabled.value, defaultChecked: false },
    ],
  },
  {
    id: 'onboarding-detail',
    title: prefHeading.value,
    fields: [
      {
        id: 'ff-scope',
        type: 'toggle',
        label: ffScope.value,
        options: [
          { value: 'city', label: scopeCity.value },
          { value: 'nation', label: scopeNation.value },
        ],
        defaultValue: 'city',
      },
      { id: 'ff-staff', type: 'number', label: ffStaff.value, min: 0, max: 100, step: 1, defaultValue: 1 },
      { id: 'ff-rating', type: 'rating', label: ffRating.value, max: 5, defaultValue: 4 },
      {
        id: 'ff-tags',
        type: 'tags',
        label: ffTags.value,
        placeholder: ffTagsPlaceholder.value,
        defaultValue: currentLocale.value === 'zh-CN' ? ['上门服务'] : ['on-site'],
      },
    ],
  },
  {
    id: 'onboarding-files',
    title: detailHeading.value,
    fields: [
      { id: 'ff-date', type: 'date', label: ffDate.value, mode: 'date' },
      { id: 'ff-datetime', type: 'date', label: ffDatetime.value, mode: 'datetime' },
      { id: 'ff-range', type: 'date', label: ffRange.value, mode: 'range' },
      {
        id: 'ff-license',
        type: 'upload',
        label: ffLicense.value,
        accept: ['png', 'jpg', 'pdf'],
        limit: 3,
        multiple: true,
      },
    ],
  },
] as QuestionFlowStepDefinition[])
</script>

<template>
  <Story title="QuestionFlow/Upfront">
    <Variant :title="upfrontModeMultiStep">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-md">
        <question-flow
          id="question-flow-upfront"
          :steps="[
            {
              id: 'platform',
              title: choosePlatformTitle,
              description: platformDesc,
              options: [
                { id: 'web', label: webLabel },
                { id: 'mobile', label: mobileLabel },
                { id: 'desktop', label: desktopLabel },
              ],
            },
            {
              id: 'language',
              title: chooseLanguageTitle,
              description: languageDesc,
              options: [
                { id: 'ts', label: tsLabel },
                { id: 'js', label: jsLabel },
                { id: 'python', label: pythonLabel },
              ],
            },
            {
              id: 'features',
              title: whatsNeededTitle,
              options: [
                { id: 'auth', label: authLabel },
                { id: 'db', label: databaseLabel },
                { id: 'api', label: apiLabel },
              ],
              selectionMode: 'multi',
            },
          ]"
          @complete="handleComplete"
        />
      </div>
    </Variant>

    <Variant :title="upfrontModeWithDisabledOptions">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-md">
        <question-flow
          id="question-flow-disabled"
          :steps="[
            {
              id: 'tier',
              title: selectPlanTitle,
              description: someOptionsUnavailable,
              options: [
                { id: 'basic', label: basicLabel },
                { id: 'pro', label: proLabel, disabled: true },
                { id: 'enterprise', label: enterpriseLabel, disabled: true },
              ],
            },
          ]"
        />
      </div>
    </Variant>

    <Variant :title="fieldsFlowVariant">
      <p class="mb-3 text-xs text-muted-foreground">选项步骤 + 表单字段步骤混排 / Mixed options and form-field steps</p>
      <div class="w-full max-w-md">
        <question-flow
          id="question-flow-fields"
          :upload="fakeUpload"
          :steps="[
            {
              id: 'tier',
              title: selectPlanTitle,
              options: [
                { id: 'basic', label: basicLabel },
                { id: 'pro', label: proLabel },
                { id: 'enterprise', label: enterpriseLabel },
              ],
            },
            {
              id: 'contact',
              title: contactTitle,
              description: contactDesc,
              fields: [
                { id: 'name', type: 'input', label: nameLabel, required: true },
                { id: 'phone', type: 'input', inputType: 'tel', label: phoneLabel },
                { id: 'note', type: 'textarea', label: noteLabel, placeholder: notePlaceholder, rows: 2 },
                {
                  id: 'attach',
                  type: 'upload',
                  label: attachLabel,
                  accept: ['png', 'jpg', 'pdf'],
                  limit: 2,
                },
              ],
            },
          ]"
          @complete="handleComplete"
        />
      </div>
    </Variant>

    <Variant :title="fullFieldsVariant">
      <p class="mb-3 text-xs text-muted-foreground">{{ fullFieldsDesc }}</p>
      <div class="w-full max-w-md">
        <question-flow
          id="question-flow-full-fields"
          :upload="fakeUpload"
          :steps="fullFieldsSteps"
          @complete="handleComplete"
        />
      </div>
    </Variant>
  </Story>
</template>
