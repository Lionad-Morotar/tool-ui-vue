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
 * 列出项目文档页面
 */
export function listDocumentationPages(): Array<{ title: string; path: string; description?: string }> {
  const pages: Array<{ title: string; path: string; description?: string }> = []

  // README.md
  const readmePath = join(PROJECT_ROOT, 'README.md')
  if (existsSync(readmePath)) {
    pages.push({ title: 'README', path: '/README.md', description: 'Project overview and quick start' })
  }

  // CLAUDE.md / AGENTS.md
  const claudePath = join(PROJECT_ROOT, 'CLAUDE.md')
  if (existsSync(claudePath)) {
    pages.push({ title: 'CLAUDE.md', path: '/CLAUDE.md', description: 'Project instructions for Claude' })
  }

  // .planning/codebase/*.md
  const planningDir = join(PROJECT_ROOT, '.planning', 'codebase')
  if (existsSync(planningDir)) {
    const files = readdirSync(planningDir)
    for (const file of files) {
      if (file.endsWith('.md')) {
        const name = file.replace(/\.md$/, '')
        pages.push({
          title: name,
          path: `/.planning/codebase/${file}`,
          description: `Planning document: ${name}`,
        })
      }
    }
  }

  return pages.sort((a, b) => a.path.localeCompare(b.path))
}

/**
 * 读取文档页面内容
 */
export function readDocumentationPage(path: string): string | null {
  const fullPath = join(PROJECT_ROOT, path.replace(/^\//, ''))
  if (!existsSync(fullPath)) return null
  return readTextFile(fullPath)
}
