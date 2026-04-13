<script setup lang="ts">
import { ref } from 'vue';
import { PreferencesPanel } from '@lionad/vtu-components';
import { useStoryLocale } from './_shared/use-story-locale';

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

const notificationSettings = useStoryLocale({ zh: '通知设置', en: 'Notification Settings' })
const appearanceSettings = useStoryLocale({ zh: '外观设置', en: 'Appearance Settings' })
const withCustomActions = useStoryLocale({ zh: '自定义操作', en: 'With Custom Actions' })
const allControlTypes = useStoryLocale({ zh: '所有控件类型', en: 'All Control Types' })
const receiptModeSuccess = useStoryLocale({ zh: '回执模式 - 成功', en: 'Receipt Mode - Success' })
const receiptModeWithErrors = useStoryLocale({ zh: '回执模式 - 含错误', en: 'Receipt Mode - With Errors' })
const withoutTitle = useStoryLocale({ zh: '无标题', en: 'Without Title' })
const withoutSectionHeadings = useStoryLocale({ zh: '无分区标题', en: 'Without Section Headings' })

// Notification settings variant
const emailNotificationsHeading = useStoryLocale({ zh: '邮件通知', en: 'Email Notifications' })
const enableEmailLabel = useStoryLocale({ zh: '启用邮件通知', en: 'Enable Email Notifications' })
const enableEmailDesc = useStoryLocale({ zh: '通过邮件接收更新', en: 'Receive updates via email' })
const emailFreqLabel = useStoryLocale({ zh: '邮件频率', en: 'Email Frequency' })
const immediateOpt = useStoryLocale({ zh: '即时', en: 'Immediate' })
const dailyOpt = useStoryLocale({ zh: '每日摘要', en: 'Daily Digest' })
const weeklyOpt = useStoryLocale({ zh: '每周汇总', en: 'Weekly Summary' })

// Appearance variant
const appearanceTitle = useStoryLocale({ zh: '外观', en: 'Appearance' })
const themeHeading = useStoryLocale({ zh: '主题', en: 'Theme' })
const colorThemeLabel = useStoryLocale({ zh: '颜色主题', en: 'Color Theme' })
const lightOpt = useStoryLocale({ zh: '浅色', en: 'Light' })
const darkOpt = useStoryLocale({ zh: '深色', en: 'Dark' })
const systemOpt = useStoryLocale({ zh: '跟随系统', en: 'System' })
const displayHeading = useStoryLocale({ zh: '显示', en: 'Display' })
const compactModeLabel = useStoryLocale({ zh: '紧凑模式', en: 'Compact Mode' })
const compactModeDesc = useStoryLocale({ zh: '以更紧凑的间距显示更多内容', en: 'Show more content with less spacing' })
const enableAnimationsLabel = useStoryLocale({ zh: '启用动画', en: 'Enable Animations' })
const enableAnimationsDesc = useStoryLocale({ zh: '显示过渡动画', en: 'Show transition animations' })

// Custom actions variant
const privacySettingsTitle = useStoryLocale({ zh: '隐私设置', en: 'Privacy Settings' })
const allowAnalyticsLabel = useStoryLocale({ zh: '允许分析', en: 'Allow Analytics' })
const allowAnalyticsDesc = useStoryLocale({ zh: '通过分享使用数据帮助我们改进', en: 'Help us improve by sharing usage data' })
const marketingEmailsLabel = useStoryLocale({ zh: '营销邮件', en: 'Marketing Emails' })
const marketingEmailsDesc = useStoryLocale({ zh: '接收产品更新和优惠', en: 'Receive product updates and offers' })
const resetDefaults = useStoryLocale({ zh: '恢复默认', en: 'Reset to Defaults' })
const saveChanges = useStoryLocale({ zh: '保存更改', en: 'Save Changes' })

