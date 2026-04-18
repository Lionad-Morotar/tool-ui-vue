import { describe, it, expect, vi } from 'vitest';
import { z } from 'zod';
import { usePropsValidator } from '../usePropsValidator';

describe('usePropsValidator', () => {
  const TestSchema = z.object({
    id: z.string().min(1),
    name: z.string(),
    count: z.number().optional(),
  });

  it('does not warn when props are valid', () => {
    const callsBefore = vi.mocked(console.warn).mock.calls.length;

    usePropsValidator(
      TestSchema,
      { id: 'test-1', name: 'hello', count: 42 },
      'TestComponent',
    );

    const callsAfter = vi.mocked(console.warn).mock.calls.length;
    expect(callsAfter - callsBefore).toBe(0);
  });

  it('warns when a required field is missing', () => {
    const callsBefore = vi.mocked(console.warn).mock.calls.length;

    usePropsValidator(
      TestSchema,
      { id: 'test-1' },
      'TestComponent',
    );

    const callsAfter = vi.mocked(console.warn).mock.calls.length;
    expect(callsAfter - callsBefore).toBe(1);

    const lastCall = vi.mocked(console.warn).mock.calls[callsAfter - 1];
    expect(String(lastCall[0])).toContain('[TestComponent] Props validation failed');
    expect(String(lastCall[0])).toContain('name');
  });

  it('warns when a field has the wrong type', () => {
    const callsBefore = vi.mocked(console.warn).mock.calls.length;

    usePropsValidator(
      TestSchema,
      { id: 'test-1', name: 'hello', count: 'not-a-number' },
      'TestComponent',
    );

    const callsAfter = vi.mocked(console.warn).mock.calls.length;
    expect(callsAfter - callsBefore).toBe(1);

    const lastCall = vi.mocked(console.warn).mock.calls[callsAfter - 1];
    expect(String(lastCall[0])).toContain('[TestComponent] Props validation failed');
    expect(String(lastCall[0])).toContain('count');
  });

  it('warns with formatted path for nested schema errors', () => {
    const NestedSchema = z.object({
      user: z.object({
        email: z.string().email(),
      }),
    });

    const callsBefore = vi.mocked(console.warn).mock.calls.length;

    usePropsValidator(
      NestedSchema,
      { user: { email: 'not-an-email' } },
      'NestedComponent',
    );

    const callsAfter = vi.mocked(console.warn).mock.calls.length;
    expect(callsAfter - callsBefore).toBe(1);

    const lastCall = vi.mocked(console.warn).mock.calls[callsAfter - 1];
    expect(String(lastCall[0])).toContain('[NestedComponent] Props validation failed');
    expect(String(lastCall[0])).toContain('user.email');
  });

  it('skips validation when import.meta.env.DEV is false', () => {
    vi.stubEnv('DEV', false);

    const callsBefore = vi.mocked(console.warn).mock.calls.length;

    usePropsValidator(
      TestSchema,
      { id: 'test-1' },
      'TestComponent',
    );

    const callsAfter = vi.mocked(console.warn).mock.calls.length;
    expect(callsAfter - callsBefore).toBe(0);

    vi.unstubAllEnvs();
  });

  it('skips validation when import.meta.env is undefined', () => {
    vi.stubEnv('DEV', undefined);

    const callsBefore = vi.mocked(console.warn).mock.calls.length;

    usePropsValidator(
      TestSchema,
      { id: 'test-1' },
      'TestComponent',
    );

    const callsAfter = vi.mocked(console.warn).mock.calls.length;
    expect(callsAfter - callsBefore).toBe(0);

    vi.unstubAllEnvs();
  });

  it('does not warn when optional fields are omitted', () => {
    const callsBefore = vi.mocked(console.warn).mock.calls.length;

    usePropsValidator(
      TestSchema,
      { id: 'test-1', name: 'hello' },
      'TestComponent',
    );

    const callsAfter = vi.mocked(console.warn).mock.calls.length;
    expect(callsAfter - callsBefore).toBe(0);
  });

  it('warns when id field is empty string', () => {
    const callsBefore = vi.mocked(console.warn).mock.calls.length;

    usePropsValidator(
      TestSchema,
      { id: '', name: 'hello' },
      'TestComponent',
    );

    const callsAfter = vi.mocked(console.warn).mock.calls.length;
    expect(callsAfter - callsBefore).toBe(1);

    const lastCall = vi.mocked(console.warn).mock.calls[callsAfter - 1];
    expect(String(lastCall[0])).toContain('[TestComponent] Props validation failed');
  });
});
