<script setup lang="ts">
import { reactive } from 'vue';
import { DataTable } from '@lionad/vtu-components';
import { useStoryLocale } from './_shared/use-story-locale';

const subtitle = useStoryLocale({ zh: '数据表格组件，支持排序、格式化（货币、百分比、日期）、状态徽标和响应式列优先级', en: 'Data table with sorting, formatting (currency, percent, date), status badges, and responsive column priority.' });

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
const basic = useStoryLocale({ zh: '基础', en: 'Basic' })
const stockDataDeltaCurrencyPercent = useStoryLocale({ zh: '股票数据（差值+货币+百分比）', en: 'Stock Data (Delta + Currency + Percent)' })
const withFormatting = useStoryLocale({ zh: '格式化显示', en: 'With Formatting' })
const withStatusBadges = useStoryLocale({ zh: '状态徽标', en: 'With Status Badges' })
const withColumnAlignment = useStoryLocale({ zh: '列对齐', en: 'With Column Alignment' })
const emptyState = useStoryLocale({ zh: '空状态', en: 'Empty State' })
const withDefaultSort = useStoryLocale({ zh: '默认排序', en: 'With Default Sort' })
const controlledSort = useStoryLocale({ zh: '受控排序', en: 'Controlled Sort' })
const withMaxHeight = useStoryLocale({ zh: '最大高度', en: 'With Max Height' })
const interactiveLayoutPlayground = useStoryLocale({ zh: '交互布局面板', en: 'Interactive Layout Playground' })
</script>

<template>
  <Story title="DataTable/All Variants">
    <Variant :title="basic">
      <p class="mb-3 text-xs text-muted-foreground">{{ subtitle }}</p>
      <div class="w-full max-w-2xl">
        <data-table
          id="data-table-basic"
          :columns="[
            { key: 'name', label: 'Name', sortable: true },
            { key: 'status', label: 'Status', sortable: true },
            { key: 'revenue', label: 'Revenue', sortable: true },
          ]"
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
          :columns="[
            { key: 'symbol', label: 'Symbol', priority: 'primary' },
            { key: 'name', label: 'Company', priority: 'primary' },
            { key: 'price', label: 'Price', align: 'right', priority: 'primary', format: { kind: 'currency', currency: 'USD', decimals: 2 } },
            { key: 'change', label: 'Change', align: 'right', priority: 'secondary', format: { kind: 'delta', decimals: 2, upIsPositive: true, showSign: true } },
            { key: 'changePercent', label: 'Change %', align: 'right', priority: 'secondary', format: { kind: 'percent', decimals: 2, showSign: true, basis: 'unit' } },
            { key: 'volume', label: 'Volume', align: 'right', priority: 'secondary', format: { kind: 'number', compact: true } },
          ]"
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
          :columns="[
            { key: 'product', label: 'Product' },
            { key: 'sales', label: 'Sales', format: { kind: 'number', compact: true } },
            { key: 'revenue', label: 'Revenue', format: { kind: 'currency', currency: 'USD' } },
            { key: 'growth', label: 'Growth', format: { kind: 'percent', decimals: 1 } },
          ]"
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
          :columns="[
            { key: 'task', label: 'Task' },
            { key: 'priority', label: 'Priority', format: { kind: 'badge', colorMap: { high: 'danger', medium: 'warning', low: 'info' } } },
            { key: 'status', label: 'Status', format: { kind: 'status', statusMap: {
              done: { tone: 'success', label: 'Completed' },
              progress: { tone: 'info', label: 'In Progress' },
              pending: { tone: 'warning', label: 'Pending' },
            }}},
            { key: 'due', label: 'Due Date', format: { kind: 'date', dateFormat: 'short' } },
          ]"
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
          :columns="[
            { key: 'item', label: 'Item' },
            { key: 'quantity', label: 'Qty', align: 'center' },
            { key: 'price', label: 'Price', align: 'right', format: { kind: 'currency', currency: 'USD' } },
            { key: 'total', label: 'Total', align: 'right', format: { kind: 'currency', currency: 'USD' } },
          ]"
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
          :columns="[
            { key: 'name', label: 'Name' },
            { key: 'status', label: 'Status' },
          ]"
          :data="[]"
          empty-message="No records found"
        />
      </div>
    </Variant>

    <Variant :title="withDefaultSort">
      <p class="mb-3 text-xs text-muted-foreground">{{ subtitle }}</p>
      <div class="w-full max-w-2xl">
        <data-table
          id="data-table-sorted"
          :columns="[
            { key: 'name', label: 'Name', sortable: true },
            { key: 'score', label: 'Score', sortable: true },
          ]"
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
          :columns="[
            { key: 'name', label: 'Name', sortable: true },
            { key: 'score', label: 'Score', sortable: true },
            { key: 'grade', label: 'Grade', sortable: false },
          ]"
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
          :columns="[
            { key: 'id', label: 'ID' },
            { key: 'name', label: 'Name' },
            { key: 'status', label: 'Status' },
          ]"
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
          :columns="[
            { key: 'project', label: 'Project', priority: 'primary' },
            { key: 'owner', label: 'Owner', priority: 'primary' },
            { key: 'status', label: 'Status', priority: 'secondary' },
            { key: 'budget', label: 'Budget', priority: 'secondary', format: { kind: 'currency', currency: 'USD' } },
            { key: 'deadline', label: 'Deadline', priority: 'tertiary' },
            { key: 'notes', label: 'Notes', hideOnMobile: true },
          ]"
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
