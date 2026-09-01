import { describe, expect, test } from 'vitest';
import {
  formatDateValue,
  formatDateTimeValue,
  parseDateString,
  parseDateTimeString,
} from '../date-bridge';

describe('ui/date date-bridge', () => {
  describe('parseDateString', () => {
    test('parses a well-formed YYYY-MM-DD string', () => {
      const d = parseDateString('2026-09-02');
      expect(d).toBeDefined();
      expect(d!.year).toBe(2026);
      expect(d!.month).toBe(9);
      expect(d!.day).toBe(2);
    });

    test('pads survive round-trip via formatDateValue', () => {
      const d = parseDateString('2026-01-05');
      expect(formatDateValue(d!)).toBe('2026-01-05');
    });

    // 非法串归空:桥接层对消费方的脏数据(持久化/手填)保持静默降级而非抛错
    test.each(['', '2026/09/02', '2026-9-2', '2026-13-01', '2026-02-30', 'hello', '20260902'])(
      'returns undefined for invalid input %j',
      (input) => {
        expect(parseDateString(input)).toBeUndefined();
      }
    );
  });

  describe('parseDateTimeString', () => {
    test('parses naive YYYY-MM-DDTHH:mm', () => {
      const d = parseDateTimeString('2026-09-02T08:30');
      expect(d).toBeDefined();
      expect(d!.hour).toBe(8);
      expect(d!.minute).toBe(30);
      expect(formatDateTimeValue(d!)).toBe('2026-09-02T08:30');
    });

    test.each(['2026-09-02', '2026-09-02T25:00', '2026-09-02 08:30', 'T08:30'])(
      'returns undefined for invalid input %j',
      (input) => {
        expect(parseDateTimeString(input)).toBeUndefined();
      }
    );
  });

  describe('format', () => {
    // CalendarDateTime 的 toString 带秒段,表单契约只到分钟,格式化须截断
    test('formatDateTimeValue truncates seconds', () => {
      const d = parseDateTimeString('2026-09-02T08:30')!;
      const withSeconds = d.set({ second: 45 });
      expect(formatDateTimeValue(withSeconds)).toBe('2026-09-02T08:30');
    });
  });
});
