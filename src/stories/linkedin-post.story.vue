<script setup lang="ts">
import { reactive } from 'vue';
import { LinkedInPost } from '@lionad/components';

/**
 * # LinkedInPost
 *
 * A component for displaying LinkedIn posts with support for text, media,
 * link previews, text truncation with "see more", and professional engagement actions.
 *
 * ## Props
 *
 * | Prop | Type | Default | Description |
 * |------|------|---------|-------------|
 * | post | LinkedInPostData | required | The post data object |
 * | post.id | string | required | Unique identifier for the post |
 * | post.author | LinkedInPostAuthor | required | Author information |
 * | post.author.name | string | required | Display name of the author |
 * | post.author.handle | string | undefined | LinkedIn handle |
 * | post.author.avatarUrl | string | required | URL to the author's avatar |
 * | post.author.headline | string | undefined | Professional headline (e.g., "Engineer at Company") |
 * | post.text | string | undefined | Post content text |
 * | post.media | LinkedInPostMedia | undefined | Media attachment (image or video) |
 * | post.media.type | 'image' \| 'video' | required | Type of media |
 * | post.media.url | string | required | URL to the media file |
 * | post.media.alt | string | required | Alt text for accessibility |
 * | post.linkPreview | LinkedInPostLinkPreview | undefined | Link preview card |
 * | post.linkPreview.url | string | required | URL to link |
 * | post.linkPreview.title | string | undefined | Title of the link |
 * | post.linkPreview.description | string | undefined | Description text |
 * | post.linkPreview.imageUrl | string | undefined | Preview image URL |
 * | post.linkPreview.domain | string | undefined | Domain name (auto-extracted if not provided) |
 * | post.stats | LinkedInPostStats | undefined | Engagement statistics |
 * | post.stats.likes | number | undefined | Number of likes |
 * | post.stats.isLiked | boolean | undefined | Whether the current user liked the post |
 * | post.createdAt | string | undefined | ISO timestamp of post creation |
 * | css | { root?: string } | undefined | CSS classes for component elements |
 *
 * ## Emits
 *
 * | Event | Payload | Description |
 * |-------|---------|-------------|
 * | action | [action: string, post: LinkedInPostData] | Emitted when user interacts with post actions |
 *
 * ## Action Types
 *
 * | Action | Description |
 * |--------|-------------|
 * | like | User clicked the like button |
 * | share | User clicked the share button |
 *
 * ## Text Truncation
 *
 * Posts with text longer than 280 characters are automatically truncated with a
 * "see more" button to expand the full content.
 *
 * ## Security
 *
 * Link previews automatically sanitize URLs to prevent XSS attacks. Only safe
 * http:// and https:// URLs are allowed. JavaScript and data URLs are filtered out.
 *
 * ## Slots
 *
 * This component does not use slots. All content is passed through the `post` prop.
 *
 * ## Usage
 *
 * ```vue
 * <LinkedInPost
 *   :post="{
 *     id: 'li-1',
 *     author: {
 *       name: 'Jane Doe',
 *       avatarUrl: 'https://example.com/avatar.jpg',
 *       headline: 'Software Engineer at TechCorp'
 *     },
 *     text: 'Excited to share our latest product update!',
 *     createdAt: '2024-01-01T00:00:00Z',
 *     stats: { likes: 156, isLiked: false }
 *   }"
 *   @action="handleAction"
 * />
 * ```
 */

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
  <Story title="LinkedInPost/All Variants">
    <Variant title="Text Only">
      <div class="w-full max-w-md">
        <linked-in-post
          :post="{
            id: '1',
            author: {
              name: 'Professional User',
              handle: 'professional',
              avatarUrl: 'https://picsum.photos/48/48?random=120',
              headline: 'Product Manager at TechCorp',
            },
            text: 'Excited to announce that our team just launched a major update! Thanks to everyone who contributed to this milestone.',
            createdAt: '2024-01-15T09:00:00Z',
            stats: {
              likes: 156,
              isLiked: false,
            },
          }"
        />
      </div>
    </Variant>

    <Variant title="With Image">
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

    <Variant title="With Video">
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

    <Variant title="With Link Preview">
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

    <Variant title="Long Post (Truncated)">
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

    <Variant title="Celebration Post">
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

    <Variant title="Without Headline">
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

    <Variant title="Link Preview without Image">
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

    <Variant title="Interactive" auto-props-disabled>
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
