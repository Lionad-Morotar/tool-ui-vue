<script setup lang="ts">
import { cn } from '@lionad/vtu-core';
import { useI18n } from '@lionad/vtu-core/i18n';
import { computed, reactive } from 'vue';
import { useInstagramPost } from './states';
import type { InstagramPostProps, InstagramPostData } from './schema';

defineOptions({ name: 'CmptInstagramPost', inheritAttrs: false })

const props = withDefaults(defineProps<InstagramPostProps & { css?: { root?: string } }>(), {
  css: () => ({ root: '' })
})

const emit = defineEmits<{
  action: [action: string, post: InstagramPostData];
}>();

// All business logic delegated to states layer
const state = reactive(useInstagramPost(props, emit));

// i18n
const { t } = useI18n()

// Derived i18n values for attribute bindings
const likeAriaLabel = computed(() => t('instagramPost.like').value)
const shareAriaLabel = computed(() => t('instagramPost.share').value)
const verifiedAriaLabel = computed(() => t('instagramPost.verified').value)
const instagramLogoAriaLabel = computed(() => t('instagramPost.logo').value)
</script>

<template>
  <div
    v-bind="$attrs"
    :class="cn('flex max-w-xl flex-col gap-3', css?.root)"
    :data-tool-ui-id="post.id"
    data-slot="instagram-post"
  >
    <article class="bg-card shadow-sm border border-border rounded-lg overflow-hidden">
      <!-- Header -->
      <header class="flex items-center gap-3 p-3">
        <img
          :src="post.author.avatarUrl"
          :alt="`${post.author.name} avatar`"
          width="32"
          height="32"
          class="rounded-full size-8 object-cover"
        />
        <div class="flex flex-1 items-center gap-1.5 min-w-0">
          <span class="font-semibold text-sm truncate">{{ post.author.handle }}</span>
          <svg
            v-if="post.author.verified"
            viewBox="0 0 24 24"
            class="size-3.5 text-sky-500 shrink-0"
            role="img"
            :aria-label="verifiedAriaLabel"
          >
            <path
              fill="currentColor"
              d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .495.083.965.238 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z"
            />
          </svg>
          <template v-if="post.createdAt">
            <span class="text-muted-foreground">·</span>
            <span class="text-muted-foreground text-sm">{{ state.formatRelativeTime(post.createdAt) }}</span>
          </template>
        </div>
        <!-- Instagram Logo -->
        <svg
          viewBox="0 0 132 132"
          class="size-5"
          role="img"
          :aria-label="instagramLogoAriaLabel"
        >
          <defs>
            <radialGradient
              id="ig-primary"
              cx="158.429"
              cy="578.088"
              r="65"
              gradientUnits="userSpaceOnUse"
              gradientTransform="matrix(0 -1.982 1.844 0 -1031.4 454)"
            >
              <stop offset="0" stop-color="#fd5" />
              <stop offset=".1" stop-color="#fd5" />
              <stop offset=".5" stop-color="#ff543e" />
              <stop offset="1" stop-color="#c837ab" />
            </radialGradient>
            <radialGradient
              id="ig-secondary"
              cx="147.694"
              cy="473.455"
              r="65"
              gradientUnits="userSpaceOnUse"
              gradientTransform="matrix(.174 .869 -3.58 .717 1648 -458.5)"
            >
              <stop offset="0" stop-color="#3771c8" />
              <stop offset=".128" stop-color="#3771c8" />
              <stop offset="1" stop-color="#60f" stop-opacity="0" />
            </radialGradient>
          </defs>
          <path
            fill="url(#ig-primary)"
            d="M65 0C37.9 0 30 .03 28.4.16c-5.6.46-9 1.34-12.8 3.22-2.9 1.44-5.2 3.12-7.5 5.47C4 13.1 1.5 18.4.6 24.66c-.44 3.04-.57 3.66-.6 19.2-.01 5.16 0 12 0 21.1 0 27.12.03 35.05.16 36.6.45 5.4 1.3 8.82 3.1 12.55 3.44 7.14 10 12.5 17.76 14.5 2.68.7 5.64 1.1 9.44 1.26 1.6.07 18 .12 34.44.12s32.84-.02 34.4-.1c4.4-.2 6.96-.55 9.8-1.28 7.78-2.01 14.23-7.3 17.74-14.53 1.76-3.64 2.66-7.18 3.07-12.32.08-1.12.12-18.97.12-36.8 0-17.85-.04-35.67-.13-36.8-.4-5.2-1.3-8.7-3.13-12.43-1.5-3.04-3.16-5.3-5.56-7.62C116.9 4 111.64 1.5 105.37.6 102.34.16 101.73.03 86.2 0H65z"
            transform="translate(1 1)"
          />
          <path
            fill="url(#ig-secondary)"
            d="M65 0C37.9 0 30 .03 28.4.16c-5.6.46-9 1.34-12.8 3.22-2.9 1.44-5.2 3.12-7.5 5.47C4 13.1 1.5 18.4.6 24.66c-.44 3.04-.57 3.66-.6 19.2-.01 5.16 0 12 0 21.1 0 27.12.03 35.05.16 36.6.45 5.4 1.3 8.82 3.1 12.55 3.44 7.14 10 12.5 17.76 14.5 2.68.7 5.64 1.1 9.44 1.26 1.6.07 18 .12 34.44.12s32.84-.02 34.4-.1c4.4-.2 6.96-.55 9.8-1.28 7.78-2.01 14.23-7.3 17.74-14.53 1.76-3.64 2.66-7.18 3.07-12.32.08-1.12.12-18.97.12-36.8 0-17.85-.04-35.67-.13-36.8-.4-5.2-1.3-8.7-3.13-12.43-1.5-3.04-3.16-5.3-5.56-7.62C116.9 4 111.64 1.5 105.37.6 102.34.16 101.73.03 86.2 0H65z"
            transform="translate(1 1)"
          />
          <path
            fill="#fff"
            d="M66 18c-13 0-14.67.06-19.8.3-5.1.23-8.6 1.04-11.64 2.22-3.16 1.23-5.84 2.87-8.5 5.54-2.67 2.67-4.3 5.35-5.54 8.5-1.2 3.05-2 6.54-2.23 11.65C18.06 51.33 18 52.96 18 66s.06 14.67.3 19.78c.22 5.12 1.03 8.6 2.22 11.66 1.22 3.15 2.86 5.83 5.53 8.5 2.67 2.67 5.35 4.3 8.5 5.53 3.06 1.2 6.55 2 11.65 2.23 5.12.23 6.76.3 19.8.3 13 0 14.66-.07 19.78-.3 5.12-.23 8.6-1.03 11.66-2.23 3.15-1.23 5.83-2.87 8.5-5.53 2.67-2.67 4.3-5.35 5.53-8.5 1.2-3.06 2-6.54 2.23-11.66.23-5.1.3-6.75.3-19.78 0-13.04-.07-14.68-.3-19.8-.23-5.1-1.04-8.6-2.22-11.64-1.23-3.16-2.87-5.84-5.54-8.5-2.67-2.67-5.35-4.3-8.5-5.54-3.06-1.18-6.55-2-11.66-2.22-5.12-.24-6.75-.3-19.8-.3zm-4.3 8.65c1.28 0 2.7 0 4.3 0 12.82 0 14.34.05 19.4.28 4.67.2 7.22 1 8.9 1.65 2.25.87 3.84 1.9 5.52 3.6 1.68 1.67 2.72 3.27 3.6 5.5.65 1.7 1.43 4.24 1.64 8.92.23 5.05.28 6.57.28 19.4s-.05 14.32-.28 19.4c-.2 4.67-1 7.2-1.64 8.9-.88 2.25-1.92 3.84-3.6 5.52-1.68 1.68-3.27 2.72-5.52 3.6-1.7.65-4.23 1.43-8.9 1.64-5.06.23-6.58.28-19.4.28-12.82 0-14.34-.05-19.4-.28-4.68-.2-7.22-1-8.9-1.64-2.25-.88-3.84-1.92-5.52-3.6-1.68-1.68-2.72-3.27-3.6-5.52-.65-1.7-1.43-4.23-1.64-8.9-.23-5.06-.28-6.58-.28-19.4s.05-14.34.28-19.4c.2-4.68 1-7.22 1.64-8.9.88-2.24 1.92-3.83 3.6-5.52 1.68-1.68 3.27-2.72 5.52-3.6 1.7-.65 4.23-1.43 8.9-1.65 4.43-.2 6.15-.26 15.1-.27zm30 8c-3.2 0-5.77 2.57-5.77 5.75 0 3.2 2.58 5.77 5.77 5.77 3.18 0 5.76-2.58 5.76-5.77 0-3.18-2.58-5.76-5.76-5.76zm-25.63 6.72c-13.6 0-24.64 11.04-24.64 24.65 0 13.6 11.03 24.64 24.64 24.64 13.6 0 24.65-11.03 24.65-24.64 0-13.6-11.04-24.64-24.65-24.64zm0 8.65c8.84 0 16 7.16 16 16 0 8.84-7.16 16-16 16-8.84 0-16-7.16-16-16 0-8.84 7.16-16 16-16z"
          />
        </svg>
      </header>

      <!-- Media Grid -->
      <div
        v-if="post.media && post.media.length > 0"
        class="w-full"
      >
        <!-- Single image -->
        <div v-if="post.media.length === 1" class="w-full aspect-square overflow-hidden">
          <button
            v-if="post.media[0].type === 'image'"
            type="button"
            class="block relative bg-muted size-full overflow-hidden"
            @click="state.handleAction('open-media')"
          >
            <img
              :src="post.media[0].url"
              :alt="post.media[0].alt"
              class="size-full object-cover"
              loading="lazy"
            />
          </button>
          <video
            v-else
            :src="post.media[0].url"
            playsinline
            class="size-full object-cover"
          />
        </div>

        <!-- Two images -->
        <div v-else-if="post.media.length === 2" class="gap-0.5 grid grid-cols-2 w-full aspect-square overflow-hidden">
          <button
            v-for="(item, index) in post.media"
            :key="index"
            type="button"
            class="block relative bg-muted size-full overflow-hidden"
            @click="state.handleAction('open-media')"
          >
            <img
              v-if="item.type === 'image'"
              :src="item.url"
              :alt="item.alt"
              class="size-full object-cover"
              loading="lazy"
            />
            <video
              v-else
              :src="item.url"
              playsinline
              class="size-full object-cover"
            />
          </button>
        </div>

        <!-- Three images -->
        <div v-else-if="post.media.length === 3" class="gap-0.5 grid grid-cols-2 w-full aspect-square overflow-hidden">
          <div class="h-full">
            <button
              type="button"
              class="block relative bg-muted size-full overflow-hidden"
              @click="state.handleAction('open-media')"
            >
              <img
                v-if="post.media[0].type === 'image'"
                :src="post.media[0].url"
                :alt="post.media[0].alt"
                class="size-full object-cover"
                loading="lazy"
              />
              <video
                v-else
                :src="post.media[0].url"
                playsinline
                class="size-full object-cover"
              />
            </button>
          </div>
          <div class="gap-0.5 grid grid-rows-2 h-full">
            <button
              v-for="(item, index) in post.media.slice(1)"
              :key="index + 1"
              type="button"
              class="block relative bg-muted size-full overflow-hidden"
              @click="state.handleAction('open-media')"
            >
              <img
                v-if="item.type === 'image'"
                :src="item.url"
                :alt="item.alt"
                class="size-full object-cover"
                loading="lazy"
              />
              <video
                v-else
                :src="item.url"
                playsinline
                class="size-full object-cover"
              />
            </button>
          </div>
        </div>

        <!-- Four or more images -->
        <div v-else class="gap-0.5 grid grid-cols-2 w-full aspect-square overflow-hidden">
          <div
            v-for="(item, index) in post.media.slice(0, 4)"
            :key="index"
            class="relative w-full h-full"
          >
            <button
              type="button"
              class="block relative bg-muted size-full overflow-hidden"
              @click="state.handleAction('open-media')"
            >
              <img
                v-if="item.type === 'image'"
                :src="item.url"
                :alt="item.alt"
                class="size-full object-cover"
                loading="lazy"
              />
              <video
                v-else
                :src="item.url"
                playsinline
                class="size-full object-cover"
              />
            </button>
            <div
              v-if="index === 3 && post.media.length > 4"
              class="absolute inset-0 flex justify-center items-center bg-black/50 pointer-events-none"
            >
              <span class="font-semibold text-white text-2xl">
                +{{ post.media.length - 4 }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex flex-col gap-2 p-3">
        <div class="flex items-center gap-1">
          <button
            type="button"
            :class="cn(
              'h-auto rounded-md px-3 py-2 transition-colors hover:opacity-60',
              post.stats?.isLiked ? 'fill-red-500 text-red-500' : ''
            )"
            :aria-label="likeAriaLabel"
            @click="state.handleAction('like')"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              :fill="post.stats?.isLiked ? 'currentColor' : 'none'"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="size-5"
            >
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
            </svg>
          </button>
          <button
            type="button"
            class="hover:opacity-60 px-3 py-2 rounded-md h-auto transition-colors"
            :aria-label="shareAriaLabel"
            @click="state.handleAction('share')"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="size-5"
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
          </button>
        </div>

        <!-- Caption -->
        <div v-if="post.text">
          <span class="font-semibold text-sm">{{ post.author.handle }}</span>
          <span class="text-sm text-pretty leading-relaxed whitespace-pre-wrap"> {{ post.text }}</span>
        </div>
      </div>
    </article>
  </div>
</template>
