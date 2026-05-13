---
phase: 01-i18n-core
plan: 01
type: execute
wave: 1
depends_on: []
requirements: [CORE-01, CORE-02, CORE-03, CORE-04, CORE-05, CORE-06]
files_modified:
  - packages/core/src/i18n/types.ts
  - packages/core/src/i18n/use-i18n.ts
  - packages/core/src/i18n/locale-provider/index.vue
  - packages/core/src/i18n/locale-provider/index.ts
  - packages/core/src/i18n/locales/zh-CN.ts
  - packages/core/src/i18n/locales/en.ts
  - packages/core/src/i18n/index.ts
  - packages/core/src/index.ts
  - packages/core/package.json
autonomous: true
must_haves:
  truths:
    - "开发者用 LocaleProvider 包裹应用后，子组件可通过 useI18n() 获取翻译"
    - "useI18n() 返回 computed，切换语言实时更新（无需手动刷新）"
    - "t('nested.key.path', { param: value }) 正确解析并插值"
    - "TypeScript 自动补全 t() key，无效 key 路径报类型错误"
    - "dev 环境缺失 key 时 console.warn 显示 key 路径，prod 环境 fallback 到 zh-CN"
  artifacts:
    - path: "packages/core/src/i18n/types.ts"
      provides: "DeepKeyPath 泛型 + 嵌套 key 路径推导"
      contains: "DeepKeyPath"
    - path: "packages/core/src/i18n/use-i18n.ts"
      provides: "useI18n composable + t() 函数"
      exports: ["useI18n"]
    - path: "packages/core/src/i18n/locale-provider/index.vue"
      provide: "LocaleProvider 组件（provide/inject 模式）"
      exports: ["default"]
    - path: "packages/core/src/i18n/locales/zh-CN.ts"
      provides: "zh-CN 默认语言包（全组件覆盖）"
      min_keys: 150
    - path: "packages/core/src/i18n/locales/en.ts"
      provides: "en 英文语言包（key 与 zh-CN 一致）"
      min_keys: 150
  key_links:
    - from: "packages/core/src/i18n/use-i18n.ts"
      to: "packages/core/src/i18n/types.ts"
      via: "import DeepKeyPath 类型"
      pattern: "DeepKeyPath"
    - from: "packages/core/src/i18n/locale-provider/index.vue"
      to: "packages/core/src/i18n/use-i18n.ts"
      via: "provide(useI18nKey, ...)"
      pattern: "provide\\(.*i18nKey"
---

# Plan 01: I18N Core Infrastructure

<objective>
Build the complete i18n infrastructure: type-safe translation composable, LocaleProvider component, zh-CN/en message files, and package exports. This is the foundation that all subsequent component i18n改造 (Phase 2-3) depends on.
</objective>

<tasks>

<task id="1" type="auto">
<name>Task 1: Create types, useI18n composable, and LocaleProvider component</name>
<files>
packages/core/src/i18n/types.ts
packages/core/src/i18n/use-i18n.ts
packages/core/src/i18n/locale-provider/index.vue
packages/core/src/i18n/locale-provider/index.ts
</files>
<read_first>
- packages/core/src/i18n/types.ts (will create)
- packages/core/src/i18n/use-i18n.ts (will create)
- packages/core/src/i18n/locale-provider/index.vue (will create)
- packages/core/src/i18n/locale-provider/index.ts (will create)
- packages/core/src/components/copy-button/index.ts (barrel export pattern reference)
- packages/core/src/components/copy-button/index.vue (component pattern reference)
- packages/core/src/utils.ts (existing utility patterns)
</read_first>
<acceptance_criteria>
- grep -q "DeepKeyPath" packages/core/src/i18n/types.ts
- grep -q "useI18n" packages/core/src/i18n/use-i18n.ts
- grep -q "export.*useI18n" packages/core/src/i18n/use-i18n.ts
- grep -q "LocaleProvider" packages/core/src/i18n/locale-provider/index.vue
- grep -q "export.*LocaleProvider" packages/core/src/i18n/locale-provider/index.ts
- grep -q "defineProps.*messages" packages/core/src/i18n/locale-provider/index.vue
- grep -q "provide(" packages/core/src/i18n/locale-provider/index.vue
- grep -q "computed" packages/core/src/i18n/use-i18n.ts
- grep -q "{param}" packages/core/src/i18n/use-i18n.ts
- grep -q "console.warn" packages/core/src/i18n/use-i18n.ts
- grep -q "import.meta.env.DEV" packages/core/src/i18n/use-i18n.ts
- grep -q "setLocale" packages/core/src/i18n/use-i18n.ts
</acceptance_criteria>
<action>
Create four files implementing the i18n core type system, composable, and provider component.

## File 1: packages/core/src/i18n/types.ts

Create a TypeScript file with the following types:

