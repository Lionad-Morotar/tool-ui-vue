<script setup lang="ts">
import { reactive, computed } from 'vue';
import { DataTable } from '@lionad/vtu-components';
import messages from './i18n';
import { useStoryLocale } from '../_shared/use-story-locale'

const rowSelection = useStoryLocale('content.rowSelection', messages)
const rowSelectionHint = useStoryLocale('content.rowSelectionHint', messages)
const rowSelectionSingle = useStoryLocale('content.rowSelectionSingle', messages)
const rowSelectionSingleHint = useStoryLocale('content.rowSelectionSingleHint', messages)
const selectedRowsLabel = useStoryLocale('content.selectedRows', messages)
const colName = useStoryLocale('content.colName', messages)
const colStatus = useStoryLocale('content.colStatus', messages)
const colRevenue = useStoryLocale('content.colRevenue', messages)

// 回显 selectionChange 载荷并切换布局验证 cards 视图勾选
const selectionState = reactive({
  layout: 'auto' as 'auto' | 'table' | 'cards',
  selected: [] as string[],
  selectedSingle: [] as string[],
});

// 模板表达式不支持 TS 语法（as const / 类型注解），常量和 handler 均须提取到 script
const selectionLayouts = ['auto', 'table', 'cards'] as const

const selectionColumns = computed<any[]>(() => [
  { key: 'name', label: colName.value, sortable: true },
  { key: 'status', label: colStatus.value, sortable: true },
  { key: 'revenue', label: colRevenue.value, sortable: true, format: { kind: 'currency', currency: 'USD' } },
])

// 稳定 id 便于验证选中项随排序/视图切换保持
const selectionData = [
  { id: 'p-a', name: 'Product A', status: 'Active', revenue: 12450 },
  { id: 'p-b', name: 'Product B', status: 'Draft', revenue: 8230 },
  { id: 'p-c', name: 'Product C', status: 'Active', revenue: 24100 },
  { id: 'p-d', name: 'Product D', status: 'Archived', revenue: 4980 },
]

function onSelectionChange(ids: string[]) {
  selectionState.selected = ids
}
function onSelectionSingleChange(ids: string[]) {
  selectionState.selectedSingle = ids
}
</script>

<template>
  <Story title="DataTable/Row Selection">
    <Variant :title="rowSelection" auto-props-disabled>
      <div class="w-full max-w-2xl space-y-4">
        <p class="text-sm text-muted-foreground">{{ rowSelectionHint }}</p>
        <!-- 布局切换：验证 table/cards 两视图共享勾选状态 -->
        <div class="flex gap-2">
          <button
            v-for="l in selectionLayouts"
            :key="l"
            type="button"
            class="rounded-md border px-3 py-1 text-xs"
            :class="selectionState.layout === l ? 'border-foreground font-medium' : 'border-transparent bg-muted text-muted-foreground'"
            @click="selectionState.layout = l"
          >
            {{ l }}
          </button>
        </div>
        <data-table
          id="data-table-selection"
          :layout="selectionState.layout"
          :columns="selectionColumns"
          :data="selectionData"
          selectable
          @selection-change="onSelectionChange"
        />
        <p class="font-mono text-xs text-muted-foreground">
          {{ selectedRowsLabel }}: {{ selectionState.selected.join(', ') || '—' }}
        </p>
      </div>
    </Variant>

    <Variant :title="rowSelectionSingle" auto-props-disabled>
      <div class="w-full max-w-2xl space-y-4">
        <p class="text-sm text-muted-foreground">{{ rowSelectionSingleHint }}</p>
        <data-table
          id="data-table-selection-single"
          :columns="selectionColumns"
          :data="selectionData"
          selectable="single"
          @selection-change="onSelectionSingleChange"
        />
        <p class="font-mono text-xs text-muted-foreground">
          {{ selectedRowsLabel }}: {{ selectionState.selectedSingle.join(', ') || '—' }}
        </p>
      </div>
    </Variant>
  </Story>
</template>
