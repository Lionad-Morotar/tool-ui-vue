<script setup lang="ts">
import { reactive } from 'vue';
import { Chart } from '@lionad/vtu-components';
import type { ChartDataPoint } from '@lionad/vtu-components/chart/schema';
import { useStoryLocale } from '../_shared/use-story-locale'
import messages from './i18n'

const headerName = useStoryLocale('content.name', messages)
const headerType = useStoryLocale('content.type', messages)
const headerDefault = useStoryLocale('content.default', messages)
const headerDesc = useStoryLocale('content.description', messages)
const headerPayload = useStoryLocale('content.payload', messages)
const lineChart = useStoryLocale('content.lineChart', messages)
const barChart = useStoryLocale('content.barChart', messages)
const multiSeries = useStoryLocale('content.multiSeries', messages)
const withCustomColors = useStoryLocale('content.withCustomColors', messages)
const interactiveClickDataPoints = useStoryLocale('content.interactiveClickData', messages)
const withoutGrid = useStoryLocale('content.withoutGrid', messages)
const withoutLegend = useStoryLocale('content.withoutLegend', messages)
const minimal = useStoryLocale('content.minimal', messages)
const denseDataset = useStoryLocale('content.denseDataset', messages)
const systemPerfTitle = useStoryLocale('content.systemPerformance', messages)
const systemPerfDesc = useStoryLocale('content.cPUAndMemory', messages)
const cpuLabel = useStoryLocale('content.cPU', messages)
const memoryLabel = useStoryLocale('content.memory', messages)
const monthlyRevTitle = useStoryLocale('content.monthlyRevenue', messages)
const monthlyRevDesc = useStoryLocale('content.revenueVsExpenses', messages)
const revenueLabel = useStoryLocale('content.revenue', messages)
const expensesLabel = useStoryLocale('content.expenses', messages)
const trafficSourcesTitle = useStoryLocale('content.trafficSources', messages)
const organicLabel = useStoryLocale('content.organic', messages)
const paidLabel = useStoryLocale('content.paid', messages)
const socialLabel = useStoryLocale('content.social', messages)
const perfMetricsTitle = useStoryLocale('content.performanceMetrics', messages)
const speedLabel = useStoryLocale('content.speed', messages)
const qualityLabel = useStoryLocale('content.quality', messages)
const reliabilityLabel = useStoryLocale('content.reliability', messages)
const usabilityLabel = useStoryLocale('content.usability', messages)
const clickableChartTitle = useStoryLocale('content.clickableChart', messages)
const clickableChartDesc = useStoryLocale('content.clickOnAny', messages)
const clickedText = useStoryLocale('content.clicked', messages)
const noGridTitle = useStoryLocale('content.noGridLines', messages)
const noGridDesc = useStoryLocale('content.cleanChartWithout', messages)
const salesLabel = useStoryLocale('content.sales', messages)
const noLegendTitle = useStoryLocale('content.noLegend', messages)
const noLegendDesc = useStoryLocale('content.compactChartWithout', messages)
const visitsLabel = useStoryLocale('content.visits', messages)
const financialTrendsTitle = useStoryLocale('content.month24Financial', messages)
const financialTrendsDesc = useStoryLocale('content.highDensityDataset', messages)
const costLabel = useStoryLocale('content.cost', messages)
const valueLabel = useStoryLocale('content.value', messages)
const ChartComponent = useStoryLocale('content.chartComponent', messages)
const DataVisualizationComponent = useStoryLocale('content.dataVisualizationComponent', messages)
const Props = useStoryLocale('content.props', messages)
const UniqueIdentifierFor = useStoryLocale('content.uniqueIdentifierFor', messages)
const ChartType = useStoryLocale('content.chartType', messages)
const ChartTitleDisplayed = useStoryLocale('content.chartTitleDisplayed', messages)
const ChartDescriptionDisplayed = useStoryLocale('content.chartDescriptionDisplayed', messages)
const DataArrayFor = useStoryLocale('content.dataArrayFor', messages)
const KeyForX = useStoryLocale('content.keyForX', messages)
const ArrayOfSeries = useStoryLocale('content.arrayOfSeries', messages)
const CustomColorsFor = useStoryLocale('content.customColorsFor', messages)
const WhetherToShow = useStoryLocale('content.whetherToShow', messages)
const WhetherToShow1 = useStoryLocale('content.whetherToShow1', messages)
const CSSClassesFor = useStoryLocale('content.cSSClassesFor', messages)
const Emits = useStoryLocale('content.emits', messages)
const EmittedWhenA = useStoryLocale('content.emittedWhenA', messages)
const Slots = useStoryLocale('content.slots', messages)
const ThisComponentDoes = useStoryLocale('content.thisComponentDoes', messages)
const ChartSeriesType = useStoryLocale('content.chartSeriesType', messages)
const CSSVariables = useStoryLocale('content.cSSVariables', messages)
const TheChartUses = useStoryLocale('content.theChartUses', messages)

