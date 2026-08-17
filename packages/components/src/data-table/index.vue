<script setup lang="ts">
import { reactive, computed, ref } from 'vue';
import { onClickOutside } from '@vueuse/core';
import { Columns3, Download, GripVertical } from 'lucide-vue-next';
import { cn } from '../core';
import { useDataTable } from './states';
import { toCsvText } from './states/useFormat';
import { useI18n } from '../core/i18n';
import type { DataTableProps } from './schema';

defineOptions({ name: 'CmptDataTable', inheritAttrs: false })

const props = withDefaults(defineProps<DataTableProps>(), {
  // 数组 props 渲染层宽容:缺省给空数组(LLM 产出可序列化契约经 zod 保持必填,
  // 组件对缺字段渲染空表而非抛错)
  columns: () => [],
  data: () => [],
  layout: 'table',
  css: () => ({}),
});

const emit = defineEmits<{
  sortChange: [sort: { by?: string; direction?: 'asc' | 'desc' }];
  columnsVisibilityChange: [hidden: string[]];
  columnsReorder: [order: string[]];
  columnResize: [widths: Record<string, number>];
}>();

// All business logic delegated to states layer
const state = reactive(useDataTable(props, emit));

// i18n
const { t } = useI18n()

// 交互特性开关：undefined 视为开启
const featureEnabled = computed(() => ({
  reorder: props.features?.reorder !== false,
  resize: props.features?.resize !== false,
  visibility: props.features?.visibility !== false,
  export: props.features?.export !== false,
}))

// 列显隐菜单
const visibilityMenuOpen = ref(false)
const visibilityMenuRef = ref<HTMLElement | null>(null)
onClickOutside(visibilityMenuRef, () => { visibilityMenuOpen.value = false })

// 列重排拖拽：手柄 pointerdown + setPointerCapture 接管指针流，
// pointermove 用 elementFromPoint 命中最接近的 th 落点换位。
// 注意：capture 会把后续 pointer 事件重定向到手柄（其他元素收不到 pointerenter），
// 所以落点探测必须走坐标命中而非目标元素事件——jsdom 不实现 capture 语义，
// 单测里 pointerenter 假绿曾掩盖这一点。
const dragSourceKey = ref<string | null>(null)
function onDragHandleDown(key: string, e: PointerEvent) {
  if (!featureEnabled.value.reorder) return
  dragSourceKey.value = key
  ;(e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId)
}
function onDragHandleMove(e: PointerEvent) {
  if (!dragSourceKey.value) return
  const el = document.elementFromPoint(e.clientX, e.clientY)
  const th = el?.closest?.('th[data-column-key]')
  const toKey = th?.getAttribute('data-column-key')
  if (toKey && toKey !== dragSourceKey.value) {
    state.reorderColumns(dragSourceKey.value, toKey)
  }
}
function onDragEnd() {
  dragSourceKey.value = null
}

// 列宽调整：th 右缘热区 pointer 拖拽，增量位移写入 px 覆盖。
// jsdom/无布局环境下 getBoundingClientRect 恒 0，故基准宽走「当前声明宽度解析或回退默认 160px」
const resizingKey = ref<string | null>(null)
let resizeStartX = 0
let resizeStartWidth = 0
function parseWidthToPx(width: string | undefined): number | null {
  if (!width) return null
  const m = /^([\d.]+)px$/.exec(width.trim())
  return m ? parseFloat(m[1]) : null
}
function onResizeStart(column: { key: string; width?: string }, e: PointerEvent) {
  if (!featureEnabled.value.resize) return
  resizingKey.value = column.key
  resizeStartX = e.clientX
  // 已覆盖过的宽度优先（widthOverrides 经 visibleColumns 合并回 column.width）
  resizeStartWidth = parseWidthToPx(column.width) ?? 160
  const handle = e.currentTarget as HTMLElement
  handle.setPointerCapture?.(e.pointerId)
}
function onResizeMove(e: PointerEvent) {
  if (!resizingKey.value) return
  const next = Math.max(48, resizeStartWidth + (e.clientX - resizeStartX))
  state.setColumnWidth(resizingKey.value, next)
}
function onResizeEnd() {
  resizingKey.value = null
}

