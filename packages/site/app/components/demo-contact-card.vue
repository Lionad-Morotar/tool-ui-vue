<script setup lang="ts">
import { ContactCard } from '@lionad/vtu-components'
</script>

<template>
  <div class="space-y-4">
    <!-- phone -->
    <ContactCard
      id="demo-phone"
      kind="phone"
      value="+86 138-0000-0000"
      description="工作日 9:00-18:00"
    />

    <!-- email -->
    <ContactCard
      id="demo-email"
      kind="email"
      value="hello@example.com"
    />

    <!-- address -->
    <ContactCard
      id="demo-address"
      kind="address"
      :value="'上海市浦东新区\n陆家嘴环路 1000 号\n恒生银行大厦 28 楼'"
    />

    <!-- website -->
    <ContactCard
      id="demo-website"
      kind="website"
      value="https://lionad.art"
      label="个人博客"
    />

    <!-- copyable wechat -->
    <ContactCard
      id="demo-wechat"
      kind="wechat"
      value="wxid_hello_world"
      :copyable="true"
    />
  </div>
</template>