const chartData = reactive({
  selectedPoint: null as string | null,
});

function handleDataPointClick(point: ChartDataPoint) {
  chartData.selectedPoint = `${point.seriesLabel}: ${String(point.xValue)} = ${String(point.yValue)}`;
}

// Line chart

// Bar chart

// Multi-series

// Custom colors

// Interactive

// Without grid

// Without legend

// Dense dataset

</script>

<template>
  <Story title="Chart/All Variants">
    <template #docs>
      <h2>{{ ChartComponent }}</h2>
      <p>{{ DataVisualizationComponent }}</p>

      <h3>{{ Props }}</h3>
      <table class="story-table">
        <thead>
          <tr><th>{{ headerName }}</th><th>{{ headerType }}</th><th>{{ headerDefault }}</th><th>{{ headerDesc }}</th></tr>
        </thead>
        <tbody>
          <tr><td>id</td><td>string</td><td>required</td><td>{{ UniqueIdentifierFor }}</td></tr>
          <tr><td>type</td><td>'bar' | 'line'</td><td>required</td><td>{{ ChartType }}</td></tr>
          <tr><td>title</td><td>string</td><td>undefined</td><td>{{ ChartTitleDisplayed }}</td></tr>
          <tr><td>description</td><td>string</td><td>undefined</td><td>{{ ChartDescriptionDisplayed }}</td></tr>
          <tr><td>data</td><td>Record&lt;string, unknown>[]</td><td>required</td><td>{{ DataArrayFor }}</td></tr>
          <tr><td>xKey</td><td>string</td><td>required</td><td>{{ KeyForX }}</td></tr>
          <tr><td>series</td><td>ChartSeries[]</td><td>required</td><td>{{ ArrayOfSeries }}</td></tr>
          <tr><td>colors</td><td>string[]</td><td>undefined</td><td>{{ CustomColorsFor }}</td></tr>
          <tr><td>showLegend</td><td>boolean</td><td>false</td><td>{{ WhetherToShow }}</td></tr>
          <tr><td>showGrid</td><td>boolean</td><td>true</td><td>{{ WhetherToShow1 }}</td></tr>
          <tr><td>css</td><td>{ root?: string }</td><td>undefined</td><td>{{ CSSClassesFor }}</td></tr>
        </tbody>
      </table>

      <h3>{{ Emits }}</h3>
      <table class="story-table">
        <thead>
          <tr><th>{{ headerName }}</th><th>{{ headerPayload }}</th><th>{{ headerDesc }}</th></tr>
        </thead>
        <tbody>
          <tr>
            <td>dataPointClick</td>
            <td>{ seriesKey, seriesLabel, xValue, yValue, index, payload }</td>
            <td>{{ EmittedWhenA }}</td>
          </tr>
        </tbody>
      </table>

      <h3>{{ Slots }}</h3>
      <p>{{ ThisComponentDoes }}</p>

      <h3>{{ ChartSeriesType }}</h3>
      <pre><code>{
  key: string;      // Unique key for the series
  label: string;    // Display label
  color?: string;   // Optional custom color
}</code></pre>

      <h3>{{ CSSVariables }}</h3>
      <p>{{ TheChartUses }}</p>
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
