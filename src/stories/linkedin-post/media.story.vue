<script setup lang="ts">
import { LinkedInPost } from '@lionad/vtu-components';
import messages from './i18n'
import { useStoryLocale } from '../_shared/use-story-locale'

const withImage = useStoryLocale('content.withImage', messages)
const withVideo = useStoryLocale('content.withVideo', messages)
const withLinkPreview = useStoryLocale('content.withLinkPreview', messages)
const linkPreviewWithoutImage = useStoryLocale('content.linkPreviewWithoutImage', messages)
</script>

<template>
  <Story title="LinkedInPost/Media">
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
  </Story>
</template>
