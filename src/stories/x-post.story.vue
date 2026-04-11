<script setup lang="ts">
import { reactive } from 'vue';
import { XPost } from '@lionad/vtu-components';
import { useStoryLocale } from './_shared/use-story-locale'

/**
 * # XPost
 *
 * A component for displaying X (formerly Twitter) posts with support for text,
 * media, link previews, quoted posts, and engagement metrics.
 *
 * ## Props
 *
 * | Prop | Type | Default | Description |
 * |------|------|---------|-------------|
 * | post | XPostData | required | The post data object |
 * | post.id | string | required | Unique identifier for the post |
 * | post.author | XPostAuthor | required | Author information |
 * | post.author.name | string | required | Display name of the author |
 * | post.author.handle | string | required | X handle (without @) |
 * | post.author.avatarUrl | string | required | URL to the author's avatar |
 * | post.author.verified | boolean | undefined | Whether the author is verified |
 * | post.text | string | undefined | Post content text |
 * | post.media | XPostMedia | undefined | Media attachment (image or video) |
 * | post.media.type | 'image' \| 'video' | required | Type of media |
 * | post.media.url | string | required | URL to the media file |
 * | post.media.alt | string | required | Alt text for accessibility |
 * | post.media.aspectRatio | '1:1' \| '4:3' \| '16:9' \| '9:16' | undefined | Aspect ratio of media |
 * | post.linkPreview | XPostLinkPreview | undefined | Link preview card |
 * | post.linkPreview.url | string | required | URL to link |
 * | post.linkPreview.title | string | undefined | Title of the link |
 * | post.linkPreview.description | string | undefined | Description text |
 * | post.linkPreview.imageUrl | string | undefined | Preview image URL |
 * | post.linkPreview.domain | string | undefined | Domain name (auto-extracted if not provided) |
 * | post.quotedPost | XPostData | undefined | Nested quoted post |
 * | post.stats | XPostStats | undefined | Engagement statistics |
 * | post.stats.likes | number | undefined | Number of likes |
 * | post.stats.isLiked | boolean | undefined | Whether the current user liked the post |
 * | post.stats.isReposted | boolean | undefined | Whether the current user reposted |
 * | post.stats.isBookmarked | boolean | undefined | Whether the current user bookmarked |
 * | post.createdAt | string | undefined | ISO timestamp of post creation |
 * | css | { root?: string } | undefined | CSS classes for component elements |
 *
 * ## Emits
 *
 * | Event | Payload | Description |
 * |-------|---------|-------------|
 * | action | [action: string, post: XPostData] | Emitted when user interacts with post actions |
 *
 * ## Action Types
 *
 * | Action | Description |
 * |--------|-------------|
 * | like | User clicked the like button |
 * | share | User clicked the share button |
 *
 * ## Slots
 *
 * This component does not use slots. All content is passed through the `post` prop.
 *
 * ## Usage
 *
 * ```vue
 * <XPost
 *   :post="{
 *     id: 'post-1',
 *     author: {
 *       name: 'John Doe',
 *       handle: 'johndoe',
 *       avatarUrl: 'https://example.com/avatar.jpg',
 *       verified: true
 *     },
 *     text: 'Hello world!',
 *     createdAt: '2024-01-01T00:00:00Z',
 *     stats: { likes: 42, isLiked: false }
 *   }"
 *   @action="handleAction"
 * />
 * ```
 */

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
    <Variant title="Text Only">
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

    <Variant title="With Image">
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

    <Variant title="With Video">
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

    <Variant title="With Link Preview">
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

    <Variant title="Quoted Post">
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

    <Variant title="Quoted Post with Media">
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

    <Variant title="Long Text">
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

    <Variant title="Unverified Author">
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

    <Variant title="Interactive" auto-props-disabled>
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
