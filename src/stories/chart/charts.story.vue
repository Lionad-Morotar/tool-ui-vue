<script setup lang="ts">
import { Chart } from '@lionad/vtu-components';
import messages from './i18n'
import { useStoryLocale } from '../_shared/use-story-locale'

const barChart = useStoryLocale('content.barChart', messages)
const multiSeries = useStoryLocale('content.multiSeries', messages)
const withCustomColors = useStoryLocale('content.withCustomColors', messages)
const denseDataset = useStoryLocale('content.denseDataset', messages)
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
const financialTrendsTitle = useStoryLocale('content.month24Financial', messages)
const financialTrendsDesc = useStoryLocale('content.highDensityDataset', messages)
const costLabel = useStoryLocale('content.cost', messages)
</script>

<template>
  <Story title="Chart/Charts">
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
