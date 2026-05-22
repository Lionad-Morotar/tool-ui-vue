<script setup lang="ts">
import { Article } from '@lionad/vtu-components'
</script>

<template>
  <div class="space-y-6">
    <!-- 完整文章 -->
    <Article
      id="demo-article-full"
      type="md"
      :content="`## Vue 3 组合式 API 最佳实践

组合式 API（Composition API）是 Vue 3 引入的一种全新逻辑组织方式，它解决了选项式 API 在复杂组件中逻辑分散的问题。

### 核心优势

- **逻辑聚合**：相关代码自然聚集，不再被迫拆散在 data、methods、computed 中
- **类型推导**：对 TypeScript 更友好，无需额外的类型包装
- **代码复用**：通过 Composable 函数实现更灵活的逻辑复用

### 示例代码

\`\`\`ts
import { ref, computed } from 'vue'

export function useCounter() {
  const count = ref(0)
  const double = computed(() => count.value * 2)
  function increment() { count.value++ }
  return { count, double, increment }
}
\`\`\`

> 组合式 API 不是选项式 API 的替代品，而是为复杂场景提供的一种更自然的表达方式。`"
      :title="'Vue 3 组合式 API 最佳实践'"
      :description="'深入理解 Composition API 的设计理念与实际应用场景'"
      :author="{ name: '仿生狮子', avatarUrl: 'https://github.com/Lionad-Morotar.png' }"
      :tags="['Vue', 'TypeScript', 'Frontend']"
      :rate="4.5"
      created-at="2026-05-20"
      source="https://vuejs.org/guide/extras/composition-api-faq.html"
      :reading-time="6"
      :word-count="850"
    />

    <!-- 纯 Markdown 内容 -->
    <Article
      id="demo-article-md"
      type="md"
      :content="`### 快速入门

1. 安装依赖：\`npm install @lionad/vtu-components\`
2. 导入组件：\`import { Article } from '@lionad/vtu-components'\`
3. 在模板中使用 \`&lt;Article&gt;\` 标签

支持的功能包括：

- **Markdown** 渲染（GFM 语法）
- **HTML** 内容直接展示
- 封面图片、作者信息、标签
- 评分星级（0-5，支持小数）
- 折叠/展开（通过 \`maxHeight\` 控制）

| 属性 | 类型 | 必填 | 说明 |
|------|------|------|------|
| type | \`'md' | 'html'\` | 是 | 内容类型 |
| content | string | 是 | 文章内容 |`"
    />
  </div>
</template>
