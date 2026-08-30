<script setup lang="ts">
import { ref } from 'vue';
import { PreferencesPanel } from '@lionad/vtu-components';
import messages from './i18n';
import { useStoryLocale } from '../_shared/use-story-locale'

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