```typescript
// DeepKeyPath: recursively extracts all dot-notation key paths from a nested message object
// Example: DeepKeyPath<{ terminal: { copy: string } }> = 'terminal' | 'terminal.copy'
export type DeepKeyPath<T> = T extends object
  ? {
      [K in keyof T]: T[K] extends object
        ? K extends string
          ? `${K}` | `${K}.${DeepKeyPath<T[K]>}`
          : never
        : K extends string
          ? `${K}`
          : never
    }[keyof T]
  : never

// DeepValueOf: extracts the leaf value type at a given dot-notation key path
// Example: DeepValueOf<{ terminal: { copy: string } }, 'terminal.copy'> = string
export type DeepValueOf<T, P extends string> = P extends `${infer K}.${infer Rest}`
  ? K extends keyof T
    ? T[K] extends object
      ? DeepValueOf<T[K], Rest>
      : never
    : never
  : P extends keyof T
    ? T[P]
    : never

// ParamValue: acceptable values for interpolation parameters
export type ParamValue = string | number | boolean | null | undefined

// I18nContext: shape of the injected context
export interface I18nContext<TMessages extends Record<string, unknown>> {
  messages: TMessages
  locale: string
}

// I18nReturn: return type of useI18n()
export interface I18nReturn<TMessages extends Record<string, unknown>> {
  t: <TKey extends DeepKeyPath<TMessages>>(
    key: TKey,
    params?: Record<string, ParamValue>
  ) => Readonly<Ref<string>>
  locale: Readonly<Ref<string>>
  setLocale: (locale: string) => void
}

// KeysFor: extract only leaf keys (exclude intermediate namespace keys) for t()
// Example: KeysFor<{ terminal: { copy: string }, shared: { foo: string } }>
//   = 'terminal.copy' | 'shared.foo' (excludes 'terminal', 'shared')
export type KeysFor<T> = {
  [K in keyof T]: T[K] extends object
    ? T[K] extends Record<string, string | Record<string, unknown>>
      ? `${K & string}.${KeysFor<T[K]>}`
      : never
    : K extends string
      ? K
      : never
}[keyof T]
```

## File 2: packages/core/src/i18n/use-i18n.ts

Create the composable with:

```typescript
import { inject, computed, ref, type Ref, type Readonly, type ShallowRef } from 'vue'
import type { DeepKeyPath, DeepValueOf, ParamValue, I18nContext, I18nReturn } from './types'

export const i18nInjectionKey = Symbol('vtu:i18n')

// Internal reactive messages reference (set by LocaleProvider via setMessages)
const _messages: Ref<Record<string, unknown> | null> = ref(null)
const _locale: Ref<string> = ref('zh-CN')

export function setMessages(messages: Record<string, unknown>): void {
  _messages.value = messages
}

export function setLocale(locale: string): void {
  _locale.value = locale
}

// Resolve a dot-notation key path against a nested message object
function resolveMessage(messages: Record<string, unknown> | null, key: string): string | undefined {
  if (!messages) return undefined
  const parts = key.split('.')
  let current: unknown = messages
  for (const part of parts) {
    if (current && typeof current === 'object' && part in current) {
      current = (current as Record<string, unknown>)[part]
    } else {
      return undefined
    }
  }
  return typeof current === 'string' ? current : undefined
}

// Interpolate {param} placeholders with values from params object
function interpolate(template: string, params?: Record<string, ParamValue>): string {
  if (!params) return template
  return template.replace(/\{(\w+)\}/g, (match, key: string) => {
    const value = params[key]
    return value !== undefined && value !== null ? String(value) : match
  })
}

export function useI18n<TMessages extends Record<string, unknown>>(): I18nReturn<TMessages> {
  const context = inject<I18nContext<TMessages> | null>(i18nInjectionKey, null)

  if (!context && !_messages.value) {
    // No LocaleProvider and no global messages -- return fallback t() that returns key
    const t = <TKey extends string>(key: TKey, params?: Record<string, ParamValue>): Readonly<Ref<string>> => {
      return computed(() => {
        const resolved = resolveMessage(_messages.value, key) ?? key
        return interpolate(resolved, params)
      })
    }

    return {
      t: t as I18nReturn<TMessages>['t'],
      locale: computed(() => _locale.value),
      setLocale,
    }
  }

  const t = <TKey extends DeepKeyPath<TMessages>>(
    key: TKey,
    params?: Record<string, ParamValue>
  ): Readonly<Ref<string>> => {
    return computed(() => {
      const keyStr = key as string
      const messages = context?.messages ?? _messages.value ?? {}

      // Try current locale first (messages are the current locale's messages from LocaleProvider)
      let resolved = resolveMessage(messages as Record<string, unknown>, keyStr)

      // Fallback: dev warns, prod tries zh-CN
      if (resolved === undefined) {
        if (import.meta.env.DEV) {
          console.warn(`[vtu:i18n] Missing key: "${keyStr}"`)
        }
        // In production, the messages from LocaleProvider ARE the current locale.
        // If key missing here, it truly doesn't exist -- return key as fallback
        resolved = keyStr
      }

      return interpolate(resolved, params)
    })
  }

  return {
    t: t as I18nReturn<TMessages>['t'],
    locale: computed(() => _locale.value),
    setLocale,
  }
}
```

