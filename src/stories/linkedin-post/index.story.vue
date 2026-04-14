<script setup lang="ts">
import { reactive } from 'vue';
import { LinkedInPost } from '@lionad/vtu-components';
import messages from './i18n'
import { useStoryLocale } from '../_shared/use-story-locale'

const textOnly = useStoryLocale('content.textOnly', messages)
const withImage = useStoryLocale('content.withImage', messages)
const withVideo = useStoryLocale('content.withVideo', messages)
const withLinkPreview = useStoryLocale('content.withLinkPreview', messages)
const longPostTruncated = useStoryLocale('content.longPostTruncated', messages)
const celebrationPost = useStoryLocale('content.celebrationPost', messages)
const withoutHeadline = useStoryLocale('content.withoutHeadline', messages)
const linkPreviewWithoutImage = useStoryLocale('content.linkPreviewWithoutImage', messages)
const interactive = useStoryLocale('content.interactive', messages)

const Name = useStoryLocale('content.name', messages)
const Type = useStoryLocale('content.type', messages)
const Default = useStoryLocale('content.default', messages)
const Description = useStoryLocale('content.description', messages)
const Props = useStoryLocale('content.props', messages)
const LinkedInPostProps = useStoryLocale('content.linkedInPostProps', messages)

const headerName = Name
const headerType = Type
const headerDefault = Default
const headerDesc = Description
const propsTitle = Props
const componentPropsTitle = LinkedInPostProps

const props = [
  { name: 'post', type: 'LinkedInPostData', required: true, description: { zh: '帖子数据对象', en: 'The post data object' } },
  { name: 'css', type: '{ root?: string; header?: string; content?: string; actions?: string }', description: { zh: '组件元素的 CSS 类', en: 'CSS classes for component elements' } },
]

const interactiveState = reactive({
  isLiked: false,
  likes: 156,
});

function handleAction(action: string) {
  if (action === 'like') {
    interactiveState.isLiked = !interactiveState.isLiked;
    interactiveState.likes += interactiveState.isLiked ? 1 : -1;
  }
}

</script>

