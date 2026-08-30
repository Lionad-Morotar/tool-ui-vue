<script setup lang="ts">
import { Chart } from '@lionad/vtu-components';
import messages from './i18n'
import { useStoryLocale } from '../_shared/use-story-locale'

const withoutGrid = useStoryLocale('content.withoutGrid', messages)
const withoutLegend = useStoryLocale('content.withoutLegend', messages)
const minimal = useStoryLocale('content.minimal', messages)
const noGridTitle = useStoryLocale('content.noGridLines', messages)
const noGridDesc = useStoryLocale('content.cleanChartWithout', messages)
const salesLabel = useStoryLocale('content.sales', messages)
const noLegendTitle = useStoryLocale('content.noLegend', messages)
const noLegendDesc = useStoryLocale('content.compactChartWithout', messages)
const visitsLabel = useStoryLocale('content.visits', messages)
const valueLabel = useStoryLocale('content.value', messages)
</script>

<template>
  <Story title="Chart/Minimal">
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
  </Story>
</template>
