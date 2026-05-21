<script setup lang="ts">
import { ContactCard } from '@lionad/vtu-components'
import messages from './i18n'
import { useStoryLocale } from '../_shared/use-story-locale'

const phone = useStoryLocale('content.phone', messages)
const email = useStoryLocale('content.email', messages)
const address = useStoryLocale('content.address', messages)
const whatsapp = useStoryLocale('content.whatsapp', messages)
const wechat = useStoryLocale('content.wechat', messages)
const website = useStoryLocale('content.website', messages)
const other = useStoryLocale('content.other', messages)
const copyable = useStoryLocale('content.copyable', messages)
const customLabel = useStoryLocale('content.customLabel', messages)
const propsTitle = useStoryLocale('content.props', messages)

const Name = useStoryLocale('content.name', messages)
const Type = useStoryLocale('content.type', messages)
const Default = useStoryLocale('content.default', messages)
const Description = useStoryLocale('content.description', messages)
const ContactCardProps = useStoryLocale('content.contactCardProps', messages)

const headerName = Name
const headerType = Type
const headerDefault = Default
const headerDesc = Description
const componentPropsTitle = ContactCardProps

const props = [
  { name: 'id', type: 'string', required: true, description: { zh: '组件的唯一标识符', en: 'Unique identifier for the component' } },
  { name: 'role', type: "'information' | 'decision' | 'control' | 'state' | 'composite'", description: { zh: '组件的 ARIA 角色', en: 'ARIA role of the component' } },
  { name: 'kind', type: "'phone' | 'email' | 'address' | 'whatsapp' | 'wechat' | 'website' | 'other'", required: true, description: { zh: '联系方式类型', en: 'Contact type' } },
  { name: 'value', type: 'string', required: true, description: { zh: '联系值（电话号码、邮箱地址等）', en: 'Contact value (phone number, email, etc.)' } },
  { name: 'label', type: 'string', description: { zh: '自定义标签（覆盖 kind 默认标签）', en: 'Custom label (overrides kind default)' } },
  { name: 'href', type: 'string', description: { zh: '自定义链接（覆盖 kind 默认协议链接）', en: 'Custom link (overrides default protocol link)' } },
  { name: 'description', type: 'string', description: { zh: '备注说明（显示在 value 下方）', en: 'Description text shown below the value' } },
  { name: 'copyable', type: 'boolean', description: { zh: '是否可点击复制', en: 'Whether clicking copies the value' } },
  { name: 'css', type: '{ root?: string; icon?: string; label?: string; value?: string }', description: { zh: '组件元素的 CSS 类', en: 'CSS classes for component elements' } },
  { name: 'locale', type: 'string', description: { zh: '本地化字符串', en: 'Locale string' } },
]
</script>

<template>
  <Story title="ContactCard/All Variants">
    <Variant :title="phone">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-md">
        <ContactCard
          id="story-phone"
          kind="phone"
          value="+86 138-0000-0000"
          description="工作日 9:00-18:00"
        />
      </div>
    </Variant>

    <Variant :title="email">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-md">
        <ContactCard
          id="story-email"
          kind="email"
          value="hello@example.com"
        />
      </div>
    </Variant>

    <Variant :title="address">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-md">
        <ContactCard
          id="story-address"
          kind="address"
          :value="'上海市浦东新区\n陆家嘴环路 1000 号\n恒生银行大厦 28 楼'"
        />
      </div>
    </Variant>

    <Variant :title="whatsapp">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-md">
        <ContactCard
          id="story-whatsapp"
          kind="whatsapp"
          value="8613800000000"
        />
      </div>
    </Variant>

    <Variant :title="wechat">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-md">
        <ContactCard
          id="story-wechat"
          kind="wechat"
          value="wxid_hello_world"
        />
      </div>
    </Variant>

    <Variant :title="website">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-md">
        <ContactCard
          id="story-website"
          kind="website"
          value="https://lionad.art"
          label="个人博客"
        />
      </div>
    </Variant>

    <Variant :title="copyable">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-md">
        <ContactCard
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
        <ContactCard
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
        <ContactCard
          id="story-other"
          kind="other"
          value="Skype: my_skype_id"
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
                <td class="text-muted-foreground">{{ (prop as any).default ?? '-' }}</td>
                <td>{{ useStoryLocale(prop.description) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </Variant>
  </Story>
</template>
