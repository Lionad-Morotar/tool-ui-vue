import { cpSync, mkdirSync, existsSync, rmSync, readdirSync, statSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const MONOREPO_ROOT = join(__dirname, '..', '..', '..')
const DIST_ROOT = join(__dirname, '..', 'dist')

/**
 * MCP server 实际读取的组件文件清单
 * 来源: resolver.ts (resolveSchemaPath, resolveVuePath, resolveTestsPath,
 *       resolveStatesPath, resolveI18nPath, resolveBarrelPath)
 */
const COMPONENT_FILES = [
  'schema.ts',
  'index.vue',
  'index.ts',
  'states/index.ts',
  '__tests__/index.test.ts',
  'i18n/en.ts',
  'i18n/zh-CN.ts',
]

/**
 * 非组件目录/文件，不应扫描
 */
const EXCLUDED_COMPONENT_ENTRIES = new Set([
  'core',
  'shared',
  'i18n',
  'index.ts',
  'types.d.ts',
  'tokens.css.d.ts',
  'vue-shim.d.ts',
])

/**
 * Stories 中排除的目录
 */
const EXCLUDED_STORY_ENTRIES = new Set([
  '_shared',
  'tailwind-test',
])

/**
 * 精确复制单个文件，保留相对目录结构
 */
function copyFile(src, destRoot, label) {
  if (!existsSync(src)) return false

  const relativePath = src.replace(MONOREPO_ROOT + '/', '')
  const dest = join(destRoot, relativePath)

  mkdirSync(dirname(dest), { recursive: true })
  cpSync(src, dest)
  return true
}

// ── Phase 1: 按需复制组件源文件 ──
const componentsSrc = join(MONOREPO_ROOT, 'packages', 'components', 'src')
if (!existsSync(componentsSrc)) {
  console.error(`Source not found: ${componentsSrc}`)
  process.exit(1)
}

let componentFilesCopied = 0
let componentDirsScanned = 0

for (const entry of readdirSync(componentsSrc)) {
  if (EXCLUDED_COMPONENT_ENTRIES.has(entry)) continue

  const componentDir = join(componentsSrc, entry)
  const stat = statSync(componentDir)
  if (!stat.isDirectory()) continue

  componentDirsScanned++

  for (const file of COMPONENT_FILES) {
    const src = join(componentDir, file)
    if (copyFile(src, DIST_ROOT, 'component')) {
      componentFilesCopied++
    }
  }
}

console.log(`Copied ${componentFilesCopied} files from ${componentDirsScanned} components → ${join(DIST_ROOT, 'packages', 'components', 'src')}`)

// ── Phase 2: 按需复制 Story 文件 ──
const storiesSrc = join(MONOREPO_ROOT, 'src', 'stories')
let storyFilesCopied = 0

if (existsSync(storiesSrc)) {
  for (const entry of readdirSync(storiesSrc)) {
    if (EXCLUDED_STORY_ENTRIES.has(entry)) continue

    const storyDir = join(storiesSrc, entry)
    const stat = statSync(storyDir)
    if (!stat.isDirectory()) continue

    const storyFile = join(storyDir, 'index.story.vue')
    if (copyFile(storyFile, DIST_ROOT, 'story')) {
      storyFilesCopied++
    }
  }
}

console.log(`Copied ${storyFilesCopied} story files → ${join(DIST_ROOT, 'src', 'stories')}`)
console.log('Done.')
