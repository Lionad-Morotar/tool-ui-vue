import { ref, type Ref } from 'vue';

// DOMPurify is an optional peerDependency. We define a minimal interface
// so the code compiles without the package installed.
interface DOMPurifyModule {
  default: { sanitize(dirty: string): string };
}

let dompurifyModule: DOMPurifyModule | null = null;
let dompurifyLoadPromise: Promise<DOMPurifyModule | null> | null = null;

/**
 * 尝试异步加载 DOMPurify 模块（只加载一次）
 * @returns DOMPurify 模块或 null（未安装时）
 */
export async function loadDOMPurify(): Promise<DOMPurifyModule | null> {
  if (dompurifyModule) return dompurifyModule;
  if (dompurifyLoadPromise) return dompurifyLoadPromise;

  dompurifyLoadPromise = (async () => {
    try {
      const mod = (await import('dompurify')) as DOMPurifyModule;
      dompurifyModule = mod;
      return mod;
    } catch {
      if ((import.meta as any).env?.DEV) {
        // eslint-disable-next-line no-console
        console.warn(
          '[vtu-components] DOMPurify is not installed. ' +
            'Install "dompurify" to enable HTML sanitization.',
        );
      }
      return null;
    }
  })();

  return dompurifyLoadPromise;
}

/**
 * 同步净化 HTML 字符串（仅在 DOMPurify 已加载时生效）
 * @param html 原始 HTML
 * @returns 净化后的 HTML（DOMPurify 未加载时返回原字符串）
 */
export function sanitizeHtmlSync(html: string): string {
  if (!dompurifyModule) return html;
  return dompurifyModule.default.sanitize(html);
}

/**
 * Vue composable：为组件提供可选的 HTML 净化能力
 *
 * @param enabled 是否启用净化
 * @returns { sanitizeReady, sanitizeHtml } 净化就绪状态和同步净化函数
 */
export function useSanitize(enabled: boolean): {
  sanitizeReady: Ref<boolean>;
  sanitizeHtml: (html: string) => string;
} {
  const sanitizeReady = ref(false);

  if (enabled) {
    loadDOMPurify().then((mod) => {
      if (mod) sanitizeReady.value = true;
    });
  }

  function sanitizeHtml(html: string): string {
    if (!enabled) return html;
    return sanitizeHtmlSync(html);
  }

  return { sanitizeReady, sanitizeHtml };
}
