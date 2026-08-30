<script setup lang="ts">
import { XPost } from '@lionad/vtu-components';
import messages from './i18n'
import { useStoryLocale } from '../_shared/use-story-locale'

const textOnly = useStoryLocale('content.textOnly', messages)

const Name = useStoryLocale('content.name', messages)
const Type = useStoryLocale('content.type', messages)
const Default = useStoryLocale('content.default', messages)
const Description = useStoryLocale('content.description', messages)
const Props = useStoryLocale('content.props', messages)
const XPostProps = useStoryLocale('content.xPostProps', messages)

const headerName = Name
const headerType = Type
const headerDefault = Default
const headerDesc = Description
const propsTitle = Props
const componentPropsTitle = XPostProps

const props = [
  { name: 'post', type: 'XPostData', required: true, description: { zh: '帖子数据对象', en: 'The post data object' } },
  { name: 'css', type: '{ root?: string; header?: string; content?: string; actions?: string }', description: { zh: '组件元素的 CSS 类', en: 'CSS classes for component elements' } },
]

</script>

<template>
  <Story title="XPost/All Variants">
    <Variant :title="textOnly">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-md">
        <x-post
          :post="{
            id: '1',
            author: {
              name: 'Example User',
              handle: 'example',
              avatarUrl: 'https://picsum.photos/48/48?random=100',
              verified: true,
            },
            text: 'Just shipped a new feature! Excited to see what everyone thinks. 🚀',
            createdAt: '2024-01-15T10:30:00Z',
            stats: {
              likes: 189,
              isLiked: false,
            },
          }"
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
                <td class="text-muted-foreground">{{ 'default' in prop ? prop.default : '-' }}</td>
                <td>{{ useStoryLocale(prop.description) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </Variant>
  </Story>
</template>
