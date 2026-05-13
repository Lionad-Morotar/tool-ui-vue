# 消费者接入指南 — i18n 多语言

本文档说明如何将 tool-ui-vue 的多语言系统集成到你的项目中。

---

## 第一步：安装组件库

```bash
pnpm add @lionad/vtu-components
```

> 如果你使用 copy-paste 模式（直接复制 `.vue` 文件），跳过此步。

## 第二步：添加 LocaleProvider

在应用根组件或路由最外层包裹 `LocaleProvider`：

```vue
<!-- App.vue -->
<script setup lang="ts">
import { LocaleProvider, zhCN } from '@lionad/vtu-components'
</script>

<template>
  <LocaleProvider :messages="zhCN" locale="zh-CN">
    <RouterView />
  </LocaleProvider>
</template>
```

**预期结果**：所有 tool-ui 组件显示中文文案。

**常见陷阱**：
- 不要在每个页面重复包裹 LocaleProvider，在 `App.vue` 包裹一次即可
- `locale` prop 必须响应式（`ref` 或 `computed`），否则切换无效

## 第三步：在自定义组件中使用 `t()`

如果你的组件也需要多语言文案：

```vue
<script setup lang="ts">
import { useI18n } from '@lionad/vtu-core/i18n'

// 定义你的消息类型（与 LocaleProvider 的 messages 类型一致）
type Messages = {
  shared: { save: string; cancel: string }
  myComponent: { title: string }
}

const { t } = useI18n<Messages>()
</script>

<template>
  <h1>{{ t('myComponent.title') }}</h1>
  <button>{{ t('shared.save') }}</button>
  <button>{{ t('shared.cancel') }}</button>
</template>
```

**预期结果**：文案从 LocaleProvider 的消息文件中读取，切换语言时自动更新。

**注意**：`t()` 返回 `ComputedRef<string>`，在 `<template>` 中自动解包，在 `<script>` 中需要 `.value`。

## 第四步：添加语言切换

```vue
<script setup lang="ts">
import { LocaleProvider, zhCN, en } from '@lionad/vtu-components'
import { ref, computed } from 'vue'

const locale = ref<'zh-CN' | 'en'>('zh-CN')
const messages = computed(() => locale.value === 'zh-CN' ? zhCN : en)
</script>

<template>
  <LocaleProvider :messages="messages" :locale="locale">
    <button @click="locale = locale === 'zh-CN' ? 'en' : 'zh-CN'">
      {{ locale === 'zh-CN' ? 'Switch to English' : '切换中文' }}
    </button>
    <YourApp />
  </LocaleProvider>
</template>
```

**预期结果**：点击按钮后，所有组件文案实时切换。

## 扩展：添加新语言

1. 创建语言文件，保持与 `zh-CN.ts` 相同的 key 结构：

```typescript
// locales/ja.ts
export const ja = {
  shared: {
    copy: 'コピー',
    copied: 'コピーしました',
    cancel: 'キャンセル',
    confirm: '確認',
    // ... 与 zh-CN.ts 完整对应
  },
  terminal: { copyOutput: '出力をコピー' },
  // ... 其他命名空间
} as const
```

2. 在 LocaleProvider 中使用：

```vue
<script setup lang="ts">
import { LocaleProvider } from '@lionad/vtu-components'
import { ja } from './locales/ja'
</script>

<template>
  <LocaleProvider :messages="ja" locale="ja">
    <YourApp />
  </LocaleProvider>
</template>
```

**不需要**导入任何核心包 — 只需 key 结构一致。

## 扩展：覆盖/自定义消息

如果需要修改部分文案而不创建完整语言文件：

```typescript
import { zhCN } from '@lionad/vtu-components'
import { deepMerge } from './utils' // 自定义深合并函数

const customZhCN = deepMerge(zhCN, {
  shared: { copy: '拷贝' }, // 覆盖"复制"文案
})

<LocaleProvider :messages="customZhCN" locale="zh-CN">
```

## 零侵入模式：不使用 i18n

如果你不配置 LocaleProvider，组件仍能正常工作：

- **行为**：组件内 `useI18n()` 自动 fallback 到内置的 zh-CN 消息
- **渲染**：显示中文文案，不显示 key 字符串
- **体积**：内置消息已打包在组件内，无额外引入
- **警告**：dev 模式下会在 console 提示建议配置 LocaleProvider（可忽略）

```vue
<!-- 不使用 LocaleProvider，组件仍正常渲染 -->
<script setup lang="ts">
import { Terminal } from '@lionad/vtu-components'
</script>

<template>
  <Terminal command="echo hello" stdout="hello" :exit-code="0" />
</template>
```

## Copy-Paste 模式

直接复制组件文件到项目（不依赖 `@lionad/vtu-components`）：

1. 复制组件目录（含 `i18n/zh-CN.ts`）到你的项目
2. 组件内 `import { useI18n }` 的路径需修改为相对路径
3. 组件自动使用自带的 `zh-CN.ts` 文件渲染

或者：复制组件 + core 的 `i18n/` 模块，无需 LocaleProvider。

---

> 完整 API 文档：[API-i18n.md](./API-i18n.md)