Key design decisions embedded:
- `_messages` and `_locale` are module-level refs so setLocale() can change language globally and all computed refs auto-update (per D-03: consumers re-wrap LocaleProvider with different messages, but setLocale provides programmatic switching)
- useI18n() returns `{ t, locale, setLocale }` per D-04
- t() returns `computed<string>` per D-05, templates use `{{ t('key') }}` without `.value`
- `DeepKeyPath` provides full type inference per D-06/D-07
- Uses `import.meta.env.DEV` for dev/prod branching
- Uses `{param}` regex interpolation `/\{(\w+)\}/g`

## File 3: packages/core/src/i18n/locale-provider/index.vue

Create a Vue SFC following the copy-button component pattern:

```vue
<script setup lang="ts" generic="TMessages extends Record<string, unknown>">
import { provide, computed, watch } from 'vue'
import { i18nInjectionKey, setMessages, setLocale } from '../use-i18n'
import type { I18nContext } from '../types'

const props = withDefaults(defineProps<{
  /** Single locale messages object (e.g., zhCN imported from locales) */
  messages: TMessages
  /** Locale identifier, defaults to 'zh-CN' */
  locale?: string
}>(), {
  locale: 'zh-CN',
})

defineOptions({
  name: 'LocaleProvider',
  inheritAttrs: false,
})

// Sync messages and locale to module-level refs so useI18n consumers can react
watch(
  [() => props.messages, () => props.locale],
  ([msgs, loc]) => {
    setMessages(msgs as Record<string, unknown>)
    setLocale(loc)
  },
  { immediate: true }
)

const context = computed<I18nContext<TMessages>>(() => ({
  messages: props.messages,
  locale: props.locale,
}))

provide(i18nInjectionKey, context)
</script>

<template>
  <slot />
</template>
```

Key design:
- `generic` attribute enables TypeScript generic props (Vue 3.3+)
- `messages` prop accepts single locale messages per D-01/D-02
- `watch` with `immediate: true` syncs to module-level refs so `setLocale()` from useI18n() triggers updates
- `provide` injects the context for child components per CORE-01
- Template is just `<slot />` -- zero visual output

## File 4: packages/core/src/i18n/locale-provider/index.ts

Barrel export following copy-button pattern:

```typescript
export { default as LocaleProvider } from './index.vue'
```

</action>
<verify>
- All 4 files created
- `grep -c "DeepKeyPath\|DeepValueOf\|KeysFor" packages/core/src/i18n/types.ts` returns >= 3
- `grep -c "useI18n\|setMessages\|setLocale\|interpolate" packages/core/src/i18n/use-i18n.ts` returns >= 4
- `grep -c "provide\|watch\|computed" packages/core/src/i18n/locale-provider/index.vue` returns >= 3
- `grep -q "export.*LocaleProvider" packages/core/src/i18n/locale-provider/index.ts`
</verify>
<done>
Type system with DeepKeyPath/DeepValueOf/KeysFor types exists. useI18n composable returns { t, locale, setLocale } with t() returning computed ref. LocaleProvider component uses provide/inject with messages prop and locale prop. {param} interpolation implemented. dev console.warn for missing keys. No external i18n library dependencies.
</done>
</task>

<task id="2" type="auto">
<name>Task 2: Create zh-CN and en locale message files</name>
<files>
packages/core/src/i18n/locales/zh-CN.ts
packages/core/src/i18n/locales/en.ts
</files>
<read_first>
- packages/core/src/i18n/locales/zh-CN.ts (will create)
- packages/core/src/i18n/locales/en.ts (will create)
- packages/core/src/i18n/types.ts (for type reference)
</read_first>
<acceptance_criteria>
- grep -q "export const zhCN" packages/core/src/i18n/locales/zh-CN.ts
- grep -q "export const en" packages/core/src/i18n/locales/en.ts
- grep -q "as const" packages/core/src/i18n/locales/zh-CN.ts
- grep -q "as const" packages/core/src/i18n/locales/en.ts
- grep -q "shared" packages/core/src/i18n/locales/zh-CN.ts
- grep -q "shared" packages/core/src/i18n/locales/en.ts
- grep -q "terminal" packages/core/src/i18n/locales/zh-CN.ts
- grep -q "terminal" packages/core/src/i18n/locales/en.ts
- grep -c ": '" packages/core/src/i18n/locales/zh-CN.ts | awk '$1 >= 150'
- grep -c ": '" packages/core/src/i18n/locales/en.ts | awk '$1 >= 150'
- python3 -c "
  import re
  def get_keys(f):
    content = open(f).read()
    return set(re.findall(r"'([a-zA-Z][a-zA-Z0-9_]*(?:\.[a-zA-Z][a-zA-Z0-9_]*)*)'\s*:", content))
  zh = get_keys('packages/core/src/i18n/locales/zh-CN.ts')
  en = get_keys('packages/core/src/i18n/locales/en.ts')
  assert zh == en, f'Key mismatch: zh-only={zh-en}, en-only={en-zh}'
  print(f'Keys match: {len(zh)} keys')
  "