<template>
  <Story title="LinkedInPost/All Variants">
    <Variant :title="textOnly">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-md">
        <linked-in-post
          :post="{
            id: '1',
            author: {
              name: 'Professional User',
              handle: 'professional',
              avatarUrl: 'https://picsum.photos/48/48?random=120',
              headline: 'Product Manager at TechCorp',
            },
            text: 'Excited to announce that our team just launched a major update! Thanks to everyone who contributed to this milestone.',
            createdAt: '2024-01-15T09:00:00Z',
            stats: {
              likes: 156,
              isLiked: false,
            },
          }"
        />
      </div>
    </Variant>

    <Variant :title="withImage">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-md">
        <linked-in-post
          :post="{
            id: '2',
            author: {
              name: 'Marketing Lead',
              handle: 'marketinglead',
              avatarUrl: 'https://picsum.photos/48/48?random=121',
              headline: 'CMO at GrowthCo',
            },
            text: 'Our latest campaign results are in! 📊 Proud of what the team accomplished.',
            media: {
              type: 'image',
              url: 'https://picsum.photos/600/400?random=122',
              alt: 'Campaign results chart',
            },
            createdAt: '2024-01-14T14:00:00Z',
            stats: {
              likes: 234,
              isLiked: true,
            },
          }"
        />
      </div>
    </Variant>

    <Variant :title="withVideo">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-md">
        <linked-in-post
          :post="{
            id: 'video-1',
            author: {
              name: 'Content Creator',
              handle: 'contentcreator',
              avatarUrl: 'https://picsum.photos/48/48?random=160',
              headline: 'Video Producer at MediaCo',
            },
            text: 'Check out our new product demo! 🎥',
            media: {
              type: 'video',
              url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
              alt: 'Product demo video',
            },
            createdAt: '2024-01-14T14:00:00Z',
            stats: {
              likes: 567,
              isLiked: false,
            },
          }"
        />
      </div>
    </Variant>

    <Variant :title="withLinkPreview">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-md">
        <linked-in-post
          :post="{
            id: '3',
            author: {
              name: 'Industry Expert',
              handle: 'expert',
              avatarUrl: 'https://picsum.photos/48/48?random=123',
              headline: 'Senior Consultant',
            },
            text: 'Great insights on the future of remote work. Worth a read!',
            linkPreview: {
              url: 'https://example.com/remote-work',
              title: 'The Future of Remote Work',
              description: 'An in-depth analysis of how remote work is reshaping the modern workplace.',
              imageUrl: 'https://picsum.photos/400/200?random=124',
              domain: 'example.com',
            },
            createdAt: '2024-01-13T11:00:00Z',
            stats: {
              likes: 89,
              isLiked: false,
            },
          }"
        />
      </div>
    </Variant>

    <Variant :title="longPostTruncated">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-md">
        <linked-in-post
          :post="{
            id: '4',
            author: {
              name: 'Career Coach',
              handle: 'careercoach',
              avatarUrl: 'https://picsum.photos/48/48?random=125',
              headline: 'Helping professionals reach their potential',
            },
            text: '5 lessons I learned in my first 5 years as a manager:\n\n1. Listen more than you speak\n2. Delegate effectively\n3. Celebrate small wins\n4. Provide constructive feedback\n5. Lead by example\n\nWhat would you add? I would love to hear your thoughts and experiences in the comments below. Let us start a conversation about leadership and management best practices.',
            createdAt: '2024-01-12T08:00:00Z',
            stats: {
              likes: 567,
              isLiked: true,
            },
          }"
        />
      </div>
    </Variant>

    <Variant :title="celebrationPost">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-md">
        <linked-in-post
          :post="{
            id: '5',
            author: {
              name: 'New Graduate',
              handle: 'newgrad',
              avatarUrl: 'https://picsum.photos/48/48?random=126',
              headline: 'Software Engineer at TechStart',
            },
            text: 'After 6 months of searching, I am thrilled to share that I have accepted a Software Engineer position at TechStart! 🎉\n\nThank you to everyone who supported me during this journey.',
            createdAt: '2024-01-10T16:00:00Z',
            stats: {
              likes: 892,
              isLiked: true,
            },
          }"
        />
      </div>
    </Variant>

    <Variant :title="withoutHeadline">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-md">
        <linked-in-post
          :post="{
            id: '6',
            author: {
              name: 'Simple User',
              handle: 'simpleuser',
              avatarUrl: 'https://picsum.photos/48/48?random=161',
            },
            text: 'A post without a headline - just the basics.',
            createdAt: '2024-01-09T10:00:00Z',
            stats: {
              likes: 23,
            },
          }"
        />
      </div>
    </Variant>

    <Variant :title="linkPreviewWithoutImage">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-md">
        <linked-in-post
          :post="{
            id: '7',
            author: {
              name: 'Article Sharer',
              handle: 'sharer',
              avatarUrl: 'https://picsum.photos/48/48?random=162',
              headline: ' avid reader',
            },
            text: 'Interesting article I found today.',
            linkPreview: {
              url: 'https://example.com/article',
              title: 'Article Title Only',
              domain: 'example.com',
            },
            createdAt: '2024-01-08T14:00:00Z',
            stats: {
              likes: 45,
            },
          }"
        />
      </div>
    </Variant>

    <Variant :title="interactive" auto-props-disabled>
      <div class="w-full max-w-md">
        <linked-in-post
          :post="{
            id: 'interactive',
            author: {
              name: 'Interactive Demo',
              handle: 'interactive',
              avatarUrl: 'https://picsum.photos/48/48?random=163',
              headline: 'Product Manager at DemoCorp',
            },
            text: 'Click the Like button to see it update! Great for testing engagement interactions.',
            createdAt: new Date().toISOString(),
            stats: {
              likes: interactiveState.likes,
              isLiked: interactiveState.isLiked,
            },
          }"
          @action="handleAction"
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
