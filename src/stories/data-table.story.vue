<script setup lang="ts">
import { reactive } from 'vue';
import { DataTable } from '@lionad/components';

const sortableState = reactive({
  sort: { by: 'score', direction: 'desc' as 'asc' | 'desc' },
});

function handleSortChange(sort: { by?: string; direction?: 'asc' | 'desc' }) {
  if (sort.by && sort.direction) {
    sortableState.sort = { by: sort.by, direction: sort.direction };
  }
}
</script>

<template>
  <Story title="DataTable/All Variants">
    <Variant title="Basic">
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

    <Variant title="Stock Data (Delta + Currency + Percent)">
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

    <Variant title="With Formatting">
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

    <Variant title="With Status Badges">
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

    <Variant title="With Column Alignment">
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

    <Variant title="Empty State">
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

    <Variant title="With Default Sort">
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

    <Variant title="Controlled Sort" auto-props-disabled>
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

    <Variant title="With Max Height">
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

    <Variant title="Layout: Table Mode">
      <div class="w-full max-w-2xl">
        <data-table
          id="data-table-layout-table"
          layout="table"
          :columns="[
            { key: 'name', label: 'Name', sortable: true },
            { key: 'role', label: 'Role', sortable: true },
            { key: 'department', label: 'Department', sortable: true },
          ]"
          :data="[
            { name: 'Alice Johnson', role: 'Engineer', department: 'Engineering' },
            { name: 'Bob Smith', role: 'Designer', department: 'Design' },
            { name: 'Carol White', role: 'Manager', department: 'Product' },
          ]"
        />
      </div>
    </Variant>

    <Variant title="Layout: Cards Mode (Mobile View)">
      <div class="w-full max-w-md">
        <p class="mb-4 text-sm text-muted-foreground">
          Cards layout shows mobile-friendly expandable cards
        </p>
        <data-table
          id="data-table-layout-cards"
          layout="cards"
          :columns="[
            { key: 'name', label: 'Name', priority: 'primary' },
            { key: 'role', label: 'Role', priority: 'primary' },
            { key: 'department', label: 'Department', priority: 'secondary' },
            { key: 'location', label: 'Location', priority: 'secondary' },
          ]"
          :data="[
            { name: 'Alice Johnson', role: 'Senior Engineer', department: 'Engineering', location: 'San Francisco' },
            { name: 'Bob Smith', role: 'Product Designer', department: 'Design', location: 'New York' },
            { name: 'Carol White', role: 'Product Manager', department: 'Product', location: 'London' },
          ]"
        />
      </div>
    </Variant>

    <Variant title="Layout: Auto Mode (Responsive)">
      <div class="w-full max-w-2xl">
        <p class="mb-4 text-sm text-muted-foreground">
          Auto mode shows table on desktop, cards on mobile (resize viewport to see change)
        </p>
        <data-table
          id="data-table-layout-auto"
          layout="auto"
          :columns="[
            { key: 'name', label: 'Name', priority: 'primary' },
            { key: 'status', label: 'Status', priority: 'primary' },
            { key: 'revenue', label: 'Revenue', priority: 'secondary', format: { kind: 'currency', currency: 'USD' } },
            { key: 'growth', label: 'Growth', priority: 'secondary', format: { kind: 'percent', decimals: 1 } },
          ]"
          :data="[
            { name: 'Product A', status: 'Active', revenue: 125000, growth: 0.125 },
            { name: 'Product B', status: 'Draft', revenue: 78000, growth: -0.03 },
            { name: 'Product C', status: 'Active', revenue: 210000, growth: 0.28 },
          ]"
        />
      </div>
    </Variant>

    <Variant title="With Column Priority (Mobile Cards)">
      <div class="w-full max-w-md">
        <p class="mb-4 text-sm text-muted-foreground">
          Columns with priority: primary (always visible), secondary (expandable), tertiary (hidden on mobile)
        </p>
        <data-table
          id="data-table-priority"
          layout="cards"
          :columns="[
            { key: 'symbol', label: 'Symbol', priority: 'primary' },
            { key: 'price', label: 'Price', priority: 'primary', format: { kind: 'currency', currency: 'USD' } },
            { key: 'change', label: 'Change', priority: 'secondary', format: { kind: 'delta', decimals: 2 } },
            { key: 'volume', label: 'Volume', priority: 'secondary', format: { kind: 'number', compact: true } },
            { key: 'marketCap', label: 'Market Cap', priority: 'tertiary', format: { kind: 'currency', currency: 'USD', compact: true } },
          ]"
          :data="[
            { symbol: 'AAPL', price: 178.25, change: 2.35, volume: 52430000, marketCap: 2800000000000 },
            { symbol: 'MSFT', price: 380.0, change: 1.24, volume: 31250000, marketCap: 2900000000000 },
            { symbol: 'GOOGL', price: 142.5, change: -0.85, volume: 21500000, marketCap: 1800000000000 },
          ]"
          row-id-key="symbol"
        />
      </div>
    </Variant>

    <Variant title="With hideOnMobile Columns">
      <div class="w-full max-w-md">
        <p class="mb-4 text-sm text-muted-foreground">
          Columns with hideOnMobile are completely hidden in card view
        </p>
        <data-table
          id="data-table-hide-mobile"
          layout="cards"
          :columns="[
            { key: 'name', label: 'Name' },
            { key: 'email', label: 'Email', hideOnMobile: true },
            { key: 'role', label: 'Role' },
          ]"
          :data="[
            { name: 'Alice Johnson', email: 'alice@example.com', role: 'Engineer' },
            { name: 'Bob Smith', email: 'bob@example.com', role: 'Designer' },
          ]"
        />
      </div>
    </Variant>
  </Story>
</template>
