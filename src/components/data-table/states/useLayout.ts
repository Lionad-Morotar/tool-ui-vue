import { computed, ref } from 'vue';
import type { Column, RowData } from '../schema';
import type { ComputedRef, Ref, MaybeRefOrGetter } from 'vue';

export interface CategorizedColumns {
  primary: Column[];
  secondary: Column[];
}

export interface UseLayoutOptions {
  columns: MaybeRefOrGetter<Column[]>;
  data: MaybeRefOrGetter<RowData[]>;
  rowIdKey: MaybeRefOrGetter<string | undefined>;
  layout: MaybeRefOrGetter<'auto' | 'table' | 'cards'>;
  id: MaybeRefOrGetter<string>;
}

export interface LayoutReturns {
  mobileDescriptionId: ComputedRef<string>;
  categorizeColumns: (columns: Column[]) => CategorizedColumns;
  getRowId: (row: RowData, index: number) => string;
  getDataTableRowDomId: (rowKey: string) => string;
  expandedRows: Ref<Set<string>>;
  toggleRowExpansion: (rowKey: string) => void;
  isRowExpanded: (rowKey: string) => boolean;
  tableContainerClass: ComputedRef<string>;
  cardsContainerClass: ComputedRef<string>;
}

function toValue<T>(v: MaybeRefOrGetter<T>): T {
  if (typeof v === 'function') {
    return (v as () => T)();
  }
  if (v !== null && typeof v === 'object' && 'value' in v) {
    return (v as { value: T }).value;
  }
  return v as T;
}

export function useLayout(options: UseLayoutOptions): LayoutReturns {
  const { columns: _columns, data, rowIdKey, layout, id } = options;

  // Mobile description ID for accessibility
  const mobileDescriptionId = computed(() => {
    return `${toValue(id) || 'data-table'}-mobile-table-description`;
  });

  // Categorize columns for mobile view
  function categorizeColumns(cols: Column[]): CategorizedColumns {
    const primary: Column[] = [];
    const secondary: Column[] = [];

    let visibleColumnCount = 0;
    cols.forEach((col) => {
      if (col.hideOnMobile) return;

      if (col.priority === 'primary') {
        primary.push(col);
      } else if (col.priority === 'secondary') {
        secondary.push(col);
      } else if (col.priority === 'tertiary') {
        return;
      } else {
        if (visibleColumnCount < 2) {
          primary.push(col);
        } else {
          secondary.push(col);
        }
        visibleColumnCount++;
      }
    });

    return { primary, secondary };
  }

  function getRowId(row: RowData, index: number): string {
    const key = toValue(rowIdKey);
    if (key && row[key] != null) {
      return String(row[key]);
    }
    return `row-${index}`;
  }

  function getDataTableRowDomId(rowKey: string): string {
    return encodeURIComponent(rowKey).replace(/%/g, '_');
  }

  // Accordion state for mobile cards
  const expandedRows = ref<Set<string>>(new Set());

  function toggleRowExpansion(rowKey: string) {
    if (expandedRows.value.has(rowKey)) {
      expandedRows.value.delete(rowKey);
    } else {
      expandedRows.value.add(rowKey);
    }
  }

  function isRowExpanded(rowKey: string): boolean {
    return expandedRows.value.has(rowKey);
  }

  // Layout class computed
  const tableContainerClass = computed(() => {
    const l = toValue(layout);
    if (l === 'table') return 'block';
    if (l === 'cards') return 'hidden';
    return 'hidden @md:block'; // auto mode
  });

  const cardsContainerClass = computed(() => {
    const l = toValue(layout);
    if (l === 'cards') return '';
    if (l === 'table') return 'hidden';
    return '@md:hidden'; // auto mode
  });

  // Warn about missing rowIdKey (once)
  if (typeof window !== 'undefined' && !toValue(rowIdKey) && toValue(data).length > 0) {
    console.warn(
      '[DataTable] Missing `rowIdKey` prop. Falling back to inferred/content-derived row keys. ' +
        "Strongly recommended: Pass a `rowIdKey` prop that points to a unique identifier in your row data (e.g., 'id', 'uuid', 'symbol').",
    );
  }

  return {
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
