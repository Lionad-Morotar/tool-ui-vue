<script setup lang="ts">
import { reactive } from 'vue';
import { LinkPreview } from '../components';

const interactiveState = reactive({
  href: 'https://example.com/interactive',
  title: 'Interactive Link Preview',
  description: 'Customize this preview by changing the properties below.',
  image: 'https://picsum.photos/400/200?random=135',
  domain: 'example.com',
  ratio: 'auto' as const,
});

/**
 * ## Props
 *
 * | Prop | Type | Default | Description |
 * |------|------|---------|-------------|
 * | id | string | required | Unique identifier for the component |
 * | href | string | required | URL to navigate to when clicked |
 * | title | string | undefined | Title text to display |
 * | description | string | undefined | Description text to display |
 * | image | string | undefined | URL of the preview image |
 * | domain | string | undefined | Domain to display (auto-extracted from href if not provided) |
 * | favicon | string | undefined | URL of the favicon to display |
 * | ratio | 'auto' \| '1:1' \| '4:3' \| '16:9' \| '9:16' | 'auto' | Aspect ratio of the preview image |
 * | fit | 'cover' \| 'contain' | 'cover' | Object-fit style for the image |
 * | className | string | undefined | Additional CSS classes to apply |
 *
 * ## Emits
 *
 * | Event | Payload | Description |
 * |-------|---------|-------------|
 * | navigate | href: string | Emitted when the link preview is clicked |
 *
 * ## Slots
 *
 * This component does not use slots. All content is passed via props.
 *
 * ## Accessibility
 *
 * - Has `role="link"` when href is provided
 * - Has `tabindex="0"` for keyboard navigation
 * - Supports Enter and Space keys for activation
 * - Images have `loading="lazy"` and `decoding="async"`
 * - Favicon has `aria-hidden="true"`
 */
</script>

<template>
  <Story title="LinkPreview/All Variants">
    <Variant title="With Image">
      <div class="w-full max-w-md">
        <link-preview
          id="link-preview-image"
          href="https://example.com/article"
          title="Building Better UI Components"
          description="A comprehensive guide to creating reusable, accessible UI components for modern web applications."
          image="https://picsum.photos/400/200?random=130"
          domain="example.com"
        />
      </div>
    </Variant>

    <Variant title="Without Image">
      <div class="w-full max-w-md">
        <link-preview
          id="link-preview-no-image"
          href="https://example.com/docs"
          title="API Documentation"
          description="Complete reference for our REST API endpoints, authentication, and examples."
          domain="example.com"
        />
      </div>
    </Variant>

    <Variant title="Compact">
      <div class="w-full max-w-sm">
        <link-preview
          id="link-preview-compact"
          href="https://github.com/example/repo"
          title="example/repo"
          domain="github.com"
        />
      </div>
    </Variant>

    <Variant title="Long Description">
      <div class="w-full max-w-md">
        <link-preview
          id="link-preview-long"
          href="https://example.com/blog"
          title="Understanding Modern JavaScript"
          description="JavaScript has evolved significantly over the years. In this comprehensive guide, we explore the latest features, best practices, and patterns that every developer should know in 2024. From async/await to modules, we cover it all."
          image="https://picsum.photos/400/200?random=131"
          domain="example.com"
        />
      </div>
    </Variant>

    <Variant title="News Article">
      <div class="w-full max-w-md">
        <link-preview
          id="link-preview-news"
          href="https://news.example.com/story"
          title="Tech Industry Sees Record Growth in Q4"
          description="Latest quarterly reports show unprecedented expansion across multiple sectors."
          image="https://picsum.photos/400/200?random=132"
          domain="news.example.com"
        />
      </div>
    </Variant>

    <Variant title="With Favicon">
      <div class="w-full max-w-md">
        <link-preview
          id="link-preview-favicon"
          href="https://github.com/features"
          title="GitHub Features"
          description="Explore the powerful features that make GitHub the world's leading development platform."
          image="https://picsum.photos/400/200?random=133"
          domain="github.com"
          favicon="https://github.com/favicon.ico"
        />
      </div>
    </Variant>

    <Variant title="Square Ratio (1:1)">
      <div class="w-full max-w-md">
        <link-preview
          id="link-preview-square"
          href="https://example.com/gallery"
          title="Photo Gallery"
          description="A collection of stunning photography."
          image="https://picsum.photos/400/400?random=134"
          domain="example.com"
          ratio="1:1"
        />
      </div>
    </Variant>

    <Variant title="Portrait Ratio (9:16)">
      <div class="w-full max-w-sm">
        <link-preview
          id="link-preview-portrait"
          href="https://example.com/portrait"
          title="Portrait Mode"
          description="Optimized for mobile viewing."
          image="https://picsum.photos/300/500?random=136"
          domain="example.com"
          ratio="9:16"
        />
      </div>
    </Variant>

    <Variant title="Interactive" auto-props-disabled>
      <div class="w-full max-w-md">
        <link-preview
          id="link-preview-interactive"
          v-bind="interactiveState"
        />
      </div>
    </Variant>
  </Story>
</template>
