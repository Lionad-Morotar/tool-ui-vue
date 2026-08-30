<script setup lang="ts">
import { computed } from 'vue';
import { DataTable } from '@lionad/vtu-components';
import messages from './i18n';
import { useStoryLocale } from '../_shared/use-story-locale'

const subtitle = useStoryLocale('content.subtitle', messages);
const basic = useStoryLocale('content.basic', messages)
const colName = useStoryLocale('content.colName', messages)
const colStatus = useStoryLocale('content.colStatus', messages)
const colRevenue = useStoryLocale('content.colRevenue', messages)
const Name = useStoryLocale('content.name', messages)
const Type = useStoryLocale('content.type', messages)
const Default = useStoryLocale('content.default', messages)
const Description = useStoryLocale('content.description', messages)
const DataTableProps = useStoryLocale('content.dataTableProps', messages)

// Basic columns
const basicColumns = computed(() => [
  { key: 'name', label: colName.value, sortable: true },
  { key: 'status', label: colStatus.value, sortable: true },
  { key: 'revenue', label: colRevenue.value, sortable: true },
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
  { name: 'features', type: '{ reorder?: boolean, resize?: boolean, visibility?: boolean, export?: boolean }', description: { zh: '交互特性开关（拖拽重排/列宽调整/列显隐/CSV 导出），缺省全开', en: 'Interaction feature flags (reorder/resize/visibility/export), all on by default' } },
  { name: 'selectable', type: "boolean | 'single'", description: { zh: '行勾选开关，true 多选、single 单选，默认关闭', en: 'Row checkboxes: true for multi-select, single for single-select, off by default' } },
  { name: 'onSelectionChange', type: '(rowIds: string[]) => void', description: { zh: '选中行变化回调，按视图行序输出 rowId 数组', en: 'Selection change callback emitting row ids in view order' } },
  { name: 'css', type: '{ root?: string, header?: string, body?: string, row?: string, footer?: string }', description: { zh: '组件元素的 CSS 类', en: 'CSS classes for component elements' } },
];

const headerName = Name
const headerType = Type
const headerDefault = Default
const headerDesc = Description
// i18n 无 'content.props' key（getPath 会回退显示路径字符串），硬编码英文标题
const propsTitle = 'Props'
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
