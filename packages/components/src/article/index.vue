<script setup lang="ts">
import { Star } from 'lucide-vue-next'
import { reactive } from 'vue'
import { cn } from '../core'
import { useArticle } from './states'
import { useI18n } from '../core/i18n'
import type { ArticleProps } from './schema'

defineOptions({ name: 'CmptArticle', inheritAttrs: false })

const props = withDefaults(defineProps<ArticleProps>(), {
  headerPattern: 'none',
  css: () => ({}),
})

const state = reactive(useArticle(props))

// i18n
const { t } = useI18n()
</script>

<template>
  <article
    v-bind="$attrs"
    :class="cn(
      'relative w-full max-w-2xl overflow-hidden',
      'rounded-2xl border border-border bg-card shadow-xs',
      css?.root,
    )"
    :data-tool-ui-id="id"
    data-slot="article"
  >
    <!-- Cover Image -->
    <div
      v-if="coverImage"
      :class="cn('px-4 pt-4', css?.cover)"
    >
      <img
        :src="coverImage"
        alt=""
        class="w-full rounded-xl object-cover"
        loading="lazy"
        @error="($event.target as HTMLElement).style.display = 'none'"
      >
    </div>

    <!-- Header -->
    <div
      v-if="title || description || author || createdAt || state.starOpacities || tags?.length"
      :class="cn(
        'relative p-4',
        headerPattern === 'dots' && 'article-header--dots',
        headerPattern === 'diagonal' && 'article-header--diagonal',
        css?.header,
      )"
    >
      <!-- Title -->
      <h2
        v-if="title"
        :class="cn('text-lg font-semibold text-foreground', css?.title)"
      >
        {{ title }}
      </h2>

      <!-- Description -->
      <p
        v-if="description"
        :class="cn('mt-1 text-sm text-muted-foreground', css?.description)"
      >
        {{ description }}
      </p>

      <!-- Meta row: author, time, rating -->
      <div
        v-if="author || createdAt || state.starOpacities"
        :class="cn('mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground', css?.meta)"
      >
        <!-- Author -->
        <span v-if="author" class="flex items-center gap-1">
          <span
            v-if="author.avatarUrl"
            class="inline-block size-7 shrink-0 overflow-hidden rounded-full bg-secondary"
          >
            <img
              :src="author.avatarUrl"
              alt=""
              class="size-full object-cover"
              loading="lazy"
              @error="($event.target as HTMLElement).style.display = 'none'"
            >
          </span>
          <span v-else class="inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-medium text-secondary-foreground">
            {{ author.name.charAt(0).toUpperCase() }}
          </span>
          <span>{{ author.name }}</span>
        </span>

        <!-- Time -->
        <span v-if="createdAt">{{ createdAt }}</span>

        <!-- Star Rating -->
        <span
          v-if="state.starOpacities"
          class="inline-flex items-center gap-0.5"
        >
          <star
            v-for="(opacity, i) in state.starOpacities"
            :key="i"
            data-slot="star"
            :size="12"
            class="shrink-0 text-amber-500"
            :style="{ opacity }"
          />
        </span>
      </div>

      <!-- Tags -->
      <div
        v-if="tags?.length"
        :class="cn('mt-2 flex flex-wrap gap-1.5', css?.tags)"
      >
        <span
          v-for="tag in tags"
          :key="tag"
          class="inline-flex shrink-0 items-center rounded-full border border-border/60 bg-transparent px-2 py-0.5 text-xs text-muted-foreground transition-colors hover:bg-secondary"
        >
          {{ tag }}
        </span>
      </div>
    </div>

    <!-- Body -->
    <div
      :class="cn(
        'relative p-4',
        (title || description || author || createdAt || state.starOpacities || tags?.length) && 'border-t border-border/50',
        state.contentStyle.maxHeight && 'overflow-hidden',
        css?.body,
      )"
      :style="state.contentStyle"
    >
      <!-- Empty placeholder -->
      <div
        v-if="state.isEmptyContent"
        data-slot="empty-placeholder"
        class="py-8 text-center text-sm text-muted-foreground"
      >
        {{ t('article.noContent').value }}
      </div>

      <!-- Parsed content -->
      <div
        v-else
        data-slot="article-body"
        class="article-body"
        v-html="state.parsedContent"
      />
    </div>

    <!-- Footer: source, readingTime, wordCount, expand button -->
    <div
      v-if="source || readingTime || wordCount || (maxHeight && !state.isEmptyContent)"
      :class="cn('flex items-center justify-between border-t border-border/50 px-4 py-3 text-xs text-muted-foreground', css?.footer)"
    >
      <!-- Left -->
      <div class="flex flex-wrap items-center gap-3">
        <a
          v-if="source"
          :href="source"
          target="_blank"
          rel="noopener noreferrer"
          class="hover:text-foreground hover:underline"
        >
          {{ t('article.source').value }}
        </a>
        <span v-if="readingTime">{{ t('article.readingTime', { count: readingTime }).value }}</span>
        <span v-if="wordCount">{{ t('article.wordCount', { count: wordCount }).value }}</span>
      </div>

      <!-- Right: expand button -->
      <button
        v-if="maxHeight && !state.isEmptyContent"
        data-slot="expand-button"
        :class="cn(
          'text-xs text-muted-foreground underline-offset-2 hover:underline',
          css?.expandButton,
        )"
        @click="state.toggleExpanded"
      >
        {{ state.isExpanded ? t('shared.collapse').value : t('shared.expand').value }}
      </button>
    </div>
  </article>
