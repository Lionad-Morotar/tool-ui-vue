<script setup lang="ts">
import { ref, computed } from 'vue';
import { PreferencesPanel } from '@lionad/vtu-components';
import messages from './i18n';
import { useStoryLocale, currentLocale } from '../_shared/use-story-locale'
import type { PreferencesValue } from '@lionad/vtu-components';

const Name = useStoryLocale('content.name', messages)
const Type = useStoryLocale('content.type', messages)
const Default = useStoryLocale('content.default', messages)
const Description = useStoryLocale('content.description', messages)
const Props = useStoryLocale('content.props', messages)
const PreferencesPanelProps = useStoryLocale('content.preferencesPanelProps', messages)

const headerName = Name
const headerType = Type
const headerDefault = Default
const headerDesc = Description
const propsTitle = Props
const componentPropsTitle = PreferencesPanelProps

// Props documentation
const props = [
  { name: 'id', type: 'string', required: true, description: { zh: '组件唯一标识符', en: 'Unique identifier for the component' } },
  { name: 'title', type: 'string', description: { zh: '面板顶部标题', en: 'Title displayed at the top of the panel' } },
  { name: 'sections', type: 'PreferenceSection[]', required: true, description: { zh: '偏好设置分区数组', en: 'Array of preference sections' } },
  { name: 'value', type: 'PreferencesValue', description: { zh: '受控值（用于 v-model）', en: 'Controlled values (for v-model)' } },
  { name: 'actions', type: 'Action[] | ActionsConfig', description: { zh: '操作按钮配置', en: 'Action buttons configuration' } },
  { name: 'css', type: '{ root?: string; section?: string; item?: string; actions?: string }', description: { zh: '组件元素的 CSS 类', en: 'CSS classes for component elements' } },
]

const notificationSettings = useStoryLocale('content.notificationSettings', messages)
const emailNotificationsHeading = useStoryLocale('content.emailNotificationsHeading', messages)
const enableEmailLabel = useStoryLocale('content.enableEmailLabel', messages)
const enableEmailDesc = useStoryLocale('content.enableEmailDesc', messages)
const emailFreqLabel = useStoryLocale('content.emailFreqLabel', messages)
const immediateOpt = useStoryLocale('content.immediateOpt', messages)
const dailyOpt = useStoryLocale('content.dailyOpt', messages)
const weeklyOpt = useStoryLocale('content.weeklyOpt', messages)

const prefs = ref({
  email: true,
  frequency: 'daily',
  theme: 'system',
});

/**
 * ## Props
 *
 * | Prop | Type | Default | Description |
 * |------|------|---------|-------------|
 * | `id` | `string` | required | Unique identifier for the component |
 * | `title` | `string` | - | Title displayed at the top of the panel |
 * | `sections` | `PreferenceSection[]` | required | Array of preference sections |
 * | `value` | `PreferencesValue` | - | Controlled values (for v-model) |
 * | `actions` | `Action[] \| ActionsConfig` | default | Action buttons configuration |
 * | `css` | `{ root?: string }` | - | CSS classes for component elements |
 *
 * ## Emits
 *
 * | Event | Payload | Description |
 * |-------|---------|-------------|
 * | `change` | `PreferencesValue` | Emitted when any preference value changes |
 * | `action` | `(actionId: string, value: PreferencesValue)` | Emitted when an action button is clicked |
 * | `beforeAction` | `(actionId: string, value: PreferencesValue)` | Emitted before action processing |
 *
 * ## Slots
 *
 * None - PreferencesPanel does not use slots.
 *
 * ## Preference Types
 *
 * ### Switch
 * ```ts
 * {
 *   id: "notifications",
 *   type: "switch",
 *   label: "Enable Notifications",
 *   description: "Receive push notifications",
 *   defaultChecked: true
 * }
 * ```
 *
 * ### Toggle
 * ```ts
 * {
 *   id: "theme",
 *   type: "toggle",
 *   label: "Color Theme",
 *   options: [
 *     { value: "light", label: "Light" },
 *     { value: "dark", label: "Dark" },
 *     { value: "system", label: "System" }
 *   ],
 *   defaultValue: "system"
 * }
 * ```
 *
 * ### Select
 * ```ts
 * {
 *   id: "language",
 *   type: "select",
 *   label: "Language",
 *   selectOptions: [
 *     { value: "en", label: "English" },
 *     { value: "es", label: "Spanish" },
 *     // ... at least 5 options required
 *   ],
 *   defaultSelected: "en"
 * }
 * ```
 *
 * ## Receipt Mode
 *
 * When `choice` prop is provided, the component renders in receipt mode showing
 * confirmed preferences with "Saved" status. Use `error` prop to show error states.
 */

// Notification settings variant

// 全字段预览 variant:团建报名场景,覆盖全部 11 种字段类型
const title = useStoryLocale({ zh: '团建活动报名', en: 'Team Outing Signup' })
const basicHeading = useStoryLocale({ zh: '基本信息', en: 'Basic Info' })
const prefHeading = useStoryLocale({ zh: '偏好', en: 'Preferences' })
const detailHeading = useStoryLocale({ zh: '详情', en: 'Details' })