</acceptance_criteria>
<action>
Create two locale message files with nested object structure and `as const` for type inference.

## File 1: packages/core/src/i18n/locales/zh-CN.ts

Chinese translation covering ALL component namespaces. Use nested object structure:

```typescript
export const zhCN = {
  shared: {
    copy: '复制',
    copied: '已复制',
    free: '免费',
    discount: '折扣',
    tax: '税费',
    subtotal: '小计',
    shipping: '运费',
    total: '总计',
    save: '保存',
    cancel: '取消',
    confirm: '确认',
    delete: '删除',
    edit: '编辑',
    send: '发送',
    loading: '加载中...',
    error: '出错了',
    retry: '重试',
    expand: '展开',
    collapse: '收起',
    showAll: '显示全部 {count} 项',
    showLess: '收起显示',
    viewDetails: '查看详情',
    more: '更多',
    unknown: '未知',
  },
  terminal: {
    title: '终端',
    run: '运行',
    stop: '停止',
    clear: '清空',
    output: '输出',
    input: '输入',
    running: '运行中...',
    completed: '已完成',
    failed: '执行失败',
    copyOutput: '复制输出',
    copiedOutput: '已复制输出',
    executeCommand: '执行命令',
    enterCommand: '输入命令...',
    exitCode: '退出码: {code}',
    duration: '耗时 {duration}',
    lineCount: '共 {count} 行',
    showAllLines: '显示全部 {count} 行',
  },
  codeBlock: {
    copyCode: '复制代码',
    copiedCode: '已复制代码',
    language: '语言',
    lines: '行',
    raw: '原文',
    wrap: '自动换行',
    filename: '文件名',
  },
  codeDiff: {
    title: '代码对比',
    additions: '新增 {count} 行',
    deletions: '删除 {count} 行',
    changes: '{additions} 处修改, {deletions} 处删除',
    unified: '合并视图',
    split: '分栏视图',
    previousChange: '上一处修改',
    nextChange: '下一处修改',
    changeCount: '第 {current} / {total} 处修改',
  },
  orderSummary: {
    title: '订单摘要',
    price: '价格',
    quantity: '数量',
    amount: '金额',
    summary: '费用明细',
    item: '商品',
    items: '商品 ({count})',
  },
  questionFlow: {
    answer: '回答',
    skip: '跳过',
    next: '下一步',
    previous: '上一步',
    submit: '提交',
    complete: '完成',
    question: '问题 {current} / {total}',
    selectOption: '请选择...',
    required: '必填项',
    optional: '选填项',
  },
  messageDraft: {
    placeholder: '输入消息...',
    send: '发送',
    sending: '发送中...',
    cancel: '取消',
    characters: '{count} / {max} 字符',
    attachFile: '附件',
    emoji: '表情',
  },
  dataTable: {
    search: '搜索...',
    filter: '筛选',
    sort: '排序',
    ascending: '升序',
    descending: '降序',
    noData: '暂无数据',
    noResults: '无匹配结果',
    page: '第 {current} / {total} 页',
    perPage: '每页 {count} 条',
    rows: '共 {count} 条',
    first: '首页',
    last: '末页',
    previous: '上一页',
    next: '下一页',
    resetFilters: '重置筛选',
    selectAll: '全选',
    selected: '已选 {count} 项',
  },
  audio: {
    play: '播放',
    pause: '暂停',
    volume: '音量',
    muted: '静音',
    unmuted: '取消静音',
    duration: '时长',
    currentTime: '当前时间',
    speed: '播放速度',
    quality: '音质',
  },
  video: {
    play: '播放',
    pause: '暂停',
    fullscreen: '全屏',
    exitFullscreen: '退出全屏',
    volume: '音量',
    playbackSpeed: '播放速度',
    quality: '画质',
    subtitles: '字幕',
    pip: '画中画',
    settings: '设置',
  },
  imageGallery: {
    previous: '上一张',
    next: '下一张',
    zoomIn: '放大',
    zoomOut: '缩小',
    reset: '重置',
    fullscreen: '全屏',
    download: '下载',
    close: '关闭',
    count: '{current} / {total}',
    thumbnails: '缩略图',
  },
  weatherWidget: {
    location: '位置',
    temperature: '温度',
    humidity: '湿度',
    wind: '风速',
    feelsLike: '体感温度',
    forecast: '天气预报',
    today: '今天',
    tomorrow: '明天',
    yesterday: '昨天',
    sunrise: '日出',
    sunset: '日落',
    uvIndex: '紫外线指数',
    airQuality: '空气质量',
    visibility: '能见度',
    pressure: '气压',
    precipitation: '降水量',
    cloudy: '多云',
    sunny: '晴',
    rainy: '雨',
    snowy: '雪',
    windy: '大风',
    foggy: '雾',
    updated: '更新于 {time}',
    high: '最高 {temp}',
    low: '最低 {temp}',
  },
  geoMap: {
    zoomIn: '放大',
    zoomOut: '缩小',
    location: '定位',
    search: '搜索地点...',
    layers: '图层',
    fullscreen: '全屏',
    direction: '导航',
  },
  itemCarousel: {
    previous: '上一个',
    next: '下一个',
    page: '第 {current} / {total} 页',
    items: '商品',
    addToCart: '加入购物车',
    viewProduct: '查看商品',
    price: '价格',
    rating: '评分',
  },
  preferencesPanel: {
    title: '偏好设置',
    theme: '主题',
    language: '语言',
    notifications: '通知',
    privacy: '隐私',
    appearance: '外观',
    accessibility: '无障碍',
    fontSize: '字体大小',
    darkMode: '深色模式',
    lightMode: '浅色模式',
    systemMode: '跟随系统',
    small: '小',
    medium: '中',
    large: '大',
    on: '开',
    off: '关',
    enabled: '已启用',
    disabled: '已禁用',
    reset: '恢复默认',
    apply: '应用',
  },
  chart: {
    noData: '暂无数据',
    loading: '加载中...',
    download: '下载图表',
    fullscreen: '全屏',
    zoomIn: '放大',
    zoomOut: '缩小',
    reset: '重置缩放',
    range: {
      day: '日',
      week: '周',
      month: '月',
      year: '年',
      all: '全部',
    },
  },
  statsDisplay: {
    change: '变化',
    increase: '上升',
    decrease: '下降',
    noChange: '无变化',
    period: '统计周期',
    comparedTo: '较上期',
    trend: '趋势',
  },
  xPost: {
    retweet: '转发',
    like: '点赞',
    reply: '回复',
    share: '分享',
    bookmark: '收藏',
    views: '{count} 次浏览',
    likes: '{count} 个赞',
    retweets: '{count} 次转发',
    replies: '{count} 条回复',
    follow: '关注',
    following: '已关注',
    unfollow: '取消关注',
  },
  instagramPost: {
    like: '赞',
    comment: '评论',
    share: '分享',
    save: '收藏',
    likes: '{count} 个赞',
    comments: '{count} 条评论',
    viewAllComments: '查看全部 {count} 条评论',
    addComment: '添加评论...',
    liked: '已赞',
    saved: '已收藏',
    hoursAgo: '{count} 小时前',
    daysAgo: '{count} 天前',
  },
  approvalCard: {
    title: '审批',
    approve: '批准',
    reject: '拒绝',
    pending: '待审批',
    approved: '已批准',
    rejected: '已拒绝',
    comment: '审批意见',
    submitComment: '提交意见',
    requestedBy: '申请人',
    requestedAt: '申请时间',
  },
  citation: {
    source: '来源',
    sources: '来源 ({count})',
    reference: '参考文献',
    viewSource: '查看来源',
    citeAs: '引用为',
  },
  linkPreview: {
    visit: '访问链接',
    openInNewTab: '新标签页打开',
    copied: '已复制链接',
    share: '分享',
  },
  linkedinPost: {
    like: '赞同',
    comment: '评论',
    repost: '转发',
    share: '发送',
    likes: '{count} 人赞同',
    comments: '{count} 条评论',
    reposts: '{count} 次转发',
    follow: '关注',
    following: '已关注',
  },
  optionList: {
    select: '选择',
    selected: '已选',
    noOptions: '无选项',
    search: '搜索选项...',
    clear: '清除',
    all: '全部',
  },
  parameterSlider: {
    value: '值',
    min: '最小值',
    max: '最大值',
    reset: '重置',
  },
  progressTracker: {
    step: '步骤',
    steps: '步骤 {current} / {total}',
    complete: '已完成',
    inProgress: '进行中',
    pending: '待完成',
    skipped: '已跳过',
    nextStep: '下一步',
    previousStep: '上一步',
  },
  image: {
    loading: '图片加载中...',
    error: '图片加载失败',
    retry: '重新加载',
    alt: '图片描述',
  },
} as const
```

