<script setup lang="ts">
import { reactive } from 'vue';
import { Chart } from '@lionad/vtu-components';
import type { ChartDataPoint } from '@lionad/vtu-components/chart/schema';
import { useStoryLocale } from './_shared/use-story-locale'

const headerName = useStoryLocale({ zh: '属性名', en: 'Name' })
const headerType = useStoryLocale({ zh: '类型', en: 'Type' })
const headerDefault = useStoryLocale({ zh: '默认值', en: 'Default' })
const headerDesc = useStoryLocale({ zh: '描述', en: 'Description' })
const headerPayload = useStoryLocale({ zh: '载荷', en: 'Payload' })

const chartData = reactive({
  selectedPoint: null as string | null,
});

function handleDataPointClick(point: ChartDataPoint) {
  chartData.selectedPoint = `${point.seriesLabel}: ${String(point.xValue)} = ${String(point.yValue)}`;
}

const lineChart = useStoryLocale({ zh: '折线图', en: 'Line Chart' })
const barChart = useStoryLocale({ zh: '柱状图', en: 'Bar Chart' })
const multiSeries = useStoryLocale({ zh: '多系列', en: 'Multi-Series' })
const withCustomColors = useStoryLocale({ zh: '自定义颜色', en: 'With Custom Colors' })
const interactiveClickDataPoints = useStoryLocale({ zh: '交互 - 点击数据点', en: 'Interactive - Click Data Points' })
const withoutGrid = useStoryLocale({ zh: '无网格', en: 'Without Grid' })
const withoutLegend = useStoryLocale({ zh: '无图例', en: 'Without Legend' })
const minimal = useStoryLocale({ zh: '极简', en: 'Minimal' })
const denseDataset = useStoryLocale({ zh: '密集数据集', en: 'Dense Dataset' })

// Line chart
const systemPerfTitle = useStoryLocale({ zh: '系统性能', en: 'System Performance' })
const systemPerfDesc = useStoryLocale({ zh: 'CPU 和内存使用率随时间变化', en: 'CPU and Memory usage over time' })
const cpuLabel = useStoryLocale({ zh: 'CPU %', en: 'CPU %' })
const memoryLabel = useStoryLocale({ zh: '内存 %', en: 'Memory %' })

// Bar chart
const monthlyRevTitle = useStoryLocale({ zh: '月度收入', en: 'Monthly Revenue' })
const monthlyRevDesc = useStoryLocale({ zh: '收入 vs 支出 (2024)', en: 'Revenue vs Expenses (2024)' })
const revenueLabel = useStoryLocale({ zh: '收入', en: 'Revenue' })
const expensesLabel = useStoryLocale({ zh: '支出', en: 'Expenses' })

// Multi-series
const trafficSourcesTitle = useStoryLocale({ zh: '流量来源', en: 'Traffic Sources' })
const organicLabel = useStoryLocale({ zh: '自然流量', en: 'Organic' })
const paidLabel = useStoryLocale({ zh: '付费流量', en: 'Paid' })
const socialLabel = useStoryLocale({ zh: '社交媒体', en: 'Social' })

// Custom colors
const perfMetricsTitle = useStoryLocale({ zh: '性能指标', en: 'Performance Metrics' })
const speedLabel = useStoryLocale({ zh: '速度', en: 'Speed' })
const qualityLabel = useStoryLocale({ zh: '质量', en: 'Quality' })
const reliabilityLabel = useStoryLocale({ zh: '可靠性', en: 'Reliability' })
const usabilityLabel = useStoryLocale({ zh: '可用性', en: 'Usability' })

// Interactive
const clickableChartTitle = useStoryLocale({ zh: '可点击图表', en: 'Clickable Chart' })
const clickableChartDesc = useStoryLocale({ zh: '点击任意数据点', en: 'Click on any data point' })
const clickedText = useStoryLocale({ zh: '已点击:', en: 'Clicked:' })

// Without grid
const noGridTitle = useStoryLocale({ zh: '无网格线', en: 'No Grid Lines' })
const noGridDesc = useStoryLocale({ zh: '干净无网格的图表', en: 'Clean chart without grid' })
const salesLabel = useStoryLocale({ zh: '销售额', en: 'Sales' })

