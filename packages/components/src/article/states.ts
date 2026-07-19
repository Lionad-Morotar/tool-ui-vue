import { computed, ref, shallowRef, type ComputedRef, type Ref } from 'vue'
import type { ArticleProps } from './schema'

// Lazy-load marked to avoid vite-node SSR interop issues.
// marked's CJS/ESM named exports are not reliably resolved in vite-node,
// so we use dynamic import and store the instance in a shallowRef for
// reactive re-parsing when it becomes available.
const markedInstance = shallowRef<any>(null)

void import('marked').then(mod => {
  const m = (mod as any).marked || (mod as any).default || mod
  if (m && m.use) {
    m.use({ gfm: true, breaks: false })
    markedInstance.value = m
  } else if (m && m.parse) {
    markedInstance.value = m
  }
}).catch(() => {
  // marked unavailable in this environment
})

// ── DOMPurify initialization ──
// DOMPurify is an optional peerDependency; graceful degradation when unavailable.
// Wrapped in IIFE to avoid top-level await (unsupported in CJS build output).
let dompurifyInstance: any = null

void (async () => {
  try {
    const DOMPurify = (await import('dompurify')).default as any
    // Inject link safety and lazy-loading attributes after sanitization
    DOMPurify.addHook('afterSanitizeAttributes', function(node: Element) {
      if (node.tagName === 'A') {
        node.setAttribute('target', '_blank')
        node.setAttribute('rel', 'noopener noreferrer')
      }
      if (node.tagName === 'IMG') {
        node.setAttribute('loading', 'lazy')
      }
    })
    dompurifyInstance = DOMPurify
  } catch {
    // DOMPurify not installed — fallback to passthrough
  }
})()

const ALLOWED_TAGS = [
  'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'ul', 'ol', 'li', 'blockquote', 'pre', 'code',
  'strong', 'em', 'a', 'img', 'hr',
  'table', 'thead', 'tbody', 'tr', 'td', 'th', 'del', 's',
]

/**
 * 使用 DOMPurify 严格模式净化 HTML
 * 当 DOMPurify 不可用时直接返回原字符串（由调用方确保环境安全）
 */
function sanitizeStrict(html: string): string {
  if (dompurifyInstance) {
    return dompurifyInstance.sanitize(html, {
      ALLOWED_TAGS,
      ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class'],
      ALLOW_DATA_ATTR: false,
      FORCE_BODY: true,
    })
  }
  return html
}

/**
 * 解析 Markdown 或 HTML 内容为可直接渲染的 HTML 字符串
 * - type: 'md' 时通过 marked 解析
 * - type: 'html' 时直接使用原始内容
 * - marked 尚未就绪时降级为 <pre> 包裹的原始文本
 * - 解析异常时同样降级为 <pre> 包裹的原始文本
 */
function parseContent(type: 'md' | 'html', content: string, marked: any): string {
  if (type === 'html') {
    return content
  }
  if (!marked) {
    return `<pre>${content}</pre>`
  }
  try {
    return marked.parse(content, { async: false }) as string
  } catch (err) {
    if ((import.meta as any).env?.DEV) {
       
      console.error('[Article] Markdown parsing failed:', err)
    }
    return `<pre>${content}</pre>`
  }
}

/**
 * 将评分值转换为 5 颗星的不透明度数组
 * - undefined / NaN → null（不展示评分区域）
 * - 自动 clamp 到 [0, 5]
 * - 小数四舍五入到最近的 0.1
 */
function calculateStarOpacities(rate: number | undefined): number[] | null {
  if (rate === undefined || Number.isNaN(rate)) return null
  const clamped = Math.max(0, Math.min(5, rate))
  const rounded = Math.round(clamped * 10) / 10
  return Array.from({ length: 5 }, (_, i) => {
    const starValue = i + 1
    if (rounded >= starValue) return 1
    if (rounded <= starValue - 1) return 0
    return Math.round((rounded - (starValue - 1)) * 10) / 10
  })
}

export interface ArticleState {
  parsedContent: ComputedRef<string>
  starOpacities: ComputedRef<number[] | null>
  isExpanded: Ref<boolean>
  toggleExpanded: () => void
  contentStyle: ComputedRef<Record<string, string | undefined>>
  isEmptyContent: ComputedRef<boolean>
}

export function useArticle(props: ArticleProps): ArticleState {
  const parsedContent = computed(() => {
    const raw = parseContent(props.type, props.content, markedInstance.value)
    return sanitizeStrict(raw)
  })

  const starOpacities = computed(() => calculateStarOpacities(props.rate))

  const isExpanded = ref(false)

  function toggleExpanded() {
    isExpanded.value = !isExpanded.value
  }

  const contentStyle = computed(() => {
    if (!props.maxHeight || isExpanded.value) return {}
    return { maxHeight: props.maxHeight }
  })

  const isEmptyContent = computed(() => {
    return props.content === '' || /^\s*$/.test(props.content)
  })

  return {
    parsedContent,
    starOpacities,
    isExpanded,
    toggleExpanded,
    contentStyle,
    isEmptyContent,
  }
}
