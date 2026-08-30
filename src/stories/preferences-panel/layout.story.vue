<script setup lang="ts">
import { PreferencesPanel } from '@lionad/vtu-components';
import messages from './i18n';
import { useStoryLocale } from '../_shared/use-story-locale'

const withoutTitle = useStoryLocale('content.withoutTitle', messages)
const withoutSectionHeadings = useStoryLocale('content.withoutSectionHeadings', messages)
const optionOneLabel = useStoryLocale('content.optionOneLabel', messages)
const optionTwoLabel = useStoryLocale('content.optionTwoLabel', messages)
const quickSettingsTitle = useStoryLocale('content.quickSettingsTitle', messages)
const soundFxLabel = useStoryLocale('content.soundFxLabel', messages)
const soundFxDesc = useStoryLocale('content.soundFxDesc', messages)
const autoSaveLabel = useStoryLocale('content.autoSaveLabel', messages)
const autoSaveDesc = useStoryLocale('content.autoSaveDesc', messages)
</script>

<template>
  <Story title="PreferencesPanel/Layout">
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
