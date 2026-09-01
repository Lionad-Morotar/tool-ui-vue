<script setup lang="ts">
import { StatsDisplay } from '@lionad/vtu-components';
import messages from './i18n'
import { useStoryLocale } from '../_shared/use-story-locale'

const Name = useStoryLocale('content.name', messages)
const Type = useStoryLocale('content.type', messages)
const Default = useStoryLocale('content.default', messages)
const Description = useStoryLocale('content.description', messages)
const Props = useStoryLocale('content.props', messages)
const StatsDisplayPropsTitle = useStoryLocale('content.statsDisplayProps', messages)

const headerName = Name
const headerType = Type
const headerDefault = Default
const headerDesc = Description
const propsTitle = Props
const componentPropsTitle = StatsDisplayPropsTitle

const subtitle = useStoryLocale('content.subtitle', messages);
const basic = useStoryLocale('content.basic', messages)
const threeItems = useStoryLocale('content.threeItems', messages)
const revenueLabel = useStoryLocale('content.revenueLabel', messages)
const usersLabel = useStoryLocale('content.usersLabel', messages)
const churnLabel = useStoryLocale('content.churnLabel', messages)
const npsLabel = useStoryLocale('content.npsLabel', messages)

// Props documentation
const props = [
  { name: 'id', type: 'string', required: true, description: { zh: '组件的唯一标识符', en: 'Unique identifier for the component' } },
  { name: 'role', type: "'information' | 'decision' | 'control' | 'state' | 'composite'", description: { zh: '组件的 ARIA 角色', en: 'ARIA role of the component' } },
  { name: 'title', type: 'string', description: { zh: '统计卡片的标题', en: 'Title of the stats display' } },
  { name: 'description', type: 'string', description: { zh: '统计卡片的描述', en: 'Description of the stats display' } },
  { name: 'stats', type: 'StatItem[]', required: true, description: { zh: '统计数据项数组', en: 'Array of statistical items' } },
  { name: 'css', type: '{ root?: string; header?: string; stat?: string; sparkline?: string }', description: { zh: '组件元素的 CSS 类', en: 'CSS classes for component elements' } },
  { name: 'locale', type: 'string', description: { zh: '用于数字格式化的本地化字符串', en: 'Locale string for number formatting' } },
]
</script>

<template>
  <Story title="StatsDisplay/All Variants">
    <Variant :title="basic">
      <p class="mb-3 text-xs text-muted-foreground">{{ subtitle }}</p>
      <div class="w-full max-w-2xl">
        <stats-display
          id="stats-basic"
          :stats="[
            { key: 'revenue', label: revenueLabel, value: '$48.2K' },
            { key: 'users', label: usersLabel, value: '2,420' },
            { key: 'churn', label: churnLabel, value: '2.1%' },
            { key: 'nps', label: npsLabel, value: '72' },
          ]"
        />
      </div>
    </Variant>

    <Variant :title="threeItems">
      <p class="mb-3 text-xs text-muted-foreground">{{ subtitle }}</p>
      <div class="w-full max-w-2xl">
        <stats-display
          id="stats-three"
          :stats="[
            { key: 'revenue', label: revenueLabel, value: '$48.2K' },
            { key: 'users', label: usersLabel, value: '2,420' },
            { key: 'churn', label: churnLabel, value: '2.1%' },
          ]"
        />
      </div>
    </Variant>

    <Variant :title="propsTitle">
      <p class="mb-3 text-xs text-muted-foreground">{{ subtitle }}</p>
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
