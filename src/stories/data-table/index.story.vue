<script setup lang="ts">
import { reactive, computed } from 'vue';
import { DataTable } from '@lionad/vtu-components';
import messages from './i18n';
import { useStoryLocale } from '../_shared/use-story-locale'

const subtitle = useStoryLocale('content.subtitle', messages);
const basic = useStoryLocale('content.basic', messages)
const withFormatting = useStoryLocale('content.withFormatting', messages)
const withStatusBadges = useStoryLocale('content.withStatusBadges', messages)
const withColumnAlignment = useStoryLocale('content.withColumnAlignment', messages)
const emptyState = useStoryLocale('content.emptyState', messages)
const withDefaultSort = useStoryLocale('content.withDefaultSort', messages)
const controlledSort = useStoryLocale('content.controlledSort', messages)
const withMaxHeight = useStoryLocale('content.withMaxHeight', messages)
const withArrayOverflow = useStoryLocale('content.withArrayOverflow', messages)
const withTextOverflow = useStoryLocale('content.withTextOverflow', messages)
const interactiveLayoutPlayground = useStoryLocale('content.interactiveLayoutPlayground', messages)
const colName = useStoryLocale('content.colName', messages)
const colStatus = useStoryLocale('content.colStatus', messages)
const colRevenue = useStoryLocale('content.colRevenue', messages)
const colPrice = useStoryLocale('content.colPrice', messages)
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
const colTags = useStoryLocale('content.colTags', messages)
const colCountry = useStoryLocale('content.colCountry', messages)
const colKeyPolicy = useStoryLocale('content.colKeyPolicy', messages)
const colLocalization = useStoryLocale('content.colLocalization', messages)
const colTarget = useStoryLocale('content.colTarget', messages)
const colScore = useStoryLocale('content.colScore', messages)
const colGrade = useStoryLocale('content.colGrade', messages)
const statusCompleted = useStoryLocale('content.statusCompleted', messages)
const statusInProgress = useStoryLocale('content.statusInProgress', messages)
const statusPending = useStoryLocale('content.statusPending', messages)
const emptyMessage = useStoryLocale('content.emptyMessage', messages)
const Name = useStoryLocale('content.name', messages)
const Type = useStoryLocale('content.type', messages)
const Default = useStoryLocale('content.default', messages)
const Description = useStoryLocale('content.description', messages)
const Props = useStoryLocale('content.props', messages)
const DataTableProps = useStoryLocale('content.dataTableProps', messages)

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