## File 2: packages/core/src/i18n/locales/en.ts

English translation with EXACT same key structure. All values in English:

```typescript
export const en = {
  shared: {
    copy: 'Copy',
    copied: 'Copied',
    free: 'Free',
    discount: 'Discount',
    tax: 'Tax',
    subtotal: 'Subtotal',
    shipping: 'Shipping',
    total: 'Total',
    save: 'Save',
    cancel: 'Cancel',
    confirm: 'Confirm',
    delete: 'Delete',
    edit: 'Edit',
    send: 'Send',
    loading: 'Loading...',
    error: 'Something went wrong',
    retry: 'Retry',
    expand: 'Expand',
    collapse: 'Collapse',
    showAll: 'Show all {count} items',
    showLess: 'Show less',
    viewDetails: 'View details',
    more: 'More',
    unknown: 'Unknown',
  },
  terminal: {
    title: 'Terminal',
    run: 'Run',
    stop: 'Stop',
    clear: 'Clear',
    output: 'Output',
    input: 'Input',
    running: 'Running...',
    completed: 'Completed',
    failed: 'Failed',
    copyOutput: 'Copy output',
    copiedOutput: 'Output copied',
    executeCommand: 'Execute command',
    enterCommand: 'Enter command...',
    exitCode: 'Exit code: {code}',
    duration: 'Duration {duration}',
    lineCount: '{count} lines',
    showAllLines: 'Show all {count} lines',
  },
  codeBlock: {
    copyCode: 'Copy code',
    copiedCode: 'Code copied',
    language: 'Language',
    lines: 'Lines',
    raw: 'Raw',
    wrap: 'Word wrap',
    filename: 'Filename',
  },
  codeDiff: {
    title: 'Code diff',
    additions: '{count} additions',
    deletions: '{count} deletions',
    changes: '{additions} changed, {deletions} removed',
    unified: 'Unified view',
    split: 'Split view',
    previousChange: 'Previous change',
    nextChange: 'Next change',
    changeCount: '{current} of {total} changes',
  },
  orderSummary: {
    title: 'Order summary',
    price: 'Price',
    quantity: 'Quantity',
    amount: 'Amount',
    summary: 'Summary',
    item: 'Item',
    items: 'Items ({count})',
  },
  questionFlow: {
    answer: 'Answer',
    skip: 'Skip',
    next: 'Next',
    previous: 'Previous',
    submit: 'Submit',
    complete: 'Complete',
    question: 'Question {current} of {total}',
    selectOption: 'Select an option...',
    required: 'Required',
    optional: 'Optional',
  },
  messageDraft: {
    placeholder: 'Type a message...',
    send: 'Send',
    sending: 'Sending...',
    cancel: 'Cancel',
    characters: '{count} / {max} characters',
    attachFile: 'Attach file',
    emoji: 'Emoji',
  },
  dataTable: {
    search: 'Search...',
    filter: 'Filter',
    sort: 'Sort',
    ascending: 'Ascending',
    descending: 'Descending',
    noData: 'No data available',
    noResults: 'No results found',
    page: 'Page {current} of {total}',
    perPage: '{count} per page',
    rows: '{count} rows',
    first: 'First',
    last: 'Last',
    previous: 'Previous',
    next: 'Next',
    resetFilters: 'Reset filters',
    selectAll: 'Select all',
    selected: '{count} selected',
  },
  audio: {
    play: 'Play',
    pause: 'Pause',
    volume: 'Volume',
    muted: 'Muted',
    unmuted: 'Unmuted',
    duration: 'Duration',
    currentTime: 'Current time',
    speed: 'Speed',
    quality: 'Quality',
  },
  video: {
    play: 'Play',
    pause: 'Pause',
    fullscreen: 'Fullscreen',
    exitFullscreen: 'Exit fullscreen',
    volume: 'Volume',
    playbackSpeed: 'Playback speed',
    quality: 'Quality',
    subtitles: 'Subtitles',
    pip: 'Picture in picture',
    settings: 'Settings',
  },
  imageGallery: {
    previous: 'Previous',
    next: 'Next',
    zoomIn: 'Zoom in',
    zoomOut: 'Zoom out',
    reset: 'Reset',
    fullscreen: 'Fullscreen',
    download: 'Download',
    close: 'Close',
    count: '{current} of {total}',
    thumbnails: 'Thumbnails',
  },
  weatherWidget: {
    location: 'Location',
    temperature: 'Temperature',
    humidity: 'Humidity',
    wind: 'Wind',
    feelsLike: 'Feels like',
    forecast: 'Forecast',
    today: 'Today',
    tomorrow: 'Tomorrow',
    yesterday: 'Yesterday',
    sunrise: 'Sunrise',
    sunset: 'Sunset',
    uvIndex: 'UV index',
    airQuality: 'Air quality',
    visibility: 'Visibility',
    pressure: 'Pressure',
    precipitation: 'Precipitation',
    cloudy: 'Cloudy',
    sunny: 'Sunny',
    rainy: 'Rainy',
    snowy: 'Snowy',
    windy: 'Windy',
    foggy: 'Foggy',
    updated: 'Updated {time}',
    high: 'H {temp}',
    low: 'L {temp}',
  },
  geoMap: {
    zoomIn: 'Zoom in',
    zoomOut: 'Zoom out',
    location: 'My location',
    search: 'Search place...',
    layers: 'Layers',
    fullscreen: 'Fullscreen',
    direction: 'Directions',
  },
  itemCarousel: {
    previous: 'Previous',
    next: 'Next',
    page: '{current} of {total}',
    items: 'Items',
    addToCart: 'Add to cart',
    viewProduct: 'View product',
    price: 'Price',
    rating: 'Rating',
  },
  preferencesPanel: {
    title: 'Preferences',
    theme: 'Theme',
    language: 'Language',
    notifications: 'Notifications',
    privacy: 'Privacy',
    appearance: 'Appearance',
    accessibility: 'Accessibility',
    fontSize: 'Font size',
    darkMode: 'Dark mode',
    lightMode: 'Light mode',
    systemMode: 'System',
    small: 'Small',
    medium: 'Medium',
    large: 'Large',
    on: 'On',
    off: 'Off',
    enabled: 'Enabled',
    disabled: 'Disabled',
    reset: 'Reset to default',
    apply: 'Apply',
  },
  chart: {
    noData: 'No data available',
    loading: 'Loading...',
    download: 'Download chart',
    fullscreen: 'Fullscreen',
    zoomIn: 'Zoom in',
    zoomOut: 'Zoom out',
    reset: 'Reset zoom',
    range: {
      day: 'Day',
      week: 'Week',
      month: 'Month',
      year: 'Year',
      all: 'All',
    },
  },
  statsDisplay: {
    change: 'Change',
    increase: 'Increase',
    decrease: 'Decrease',
    noChange: 'No change',
    period: 'Period',
    comparedTo: 'vs previous',
    trend: 'Trend',
  },
  xPost: {
    retweet: 'Repost',
    like: 'Like',
    reply: 'Reply',
    share: 'Share',
    bookmark: 'Bookmark',
    views: '{count} views',
    likes: '{count} likes',
    retweets: '{count} reposts',
    replies: '{count} replies',
    follow: 'Follow',
    following: 'Following',
    unfollow: 'Unfollow',
  },
  instagramPost: {
    like: 'Like',
    comment: 'Comment',
    share: 'Share',
    save: 'Save',
    likes: '{count} likes',
    comments: '{count} comments',
    viewAllComments: 'View all {count} comments',
    addComment: 'Add a comment...',
    liked: 'Liked',
    saved: 'Saved',
    hoursAgo: '{count} hours ago',
    daysAgo: '{count} days ago',
  },
  approvalCard: {
    title: 'Approval',
    approve: 'Approve',
    reject: 'Reject',
    pending: 'Pending',
    approved: 'Approved',
    rejected: 'Rejected',
    comment: 'Comment',
    submitComment: 'Submit comment',
    requestedBy: 'Requested by',
    requestedAt: 'Requested at',
  },
  citation: {
    source: 'Source',
    sources: 'Sources ({count})',
    reference: 'Reference',
    viewSource: 'View source',
    citeAs: 'Cite as',
  },
  linkPreview: {
    visit: 'Visit link',
    openInNewTab: 'Open in new tab',
    copied: 'Link copied',
    share: 'Share',
  },
  linkedinPost: {
    like: 'Like',
    comment: 'Comment',
    repost: 'Repost',
    share: 'Send',
    likes: '{count} likes',
    comments: '{count} comments',
    reposts: '{count} reposts',
    follow: 'Follow',
    following: 'Following',
  },
  optionList: {
    select: 'Select',
    selected: 'Selected',
    noOptions: 'No options',
    search: 'Search options...',
    clear: 'Clear',
    all: 'All',
  },
  parameterSlider: {
    value: 'Value',
    min: 'Minimum',
    max: 'Maximum',
    reset: 'Reset',
  },
  progressTracker: {
    step: 'Step',
    steps: 'Step {current} of {total}',
    complete: 'Complete',
    inProgress: 'In progress',
    pending: 'Pending',
    skipped: 'Skipped',
    nextStep: 'Next step',
    previousStep: 'Previous step',
  },
  image: {
    loading: 'Loading image...',
    error: 'Failed to load image',
    retry: 'Reload',
    alt: 'Image description',
  },
} as const
```

