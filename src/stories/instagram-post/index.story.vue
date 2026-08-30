<script setup lang="ts">
import { InstagramPost } from '@lionad/vtu-components';
import messages from './i18n'
import { useStoryLocale } from '../_shared/use-story-locale'

const singleImage = useStoryLocale('content.singleImage', messages)

const Name = useStoryLocale('content.name', messages)
const Type = useStoryLocale('content.type', messages)
const Default = useStoryLocale('content.default', messages)
const Description = useStoryLocale('content.description', messages)
const Props = useStoryLocale('content.props', messages)
const InstagramPostProps = useStoryLocale('content.instagramPostProps', messages)

const headerName = Name
const headerType = Type
const headerDefault = Default
const headerDesc = Description
const propsTitle = Props
const componentPropsTitle = InstagramPostProps

const props = [
  { name: 'post', type: 'InstagramPostData', required: true, description: { zh: '帖子数据对象', en: 'The post data object' } },
  { name: 'css', type: '{ root?: string; header?: string; content?: string; actions?: string }', description: { zh: '组件元素的 CSS 类', en: 'CSS classes for component elements' } },
]

</script>

<template>
  <Story title="InstagramPost/All Variants">
    <Variant :title="singleImage">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-md">
        <instagram-post
          :post="{
            id: '1',
            author: {
              name: 'Photo Artist',
              handle: 'photoartist',
              avatarUrl: 'https://picsum.photos/48/48?random=110',
              verified: true,
            },
            text: 'Beautiful sunset captured yesterday evening 🌅 #photography #sunset',
            media: [
              { type: 'image', url: 'https://picsum.photos/600/600?random=111', alt: 'Sunset' },
            ],
            createdAt: '2024-01-15T18:00:00Z',
            stats: {
              likes: 2341,
              isLiked: true,
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