// Without legend
const noLegendTitle = useStoryLocale({ zh: '无图例', en: 'No Legend' })
const noLegendDesc = useStoryLocale({ zh: '紧凑无图例图表', en: 'Compact chart without legend' })
const visitsLabel = useStoryLocale({ zh: '访问量', en: 'Visits' })

// Dense dataset
const financialTrendsTitle = useStoryLocale({ zh: '24 个月财务趋势', en: '24-Month Financial Trends' })
const financialTrendsDesc = useStoryLocale({ zh: '24 个数据点的高密度数据集', en: 'High-density dataset with 24 points' })
const costLabel = useStoryLocale({ zh: '成本', en: 'Cost' })
const valueLabel = useStoryLocale({ zh: '值', en: 'Value' })
</script>

<template>
  <Story title="Chart/All Variants">
    <template #docs>
      <h2>{{ useStoryLocale({ zh: 'Chart 组件', en: 'Chart Component' }) }}</h2>
      <p>{{ useStoryLocale({ zh: '支持柱状图和折线图的数据可视化组件，带交互功能。', en: 'Data visualization component supporting bar and line charts with interactive features.' }) }}</p>

      <h3>{{ useStoryLocale({ zh: '属性', en: 'Props' }) }}</h3>
      <table class="story-table">
        <thead>
          <tr><th>{{ headerName }}</th><th>{{ headerType }}</th><th>{{ headerDefault }}</th><th>{{ headerDesc }}</th></tr>
        </thead>
        <tbody>
          <tr><td>id</td><td>string</td><td>required</td><td>{{ useStoryLocale({ zh: '图表的唯一标识符', en: 'Unique identifier for the chart' }) }}</td></tr>
          <tr><td>type</td><td>'bar' | 'line'</td><td>required</td><td>{{ useStoryLocale({ zh: '图表类型', en: 'Chart type' }) }}</td></tr>
          <tr><td>title</td><td>string</td><td>undefined</td><td>{{ useStoryLocale({ zh: '显示的图表标题', en: 'Chart title displayed in header' }) }}</td></tr>
          <tr><td>description</td><td>string</td><td>undefined</td><td>{{ useStoryLocale({ zh: '显示的图表描述', en: 'Chart description displayed in header' }) }}</td></tr>
          <tr><td>data</td><td>Record&lt;string, unknown>[]</td><td>required</td><td>{{ useStoryLocale({ zh: '图表数据数组', en: 'Data array for the chart' }) }}</td></tr>
          <tr><td>xKey</td><td>string</td><td>required</td><td>{{ useStoryLocale({ zh: 'x 轴数据的键', en: 'Key for x-axis values in data' }) }}</td></tr>
          <tr><td>series</td><td>ChartSeries[]</td><td>required</td><td>{{ useStoryLocale({ zh: '系列配置数组', en: 'Array of series configurations' }) }}</td></tr>
          <tr><td>colors</td><td>string[]</td><td>undefined</td><td>{{ useStoryLocale({ zh: '系列自定义颜色（默认 CSS 变量）', en: 'Custom colors for series (defaults to CSS vars)' }) }}</td></tr>
          <tr><td>showLegend</td><td>boolean</td><td>false</td><td>{{ useStoryLocale({ zh: '是否显示图例', en: 'Whether to show the legend' }) }}</td></tr>
          <tr><td>showGrid</td><td>boolean</td><td>true</td><td>{{ useStoryLocale({ zh: '是否显示网格线', en: 'Whether to show grid lines' }) }}</td></tr>
          <tr><td>css</td><td>{ root?: string }</td><td>undefined</td><td>{{ useStoryLocale({ zh: '组件元素的 CSS 类', en: 'CSS classes for component elements' }) }}</td></tr>
        </tbody>
      </table>

      <h3>{{ useStoryLocale({ zh: '事件', en: 'Emits' }) }}</h3>
      <table class="story-table">
        <thead>
          <tr><th>{{ headerName }}</th><th>{{ headerPayload }}</th><th>{{ headerDesc }}</th></tr>
        </thead>
        <tbody>
          <tr>
            <td>dataPointClick</td>
            <td>{ seriesKey, seriesLabel, xValue, yValue, index, payload }</td>
            <td>{{ useStoryLocale({ zh: '点击数据点时触发', en: 'Emitted when a data point is clicked' }) }}</td>
          </tr>
        </tbody>
      </table>

      <h3>{{ useStoryLocale({ zh: '插槽', en: 'Slots' }) }}</h3>
      <p>{{ useStoryLocale({ zh: '此组件不暴露任何插槽。', en: 'This component does not expose any slots.' }) }}</p>

      <h3>{{ useStoryLocale({ zh: 'ChartSeries 类型', en: 'ChartSeries Type' }) }}</h3>
      <pre><code>{
  key: string;      // Unique key for the series
  label: string;    // Display label
  color?: string;   // Optional custom color
}</code></pre>

      <h3>{{ useStoryLocale({ zh: 'CSS 变量', en: 'CSS Variables' }) }}</h3>
      <p>{{ useStoryLocale({ zh: 'Chart 使用以下 CSS 变量作为默认颜色：', en: 'The chart uses the following CSS variables for default colors:' }) }}</p>
      <ul>
        <li><code>--chart-1</code> through <code>--chart-5</code> - Default series colors</li>
      </ul>
    </template>
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

    <Variant :title="barChart">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-2xl">
        <chart
          id="chart-bar"
          type="bar"
          :title="monthlyRevTitle"
          :description="monthlyRevDesc"
          x-key="month"
          :series="[
            { key: 'revenue', label: revenueLabel },
            { key: 'expenses', label: expensesLabel },
          ]"
          :data="[
            { month: 'Jan', revenue: 4000, expenses: 2400 },
            { month: 'Feb', revenue: 3000, expenses: 1398 },
            { month: 'Mar', revenue: 5000, expenses: 3200 },
            { month: 'Apr', revenue: 2780, expenses: 3908 },
            { month: 'May', revenue: 1890, expenses: 4800 },
            { month: 'Jun', revenue: 2390, expenses: 3800 },
          ]"
          :colors="['#14B8A6', '#F87171']"
          show-legend
          show-grid
        />
      </div>
    </Variant>

    <Variant :title="multiSeries">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-2xl">
        <chart
          id="chart-multi"
          type="line"
          :title="trafficSourcesTitle"
          x-key="month"
          :series="[
            { key: 'organic', label: organicLabel },
            { key: 'paid', label: paidLabel },
            { key: 'social', label: socialLabel },
          ]"
          :data="[
            { month: 'Jan', organic: 5000, paid: 3000, social: 2000 },
            { month: 'Feb', organic: 5500, paid: 3200, social: 2300 },
            { month: 'Mar', organic: 6000, paid: 3500, social: 2800 },
            { month: 'Apr', organic: 6500, paid: 3800, social: 3100 },
          ]"
          show-legend
          show-grid
        />
      </div>
    </Variant>

    <Variant :title="withCustomColors">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-2xl">
        <chart
          id="chart-colors"
          type="bar"
          :title="perfMetricsTitle"
          x-key="metric"
          :series="[
            { key: 'speed', label: speedLabel },
            { key: 'quality', label: qualityLabel },
            { key: 'reliability', label: reliabilityLabel },
            { key: 'usability', label: usabilityLabel },
          ]"
          :data="[
            { metric: 'Overview', speed: 95, quality: 88, reliability: 92, usability: 85 },
          ]"
          :colors="['#3b82f6', '#10b981', '#f59e0b', '#ef4444']"
          show-legend
          show-grid
        />
      </div>
    </Variant>

    <Variant :title="interactiveClickDataPoints">
      <div class="w-full max-w-2xl">
        <div v-if="chartData.selectedPoint" class="bg-primary/10 mb-4 p-3 rounded-lg text-sm">
          <strong>{{ clickedText }}</strong> {{ chartData.selectedPoint }}
        </div>
        <chart
          id="chart-interactive"
          type="bar"
          :title="clickableChartTitle"
          :description="clickableChartDesc"
          x-key="month"
          :series="[
            { key: 'revenue', label: revenueLabel },
            { key: 'expenses', label: expensesLabel },
          ]"
          :data="[
            { month: 'Jan', revenue: 4000, expenses: 2400 },
            { month: 'Feb', revenue: 3000, expenses: 1398 },
            { month: 'Mar', revenue: 5000, expenses: 3200 },
            { month: 'Apr', revenue: 2780, expenses: 3908 },
            { month: 'May', revenue: 1890, expenses: 4800 },
            { month: 'Jun', revenue: 2390, expenses: 3800 },
          ]"
          :colors="['#14B8A6', '#F87171']"
          show-legend
          show-grid
          @data-point-click="handleDataPointClick"
        />
      </div>
    </Variant>

    <Variant :title="withoutGrid">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-2xl">
        <chart
          id="chart-no-grid"
          type="bar"
          :title="noGridTitle"
          :description="noGridDesc"
          x-key="month"
          :series="[
            { key: 'sales', label: salesLabel },
          ]"
          :data="[
            { month: 'Jan', sales: 100 },
            { month: 'Feb', sales: 150 },
            { month: 'Mar', sales: 200 },
          ]"
          show-legend
          :show-grid="false"
        />
      </div>
    </Variant>

    <Variant :title="withoutLegend">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-2xl">
        <chart
          id="chart-no-legend"
          type="line"
          :title="noLegendTitle"
          :description="noLegendDesc"
          x-key="day"
          :series="[
            { key: 'visits', label: visitsLabel },
          ]"
          :data="[
            { day: 'Mon', visits: 120 },
            { day: 'Tue', visits: 145 },
            { day: 'Wed', visits: 132 },
            { day: 'Thu', visits: 178 },
            { day: 'Fri', visits: 195 },
          ]"
          :show-legend="false"
          show-grid
        />
      </div>
    </Variant>

    <Variant :title="minimal">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-2xl">
        <chart
          id="chart-minimal"
          type="bar"
          x-key="item"
          :series="[
            { key: 'value', label: valueLabel },
          ]"
          :data="[
            { item: 'A', value: 30 },
            { item: 'B', value: 45 },
            { item: 'C', value: 25 },
          ]"
          :show-legend="false"
          :show-grid="false"
        />
      </div>
    </Variant>

    <Variant :title="denseDataset">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-2xl">
        <chart
          id="chart-dense"
          type="line"
          :title="financialTrendsTitle"
          :description="financialTrendsDesc"
          x-key="month"
          :series="[
            { key: 'revenue', label: revenueLabel },
            { key: 'cost', label: costLabel },
          ]"
          :data="[
            { month: '2023-01', revenue: 4200, cost: 2500 },
            { month: '2023-02', revenue: 3100, cost: 1900 },
            { month: '2023-03', revenue: 5300, cost: 3100 },
            { month: '2023-04', revenue: 3900, cost: 2800 },
            { month: '2023-05', revenue: 4700, cost: 3300 },
            { month: '2023-06', revenue: 5100, cost: 3600 },
            { month: '2023-07', revenue: 6200, cost: 3900 },
            { month: '2023-08', revenue: 5800, cost: 3500 },
            { month: '2023-09', revenue: 4900, cost: 3200 },
            { month: '2023-10', revenue: 5500, cost: 3400 },
            { month: '2023-11', revenue: 6700, cost: 4100 },
            { month: '2023-12', revenue: 7200, cost: 4300 },
            { month: '2024-01', revenue: 4500, cost: 2600 },
            { month: '2024-02', revenue: 3800, cost: 2200 },
            { month: '2024-03', revenue: 5600, cost: 3400 },
            { month: '2024-04', revenue: 6100, cost: 3700 },
            { month: '2024-05', revenue: 5900, cost: 3600 },
            { month: '2024-06', revenue: 6400, cost: 3900 },
            { month: '2024-07', revenue: 7100, cost: 4200 },
            { month: '2024-08', revenue: 6800, cost: 4000 },
            { month: '2024-09', revenue: 5200, cost: 3300 },
            { month: '2024-10', revenue: 5700, cost: 3500 },
            { month: '2024-11', revenue: 7500, cost: 4500 },
            { month: '2024-12', revenue: 8100, cost: 4700 },
          ]"
          show-legend
          show-grid
        />
      </div>
    </Variant>
  </Story>
</template>
