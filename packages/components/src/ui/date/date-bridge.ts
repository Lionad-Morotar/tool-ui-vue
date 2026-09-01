import { CalendarDate, CalendarDateTime, type DateValue } from '@internationalized/date';

/**
 * ISO 字符串 ↔ @internationalized/date DateValue 桥接。
 *
 * 原子对外契约是纯字符串('YYYY-MM-DD' / 'YYYY-MM-DDTHH:mm' / [start, end]),
 * reka 日历只认 DateValue 对象,所有转换收敛在此。消费方数据不可信(持久化、
 * 手填),非法输入一律归空(undefined)而不是抛错,由组件层落到「未选择」态。
 */

const DATE_RE = /^(\d{4})-(\d{2})-(\d{2})$/;
const DATETIME_RE = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/;

function pad2(n: number): string {
  return String(n).padStart(2, '0');
}

export function parseDateString(value: string): CalendarDate | undefined {
  const m = DATE_RE.exec(value);
  if (!m) return undefined;
  const [, y, mo, d] = m;
  // CalendarDate 构造对越界月/日不抛错而是进位归一(2026-13-01 → 2027-01-01),
  // 须 round-trip 比对甄别:归一后的字段与原值不等即非法输入
  const date = new CalendarDate(Number(y), Number(mo), Number(d));
  if (date.year !== Number(y) || date.month !== Number(mo) || date.day !== Number(d)) {
    return undefined;
  }
  return date;
}

export function parseDateTimeString(value: string): CalendarDateTime | undefined {
  const m = DATETIME_RE.exec(value);
  if (!m) return undefined;
  const [, y, mo, d, h, mi] = m;
  if (Number(h) > 23 || Number(mi) > 59) return undefined;
  const date = new CalendarDateTime(Number(y), Number(mo), Number(d), Number(h), Number(mi));
  if (date.year !== Number(y) || date.month !== Number(mo) || date.day !== Number(d)) {
    return undefined;
  }
  return date;
}

export function formatDateValue(date: DateValue): string {
  return `${date.year}-${pad2(date.month)}-${pad2(date.day)}`;
}

/** CalendarDateTime.toString() 带秒段,表单契约只到分钟,截断处理 */
export function formatDateTimeValue(date: DateValue): string {
  const time = date as CalendarDateTime;
  return `${formatDateValue(date)}T${pad2(time.hour ?? 0)}:${pad2(time.minute ?? 0)}`;
}
