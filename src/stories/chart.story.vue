<script setup lang="ts">
import { reactive } from 'vue';
import { Chart } from '@lionad/components';
import type { ChartDataPoint } from '@lionad/components/chart/schema';

const chartData = reactive({
  selectedPoint: null as string | null,
});

function handleDataPointClick(point: ChartDataPoint) {
  chartData.selectedPoint = `${point.seriesLabel}: ${String(point.xValue)} = ${String(point.yValue)}`;
}
</script>

<template>
  <Story title="Chart/All Variants">
    <template #docs>
      <h2>Chart Component</h2>
      <p>Data visualization component supporting bar and line charts with interactive features.</p>

      <h3>Props</h3>
      <table>
        <thead>
          <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr><td>id</td><td>string</td><td>required</td><td>Unique identifier for the chart</td></tr>
          <tr><td>type</td><td>'bar' | 'line'</td><td>required</td><td>Chart type</td></tr>
          <tr><td>title</td><td>string</td><td>undefined</td><td>Chart title displayed in header</td></tr>
          <tr><td>description</td><td>string</td><td>undefined</td><td>Chart description displayed in header</td></tr>
          <tr><td>data</td><td>Record&lt;string, unknown>[]</td><td>required</td><td>Data array for the chart</td></tr>
          <tr><td>xKey</td><td>string</td><td>required</td><td>Key for x-axis values in data</td></tr>
          <tr><td>series</td><td>ChartSeries[]</td><td>required</td><td>Array of series configurations</td></tr>
          <tr><td>colors</td><td>string[]</td><td>undefined</td><td>Custom colors for series (defaults to CSS vars)</td></tr>
          <tr><td>showLegend</td><td>boolean</td><td>false</td><td>Whether to show the legend</td></tr>
          <tr><td>showGrid</td><td>boolean</td><td>true</td><td>Whether to show grid lines</td></tr>
          <tr><td>css</td><td>{ root?: string }</td><td>undefined</td><td>CSS classes for component elements</td></tr>
        </tbody>
      </table>

      <h3>Emits</h3>
      <table>
        <thead>
          <tr><th>Name</th><th>Payload</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr>
            <td>dataPointClick</td>
            <td>{ seriesKey, seriesLabel, xValue, yValue, index, payload }</td>
            <td>Emitted when a data point is clicked</td>
          </tr>
        </tbody>
      </table>

      <h3>Slots</h3>
      <p>This component does not expose any slots.</p>

      <h3>ChartSeries Type</h3>
      <pre><code>{
  key: string;      // Unique key for the series
  label: string;    // Display label
  color?: string;   // Optional custom color
}</code></pre>

      <h3>CSS Variables</h3>
      <p>The chart uses the following CSS variables for default colors:</p>
      <ul>
        <li><code>--chart-1</code> through <code>--chart-5</code> - Default series colors</li>
      </ul>
    </template>
    <Variant title="Line Chart">
      <div class="w-full max-w-2xl">
        <chart
          id="chart-line"
          type="line"
          title="System Performance"
          description="CPU and Memory usage over time"
          x-key="time"
          :series="[
            { key: 'cpu', label: 'CPU %' },
            { key: 'memory', label: 'Memory %' },
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

    <Variant title="Bar Chart">
      <div class="w-full max-w-2xl">
        <chart
          id="chart-bar"
          type="bar"
          title="Monthly Revenue"
          description="Revenue vs Expenses (2024)"
          x-key="month"
          :series="[
            { key: 'revenue', label: 'Revenue' },
            { key: 'expenses', label: 'Expenses' },
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

    <Variant title="Multi-Series">
      <div class="w-full max-w-2xl">
        <chart
          id="chart-multi"
          type="line"
          title="Traffic Sources"
          x-key="month"
          :series="[
            { key: 'organic', label: 'Organic' },
            { key: 'paid', label: 'Paid' },
            { key: 'social', label: 'Social' },
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

    <Variant title="With Custom Colors">
      <div class="w-full max-w-2xl">
        <chart
          id="chart-colors"
          type="bar"
          title="Performance Metrics"
          x-key="metric"
          :series="[
            { key: 'value', label: 'Score' },
          ]"
          :data="[
            { metric: 'Speed', value: 95 },
            { metric: 'Quality', value: 88 },
            { metric: 'Reliability', value: 92 },
            { metric: 'Usability', value: 85 },
          ]"
          :colors="['#3b82f6', '#10b981', '#f59e0b', '#ef4444']"
          show-legend
          show-grid
        />
      </div>
    </Variant>

    <Variant title="Interactive - Click Data Points">
      <div class="w-full max-w-2xl">
        <div v-if="chartData.selectedPoint" class="mb-4 rounded-lg bg-primary/10 p-3 text-sm">
          <strong>Clicked:</strong> {{ chartData.selectedPoint }}
        </div>
        <chart
          id="chart-interactive"
          type="bar"
          title="Clickable Chart"
          description="Click on any data point"
          x-key="month"
          :series="[
            { key: 'revenue', label: 'Revenue' },
            { key: 'expenses', label: 'Expenses' },
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

    <Variant title="Without Grid">
      <div class="w-full max-w-2xl">
        <chart
          id="chart-no-grid"
          type="bar"
          title="No Grid Lines"
          description="Clean chart without grid"
          x-key="month"
          :series="[
            { key: 'sales', label: 'Sales' },
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

    <Variant title="Without Legend">
      <div class="w-full max-w-2xl">
        <chart
          id="chart-no-legend"
          type="line"
          title="No Legend"
          description="Compact chart without legend"
          x-key="day"
          :series="[
            { key: 'visits', label: 'Visits' },
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

    <Variant title="Minimal">
      <div class="w-full max-w-2xl">
        <chart
          id="chart-minimal"
          type="bar"
          x-key="item"
          :series="[
            { key: 'value', label: 'Value' },
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

    <Variant title="Large Dataset">
      <div class="w-full max-w-2xl">
        <chart
          id="chart-large"
          type="line"
          title="Yearly Trends"
          description="Multiple data points"
          x-key="month"
          :series="[
            { key: 'revenue', label: 'Revenue' },
            { key: 'cost', label: 'Cost' },
          ]"
          :data="[
            { month: 'Jan', revenue: 4000, cost: 2400 },
            { month: 'Feb', revenue: 3000, cost: 1398 },
            { month: 'Mar', revenue: 5000, cost: 3200 },
            { month: 'Apr', revenue: 2780, cost: 3908 },
            { month: 'May', revenue: 1890, cost: 4800 },
            { month: 'Jun', revenue: 2390, cost: 3800 },
            { month: 'Jul', revenue: 3490, cost: 3300 },
            { month: 'Aug', revenue: 4200, cost: 3100 },
            { month: 'Sep', revenue: 5100, cost: 3400 },
            { month: 'Oct', revenue: 4800, cost: 3600 },
            { month: 'Nov', revenue: 5600, cost: 3200 },
            { month: 'Dec', revenue: 6200, cost: 3500 },
          ]"
          show-legend
          show-grid
        />
      </div>
    </Variant>
  </Story>
</template>
