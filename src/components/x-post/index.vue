<script setup lang="ts">
import { cn } from "./_adapter";
import type { XPostProps, XPostData } from "./schema";

const props = defineProps<XPostProps>();

const emit = defineEmits<{
  action: [action: string, post: XPostData];
}>();

function formatCount(count: number): string {
  if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
  if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
  return count.toString();
}

function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return `${diffSecs}s`;
  if (diffMins < 60) return `${diffMins}m`;
  if (diffHours < 24) return `${diffHours}h`;
  if (diffDays < 30) return `${diffDays}d`;
  return date.toLocaleDateString();
}

function getDomain(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

function getAspectRatio(ratio?: string): string {
  if (ratio === "1:1") return "1";
  if (ratio === "4:3") return "4/3";
  if (ratio === "9:16") return "9/16";
  return "16/9";
}

/**
 * Sanitize a URL to ensure it's safe for use in href attributes.
 * Allows absolute http(s) URLs and relative URLs.
 * @returns The sanitized URL string, or undefined if invalid/unsafe
 */
function sanitizeHref(href?: string): string | undefined {
  if (!href) return undefined;
  const candidate = href.trim();
  if (!candidate) return undefined;

  if (
    candidate.startsWith("/") ||
    candidate.startsWith("./") ||
    candidate.startsWith("../") ||
    candidate.startsWith("?") ||
    candidate.startsWith("#")
  ) {
    if (candidate.startsWith("//")) return undefined;
    // eslint-disable-next-line no-control-regex -- intentionally matching control characters
    if (/[\u0000-\u001F\u007F]/.test(candidate)) return undefined;
    return candidate;
  }

  try {
    const url = new URL(candidate);
    if (url.protocol === "http:" || url.protocol === "https:") {
      return url.toString();
    }
  } catch {
    return undefined;
  }
  return undefined;
}

/**
 * Resolve the first safe navigation href from candidates.
 */
function resolveSafeNavigationHref(
  ...candidates: Array<string | null | undefined>
): string | undefined {
  for (const candidate of candidates) {
    const safeHref = sanitizeHref(candidate ?? undefined);
    if (safeHref) {
      return safeHref;
    }
  }
  return undefined;
}

function handleAction(action: string) {
  emit("action", action, props.post);
}

function handleLinkClick(url: string) {
  const safeUrl = resolveSafeNavigationHref(url);
  if (safeUrl) {
    window.open(safeUrl, "_blank", "noopener,noreferrer");
  }
}
</script>

<template>
  <div
    :class="cn('flex max-w-xl flex-col gap-3', className)"
    :data-tool-ui-id="post.id"
    data-slot="x-post"
  >
    <article class="bg-card border-border rounded-xl border p-3 shadow-sm">
      <div class="flex gap-3">
        <!-- Avatar -->
        <img
          :src="post.author.avatarUrl"
          :alt="`${post.author.name} avatar`"
          width="40"
          height="40"
          class="size-10 shrink-0 rounded-full object-cover"
        />
        <div class="min-w-0 flex-1">
          <!-- Header -->
          <div class="flex items-start justify-between gap-2">
            <div class="flex min-w-0 items-center gap-1">
              <span class="truncate font-semibold">{{ post.author.name }}</span>
              <svg
                v-if="post.author.verified"
                viewBox="0 0 24 24"
                class="size-[18px] shrink-0 text-blue-500"
                role="img"
                aria-label="Verified account"
              >
                <path
                  fill="currentColor"
                  d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .495.083.965.238 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z"
                />
              </svg>
              <span class="text-muted-foreground truncate">@{{ post.author.handle }}</span>
              <span v-if="post.createdAt" class="text-muted-foreground">·</span>
              <span v-if="post.createdAt" class="text-muted-foreground">{{ formatRelativeTime(post.createdAt) }}</span>
            </div>
            <!-- X Logo -->
            <svg
              viewBox="0 0 300 271"
              class="text-muted-foreground/40 size-4 shrink-0"
              role="img"
              aria-label="X (formerly Twitter) logo"
            >
              <path
                fill="currentColor"
                d="m236 0h46l-101 115 118 156h-92.6l-72.5-94.8-83 94.8h-46l107-123-113-148h94.9l65.5 86.6zm-16.1 244h25.5l-165-218h-27.4z"
              />
            </svg>
          </div>

          <!-- Body -->
          <p v-if="post.text" class="text-[15px] leading-normal text-pretty whitespace-pre-wrap wrap-break-word">{{ post.text }}</p>

          <!-- Media -->
          <div
            v-if="post.media"
            class="bg-muted mt-2 w-full overflow-hidden rounded-xl"
            :style="{ aspectRatio: getAspectRatio(post.media.aspectRatio) }"
          >
            <img
              v-if="post.media.type === 'image'"
              :src="post.media.url"
              :alt="post.media.alt"
              class="size-full object-cover"
              loading="lazy"
            />
            <video
              v-else
              :src="post.media.url"
              controls
              playsinline
              class="size-full object-contain"
            />
          </div>

          <!-- Quoted Post -->
          <div v-if="post.quotedPost" class="hover:bg-muted/30 mt-2 rounded-xl border p-3 transition-colors">
            <div class="flex min-w-0 items-center gap-1">
              <img
                :src="post.quotedPost.author.avatarUrl"
                :alt="`${post.quotedPost.author.name} avatar`"
                width="16"
                height="16"
                class="size-4 rounded-full object-cover"
              />
              <span class="truncate font-semibold">{{ post.quotedPost.author.name }}</span>
              <svg
                v-if="post.quotedPost.author.verified"
                viewBox="0 0 24 24"
                class="size-3.5 shrink-0 text-blue-500"
                role="img"
                aria-label="Verified account"
              >
                <path
                  fill="currentColor"
                  d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .495.083.965.238 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z"
                />
              </svg>
              <span class="text-muted-foreground truncate">@{{ post.quotedPost.author.handle }}</span>
              <span v-if="post.quotedPost.createdAt" class="text-muted-foreground shrink-0">·</span>
              <span v-if="post.quotedPost.createdAt" class="text-muted-foreground shrink-0">{{ formatRelativeTime(post.quotedPost.createdAt) }}</span>
            </div>
            <p v-if="post.quotedPost.text" class="mt-1.5">{{ post.quotedPost.text }}</p>
            <img
              v-if="post.quotedPost.media"
              :src="post.quotedPost.media.url"
              :alt="post.quotedPost.media.alt"
              class="mt-2 w-full rounded-lg object-cover"
            />
          </div>

          <!-- Link Preview -->
          <div
            v-if="post.linkPreview && !post.quotedPost"
            :class="cn(
              'mt-2 block overflow-hidden rounded-xl border',
              resolveSafeNavigationHref(post.linkPreview.url) && 'hover:bg-muted/50 cursor-pointer transition-colors'
            )"
            @click="post.linkPreview.url && handleLinkClick(post.linkPreview.url)"
          >
            <img
              v-if="post.linkPreview.imageUrl"
              :src="post.linkPreview.imageUrl"
              alt=""
              class="h-48 w-full object-cover"
              loading="lazy"
            />
            <div class="p-3">
              <div v-if="post.linkPreview.domain || getDomain(post.linkPreview.url)" class="text-muted-foreground text-xs">
                {{ post.linkPreview.domain || getDomain(post.linkPreview.url) }}
              </div>
              <div v-if="post.linkPreview.title" class="font-medium text-pretty">{{ post.linkPreview.title }}</div>
              <div v-if="post.linkPreview.description" class="text-muted-foreground line-clamp-2 text-sm text-pretty">
                {{ post.linkPreview.description }}
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="mt-3 flex items-center gap-4">
            <button
              type="button"
              :class="cn(
                'inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-sm transition-colors',
                'hover:text-pink-500 hover:bg-pink-500/10',
                post.stats?.isLiked && 'text-pink-500'
              )"
              @click="handleAction('like')"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" :class="post.stats?.isLiked && 'fill-pink-500'">
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
              </svg>
              <span v-if="post.stats?.likes">{{ formatCount(post.stats.likes) }}</span>
            </button>
            <button
              type="button"
              class="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-sm transition-colors hover:text-blue-500 hover:bg-blue-500/10"
              @click="handleAction('share')"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
                <polyline points="16 6 12 2 8 6"/>
                <line x1="12" x2="12" y1="2" y2="15"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </article>
  </div>
</template>
