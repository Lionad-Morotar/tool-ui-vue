<script setup lang="ts">
import { reactive } from 'vue';
import { InstagramPost } from '@lionad/vtu-components';
import messages from './i18n'
import { useStoryLocale } from '../_shared/use-story-locale'

const captionOnly = useStoryLocale('content.captionOnly', messages)
const longCaption = useStoryLocale('content.longCaption', messages)
const unverifiedAuthor = useStoryLocale('content.unverifiedAuthor', messages)
const interactive = useStoryLocale('content.interactive', messages)

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
  <Story title="InstagramPost/Captions">
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
  </Story>
</template>
