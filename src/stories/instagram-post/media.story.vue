<script setup lang="ts">
import { InstagramPost } from '@lionad/vtu-components';
import messages from './i18n'
import { useStoryLocale } from '../_shared/use-story-locale'

const multipleImages2 = useStoryLocale('content.multipleImages2', messages)
const multipleImages3 = useStoryLocale('content.multipleImages3', messages)
const multipleImages4 = useStoryLocale('content.multipleImages4', messages)
const videoPost = useStoryLocale('content.videoPost', messages)
</script>

<template>
  <Story title="InstagramPost/Media">
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
  </Story>
</template>
