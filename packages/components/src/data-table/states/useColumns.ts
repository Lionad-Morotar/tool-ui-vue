// DataTable 列交互状态 composable - 重排/显隐/宽度的内存态与有效列单源
import { computed, ref, toValue } from 'vue';
import type { Column } from '../schema';
import type { ComputedRef, MaybeRefOrGetter, Ref } from 'vue';

export interface UseColumnsOptions {
  columns: MaybeRefOrGetter<Column[]>;
}

export interface ColumnsReturns {
  /** 用户拖拽后的列 key 顺序；为空表示未拖拽过，跟随 props 顺序 */
  columnOrder: Ref<string[]>;
  /** 被用户隐藏的列 key 集合 */
  hiddenKeys: Ref<Set<string>>;
  /** 用户拖拽调整的列宽覆盖（px），优先于 column.width */
  widthOverrides: Ref<Record<string, number>>;
  /**
   * 有效列单源：按 重排顺序 → 过滤隐藏 → 合并宽度覆盖 产出。
   * table 三处（colgroup/thead/tbody）与 mobile cards 必须都从这里取列，
   * 禁止组件内再直接读 props.columns，否则两视图状态分裂。
   */
  visibleColumns: ComputedRef<Column[]>;
  toggleColumnVisibility: (key: string) => void;
  isColumnHidden: (key: string) => boolean;
  reorderColumns: (fromKey: string, toKey: string) => void;
  setColumnWidth: (key: string, widthPx: number) => void;
}

export function useColumns(options: UseColumnsOptions): ColumnsReturns {
  const { columns } = options;

  const columnOrder = ref<string[]>([]);
  const hiddenKeys = ref<Set<string>>(new Set());
  const widthOverrides = ref<Record<string, number>>({});

  const visibleColumns = computed<Column[]>(() => {
    const cols = toValue(columns);
    const order = columnOrder.value;
    // 重排：仅在用户拖过（order 非空）时按 key 重排；props 中新出现的 key 追加到末尾，
    // 被 LLM 撤掉的 key 自然消失——按 key 而非索引匹配，换引用不重置用户态
    const ordered =
      order.length === 0
        ? cols
        : [
            ...order
              .map((key) => cols.find((c) => c.key === key))
              .filter((c): c is Column => Boolean(c)),
            ...cols.filter((c) => !order.includes(c.key)),
          ];
    return ordered
      .filter((c) => !hiddenKeys.value.has(c.key))
      .map((c) => {
        const w = widthOverrides.value[c.key];
        return w !== undefined ? { ...c, width: `${w}px` } : c;
      });
  });

  function toggleColumnVisibility(key: string) {
    const next = new Set(hiddenKeys.value);
    if (next.has(key)) {
      next.delete(key);
    } else {
      next.add(key);
    }
    hiddenKeys.value = next;
  }

  function isColumnHidden(key: string) {
    return hiddenKeys.value.has(key);
  }

  function reorderColumns(fromKey: string, toKey: string) {
    const current =
      columnOrder.value.length === 0
        ? toValue(columns).map((c) => c.key)
        : [...columnOrder.value];
    const fromIdx = current.indexOf(fromKey);
    const toIdx = current.indexOf(toKey);
    if (fromIdx === -1 || toIdx === -1 || fromIdx === toIdx) return;
    current.splice(toIdx, 0, ...current.splice(fromIdx, 1));
    columnOrder.value = current;
  }

  function setColumnWidth(key: string, widthPx: number) {
    widthOverrides.value = { ...widthOverrides.value, [key]: Math.round(widthPx) };
  }

  return {
    columnOrder,
    hiddenKeys,
    widthOverrides,
    visibleColumns,
    toggleColumnVisibility,
    isColumnHidden,
    reorderColumns,
    setColumnWidth,
  };
}
