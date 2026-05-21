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
const appearanceSettings = useStoryLocale('content.appearanceSettings', messages)
const withCustomActions = useStoryLocale('content.withCustomActions', messages)
const allControlTypes = useStoryLocale('variant.allControlTypes', messages)
const receiptModeSuccess = useStoryLocale('variant.receiptModeSuccess', messages)
const receiptModeWithErrors = useStoryLocale('variant.receiptModeWithErrors', messages)
const withoutTitle = useStoryLocale('content.withoutTitle', messages)
const withoutSectionHeadings = useStoryLocale('content.withoutSectionHeadings', messages)
const emailNotificationsHeading = useStoryLocale('content.emailNotificationsHeading', messages)
const enableEmailLabel = useStoryLocale('content.enableEmailLabel', messages)
const enableEmailDesc = useStoryLocale('content.enableEmailDesc', messages)
const emailFreqLabel = useStoryLocale('content.emailFreqLabel', messages)
const immediateOpt = useStoryLocale('content.immediateOpt', messages)
const dailyOpt = useStoryLocale('content.dailyOpt', messages)
const weeklyOpt = useStoryLocale('content.weeklyOpt', messages)
const appearanceTitle = useStoryLocale('content.appearanceTitle', messages)
const themeHeading = useStoryLocale('content.themeHeading', messages)
const colorThemeLabel = useStoryLocale('content.colorThemeLabel', messages)
const lightOpt = useStoryLocale('content.lightOpt', messages)
const darkOpt = useStoryLocale('content.darkOpt', messages)
const systemOpt = useStoryLocale('content.systemOpt', messages)
const displayHeading = useStoryLocale('content.displayHeading', messages)
const compactModeLabel = useStoryLocale('variant.compactModeLabel', messages)
const compactModeDesc = useStoryLocale('variant.compactModeDesc', messages)
const enableAnimationsLabel = useStoryLocale('content.enableAnimationsLabel', messages)
const enableAnimationsDesc = useStoryLocale('content.enableAnimationsDesc', messages)
const privacySettingsTitle = useStoryLocale('content.privacySettingsTitle', messages)
const allowAnalyticsLabel = useStoryLocale('content.allowAnalyticsLabel', messages)
const allowAnalyticsDesc = useStoryLocale('content.allowAnalyticsDesc', messages)
const marketingEmailsLabel = useStoryLocale('content.marketingEmailsLabel', messages)
const marketingEmailsDesc = useStoryLocale('content.marketingEmailsDesc', messages)
const resetDefaults = useStoryLocale('content.resetDefaults', messages)
const saveChanges = useStoryLocale('content.saveChanges', messages)
const allTypesTitle = useStoryLocale('variant.allTypesTitle', messages)
const switchesHeading = useStoryLocale('content.switchesHeading', messages)
const featureOneLabel = useStoryLocale('content.featureOneLabel', messages)
const featureOneDesc = useStoryLocale('content.featureOneDesc', messages)
const featureTwoLabel = useStoryLocale('content.featureTwoLabel', messages)
const togglesHeading = useStoryLocale('content.togglesHeading', messages)
const inputsHeading = useStoryLocale('content.inputsHeading', messages)
const nameLabel = useStoryLocale('content.nameLabel', messages)
const namePlaceholder = useStoryLocale('content.namePlaceholder', messages)
const phoneLabel = useStoryLocale('content.phoneLabel', messages)
const phonePlaceholder = useStoryLocale('content.phonePlaceholder', messages)
const emailInputLabel = useStoryLocale('content.emailInputLabel', messages)
const emailInputPlaceholder = useStoryLocale('content.emailInputPlaceholder', messages)
const companyLabel = useStoryLocale('content.companyLabel', messages)
const companyDesc = useStoryLocale('content.companyDesc', messages)
const companyPlaceholder = useStoryLocale('content.companyPlaceholder', messages)
const itemSizeLabel = useStoryLocale('content.itemSizeLabel', messages)
const smallOpt = useStoryLocale('content.smallOpt', messages)
const mediumOpt = useStoryLocale('content.mediumOpt', messages)
const largeOpt = useStoryLocale('content.largeOpt', messages)
const selectHeading = useStoryLocale('content.selectHeading', messages)
const timezoneLabel = useStoryLocale('content.timezoneLabel', messages)
const utcOpt = useStoryLocale('content.utcOpt', messages)
const estOpt = useStoryLocale('content.estOpt', messages)
const cstOpt = useStoryLocale('content.cstOpt', messages)
const mstOpt = useStoryLocale('content.mstOpt', messages)
const pstOpt = useStoryLocale('content.pstOpt', messages)
const gmtOpt = useStoryLocale('content.gmtOpt', messages)
const settingsSavedTitle = useStoryLocale('content.settingsSavedTitle', messages)
const notificationsHeading2 = useStoryLocale('content.notificationsHeading2', messages)
const emailNotifLabel = useStoryLocale('content.emailNotifLabel', messages)
const pushNotifLabel = useStoryLocale('content.pushNotifLabel', messages)
const themeLabel2 = useStoryLocale('content.themeLabel2', messages)
const settingsTitle2 = useStoryLocale('content.settingsTitle2', messages)
const usernameLabel = useStoryLocale('content.usernameLabel', messages)
const emailLabel2 = useStoryLocale('content.emailLabel2', messages)
const usernameTakenError = useStoryLocale('content.usernameTakenError', messages)
const optionOneLabel = useStoryLocale('content.optionOneLabel', messages)
const optionTwoLabel = useStoryLocale('content.optionTwoLabel', messages)
const quickSettingsTitle = useStoryLocale('content.quickSettingsTitle', messages)
const soundFxLabel = useStoryLocale('content.soundFxLabel', messages)
const soundFxDesc = useStoryLocale('content.soundFxDesc', messages)
const autoSaveLabel = useStoryLocale('content.autoSaveLabel', messages)
const autoSaveDesc = useStoryLocale('content.autoSaveDesc', messages)

