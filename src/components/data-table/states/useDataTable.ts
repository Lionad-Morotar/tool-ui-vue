// DataTable 聚合 composable - 组装 useSort, useFormat, useLayout
import type { DataTableProps } from '../schema';
import { useSort, type UseSortOptions } from './useSort';
import { useFormat, type FormatOptions } from './useFormat';
import { useLayout, type UseLayoutOptions } from './useLayout';

export interface UseDataTableOptions extends DataTableProps {
  emit: {
    (e: 'sortChange', sort: { by?: string; direction?: 'asc' | 'desc' }): void;
  };
}

export interface DataTableState {
  // From useSort
  currentSort: UseSortOptions['sort'];
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
}

export function useDataTable(options: UseDataTableOptions): DataTableState {
  const { sort, defaultSort, columns, data, locale, rowIdKey, layout, id, emit } = options;

  // useSort options
  const sortOptions: UseSortOptions = {
    sort,
    defaultSort,
    columns,
    data,
    locale,
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
  const formatOptions: FormatOptions = { locale: locale || 'en-US' };
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
    columns,
    data,
    rowIdKey,
    layout: (layout ?? 'auto') as 'auto' | 'table' | 'cards',
    id,
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
  };
}