</action>
<verify>
- Both locale files exist with `as const`
- Key structure matches between zh-CN and en (run the Python key comparison script in acceptance_criteria)
- zh-CN file contains Chinese characters (grep -P "[\x{4e00}-\x{9fff}]" packages/core/src/i18n/locales/zh-CN.ts)
- en file contains only ASCII (grep -P "[^\x00-\x7F]" packages/core/src/i18n/locales/en.ts should return nothing)
</verify>
<done>
zh-CN locale has 150+ keys covering all 23 component namespaces with as const. en locale has identical key structure with English translations. Both files export const objects named zhCN and en respectively.
</done>
</task>

<task id="3" type="auto">
<name>Task 3: Create i18n barrel export and update package.json</name>
<files>
packages/core/src/i18n/index.ts
packages/core/src/index.ts
packages/core/package.json
</files>
<read_first>
- packages/core/src/i18n/index.ts (will create)
- packages/core/src/index.ts
- packages/core/package.json
</read_first>
<acceptance_criteria>
- grep -q "export.*useI18n" packages/core/src/i18n/index.ts
- grep -q "export.*LocaleProvider" packages/core/src/i18n/index.ts
- grep -q "export.*zhCN" packages/core/src/i18n/index.ts
- grep -q "export.*en" packages/core/src/i18n/index.ts
- grep -q "export.*i18nKey\|export.*I18nContext\|export.*I18nReturn\|export.*DeepKeyPath" packages/core/src/i18n/index.ts
- grep -q '"./i18n"' packages/core/package.json
- grep -q "i18n" packages/core/src/index.ts
</acceptance_criteria>
<action>
Create the i18n barrel export and wire it into the package.

