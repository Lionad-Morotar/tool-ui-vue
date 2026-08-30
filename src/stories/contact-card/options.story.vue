<script setup lang="ts">
import { ContactCard } from '@lionad/vtu-components'
import messages from './i18n'
import { useStoryLocale } from '../_shared/use-story-locale'

const copyable = useStoryLocale('content.copyable', messages)
const customLabel = useStoryLocale('content.customLabel', messages)
const other = useStoryLocale('content.other', messages)
</script>

<template>
  <Story title="ContactCard/Options">
    <Variant :title="copyable">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-md">
        <contact-card
          id="story-copyable"
          kind="wechat"
          value="wxid_copy_me"
          :copyable="true"
        />
      </div>
    </Variant>

    <Variant :title="customLabel">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-md">
        <contact-card
          id="story-custom"
          kind="other"
          value="custom info"
          label="Custom Label"
        />
      </div>
    </Variant>

    <Variant :title="other">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-md">
        <contact-card
          id="story-other"
          kind="other"
          value="Skype: my_skype_id"
        />
      </div>
    </Variant>
  </Story>
</template>
