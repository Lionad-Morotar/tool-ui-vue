<script setup lang="ts">
import { reactive } from 'vue';
import { Chart } from '@lionad/vtu-components';
import messages from './i18n'
import { useStoryLocale } from '../_shared/use-story-locale'
import type { ChartDataPoint } from '@lionad/vtu-components/chart/schema';

const interactiveClickDataPoints = useStoryLocale('content.interactiveClickData', messages)
const clickableChartTitle = useStoryLocale('content.clickableChart', messages)
const clickableChartDesc = useStoryLocale('content.clickOnAny', messages)
const clickedText = useStoryLocale('content.clicked', messages)
const revenueLabel = useStoryLocale('content.revenue', messages)
const expensesLabel = useStoryLocale('content.expenses', messages)

const chartData = reactive({
  selectedPoint: null as string | null,
});

function handleDataPointClick(point: ChartDataPoint) {
  chartData.selectedPoint = `${point.seriesLabel}: ${String(point.xValue)} = ${String(point.yValue)}`;
}
</script>

<template>
  <Story title="Chart/Interactive">
    <Variant :title="interactiveClickDataPoints">
      <div class="w-full max-w-2xl">
        <div v-if="chartData.selectedPoint" class="mb-4 rounded-lg bg-primary/10 p-3 text-sm">
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
  </Story>
</template>
