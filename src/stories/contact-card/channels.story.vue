<script setup lang="ts">
import { ContactCard } from '@lionad/vtu-components'
import messages from './i18n'
import { useStoryLocale } from '../_shared/use-story-locale'

const email = useStoryLocale('content.email', messages)
const address = useStoryLocale('content.address', messages)
const whatsapp = useStoryLocale('content.whatsapp', messages)
const wechat = useStoryLocale('content.wechat', messages)
const website = useStoryLocale('content.website', messages)
</script>

<template>
  <Story title="ContactCard/Channels">
    <Variant :title="email">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-md">
        <contact-card
          id="story-email"
          kind="email"
          value="hello@example.com"
        />
      </div>
    </Variant>

    <Variant :title="address">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-md">
        <contact-card
          id="story-address"
          kind="address"
          :value="'上海市浦东新区\n陆家嘴环路 1000 号\n恒生银行大厦 28 楼'"
        />
      </div>
    </Variant>

    <Variant :title="whatsapp">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-md">
        <contact-card
          id="story-whatsapp"
          kind="whatsapp"
          value="8613800000000"
        />
      </div>
    </Variant>

    <Variant :title="wechat">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-md">
        <contact-card
          id="story-wechat"
          kind="wechat"
          value="wxid_hello_world"
        />
      </div>
    </Variant>

    <Variant :title="website">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-md">
        <contact-card
          id="story-website"
          kind="website"
          value="https://lionad.art"
          label="个人博客"
        />
      </div>
    </Variant>
  </Story>
</template>