// All control types variant
const allTypesTitle = useStoryLocale({ zh: '所有偏好类型', en: 'All Preference Types' })
const switchesHeading = useStoryLocale({ zh: '开关', en: 'Switches' })
const featureOneLabel = useStoryLocale({ zh: '功能一', en: 'Feature One' })
const featureOneDesc = useStoryLocale({ zh: '简单的开/关偏好', en: 'A simple on/off preference' })
const featureTwoLabel = useStoryLocale({ zh: '功能二', en: 'Feature Two' })
const togglesHeading = useStoryLocale({ zh: '切换', en: 'Toggles' })
const itemSizeLabel = useStoryLocale({ zh: '项目大小', en: 'Item Size' })
const smallOpt = useStoryLocale({ zh: '小', en: 'Small' })
const mediumOpt = useStoryLocale({ zh: '中', en: 'Medium' })
const largeOpt = useStoryLocale({ zh: '大', en: 'Large' })
const selectHeading = useStoryLocale({ zh: '选择下拉', en: 'Select Dropdowns' })
const timezoneLabel = useStoryLocale({ zh: '时区', en: 'Timezone' })
const utcOpt = useStoryLocale({ zh: '协调世界时', en: 'UTC' })
const estOpt = useStoryLocale({ zh: '东部时间', en: 'Eastern Time' })
const cstOpt = useStoryLocale({ zh: '中部时间', en: 'Central Time' })
const mstOpt = useStoryLocale({ zh: '山地时间', en: 'Mountain Time' })
const pstOpt = useStoryLocale({ zh: '太平洋时间', en: 'Pacific Time' })
const gmtOpt = useStoryLocale({ zh: '格林威治标准时间', en: 'GMT' })

// Receipt mode variant
const settingsSavedTitle = useStoryLocale({ zh: '设置已保存', en: 'Settings Saved' })
const notificationsHeading2 = useStoryLocale({ zh: '通知', en: 'Notifications' })
const emailNotifLabel = useStoryLocale({ zh: '邮件通知', en: 'Email Notifications' })
const pushNotifLabel = useStoryLocale({ zh: '推送通知', en: 'Push Notifications' })
const themeLabel2 = useStoryLocale({ zh: '主题', en: 'Theme' })

// Error variant
const settingsTitle2 = useStoryLocale({ zh: '设置', en: 'Settings' })
const usernameLabel = useStoryLocale({ zh: '用户名', en: 'Username' })
const emailLabel2 = useStoryLocale({ zh: '邮件', en: 'Email' })
const usernameTakenError = useStoryLocale({ zh: '用户名已被占用', en: 'Username is already taken' })

// Without title variant
const optionOneLabel = useStoryLocale({ zh: '选项一', en: 'Option One' })
const optionTwoLabel = useStoryLocale({ zh: '选项二', en: 'Option Two' })

