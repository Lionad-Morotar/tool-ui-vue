<script setup lang="ts">
import { computed } from 'vue';
import { DataTable } from '@lionad/vtu-components';
import messages from './i18n';
import { useStoryLocale } from '../_shared/use-story-locale'

const subtitle = useStoryLocale('content.subtitle', messages)
const withFormatting = useStoryLocale('content.withFormatting', messages)
const withStatusBadges = useStoryLocale('content.withStatusBadges', messages)
const withColumnAlignment = useStoryLocale('content.withColumnAlignment', messages)
const colProduct = useStoryLocale('data.colProduct', messages)
const colSales = useStoryLocale('content.colSales', messages)
const colRevenue = useStoryLocale('content.colRevenue', messages)
const colGrowth = useStoryLocale('content.colGrowth', messages)
const colTask = useStoryLocale('content.colTask', messages)
const colPriority = useStoryLocale('content.colPriority', messages)
const colStatus = useStoryLocale('content.colStatus', messages)
const colDueDate = useStoryLocale('content.colDueDate', messages)
const statusCompleted = useStoryLocale('content.statusCompleted', messages)
const statusInProgress = useStoryLocale('content.statusInProgress', messages)
const statusPending = useStoryLocale('content.statusPending', messages)
const colItem = useStoryLocale('data.colItem', messages)
const colQty = useStoryLocale('content.colQty', messages)
const colPrice = useStoryLocale('content.colPrice', messages)
const colTotal = useStoryLocale('content.colTotal', messages)

// Formatting columns
const formatColumns = computed<any[]>(() => [
  { key: 'product', label: colProduct.value },
  { key: 'sales', label: colSales.value, format: { kind: 'number', compact: true } },
  { key: 'revenue', label: colRevenue.value, format: { kind: 'currency', currency: 'USD' } },
  { key: 'growth', label: colGrowth.value, format: { kind: 'percent', decimals: 1 } },
])

// Status badge columns
const statusColumns = computed<any[]>(() => [
  { key: 'task', label: colTask.value },
  { key: 'priority', label: colPriority.value, format: { kind: 'badge', colorMap: { high: 'danger', medium: 'warning', low: 'info' } } },
  { key: 'status', label: colStatus.value, format: { kind: 'status', statusMap: {
    done: { tone: 'success', label: statusCompleted.value },
    progress: { tone: 'info', label: statusInProgress.value },
    pending: { tone: 'warning', label: statusPending.value },
  }}},
  { key: 'due', label: colDueDate.value, format: { kind: 'date', dateFormat: 'short' } },
])

// Alignment columns
const alignColumns = computed<any[]>(() => [
  { key: 'item', label: colItem.value },
  { key: 'quantity', label: colQty.value, align: 'center' },
  { key: 'price', label: colPrice.value, align: 'right', format: { kind: 'currency', currency: 'USD' } },
  { key: 'total', label: colTotal.value, align: 'right', format: { kind: 'currency', currency: 'USD' } },
])
</script>

<template>
  <Story title="DataTable/Formatting">
    <Variant :title="withFormatting">
      <p class="mb-3 text-xs text-muted-foreground">{{ subtitle }}</p>
      <div class="w-full max-w-2xl">
        <data-table
          id="data-table-formatted"
          :columns="formatColumns"
          :data="[
            { product: 'Widget A', sales: 15420, revenue: 125000, growth: 0.125 },
            { product: 'Widget B', sales: 8930, revenue: 78000, growth: -0.03 },
            { product: 'Widget C', sales: 22100, revenue: 210000, growth: 0.28 },
          ]"
        />
      </div>
    </Variant>

    <Variant :title="withStatusBadges">
      <p class="mb-3 text-xs text-muted-foreground">{{ subtitle }}</p>
      <div class="w-full max-w-2xl">
        <data-table
          id="data-table-badges"
          :columns="statusColumns"
          :data="[
            { task: 'Design Review', priority: 'high', status: 'done', due: '2024-01-15' },
            { task: 'API Integration', priority: 'medium', status: 'progress', due: '2024-01-20' },
            { task: 'Documentation', priority: 'low', status: 'pending', due: '2024-01-25' },
          ]"
        />
      </div>
    </Variant>

    <Variant :title="withColumnAlignment">
      <p class="mb-3 text-xs text-muted-foreground">{{ subtitle }}</p>
      <div class="w-full max-w-2xl">
        <data-table
          id="data-table-align"
          :columns="alignColumns"
          :data="[
            { item: 'Coffee Beans', quantity: 2, price: 24.00, total: 48.00 },
            { item: 'Pour-Over Set', quantity: 1, price: 45.00, total: 45.00 },
            { item: 'Mug', quantity: 4, price: 12.50, total: 50.00 },
          ]"
        />
      </div>
    </Variant>
  </Story>
</template>
