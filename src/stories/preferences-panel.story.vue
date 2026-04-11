<script setup lang="ts">
import { ref } from 'vue';
import { PreferencesPanel } from '@lionad/vtu-components';
import { useStoryLocale, type StoryLocaleLabels } from './_shared/use-story-locale';

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
</script>

<template>
  <Story title="PreferencesPanel/All Variants">
    <Variant title="Notification Settings">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-md">
        <preferences-panel
          id="preferences-panel-notifications"
          v-model="prefs"
          title="Notification Settings"
          :sections="[
            {
              heading: 'Email Notifications',
              items: [
                {
                  id: 'email',
                  label: 'Enable Email Notifications',
                  description: 'Receive updates via email',
                  type: 'switch',
                  defaultChecked: true,
                },
                {
                  id: 'frequency',
                  label: 'Email Frequency',
                  type: 'toggle',
                  options: [
                    { value: 'immediate', label: 'Immediate' },
                    { value: 'daily', label: 'Daily Digest' },
                    { value: 'weekly', label: 'Weekly Summary' },
                  ],
                  defaultValue: 'daily',
                },
              ],
            },
          ]"
        />
      </div>
    </Variant>

    <Variant title="Appearance Settings">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-md">
        <preferences-panel
          id="preferences-panel-appearance"
          title="Appearance"
          :sections="[
            {
              heading: 'Theme',
              items: [
                {
                  id: 'theme',
                  label: 'Color Theme',
                  type: 'toggle',
                  options: [
                    { value: 'light', label: 'Light' },
                    { value: 'dark', label: 'Dark' },
                    { value: 'system', label: 'System' },
                  ],
                  defaultValue: 'system',
                },
              ],
            },
            {
              heading: 'Display',
              items: [
                {
                  id: 'compact',
                  label: 'Compact Mode',
                  description: 'Show more content with less spacing',
                  type: 'switch',
                  defaultChecked: false,
                },
                {
                  id: 'animations',
                  label: 'Enable Animations',
                  description: 'Show transition animations',
                  type: 'switch',
                  defaultChecked: true,
                },
              ],
            },
          ]"
        />
      </div>
    </Variant>

    <Variant title="With Custom Actions">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-md">
        <preferences-panel
          id="preferences-panel-actions"
          title="Privacy Settings"
          :sections="[
            {
              items: [
                {
                  id: 'tracking',
                  label: 'Allow Analytics',
                  description: 'Help us improve by sharing usage data',
                  type: 'switch',
                  defaultChecked: true,
                },
                {
                  id: 'marketing',
                  label: 'Marketing Emails',
                  description: 'Receive product updates and offers',
                  type: 'switch',
                  defaultChecked: false,
                },
              ],
            },
          ]"
          :actions="[
            { id: 'reset', label: 'Reset to Defaults' },
            { id: 'save', label: 'Save Changes', variant: 'default' },
          ]"
        />
      </div>
    </Variant>

    <Variant title="All Control Types">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-md">
        <preferences-panel
          id="preferences-panel-all-types"
          title="All Preference Types"
          :sections="[
            {
              heading: 'Switches',
              items: [
                {
                  id: 'feature1',
                  label: 'Feature One',
                  description: 'A simple on/off preference',
                  type: 'switch',
                  defaultChecked: true,
                },
                {
                  id: 'feature2',
                  label: 'Feature Two',
                  type: 'switch',
                  defaultChecked: false,
                },
              ],
            },
            {
              heading: 'Toggles',
              items: [
                {
                  id: 'size',
                  label: 'Item Size',
                  type: 'toggle',
                  options: [
                    { value: 'small', label: 'Small' },
                    { value: 'medium', label: 'Medium' },
                    { value: 'large', label: 'Large' },
                  ],
                  defaultValue: 'medium',
                },
              ],
            },
            {
              heading: 'Select Dropdowns',
              items: [
                {
                  id: 'timezone',
                  label: 'Timezone',
                  type: 'select',
                  selectOptions: [
                    { value: 'utc', label: 'UTC' },
                    { value: 'est', label: 'Eastern Time' },
                    { value: 'cst', label: 'Central Time' },
                    { value: 'mst', label: 'Mountain Time' },
                    { value: 'pst', label: 'Pacific Time' },
                    { value: 'gmt', label: 'GMT' },
                  ],
                  defaultSelected: 'utc',
                },
              ],
            },
          ]"
        />
      </div>
    </Variant>

    <Variant title="Receipt Mode - Success">
      <div class="w-full max-w-md">
        <preferences-panel
          id="preferences-panel-receipt-success"
          title="Settings Saved"
          :sections="[
            {
              heading: 'Notifications',
              items: [
                {
                  id: 'email',
                  label: 'Email Notifications',
                  type: 'switch',
                  defaultChecked: true,
                },
                {
                  id: 'push',
                  label: 'Push Notifications',
                  type: 'switch',
                  defaultChecked: false,
                },
              ],
            },
            {
              heading: 'Display',
              items: [
                {
                  id: 'theme',
                  label: 'Theme',
                  type: 'toggle',
                  options: [
                    { value: 'light', label: 'Light' },
                    { value: 'dark', label: 'Dark' },
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

    <Variant title="Receipt Mode - With Errors">
      <div class="w-full max-w-md">
        <preferences-panel
          id="preferences-panel-receipt-error"
          title="Settings"
          :sections="[
            {
              items: [
                {
                  id: 'username',
                  label: 'Username',
                  type: 'switch',
                },
                {
                  id: 'email',
                  label: 'Email',
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
            username: 'Username is already taken',
          }"
        />
      </div>
    </Variant>

    <Variant title="Without Title">
      <div class="w-full max-w-md">
        <preferences-panel
          id="preferences-panel-no-title"
          :sections="[
            {
              items: [
                {
                  id: 'option1',
                  label: 'Option One',
                  type: 'switch',
                  defaultChecked: true,
                },
                {
                  id: 'option2',
                  label: 'Option Two',
                  type: 'switch',
                  defaultChecked: false,
                },
              ],
            },
          ]"
        />
      </div>
    </Variant>

    <Variant title="Without Section Headings">
      <div class="w-full max-w-md">
        <preferences-panel
          id="preferences-panel-no-headings"
          title="Quick Settings"
          :sections="[
            {
              items: [
                {
                  id: 'sound',
                  label: 'Sound Effects',
                  description: 'Play sounds for notifications',
                  type: 'switch',
                  defaultChecked: true,
                },
                {
                  id: 'autoSave',
                  label: 'Auto-save',
                  description: 'Automatically save your work',
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