// Without section headings variant
const quickSettingsTitle = useStoryLocale({ zh: '快速设置', en: 'Quick Settings' })
const soundFxLabel = useStoryLocale({ zh: '音效', en: 'Sound Effects' })
const soundFxDesc = useStoryLocale({ zh: '播放通知声音', en: 'Play sounds for notifications' })
const autoSaveLabel = useStoryLocale({ zh: '自动保存', en: 'Auto-save' })
const autoSaveDesc = useStoryLocale({ zh: '自动保存你的工作', en: 'Automatically save your work' })
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

    <Variant :title="appearanceSettings">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-md">
        <preferences-panel
          id="preferences-panel-appearance"
          :title="appearanceTitle"
          :sections="[
            {
              heading: themeHeading,
              items: [
                {
                  id: 'theme',
                  label: colorThemeLabel,
                  type: 'toggle',
                  options: [
                    { value: 'light', label: lightOpt },
                    { value: 'dark', label: darkOpt },
                    { value: 'system', label: systemOpt },
                  ],
                  defaultValue: 'system',
                },
              ],
            },
            {
              heading: displayHeading,
              items: [
                {
                  id: 'compact',
                  label: compactModeLabel,
                  description: compactModeDesc,
                  type: 'switch',
                  defaultChecked: false,
                },
                {
                  id: 'animations',
                  label: enableAnimationsLabel,
                  description: enableAnimationsDesc,
                  type: 'switch',
                  defaultChecked: true,
                },
              ],
            },
          ]"
        />
      </div>
    </Variant>

    <Variant :title="withCustomActions">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-md">
        <preferences-panel
          id="preferences-panel-actions"
          :title="privacySettingsTitle"
          :sections="[
            {
              items: [
                {
                  id: 'tracking',
                  label: allowAnalyticsLabel,
                  description: allowAnalyticsDesc,
                  type: 'switch',
                  defaultChecked: true,
                },
                {
                  id: 'marketing',
                  label: marketingEmailsLabel,
                  description: marketingEmailsDesc,
                  type: 'switch',
                  defaultChecked: false,
                },
              ],
            },
          ]"
          :actions="[
            { id: 'reset', label: resetDefaults },
            { id: 'save', label: saveChanges, variant: 'default' },
          ]"
        />
      </div>
    </Variant>

    <Variant :title="allControlTypes">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-md">
        <preferences-panel
          id="preferences-panel-all-types"
          :title="allTypesTitle"
          :sections="[
            {
              heading: switchesHeading,
              items: [
                {
                  id: 'feature1',
                  label: featureOneLabel,
                  description: featureOneDesc,
                  type: 'switch',
                  defaultChecked: true,
                },
                {
                  id: 'feature2',
                  label: featureTwoLabel,
                  type: 'switch',
                  defaultChecked: false,
                },
              ],
            },
            {
              heading: togglesHeading,
              items: [
                {
                  id: 'size',
                  label: itemSizeLabel,
                  type: 'toggle',
                  options: [
                    { value: 'small', label: smallOpt },
                    { value: 'medium', label: mediumOpt },
                    { value: 'large', label: largeOpt },
                  ],
                  defaultValue: 'medium',
                },
              ],
            },
            {
              heading: selectHeading,
              items: [
                {
                  id: 'timezone',
                  label: timezoneLabel,
                  type: 'select',
                  selectOptions: [
                    { value: 'utc', label: utcOpt },
                    { value: 'est', label: estOpt },
                    { value: 'cst', label: cstOpt },
                    { value: 'mst', label: mstOpt },
                    { value: 'pst', label: pstOpt },
                    { value: 'gmt', label: gmtOpt },
                  ],
                  defaultSelected: 'utc',
                },
              ],
            },
          ]"
        />
      </div>
    </Variant>

    <Variant :title="receiptModeSuccess">
      <div class="w-full max-w-md">
        <preferences-panel
          id="preferences-panel-receipt-success"
          :title="settingsSavedTitle"
          :sections="[
            {
              heading: notificationsHeading2,
              items: [
                {
                  id: 'email',
                  label: emailNotifLabel,
                  type: 'switch',
                  defaultChecked: true,
                },
                {
                  id: 'push',
                  label: pushNotifLabel,
                  type: 'switch',
                  defaultChecked: false,
                },
              ],
            },
            {
              heading: displayHeading,
              items: [
                {
                  id: 'theme',
                  label: themeLabel2,
                  type: 'toggle',
                  options: [
                    { value: 'light', label: lightOpt },
                    { value: 'dark', label: darkOpt },
                  ],
                },
              ],
            },
          ]"
          :choice="{
            email: true,
            push: false,
            theme: 'dark',
          }"
        />
      </div>
    </Variant>

    <Variant :title="receiptModeWithErrors">
      <div class="w-full max-w-md">
        <preferences-panel
          id="preferences-panel-receipt-error"
          :title="settingsTitle2"
          :sections="[
            {
              items: [
                {
                  id: 'username',
                  label: usernameLabel,
                  type: 'switch',
                },
                {
                  id: 'email',
                  label: emailLabel2,
                  type: 'switch',
                },
              ],
            },
          ]"
          :choice="{
            username: false,
            email: true,
          }"
          :error="{
            username: usernameTakenError,
          }"
        />
      </div>
    </Variant>

    <Variant :title="withoutTitle">
      <div class="w-full max-w-md">
        <preferences-panel
          id="preferences-panel-no-title"
          :sections="[
            {
              items: [
                {
                  id: 'option1',
                  label: optionOneLabel,
                  type: 'switch',
                  defaultChecked: true,
                },
                {
                  id: 'option2',
                  label: optionTwoLabel,
                  type: 'switch',
                  defaultChecked: false,
                },
              ],
            },
          ]"
        />
      </div>
    </Variant>

    <Variant :title="withoutSectionHeadings">
      <div class="w-full max-w-md">
        <preferences-panel
          id="preferences-panel-no-headings"
          :title="quickSettingsTitle"
          :sections="[
            {
              items: [
                {
                  id: 'sound',
                  label: soundFxLabel,
                  description: soundFxDesc,
                  type: 'switch',
                  defaultChecked: true,
                },
                {
                  id: 'autoSave',
                  label: autoSaveLabel,
                  description: autoSaveDesc,
                  type: 'switch',
                  defaultChecked: false,
                },
              ],
            },
          ]"
        />
      </div>
    </Variant>
  </Story>
</template>
