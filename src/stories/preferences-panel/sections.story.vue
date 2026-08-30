<script setup lang="ts">
import { ref } from 'vue';
import { PreferencesPanel } from '@lionad/vtu-components';
import messages from './i18n';
import { useStoryLocale } from '../_shared/use-story-locale'

const appearanceSettings = useStoryLocale('content.appearanceSettings', messages)
const withCustomActions = useStoryLocale('content.withCustomActions', messages)
const allControlTypes = useStoryLocale('variant.allControlTypes', messages)
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
const textareasHeading = useStoryLocale('content.textareasHeading', messages)
const bioLabel = useStoryLocale('content.bioLabel', messages)
const bioPlaceholder = useStoryLocale('content.bioPlaceholder', messages)
const nameLabel = useStoryLocale('content.nameLabel', messages)
const namePlaceholder = useStoryLocale('content.namePlaceholder', messages)
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
</script>

<template>
  <Story title="PreferencesPanel/Sections">
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

    <Variant :title="multiToggleTitle">
      <p class="mb-3 text-xs text-muted-foreground">多选 Toggle（multi-toggle）示例 / Multi-select toggle example</p>
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
            {
              heading: textareasHeading,
              items: [
                {
                  id: 'bio',
                  label: bioLabel,
                  type: 'textarea',
                  placeholder: bioPlaceholder,
                  rows: 4,
                }
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
  </Story>
</template>
