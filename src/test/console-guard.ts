import { beforeEach, afterEach, vi } from 'vitest';

export const ALLOWED_PATTERNS: RegExp[] = [
  // Shiki highlighter singleton warning - expected in tests with multiple CodeBlock instances
  /\[Shiki\] \d+ instances have been created/,
  // Vue injection warning - expected when testing useImageGallery outside provider
  /\[Vue warn\]: injection "Symbol\(ImageGalleryContext\)" not found/,
  // QuestionFlow union type props - Vue validates all union props at runtime
  /\[Vue warn\]: Missing required prop: "(step|options|steps|choice|title)"/,
  // i18n missing key warning - expected when testing fallback behavior
  /\[vtu:i18n\] Missing key:/,
  // No LocaleProvider configured - expected when testing fallback mode
  /\[vtu:i18n\] No LocaleProvider configured/,
  // Image component alt prop - expected when testing i18n fallback behavior
  /\[Vue warn\]: Missing required prop: "alt"/,
  // Props validation warnings - expected when testing usePropsValidator
  /\[\w+\] Props validation failed/,
];

let consoleErrorSpy: ReturnType<typeof vi.spyOn>;
let consoleWarnSpy: ReturnType<typeof vi.spyOn>;

export function toMessage(args: unknown[]): string {
  return args
    .map((arg) => {
      if (arg instanceof Error) {
        return `${arg.name}: ${arg.message}`;
      }
      if (typeof arg === 'string') {
        return arg;
      }
      try {
        return JSON.stringify(arg);
      } catch {
        return String(arg);
      }
    })
    .join(' ');
}

export function isAllowedMessage(message: string): boolean {
  return ALLOWED_PATTERNS.some((pattern) => pattern.test(message));
}

export function setupConsoleGuard(): void {
  beforeEach(() => {
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    const errorMessages = consoleErrorSpy.mock.calls.map((call: unknown[]) =>
      toMessage(call),
    );
    const warnMessages = consoleWarnSpy.mock.calls.map((call: unknown[]) =>
      toMessage(call),
    );
    const unexpectedMessages = [...errorMessages, ...warnMessages].filter(
      (message) => !isAllowedMessage(message),
    );

    consoleErrorSpy.mockRestore();
    consoleWarnSpy.mockRestore();

    if (unexpectedMessages.length > 0) {
      throw new Error(
        [
          'Unexpected console warnings/errors detected during test:',
          ...unexpectedMessages.map((message) => `- ${message}`),
        ].join('\n'),
      );
    }
  });
}
