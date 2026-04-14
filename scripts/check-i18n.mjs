#!/usr/bin/env node
/**
 * check-i18n.mjs — i18n 质量门禁脚本
 *
 * 1. Core Key 一致性校验（QUALITY-01）
 * 2. 组件级 Key 一致性校验（QUALITY-01b）
 * 3. 合并入口完整性检查（QUALITY-03）：确认所有组件 i18n 都被纳入 zhCNAll/enAll
 * 4. 组件 i18n 覆盖检查（QUALITY-02）
 *
 * Exit codes: 0 = OK, 1 = 存在不一致/遗漏
 */

import { readFileSync, readdirSync, existsSync, statSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')

const LOCALE_DIR = resolve(root, 'packages/core/src/i18n/locales')
const COMPONENTS_DIR = resolve(root, 'packages/components/src')
const COMPONENTS_I18N_INDEX = resolve(COMPONENTS_DIR, 'i18n/index.ts')

const LAYOUT_ONLY_WHITELIST = new Set([
  'image-gallery',
  'link-preview',
  'progress-tracker',
])

/**
 * 从 .ts 消息文件中提取顶层 key（命名空间）
 * 简单解析：查找 `keyName: {` 模式
 */
function getTopLevelKeys(filePath) {
  const content = readFileSync(filePath, 'utf-8')
  const keys = new Set()
  const regex = /^\s{2}(\w+):\s*{/gm
  let match
  while ((match = regex.exec(content)) !== null) {
    keys.add(match[1])
  }
  return keys
}

/**
 * 检查组件目录中的 .vue/.ts 文件是否包含 useI18n import
 */
function componentUsesI18n(componentDir) {
  try {
    const files = readdirSync(componentDir)
    for (const file of files) {
      const fullPath = resolve(componentDir, file)
      const s = statSync(fullPath)
      if (s.isDirectory()) {
        if (file === '__tests__' || file === 'node_modules') continue
        if (componentUsesI18n(fullPath)) return true
      }
      if (!file.endsWith('.vue') && !file.endsWith('.ts')) continue
      if (file.includes('.test.') || file.includes('.spec.')) continue
      const content = readFileSync(fullPath, 'utf-8')
      if (content.includes('useI18n') && /['"]@lionad\/vtu-core(\/i18n)?['"]/.test(content)) {
        return true
      }
    }
    return false
  } catch {
    return false
  }
}

/**
 * 检查组件是否有 UI 文本（排除纯布局组件）
 */
function hasUIText(componentDir) {
  try {
    const files = readdirSync(componentDir)
    for (const file of files) {
      const fullPath = resolve(componentDir, file)
      const s = statSync(fullPath)
      if (s.isDirectory()) {
        if (hasUIText(fullPath)) return true
      }
      if (!file.endsWith('.vue')) continue
      const content = readFileSync(fullPath, 'utf-8')
      if (/>[A-Z][a-z]+/.test(content) || />[a-z]{3,}</.test(content)) {
        return true
      }
    }
    return false
  } catch {
    return false
  }
}

/**
 * 获取所有拥有 i18n 目录的组件名
 */
function getComponentsWithI18n() {
  const dirs = readdirSync(COMPONENTS_DIR, { withFileTypes: true })
    .filter(d => d.isDirectory() && !d.name.startsWith('_') && d.name !== 'shared' && d.name !== 'i18n')
    .map(d => d.name)
  return dirs.filter(name => existsSync(resolve(COMPONENTS_DIR, name, 'i18n', 'zh-CN.ts')))
}

/**
 * 检查 components/src/i18n/index.ts 是否遗漏了组件 i18n 合并
 */
function checkMergeCoverage() {
  if (!existsSync(COMPONENTS_I18N_INDEX)) {
    return { missing: [], extra: [] }
  }
  const content = readFileSync(COMPONENTS_I18N_INDEX, 'utf-8')
  const imported = new Set()
  const regex = /from\s+['"]\.\.\/([^'"]+)\/i18n\/zh-CN['"]/g
  let match
  while ((match = regex.exec(content)) !== null) {
    imported.add(match[1])
  }
  const withI18n = new Set(getComponentsWithI18n())
  const missing = [...withI18n].filter(c => !imported.has(c))
  const extra = [...imported].filter(c => !withI18n.has(c))
  return { missing, extra }
}

let exitCode = 0

// --- 1. Core Key 一致性校验 ---
console.log('## 1. Core Key 一致性校验 (QUALITY-01)\n')

const zhCNPath = resolve(LOCALE_DIR, 'zh-CN.ts')
const enPath = resolve(LOCALE_DIR, 'en.ts')

if (!existsSync(zhCNPath) || !existsSync(enPath)) {
  console.error('❌ 消息文件缺失')
  if (!existsSync(zhCNPath)) console.error(`   缺失: ${zhCNPath}`)
  if (!existsSync(enPath)) console.error(`   缺失: ${enPath}`)
  process.exit(1)
}

const zhCNKeys = getTopLevelKeys(zhCNPath)
const enKeys = getTopLevelKeys(enPath)

const missingInEn = [...zhCNKeys].filter(k => !enKeys.has(k))
const extraInEn = [...enKeys].filter(k => !zhCNKeys.has(k))

if (missingInEn.length === 0 && extraInEn.length === 0) {
  console.log(`✅ Core key consistency: zh-CN (${zhCNKeys.size} namespaces) ↔ en (${enKeys.size} namespaces)`)
} else {
  exitCode = 1
  if (missingInEn.length > 0) {
    console.log(`❌ en.ts 缺少 ${missingInEn.length} 个命名空间: ${missingInEn.join(', ')}`)
  }
  if (extraInEn.length > 0) {
    console.log(`❌ en.ts 多余 ${extraInEn.length} 个命名空间: ${extraInEn.join(', ')}`)
  }
}

// --- 2. 组件级 Key 一致性校验 ---
console.log('\n## 2. 组件级 Key 一致性校验 (QUALITY-01b)\n')

const componentsWithI18n = getComponentsWithI18n()
let compMismatches = 0

for (const name of componentsWithI18n.sort()) {
  const zhPath = resolve(COMPONENTS_DIR, name, 'i18n/zh-CN.ts')
  const enPathComp = resolve(COMPONENTS_DIR, name, 'i18n/en.ts')
  const zhKeysComp = getTopLevelKeys(zhPath)
  const enKeysComp = getTopLevelKeys(enPathComp)

  const missing = [...zhKeysComp].filter(k => !enKeysComp.has(k))
  const extra = [...enKeysComp].filter(k => !zhKeysComp.has(k))

  if (missing.length || extra.length) {
    compMismatches++
    exitCode = 1
    console.log(`❌ ${name}`)
    if (missing.length) console.log(`   zh-CN 有但 en 缺: ${missing.join(', ')}`)
    if (extra.length) console.log(`   en 有但 zh-CN 缺: ${extra.join(', ')}`)
  }
}

if (compMismatches === 0) {
  console.log(`✅ 全部 ${componentsWithI18n.length} 个组件 i18n key 一致`)
} else {
  console.log(`\n❌ ${compMismatches} 个组件存在 key 不一致`)
}

// --- 3. 合并入口完整性检查 ---
console.log('\n## 3. 合并入口完整性检查 (QUALITY-03)\n')

const { missing: missingInMerge, extra: extraInMerge } = checkMergeCoverage()

if (missingInMerge.length === 0 && extraInMerge.length === 0) {
  console.log('✅ 所有组件 i18n 已正确纳入 zhCNAll / enAll')
} else {
  exitCode = 1
  if (missingInMerge.length > 0) {
    console.log(`❌ zhCNAll / enAll 遗漏了 ${missingInMerge.length} 个组件: ${missingInMerge.join(', ')}`)
  }
  if (extraInMerge.length > 0) {
    console.log(`❌ zhCNAll / enAll 包含不存在的组件: ${extraInMerge.join(', ')}`)
  }
}

// --- 4. 组件 i18n 覆盖检查 ---
console.log('\n## 4. 组件 i18n 覆盖检查 (QUALITY-02)\n')

const componentDirs = readdirSync(COMPONENTS_DIR, { withFileTypes: true })
  .filter(d => d.isDirectory() && !d.name.startsWith('_') && d.name !== 'shared' && d.name !== 'i18n')
  .map(d => d.name)
  .sort()

const componentsWithI18nUsage = []
const componentsWithoutI18n = []
const whitelistedComponents = []

for (const dirName of componentDirs) {
  const dirPath = resolve(COMPONENTS_DIR, dirName)
  const usesI18n = componentUsesI18n(dirPath)

  if (usesI18n) {
    componentsWithI18nUsage.push(dirName)
  } else if (LAYOUT_ONLY_WHITELIST.has(dirName)) {
    whitelistedComponents.push(dirName)
  } else {
    const hasUI = hasUIText(dirPath)
    if (hasUI) {
      componentsWithoutI18n.push(dirName)
    } else {
      whitelistedComponents.push(dirName)
    }
  }
}

if (componentsWithoutI18n.length === 0) {
  console.log(`✅ i18n coverage: ${componentsWithI18nUsage.length} components use useI18n()`)
} else {
  exitCode = 1
  console.log(`❌ ${componentsWithoutI18n.length} components missing i18n: ${componentsWithoutI18n.join(', ')}`)
}

if (whitelistedComponents.length > 0) {
  console.log(`ℹ️  ${whitelistedComponents.length} layout-only/whitelisted: ${whitelistedComponents.join(', ')}`)
}

// --- 总结 ---
console.log('\n## 总结\n')

if (exitCode === 0) {
  console.log('✅ 全部检查通过')
} else {
  console.log('❌ 存在不一致或缺失，请修复后重试')
}

process.exit(exitCode)