// CSV 导出：所见即所得（排序后 × 可见列），展示层格式化值
function exportCsv() {
  const csv = toCsvText(state.visibleColumns, state.sortedData, state.formatCellValue)
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${props.id || 'data-table'}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

// Overflow detection for text tooltips (only show when text is truncated)
const overflowSet = ref(new Set<string>())
function checkTextOverflow(el: HTMLElement | null, index: number, columnKey: string) {
  const key = `${index}-${columnKey}`
  if (!el) {
    overflowSet.value.delete(key)
    return
  }
  if (el.scrollWidth > el.clientWidth) {
    overflowSet.value.add(key)
  } else {
    overflowSet.value.delete(key)
  }
}

// Column categorization for mobile view —— 与 table 共用 visibleColumns 单源
const categorizedColumns = computed(() => state.categorizeColumns(state.visibleColumns));
const primaryColumns = computed(() => categorizedColumns.value.primary);
const secondaryColumns = computed(() => categorizedColumns.value.secondary);
</script>

<template>
  <div
    v-bind="$attrs"
    :class="cn('@container w-full min-w-80', css?.root)"
    :data-tool-ui-id="id"
    data-slot="data-table"
    :data-layout="layout"
  >
    <!-- 工具条：列显隐 / 导出（显隐作用于 table 与 cards 两视图） -->
    <div
      v-if="featureEnabled.visibility || featureEnabled.export"
      class="mb-2 flex items-center justify-end gap-1"
    >
      <div v-if="featureEnabled.visibility" ref="visibilityMenuRef" class="relative">
        <button
          type="button"
          data-testid="column-visibility-toggle"
          class="inline-flex h-8 cursor-pointer items-center gap-1 rounded-md px-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          :aria-expanded="visibilityMenuOpen"
          aria-haspopup="true"
          @click="visibilityMenuOpen = !visibilityMenuOpen"
        >
          <Columns3 :size="14" aria-hidden="true" />
          <span>{{ t('dataTable.columnsLabel') }}</span>
        </button>
        <div
          v-if="visibilityMenuOpen"
          class="absolute right-0 z-50 mt-1 min-w-36 rounded-md border border-border bg-popover p-1 shadow-md"
          role="menu"
        >
          <button
            v-for="col in columns"
            :key="col.key"
            type="button"
            role="menuitemcheckbox"
            :aria-checked="!state.isColumnHidden(col.key)"
            :data-testid="`column-toggle-${col.key}`"
            class="flex w-full cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-left text-sm hover:bg-accent"
            @click="state.toggleColumnVisibility(col.key)"
          >
            <span
              :class="cn(
                'flex h-4 w-4 items-center justify-center rounded-sm border border-border',
                !state.isColumnHidden(col.key) && 'bg-primary text-primary-foreground',
              )"
              aria-hidden="true"
            >{{ state.isColumnHidden(col.key) ? '' : '✓' }}</span>
            <span class="truncate">{{ col.label }}</span>
          </button>
        </div>
      </div>
      <button
        v-if="featureEnabled.export"
        type="button"
        data-testid="export-csv"
        class="inline-flex h-8 cursor-pointer items-center gap-1 rounded-md px-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
        :aria-label="t('dataTable.exportCsv').value"
        @click="exportCsv"
      >
        <Download :size="14" aria-hidden="true" />
        <span>{{ t('dataTable.exportCsv') }}</span>
      </button>
    </div>

    <!-- Table View -->
    <div :class="state.tableContainerClass">
      <div class="relative">
        <div
          :class="cn(
            'relative w-full overflow-hidden overflow-y-auto rounded-lg border border-border bg-card',
            'touch-pan-x',
            maxHeight && 'max-h-[var(--max-height)]',
          )"
          :style="maxHeight ? { '--max-height': maxHeight, 'overflow-y': 'auto' } : {}"
        >
          <table class="w-full text-sm">
            <colgroup v-if="state.visibleColumns.length > 0">
              <col
                v-for="col in state.visibleColumns"
                :key="String(col.key)"
                :style="col.width ? { width: col.width } : {}"
              />
            </colgroup>

            <!-- Empty State -->
            <tbody v-if="data.length === 0">
              <tr class="h-24 bg-card text-center">
                <td
                  :colspan="state.visibleColumns.length || 1"
                  role="status"
                  aria-live="polite"
                  class="text-muted-foreground"
                >
                  {{ emptyMessage || t('dataTable.noDataAvailable') }}
                </td>
              </tr>
            </tbody>

            <!-- Table Content -->
            <template v-else>
              <thead :class="cn('sticky top-0 z-10 bg-card [&_tr]:border-b [&_tr]:border-border', css?.header)">
                <tr class="hover:bg-transparent">
                  <th
                    v-for="(column, columnIndex) in state.visibleColumns"
                    :key="column.key"
                    scope="col"
                    :data-column-key="column.key"
                    :class="cn(
                      'relative h-10 align-middle font-normal whitespace-nowrap text-muted-foreground',
                      state.getAlignmentClass(state.getColumnAlign(column, columnIndex)),
                      columnIndex === 0 && 'pl-1',
                      columnIndex === state.visibleColumns.length - 1 && 'pr-1',
                    )"
                    :style="column.width ? { width: column.width } : undefined"
                    :aria-sort="state.currentSort?.by === column.key
                      ? (state.currentSort?.direction === 'asc' ? 'ascending' : 'descending')
                      : undefined"
                  >
                    <span class="inline-flex items-center">
                      <span
                        v-if="featureEnabled.reorder"
                        :data-testid="`drag-handle-${column.key}`"
                        class="mr-1 inline-flex cursor-grab touch-none items-center text-muted-foreground/60 hover:text-muted-foreground active:cursor-grabbing"
                        role="button"
                        :aria-label="`Drag to reorder column ${column.label}`"
                        tabindex="0"
                        @pointerdown="onDragHandleDown(column.key, $event)"
                        @pointermove="onDragHandleMove"
                        @pointerup="onDragEnd"
                      >
                        <GripVertical :size="14" aria-hidden="true" />
                      </span>
                      <button
                        type="button"
                        :disabled="column.sortable === false"
                        :class="cn(
                          'inline-flex cursor-pointer items-center justify-center rounded-md text-sm font-medium whitespace-nowrap transition-colors',
                          'focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none',
                          'disabled:pointer-events-none disabled:opacity-50',
                          'h-8 px-3 hover:bg-accent hover:text-accent-foreground',
                          'w-fit min-w-10 gap-1',
                          state.getAlignmentClass(state.getColumnAlign(column, columnIndex)),
                          columnIndex === 0 && 'pl-4',
                          columnIndex === state.visibleColumns.length - 1 && 'pr-4',
                        )"
                        :aria-label="`Sort by ${column.label}` + (state.currentSort?.by === column.key && state.currentSort?.direction
                          ? ` (${state.currentSort.direction === 'asc' ? 'ascending' : 'descending'})`
                          : '')"
                        :aria-disabled="column.sortable === false || undefined"
                        @pointerdown.stop
                        @click="state.handleSort(column)"
                      >
                      <span class="truncate">
                        <template v-if="column.abbr">
                          <abbr
                            :title="column.label"
                            class="cursor-help border-b border-dotted border-current no-underline"
                          >
                            {{ column.abbr }}
                          </abbr>
                        </template>
                        <template v-else>
                          {{ column.label }}
                        </template>
                      </span>
                      <span
                        v-if="column.sortable !== false"
                        :class="cn('min-w-4 shrink-0 text-center', state.getSortIconClass(column))"
                        aria-hidden
                      >
                        {{ state.getSortIcon(column) }}
                      </span>
                      </button>
                    </span>
                    <span
                      v-if="featureEnabled.resize"
                      :data-testid="`resize-handle-${column.key}`"
                      class="absolute top-0 right-0 z-10 h-full w-1.5 cursor-col-resize touch-none hover:bg-accent"
                      role="separator"
                      aria-orientation="vertical"
                      :aria-label="`Resize column ${column.label}`"
                      @pointerdown="onResizeStart(column, $event)"
                      @pointermove="onResizeMove"
                      @pointerup="onResizeEnd"
                      @pointercancel="onResizeEnd"
                    ></span>
                  </th>
                </tr>
              </thead>
              <tbody :class="cn('[&_tr]:border-border [&_tr:last-child]:border-0', css?.body)">
                <tr
                  v-for="(row, index) in state.sortedData"
                  :key="state.getRowId(row, index)"
                  :class="cn('border-b border-border transition-colors hover:bg-muted/50', css?.row)"
                >
                  <td
                    v-for="(column, columnIndex) in state.visibleColumns"
                    :key="column.key"
                    :class="cn(
                      'px-5 py-3 align-middle whitespace-nowrap',
                      state.getAlignmentClass(state.getColumnAlign(column, columnIndex, row[column.key])),
                      column.truncate && 'max-w-[200px] truncate',
                    )"
                  >
                    <!-- Delta -->
                    <template v-if="column.format?.kind === 'delta'">
                      <span :class="cn('tabular-nums', state.getDeltaClasses(row[column.key], column))">
                        {{ state.formatCellValue(row[column.key], column) }}
                      </span>
                    </template>

                    <!-- Status Badge -->
                    <span
                      v-else-if="state.getStatusTone(row[column.key], column)"
                      :class="cn(
                        'inline-flex items-center rounded-full border border-border px-2.5 py-0.5 text-xs font-medium transition-colors focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-none',
                        state.getToneClasses(state.getStatusTone(row[column.key], column)),
                      )"
                    >
                      {{ state.formatCellValue(row[column.key], column) }}
                    </span>

                    <!-- Badge -->
                    <span
                      v-else-if="state.getBadgeTone(row[column.key], column)"
                      :class="cn(
                        'inline-flex items-center rounded-full border border-border px-2.5 py-0.5 text-xs font-medium transition-colors focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-none',
                        state.getToneClasses(state.getBadgeTone(row[column.key], column)),
                      )"
                    >
                      {{ state.formatCellValue(row[column.key], column) }}
                    </span>

                    <!-- Link -->
                    <template v-else-if="column.format?.kind === 'link'">
                      <a
                        :href="state.resolveSafeNavigationHref(column.format.hrefKey ? String(row[column.format.hrefKey]) : String(row[column.key])) || undefined"
                        :target="column.format.external ? '_blank' : undefined"
                        :rel="column.format.external ? 'noopener noreferrer' : undefined"
                        class="inline-block max-w-full break-words text-primary underline underline-offset-2 hover:opacity-90"
                        :aria-label="column.format.external ? t('dataTable.opensInNewTab', { label: state.formatCellValue(row[column.key], column) }).value : undefined"
                        @click.stop
                      >
                        {{ state.formatCellValue(row[column.key], column) }}
                        <span v-if="column.format.external" class="ml-1 inline-block" aria-hidden="true">&#x2197;</span>
                      </a>
                    </template>

                    <!-- Array -->
                    <template v-else-if="column.format?.kind === 'array'">
                      <span class="inline-flex flex-wrap items-center gap-1">
                        <span
                          v-for="(item, i) in state.getArrayItems(row[column.key], column.format.maxVisible).items"
                          :key="i"
                          class="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground"
                        >
                          {{ item === null ? t('dataTable.nullLabel') : String(item) }}
                        </span>
                        <span
                          v-if="state.getArrayItems(row[column.key], column.format.maxVisible).remaining > 0"
                          class="group/more relative cursor-default text-xs text-muted-foreground"
                        >
                          {{ t('dataTable.moreCount', { count: state.getArrayItems(row[column.key], column.format.maxVisible).remaining }) }}
                          <span class="pointer-events-none absolute bottom-full left-1/2 z-50 mb-1 -translate-x-1/2 rounded-md bg-popover px-3 py-1.5 text-xs whitespace-nowrap text-popover-foreground opacity-0 shadow-md transition-opacity group-hover/more:opacity-100">
                            {{ state.getArrayItems(row[column.key], column.format.maxVisible).hidden.map((h: any) => h === null ? t('dataTable.nullLabel') : String(h)).join(', ') }}
                          </span>
                        </span>
                      </span>
                    </template>

                    <!-- Boolean -->
                    <template v-else-if="column.format?.kind === 'boolean'">
                      <span
                        :class="cn(
                          'inline-flex items-center rounded-full border border-border px-2.5 py-0.5 text-xs font-medium transition-colors focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-none',
                          (row[column.key] === true || row[column.key] === 'true' || row[column.key] === 1)
                            ? 'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80'
                            : 'border border-border bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground',
                        )"
                      >
                        {{ state.formatCellValue(row[column.key], column) }}
                      </span>
                    </template>

                    <!-- Default -->
                    <template v-else>
                      <span class="group/cell relative inline-block max-w-[280px]">
                        <span
                          :ref="(el) => checkTextOverflow(el as HTMLElement, index, column.key)"
                          :class="cn('block truncate', state.isNumericFormat(column.format) && 'tabular-nums')"
                        >
                          {{ state.formatCellValue(row[column.key], column) }}
                        </span>
                        <!-- Tooltip: hover 显示完整内容（仅溢出时） -->
                        <span
                          v-if="overflowSet.has(`${index}-${column.key}`)"
                          class="pointer-events-none absolute bottom-full left-1/2 z-50 mb-1 max-w-[320px] -translate-x-1/2 rounded-md bg-popover px-3 py-1.5 text-xs whitespace-normal text-popover-foreground opacity-0 shadow-md transition-opacity group-hover/cell:opacity-100"
                        >
                          {{ state.formatCellValue(row[column.key], column) }}
                        </span>
                      </span>
                    </template>
                  </td>
                </tr>
              </tbody>
            </template>
          </table>
        </div>
      </div>
    </div>

    <!-- Mobile Cards View -->
    <div
      :class="state.cardsContainerClass"
      role="list"
      :aria-label="t('dataTable.mobileViewLabel').value"
      :aria-describedby="state.mobileDescriptionId"
    >
      <div :id="state.mobileDescriptionId" class="sr-only">
        {{ t('dataTable.mobileViewDescription') }}
        <template v-if="columns.length > 0">
          {{ t('dataTable.columnsLabel') }}: {{ columns.map((c) => c.label).join(", ") }}.
        </template>
      </div>

      <div v-if="data.length === 0" class="py-8 text-center text-muted-foreground">
        {{ emptyMessage || t('dataTable.noDataAvailable') }}
      </div>

      <div
        v-else
        class="flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-xs"
      >
        <div
          v-for="(row, index) in state.sortedData"
          :key="state.getRowId(row, index)"
          :class="cn(
            'border-border',
            index > 0 && 'border-t',
            css?.row
          )"
          role="listitem"
        >
          <!-- Accordion Card -->
          <div
            v-if="secondaryColumns.length > 0"
          >
            <button
              type="button"
              :class="cn(
                'w-full rounded-none px-4 py-3 text-left transition-colors',
                'hover:bg-accent/50 active:bg-accent/50',
                state.isRowExpanded(state.getRowId(row, index)) && 'bg-muted'
              )"
              :aria-expanded="state.isRowExpanded(state.getRowId(row, index))"
              :aria-controls="`row-details-${state.getDataTableRowDomId(state.getRowId(row, index))}`"
              @click="state.toggleRowExpansion(state.getRowId(row, index))"
            >
              <div class="flex min-w-0 flex-1 flex-col gap-2">
                <!-- Primary Column -->
                <div
                  v-if="primaryColumns[0]"
                  class="truncate font-medium"
                >
                  {{ state.formatCellValue(row[primaryColumns[0].key], primaryColumns[0]) }}
                </div>

                <!-- Remaining Primary Columns Summary -->
                <div
                  v-if="primaryColumns.slice(1).length > 0"
                  class="flex w-full flex-wrap gap-x-4 gap-y-0.5 text-muted-foreground"
                >
                  <span
                    v-for="col in primaryColumns.slice(1)"
                    :key="col.key"
                    class="flex min-w-[8em] shrink-0 gap-1 font-normal"
                  >
                    <span class="sr-only">{{ col.label }}:</span>
                    <span aria-hidden="true">{{ col.label }}:</span>
                    <span class="truncate">
                      {{ state.formatCellValue(row[col.key], col) }}
                    </span>
                  </span>
                </div>
              </div>

              <!-- Expand Icon -->
              <span
                :class="cn(
                  'float-right text-muted-foreground transition-transform',
                  state.isRowExpanded(state.getRowId(row, index)) && 'rotate-180'
                )"
                aria-hidden="true"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </span>
            </button>

            <!-- Expanded Content -->
            <div
              v-show="state.isRowExpanded(state.getRowId(row, index))"
              :id="`row-details-${state.getDataTableRowDomId(state.getRowId(row, index))}`"
              class="flex flex-col gap-4 px-4 pb-4"
              role="region"
            >
              <dl class="flex flex-col gap-2 pt-4">
                <div
                  v-for="col in secondaryColumns"
                  :key="col.key"
                  class="flex items-start justify-between gap-4"
                >
                  <dt class="shrink-0 text-muted-foreground">
                    {{ col.label }}
                  </dt>
                  <dd
                    :class="cn(
                      'min-w-0 text-pretty wrap-break-word text-foreground',
                      col.align === 'right' && 'text-right',
                      col.align === 'center' && 'text-center',
                    )"
                  >
                    <!-- Delta -->
                    <template v-if="col.format?.kind === 'delta'">
                      <span :class="cn('tabular-nums', state.getDeltaClasses(row[col.key], col))">
                        {{ state.formatCellValue(row[col.key], col) }}
                      </span>
                    </template>

                    <!-- Status Badge -->
                    <span
                      v-else-if="state.getStatusTone(row[col.key], col)"
                      :class="cn(
                        'inline-flex items-center rounded-full border border-border px-2.5 py-0.5 text-xs font-medium',
                        state.getToneClasses(state.getStatusTone(row[col.key], col)),
                      )"
                    >
                      {{ state.formatCellValue(row[col.key], col) }}
                    </span>

                    <!-- Badge -->
                    <span
                      v-else-if="state.getBadgeTone(row[col.key], col)"
                      :class="cn(
                        'inline-flex items-center rounded-full border border-border px-2.5 py-0.5 text-xs font-medium',
                        state.getToneClasses(state.getBadgeTone(row[col.key], col)),
                      )"
                    >
                      {{ state.formatCellValue(row[col.key], col) }}
                    </span>

                    <!-- Link -->
                    <template v-else-if="col.format?.kind === 'link'">
                      <a
                        :href="state.resolveSafeNavigationHref(col.format.hrefKey ? String(row[col.format.hrefKey]) : String(row[col.key])) || undefined"
                        :target="col.format.external ? '_blank' : undefined"
                        :rel="col.format.external ? 'noopener noreferrer' : undefined"
                        class="inline-block max-w-full break-words text-primary underline underline-offset-2 hover:opacity-90"
                        @click.stop
                      >
                        {{ state.formatCellValue(row[col.key], col) }}
                        <span v-if="col.format.external" class="ml-1 inline-block">&#x2197;</span>
                      </a>
                    </template>

                    <!-- Array -->
                    <template v-else-if="col.format?.kind === 'array'">
                      <span class="inline-flex flex-wrap items-center gap-1">
                        <span
                          v-for="(item, i) in state.getArrayItems(row[col.key], col.format.maxVisible).items"
                          :key="i"
                          class="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground"
                        >
                          {{ item === null ? t('dataTable.nullLabel') : String(item) }}
                        </span>
                        <span
                          v-if="state.getArrayItems(row[col.key], col.format.maxVisible).remaining > 0"
                          class="group/more relative cursor-default text-xs text-muted-foreground"
                        >
                          {{ t('dataTable.moreCount', { count: state.getArrayItems(row[col.key], col.format.maxVisible).remaining }) }}
                          <span class="pointer-events-none absolute bottom-full left-1/2 z-50 mb-1 -translate-x-1/2 rounded-md bg-popover px-3 py-1.5 text-xs whitespace-nowrap text-popover-foreground opacity-0 shadow-md transition-opacity group-hover/more:opacity-100">
                            {{ state.getArrayItems(row[col.key], col.format.maxVisible).hidden.map((h: any) => h === null ? t('dataTable.nullLabel') : String(h)).join(', ') }}
                          </span>
                        </span>
                      </span>
                    </template>

                    <!-- Boolean -->
                    <template v-else-if="col.format?.kind === 'boolean'">
                      <span
                        :class="cn(
                          'inline-flex items-center rounded-full border border-border px-2.5 py-0.5 text-xs font-medium',
                          (row[col.key] === true || row[col.key] === 'true' || row[col.key] === 1)
                            ? 'border-transparent bg-secondary text-secondary-foreground'
                            : 'border border-border bg-transparent shadow-sm',
                        )"
                      >
                        {{ state.formatCellValue(row[col.key], col) }}
                      </span>
                    </template>

                    <!-- Default -->
                    <template v-else>
                      <span :class="cn(state.isNumericFormat(col.format) && 'tabular-nums')">
                        {{ state.formatCellValue(row[col.key], col) }}
                      </span>
                    </template>
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          <!-- Simple Card (no secondary columns) -->
          <div
            v-else
            class="flex flex-col gap-2 p-4"
          >
            <div
              v-if="primaryColumns[0]"
              class="font-medium"
            >
              {{ state.formatCellValue(row[primaryColumns[0].key], primaryColumns[0]) }}
            </div>

            <div
              v-for="col in primaryColumns.slice(1)"
              :key="col.key"
              class="flex items-start justify-between gap-4"
            >
              <span class="min-w-[8em] shrink-0 text-muted-foreground">
                {{ col.label }}:
              </span>
              <span
                :class="cn(
                  'min-w-0 wrap-break-word',
                  col.align === 'right' && 'text-right',
                  col.align === 'center' && 'text-center',
                )"
              >
                {{ state.formatCellValue(row[col.key], col) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Sort Announcement (screen reader only) -->
    <div
      v-if="state.sortAnnouncement"
      class="sr-only"
      aria-live="polite"
    >
      {{ state.sortAnnouncement }}
    </div>
  </div>
</template>