const nameLabel = useStoryLocale({ zh: '姓名', en: 'Name' })
const namePlaceholder = useStoryLocale({ zh: '请输入姓名', en: 'Enter your name' })
const gatherLabel = useStoryLocale({ zh: '集合点', en: 'Meeting Point' })
const gatherA = useStoryLocale({ zh: '人民广场 1 号口', en: 'People Square Gate 1' })
const gatherB = useStoryLocale({ zh: '世纪大道地铁站', en: 'Century Ave Station' })
const gatherC = useStoryLocale({ zh: '中山公园', en: 'Zhongshan Park' })
const gatherD = useStoryLocale({ zh: '五角场', en: 'Wujiaochang' })
const gatherE = useStoryLocale({ zh: '自驾集合', en: 'Self-drive Meetup' })
const noteLabel = useStoryLocale({ zh: '备注', en: 'Note' })
const notePlaceholder = useStoryLocale({ zh: '有什么想对组织者说的吗？', en: 'Anything to tell the organizer?' })

const shuttleLabel = useStoryLocale({ zh: '需要班车接送', en: 'Need Shuttle' })
const mealLabel = useStoryLocale({ zh: '餐饮偏好', en: 'Meal Preference' })
const mealStandard = useStoryLocale({ zh: '标准餐', en: 'Standard' })
const mealVeg = useStoryLocale({ zh: '素食', en: 'Vegetarian' })
const mealHalal = useStoryLocale({ zh: '清真', en: 'Halal' })
const activitiesLabel = useStoryLocale({ zh: '感兴趣的活动（可多选）', en: 'Activities (multi-select)' })
const actFrisbee = useStoryLocale({ zh: '飞盘', en: 'Frisbee' })
const actBoard = useStoryLocale({ zh: '桌游', en: 'Board Games' })
const actHike = useStoryLocale({ zh: '徒步', en: 'Hiking' })
const actBbq = useStoryLocale({ zh: '烧烤', en: 'BBQ' })

const guestsLabel = useStoryLocale({ zh: '随行人数', en: 'Guests' })
const guestsPlaceholder = useStoryLocale({ zh: '0-4 人', en: '0-4 people' })
const ratingLabel = useStoryLocale({ zh: '活动评分', en: 'Rating' })
const tagsLabel = useStoryLocale({ zh: '忌口标签', en: 'Dietary Tags' })
const tagsPlaceholder = useStoryLocale({ zh: '回车添加，如：不吃香菜', en: 'Enter to add, e.g. no cilantro' })
const dateLabel = useStoryLocale({ zh: '活动日期', en: 'Date' })
const datetimeLabel = useStoryLocale({ zh: '出发时间', en: 'Departure Time' })
const rangeLabel = useStoryLocale({ zh: '报名时段', en: 'Signup Range' })
const attachLabel = useStoryLocale({ zh: '健康证明附件', en: 'Health Certificate' })
const saveLabel = useStoryLocale({ zh: '提交报名', en: 'Submit' })
const cancelLabel = useStoryLocale({ zh: '重置', en: 'Reset' })

// 全 11 种字段覆盖:switch/toggle(单/多)/select/input/textarea 六旧型 + rating/number/tags/date(三模式)/upload 六新型
// select 契约要求至少 5 项、toggle 至少 2 项,故集合点与活动各凑足下限
const sections = computed(() => [
  {
    heading: basicHeading.value,
    items: [
      { id: 'name', type: 'input' as const, label: nameLabel.value, placeholder: namePlaceholder.value },
      {
        id: 'gather',
        type: 'select' as const,
        label: gatherLabel.value,
        selectOptions: [
          { value: 'people-square', label: gatherA.value },
          { value: 'century-ave', label: gatherB.value },
          { value: 'zhongshan-park', label: gatherC.value },
          { value: 'wujiaochang', label: gatherD.value },
          { value: 'self-drive', label: gatherE.value },
        ],
        defaultSelected: 'people-square',
      },
      { id: 'note', type: 'textarea' as const, label: noteLabel.value, placeholder: notePlaceholder.value, rows: 2 },
    ],
  },
  {
    heading: prefHeading.value,
    items: [
      { id: 'shuttle', type: 'switch' as const, label: shuttleLabel.value, defaultChecked: true },
      {
        id: 'meal',
        type: 'toggle' as const,
        label: mealLabel.value,
        options: [
          { value: 'standard', label: mealStandard.value },
          { value: 'vegetarian', label: mealVeg.value },
          { value: 'halal', label: mealHalal.value },
        ],
        defaultValue: 'standard',
      },
      {
        id: 'activities',
        type: 'toggle' as const,
        label: activitiesLabel.value,
        multiple: true,
        options: [
          { value: 'frisbee', label: actFrisbee.value },
          { value: 'board-games', label: actBoard.value },
          { value: 'hiking', label: actHike.value },
          { value: 'bbq', label: actBbq.value },
        ],
        defaultValue: ['frisbee'],
      },
    ],
  },
  {
    heading: detailHeading.value,
    items: [
      { id: 'guests', type: 'number' as const, label: guestsLabel.value, placeholder: guestsPlaceholder.value, min: 0, max: 4, step: 1, defaultValue: 0 },
      { id: 'rating', type: 'rating' as const, label: ratingLabel.value, max: 5, defaultValue: 4 },
      { id: 'tags', type: 'tags' as const, label: tagsLabel.value, placeholder: tagsPlaceholder.value, defaultValue: currentLocale.value === 'zh-CN' ? ['不吃香菜'] : ['no cilantro'] },
      { id: 'date', type: 'date' as const, label: dateLabel.value, mode: 'date' as const },
      { id: 'datetime', type: 'date' as const, label: datetimeLabel.value, mode: 'datetime' as const },
      { id: 'range', type: 'date' as const, label: rangeLabel.value, mode: 'range' as const },
      {
        id: 'certificate',
        type: 'upload' as const,
        label: attachLabel.value,
        accept: ['png', 'jpg', 'pdf'],
        limit: 3,
        multiple: true,
      },
    ],
  },
])

