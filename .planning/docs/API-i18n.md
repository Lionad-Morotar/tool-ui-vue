# i18n API Reference

## 概述

tool-ui-vue 的多语言系统基于 Vue 3 `provide/inject` 模式，零外部依赖。

- **默认语言**：zh-CN（中文）
- **外部依赖**：无（仅依赖 Vue 3）
- **架构模式**：`LocaleProvider` 提供上下文 → `useI18n()` 注入翻译函数
- **组件兼容性**：无 LocaleProvider 时，组件以内置 zh-CN 文案 fallback 渲染

## LocaleProvider

应用级多语言上下文提供者。在组件树顶层包裹一次，所有子组件即可通过 `useI18n()` 获取翻译。

### Props

```typescript
interface LocaleProviderProps<TMessages extends Record<string, unknown>> {
  /** 语言消息对象 — 嵌套结构，如 { shared: { copy: '复制' } } */
  messages: TMessages

  /** 当前语言标识，默认 'zh-CN' */
  locale?: string
}
```

| Prop | 类型 | 默认值 | 必填 | 说明 |
|------|------|--------|------|------|
| `messages` | `TMessages` | — | 是 | 语言消息对象 |
| `locale` | `string` | `'zh-CN'` | 否 | 当前语言，改变时所有 `t()` 自动更新 |

### 使用示例

```vue
<script setup lang="ts">
import { LocaleProvider, zhCN } from '@lionad/vtu-components'
import { ref } from 'vue'

const locale = ref('zh-CN')
</script>

<template>
  <LocaleProvider :messages="zhCN" :locale="locale">
    <App />
  </LocaleProvider>
</template>
```

## useI18n()

在组件内获取翻译函数。必须在 `LocaleProvider` 后代组件中使用（或通过 `setMessages()` 设置全局消息）。

### 返回类型

```typescript
interface I18nReturn<TMessages> {
  /** 翻译函数 */
  t: <TKey extends DeepKeyPath<TMessages>>(
    key: TKey,
    params?: Record<string, ParamValue>
  ) => ComputedRef<string>

  /** 当前语言（只读） */
  locale: ComputedRef<string>

  /** 切换全局语言 */
  setLocale: (locale: string) => void
}
```

### 使用示例

```vue
<script setup lang="ts">
import { useI18n } from '@lionad/vtu-core/i18n'

// 传入消息类型，获得 key 自动补全
type Messages = { shared: { copy: string; cancel: string } }
const { t } = useI18n<Messages>()
</script>

<template>
  <button>{{ t('shared.copy') }}</button>
  <button>{{ t('shared.cancel') }}</button>
</template>
```

## t() 翻译函数

### 签名

```typescript
t(key: DeepKeyPath<TMessages>, params?: Record<string, ParamValue>): ComputedRef<string>
```

### 参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `key` | `DeepKeyPath<TMessages>` | 是 | 点分路径 key，如 `'shared.copy'` |
| `params` | `Record<string, ParamValue>` | 否 | 插值参数对象 |

### 返回值

`ComputedRef<string>` — 在 Vue 模板中自动解包，在 `<script>` 中需 `.value`。

### Key 路径

```
'shared.copy'              → messages.shared.copy
'dataTable.page'           → messages.dataTable.page
'weatherWidget.spokenUnitCelsius' → messages.weatherWidget.spokenUnitCelsius
```

### 参数插值

消息值中的 `{param}` 占位符会被替换：

```typescript
// 消息文件
// { dataTable: { page: '第 {current} / {total} 页' } }

t('dataTable.page', { current: 1, total: 3 })
// → ComputedRef<'第 1 / 3 页'>
```

支持的参数类型 (`ParamValue`)：`string`、`number`、`boolean`、`null`、`undefined`。

### 缺失 Key 行为

- **开发模式**：`console.warn('[vtu:i18n] Missing key: "...')`
- **生产模式**：返回 key 字符串本身
- **无 LocaleProvider**：fallback 到内置 zh-CN 消息

## setMessages() / setLocale()

全局状态控制函数，用于测试和简单场景。

```typescript
import { setMessages, setLocale } from '@lionad/vtu-core/i18n'

setMessages(en)      // 设置全局消息
setLocale('en')      // 切换全局语言
```

> 在 `LocaleProvider` 存在时，`setMessages` 的优先级低于 provide 的消息。

## 消息文件格式

```typescript
// zh-CN.ts
export const zhCN = {
  // 共享文案
  shared: {
    copy: '复制',
    copied: '已复制',
    cancel: '取消',
    confirm: '确认',
  },

  // 组件命名空间
  terminal: {
    copyOutput: '复制输出',
    outputCollapsed: '输出已折叠',
  },

  // 深层嵌套
  weatherWidget: {
    spokenUnitCelsius: '摄氏度',
  },
} as const
```

### 规则

1. 顶层为组件命名空间（`shared`、`terminal`、`data-table` 等）
2. 每个命名空间下可继续嵌套，叶节点必须为 `string`
3. 自定义语言文件只需保持相同 key 结构，值替换为目标语言

### 导出路径

| 路径 | 内容 |
|------|------|
| `@lionad/vtu-components` | `LocaleProvider`, `zhCN`, `en` |
| `@lionad/vtu-core/i18n` | `useI18n`, `setLocale`, `setMessages`, 类型定义 |
| `@lionad/vtu-core/i18n` | `zhCN`, `en` (locale 文件) |

## 类型定义

### DeepKeyPath\<T\>

递归提取嵌套对象的所有点分路径。

```typescript
type Keys = DeepKeyPath<{ terminal: { copy: string } }>
// 'terminal' | 'terminal.copy'
```

### DeepValueOf\<T, P\>

提取指定路径的叶值类型。

```typescript
type Val = DeepValueOf<{ terminal: { copy: string } }, 'terminal.copy'>
// string
```

### ParamValue

插值参数允许的类型。

```typescript
type ParamValue = string | number | boolean | null | undefined
```

### I18nContext\<TMessages\>

注入上下文的形状。

```typescript
interface I18nContext<TMessages> {
  messages: TMessages
  locale: string
}
```

### I18nReturn\<TMessages\>

`useI18n()` 的返回类型。

```typescript
interface I18nReturn<TMessages> {
  t: <TKey extends DeepKeyPath<TMessages>>(
    key: TKey,
    params?: Record<string, ParamValue>
  ) => ComputedRef<string>
  locale: ComputedRef<string>
  setLocale: (locale: string) => void
}
```

## 回退机制

```
t('key') 查找流程：
  1. LocaleProvider 提供的 messages[key]
  2. 如果未找到 → dev: console.warn, 返回 key 字符串
  3. 如果无 LocaleProvider → 内置 zh-CN messages[key] ?? key
```
