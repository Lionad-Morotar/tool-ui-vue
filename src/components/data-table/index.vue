<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { cn } from './_adapter';
import type { DataTableProps, Column, RowData } from './schema';

defineOptions({ name: 'cmpt-data-table', inheritAttrs: false })

const props = withDefaults(defineProps<DataTableProps & { css?: { root?: string } }>(), {
  layout: 'auto',
  css: () => ({ root: '' })
});

const emit = defineEmits<{
  sortChange: [sort: { by?: string; direction?: 'asc' | 'desc' }];
}>();

const currentSort = ref(props.sort || props.defaultSort);

watch(
  () => props.sort,
  (newSort) => {
    if (newSort !== undefined) {
      currentSort.value = newSort;
    }
  },
  { deep: true },
);

function isNumericFormat(format?: Column['format']): boolean {
  const kind = format?.kind;
  return kind === 'number' || kind === 'currency' || kind === 'percent' || kind === 'delta';
}

function getAlignmentClass(align?: 'left' | 'right' | 'center'): string {
  if (align === 'right') return 'text-right';
  if (align === 'center') return 'text-center';
  return 'text-left';
}

function getColumnAlign(column: Column, columnIndex: number, rowValue?: unknown): 'left' | 'right' | 'center' {
  if (column.align) return column.align;
  if (columnIndex === 0) return 'left';
  if (isNumericFormat(column.format)) return 'right';
  if (typeof rowValue === 'number') return 'right';
  return 'left';
}

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

const collator = computed(() => new Intl.Collator(props.locale || 'en-US', { numeric: true, sensitivity: 'base' }));