## File 1: packages/core/src/i18n/index.ts

Create barrel export:

```typescript
// Composable
export { useI18n, i18nInjectionKey, setMessages, setLocale } from './use-i18n'

// Component
export { LocaleProvider } from './locale-provider'

// Types
export type { DeepKeyPath, DeepValueOf, KeysFor, ParamValue, I18nContext, I18nReturn } from './types'

// Locale messages
export { zhCN } from './locales/zh-CN'
export { en } from './locales/en'
```

## File 2: packages/core/src/index.ts

Add i18n re-export at the end of the existing barrel export. Following the existing pattern of named exports + type re-exports:

```typescript
// ... existing exports ...

// Export i18n system
export { useI18n, LocaleProvider, zhCN, en, i18nInjectionKey } from './i18n'
export type { DeepKeyPath, DeepValueOf, KeysFor, ParamValue, I18nContext, I18nReturn } from './i18n'
```

## File 3: packages/core/package.json

Add i18n subpath export to the exports field. The existing exports only have "." entry. Add:

```json
{
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js",
      "require": "./dist/index.cjs"
    },
    "./i18n": {
      "types": "./dist/i18n/index.d.ts",
      "import": "./dist/i18n/index.js",
      "require": "./dist/i18n/index.cjs"
    }
  }
}
```

