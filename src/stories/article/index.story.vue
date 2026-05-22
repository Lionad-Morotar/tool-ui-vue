<script setup lang="ts">
import { Article } from '@lionad/vtu-components'
import messages from './i18n'
import { useStoryLocale } from '../_shared/use-story-locale'

const Name = useStoryLocale('content.name', messages)
const Type = useStoryLocale('content.type', messages)
const Default = useStoryLocale('content.default', messages)
const Description = useStoryLocale('content.description', messages)
const Props = useStoryLocale('content.props', messages)
const ArticleProps = useStoryLocale('content.articleProps', messages)

const headerName = Name
const headerType = Type
const headerDefault = Default
const headerDesc = Description
const propsTitle = Props
const componentPropsTitle = ArticleProps

const markdownVariant = useStoryLocale('content.markdown', messages)
const htmlVariant = useStoryLocale('content.html', messages)
const fullArticleVariant = useStoryLocale('content.fullArticle', messages)
const collapsibleVariant = useStoryLocale('content.collapsible', messages)
const emptyContentVariant = useStoryLocale('content.emptyContent', messages)

const articleTitle = useStoryLocale('data.articleTitle', messages)
const articleDescription = useStoryLocale('data.articleDescription', messages)
const authorName = useStoryLocale('data.authorName', messages)
const mdContent = useStoryLocale('data.mdContent', messages)
const htmlContent = useStoryLocale('data.htmlContent', messages)

// Props documentation
const props = [
  { name: 'id', type: 'string', required: true, description: { zh: '组件的唯一标识符', en: 'Unique identifier for the component' } },
  { name: 'type', type: "'md' | 'html'", required: true, description: { zh: '内容类型：markdown 或 html', en: 'Content type: markdown or html' } },
  { name: 'content', type: 'string', required: true, description: { zh: '文章内容', en: 'Article content' } },
  { name: 'title', type: 'string', description: { zh: '文章标题', en: 'Article title' } },
  { name: 'description', type: 'string', description: { zh: '文章摘要', en: 'Article description' } },
  { name: 'author', type: '{ name: string; avatarUrl?: string }', description: { zh: '作者信息', en: 'Author information' } },
  { name: 'coverImage', type: 'string', description: { zh: '封面图片 URL', en: 'Cover image URL' } },
  { name: 'tags', type: 'string[]', description: { zh: '标签列表', en: 'List of tags' } },
  { name: 'rate', type: 'number', description: { zh: '评分（0-5）', en: 'Rating (0-5)' } },
  { name: 'createdAt', type: 'string', description: { zh: '创建时间（ISO 8601）', en: 'Creation time (ISO 8601)' } },
  { name: 'source', type: 'string', description: { zh: '文章来源链接', en: 'Article source link' } },
  { name: 'readingTime', type: 'number', description: { zh: '阅读时间（分钟）', en: 'Reading time in minutes' } },
  { name: 'wordCount', type: 'number', description: { zh: '字数', en: 'Word count' } },
  { name: 'maxHeight', type: 'string', description: { zh: '最大高度（支持展开/折叠）', en: 'Max height (enables expand/collapse)' } },
  { name: 'locale', type: 'string', description: { zh: '本地化字符串', en: 'Locale string' } },
  { name: 'css', type: '{ root?: string; cover?: string; header?: string; title?: string; description?: string; meta?: string; tags?: string; body?: string; footer?: string }', description: { zh: '组件元素的 CSS 类', en: 'CSS classes for component elements' } },
]
</script>

<template>
  <Story title="Article/All Variants">
    <!-- Markdown 内容 -->
    <Variant :title="markdownVariant">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-2xl">
        <Article
          id="story-md"
          type="md"
          :content="mdContent"
        />
      </div>
    </Variant>

    <!-- HTML 内容 -->
    <Variant :title="htmlVariant">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-2xl">
        <Article
          id="story-html"
          type="html"
          :content="htmlContent"
        />
      </div>
    </Variant>

    <!-- 完整文章 -->
    <Variant :title="fullArticleVariant">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-2xl">
        <Article
          id="story-full"
          type="md"
          :content="mdContent"
          :title="articleTitle"
          :description="articleDescription"
          :author="{ name: authorName }"
          :tags="['Vue', 'TypeScript', 'Frontend']"
          :rate="4.2"
          created-at="2026-05-22"
          source="https://example.com/article"
          :reading-time="8"
          :word-count="1200"
        />
      </div>
    </Variant>

    <!-- 可折叠 -->
    <Variant :title="collapsibleVariant">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-2xl">
        <Article
          id="story-collapsible"
          type="md"
          :content="mdContent"
          :title="articleTitle"
          max-height="200px"
        />
      </div>
    </Variant>

    <!-- 空内容 -->
    <Variant :title="emptyContentVariant">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-2xl">
        <Article
          id="story-empty"
          type="md"
          content=""
        />
      </div>
    </Variant>

    <!-- Props 文档 -->
    <Variant :title="propsTitle">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-4xl p-6">
        <h2 class="mb-4 text-2xl font-bold">{{ componentPropsTitle }}</h2>
        <div class="overflow-x-auto">
          <table class="story-table">
            <thead>
              <tr>
                <th>{{ headerName }}</th>
                <th>{{ headerType }}</th>
                <th>{{ headerDefault }}</th>
                <th>{{ headerDesc }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="prop in props" :key="prop.name">
                <td class="font-mono text-emerald-600">{{ prop.name }}</td>
                <td class="font-mono text-blue-600">{{ prop.type }}</td>
                <td class="text-muted-foreground">{{ (prop as any).default ?? '-' }}</td>
                <td>{{ useStoryLocale(prop.description) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </Variant>
  </Story>
</template>
