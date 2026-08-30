<script setup lang="ts">
import { XPost } from '@lionad/vtu-components';
import messages from './i18n'
import { useStoryLocale } from '../_shared/use-story-locale'

const withImage = useStoryLocale('content.withImage', messages)
const withVideo = useStoryLocale('content.withVideo', messages)
const withLinkPreview = useStoryLocale('content.withLinkPreview', messages)
const quotedPost = useStoryLocale('content.quotedPost', messages)
const quotedPostWithMedia = useStoryLocale('content.quotedPostWithMedia', messages)
</script>

<template>
  <Story title="XPost/Media">
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
  </Story>
</template>
