<script setup lang="ts">
import { computed } from 'vue';
import { StatsDisplay } from '@lionad/vtu-components';
import { useStoryLocale } from '../_shared/use-story-locale'
import messages from './i18n'

const subtitle = useStoryLocale('content.subtitle', messages);
const basic = useStoryLocale('content.basic', messages)
const withTrends = useStoryLocale('content.withTrends', messages)
const withSparklines = useStoryLocale('content.withSparklines', messages)
const singleStat = useStoryLocale('content.singleStat', messages)
const currencyFormats = useStoryLocale('content.currencyFormats', messages)
const numberFormats = useStoryLocale('content.numberFormats', messages)
const percentFormats = useStoryLocale('content.percentFormats', messages)
const trendIndicators = useStoryLocale('content.trendIndicators', messages)
const revenueLabel = useStoryLocale('content.revenueLabel', messages)
const usersLabel = useStoryLocale('content.usersLabel', messages)
const churnLabel = useStoryLocale('content.churnLabel', messages)
const npsLabel = useStoryLocale('content.npsLabel', messages)
const activeUsersLabel = useStoryLocale('content.activeUsersLabel', messages)
const churnRateLabel = useStoryLocale('content.churnRateLabel', messages)
const npsScoreLabel = useStoryLocale('content.npsScoreLabel', messages)
const keyMetricsTitle = useStoryLocale('content.keyMetricsTitle', messages)
const performanceOverviewDesc = useStoryLocale('content.performanceOverviewDesc', messages)
const q4PerformanceTitle = useStoryLocale('content.q4PerformanceTitle', messages)
const q4Desc = useStoryLocale('content.q4Desc', messages)
const financialOverviewTitle = useStoryLocale('content.financialOverviewTitle', messages)
const usdLabel = useStoryLocale('content.usdLabel', messages)
const eurLabel = useStoryLocale('content.eurLabel', messages)
const gbpLabel = useStoryLocale('content.gbpLabel', messages)
const jpyLabel = useStoryLocale('content.jpyLabel', messages)
const usageStatisticsTitle = useStoryLocale('content.usageStatisticsTitle', messages)
const totalUsersLabel = useStoryLocale('content.totalUsersLabel', messages)
const dailyActiveLabel = useStoryLocale('content.dailyActiveLabel', messages)
const avgSessionLabel = useStoryLocale('content.avgSessionLabel', messages)
const scoreLabel = useStoryLocale('content.scoreLabel', messages)
const conversionMetricsTitle = useStoryLocale('content.conversionMetricsTitle', messages)
const conversionRateLabel = useStoryLocale('content.conversionRateLabel', messages)
const bounceRateLabel = useStoryLocale('content.bounceRateLabel', messages)
const retentionLabel = useStoryLocale('content.retentionLabel', messages)
const engagementLabel = useStoryLocale('content.engagementLabel', messages)
const trendAnalysisTitle = useStoryLocale('content.trendAnalysisTitle', messages)
const revenueUpIsGoodLabel = useStoryLocale('content.revenueUpIsGoodLabel', messages)
const costDownIsGoodLabel = useStoryLocale('content.costDownIsGoodLabel', messages)
const neutralChangeLabel = useStoryLocale('content.neutralChangeLabel', messages)
const errorsUpIsBadLabel = useStoryLocale('content.errorsUpIsBadLabel', messages)

// Stats labels

// With trends

// With sparklines

// Currency

// Number formats

// Percent formats

// Trend indicators

