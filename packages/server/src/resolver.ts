import { existsSync, readdirSync, statSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

/**
 * 从当前文件位置向上探测，找到 packages/components/src 目录
 */
function findComponentsSrcDir(startDir: string): string {
  let dir = startDir
  for (let i = 0; i < 6; i++) {
    const candidate = join(dir, 'packages', 'components', 'src')
    if (existsSync(candidate) && statSync(candidate).isDirectory()) {
      return candidate
    }
    const parent = dirname(dir)
    if (parent === dir) break
    dir = parent
  }
  throw new Error(`Could not find packages/components/src from ${startDir}`)
}

/**
 * 组件源码根目录
 */
export const COMPONENTS_SRC_DIR = findComponentsSrcDir(__dirname)

/**
 * 项目根目录（用于解析文档页面）
 */
export const PROJECT_ROOT = COMPONENTS_SRC_DIR.replace(/\/?packages\/components\/src$/, '')

/**
 * kebab-case 转 PascalCase
 */
export function kebabToPascal(str: string): string {
  return str
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')
}

/**
 * PascalCase 转 kebab-case
 */
export function pascalToKebab(str: string): string {
  return str
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
    .toLowerCase()
}

/**
 * 扫描 components/src 目录，返回所有 PascalCase 组件名列表
 * 过滤掉 core、shared、types.d.ts、vite-env.d.ts、vue-shim.d.ts、index.ts 等非组件项
 */
export function listComponentNames(): string[] {
  const entries = readdirSync(COMPONENTS_SRC_DIR)
  const names: string[] = []

  for (const entry of entries) {
    if (entry === 'core' || entry === 'shared' || entry === 'i18n' || entry === 'index.ts' || entry === 'types.d.ts' || entry === 'vite-env.d.ts' || entry === 'vue-shim.d.ts') {
      continue
    }
    const fullPath = join(COMPONENTS_SRC_DIR, entry)
    const stat = statSync(fullPath)
    if (stat.isDirectory()) {
      names.push(kebabToPascal(entry))
    }
  }

  return names.sort()
}

/**
 * 解析组件目录路径
 */
export function resolveComponentPath(name: string): string {
  const kebab = pascalToKebab(name)
  return join(COMPONENTS_SRC_DIR, kebab)
}

/**
 * 解析 schema.ts 路径
 */
export function resolveSchemaPath(name: string): string {
  return join(resolveComponentPath(name), 'schema.ts')
}

/**
 * 解析 index.vue 路径
 */
export function resolveVuePath(name: string): string {
  return join(resolveComponentPath(name), 'index.vue')
}

/**
 * 解析测试文件路径
 */
export function resolveTestsPath(name: string): string {
  return join(resolveComponentPath(name), '__tests__', 'index.test.ts')
}

/**
 * 解析 states 入口路径
 */
export function resolveStatesPath(name: string): string {
  return join(resolveComponentPath(name), 'states', 'index.ts')
}

/**
 * 解析 i18n 文件路径
 */
export function resolveI18nPath(name: string, locale: string): string {
  return join(resolveComponentPath(name), 'i18n', `${locale}.ts`)
}

/**
 * 解析组件 barrel index.ts 路径
 */
export function resolveBarrelPath(name: string): string {
  return join(resolveComponentPath(name), 'index.ts')
}
