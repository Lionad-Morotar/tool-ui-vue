<script setup lang="ts">
import { StatsDisplay } from '@lionad/vtu-components';
import { useStoryLocale } from './_shared/use-story-locale'

const subtitle = useStoryLocale({ zh: '统计展示组件，支持多种数字格式、趋势指示器和迷你图', en: 'Stats display with multiple number formats, trend indicators, and sparklines.' });

const basic = useStoryLocale({ zh: '基础', en: 'Basic' })
const withTrends = useStoryLocale({ zh: '含趋势', en: 'With Trends' })
const withSparklines = useStoryLocale({ zh: '含迷你图', en: 'With Sparklines' })
const singleStat = useStoryLocale({ zh: '单个统计', en: 'Single Stat' })
const currencyFormats = useStoryLocale({ zh: '货币格式', en: 'Currency Formats' })
const numberFormats = useStoryLocale({ zh: '数字格式', en: 'Number Formats' })
const percentFormats = useStoryLocale({ zh: '百分比格式', en: 'Percent Formats' })
const trendIndicators = useStoryLocale({ zh: '趋势指示器', en: 'Trend Indicators' })

// Stats labels
const revenueLabel = useStoryLocale({ zh: '收入', en: 'Revenue' })
const usersLabel = useStoryLocale({ zh: '用户', en: 'Users' })
const churnLabel = useStoryLocale({ zh: '流失率', en: 'Churn' })
const npsLabel = useStoryLocale({ zh: 'NPS', en: 'NPS' })
const activeUsersLabel = useStoryLocale({ zh: '活跃用户', en: 'Active Users' })
const churnRateLabel = useStoryLocale({ zh: '流失率', en: 'Churn Rate' })
const npsScoreLabel = useStoryLocale({ zh: 'NPS 评分', en: 'NPS Score' })

// With trends
const keyMetricsTitle = useStoryLocale({ zh: '关键指标', en: 'Key Metrics' })
const performanceOverviewDesc = useStoryLocale({ zh: '性能概览', en: 'Performance overview' })

// With sparklines
const q4PerformanceTitle = useStoryLocale({ zh: '第四季度业绩', en: 'Q4 Performance' })
const q4Desc = useStoryLocale({ zh: '2024 年 10 月至 12月', en: 'October through December 2024' })

// Currency
const financialOverviewTitle = useStoryLocale({ zh: '财务概览', en: 'Financial Overview' })

// Number formats
const usageStatisticsTitle = useStoryLocale({ zh: '使用统计', en: 'Usage Statistics' })
const totalUsersLabel = useStoryLocale({ zh: '总用户数', en: 'Total Users' })
const dailyActiveLabel = useStoryLocale({ zh: '日活跃', en: 'Daily Active' })
const avgSessionLabel = useStoryLocale({ zh: '平均会话', en: 'Average Session' })
const scoreLabel = useStoryLocale({ zh: '评分', en: 'Score' })

// Percent formats
const conversionMetricsTitle = useStoryLocale({ zh: '转化指标', en: 'Conversion Metrics' })
const conversionRateLabel = useStoryLocale({ zh: '转化率', en: 'Conversion Rate' })
const bounceRateLabel = useStoryLocale({ zh: '跳出率', en: 'Bounce Rate' })
const retentionLabel = useStoryLocale({ zh: '留存率', en: 'Retention' })
const engagementLabel = useStoryLocale({ zh: '参与度', en: 'Engagement' })

// Trend indicators
const trendAnalysisTitle = useStoryLocale({ zh: '趋势分析', en: 'Trend Analysis' })
const revenueUpIsGoodLabel = useStoryLocale({ zh: '收入（上升为好）', en: 'Revenue (up is good)' })
const costDownIsGoodLabel = useStoryLocale({ zh: '成本（下降为好）', en: 'Cost (down is good)' })
const neutralChangeLabel = useStoryLocale({ zh: '中性变化', en: 'Neutral Change' })
const errorsUpIsBadLabel = useStoryLocale({ zh: '错误（上升为坏）', en: 'Errors (up is bad)' })
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
