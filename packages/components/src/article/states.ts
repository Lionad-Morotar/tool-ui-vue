import { computed, onMounted, ref, shallowRef, watch, type ComputedRef, type Ref } from 'vue'
import { useEventListener, useResizeObserver } from '@vueuse/core'
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
  showExpandButton: ComputedRef<boolean>
}

/**
 * 把 maxHeight 解析为 px。仅识别 px/vh/rem;其他单位(rem 根字号不可读、%等)
 * 返回 null,调用方回退「恒戴帽」旧行为。测量语义见 useArticle 内注释。
 */
function parseCapToPx(value: string): number | null {
  const v = value.trim()
  const px = /^([\d.]+)px$/.exec(v)
  if (px) return parseFloat(px[1]!)
  const vh = /^([\d.]+)vh$/.exec(v)
  if (vh) return (parseFloat(vh[1]!) / 100) * window.innerHeight
  const rem = /^([\d.]+)rem$/.exec(v)
  if (rem) {
    const root = parseFloat(getComputedStyle(document.documentElement).fontSize)
    return parseFloat(rem[1]!) * (Number.isFinite(root) ? root : 16)
  }
  return null
}

export function useArticle(props: ArticleProps, bodyEl: Ref<HTMLElement | null>): ArticleState {
  const parsedContent = computed(() => {
    const raw = parseContent(props.type, props.content, markedInstance.value)
    return sanitizeStrict(raw)
  })

  const starOpacities = computed(() => calculateStarOpacities(props.rate))

  const isExpanded = ref(false)

  function toggleExpanded() {
    isExpanded.value = !isExpanded.value
  }

  /**
   * 展开按钮与戴帽的真实溢出门控:只有内容自然高度超出上限才生效。
   * 宿主(如聊天)会给所有文章注入默认 maxHeight,若沿用「设了 maxHeight 即
   * 显示按钮」,短文章会挂一个点击无视觉变化的展开钮。测量取 scrollHeight
   * 对比上限解析 px:scrollHeight 不受裁切影响,戴帽与否都能量出自然高度,
   * 无「摘帽量不出、戴帽量不准」的循环依赖。初始 false(先不戴帽),onMounted
   * 与 flush:post 的 watch 都在绘制前完成首测,长内容无可见闪帧。
   */
  const needsExpansion = ref(false)

  function measureOverflow() {
    const el = bodyEl.value
    if (!el || !props.maxHeight) {
      needsExpansion.value = false
      return
    }
    const capPx = parseCapToPx(props.maxHeight)
    if (capPx === null) {
      needsExpansion.value = true
      return
    }
    needsExpansion.value = el.scrollHeight > capPx + 1
  }

  onMounted(measureOverflow)
  watch([parsedContent, () => props.maxHeight], measureOverflow, { flush: 'post' })
  // 未戴帽时内容生长带动元素高度;vh 上限随视口换算,两条路都要重测
  if (typeof ResizeObserver !== 'undefined') {
    useResizeObserver(bodyEl, measureOverflow)
  }
  if (typeof window !== 'undefined') {
    useEventListener(window, 'resize', measureOverflow)
  }

  const contentStyle = computed(() => {
    if (!props.maxHeight || isExpanded.value || !needsExpansion.value) return {}
    return { maxHeight: props.maxHeight }
  })

  const isEmptyContent = computed(() => {
    return props.content === '' || /^\s*$/.test(props.content)
  })

  // 展开后上限移除,needsExpansion 保持展开前的测量结果,须用 isExpanded 续命
  // 按钮,否则长文展开后丢失「折叠」出口
  const showExpandButton = computed(
    () => !!props.maxHeight && !isEmptyContent.value && (isExpanded.value || needsExpansion.value),
  )

  return {
    parsedContent,
    starOpacities,
    isExpanded,
    toggleExpanded,
    contentStyle,
    isEmptyContent,
    showExpandButton,
  }
}