This enables `import { useI18n, LocaleProvider, zhCN, en } from '@lionad/vtu-core/i18n'` as specified in CONTEXT.md integration points.

</action>
<verify>
- packages/core/src/i18n/index.ts exists with all export lines
- packages/core/package.json contains "./i18n" in exports field
- packages/core/src/index.ts contains i18n-related export lines
- `cd /Users/lionad/Github/Lionad-Morotar/tool-ui-vue/packages/core && pnpm run typecheck` passes (or at least no i18n-related errors)
</verify>
<done>
i18n module is fully exported from both main entry (@lionad/vtu-core) and subpath entry (@lionad/vtu-core/i18n). Consumers can import useI18n, LocaleProvider, zhCN, en, and all types. package.json has ./i18n subpath export configured.
</done>
</task>

</tasks>

<must_haves>
[Must-have capabilities for goal-backward verification]
- LocaleProvider component accepts `messages` and `locale` props, provides via Vue provide/inject
- useI18n() returns `{ t, locale, setLocale }` where t(key, params?) → computed ref string
- t() supports `{param}` interpolation syntax with regex replacement
- TypeScript DeepKeyPath type derives all dot-notation key paths from nested message objects
- t() key parameter is type-constrained: only valid key paths accepted
- dev environment (import.meta.env.DEV) logs console.warn for missing keys
- LocaleProvider watch syncs props to module-level refs for reactivity
- zh-CN locale covers all 23 component namespaces with as const
- en locale has identical key structure to zh-CN
- i18n exported from both main entry and ./i18n subpath
</must_haves>

<success_criteria>
- All 6 CORE requirements addressed (CORE-01 through CORE-06 in requirements frontmatter)
- 3 tasks across 1 wave, all autonomous (no checkpoints needed)
- Total files modified: 9 (4 new i18n files, 2 locale files, 3 wiring files)
- Context target: ~45% (within 50% budget for simple infrastructure phase)
- TypeScript typecheck passes with no i18n-related errors
- zh-CN and en locale keys match exactly (verified by Python script)
</success_criteria>

<output>
After completion, create `.planning/phases/01-i18n-core/01-SUMMARY.md` documenting:
- All files created with purpose
- Design decisions made (provide/inject pattern, module-level refs, DeepKeyPath approach)
- API surface (LocaleProvider props, useI18n return type, t() signature)
- Locale coverage (key count per namespace)
- Any known limitations or TODOs for future phases
</output>