const sortedData = computed(() => {
  if (!currentSort.value?.by) return props.data;

  const { by, direction = 'asc' } = currentSort.value;
  const column = props.columns.find((c) => c.key === by);
  if (!column || column.sortable === false) return props.data;

  return [...props.data].sort((a, b) => {
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
  emit('sortChange', currentSort.value || {});
}

function getSortIcon(column: Column): string {
  if (currentSort.value?.by !== column.key) return '⇅';
  return currentSort.value.direction === 'asc' ? '↑' : '↓';
}

function getSortIconClass(column: Column): string {
  if (currentSort.value?.by !== column.key) return 'opacity-20';
  return '';
}

function getRelativeTime(date: Date, locale?: string): string {
  const now = new Date();
  const diffInSeconds = Math.trunc((date.getTime() - now.getTime()) / 1000);
  const absDiffInSeconds = Math.abs(diffInSeconds);

  if (absDiffInSeconds < 60) return 'just now';

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
  if (absDiffInSeconds < 3600) {
    return rtf.format(Math.trunc(diffInSeconds / 60), 'minute');
  }
  if (absDiffInSeconds < 86400) {
    return rtf.format(Math.trunc(diffInSeconds / 3600), 'hour');
  }
  if (absDiffInSeconds < 604800) {
    return rtf.format(Math.trunc(diffInSeconds / 86400), 'day');
  }
  return new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'short', day: 'numeric' }).format(date);
}

function resolveSafeNavigationHref(rawHref: string): string | null {
  if (!rawHref) return null;
  try {
    const url = new URL(rawHref, typeof window !== 'undefined' ? window.location.href : 'http://localhost');
    const allowedProtocols = ['http:', 'https:', 'mailto:', 'tel:'];
    if (!allowedProtocols.includes(url.protocol)) return null;
    return rawHref;
  } catch {
    if (rawHref.startsWith('/') || rawHref.startsWith('#') || rawHref.startsWith('./') || rawHref.startsWith('../')) {
      return rawHref;
    }
    return null;
  }
}

function formatCellValue(value: unknown, column: Column, locale?: string): string {
  if (value == null || value === '') return '\u2014'; // em dash

  const format = column.format;
  if (!format) {
    if (Array.isArray(value)) return value.join(', ');
    return String(value);
  }

  switch (format.kind) {
    case 'number': {
      const num = typeof value === 'number' ? value : parseFloat(String(value));
      if (Number.isNaN(num)) return String(value);
      const formatted = new Intl.NumberFormat(locale || 'en-US', {
        minimumFractionDigits: format.decimals ?? 0,
        maximumFractionDigits: format.decimals ?? 0,
        notation: format.compact ? 'compact' : 'standard',
      }).format(num);
      const display = format.showSign && num > 0 ? `+${formatted}` : formatted;
      return display + (format.unit ? ` ${format.unit}` : '');
    }
    case 'currency': {
      const num = typeof value === 'number' ? value : parseFloat(String(value));
      if (Number.isNaN(num)) return String(value);
      return new Intl.NumberFormat(locale || 'en-US', {
        style: 'currency',
        currency: format.currency,
        minimumFractionDigits: format.decimals ?? 2,
        maximumFractionDigits: format.decimals ?? 2,
      }).format(num);
    }
    case 'percent': {
      const num = typeof value === 'number' ? value : parseFloat(String(value));
      if (Number.isNaN(num)) return String(value);
      const numeric = format.basis === 'unit' ? num / 100 : num;
      return new Intl.NumberFormat(locale || 'en-US', {
        style: 'percent',
        minimumFractionDigits: format.decimals ?? 0,
        maximumFractionDigits: format.decimals ?? 0,
        signDisplay: format.showSign ? 'always' : 'auto',
      }).format(numeric);
    }
    case 'delta': {
      const num = typeof value === 'number' ? value : parseFloat(String(value));
      if (Number.isNaN(num)) return String(value);
      const decimals = format.decimals ?? 2;
      const absValue = Math.abs(num);
      const formatted = new Intl.NumberFormat(locale || 'en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      }).format(absValue);
      const showSign = format.showSign ?? true;
      if (num === 0) return formatted;
      const display = showSign ? (num < 0 ? `-${formatted}` : `+${formatted}`) : formatted;
      const arrow = num > 0 ? '\u2191' : '\u2193';
      return `${display} ${arrow}`;
    }
    case 'date': {
      const date = new Date(String(value));
      if (Number.isNaN(date.getTime())) return String(value);
      const dateFormat = format.dateFormat ?? 'short';
      if (dateFormat === 'relative') return getRelativeTime(date, locale);
      if (dateFormat === 'long') {
        return new Intl.DateTimeFormat(locale || 'en-US', { year: 'numeric', month: 'long', day: 'numeric' }).format(date);
      }
      return new Intl.DateTimeFormat(locale || 'en-US', { year: 'numeric', month: 'short', day: 'numeric' }).format(date);
    }
    case 'status': {
      const status = format.statusMap[String(value)];
      return status?.label || String(value);
    }
    case 'boolean': {
      const boolVal = value === true || value === 'true' || value === 1;
      return format.labels?.[boolVal ? 'true' : 'false'] || (boolVal ? 'Yes' : 'No');
    }
    case 'link': {
      return String(value);
    }
    case 'badge': {
      return String(value);
    }
    case 'array': {
      if (!Array.isArray(value)) return String(value);
      const max = format.maxVisible ?? value.length;
      const visible = value.slice(0, max);
      const remaining = value.length - max;
      return remaining > 0 ? `${visible.join(', ')} +${remaining}` : visible.join(', ');
    }
    default:
      return String(value);
  }
}

function getStatusTone(value: unknown, column: Column): string | null {
  const format = column.format;
  if (format?.kind !== 'status') return null;
  return format.statusMap[String(value)]?.tone || null;
}

function getBadgeTone(value: unknown, column: Column): string | null {
  const format = column.format;
  if (format?.kind !== 'badge') return null;
  return format.colorMap?.[String(value)] || null;
}

function getToneClasses(tone: string | null): string {
  if (!tone) return '';
  const toneMap: Record<string, string> = {
    success: 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-100',
    warning: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-100',
    danger: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-100',
    info: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-100',
    neutral: 'bg-muted text-muted-foreground',
  };
  return toneMap[tone] || '';
}

function getDeltaClasses(value: unknown, column: Column): string {
  const format = column.format;
  if (format?.kind !== 'delta') return '';
  const num = typeof value === 'number' ? value : parseFloat(String(value));
  if (Number.isNaN(num)) return '';
  const upIsPositive = format.upIsPositive ?? true;
  if (num === 0) return 'text-muted-foreground';
  const isGood = upIsPositive ? num > 0 : num < 0;
  const isBad = upIsPositive ? num < 0 : num > 0;
  if (isGood) return 'text-green-700 dark:text-green-500';
  if (isBad) return 'text-destructive';
  return '';
}

function getArrayItems(value: unknown, maxVisible?: number): { items: (string | number | boolean | null)[]; remaining: number } {
  const items: (string | number | boolean | null)[] = Array.isArray(value)
    ? value
    : typeof value === 'string'
      ? value.split(',').map((s) => s.trim())
      : [];
  const max = maxVisible ?? 3;
  const visible = items.slice(0, max);
  const remaining = items.length - max;
  return { items: visible, remaining: remaining > 0 ? remaining : 0 };
}

function getRowId(row: RowData, index: number): string {
  if (props.rowIdKey && row[props.rowIdKey] != null) {
    return String(row[props.rowIdKey]);
  }
  return `row-${index}`;
}

const sortAnnouncement = computed(() => {
  const col = props.columns.find((c) => c.key === currentSort.value?.by);
  const label = col?.label ?? currentSort.value?.by;
  return currentSort.value?.by && currentSort.value?.direction
    ? `Sorted by ${label}, ${currentSort.value.direction === 'asc' ? 'ascending' : 'descending'}`
    : '';
});

// Mobile description ID for accessibility
const mobileDescriptionId = computed(() => {
  return `${props.id || 'data-table'}-mobile-table-description`;
});

// Categorize columns for mobile view
interface CategorizedColumns {
  primary: Column[];
  secondary: Column[];
}

function categorizeColumns(columns: Column[]): CategorizedColumns {
  const primary: Column[] = [];
  const secondary: Column[] = [];

  let visibleColumnCount = 0;
  columns.forEach((col) => {
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
  if (props.layout === 'table') return 'block';
  if (props.layout === 'cards') return 'hidden';
  return 'hidden @md:block'; // auto mode
});

const cardsContainerClass = computed(() => {
  if (props.layout === 'cards') return '';
  if (props.layout === 'table') return 'hidden';
  return '@md:hidden'; // auto mode
});

// Warn about missing rowIdKey (once)
if (typeof window !== 'undefined' && !props.rowIdKey && props.data.length > 0) {
  console.warn(
    '[DataTable] Missing `rowIdKey` prop. Falling back to inferred/content-derived row keys. ' +
      "Strongly recommended: Pass a `rowIdKey` prop that points to a unique identifier in your row data (e.g., 'id', 'uuid', 'symbol').",
  );
}
</script>

<template>
  <div
    v-bind="$attrs"
    :class="cn('@container w-full min-w-80', css?.root)"
    :data-tool-ui-id="id"
    data-slot="data-table"
    :data-layout="layout"
  >
    <!-- Table View -->
    <div :class="tableContainerClass">
      <div class="relative">
        <div
          :class="cn(
            'relative w-full overflow-hidden overflow-y-auto rounded-lg border border-border bg-card',
            'touch-pan-x',
            maxHeight && 'max-h-[var(--max-height)]',
          )"
          :style="maxHeight ? { '--max-height': maxHeight } : {}"
        >
          <table class="w-full text-sm">
            <colgroup v-if="columns.length > 0">
              <col
                v-for="col in columns"
                :key="String(col.key)"
                :style="col.width ? { width: col.width } : {}"
              />
            </colgroup>

            <!-- Empty State -->
            <tbody v-if="data.length === 0">
              <tr class="h-24 bg-card text-center">
                <td
                  :colspan="columns.length"
                  role="status"
                  aria-live="polite"
                  class="text-muted-foreground"
                >
                  {{ emptyMessage || "No data available" }}
                </td>
              </tr>
            </tbody>

            <!-- Table Content -->
            <template v-else>
              <thead class="[&_tr]:border-b">
                <tr class="hover:bg-transparent">
                  <th
                    v-for="(column, columnIndex) in columns"
                    :key="column.key"
                    scope="col"
                    :class="cn(
                      'h-10 align-middle font-normal whitespace-nowrap text-muted-foreground',
                      getAlignmentClass(getColumnAlign(column, columnIndex)),
                      columnIndex === 0 && 'pl-1',
                      columnIndex === columns.length - 1 && 'pr-1',
                    )"
                    :style="column.width ? { width: column.width } : undefined"
                    :aria-sort="currentSort?.by === column.key
                      ? (currentSort?.direction === 'asc' ? 'ascending' : 'descending')
                      : undefined"
                  >
                    <button
                      type="button"
                      :disabled="column.sortable === false"
                      :class="cn(
                        'inline-flex items-center justify-center rounded-md text-sm font-medium whitespace-nowrap transition-colors',
                        'focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none',
                        'disabled:pointer-events-none disabled:opacity-50',
                        'h-8 px-3 hover:bg-accent hover:text-accent-foreground',
                        'w-fit min-w-10 gap-1',
                        getAlignmentClass(getColumnAlign(column, columnIndex)),
                        columnIndex === 0 && 'pl-4',
                        columnIndex === columns.length - 1 && 'pr-4',
                      )"
                      :aria-label="`Sort by ${column.label}` + (currentSort?.by === column.key && currentSort?.direction
                        ? ` (${currentSort.direction === 'asc' ? 'ascending' : 'descending'})`
                        : '')"
                      :aria-disabled="column.sortable === false || undefined"
                      @click="handleSort(column)"
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
                        :class="cn('min-w-4 shrink-0 text-center', getSortIconClass(column))"
                        aria-hidden
                      >
                        {{ getSortIcon(column) }}
                      </span>
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody class="[&_tr:last-child]:border-0">
                <tr
                  v-for="(row, index) in sortedData"
                  :key="getRowId(row, index)"
                  class="border-b transition-colors hover:bg-muted/50"
                >
                  <td
                    v-for="(column, columnIndex) in columns"
                    :key="column.key"
                    :class="cn(
                      'px-5 py-3 align-middle whitespace-nowrap',
                      getAlignmentClass(getColumnAlign(column, columnIndex, row[column.key])),
                      column.truncate && 'max-w-[200px] truncate',
                    )"
                  >
                    <!-- Delta -->
                    <template v-if="column.format?.kind === 'delta'">
                      <span :class="cn('tabular-nums', getDeltaClasses(row[column.key], column))">
                        {{ formatCellValue(row[column.key], column, locale) }}
                      </span>
                    </template>

                    <!-- Status Badge -->
                    <span
                      v-else-if="getStatusTone(row[column.key], column)"
                      :class="cn(
                        'inline-flex items-center rounded-full border border-border px-2.5 py-0.5 text-xs font-medium transition-colors focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-none',
                        getToneClasses(getStatusTone(row[column.key], column)),
                      )"
                    >
                      {{ formatCellValue(row[column.key], column, locale) }}
                    </span>

                    <!-- Badge -->
                    <span
                      v-else-if="getBadgeTone(row[column.key], column)"
                      :class="cn(
                        'inline-flex items-center rounded-full border border-border px-2.5 py-0.5 text-xs font-medium transition-colors focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-none',
                        getToneClasses(getBadgeTone(row[column.key], column)),
                      )"
                    >
                      {{ formatCellValue(row[column.key], column, locale) }}
                    </span>

                    <!-- Link -->
                    <template v-else-if="column.format?.kind === 'link'">
                      <a
                        :href="resolveSafeNavigationHref(column.format.hrefKey ? String(row[column.format.hrefKey]) : String(row[column.key])) || undefined"
                        :target="column.format.external ? '_blank' : undefined"
                        :rel="column.format.external ? 'noopener noreferrer' : undefined"
                        class="inline-block max-w-full break-words text-primary underline underline-offset-2 hover:opacity-90"
                        :aria-label="column.format.external ? `${formatCellValue(row[column.key], column, locale)} (opens in a new tab)` : undefined"
                        @click.stop
                      >
                        {{ formatCellValue(row[column.key], column, locale) }}
                        <span v-if="column.format.external" class="ml-1 inline-block" aria-label="Opens in new tab">↗</span>
                      </a>
                    </template>

                    <!-- Array -->
                    <template v-else-if="column.format?.kind === 'array'">
                      <span class="inline-flex flex-wrap items-center gap-1">
                        <span
                          v-for="(item, i) in getArrayItems(row[column.key], column.format.maxVisible).items"
                          :key="i"
                          class="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground"
                        >
                          {{ item === null ? "null" : String(item) }}
                        </span>
                        <span
                          v-if="getArrayItems(row[column.key], column.format.maxVisible).remaining > 0"
                          class="text-xs text-muted-foreground"
                        >
                          +{{ getArrayItems(row[column.key], column.format.maxVisible).remaining }} more
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
                        {{ formatCellValue(row[column.key], column, locale) }}
                      </span>
                    </template>

                    <!-- Default -->
                    <template v-else>
                      <span :class="cn(isNumericFormat(column.format) && 'tabular-nums')">
                        {{ formatCellValue(row[column.key], column, locale) }}
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
      :class="cardsContainerClass"
      role="list"
      :aria-label="`Data table (mobile card view)`"
      :aria-describedby="mobileDescriptionId"
    >
      <div :id="mobileDescriptionId" class="sr-only">
        Table data shown as expandable cards. Each card represents one row.
        <template v-if="columns.length > 0">
          Columns: {{ columns.map((c) => c.label).join(", ") }}.
        </template>
      </div>

      <div v-if="data.length === 0" class="py-8 text-center text-muted-foreground">
        {{ emptyMessage || "No data available" }}
      </div>

      <div
        v-else
        class="flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-xs"
      >
        <div
          v-for="(row, index) in sortedData"
          :key="getRowId(row, index)"
          :class="cn(
            'border-border',
            index > 0 && 'border-t'
          )"
          role="listitem"
        >
          <!-- Accordion Card -->
          <div
            v-if="categorizeColumns(columns).secondary.length > 0"
            class="group"
          >
            <button
              type="button"
              :class="cn(
                'w-full rounded-none px-4 py-3 text-left transition-colors',
                'hover:bg-accent/50 active:bg-accent/50',
                isRowExpanded(getRowId(row, index)) && 'bg-muted'
              )"
              :aria-expanded="isRowExpanded(getRowId(row, index))"
              :aria-controls="`row-details-${getDataTableRowDomId(getRowId(row, index))}`"
              @click="toggleRowExpansion(getRowId(row, index))"
            >
              <div class="flex min-w-0 flex-1 flex-col gap-2">
                <!-- Primary Column -->
                <div
                  v-if="categorizeColumns(columns).primary[0]"
                  class="truncate font-medium"
                >
                  {{ formatCellValue(row[categorizeColumns(columns).primary[0].key], categorizeColumns(columns).primary[0], locale) }}
                </div>

                <!-- Remaining Primary Columns Summary -->
                <div
                  v-if="categorizeColumns(columns).primary.slice(1).length > 0"
                  class="flex w-full flex-wrap gap-x-4 gap-y-0.5 text-muted-foreground"
                >
                  <span
                    v-for="col in categorizeColumns(columns).primary.slice(1)"
                    :key="col.key"
                    class="flex min-w-0 gap-1 font-normal"
                  >
                    <span class="sr-only">{{ col.label }}:</span>
                    <span aria-hidden="true">{{ col.label }}:</span>
                    <span class="truncate">
                      {{ formatCellValue(row[col.key], col, locale) }}
                    </span>
                  </span>
                </div>
              </div>

              <!-- Expand Icon -->
              <span
                :class="cn(
                  'float-right text-muted-foreground transition-transform',
                  isRowExpanded(getRowId(row, index)) && 'rotate-180'
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
              v-show="isRowExpanded(getRowId(row, index))"
              :id="`row-details-${getDataTableRowDomId(getRowId(row, index))}`"
              class="flex flex-col gap-4 px-4 pb-4"
              role="region"
            >
              <dl class="flex flex-col gap-2 pt-4">
                <div
                  v-for="col in categorizeColumns(columns).secondary"
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
                      <span :class="cn('tabular-nums', getDeltaClasses(row[col.key], col))">
                        {{ formatCellValue(row[col.key], col, locale) }}
                      </span>
                    </template>

                    <!-- Status Badge -->
                    <span
                      v-else-if="getStatusTone(row[col.key], col)"
                      :class="cn(
                        'inline-flex items-center rounded-full border border-border px-2.5 py-0.5 text-xs font-medium',
                        getToneClasses(getStatusTone(row[col.key], col)),
                      )"
                    >
                      {{ formatCellValue(row[col.key], col, locale) }}
                    </span>

                    <!-- Badge -->
                    <span
                      v-else-if="getBadgeTone(row[col.key], col)"
                      :class="cn(
                        'inline-flex items-center rounded-full border border-border px-2.5 py-0.5 text-xs font-medium',
                        getToneClasses(getBadgeTone(row[col.key], col)),
                      )"
                    >
                      {{ formatCellValue(row[col.key], col, locale) }}
                    </span>

                    <!-- Link -->
                    <template v-else-if="col.format?.kind === 'link'">
                      <a
                        :href="resolveSafeNavigationHref(col.format.hrefKey ? String(row[col.format.hrefKey]) : String(row[col.key])) || undefined"
                        :target="col.format.external ? '_blank' : undefined"
                        :rel="col.format.external ? 'noopener noreferrer' : undefined"
                        class="inline-block max-w-full break-words text-primary underline underline-offset-2 hover:opacity-90"
                        @click.stop
                      >
                        {{ formatCellValue(row[col.key], col, locale) }}
                        <span v-if="col.format.external" class="ml-1 inline-block">↗</span>
                      </a>
                    </template>

                    <!-- Array -->
                    <template v-else-if="col.format?.kind === 'array'">
                      <span class="inline-flex flex-wrap items-center gap-1">
                        <span
                          v-for="(item, i) in getArrayItems(row[col.key], col.format.maxVisible).items"
                          :key="i"
                          class="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground"
                        >
                          {{ item === null ? "null" : String(item) }}
                        </span>
                        <span
                          v-if="getArrayItems(row[col.key], col.format.maxVisible).remaining > 0"
                          class="text-xs text-muted-foreground"
                        >
                          +{{ getArrayItems(row[col.key], col.format.maxVisible).remaining }} more
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
                        {{ formatCellValue(row[col.key], col, locale) }}
                      </span>
                    </template>

                    <!-- Default -->
                    <template v-else>
                      <span :class="cn(isNumericFormat(col.format) && 'tabular-nums')">
                        {{ formatCellValue(row[col.key], col, locale) }}
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
              v-if="categorizeColumns(columns).primary[0]"
              class="font-medium"
            >
              {{ formatCellValue(row[categorizeColumns(columns).primary[0].key], categorizeColumns(columns).primary[0], locale) }}
            </div>

            <div
              v-for="col in categorizeColumns(columns).primary.slice(1)"
              :key="col.key"
              class="flex items-start justify-between gap-4"
            >
              <span class="text-muted-foreground">
                {{ col.label }}:
              </span>
              <span
                :class="cn(
                  'min-w-0 wrap-break-word',
                  col.align === 'right' && 'text-right',
                  col.align === 'center' && 'text-center',
                )"
              >
                {{ formatCellValue(row[col.key], col, locale) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Sort Announcement (screen reader only) -->
    <div
      v-if="sortAnnouncement"
      class="sr-only"
      aria-live="polite"
    >
      {{ sortAnnouncement }}
    </div>
  </div>
</template>
