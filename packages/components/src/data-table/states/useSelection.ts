// DataTable 行选择状态 composable —— 单选/多选共用同一状态源与收敛规则，
// 视图层仅按模式决定勾选交互形态，选择状态本身与视图形态解耦
import { computed, ref, toValue, watch } from 'vue';
import type { RowData } from '../schema';
import type { ComputedRef, MaybeRefOrGetter, Ref } from 'vue';

export type SelectionMode = 'multiple' | 'single';

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
  /**
   * 选择模式：multiple = 多选（可多行并存、表头全选）；
   * single = 单选（选中集恒 ≤1 项，点击未选行切换、点击已选行取消）。
   * getter 传参以支持运行时切换（流式修订后到），缺省 multiple。
   */
  mode?: MaybeRefOrGetter<SelectionMode>;
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

export function useSelection(options: UseSelectionOptions): SelectionReturns {
  const { data, getRowId, onSelectionChange } = options;

  // 单选/多选模式：getter 传参在 computed 内读 props 链收集依赖，
  // 运行时 selectable 切换（true ↔ 'single'）触发模式迁移而非固化首帧
  const mode = computed<SelectionMode>(() => toValue(options.mode) ?? 'multiple');

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
    // 载荷按视图行序输出：消费方按 rowId 回查的遍历顺序与渲染行一致，
    // 不受 Set 插入序（交互先后）影响，同一操作产出确定顺序
    onSelectionChange?.(viewRowIds.value.filter((id) => next.has(id)));
  }

  // 模式迁移：multiple → single 时多行选集与单选语义冲突，收敛为清空并上抛；
  // 仅选一行时语义等价不动；single → multiple 及同模式重渲染不触发（无变化）
  watch(mode, (nextMode, prevMode) => {
    if (prevMode === 'multiple' && nextMode === 'single' && selectedRows.value.size > 1) {
      commitSelection(new Set());
    }
  });

  // 视图数据收缩时清理幽灵选中键：流式修订删除行的 rowId 若残留，
  // 会随后续全选/半选载荷上抛，消费方按 rowId 回查落空。
  // 只剔除不在新视图行键序列中的键——排序仅重排不换集合，不触发本清理。
  watch(viewRowIds, (ids) => {
    const viewSet = new Set(ids);
    const next = new Set(selectedRows.value);
    let removed = false;
    for (const id of next) {
      if (!viewSet.has(id)) {
        next.delete(id);
        removed = true;
      }
    }
    if (removed) {
      commitSelection(next);
    }
  });

  function toggleRowSelection(rowId: string) {
    const next = new Set(selectedRows.value);
    if (mode.value === 'single') {
      // 单选：选中新行 = 收敛为仅含该行；再点已选行 = 取消（清空）
      next.clear();
      if (!selectedRows.value.has(rowId)) {
        next.add(rowId);
      }
    } else if (next.has(rowId)) {
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