</template>

<style scoped>
/* ── Markdown Body 基础样式 ─────────────────────────────── */
/* 替代未安装的 @tailwindcss/typography 插件，提供 Markdown 元素的基础排版 */

.article-body {
  color: var(--color-foreground);
  font-size: 0.875rem;
  line-height: 1.7;
}

.article-body :deep(h1),
.article-body :deep(h2),
.article-body :deep(h3),
.article-body :deep(h4),
.article-body :deep(h5),
.article-body :deep(h6) {
  color: var(--color-foreground);
  font-weight: 600;
  line-height: 1.3;
  margin-bottom: 0.6em;
  margin-top: 1.25em;
}

.article-body :deep(h1) {
  font-size: 1.25rem;
  margin-top: 0.5em;
}
.article-body :deep(h2) {
  font-size: 1.125rem;
}
.article-body :deep(h3) {
  font-size: 1rem;
}
.article-body :deep(h4) {
  font-size: 0.9375rem;
}
.article-body :deep(h5),
.article-body :deep(h6) {
  font-size: 0.875rem;
}

.article-body :deep(p) {
  margin-bottom: 0.875em;
}

.article-body :deep(a) {
  color: var(--color-primary);
  text-decoration: underline;
  text-underline-offset: 2px;
}

.article-body :deep(a:hover) {
  opacity: 0.8;
}

.article-body :deep(ul),
.article-body :deep(ol) {
  margin-bottom: 0.875em;
  padding-left: 1.5em;
}

.article-body :deep(ul) {
  list-style-type: disc;
}

.article-body :deep(ol) {
  list-style-type: decimal;
}

.article-body :deep(li) {
  margin-bottom: 0.25em;
}

.article-body :deep(li > ul),
.article-body :deep(li > ol) {
  margin-bottom: 0;
  margin-top: 0.25em;
}

.article-body :deep(blockquote) {
  border-left: 3px solid var(--color-border);
  color: var(--color-muted-foreground);
  margin: 1em 0;
  padding-left: 1em;
}

.article-body :deep(code) {
  background-color: var(--color-muted);
  border-radius: var(--radius-sm);
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.85em;
  padding: 0.15em 0.4em;
}

.article-body :deep(pre) {
  background-color: var(--color-muted);
  border-radius: var(--radius-lg);
  margin: 1em 0;
  overflow-x: auto;
  padding: 1em;
}

.article-body :deep(pre code) {
  background-color: transparent;
  font-size: 0.8em;
  padding: 0;
}

.article-body :deep(hr) {
  border: 0;
  border-top: 1px solid var(--color-border);
  margin: 1.5em 0;
}

.article-body :deep(table) {
  border-collapse: collapse;
  font-size: 0.85em;
  margin: 1em 0;
  width: 100%;
}

.article-body :deep(th),
.article-body :deep(td) {
  border: 1px solid var(--color-border);
  padding: 0.5em 0.75em;
  text-align: left;
}

.article-body :deep(th) {
  background-color: var(--color-muted);
  font-weight: 600;
}

.article-body :deep(img) {
  border-radius: var(--radius-lg);
  margin: 0.5em 0;
  max-width: 100%;
}

.article-body :deep(strong) {
  font-weight: 600;
}

.article-body :deep(em) {
  font-style: italic;
}

.article-body :deep(del),
.article-body :deep(s) {
  opacity: 0.7;
  text-decoration: line-through;
}

/* ── Header 背景花纹 ─────────────────────────────────────── */

/* 点阵 */
.article-header--dots {
  background-image: radial-gradient(
    circle at center,
    color-mix(in oklch, var(--color-border) 85%, transparent) 1px,
    transparent 0
  );
  background-position: 6px 6px;
  background-size: 12px 12px;
}

/* 斜纹 */
.article-header--diagonal {
  background-image: repeating-linear-gradient(
    135deg,
    transparent,
    transparent 6px,
    color-mix(in oklch, var(--color-border) 20%, transparent) 6px,
    color-mix(in oklch, var(--color-border) 20%, transparent) 7px
  );
}
</style>
