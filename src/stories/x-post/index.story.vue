<script setup lang="ts">
import { reactive } from 'vue';
import { XPost } from '@lionad/vtu-components';
import { useStoryLocale } from '../_shared/use-story-locale'
import messages from './i18n'

const textOnly = useStoryLocale('content.textOnly', messages)
const withImage = useStoryLocale('content.withImage', messages)
const withVideo = useStoryLocale('content.withVideo', messages)
const withLinkPreview = useStoryLocale('content.withLinkPreview', messages)
const quotedPost = useStoryLocale('content.quotedPost', messages)
const quotedPostWithMedia = useStoryLocale('content.quotedPostWithMedia', messages)
const longText = useStoryLocale('content.longText', messages)
const unverifiedAuthor = useStoryLocale('content.unverifiedAuthor', messages)
const interactive = useStoryLocale('content.interactive', messages)

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

const interactiveState = reactive({
  isLiked: false,
  likes: 189,
});

function handleAction(action: string) {
  if (action === 'like') {
    interactiveState.isLiked = !interactiveState.isLiked;
    interactiveState.likes += interactiveState.isLiked ? 1 : -1;
  }
}
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

    <Variant :title="withImage">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-md">
        <x-post
          :post="{
            id: '2',
            author: {
              name: 'Photo Enthusiast',
              handle: 'photolover',
              avatarUrl: 'https://picsum.photos/48/48?random=101',
            },
            text: 'Captured this beautiful sunset yesterday evening 🌅',
            media: {
              type: 'image',
              url: 'https://picsum.photos/600/400?random=102',
              alt: 'Sunset photo',
              aspectRatio: '16:9',
            },
            createdAt: '2024-01-14T18:00:00Z',
            stats: {
              likes: 456,
              isLiked: true,
            },
          }"
        />
      </div>
    </Variant>

    <Variant :title="withVideo">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-md">
        <x-post
          :post="{
            id: 'video-1',
            author: {
              name: 'Video Creator',
              handle: 'videocreator',
              avatarUrl: 'https://picsum.photos/48/48?random=130',
            },
            text: 'Check out this amazing footage! 🎬',
            media: {
              type: 'video',
              url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
              alt: 'Sample video',
              aspectRatio: '16:9',
            },
            createdAt: '2024-01-14T18:00:00Z',
            stats: {
              likes: 1024,
              isLiked: false,
            },
          }"
        />
      </div>
    </Variant>

    <Variant :title="withLinkPreview">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-md">
        <x-post
          :post="{
            id: '3',
            author: {
              name: 'Tech Blogger',
              handle: 'techblog',
              avatarUrl: 'https://picsum.photos/48/48?random=103',
              verified: true,
            },
            text: 'Great article on building better UI components:',
            linkPreview: {
              url: 'https://example.com/article',
              title: 'Building Better UI Components',
              description: 'A comprehensive guide to creating reusable, accessible UI components for modern web applications.',
              imageUrl: 'https://picsum.photos/400/200?random=104',
              domain: 'example.com',
            },
            createdAt: '2024-01-13T09:00:00Z',
            stats: {
              likes: 234,
              isLiked: false,
              isReposted: true,
            },
          }"
        />
      </div>
    </Variant>

    <Variant :title="quotedPost">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-md">
        <x-post
          :post="{
            id: '4',
            author: {
              name: 'Developer',
              handle: 'devlife',
              avatarUrl: 'https://picsum.photos/48/48?random=105',
            },
            text: 'This is exactly what I was looking for!',
            quotedPost: {
              id: '5',
              author: {
                name: 'Tech News',
                handle: 'technews',
                avatarUrl: 'https://picsum.photos/48/48?random=106',
                verified: true,
              },
              text: 'New framework version released with 50% faster build times 🚀',
              createdAt: '2024-01-12T14:00:00Z',
            },
            createdAt: '2024-01-12T15:30:00Z',
            stats: {
              likes: 89,
            },
          }"
        />
      </div>
    </Variant>

    <Variant :title="quotedPostWithMedia">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-md">
        <x-post
          :post="{
            id: '4b',
            author: {
              name: 'Developer',
              handle: 'devlife',
              avatarUrl: 'https://picsum.photos/48/48?random=105',
            },
            text: 'Look at this!',
            quotedPost: {
              id: '5b',
              author: {
                name: 'Photographer',
                handle: 'photog',
                avatarUrl: 'https://picsum.photos/48/48?random=131',
              },
              text: 'Amazing shot from today',
              createdAt: '2024-01-12T14:00:00Z',
              media: {
                type: 'image',
                url: 'https://picsum.photos/400/300?random=132',
                alt: 'Quoted media',
              },
            },
            createdAt: '2024-01-12T15:30:00Z',
            stats: {
              likes: 156,
            },
          }"
        />
      </div>
    </Variant>

    <Variant :title="longText">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-md">
        <x-post
          :post="{
            id: '6',
            author: {
              name: 'Storyteller',
              handle: 'stories',
              avatarUrl: 'https://picsum.photos/48/48?random=107',
            },
            text: 'Thread 🧵\n\n1/5 Today I want to share my journey into web development. It all started five years ago when I built my first HTML page...',
            createdAt: '2024-01-10T08:00:00Z',
            stats: {
              likes: 1234,
              isLiked: true,
              isBookmarked: true,
            },
          }"
        />
      </div>
    </Variant>

    <Variant :title="unverifiedAuthor">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-md">
        <x-post
          :post="{
            id: '7',
            author: {
              name: 'Regular User',
              handle: 'regularuser',
              avatarUrl: 'https://picsum.photos/48/48?random=108',
              verified: false,
            },
            text: 'Just a regular post from an unverified account.',
            createdAt: '2024-01-09T12:00:00Z',
            stats: {
              likes: 12,
            },
          }"
        />
      </div>
    </Variant>

    <Variant :title="interactive" auto-props-disabled>
      <div class="w-full max-w-md">
        <x-post
          :post="{
            id: 'interactive',
            author: {
              name: 'Interactive Demo',
              handle: 'interactive',
              avatarUrl: 'https://picsum.photos/48/48?random=109',
              verified: true,
            },
            text: 'Click the like button to see it update!',
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
