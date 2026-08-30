<script setup lang="ts">
import { PreferencesPanel } from '@lionad/vtu-components';
import messages from './i18n';
import { useStoryLocale } from '../_shared/use-story-locale'

const receiptModeSuccess = useStoryLocale('variant.receiptModeSuccess', messages)
const receiptModeWithErrors = useStoryLocale('variant.receiptModeWithErrors', messages)
const settingsSavedTitle = useStoryLocale('content.settingsSavedTitle', messages)
const notificationsHeading2 = useStoryLocale('content.notificationsHeading2', messages)
const emailNotifLabel = useStoryLocale('content.emailNotifLabel', messages)
const pushNotifLabel = useStoryLocale('content.pushNotifLabel', messages)
const displayHeading = useStoryLocale('content.displayHeading', messages)
const themeLabel2 = useStoryLocale('content.themeLabel2', messages)
const lightOpt = useStoryLocale('content.lightOpt', messages)
const darkOpt = useStoryLocale('content.darkOpt', messages)
const settingsTitle2 = useStoryLocale('content.settingsTitle2', messages)
const usernameLabel = useStoryLocale('content.usernameLabel', messages)
const emailLabel2 = useStoryLocale('content.emailLabel2', messages)
const usernameTakenError = useStoryLocale('content.usernameTakenError', messages)
</script>

<template>
  <Story title="PreferencesPanel/Receipt">
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
  </Story>
</template>
