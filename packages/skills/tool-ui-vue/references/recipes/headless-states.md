# Headless States

## 概述

tool-ui-vue 采用 Headless 架构：每个组件的业务逻辑抽离到 `states/` 目录的 composable 中，`index.vue` 仅负责视图绑定。

这意味着你可以直接使用 states composable 构建自定义 UI，而不使用默认组件。

## 架构

```
组件目录/
├── states/          # 纯逻辑（composable）
│   ├── index.ts     # 聚合导出
│   └── useXxx.ts    # 具体 composable
├── index.vue        # 默认 UI（调用 states）
└── schema.ts        # 数据契约
```

`index.vue` 的典型结构：

```vue
<script setup lang="ts">
import { useDataTable, type DataTableEmit, type DataTableState } from './states'

const props = defineProps<DataTableProps>()
const emit = defineEmits<DataTableEmit>()

const { sortedData, sortField, sortDirection, toggleSort } = useDataTable(props, emit)
</script>

<template>
  <!-- 纯视图绑定 -->
</template>
```

## 可用 States

### DataTable

```ts
import { useDataTable, useSort, useFormat, useLayout } from '@lionad/vtu-components/data-table/states'

// useDataTable — 主 composable
// 返回：sortedData, sortField, sortDirection, toggleSort 等

// useSort — 排序逻辑
// useFormat — 格式化逻辑
// useLayout — 列分类与布局
```

### OptionList

```ts
import { useOptionList } from '@lionad/vtu-components/option-list/states'

// 返回：selectedIds, isSelected, toggle, selectAll, clearSelection 等
```

### QuestionFlow

```ts
import { useQuestionFlow } from '@lionad/vtu-components/question-flow/states'

// 支持三种模式：progressive（渐进）、upfront（预填）、receipt（回执）
// 返回：currentStep, answers, progress, next, back, submit 等
```

### Audio / Video

```ts
import { useAudio } from '@lionad/vtu-components/audio/states'
import { useVideo } from '@lionad/vtu-components/video/states'

// 共享 composable：
// usePlayback — 播放控制（play/pause/seek/volume）
// useEvents — 媒体事件处理
```

### 其他 States

| 组件 | Composable | 主要功能 |
|------|-----------|---------|
| `Chart` | `useChart` | tooltip 状态、数据映射 |
| `CodeBlock` | `useCodeBlock` | Shiki 加载、行号计算 |
| `CodeDiff` | `useCodeDiff` | diff 算法、主题 |
| `GeoMap` | `useGeoMap` | 地图状态、标记管理 |
| `ImageGallery` | `useImageGallery`, `useGallery` | 灯箱、选中索引 |
| `ItemCarousel` | `useItemCarousel` | 滚动位置、活跃索引 |
| `ParameterSlider` | `useSlider`, `useDrag`, `useLayout`, `useVisual` | 拖拽、刻度、视觉反馈 |
| `Plan` | `usePlan` | 展开/折叠、进度计算、庆祝动画 |
| `PreferencesPanel` | `usePreferencesPanel` | 偏好值管理、dirty 状态 |
| `ProgressTracker` | `useProgressTracker` | 步骤进度、回执状态 |
| `WeatherWidget` | `useWeatherWidget` | 天气主题、效果参数、玻璃样式 |
| `InstagramPost` | `useInstagramPost` | 展开/截断状态 |
| `LinkedInPost` | `useLinkedinPost` | 展开/截断、格式化计数 |
| `XPost` | `useXPost` | 格式化计数、相对时间 |

## 自定义 UI 示例

使用 `useOptionList` 构建自定义选项 UI：

```vue
<script setup lang="ts">
import { useOptionList, type OptionListEmit } from '@lionad/vtu-components/option-list/states'
import type { OptionListProps } from '@lionad/vtu-components'

const props = defineProps<OptionListProps>()
const emit = defineEmits<OptionListEmit>()

const { selectedIds, isSelected, toggle } = useOptionList(props, emit)
</script>

<template>
  <div class="flex flex-wrap gap-2">
    <button
      v-for="option in props.options"
      :key="option.id"
      :class="isSelected(option.id) ? 'bg-primary text-white' : 'bg-muted'"
      @click="toggle(option)"
    >
      {{ option.label }}
    </button>
  </div>
</template>
```

## 设计原则

1. **States 是纯逻辑** — 不包含任何模板、样式或 DOM 操作
2. **视图自由** — 你可以用任何 UI 框架或样式方案渲染
3. **类型安全** — 所有 composable 都有完整的 TypeScript 类型导出
4. **可测试** — 纯逻辑更容易编写单元测试，无需挂载 Vue 组件
