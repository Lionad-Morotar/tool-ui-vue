import { h } from 'vue';
import type { VNode } from 'vue';
import ErrorBoundaryWrapper from './error-boundary-wrapper.vue';

export function withErrorBoundary<
  T extends (...args: any[]) => VNode | VNode[] | null | string,
>(renderer: T): T {
  return ((ctx: unknown) => {
    return h(
      ErrorBoundaryWrapper,
      null,
      {
        default: () => renderer(ctx),
      },
    );
  }) as T;
}
