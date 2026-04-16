import { h } from 'vue';
import type { VNode, Component } from 'vue';
import ErrorBoundary from './error-boundary.vue';

export function withErrorBoundary<
  T extends (...args: any[]) => VNode | VNode[] | null | string,
>(renderer: T): T {
  return ((ctx: unknown) => {
    return h(
      ErrorBoundary,
      null,
      {
        default: () => renderer(ctx),
      },
    );
  }) as T;
}

export function createRenderer(component: Component) {
  return ({ props }: { props: any }) => h(component, props);
}
