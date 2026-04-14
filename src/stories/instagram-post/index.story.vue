<script setup lang="ts">
import { reactive } from 'vue';
import { InstagramPost } from '@lionad/vtu-components';
import messages from './i18n'
import { useStoryLocale } from '../_shared/use-story-locale'

const singleImage = useStoryLocale('content.singleImage', messages)
const multipleImages2 = useStoryLocale('content.multipleImages2', messages)
const multipleImages3 = useStoryLocale('content.multipleImages3', messages)
const multipleImages4 = useStoryLocale('content.multipleImages4', messages)
const videoPost = useStoryLocale('content.videoPost', messages)
const captionOnly = useStoryLocale('content.captionOnly', messages)
const longCaption = useStoryLocale('content.longCaption', messages)
const unverifiedAuthor = useStoryLocale('content.unverifiedAuthor', messages)
const interactive = useStoryLocale('content.interactive', messages)

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

const interactiveState = reactive({
  isLiked: false,
  likes: 2341,
});

function handleAction(action: string) {
  if (action === 'like') {
    interactiveState.isLiked = !interactiveState.isLiked;
    interactiveState.likes += interactiveState.isLiked ? 1 : -1;
  }
}

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

    <Variant :title="multipleImages2">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-md">
        <instagram-post
          :post="{
            id: '2',
            author: {
              name: 'Travel Diary',
              handle: 'traveldiary',
              avatarUrl: 'https://picsum.photos/48/48?random=112',
            },
            text: 'Weekend getaway to the mountains! 🏔️',
            media: [
              { type: 'image', url: 'https://picsum.photos/600/600?random=113', alt: 'Mountain view 1' },
              { type: 'image', url: 'https://picsum.photos/600/600?random=114', alt: 'Mountain view 2' },
            ],
            createdAt: '2024-01-14T12:00:00Z',
            stats: {
              likes: 5678,
              isLiked: false,
            },
          }"
        />
      </div>
    </Variant>

    <Variant :title="multipleImages3">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-md">
        <instagram-post
          :post="{
            id: '3-grid',
            author: {
              name: 'Food Blogger',
              handle: 'foodie',
              avatarUrl: 'https://picsum.photos/48/48?random=140',
            },
            text: 'Delicious meal prep for the week! 🍱',
            media: [
              { type: 'image', url: 'https://picsum.photos/600/600?random=141', alt: 'Food 1' },
              { type: 'image', url: 'https://picsum.photos/600/600?random=142', alt: 'Food 2' },
              { type: 'image', url: 'https://picsum.photos/600/600?random=143', alt: 'Food 3' },
            ],
            createdAt: '2024-01-14T12:00:00Z',
            stats: {
              likes: 3421,
              isLiked: false,
            },
          }"
        />
      </div>
    </Variant>

    <Variant :title="multipleImages4">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-md">
        <instagram-post
          :post="{
            id: '4-grid',
            author: {
              name: 'Event Planner',
              handle: 'events',
              avatarUrl: 'https://picsum.photos/48/48?random=144',
            },
            text: 'Amazing wedding photos! 📸 +5 more',
            media: [
              { type: 'image', url: 'https://picsum.photos/600/600?random=145', alt: 'Wedding 1' },
              { type: 'image', url: 'https://picsum.photos/600/600?random=146', alt: 'Wedding 2' },
              { type: 'image', url: 'https://picsum.photos/600/600?random=147', alt: 'Wedding 3' },
              { type: 'image', url: 'https://picsum.photos/600/600?random=148', alt: 'Wedding 4' },
              { type: 'image', url: 'https://picsum.photos/600/600?random=149', alt: 'Wedding 5' },
              { type: 'image', url: 'https://picsum.photos/600/600?random=150', alt: 'Wedding 6' },
            ],
            createdAt: '2024-01-14T12:00:00Z',
            stats: {
              likes: 8901,
              isLiked: true,
            },
          }"
        />
      </div>
    </Variant>

    <Variant :title="videoPost">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-md">
        <instagram-post
          :post="{
            id: '3',
            author: {
              name: 'Video Creator',
              handle: 'videocreator',
              avatarUrl: 'https://picsum.photos/48/48?random=116',
              verified: true,
            },
            text: 'Behind the scenes of our latest shoot 🎬',
            media: [
              { type: 'video', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', alt: 'Behind the scenes video' },
            ],
            createdAt: '2024-01-13T15:30:00Z',
            stats: {
              likes: 8901,
              isLiked: true,
            },
          }"
        />
      </div>
    </Variant>

    <Variant :title="captionOnly">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-md">
        <instagram-post
          :post="{
            id: '4',
            author: {
              name: 'Thought Leader',
              handle: 'thoughts',
              avatarUrl: 'https://picsum.photos/48/48?random=117',
            },
            text: 'Sometimes the most productive thing you can do is rest. Take care of yourself today. 💙',
            createdAt: '2024-01-12T09:00:00Z',
            stats: {
              likes: 1234,
            },
          }"
        />
      </div>
    </Variant>

    <Variant :title="longCaption">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-md">
        <instagram-post
          :post="{
            id: '5',
            author: {
              name: 'Food Blogger',
              handle: 'foodie',
              avatarUrl: 'https://picsum.photos/48/48?random=118',
            },
            text: 'Recipe thread 🍝\n\nIngredients:\n• 400g pasta\n• 2 tbsp olive oil\n• 3 cloves garlic\n• 1 can tomatoes\n• Fresh basil\n\nInstructions in comments!',
            media: [
              { type: 'image', url: 'https://picsum.photos/600/600?random=119', alt: 'Pasta dish' },
            ],
            createdAt: '2024-01-11T19:00:00Z',
            stats: {
              likes: 4567,
              isLiked: true,
            },
          }"
        />
      </div>
    </Variant>

    <Variant :title="unverifiedAuthor">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-md">
        <instagram-post
          :post="{
            id: '6',
            author: {
              name: 'New User',
              handle: 'newuser',
              avatarUrl: 'https://picsum.photos/48/48?random=151',
              verified: false,
            },
            text: 'Hello Instagram! 👋',
            media: [
              { type: 'image', url: 'https://picsum.photos/600/600?random=152', alt: 'First post' },
            ],
            createdAt: '2024-01-10T10:00:00Z',
            stats: {
              likes: 42,
            },
          }"
        />
      </div>
    </Variant>

    <Variant :title="interactive" auto-props-disabled>
      <div class="w-full max-w-md">
        <instagram-post
          :post="{
            id: 'interactive',
            author: {
              name: 'Interactive Demo',
              handle: 'interactive',
              avatarUrl: 'https://picsum.photos/48/48?random=153',
              verified: true,
            },
            text: 'Click the heart to like this post! ❤️',
            media: [
              { type: 'image', url: 'https://picsum.photos/600/600?random=154', alt: 'Interactive demo' },
            ],
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
