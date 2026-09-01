// StatsDisplay component state layer - Headless architecture
// All business logic lives here, index.vue is UI-only

import { computed } from 'vue';
import type { StatsDisplayProps, StatDiff } from '../schema';
import type { ComputedRef } from 'vue';

export type UseStatsDisplayOptions = StatsDisplayProps;

export interface StatsDisplayState {
  locale: ComputedRef<string>;
  hasHeader: ComputedRef<boolean>;
  isSingle: ComputedRef<boolean>;
  gridCols: ComputedRef<1 | 2 | 3>;
  gridColsClass: ComputedRef<string>;
  valueSizeClass: ComputedRef<string>;
  deltaColorClasses: (diff: StatDiff) => string;
  deltaBgClasses: (diff: StatDiff) => string;
  deltaDisplay: (diff: StatDiff) => string;
  deltaArrow: (diff: StatDiff) => string | null;
  formatCompactNumberParts: (value: number, decimals: number) => Intl.NumberFormatPart[];
  formatCompactFullNumber: (value: number) => string;
  formatCurrency: (value: number, currency: string, decimals: number) => string;
  formatCurrencySpoken: (value: number, currency: string, decimals: number) => string;
  formatNumber: (value: number, decimals: number) => string;
  formatPercent: (value: number, decimals: number, basis: 'fraction' | 'unit') => string;
  formatBoolean: (value: unknown, labels: { true: string; false: string }) => string;
}

function getDeltaMeta(diff: StatDiff) {
  const { value, upIsPositive = true } = diff;
  const isPositive = value > 0;
  const isNegative = value < 0;

  const isGood = upIsPositive ? isPositive : isNegative;
  const isBad = upIsPositive ? isNegative : isPositive;

  return { isPositive, isNegative, isGood, isBad };
}

export function useStatsDisplay(options: UseStatsDisplayOptions): StatsDisplayState {
  // 经 options 动态读取而非解构：解构会在 setup 同步作用域固化首帧值；
  // 返回值保留 computed 引用（外层 reactive() 解包后消费），.value 快照会丢响应式
  const locale = computed(() => {
    return options.locale ?? (typeof navigator !== 'undefined' ? navigator.language : 'en');
  });

  const hasHeader = computed(() => Boolean(options.title || options.description));
  const isSingle = computed(() => options.stats.length === 1);

  // 列数按项数收敛而非容器宽度自适应：auto-fit 会在 3/5 项时留下半行孤儿单元格，
  // 固定列数保证最后一行恰好填满（4 项取 2×2 而非 3+1）
  const gridCols = computed<1 | 2 | 3>(() => {
    const n = options.stats.length;
    if (n <= 1) return 1;
    if (n <= 3) return n as 2 | 3;
    if (n === 4) return 2;
    return 3;
  });

  // 类名必须是完整字面量，Tailwind 扫描 states 源文件后才会产出对应容器查询规则
  const gridColsClass = computed(() => {
    switch (gridCols.value) {
      case 1:
        return '@[440px]:grid-cols-1';
      case 2:
        return '@[440px]:grid-cols-2';
      default:
        return '@[440px]:grid-cols-3';
    }
  });

  // 三列时单元格约 190px 宽，text-3xl 的长数值会溢出，降一档保住单行
  const valueSizeClass = computed(() => {
    if (isSingle.value) return 'text-5xl';
    return gridCols.value === 3 ? 'text-2xl' : 'text-3xl';
  });

  function deltaColorClasses(diff: StatDiff): string {
    const { isGood, isBad } = getDeltaMeta(diff);

    return isGood
      ? 'text-green-600 dark:text-green-400'
      : isBad
        ? 'text-red-600 dark:text-red-500'
        : 'text-muted-foreground';
  }

  function deltaBgClasses(diff: StatDiff): string {
    const { isGood, isBad } = getDeltaMeta(diff);

    return isGood
      ? 'bg-green-500/10 dark:bg-green-600/15'
      : isBad
        ? 'bg-red-500/10 dark:bg-red-500/15'
        : 'bg-muted';
  }

  function deltaDisplay(diff: StatDiff): string {
    const { value, decimals = 1 } = diff;
    const formatted = Math.abs(value).toFixed(decimals);
    const sign = value < 0 ? '−' : '+';
    return `${sign}${formatted}%`;
  }

  function deltaArrow(diff: StatDiff): string | null {
    if (diff.upIsPositive !== false) return null;
    const { isGood } = getDeltaMeta(diff);
    return isGood ? '↓' : '↑';
  }

  function formatCompactNumberParts(value: number, decimals: number) {
    return new Intl.NumberFormat(locale.value, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
      notation: 'compact',
    }).formatToParts(value);
  }

  function formatCompactFullNumber(value: number) {
    return new Intl.NumberFormat(locale.value).format(value);
  }

  function formatCurrency(value: number, currency: string, decimals: number) {
    return new Intl.NumberFormat(locale.value, {
      style: 'currency',
      currency,
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(value);
  }

  function formatCurrencySpoken(value: number, currency: string, decimals: number) {
    return new Intl.NumberFormat(locale.value, {
      style: 'currency',
      currency,
      currencyDisplay: 'name',
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(value);
  }

  function formatNumber(value: number, decimals: number) {
    return new Intl.NumberFormat(locale.value, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(value);
  }

  function formatPercent(value: number, decimals: number, basis: 'fraction' | 'unit') {
    const numeric = basis === 'fraction' ? value * 100 : value;
    return numeric.toFixed(decimals);
  }

  function formatBoolean(value: unknown, labels: { true: string; false: string }) {
    const isTruthy =
      typeof value === 'boolean'
        ? value
        : typeof value === 'number'
          ? value !== 0
          : Boolean(value);
    return isTruthy ? labels.true : labels.false;
  }

  return {
    locale,
    hasHeader,
    isSingle,
    gridCols,
    gridColsClass,
    valueSizeClass,
    deltaColorClasses,
    deltaBgClasses,
    deltaDisplay,
    deltaArrow,
    formatCompactNumberParts,
    formatCompactFullNumber,
    formatCurrency,
    formatCurrencySpoken,
    formatNumber,
    formatPercent,
    formatBoolean,
  };
}