// Currency format stats
const currencyStats = computed<any[]>(() => [
  { key: 'usd', label: usdLabel.value, value: 125000, format: { kind: 'currency', currency: 'USD', decimals: 0 } },
  { key: 'eur', label: eurLabel.value, value: 98000, format: { kind: 'currency', currency: 'EUR', decimals: 0 } },
  { key: 'gbp', label: gbpLabel.value, value: 75000, format: { kind: 'currency', currency: 'GBP', decimals: 0 } },
  { key: 'jpy', label: jpyLabel.value, value: 15000000, format: { kind: 'currency', currency: 'JPY', decimals: 0 } },
])
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

    <Variant :title="withTrends">
      <p class="mb-3 text-xs text-muted-foreground">{{ subtitle }}</p>
      <div class="w-full max-w-2xl">
        <stats-display
          id="stats-trends"
          :title="keyMetricsTitle"
          :description="performanceOverviewDesc"
          :stats="[
            { key: 'revenue', label: revenueLabel, value: 48200, format: { kind: 'currency', currency: 'USD', decimals: 0 }, diff: { value: 12.5, decimals: 1 } },
            { key: 'users', label: activeUsersLabel, value: 2420, format: { kind: 'number', compact: true }, diff: { value: 8.2, decimals: 1 } },
            { key: 'churn', label: churnRateLabel, value: 2.1, format: { kind: 'percent', decimals: 1, basis: 'unit' }, diff: { value: -0.5, decimals: 1, upIsPositive: false } },
            { key: 'nps', label: npsScoreLabel, value: 72, format: { kind: 'number' }, diff: { value: 5, decimals: 0 } },
          ]"
        />
      </div>
    </Variant>

    <Variant :title="withSparklines">
      <p class="mb-3 text-xs text-muted-foreground">{{ subtitle }}</p>
      <div class="w-full max-w-2xl">
        <stats-display
          id="stats-sparklines"
          :title="q4PerformanceTitle"
          :description="q4Desc"
          :stats="[
            {
              key: 'revenue',
              label: revenueLabel,
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
              label: activeUsersLabel,
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
              label: churnRateLabel,
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
              label: npsScoreLabel,
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
      <p class="mb-3 text-xs text-muted-foreground">{{ subtitle }}</p>
      <div class="w-full max-w-sm">
        <stats-display
          id="stats-single"
          :stats="[
            {
              key: 'active-users',
              label: activeUsersLabel,
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
      <p class="mb-3 text-xs text-muted-foreground">{{ subtitle }}</p>
      <div class="w-full max-w-2xl">
        <stats-display
          id="stats-currency"
          :title="financialOverviewTitle"
          :stats="currencyStats"
        />
      </div>
    </Variant>

    <Variant :title="numberFormats">
      <p class="mb-3 text-xs text-muted-foreground">{{ subtitle }}</p>
      <div class="w-full max-w-2xl">
        <stats-display
          id="stats-numbers"
          :title="usageStatisticsTitle"
          :stats="[
            { key: 'total', label: totalUsersLabel, value: 2458901, format: { kind: 'number', compact: true } },
            { key: 'daily', label: dailyActiveLabel, value: 45230, format: { kind: 'number', decimals: 0 } },
            { key: 'avg', label: avgSessionLabel, value: 12.5, format: { kind: 'number', decimals: 1 } },
            { key: 'score', label: scoreLabel, value: 98.6, format: { kind: 'number', decimals: 2 } },
          ]"
        />
      </div>
    </Variant>

    <Variant :title="percentFormats">
      <p class="mb-3 text-xs text-muted-foreground">{{ subtitle }}</p>
      <div class="w-full max-w-2xl">
        <stats-display
          id="stats-percent"
          :title="conversionMetricsTitle"
          :stats="[
            { key: 'conversion', label: conversionRateLabel, value: 0.0345, format: { kind: 'percent', decimals: 2 } },
            { key: 'bounce', label: bounceRateLabel, value: 0.42, format: { kind: 'percent', decimals: 1 } },
            { key: 'retention', label: retentionLabel, value: 85, format: { kind: 'percent', decimals: 0, basis: 'unit' } },
            { key: 'engagement', label: engagementLabel, value: 0.678, format: { kind: 'percent', decimals: 1 } },
          ]"
        />
      </div>
    </Variant>

    <Variant :title="trendIndicators">
      <p class="mb-3 text-xs text-muted-foreground">{{ subtitle }}</p>
      <div class="w-full max-w-2xl">
        <stats-display
          id="stats-trend-analysis"
          :title="trendAnalysisTitle"
          :stats="[
            { key: 'up-good', label: revenueUpIsGoodLabel, value: 100, diff: { value: 15, decimals: 0 } },
            { key: 'down-good', label: costDownIsGoodLabel, value: 50, diff: { value: -10, decimals: 0, upIsPositive: false } },
            { key: 'neutral', label: neutralChangeLabel, value: 75, diff: { value: 0, decimals: 0 } },
            { key: 'up-bad', label: errorsUpIsBadLabel, value: 23, diff: { value: 8, decimals: 0, upIsPositive: false } },
          ]"
        />
      </div>
    </Variant>
  </Story>
</template>