// Basic columns
const basicColumns = computed(() => [
  { key: 'name', label: colName.value, sortable: true },
  { key: 'status', label: colStatus.value, sortable: true },
  { key: 'revenue', label: colRevenue.value, sortable: true },
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

// Array overflow columns
const arrayColumns = computed<any[]>(() => [
  { key: 'project', label: colProject.value },
  { key: 'tags', label: colTags.value, format: { kind: 'array', maxVisible: 2 } },
])

// Text overflow columns
const textOverflowColumns = computed<any[]>(() => [
  { key: 'country', label: colCountry.value, width: '80px' },
  { key: 'key_policy', label: colKeyPolicy.value },
  { key: 'localization', label: colLocalization.value },
  { key: 'target', label: colTarget.value },
])

// Props documentation
const props = [
  { name: 'id', type: 'string', required: true, description: { zh: '表格的唯一标识符', en: 'Unique identifier for the data table' } },
  { name: 'columns', type: 'DataTableColumn[]', required: true, description: { zh: '列配置数组', en: 'Array of column configurations' } },
  { name: 'data', type: 'Record<string, unknown>[]', required: true, description: { zh: '表格数据数组', en: 'Array of data rows' } },
  { name: 'rowIdKey', type: 'string', description: { zh: '行唯一标识的键', en: 'Key to use as unique row identifier' } },
  { name: 'defaultSort', type: "{ by: string; direction: 'asc' | 'desc' }", description: { zh: '默认排序配置', en: 'Default sort configuration' } },
  { name: 'sort', type: "{ by: string; direction: 'asc' | 'desc' }", description: { zh: '受控排序状态', en: 'Controlled sort state' } },
  { name: 'emptyMessage', type: 'string', description: { zh: '空状态提示文本', en: 'Message displayed when data is empty' } },
  { name: 'maxHeight', type: 'string', description: { zh: '表格最大高度（例如 200px）', en: 'Maximum height of the table (e.g. 200px)' } },
  { name: 'locale', type: "'en' | 'zh'", description: { zh: '显示语言', en: 'Display locale' } },
  { name: 'layout', type: "'auto' | 'table' | 'cards'", description: { zh: '响应式布局模式', en: 'Responsive layout mode' } },
  { name: 'css', type: '{ root?: string, header?: string, body?: string, row?: string, footer?: string }', description: { zh: '组件元素的 CSS 类', en: 'CSS classes for component elements' } },
];

const headerName = Name
const headerType = Type
const headerDefault = Default
const headerDesc = Description
const propsTitle = Props
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
            { id: 9, name: 'Item 9', status: 'Active' },
            { id: 10, name: 'Item 10', status: 'Pending' },
            { id: 11, name: 'Item 11', status: 'Active' },
            { id: 12, name: 'Item 12', status: 'Completed' },
            { id: 13, name: 'Item 13', status: 'Active' },
            { id: 14, name: 'Item 14', status: 'Pending' },
            { id: 15, name: 'Item 15', status: 'Active' },
          ]"
          max-height="200px"
        />
      </div>
    </Variant>

    <Variant :title="withTextOverflow">
      <p class="mb-3 text-xs text-muted-foreground">Array overflow and text truncation with tooltip</p>
      <div class="w-full max-w-3xl space-y-6">
        <div>
          <p class="mb-2 text-sm font-medium">Array Overflow</p>
          <data-table
            id="data-table-array"
            :columns="arrayColumns"
            :data="[
              { project: 'Website Redesign', tags: ['Vue', 'Tailwind', 'TypeScript', 'Vite'] },
              { project: 'Mobile App', tags: ['React Native', 'Expo'] },
              { project: 'API Migration', tags: ['Go', 'gRPC', 'PostgreSQL', 'Docker', 'K8s'] },
            ]"
          />
        </div>
        <div>
          <p class="mb-2 text-sm font-medium">Text Truncation + Tooltip</p>
          <data-table
            id="data-table-text-overflow"
            :columns="textOverflowColumns"
            :data="[
              { country: 'Thailand', key_policy: 'EV3.5 Policy: Pure EV consumption tax reduced to 2%, but requires local battery manufacturing', localization: 'Core components such as batteries must be produced locally; for every 1 imported vehicle, 2-3 must be produced locally.', target: 'Produce 300,000 EVs by 2030, establishing Thailand as ASEAN EV production hub.' },
              { country: 'Indonesia', key_policy: 'Leveraging nickel resources to build full industrial chain from nickel to battery to vehicle', localization: 'Localization rate reaches 40% by 2026; power battery local content no less than 60%.', target: 'Ban ICE vehicle sales by 2040, becoming a global power battery manufacturing center.' },
              { country: 'Vietnam', key_policy: 'High purchase tax reduction and consumption tax incentives; Hanoi to phase out motorcycles from July 2026', localization: 'Localization rate threshold set at 30% by 2028.', target: 'Electric two-wheelers account for 25% of sales by 2030; ban ICE vehicles by 2040.' },
              { country: 'Malaysia', key_policy: 'Ending import EV road tax exemption, implementing tiered road tax; CKD models exempt from consumption tax', localization: 'Local assembly EV parts exempt from import duties until 2027; long-term guidance for local production.', target: 'EV penetration reaches 15% by 2030, 38% by 2040.' },
            ]"
            row-id-key="country"
            max-height="400px"
          />
        </div>
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

    <Variant :title="propsTitle">
      <p class="mb-3 text-xs text-muted-foreground">组件说明 / Component description</p>
      <div class="w-full max-w-4xl p-6">
        <h2 class="mb-4 text-2xl font-bold">{{ DataTableProps }}</h2>
        <div class="overflow-x-auto">
          <table class="story-table">
            <thead>
              <tr>
                <th>{{ headerName }}</th>
                <th>{{ headerType }}</th>
                <th>{{ headerDefault }}</th>
                <th>{{ headerDesc }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="prop in props" :key="prop.name">
                <td class="font-mono text-emerald-600">{{ prop.name }}</td>
                <td class="font-mono text-blue-600">{{ prop.type }}</td>
                <td class="text-muted-foreground">{{ 'default' in prop ? prop.default : '-' }}</td>
                <td>{{ useStoryLocale(prop.description) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </Variant>
  </Story>
</template>
