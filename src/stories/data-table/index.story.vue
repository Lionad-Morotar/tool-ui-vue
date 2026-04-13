<script setup lang="ts">
import { reactive, computed } from 'vue';
import { DataTable } from '@lionad/vtu-components';
import { useStoryLocale } from '../_shared/use-story-locale'
import messages from './i18n';

const subtitle = useStoryLocale('content.subtitle', messages);
const basic = useStoryLocale('content.basic', messages)
const stockDataDeltaCurrencyPercent = useStoryLocale('data.stockDataDeltaCurrencyPercent', messages)
const withFormatting = useStoryLocale('content.withFormatting', messages)
const withStatusBadges = useStoryLocale('content.withStatusBadges', messages)
const withColumnAlignment = useStoryLocale('content.withColumnAlignment', messages)
const emptyState = useStoryLocale('content.emptyState', messages)
const withDefaultSort = useStoryLocale('content.withDefaultSort', messages)
const controlledSort = useStoryLocale('content.controlledSort', messages)
const withMaxHeight = useStoryLocale('content.withMaxHeight', messages)
const interactiveLayoutPlayground = useStoryLocale('content.interactiveLayoutPlayground', messages)
const colName = useStoryLocale('content.colName', messages)
const colStatus = useStoryLocale('content.colStatus', messages)
const colRevenue = useStoryLocale('content.colRevenue', messages)
const colSymbol = useStoryLocale('content.colSymbol', messages)
const colCompany = useStoryLocale('content.colCompany', messages)
const colPrice = useStoryLocale('content.colPrice', messages)
const colChange = useStoryLocale('content.colChange', messages)
const colChangePercent = useStoryLocale('content.colChangePercent', messages)
const colVolume = useStoryLocale('content.colVolume', messages)
const colProduct = useStoryLocale('data.colProduct', messages)
const colSales = useStoryLocale('content.colSales', messages)
const colGrowth = useStoryLocale('content.colGrowth', messages)
const colTask = useStoryLocale('content.colTask', messages)
const colPriority = useStoryLocale('content.colPriority', messages)
const colDueDate = useStoryLocale('content.colDueDate', messages)
const colItem = useStoryLocale('data.colItem', messages)
const colQty = useStoryLocale('content.colQty', messages)
const colTotal = useStoryLocale('content.colTotal', messages)
const colId = useStoryLocale('content.colId', messages)
const colProject = useStoryLocale('content.colProject', messages)
const colOwner = useStoryLocale('content.colOwner', messages)
const colBudget = useStoryLocale('content.colBudget', messages)
const colDeadline = useStoryLocale('content.colDeadline', messages)
const colNotes = useStoryLocale('content.colNotes', messages)
const colScore = useStoryLocale('content.colScore', messages)
const colGrade = useStoryLocale('content.colGrade', messages)
const statusCompleted = useStoryLocale('content.statusCompleted', messages)
const statusInProgress = useStoryLocale('content.statusInProgress', messages)
const statusPending = useStoryLocale('content.statusPending', messages)
const emptyMessage = useStoryLocale('content.emptyMessage', messages)

const sortableState = reactive({
  sort: { by: 'score', direction: 'desc' as 'asc' | 'desc' },
});

function handleSortChange(sort: { by?: string; direction?: 'asc' | 'desc' }) {
  if (sort.by && sort.direction) {
    sortableState.sort = { by: sort.by, direction: sort.direction };
  }
}

const playgroundState = reactive({
  layout: 'cards' as 'auto' | 'table' | 'cards',
});

// Column labels

// Status badge labels

// Empty state

// Basic columns
const basicColumns = computed(() => [
  { key: 'name', label: colName.value, sortable: true },
  { key: 'status', label: colStatus.value, sortable: true },
  { key: 'revenue', label: colRevenue.value, sortable: true },
])

// Stock columns
const stockColumns = computed<any[]>(() => [
  { key: 'symbol', label: colSymbol.value, priority: 'primary' },
  { key: 'name', label: colCompany.value, priority: 'primary' },
  { key: 'price', label: colPrice.value, align: 'right', priority: 'primary', format: { kind: 'currency', currency: 'USD', decimals: 2 } },
  { key: 'change', label: colChange.value, align: 'right', priority: 'secondary', format: { kind: 'delta', decimals: 2, upIsPositive: true, showSign: true } },
  { key: 'changePercent', label: colChangePercent.value, align: 'right', priority: 'secondary', format: { kind: 'percent', decimals: 2, showSign: true, basis: 'unit' } },
  { key: 'volume', label: colVolume.value, align: 'right', priority: 'secondary', format: { kind: 'number', compact: true } },
])

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

// Empty columns
const emptyColumns = computed<any[]>(() => [
  { key: 'name', label: colName.value },
  { key: 'status', label: colStatus.value },
])

// Default sort columns
const defaultSortColumns = computed<any[]>(() => [
  { key: 'name', label: colName.value, sortable: true },
  { key: 'score', label: colScore.value, sortable: true },
])

// Controlled sort columns
const controlledSortColumns = computed<any[]>(() => [
  { key: 'name', label: colName.value, sortable: true },
  { key: 'score', label: colScore.value, sortable: true },
  { key: 'grade', label: colGrade.value, sortable: false },
])

// Max height columns
const maxHeightColumns = computed<any[]>(() => [
  { key: 'id', label: colId.value },
  { key: 'name', label: colName.value },
  { key: 'status', label: colStatus.value },
])

