<script setup lang="ts">
import { cn } from '@lionad/vtu-core';
import { reactive, toRef } from 'vue';
import { useLinkedinPost } from '../states';
import type { LinkedInPostProps, LinkedInPostData } from '../schema';

defineOptions({ name: 'CmptLinkedinPost', inheritAttrs: false })

const props = withDefaults(defineProps<LinkedInPostProps & { css?: { root?: string } }>(), {
  css: () => ({ root: '' })
})

const emit = defineEmits<{
  action: [action: string, post: LinkedInPostData];
}>();

const state = reactive(useLinkedinPost({ ...props, emit }));
const isExpanded = toRef(state, 'isExpanded');
</script>

<script lang="ts">
</script>

<template>
  <div
    v-bind="$attrs"
    :class="cn('flex max-w-xl flex-col gap-3', css?.root)"
    :data-tool-ui-id="post.id"
    data-slot="linkedin-post"
  >
    <article class="flex flex-col gap-3 rounded-lg border border-border bg-card p-3 shadow-sm">
      <!-- Header -->
      <header class="flex items-start gap-3">
        <img
          :src="post.author.avatarUrl"
          :alt="`${post.author.name} avatar`"
          width="48"
          height="48"
          class="size-12 rounded-full object-cover"
        />
        <div class="flex min-w-0 flex-1 flex-col leading-tight">
          <span class="text-sm font-semibold">{{ post.author.name }}</span>
          <span v-if="post.author.headline" class="line-clamp-1 text-xs text-muted-foreground">
            {{ post.author.headline }}
          </span>
          <div v-if="post.createdAt" class="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
            <span>{{ state.formatRelativeTime(post.createdAt) }}</span>
            <span>·</span>
            <span>Edited</span>
          </div>
        </div>
        <!-- LinkedIn Logo -->
        <svg
          viewBox="0 0 72 72"
          class="size-5 text-[#0077b5]"
          role="img"
          aria-label="LinkedIn logo"
        >
          <g fill="none" fill-rule="evenodd">
            <path
              d="M8 72h56c4.42 0 8-3.58 8-8V8c0-4.42-3.58-8-8-8H8C3.58 0 0 3.58 0 8v56c0 4.42 3.58 8 8 8z"
              fill="currentColor"
            />
            <path
              d="M62 62H51.3V43.8c0-4.98-1.9-7.78-5.83-7.78-4.3 0-6.54 2.9-6.54 7.78V62H28.63V27.33h10.3v4.67c0 0 3.1-5.73 10.45-5.73 7.36 0 12.62 4.5 12.62 13.8V62zM16.35 22.8c-3.5 0-6.35-2.86-6.35-6.4 0-3.52 2.85-6.4 6.35-6.4 3.5 0 6.35 2.88 6.35 6.4 0 3.54-2.85 6.4-6.35 6.4zM11.03 62h10.74V27.33H11.03V62z"
              fill="#FFF"
            />
          </g>
        </svg>
      </header>

      <!-- Body -->
      <div v-if="post.text" class="text-sm leading-relaxed text-pretty whitespace-pre-wrap">
        {{ state.displayText }}
        <template v-if="state.shouldTruncate && !isExpanded">
          ...
          <button
            class="ml-1 font-medium text-muted-foreground hover:text-foreground hover:underline"
            @click="isExpanded = true"
          >
            see more
          </button>
        </template>
      </div>

      <!-- Media -->
      <div v-if="post.media" class="overflow-hidden rounded-lg">
        <img
          v-if="post.media.type === 'image'"
          :src="post.media.url"
          :alt="post.media.alt"
          class="w-full object-cover"
          style="aspect-ratio: 16/9;"
          loading="lazy"
        />
        <video
          v-else
          :src="post.media.url"
          controls
          playsinline
          class="w-full object-contain"
          style="aspect-ratio: 16/9;"
        />
      </div>

      <!-- Link Preview -->
      <div
        v-if="post.linkPreview && !post.media"
        :class="cn(
          'block overflow-hidden rounded-lg border',
          state.resolveSafeNavigationHref(post.linkPreview.url) && 'cursor-pointer transition-colors hover:bg-muted/50'
        )"
        @click="post.linkPreview.url && state.handleLinkClick(post.linkPreview.url)"
      >
        <img
          v-if="post.linkPreview.imageUrl"
          :src="post.linkPreview.imageUrl"
          alt=""
          class="h-40 w-full object-cover"
          loading="lazy"
        />
        <div class="p-3">
          <div v-if="post.linkPreview.title" class="line-clamp-2 font-medium text-pretty">
            {{ post.linkPreview.title }}
          </div>
          <div v-if="post.linkPreview.domain || state.getDomain(post.linkPreview.url)" class="mt-1 text-xs text-muted-foreground">
            {{ post.linkPreview.domain || state.getDomain(post.linkPreview.url) }}
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="mt-1 flex items-center gap-1 border-t pt-1.5">
        <button
          type="button"
          :class="cn(
            'h-auto gap-1.5 rounded-md px-3 py-2 text-xs font-medium transition-colors hover:bg-muted',
            post.stats?.isLiked ? 'fill-blue-600 text-blue-600' : ''
          )"
          aria-label="Like"
          @click="state.handleAction('like')"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            :fill="post.stats?.isLiked ? 'currentColor' : 'none'"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="size-4"
          >
            <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
          </svg>
          <span>Like</span>
          <span v-if="post.stats?.likes" class="text-muted-foreground">
            ({{ state.formatCount(post.stats.likes) }})
          </span>
        </button>
        <button
          type="button"
          class="h-auto gap-1.5 rounded-md px-3 py-2 text-xs font-medium transition-colors hover:bg-muted"
          aria-label="Share"
          @click="state.handleAction('share')"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="size-4"
          >
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
            <polyline points="16 6 12 2 8 6" />
            <line
              x1="12"
              x2="12"
              y1="2"
              y2="15"
            />
          </svg>
          <span>Share</span>
        </button>
      </div>
    </article>
  </div>
</template>
