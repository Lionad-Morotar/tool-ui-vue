import { computed, ref, watch, type ComputedRef, type Ref, type MaybeRefOrGetter } from 'vue';
import type { Column, RowData } from '../schema';

export interface SortState {
  by?: string;
  direction?: 'asc' | 'desc';
}

export interface UseSortOptions {
  sort: MaybeRefOrGetter<SortState | undefined>;
  defaultSort: MaybeRefOrGetter<SortState | undefined>;
  columns: MaybeRefOrGetter<Column[]>;
  data: MaybeRefOrGetter<RowData[]>;
  locale: MaybeRefOrGetter<string | undefined>;
  onSortChange: (sort: SortState) => void;
}

export interface SortReturns {
  currentSort: Ref<SortState | undefined>;
  sortedData: ComputedRef<RowData[]>;
  collator: ComputedRef<Intl.Collator>;
  handleSort: (column: Column) => void;
  getSortIcon: (column: Column) => string;
  getSortIconClass: (column: Column) => string;
  sortAnnouncement: ComputedRef<string>;
}

function toValue<T>(v: MaybeRefOrGetter<T>): T {
  if (typeof v === 'function') {
    return (v as () => T)();
  }
  // Handle ref by unwrapping .value
  if (v !== null && typeof v === 'object' && 'value' in v) {
    return (v as { value: T }).value;
  }
  return v as T;
}