// Playground columns
const playgroundColumns = computed<any[]>(() => [
  { key: 'project', label: colProject.value, priority: 'primary' },
  { key: 'owner', label: colOwner.value, priority: 'primary' },
  { key: 'status', label: colStatus.value, priority: 'secondary' },
  { key: 'budget', label: colBudget.value, priority: 'secondary', format: { kind: 'currency', currency: 'USD' } },
  { key: 'deadline', label: colDeadline.value, priority: 'tertiary' },
  { key: 'notes', label: colNotes.value, hideOnMobile: true },
])
</script>

<template>
  <Story title="DataTable/All Variants">
    <Variant :title="basic">
      <p class="mb-3 text-xs text-muted-foreground">{{ subtitle }}</p>
      <div class="w-full max-w-2xl">
        <data-table
          id="data-table-basic"
          :columns="basicColumns"
          :data="[
            { name: 'Product A', status: 'Active', revenue: '$12,450' },
            { name: 'Product B', status: 'Draft', revenue: '$8,230' },
            { name: 'Product C', status: 'Active', revenue: '$24,100' },
          ]"
        />
      </div>
    </Variant>

    <Variant :title="stockDataDeltaCurrencyPercent">
      <p class="mb-3 text-xs text-muted-foreground">{{ subtitle }}</p>
      <div class="w-full max-w-3xl">
        <data-table
          id="data-table-stocks"
          :columns="stockColumns"
          :data="[
            { symbol: 'IBM', name: 'International Business Machines', price: 170.42, change: 1.12, changePercent: 0.66, volume: 18420000 },
            { symbol: 'AAPL', name: 'Apple', price: 178.25, change: 2.35, changePercent: 1.34, volume: 52430000 },
            { symbol: 'MSFT', name: 'Microsoft', price: 380.0, change: 1.24, changePercent: 0.33, volume: 31250000 },
            { symbol: 'INTC', name: 'Intel Corporation', price: 39.85, change: -0.42, changePercent: -1.04, volume: 29840000 },
            { symbol: 'ORCL', name: 'Oracle Corporation', price: 110.31, change: 0.78, changePercent: 0.71, volume: 14230000 },
          ]"
          row-id-key="symbol"
        />
      </div>
    </Variant>

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

    <Variant :title="emptyState">
      <p class="mb-3 text-xs text-muted-foreground">{{ subtitle }}</p>
      <div class="w-full max-w-2xl">
        <data-table
          id="data-table-empty"
          :columns="emptyColumns"
          :data="[]"
          :empty-message="emptyMessage"
        />
      </div>
    </Variant>

    <Variant :title="withDefaultSort">
      <p class="mb-3 text-xs text-muted-foreground">{{ subtitle }}</p>
      <div class="w-full max-w-2xl">
        <data-table
          id="data-table-sorted"
          :columns="defaultSortColumns"
          :data="[
            { name: 'Alice', score: 85 },
            { name: 'Bob', score: 92 },
            { name: 'Charlie', score: 78 },
          ]"
          :default-sort="{ by: 'score', direction: 'desc' }"
        />
      </div>
    </Variant>

    <Variant :title="controlledSort" auto-props-disabled>
      <div class="w-full max-w-2xl space-y-4">
        <div class="text-sm text-muted-foreground">
          Current sort: {{ sortableState.sort.by }} {{ sortableState.sort.direction }}
        </div>
        <data-table
          id="data-table-controlled"
          :columns="controlledSortColumns"
          :data="[
            { name: 'Alice', score: 85, grade: 'B' },
            { name: 'Bob', score: 92, grade: 'A' },
            { name: 'Charlie', score: 78, grade: 'C' },
          ]"
          :sort="sortableState.sort"
          @sort-change="handleSortChange"
        />
      </div>
    </Variant>

    <Variant :title="withMaxHeight">
      <p class="mb-3 text-xs text-muted-foreground">{{ subtitle }}</p>
      <div class="w-full max-w-2xl">
        <data-table
          id="data-table-scroll"
          :columns="maxHeightColumns"
          :data="[
            { id: 1, name: 'Item 1', status: 'Active' },
            { id: 2, name: 'Item 2', status: 'Pending' },
            { id: 3, name: 'Item 3', status: 'Active' },
            { id: 4, name: 'Item 4', status: 'Completed' },
            { id: 5, name: 'Item 5', status: 'Active' },
            { id: 6, name: 'Item 6', status: 'Pending' },
            { id: 7, name: 'Item 7', status: 'Active' },
            { id: 8, name: 'Item 8', status: 'Completed' },
          ]"
          max-height="200px"
        />
      </div>
    </Variant>

    <Variant :title="interactiveLayoutPlayground" auto-props-disabled>
      <div class="w-full max-w-2xl space-y-4">
        <p class="text-sm text-muted-foreground">
          Use the right panel to change <code>layout</code>. Default is <code>cards</code> (accordion view).
          This demo combines primary, secondary, tertiary, and hideOnMobile columns.
        </p>
        <data-table
          id="data-table-playground"
          v-bind="playgroundState"
          :columns="playgroundColumns"
          :data="[
            { project: 'Website Redesign', owner: 'Alice', status: 'In Progress', budget: 45000, deadline: '2024-03-15', notes: 'Needs brand assets' },
            { project: 'Mobile App', owner: 'Bob', status: 'Planning', budget: 120000, deadline: '2024-06-30', notes: 'iOS-first approach' },
            { project: 'API Migration', owner: 'Carol', status: 'Completed', budget: 28000, deadline: '2024-01-20', notes: 'Zero downtime' },
          ]"
          row-id-key="project"
        />
      </div>
    </Variant>
  </Story>
</template>
