<script setup lang="ts">
import { reactive } from 'vue';
import { InstagramPost } from '../components';

/**
 * # InstagramPost
 *
 * A component for displaying Instagram posts with support for single or multiple
 * images/videos, captions, and engagement actions.
 *
 * ## Props
 *
 * | Prop | Type | Default | Description |
 * |------|------|---------|-------------|
 * | post | InstagramPostData | required | The post data object |
 * | post.id | string | required | Unique identifier for the post |
 * | post.author | InstagramPostAuthor | required | Author information |
 * | post.author.name | string | required | Display name of the author |
 * | post.author.handle | string | required | Instagram handle (without @) |
 * | post.author.avatarUrl | string | required | URL to the author's avatar |
 * | post.author.verified | boolean | undefined | Whether the author is verified |
 * | post.text | string | undefined | Caption text |
 * | post.media | InstagramPostMedia[] | undefined | Array of media attachments |
 * | post.media[].type | 'image' \| 'video' | required | Type of media |
 * | post.media[].url | string | required | URL to the media file |
 * | post.media[].alt | string | required | Alt text for accessibility |
 * | post.stats | InstagramPostStats | undefined | Engagement statistics |
 * | post.stats.likes | number | undefined | Number of likes |
 * | post.stats.isLiked | boolean | undefined | Whether the current user liked the post |
 * | post.createdAt | string | undefined | ISO timestamp of post creation |
 * | className | string | undefined | Additional CSS classes |
 *
 * ## Emits
 *
 * | Event | Payload | Description |
 * |-------|---------|-------------|
 * | action | [action: string, post: InstagramPostData] | Emitted when user interacts with post actions |
 *
 * ## Action Types
 *
 * | Action | Description |
 * |--------|-------------|
 * | like | User clicked the like button |
 * | share | User clicked the share button |
 * | open-media | User clicked on media to view it |
 *
 * ## Media Layout
 *
 * - 1 image: Full square aspect ratio
 * - 2 images: Side-by-side split
 * - 3 images: One large left, two stacked right
 * - 4+ images: 2x2 grid with overlay showing remaining count
 *
 * ## Slots
 *
 * This component does not use slots. All content is passed through the `post` prop.
 *
 * ## Usage
 *
 * ```vue
 * <InstagramPost
 *   :post="{
 *     id: 'ig-1',
 *     author: {
 *       name: 'Photo Artist',
 *       handle: 'photoartist',
 *       avatarUrl: 'https://example.com/avatar.jpg',
 *       verified: true
 *     },
 *     text: 'Beautiful sunset! 🌅',
 *     media: [
 *       { type: 'image', url: 'https://example.com/photo.jpg', alt: 'Sunset' }
 *     ],
 *     createdAt: '2024-01-01T00:00:00Z',
 *     stats: { likes: 2341, isLiked: true }
 *   }"
 *   @action="handleAction"
 * />
 * ```
 */

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
    <Variant title="Single Image">
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

    <Variant title="Multiple Images (2)">
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

    <Variant title="Multiple Images (3)">
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

    <Variant title="Multiple Images (4+)">
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

    <Variant title="Video Post">
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

    <Variant title="Caption Only">
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

    <Variant title="Long Caption">
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

    <Variant title="Unverified Author">
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

    <Variant title="Interactive" auto-props-disabled>
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
