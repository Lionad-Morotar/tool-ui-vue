export default {
  content: {
    name: '属性名',
    type: '类型',
    default: '默认值',
    description: '描述',
    props: '属性',
    articleProps: 'Article 属性',
    markdown: 'Markdown',
    html: 'HTML',
    fullArticle: '完整文章',
    collapsible: '可折叠',
    emptyContent: '空内容',
  },
  data: {
    articleTitle: 'Vue 3 组合式 API 最佳实践',
    articleDescription: '深入探讨 Composition API 的设计模式与性能优化策略',
    authorName: '张三',
    mdContent: `# Vue 3 组合式 API 最佳实践

## 引言

Vue 3 的 Composition API 为构建可复用、可维护的组件提供了强大的工具集。

## 核心概念

- **ref 与 reactive**：选择合适的状态声明方式
- **computed**：构建派生状态
- **watch 与 watchEffect**：响应式副作用管理

## 代码示例

\`\`\`ts
import { ref, computed } from 'vue'

const count = ref(0)
const doubled = computed(() => count.value * 2)
\`\`\`

## 总结

掌握这些模式，将帮助你写出更优雅的 Vue 3 应用。`,
    htmlContent: '<h1>HTML 内容示例</h1><p>这是一段 <strong>富文本</strong> 内容，支持 <em>各种</em> HTML 标签。</p><ul><li>列表项一</li><li>列表项二</li></ul><p><a href="https://vuejs.org">Vue.js 官网</a></p>',
  },
} as const