export function useSort(options: UseSortOptions): SortReturns {
  const { sort, defaultSort, columns, data, locale, onSortChange } = options;

  const currentSort = ref<SortState | undefined>(toValue(sort) || toValue(defaultSort));

  watch(
    () => toValue(sort),
    (newSort) => {
      if (newSort !== undefined) {
        currentSort.value = newSort;
      }
    },
    { deep: true },
  );

  const collator = computed(() => new Intl.Collator(toValue(locale) || 'en-US', { numeric: true, sensitivity: 'base' }));

  function parseNumericLike(input: string): number | null {
    let s = input.replace(/[\u00A0\u202F\s]/g, '').trim();
    if (!s) return null;
    s = s.replace(/^\((.*)\)$/g, '-$1');
    s = s.replace(/[%$€£¥₩₹₽₺₪₫฿₦₴₡₲₵₸]/g, '');

    function hasGroupedThousands(value: string, sep: ',' | '.'): boolean {
      const unsigned = value.replace(/^[+-]/, '');
      const parts = unsigned.split(sep);
      if (parts.length < 2) return false;
      if (parts.some((part) => part.length === 0)) return false;
      if (!/^\d{1,3}$/.test(parts[0])) return false;
      if (parts[0] === '0') return false;
      return parts.slice(1).every((part) => /^\d{3}$/.test(part));
    }

    const lastComma = s.lastIndexOf(',');
    const lastDot = s.lastIndexOf('.');
    if (lastComma !== -1 && lastDot !== -1) {
      const decimalSep = lastComma > lastDot ? ',' : '.';
      const thousandSep = decimalSep === ',' ? '.' : ',';
      s = s.split(thousandSep).join('');
      s = s.replace(decimalSep, '.');
    } else if (lastComma !== -1) {
      if (hasGroupedThousands(s, ',')) {
        s = s.replace(/,/g, '');
      } else {
        const frac = s.length - lastComma - 1;
        if (frac >= 1 && frac <= 3) s = s.replace(/,/g, '.');
        else s = s.replace(/,/g, '');
      }
    } else if (lastDot !== -1) {
      if (hasGroupedThousands(s, '.')) {
        s = s.replace(/\./g, '');
      } else if ((s.match(/\./g) || []).length > 1) {
        s = s.replace(/\./g, '');
      }
    }

    const compactMatch = s.match(/^([+-]?\d+\.?\d*|\d*\.\d+)([KMBTPG]B?|B)$/i);
    if (compactMatch) {
      const baseNum = Number(compactMatch[1]);
      if (Number.isNaN(baseNum)) return null;
      const suffix = compactMatch[2].toUpperCase();
      if (suffix === 'B') {
        const isLikelyBytes = Number.isInteger(baseNum) && baseNum < 1024;
        return isLikelyBytes ? baseNum : baseNum * 1e9;
      }
      const multipliers: Record<string, number> = {
        K: 1e3, KB: 1024, M: 1e6, MB: 1024 ** 2,
        G: 1e9, GB: 1024 ** 3, T: 1e12, TB: 1024 ** 4,
        P: 1e15, PB: 1024 ** 5,
      };
      return baseNum * (multipliers[suffix] ?? 1);
    }

    if (/^[+-]?(?:\d+\.?\d*|\d*\.\d+)$/.test(s)) {
      const n = Number(s);
      return Number.isNaN(n) ? null : n;
    }
    return null;
  }

  const sortedData = computed(() => {
    const cols = toValue(columns);
    const rows = toValue(data);

    if (!currentSort.value?.by) return rows;

    const { by, direction = 'asc' } = currentSort.value;
    const column = cols.find((c) => c.key === by);
    if (!column || column.sortable === false) return rows;

    return [...rows].sort((a, b) => {
      const aVal = a[by];
      const bVal = b[by];

      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return 1;
      if (bVal == null) return -1;

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return direction === 'asc' ? aVal - bVal : bVal - aVal;
      }
      if (aVal instanceof Date && bVal instanceof Date) {
        const diff = aVal.getTime() - bVal.getTime();
        return direction === 'asc' ? diff : -diff;
      }
      if (typeof aVal === 'boolean' && typeof bVal === 'boolean') {
        const diff = aVal === bVal ? 0 : aVal ? 1 : -1;
        return direction === 'asc' ? diff : -diff;
      }
      if (Array.isArray(aVal) && Array.isArray(bVal)) {
        const diff = aVal.length - bVal.length;
        return direction === 'asc' ? diff : -diff;
      }
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        const numA = parseNumericLike(aVal);
        const numB = parseNumericLike(bVal);
        if (numA != null && numB != null) {
          const diff = numA - numB;
          return direction === 'asc' ? diff : -diff;
        }
        if (/^\d{4}-\d{2}-\d{2}/.test(aVal) && /^\d{4}-\d{2}-\d{2}/.test(bVal)) {
          const da = new Date(aVal).getTime();
          const db = new Date(bVal).getTime();
          const diff = da - db;
          return direction === 'asc' ? diff : -diff;
        }
      }

      const aStr = String(aVal);
      const bStr = String(bVal);
      const comparison = collator.value.compare(aStr, bStr);
      return direction === 'asc' ? comparison : -comparison;
    });
  });

  function handleSort(column: Column) {
    if (column.sortable === false) return;

    const currentBy = currentSort.value?.by;
    const currentDirection = currentSort.value?.direction;

    let newDirection: 'asc' | 'desc' | undefined;
    if (currentBy !== column.key) {
      newDirection = 'asc';
    } else if (currentDirection === 'asc') {
      newDirection = 'desc';
    } else if (currentDirection === 'desc') {
      newDirection = undefined;
    } else {
      newDirection = 'asc';
    }

    currentSort.value = newDirection ? { by: column.key, direction: newDirection } : undefined;
    onSortChange(currentSort.value || {});
  }

  function getSortIcon(column: Column): string {
    if (currentSort.value?.by !== column.key) return '⇅';
    return currentSort.value.direction === 'asc' ? '↑' : '↓';
  }

  function getSortIconClass(column: Column): string {
    if (currentSort.value?.by !== column.key) return 'opacity-20';
    return '';
  }

  const sortAnnouncement = computed(() => {
    const cols = toValue(columns);
    const col = cols.find((c) => c.key === currentSort.value?.by);
    const label = col?.label ?? currentSort.value?.by;
    return currentSort.value?.by && currentSort.value?.direction
      ? `Sorted by ${label}, ${currentSort.value.direction === 'asc' ? 'ascending' : 'descending'}`
      : '';
  });

  return {
    currentSort,
    sortedData,
    collator,
    handleSort,
    getSortIcon,
    getSortIconClass,
    sortAnnouncement,
  };
}