// 提交后以 choice 回执展示全部字段的值快照
const choice = ref<PreferencesValue | null>(null)

function handleAction(actionId: string, value: PreferencesValue) {
  if (actionId === 'save') {
    choice.value = value
  }
}

// story 演示通道:无真实服务端,本地直接回填已上传文件
function fakeUpload(file: File) {
  return Promise.resolve({ name: file.name, url: URL.createObjectURL(file), size: file.size })
}

const fullFieldsTitle = useStoryLocale({ zh: '全字段预览 / Full Fields', en: 'Full Fields' })
const fullFieldsDesc = useStoryLocale({
  zh: '覆盖全部 11 种字段类型: switch, toggle (single/multi), select, input, textarea, number, rating, tags, date (date/datetime/range), upload',
  en: 'All 11 field types: switch, toggle (single/multi), select, input, textarea, number, rating, tags, date (date/datetime/range), upload',
})
const submittedHint = useStoryLocale({ zh: '已提交，展示回执 / Submitted, receipt shown', en: 'Submitted, receipt shown' })
const submitHint = useStoryLocale({ zh: '点击提交报名查看回执 / Click submit to see the receipt', en: 'Click submit to see the receipt' })

</script>

<template>
  <Story title="PreferencesPanel/All Variants">
    <Variant :title="notificationSettings">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-md">
        <preferences-panel
          id="preferences-panel-notifications"
          v-model="prefs"
          :title="notificationSettings"
          :sections="[
            {
              heading: emailNotificationsHeading,
              items: [
                {
                  id: 'email',
                  label: enableEmailLabel,
                  description: enableEmailDesc,
                  type: 'switch',
                  defaultChecked: true,
                },
                {
                  id: 'frequency',
                  label: emailFreqLabel,
                  type: 'toggle',
                  options: [
                    { value: 'immediate', label: immediateOpt },
                    { value: 'daily', label: dailyOpt },
                    { value: 'weekly', label: weeklyOpt },
                  ],
                  defaultValue: 'daily',
                },
              ],
            },
          ]"
        />
      </div>
    </Variant>

    <Variant :title="fullFieldsTitle">
      <p class="mb-3 text-xs text-muted-foreground">{{ fullFieldsDesc }}</p>
      <div class="w-full max-w-md">
        <preferences-panel
          id="preferences-panel-full-fields"
          :title="title"
          :sections="sections"
          :upload="fakeUpload"
          :actions="choice ? undefined : [
            { id: 'save', label: saveLabel, variant: 'default' },
            { id: 'cancel', label: cancelLabel, variant: 'outline' },
          ]"
          :choice="choice ?? undefined"
          @action="handleAction"
        />
      </div>
      <p class="mt-3 text-xs text-muted-foreground">
        {{ choice ? submittedHint : submitHint }}
      </p>
    </Variant>

    <Variant :title="propsTitle">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-4xl p-6">
        <h2 class="mb-4 text-2xl font-bold">{{ componentPropsTitle }}</h2>
        <div class="overflow-x-auto">
          <table class="story-table">
            <thead>
              <tr>
                <th>{{ headerName }}</th>
                <th>{{ headerType }}</th>
                <th>{{ headerDefault }}</th>
                <th>{{ headerDesc }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="prop in props" :key="prop.name">
                <td class="font-mono text-emerald-600">{{ prop.name }}</td>
                <td class="font-mono text-blue-600">{{ prop.type }}</td>
                <td class="text-muted-foreground">{{ (prop as any).default || ((prop as any).required ? 'required' : '-') }}</td>
                <td>{{ useStoryLocale(prop.description) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </Variant>
  </Story>
</template>
