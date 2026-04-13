<script setup lang="ts">
import { StatsDisplay } from '@lionad/vtu-components';
import { useStoryLocale } from './_shared/use-story-locale'
const basic = useStoryLocale({ zh: '基础', en: 'Basic' })
const withTrends = useStoryLocale({ zh: '含趋势', en: 'With Trends' })
const withSparklines = useStoryLocale({ zh: '含迷你图', en: 'With Sparklines' })
const singleStat = useStoryLocale({ zh: '单个统计', en: 'Single Stat' })
const currencyFormats = useStoryLocale({ zh: '货币格式', en: 'Currency Formats' })
const numberFormats = useStoryLocale({ zh: '数字格式', en: 'Number Formats' })
const percentFormats = useStoryLocale({ zh: '百分比格式', en: 'Percent Formats' })
const trendIndicators = useStoryLocale({ zh: '趋势指示器', en: 'Trend Indicators' })
</script>

<template>
  <Story title="StatsDisplay/All Variants">
    <Variant :title="basic">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-2xl">
        <stats-display
          id="stats-basic"
          :stats="[
            { key: 'revenue', label: 'Revenue', value: '$48.2K' },
            { key: 'users', label: 'Users', value: '2,420' },
            { key: 'churn', label: 'Churn', value: '2.1%' },
            { key: 'nps', label: 'NPS', value: '72' },
          ]"
        />
      </div>
    </Variant>

    <Variant :title="withTrends">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-2xl">
        <stats-display
          id="stats-trends"
          title="Key Metrics"
          description="Performance overview"
          :stats="[
            { key: 'revenue', label: 'Revenue', value: 48200, format: { kind: 'currency', currency: 'USD', decimals: 0 }, diff: { value: 12.5, decimals: 1 } },
            { key: 'users', label: 'Active Users', value: 2420, format: { kind: 'number', compact: true }, diff: { value: 8.2, decimals: 1 } },
            { key: 'churn', label: 'Churn Rate', value: 2.1, format: { kind: 'percent', decimals: 1, basis: 'unit' }, diff: { value: -0.5, decimals: 1, upIsPositive: false } },
            { key: 'nps', label: 'NPS Score', value: 72, format: { kind: 'number' }, diff: { value: 5, decimals: 0 } },
          ]"
        />
      </div>
    </Variant>

    <Variant :title="withSparklines">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-2xl">
        <stats-display
          id="stats-sparklines"
          title="Q4 Performance"
          description="October through December 2024"
          :stats="[
            {
              key: 'revenue',
              label: 'Revenue',
              value: 847300,
              format: { kind: 'currency', currency: 'USD', decimals: 0 },
              sparkline: {
                data: [72000, 68000, 74000, 81000, 78000, 85000, 89000, 91000, 86000, 94000, 97000, 102000],
                color: 'var(--chart-1)',
              },
              diff: { value: 12.4, decimals: 1 },
            },
            {
              key: 'active-users',
              label: 'Active Users',
              value: 24890,
              format: { kind: 'number', compact: true },
              sparkline: {
                data: [18200, 19100, 19800, 20400, 21200, 21900, 22600, 23100, 23800, 24200, 24500, 24890],
                color: 'var(--chart-3)',
              },
              diff: { value: 8.2, decimals: 1 },
            },
            {
              key: 'churn',
              label: 'Churn Rate',
              value: 2.1,
              format: { kind: 'percent', decimals: 1, basis: 'unit' },
              sparkline: {
                data: [3.2, 3.0, 2.8, 2.9, 2.7, 2.5, 2.4, 2.3, 2.2, 2.1, 2.1, 2.1],
                color: 'var(--chart-4)',
              },
              diff: { value: -0.8, decimals: 1, upIsPositive: false },
            },
            {
              key: 'nps',
              label: 'NPS Score',
              value: 72,
              format: { kind: 'number' },
              sparkline: {
                data: [58, 61, 64, 62, 65, 68, 66, 69, 70, 71, 71, 72],
                color: 'var(--chart-5)',
              },
              diff: { value: 5.0, decimals: 0 },
            },
          ]"
        />
      </div>
    </Variant>

    <Variant :title="singleStat">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-sm">
        <stats-display
          id="stats-single"
          :stats="[
            {
              key: 'active-users',
              label: 'Active Users',
              value: 1847,
              format: { kind: 'number' },
              sparkline: {
                data: [1420, 1380, 1510, 1620, 1580, 1690, 1720, 1780, 1810, 1847],
                color: 'var(--chart-1)',
              },
              diff: { value: 12.3, decimals: 1 },
            },
          ]"
        />
      </div>
    </Variant>

    <Variant :title="currencyFormats">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-2xl">
        <stats-display
          id="stats-currency"
          title="Financial Overview"
          :stats="[
            { key: 'usd', label: 'USD', value: 125000, format: { kind: 'currency', currency: 'USD', decimals: 0 } },
            { key: 'eur', label: 'EUR', value: 98000, format: { kind: 'currency', currency: 'EUR', decimals: 0 } },
            { key: 'gbp', label: 'GBP', value: 75000, format: { kind: 'currency', currency: 'GBP', decimals: 0 } },
            { key: 'jpy', label: 'JPY', value: 15000000, format: { kind: 'currency', currency: 'JPY', decimals: 0 } },
          ]"
        />
      </div>
    </Variant>

    <Variant :title="numberFormats">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-2xl">
        <stats-display
          id="stats-numbers"
          title="Usage Statistics"
          :stats="[
            { key: 'total', label: 'Total Users', value: 2458901, format: { kind: 'number', compact: true } },
            { key: 'daily', label: 'Daily Active', value: 45230, format: { kind: 'number', decimals: 0 } },
            { key: 'avg', label: 'Average Session', value: 12.5, format: { kind: 'number', decimals: 1 } },
            { key: 'score', label: 'Score', value: 98.6, format: { kind: 'number', decimals: 2 } },
          ]"
        />
      </div>
    </Variant>

    <Variant :title="percentFormats">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-2xl">
        <stats-display
          id="stats-percent"
          title="Conversion Metrics"
          :stats="[
            { key: 'conversion', label: 'Conversion Rate', value: 0.0345, format: { kind: 'percent', decimals: 2 } },
            { key: 'bounce', label: 'Bounce Rate', value: 0.42, format: { kind: 'percent', decimals: 1 } },
            { key: 'retention', label: 'Retention', value: 85, format: { kind: 'percent', decimals: 0, basis: 'unit' } },
            { key: 'engagement', label: 'Engagement', value: 0.678, format: { kind: 'percent', decimals: 1 } },
          ]"
        />
      </div>
    </Variant>

    <Variant :title="trendIndicators">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-2xl">
        <stats-display
          id="stats-trends"
          title="Trend Analysis"
          :stats="[
            { key: 'up-good', label: 'Revenue (up is good)', value: 100, diff: { value: 15, decimals: 0 } },
            { key: 'down-good', label: 'Cost (down is good)', value: 50, diff: { value: -10, decimals: 0, upIsPositive: false } },
            { key: 'neutral', label: 'Neutral Change', value: 75, diff: { value: 0, decimals: 0 } },
            { key: 'up-bad', label: 'Errors (up is bad)', value: 23, diff: { value: 8, decimals: 0, upIsPositive: false } },
          ]"
        />
      </div>
    </Variant>
  </Story>
</template>
