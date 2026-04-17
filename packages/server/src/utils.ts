import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { PROJECT_ROOT } from './resolver.js'

/**
 * 安全读取文本文件，不存在时返回 null
 */
export function readTextFile(path: string): string | null {
  if (!existsSync(path)) return null
  try {
    return readFileSync(path, 'utf-8')
  } catch {
    return null
  }
}

/**
 * 从 schema.ts 内容中提取顶部的 JSDoc 描述（第一个 JSDoc 注释块）
 */
export function extractJSDocDescription(content: string): string {
  const match = content.match(/\/\*\*([\s\S]*?)\*\//)
  if (!match) return ''
  return match[1]
    .split('\n')
    .map((line) => line.replace(/^\s*\*\s?/, '').trim())
    .filter((line) => line.length > 0 && !line.startsWith('@'))
    .join(' ')
    .trim()
}

/**
 * 从测试文件内容中提取 createProps 调用的示例
 * 仅做静态正则提取，遇到复杂表达式则跳过
 */
export function extractExamplesFromTests(content: string): Array<{ description?: string; props: Record<string, unknown> }> {
  const examples: Array<{ description?: string; props: Record<string, unknown> }> = []

  // 匹配 createProps({ ... }) 或 createProps(overrides, { ... })
  const regex = /createProps\s*\(\s*(?:[\w$]+\s*,\s*)?\{([\s\S]*?)\}\s*\)/g
  let match: RegExpExecArray | null

  while ((match = regex.exec(content)) !== null) {
    const objText = `{${match[1]}}`
    // 尝试安全解析为 JSON（把 key 没引号的情况简单补一下）
    try {
      const jsonLike = objText
        .replace(/([\w$]+)\s*:/g, '"$1":')
        .replace(/'/g, '"')
      const props = JSON.parse(jsonLike) as Record<string, unknown>
      examples.push({ props })
    } catch {
      // 解析失败则跳过
    }
  }

  return examples
}

/**
 * 从文件内容中提取导出的名称列表（简单正则）
 */
export function extractExportedNames(content: string): string[] {
  const names = new Set<string>()

  // export const name = ... / export function name(...) / export class name ...
  const declRegex = /export\s+(?:const|let|var|function|class|interface|type)\s+([A-Za-z0-9_$]+)/g
  let m: RegExpExecArray | null
  while ((m = declRegex.exec(content)) !== null) {
    names.add(m[1])
  }

  // export { a, b as c }
  const blockRegex = /export\s*\{([^}]+)\}/g
  while ((m = blockRegex.exec(content)) !== null) {
    m[1].split(',').forEach((part) => {
      const clean = part.trim()
      const aliasMatch = clean.match(/^\s*(\S+)\s+as\s+\S+\s*$/)
      if (aliasMatch) {
        names.add(aliasMatch[1])
      } else if (clean) {
        names.add(clean)
      }
    })
  }

  return Array.from(names).sort()
}

/**
 * 从 schema.ts 内容中提取 interface Props 的字段名列表（简单正则）
 */
export function extractPropsFromInterface(content: string): string[] {
  // 匹配 export interface XxxProps { ... }
  const interfaceMatch = content.match(/export\s+interface\s+(\w+Props)\s*\{([\s\S]*?)\}/)
  if (!interfaceMatch) return []

  const body = interfaceMatch[2]
  const props: string[] = []
  const lines = body.split('\n')
  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('//') || trimmed.startsWith('*')) continue
    // 匹配 属性名?: 或 属性名: 开头的行
    const propMatch = trimmed.match(/^(\w+)\??\s*:/)
    if (propMatch) {
      props.push(propMatch[1])
    }
  }
  return props
}

/**
 * Histoire story 分类（与 histoire.config.ts 中的 storyGroups 对齐）
 */
const STORY_CATEGORIES: Record<string, string> = {
  landing: 'Getting Started',
  chart: 'Data Display', 'data-table': 'Data Display', 'stats-display': 'Data Display', 'weather-widget': 'Data Display',
  'code-block': 'Code & Terminal', 'code-diff': 'Code & Terminal', terminal: 'Code & Terminal',
  audio: 'Media', image: 'Media', 'image-gallery': 'Media', 'item-carousel': 'Media', video: 'Media',
  'approval-card': 'Social', citation: 'Social', 'instagram-post': 'Social', 'linkedin-post': 'Social',
  'link-preview': 'Social', 'message-draft': 'Social', 'x-post': 'Social',
  'option-list': 'Forms & Input', 'parameter-slider': 'Forms & Input', 'preferences-panel': 'Forms & Input',
  'geo-map': 'Workflow', plan: 'Workflow', 'progress-tracker': 'Workflow', 'question-flow': 'Workflow', 'order-summary': 'Workflow',
}

export interface DocPage {
  title: string
  path: string
  storyId: string
  category: string
}

/**
 * 将 story 文件路径转为 Histoire storyId
 * 例: src/stories/audio/index.story.vue → src-stories-audio-index-story-vue
 */
function toStoryId(filePath: string): string {
  return filePath.replace(/\.(vue|ts|js)$/, '-$1').replace(/[/.]/g, '-')
}

/**
 * 列出 Histoire 文档页面
 */
export function listDocumentationPages(): DocPage[] {
  const storiesDir = join(PROJECT_ROOT, 'src', 'stories')
  if (!existsSync(storiesDir)) return []

  const pages: DocPage[] = []
  const entries = readdirSync(storiesDir)

  for (const entry of entries) {
    if (entry.startsWith('_') || entry === 'tailwind-test' || entry === 'vue-shim.d.ts') continue
    const storyFile = join(storiesDir, entry, 'index.story.vue')
    if (!existsSync(storyFile)) continue

    const slug = entry
    pages.push({
      title: slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
      path: `/src/stories/${entry}/index.story.vue`,
      storyId: toStoryId(`src/stories/${entry}/index.story.vue`),
      category: STORY_CATEGORIES[slug] || 'Other',
    })
  }

  return pages.sort((a, b) => a.category.localeCompare(b.category) || a.title.localeCompare(b.title))
}

/**
 * 读取文档页面内容
 */
export function readDocumentationPage(path: string): string | null {
  const fullPath = join(PROJECT_ROOT, path.replace(/^\//, ''))
  if (!existsSync(fullPath)) return null
  return readTextFile(fullPath)
}
