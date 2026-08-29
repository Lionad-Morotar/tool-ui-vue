// DataTable 聚合 composable - 组装 useSort, useFormat, useLayout, useColumns, useSelection
import { useFormat, type FormatOptions } from './useFormat';
import { useLayout, type UseLayoutOptions } from './useLayout';
import { useSort, type UseSortOptions } from './useSort';
import { useColumns, type UseColumnsOptions } from './useColumns';
import { useSelection, type UseSelectionOptions } from './useSelection';
import { usePropsValidator } from '../../core';
import { SerializableDataTableSchema } from '../schema';
import type { Column, DataTableProps, RowData } from '../schema';

export type DataTableEmit = {
  (e: 'sortChange', sort: { by?: string; direction?: 'asc' | 'desc' }): void;
  (e: 'selectionChange', rowIds: string[]): void;
  (e: 'columnsVisibilityChange', hidden: string[]): void;
  (e: 'columnsReorder', order: string[]): void;
  (e: 'columnResize', widths: Record<string, number>): void;
};

export interface DataTableState {
  // From useSort
  currentSort: ReturnType<typeof useSort>['currentSort'];
  sortedData: ReturnType<typeof useSort>['sortedData'];
  collator: ReturnType<typeof useSort>['collator'];
  handleSort: ReturnType<typeof useSort>['handleSort'];
  getSortIcon: ReturnType<typeof useSort>['getSortIcon'];
  getSortIconClass: ReturnType<typeof useSort>['getSortIconClass'];
  sortAnnouncement: ReturnType<typeof useSort>['sortAnnouncement'];

  // From useFormat
  formatCellValue: ReturnType<typeof useFormat>['formatCellValue'];
  getRelativeTime: ReturnType<typeof useFormat>['getRelativeTime'];
  resolveSafeNavigationHref: ReturnType<typeof useFormat>['resolveSafeNavigationHref'];
  isNumericFormat: ReturnType<typeof useFormat>['isNumericFormat'];
  getAlignmentClass: ReturnType<typeof useFormat>['getAlignmentClass'];
  getColumnAlign: ReturnType<typeof useFormat>['getColumnAlign'];
  getStatusTone: ReturnType<typeof useFormat>['getStatusTone'];
  getBadgeTone: ReturnType<typeof useFormat>['getBadgeTone'];
  getToneClasses: ReturnType<typeof useFormat>['getToneClasses'];
  getDeltaClasses: ReturnType<typeof useFormat>['getDeltaClasses'];
  getArrayItems: ReturnType<typeof useFormat>['getArrayItems'];

  // From useLayout
  mobileDescriptionId: ReturnType<typeof useLayout>['mobileDescriptionId'];
  categorizeColumns: ReturnType<typeof useLayout>['categorizeColumns'];
  getRowId: ReturnType<typeof useLayout>['getRowId'];
  getDataTableRowDomId: ReturnType<typeof useLayout>['getDataTableRowDomId'];
  expandedRows: ReturnType<typeof useLayout>['expandedRows'];
  toggleRowExpansion: ReturnType<typeof useLayout>['toggleRowExpansion'];
  isRowExpanded: ReturnType<typeof useLayout>['isRowExpanded'];
  tableContainerClass: ReturnType<typeof useLayout>['tableContainerClass'];
  cardsContainerClass: ReturnType<typeof useLayout>['cardsContainerClass'];

  // From useColumns
  columnOrder: ReturnType<typeof useColumns>['columnOrder'];
  hiddenKeys: ReturnType<typeof useColumns>['hiddenKeys'];
  widthOverrides: ReturnType<typeof useColumns>['widthOverrides'];
  visibleColumns: ReturnType<typeof useColumns>['visibleColumns'];
  toggleColumnVisibility: ReturnType<typeof useColumns>['toggleColumnVisibility'];
  isColumnHidden: ReturnType<typeof useColumns>['isColumnHidden'];
  reorderColumns: ReturnType<typeof useColumns>['reorderColumns'];
  setColumnWidth: ReturnType<typeof useColumns>['setColumnWidth'];

  // From useSelection
  selectedRows: ReturnType<typeof useSelection>['selectedRows'];
  isRowSelected: ReturnType<typeof useSelection>['isRowSelected'];
  toggleRowSelection: ReturnType<typeof useSelection>['toggleRowSelection'];
  toggleSelectAll: ReturnType<typeof useSelection>['toggleSelectAll'];
  isAllSelected: ReturnType<typeof useSelection>['isAllSelected'];
  isIndeterminate: ReturnType<typeof useSelection>['isIndeterminate'];
}

