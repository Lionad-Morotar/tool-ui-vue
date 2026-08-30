<script setup lang="ts">
import { reactive } from 'vue';
import { LinkedInPost } from '@lionad/vtu-components';
import messages from './i18n'
import { useStoryLocale } from '../_shared/use-story-locale'

const longPostTruncated = useStoryLocale('content.longPostTruncated', messages)
const celebrationPost = useStoryLocale('content.celebrationPost', messages)
const withoutHeadline = useStoryLocale('content.withoutHeadline', messages)
const interactive = useStoryLocale('content.interactive', messages)

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
  <Story title="LinkedInPost/Variants">
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
  </Story>
</template>
