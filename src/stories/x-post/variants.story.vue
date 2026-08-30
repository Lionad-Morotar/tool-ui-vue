<script setup lang="ts">
import { reactive } from 'vue';
import { XPost } from '@lionad/vtu-components';
import messages from './i18n'
import { useStoryLocale } from '../_shared/use-story-locale'

const longText = useStoryLocale('content.longText', messages)
const unverifiedAuthor = useStoryLocale('content.unverifiedAuthor', messages)
const interactive = useStoryLocale('content.interactive', messages)

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
  <Story title="XPost/Variants">
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
  </Story>
</template>