export function useDataTable(
  // columns/data 收窄为必有:组件 withDefaults 保证数组默认,states 不再面对 undefined;
  // usePropsValidator 仍按 zod 必填校验(缺字段 warn 提示,渲染层宽容不炸)
  props: Omit<DataTableProps, 'columns' | 'data'> & { columns: Column[]; data: RowData[] },
  emit: DataTableEmit,
): DataTableState {
  usePropsValidator(SerializableDataTableSchema, props, 'DataTable');

  // 子 composable 的字段类型是 MaybeRefOrGetter：以 getter 传参，
  // toValue 才能在 computed/watch 的活跃 effect 内读 props 并收集依赖；
  // 值传参会在 setup 同步作用域固化成挂载首帧快照，父层后续换引用不重渲染
  const sortOptions: UseSortOptions = {
    sort: () => props.sort,
    defaultSort: () => props.defaultSort,
    columns: () => props.columns,
    data: () => props.data,
    locale: () => props.locale,
    onSortChange: (newSort) => emit('sortChange', newSort),
  };

  const {
    currentSort,
    sortedData,
    collator,
    handleSort,
    getSortIcon,
    getSortIconClass,
    sortAnnouncement,
  } = useSort(sortOptions);

  // useFormat options
  const formatOptions: FormatOptions = { locale: props.locale || 'en-US' };
  const {
    formatCellValue,
    getRelativeTime,
    resolveSafeNavigationHref,
    isNumericFormat,
    getAlignmentClass,
    getColumnAlign,
    getStatusTone,
    getBadgeTone,
    getToneClasses,
    getDeltaClasses,
    getArrayItems,
  } = useFormat(formatOptions);

  // useLayout options - ensure layout has a default value
  const layoutOptions: UseLayoutOptions = {
    columns: () => props.columns,
    data: () => props.data,
    rowIdKey: () => props.rowIdKey,
    layout: () => (props.layout ?? 'auto') as 'auto' | 'table' | 'cards',
    id: () => props.id,
  };

  const {
    mobileDescriptionId,
    categorizeColumns,
    getRowId,
    getDataTableRowDomId,
    expandedRows,
    toggleRowExpansion,
    isRowExpanded,
    tableContainerClass,
    cardsContainerClass,
  } = useLayout(layoutOptions);

  // useColumns options —— 交互动作在聚合层包 emit 上抛，宿主可监听回写
  const columnsOptions: UseColumnsOptions = { columns: () => props.columns };
  const columnsState = useColumns(columnsOptions);

  function toggleColumnVisibility(key: string) {
    columnsState.toggleColumnVisibility(key);
    emit('columnsVisibilityChange', [...columnsState.hiddenKeys.value]);
  }

  function reorderColumns(fromKey: string, toKey: string) {
    columnsState.reorderColumns(fromKey, toKey);
    emit('columnsReorder', [...columnsState.columnOrder.value]);
  }

  function setColumnWidth(key: string, widthPx: number) {
    columnsState.setColumnWidth(key, widthPx);
    emit('columnResize', { ...columnsState.widthOverrides.value });
  }

  // useSelection options —— 全选/半选以排序后视图行为准（sortedData 经 getter 传入，
  // 排序切换后行键序列随视图更新，选中集按 rowId 保持不串行）
  const selectionOptions: UseSelectionOptions = {
    data: () => sortedData.value,
    getRowId,
    onSelectionChange: (rowIds) => emit('selectionChange', rowIds),
  };
  const selectionState = useSelection(selectionOptions);

  return {
    // From useSort
    currentSort,
    sortedData,
    collator,
    handleSort,
    getSortIcon,
    getSortIconClass,
    sortAnnouncement,

    // From useFormat
    formatCellValue,
    getRelativeTime,
    resolveSafeNavigationHref,
    isNumericFormat,
    getAlignmentClass,
    getColumnAlign,
    getStatusTone,
    getBadgeTone,
    getToneClasses,
    getDeltaClasses,
    getArrayItems,

    // From useLayout
    mobileDescriptionId,
    categorizeColumns,
    getRowId,
    getDataTableRowDomId,
    expandedRows,
    toggleRowExpansion,
    isRowExpanded,
    tableContainerClass,
    cardsContainerClass,

    // From useColumns（动作经聚合层包装以 emit）
    columnOrder: columnsState.columnOrder,
    hiddenKeys: columnsState.hiddenKeys,
    widthOverrides: columnsState.widthOverrides,
    visibleColumns: columnsState.visibleColumns,
    toggleColumnVisibility,
    isColumnHidden: columnsState.isColumnHidden,
    reorderColumns,
    setColumnWidth,

    // From useSelection（选择集变化经 onSelectionChange 回调 emit 上抛）
    selectedRows: selectionState.selectedRows,
    isRowSelected: selectionState.isRowSelected,
    toggleRowSelection: selectionState.toggleRowSelection,
    toggleSelectAll: selectionState.toggleSelectAll,
    isAllSelected: selectionState.isAllSelected,
    isIndeterminate: selectionState.isIndeterminate,
  };
}
