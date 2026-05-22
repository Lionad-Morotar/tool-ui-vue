export default {
  content: {
    name: 'Name',
    type: 'Type',
    default: 'Default',
    description: 'Description',
    props: 'Props',
    articleProps: 'Article Props',
    markdown: 'Markdown',
    html: 'HTML',
    fullArticle: 'Full Article',
    collapsible: 'Collapsible',
    emptyContent: 'Empty Content',
  },
  data: {
    articleTitle: 'Vue 3 Composition API Best Practices',
    articleDescription: 'Deep dive into design patterns and performance optimization strategies',
    authorName: 'John Doe',
    mdContent: `# Vue 3 Composition API Best Practices

## Introduction

Vue 3's Composition API provides a powerful toolkit for building reusable and maintainable components.

## Core Concepts

- **ref vs reactive**: Choosing the right state declaration
- **computed**: Building derived state
- **watch and watchEffect**: Reactive side-effect management

## Code Example

\`\`\`ts
import { ref, computed } from 'vue'

const count = ref(0)
const doubled = computed(() => count.value * 2)
\`\`\`

## Summary

Mastering these patterns will help you write more elegant Vue 3 applications.`,
    htmlContent: '<h1>HTML Content Example</h1><p>This is a <strong>rich text</strong> content that supports <em>various</em> HTML tags.</p><ul><li>List item one</li><li>List item two</li></ul><p><a href="https://vuejs.org">Vue.js Official</a></p>',
  },
} as const
