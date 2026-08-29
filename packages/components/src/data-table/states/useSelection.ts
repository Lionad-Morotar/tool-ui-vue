// DataTable 行选择状态 composable —— 多选核心（S1：仅 table 视图）
import { computed, ref } from 'vue';
import type { RowData } from '../schema';
import type { ComputedRef, MaybeRefOrGetter, Ref } from 'vue';

export interface UseSelectionOptions {
  /**
   * 当前视图行（排序后）：全选/半选判定以此刻渲染行为准，
   * 必须传 sortedData 而非原始 props.data，否则排序后全选勾错行。
   */
  data: MaybeRefOrGetter<RowData[]>;
  /**
   * 行键来源复用 useLayout.getRowId：显式 rowIdKey → 探测 → row-${index} 兜底。
   * 排序后兜底键随位置漂移属既有已接受语义，不在本层加防线。
   */
  getRowId: (row: RowData, index: number) => string;
  /** 选择集变化回调（聚合层接 emit('selectionChange')） */
  onSelectionChange?: (rowIds: string[]) => void;
}

export interface SelectionReturns {
  /** 已选行键集合 */
  selectedRows: Ref<Set<string>>;
  isRowSelected: (rowId: string) => boolean;
  toggleRowSelection: (rowId: string) => void;
  /** 表头全选：全选当前视图全部行；已全选时清空 */
  toggleSelectAll: () => void;
  isAllSelected: ComputedRef<boolean>;
  isIndeterminate: ComputedRef<boolean>;
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

export function useSelection(options: UseSelectionOptions): SelectionReturns {
  const { data, getRowId, onSelectionChange } = options;

  const selectedRows = ref<Set<string>>(new Set());

  // 以排序后视图行为准产出行键序列：toValue 走 getter，在 computed 内
  // 读 props 链（含 sort 状态）收集依赖，流式 props 后到/换引用不被固化
  const viewRowIds = computed(() => {
    return toValue(data).map((row, index) => getRowId(row, index));
  });

  const isAllSelected = computed(() => {
    const ids = viewRowIds.value;
    return ids.length > 0 && ids.every((id) => selectedRows.value.has(id));
  });

  // 部分选中：视图中至少一行选中且未全选；原生 input 的 indeterminate
  // 无对应 HTML attribute，只能由视图层 ref 设置 .indeterminate 属性
  const isIndeterminate = computed(() => {
    const ids = viewRowIds.value;
    let count = 0;
    for (const id of ids) {
      if (selectedRows.value.has(id)) count++;
    }
    return count > 0 && count < ids.length;
  });

  function isRowSelected(rowId: string): boolean {
    return selectedRows.value.has(rowId);
  }

  function commitSelection(next: Set<string>) {
    selectedRows.value = next;
    onSelectionChange?.([...next]);
  }

  function toggleRowSelection(rowId: string) {
    const next = new Set(selectedRows.value);
    if (next.has(rowId)) {
      next.delete(rowId);
    } else {
      next.add(rowId);
    }
    commitSelection(next);
  }

  function toggleSelectAll() {
    const ids = viewRowIds.value;
    const next = new Set(selectedRows.value);
    if (ids.length > 0 && ids.every((id) => next.has(id))) {
      ids.forEach((id) => next.delete(id));
    } else {
      ids.forEach((id) => next.add(id));
    }
    commitSelection(next);
  }

  return {
    selectedRows,
    isRowSelected,
    toggleRowSelection,
    toggleSelectAll,
    isAllSelected,
    isIndeterminate,
  };
}
