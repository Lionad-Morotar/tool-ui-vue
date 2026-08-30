<script setup lang="ts">
import { Chart } from '@lionad/vtu-components';
import messages from './i18n'
import { useStoryLocale } from '../_shared/use-story-locale'

const lineChart = useStoryLocale('content.lineChart', messages)
const systemPerfTitle = useStoryLocale('content.systemPerformance', messages)
const systemPerfDesc = useStoryLocale('content.cPUAndMemory', messages)
const cpuLabel = useStoryLocale('content.cPU', messages)
const memoryLabel = useStoryLocale('content.memory', messages)
const Name = useStoryLocale('content.name', messages)
const Type = useStoryLocale('content.type', messages)
const Default = useStoryLocale('content.default', messages)
const Description = useStoryLocale('content.description', messages)
const Props = useStoryLocale('content.props', messages)
const ChartProps = useStoryLocale('content.chartProps', messages)

const props = [
  { name: 'id', type: 'string', required: true, description: { zh: '图表的唯一标识符', en: 'Unique identifier for the chart' } },
  { name: 'type', type: "'bar' | 'line'", required: true, description: { zh: '图表类型', en: 'Chart type' } },
  { name: 'title', type: 'string', description: { zh: '显示的图表标题', en: 'Chart title displayed in header' } },
  { name: 'description', type: 'string', description: { zh: '显示的图表描述', en: 'Chart description displayed in header' } },
  { name: 'data', type: 'Record<string, unknown>[]', required: true, description: { zh: '图表数据数组', en: 'Data array for the chart' } },
  { name: 'xKey', type: 'string', required: true, description: { zh: 'x 轴数据的键', en: 'Key for x-axis values in data' } },
  { name: 'series', type: 'ChartSeries[]', required: true, description: { zh: '系列配置数组', en: 'Array of series configurations' } },
  { name: 'colors', type: 'string[]', description: { zh: '系列自定义颜色（默认 CSS 变量）', en: 'Custom colors for series (defaults to CSS vars)' } },
  { name: 'showLegend', type: 'boolean', default: 'false', description: { zh: '是否显示图例', en: 'Whether to show the legend' } },
  { name: 'showGrid', type: 'boolean', default: 'true', description: { zh: '是否显示网格线', en: 'Whether to show grid lines' } },
  { name: 'css', type: '{ root?: string, title?: string, legend?: string, canvas?: string }', description: { zh: '组件元素的 CSS 类', en: 'CSS classes for component elements' } },
];

const headerName = Name
const headerType = Type
const headerDefault = Default
const headerDesc = Description
const propsTitle = Props
</script>

<template>
  <Story title="Chart/All Variants">
    <Variant :title="lineChart">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-2xl">
        <chart
          id="chart-line"
          type="line"
          :title="systemPerfTitle"
          :description="systemPerfDesc"
          x-key="time"
          :series="[
            { key: 'cpu', label: cpuLabel },
            { key: 'memory', label: memoryLabel },
          ]"
          :data="[
            { time: '00:00', cpu: 45, memory: 62 },
            { time: '04:00', cpu: 32, memory: 58 },
            { time: '08:00', cpu: 67, memory: 71 },
            { time: '12:00', cpu: 89, memory: 85 },
            { time: '16:00', cpu: 76, memory: 79 },
            { time: '20:00', cpu: 54, memory: 68 },
          ]"
          show-legend
          show-grid
        />
      </div>
    </Variant>

    <Variant :title="propsTitle">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-4xl p-6">
        <h2 class="mb-4 text-2xl font-bold">{{ ChartProps }}</h2>
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
                <td class="text-muted-foreground">{{ prop.default || '-' }}</td>
                <td>{{ useStoryLocale(prop.description) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </Variant>
  </Story>
</template>
