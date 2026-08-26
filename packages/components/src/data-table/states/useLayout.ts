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

// 缺 rowIdKey 警告的模块级去重:同页多表实例(genui 流式物料常态)各 setup 一次,
// 缺 key 属同一处调用方问题,警一次足够定位——每实例都警会刷屏淹掉真错误。
// 页面刷新后 flag 随模块重载重置,提示不丢。
let warnedMissingRowIdKey = false;

// 无显式 rowIdKey 时的常见唯一字段探测候选,按约定俗成程度排序。
// 只收单个字段、绝不猜组合键,把「猜错数据语义」的面压到最小。
const ROW_ID_KEY_CANDIDATES = ['id', 'uuid', 'key', 'name', 'title', 'label'] as const;

/**
 * 从行数据探测可用的行键字段:取候选表中第一个「每行非空且全量唯一」的字段。
 * 唯一性校验不可省——字段存在≠唯一,name/title 天然可重复,重复 key 在 v-for
 * 里比行号兜底更糟(渲染错乱+控制台刷警告)。
 */
function inferRowIdKey(data: RowData[]): string | undefined {
  for (const candidate of ROW_ID_KEY_CANDIDATES) {
    const values = data.map((row) => row[candidate]);
    if (
      values.length > 0 &&
      values.every((v) => v != null) &&
      new Set(values).size === values.length
    ) {
      return candidate;
    }
  }
  return undefined;
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

  // 探测兜底:显式 rowIdKey 缺失时才启用(显式优先,不给猜测让路);
  // computed 随 data 响应重算,流式增量行到达/字段后到时自动切键。
  // 流式初帧常只有前几行且 rowIdKey 字段尚未到达(数组增长型物料先挂载后补全),
  // 探测让这段窗口用真实唯一字段而非行号,行状态(展开态等)不漂移。
  const inferredRowIdKey = computed(() => {
    if (toValue(rowIdKey)) return undefined;
    return inferRowIdKey(toValue(data));
  });

  function getRowId(row: RowData, index: number): string {
    const key = toValue(rowIdKey) ?? inferredRowIdKey.value;
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
    const newSet = new Set(expandedRows.value);
    if (newSet.has(rowKey)) {
      newSet.delete(rowKey);
    } else {
      newSet.add(rowKey);
    }
    expandedRows.value = newSet;
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

  // Warn about missing rowIdKey (once per page load — see module flag above).
  // 探测命中则静默:数据里已有可用唯一字段,流式初帧 rowIdKey 未到的场景
  // 不该被误报;只有探测也失败(真落行号兜底)才是调用方需要修的数据。
  if (
    typeof window !== 'undefined' &&
    !warnedMissingRowIdKey &&
    !toValue(rowIdKey) &&
    toValue(data).length > 0 &&
    !inferredRowIdKey.value
  ) {
    warnedMissingRowIdKey = true;
    console.warn(
      '[DataTable] Missing `rowIdKey` prop and no unique candidate field ' +
        '(id/uuid/key/name/title/label) found in row data. Falling back to index-based row keys — ' +
        'row state (expansion etc.) may misattach across data updates. ' +
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