const multiToggleTitle = useStoryLocale('content.multiToggleTitle', messages)
const productInfoHeading = useStoryLocale('content.productInfoHeading', messages)
const batterySegmentLabel = useStoryLocale('content.batterySegmentLabel', messages)
const batterySegmentDesc = useStoryLocale('content.batterySegmentDesc', messages)
const powerBatteryOpt = useStoryLocale('content.powerBatteryOpt', messages)
const ebikeBatteryOpt = useStoryLocale('content.ebikeBatteryOpt', messages)
const energyStorageOpt = useStoryLocale('content.energyStorageOpt', messages)
const consumerBatteryOpt = useStoryLocale('content.consumerBatteryOpt', messages)
const techRouteLabel = useStoryLocale('content.techRouteLabel', messages)
const techRouteDesc = useStoryLocale('content.techRouteDesc', messages)
const lfpOpt = useStoryLocale('content.lfpOpt', messages)
const ncmOpt = useStoryLocale('content.ncmOpt', messages)
const solidStateOpt = useStoryLocale('content.solidStateOpt', messages)
const sodiumIonOpt = useStoryLocale('content.sodiumIonOpt', messages)
const targetMarketsHeading = useStoryLocale('content.targetMarketsHeading', messages)
const targetCountriesLabel = useStoryLocale('content.targetCountriesLabel', messages)
const targetCountriesDesc = useStoryLocale('content.targetCountriesDesc', messages)
const indonesiaOpt = useStoryLocale('content.indonesiaOpt', messages)
const vietnamOpt = useStoryLocale('content.vietnamOpt', messages)
const thailandOpt = useStoryLocale('content.thailandOpt', messages)
const malaysiaOpt = useStoryLocale('content.malaysiaOpt', messages)
const multiCountryOpt = useStoryLocale('content.multiCountryOpt', messages)
const submitAnalysis = useStoryLocale('content.submitAnalysis', messages)

const batteryPrefs = ref<Record<string, string | string[] | boolean>>({
  batterySegment: [],
  techRoute: 'lfp',
  targetCountries: [],
})

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

// Appearance variant

// Custom actions variant

// All control types variant

// Receipt mode variant

// Error variant

// Without title variant

// Without section headings variant

</script>

<template>
  <Story title="PreferencesPanel/All Variants">
    <Variant :title="notificationSettings">
      <p class="mb-3 text-muted-foreground text-xs">组件说明 / Component description</p>
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
      <p class="mb-3 text-muted-foreground text-xs">组件说明 / Component description</p>
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
      <p class="mb-3 text-muted-foreground text-xs">组件说明 / Component description</p>
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

    <Variant :title="multiToggleTitle">
      <p class="mb-3 text-muted-foreground text-xs">多选 Toggle（multi-toggle）示例 / Multi-select toggle example</p>
      <div class="w-full max-w-md">
        <preferences-panel
          id="preferences-panel-multi-toggle"
          v-model="batteryPrefs"
          :title="multiToggleTitle"
          :sections="[
            {
              heading: productInfoHeading,
              items: [
                {
                  id: 'batterySegment',
                  label: batterySegmentLabel,
                  description: batterySegmentDesc,
                  type: 'toggle',
                  multiple: true,
                  options: [
                    { value: 'power-battery', label: powerBatteryOpt },
                    { value: 'ebike-battery', label: ebikeBatteryOpt },
                    { value: 'energy-storage', label: energyStorageOpt },
                    { value: 'consumer-battery', label: consumerBatteryOpt },
                  ],
                },
                {
                  id: 'techRoute',
                  label: techRouteLabel,
                  description: techRouteDesc,
                  type: 'toggle',
                  options: [
                    { value: 'lfp', label: lfpOpt },
                    { value: 'ncm', label: ncmOpt },
                    { value: 'solid-state', label: solidStateOpt },
                    { value: 'sodium-ion', label: sodiumIonOpt },
                  ],
                  defaultValue: 'lfp',
                },
              ],
            },
            {
              heading: targetMarketsHeading,
              items: [
                {
                  id: 'targetCountries',
                  label: targetCountriesLabel,
                  description: targetCountriesDesc,
                  type: 'toggle',
                  multiple: true,
                  options: [
                    { value: 'indonesia', label: indonesiaOpt },
                    { value: 'vietnam', label: vietnamOpt },
                    { value: 'thailand', label: thailandOpt },
                    { value: 'malaysia-philippines', label: malaysiaOpt },
                    { value: 'multi-country', label: multiCountryOpt },
                  ],
                },
              ],
            },
          ]"
          :actions="[
            { id: 'submit', label: submitAnalysis, variant: 'default' },
          ]"
        />
      </div>
    </Variant>

    <Variant :title="allControlTypes">
      <p class="mb-3 text-muted-foreground text-xs">组件说明 / Component description</p>
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
            {
              heading: inputsHeading,
              items: [
                {
                  id: 'name',
                  label: nameLabel,
                  type: 'input',
                  inputType: 'text',
                  required: true,
                  placeholder: namePlaceholder,
                }
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
    <Variant :title="propsTitle">
      <p class="mb-3 text-muted-foreground text-xs">组件说明 / Component description</p>
      <div class="p-6 w-full max-w-4xl">
        <h2 class="mb-4 font-bold text-2xl">{{ componentPropsTitle }}</h2>
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
