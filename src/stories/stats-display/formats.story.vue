<script setup lang="ts">
import { computed } from 'vue';
import { StatsDisplay } from '@lionad/vtu-components';
import messages from './i18n'
import { useStoryLocale } from '../_shared/use-story-locale'

const subtitle = useStoryLocale('content.subtitle', messages);
const currencyFormats = useStoryLocale('content.currencyFormats', messages)
const numberFormats = useStoryLocale('content.numberFormats', messages)
const percentFormats = useStoryLocale('content.percentFormats', messages)
const booleanFormat = useStoryLocale('content.booleanFormat', messages)
const hoursLabel = useStoryLocale('content.hoursLabel', messages)
const itemsLabel = useStoryLocale('content.itemsLabel', messages)
const distanceLabel = useStoryLocale('content.distanceLabel', messages)
const isActiveLabel = useStoryLocale('content.isActiveLabel', messages)
const isEnabledLabel = useStoryLocale('content.isEnabledLabel', messages)
const serverStatusLabel = useStoryLocale('content.serverStatusLabel', messages)
const financialOverviewTitle = useStoryLocale('content.financialOverviewTitle', messages)
const usdLabel = useStoryLocale('content.usdLabel', messages)
const eurLabel = useStoryLocale('content.eurLabel', messages)
const gbpLabel = useStoryLocale('content.gbpLabel', messages)
const jpyLabel = useStoryLocale('content.jpyLabel', messages)
const usageStatisticsTitle = useStoryLocale('content.usageStatisticsTitle', messages)
const totalUsersLabel = useStoryLocale('content.totalUsersLabel', messages)
const dailyActiveLabel = useStoryLocale('content.dailyActiveLabel', messages)
const scoreLabel = useStoryLocale('content.scoreLabel', messages)
const conversionMetricsTitle = useStoryLocale('content.conversionMetricsTitle', messages)
const conversionRateLabel = useStoryLocale('content.conversionRateLabel', messages)
const bounceRateLabel = useStoryLocale('content.bounceRateLabel', messages)
const retentionLabel = useStoryLocale('content.retentionLabel', messages)
const engagementLabel = useStoryLocale('content.engagementLabel', messages)
const trendAnalysisTitle = useStoryLocale('content.trendAnalysisTitle', messages)
const neutralChangeLabel = useStoryLocale('content.neutralChangeLabel', messages)

// Currency format stats
const currencyStats = computed<any[]>(() => [
  { key: 'usd', label: usdLabel.value, value: 125000, format: { kind: 'currency', currency: 'USD', decimals: 0 } },
  { key: 'eur', label: eurLabel.value, value: 98000, format: { kind: 'currency', currency: 'EUR', decimals: 0 } },
  { key: 'gbp', label: gbpLabel.value, value: 75000, format: { kind: 'currency', currency: 'GBP', decimals: 0 } },
  { key: 'jpy', label: jpyLabel.value, value: 15000000, format: { kind: 'currency', currency: 'JPY', decimals: 0 } },
])
</script>

<template>
  <Story title="StatsDisplay/Formats">
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
            { key: 'items', label: itemsLabel, value: 1520, format: { kind: 'number', compact: true, unit: '个' } },
            { key: 'distance', label: distanceLabel, value: 42.5, format: { kind: 'number', decimals: 1, unit: 'km' } },
            { key: 'hours', label: hoursLabel, value: 24, format: { kind: 'number', decimals: 0, unit: 'h' } },
            { key: 'score', label: scoreLabel, value: 98.6, format: { kind: 'number', decimals: 2, unit: '分' } },
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

    <Variant :title="booleanFormat">
      <p class="mb-3 text-xs text-muted-foreground">{{ subtitle }}</p>
      <div class="w-full max-w-2xl">
        <stats-display
          id="stats-boolean"
          :title="trendAnalysisTitle"
          :stats="[
            { key: 'active', label: isActiveLabel, value: true, format: { kind: 'boolean', labels: { true: '是', false: '否' } } },
            { key: 'enabled', label: isEnabledLabel, value: false, format: { kind: 'boolean', labels: { true: '已启用', false: '已禁用' } } },
            { key: 'status', label: serverStatusLabel, value: 1, format: { kind: 'boolean', labels: { true: '在线', false: '离线' } } },
            { key: 'neutral', label: neutralChangeLabel, value: 0, format: { kind: 'boolean', labels: { true: '有变化', false: '无变化' } } },
          ]"
        />
      </div>
    </Variant>
  </Story>
</template>
