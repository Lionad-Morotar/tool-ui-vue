import type { Column } from '../schema';

export interface FormatOptions {
  locale?: string;
}

export interface FormatReturns {
  formatCellValue: (value: unknown, column: Column) => string;
  getRelativeTime: (date: Date) => string;
  resolveSafeNavigationHref: (rawHref: string) => string | null;
  isNumericFormat: (format?: Column['format']) => boolean;
  getAlignmentClass: (align?: 'left' | 'right' | 'center') => string;
  getColumnAlign: (column: Column, columnIndex: number, rowValue?: unknown) => 'left' | 'right' | 'center';
  getStatusTone: (value: unknown, column: Column) => string | null;
  getBadgeTone: (value: unknown, column: Column) => string | null;
  getToneClasses: (tone: string | null) => string;
  getDeltaClasses: (value: unknown, column: Column) => string;
  getArrayItems: (value: unknown, maxVisible?: number) => { items: (string | number | boolean | null)[]; remaining: number };
}

export function useFormat(options: FormatOptions): FormatReturns {
  const { locale = 'en-US' } = options;

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

  function getRelativeTime(date: Date): string {
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

  function formatCellValue(value: unknown, column: Column): string {
    if (value == null || value === '') return '\u2014';

    const format = column.format;
    if (!format) {
      if (Array.isArray(value)) return value.join(', ');
      return String(value);
    }

    switch (format.kind) {
      case 'number': {
        const num = typeof value === 'number' ? value : parseFloat(String(value));
        if (Number.isNaN(num)) return String(value);
        const formatted = new Intl.NumberFormat(locale, {
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
        return new Intl.NumberFormat(locale, {
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
        return new Intl.NumberFormat(locale, {
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
        const formatted = new Intl.NumberFormat(locale, {
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
        if (dateFormat === 'relative') return getRelativeTime(date);
        if (dateFormat === 'long') {
          return new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'long', day: 'numeric' }).format(date);
        }
        return new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'short', day: 'numeric' }).format(date);
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

  return {
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
  };
}
