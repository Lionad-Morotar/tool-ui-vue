<script setup lang="ts">
import { reactive } from "vue";
import { Citation, CitationList } from "../components";
import type { SerializableCitation } from "../components/citation/schema";

const interactiveState = reactive({
  href: "https://example.com/article",
  title: "Interactive Citation Example",
  snippet: "This is a customizable citation component that supports multiple variants and types.",
  domain: "example.com",
  author: "John Doe",
  publishedAt: "2024-03-15T00:00:00Z",
  type: "article" as const,
  variant: "default" as const,
});

const sampleCitations: SerializableCitation[] = [
  {
    id: "citation-1",
    href: "https://example.com/article-1",
    title: "Research Paper: Advanced UI Patterns",
    snippet: "This study explores the effectiveness of various UI patterns in improving user engagement...",
    domain: "example.com",
    author: "Dr. Jane Smith",
    publishedAt: "2024-01-10T00:00:00Z",
    type: "article",
  },
  {
    id: "citation-2",
    href: "https://developer.mozilla.org",
    title: "MDN Web Docs",
    snippet: "Resources for developers, by developers.",
    domain: "developer.mozilla.org",
    type: "webpage",
  },
  {
    id: "citation-3",
    href: "https://github.com/example/lib",
    title: "tool-ui Library",
    snippet: "A comprehensive Vue component library for building AI assistant interfaces.",
    domain: "github.com",
    type: "code",
  },
  {
    id: "citation-4",
    href: "https://example.com/whitepaper.pdf",
    title: "Technical Whitepaper",
    snippet: "An in-depth technical analysis of the architecture and design decisions.",
    domain: "example.com",
    author: "Engineering Team",
    publishedAt: "2024-01-01T00:00:00Z",
    type: "document",
  },
  {
    id: "citation-5",
    href: "https://api.example.com/docs",
    title: "API Documentation",
    snippet: "Complete API reference for developers.",
    domain: "api.example.com",
    type: "api",
  },
];

const inlineCitations: SerializableCitation[] = [
  { id: "inline-1", href: "https://vuejs.org", title: "Vue.js", domain: "vuejs.org", type: "webpage" },
  { id: "inline-2", href: "https://react.dev", title: "React", domain: "react.dev", type: "webpage" },
  { id: "inline-3", href: "https://svelte.dev", title: "Svelte", domain: "svelte.dev", type: "webpage" },
  { id: "inline-4", href: "https://angular.io", title: "Angular", domain: "angular.io", type: "webpage" },
];

const stackedCitations: SerializableCitation[] = [
  { id: "stack-1", href: "https://github.com/vuejs/vue", title: "Vue", domain: "github.com", type: "code" },
  { id: "stack-2", href: "https://github.com/facebook/react", title: "React", domain: "github.com", type: "code" },
  { id: "stack-3", href: "https://github.com/sveltejs/svelte", title: "Svelte", domain: "github.com", type: "code" },
  { id: "stack-4", href: "https://github.com/angular/angular", title: "Angular", domain: "github.com", type: "code" },
  { id: "stack-5", href: "https://github.com/solidjs/solid", title: "Solid", domain: "github.com", type: "code" },
];
</script>

<template>
  <Story title="Citation/All Variants">
    <Variant title="Default">
      <div class="w-full max-w-2xl">
        <Citation
          id="citation-default"
          href="https://example.com/research"
          title="Research Paper: Advanced UI Patterns"
          snippet="This study explores the effectiveness of various UI patterns in improving user engagement and task completion rates..."
          domain="example.com"
          author="Dr. Jane Smith"
          published-at="2024-01-10T00:00:00Z"
          type="article"
        />
      </div>
    </Variant>

    <Variant title="Inline">
      <div class="w-full max-w-2xl">
        <Citation
          id="citation-inline"
          variant="inline"
          href="https://example.com/source"
          title="Source Document"
          domain="example.com"
        />
      </div>
    </Variant>

    <Variant title="Stacked">
      <div class="w-full max-w-2xl">
        <Citation
          id="citation-stacked"
          variant="stacked"
          href="https://example.com/doc"
          title="Documentation Reference"
          snippet="The API supports batch operations for improved performance when processing multiple items."
          domain="docs.example.com"
          type="api"
        />
      </div>
    </Variant>

    <Variant title="Webpage">
      <div class="w-full max-w-2xl">
        <Citation
          id="citation-webpage"
          href="https://developer.mozilla.org"
          title="MDN Web Docs"
          snippet="Resources for developers, by developers."
          domain="developer.mozilla.org"
          type="webpage"
        />
      </div>
    </Variant>

    <Variant title="Code Repository">
      <div class="w-full max-w-2xl">
        <Citation
          id="citation-code"
          href="https://github.com/example/lib"
          title="tool-ui Library"
          snippet="A comprehensive Vue component library for building AI assistant interfaces."
          domain="github.com"
          type="code"
        />
      </div>
    </Variant>

    <Variant title="Document">
      <div class="w-full max-w-2xl">
        <Citation
          id="citation-document"
          href="https://example.com/whitepaper.pdf"
          title="Technical Whitepaper"
          snippet="An in-depth technical analysis of the architecture and design decisions."
          domain="example.com"
          author="Engineering Team"
          published-at="2024-01-01T00:00:00Z"
          type="document"
        />
      </div>
    </Variant>

    <Variant title="Interactive" auto-props-disabled>
      <div class="w-full max-w-2xl">
        <Citation
          id="citation-interactive"
          v-bind="interactiveState"
        />
      </div>
    </Variant>

    <Variant title="CitationList - Default">
      <div class="w-full max-w-2xl">
        <CitationList
          id="citation-list-default"
          :citations="sampleCitations"
          variant="default"
        />
      </div>
    </Variant>

    <Variant title="CitationList - Inline">
      <div class="w-full max-w-2xl">
        <CitationList
          id="citation-list-inline"
          :citations="inlineCitations"
          variant="inline"
        />
      </div>
    </Variant>

    <Variant title="CitationList - Stacked">
      <div class="w-full max-w-2xl">
        <CitationList
          id="citation-list-stacked"
          :citations="stackedCitations"
          variant="stacked"
        />
      </div>
    </Variant>

    <Variant title="CitationList - With Overflow">
      <div class="w-full max-w-2xl">
        <CitationList
          id="citation-list-overflow"
          :citations="sampleCitations"
          variant="default"
          :max-visible="2"
        />
      </div>
    </Variant>

    <Variant title="CitationList - Inline with Overflow">
      <div class="w-full max-w-2xl">
        <CitationList
          id="citation-list-inline-overflow"
          :citations="inlineCitations"
          variant="inline"
          :max-visible="2"
        />
      </div>
    </Variant>
  </Story>
</template>
